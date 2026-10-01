from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os

from ..simulation.farm_state import FarmManager, CROP_PROFILES
from ..simulation.climate_engine import ClimateEngine
from ..simulation.satellite_engine import SatelliteEngine
from ..simulation.consequence_engine import ConsequenceEngine
from ..simulation.whatif_simulator import WhatIfSimulator
from ..simulation.scalability_manager import ScalabilityManager
from ..ml.prediction_engine import PredictionEngine
from ..ml.optimization_engine import OptimizationLabEngine
from .database import init_db, log_action, export_zones_csv

app = FastAPI(
    title="SMART FARM SIM API",
    description="Climate-Aware Virtual Smart Farm Simulator for Edge AI Optimization",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
init_db()

# Global Simulator State Singleton
class SimulatorContext:
    def __init__(self):
        self.reset(size=100, crop="Rice", climate="Normal")
        self.prediction_engine = PredictionEngine()
        self.scalability_manager = ScalabilityManager()
        self.actions_count = 0
        self.events_endured = 0

    def reset(self, size: int = 100, crop: str = "Rice", climate: str = "Normal", seed: int = 42):
        self.farm = FarmManager(size=size, crop=crop, climate_preset=climate, seed=seed)
        self.climate = ClimateEngine(preset=climate, seed=seed)
        self.satellite = SatelliteEngine(cadence_days=7, seed=seed)
        self.consequence = ConsequenceEngine()
        self.active_events: List[Dict[str, Any]] = []
        self.connectivity = "GOOD"
        self.compute_mode = "ADAPTIVE"
        self.active_model = "STANDARD"
        self.compute_budget = 100.0
        self.compute_used = 18.5
        self.actions_count = 0
        self.events_endured = 0

ctx = SimulatorContext()

# Request Models
class CreateFarmRequest(BaseModel):
    crop: str = "Rice"
    size: int = 100
    climate: str = "Normal"
    connectivity: str = "GOOD"
    model: str = "STANDARD"
    seed: int = 42

class StepRequest(BaseModel):
    days: int = 1

class ActionRequest(BaseModel):
    zone_id: Optional[int] = None
    action_type: str # 'IRRIGATE', 'DELAY', 'MONITOR', 'INSPECT', 'APPLY_PROTECTION', 'IGNORE'
    note: Optional[str] = ""

class EventRequest(BaseModel):
    event_type: str # 'HEATWAVE', 'DROUGHT', 'HEAVY_RAIN', 'HUMIDITY_SPIKE', 'DELAYED_RAIN', 'EXTREME_TEMPERATURE'
    severity: str = "MODERATE"
    duration: int = 4

class WhatIfRequest(BaseModel):
    temp_delta: float = 0.0
    rain_delta: float = 0.0
    humidity_delta: float = 0.0
    irrigation_applied: bool = False
    days_ahead: int = 7

class OptimizeRequest(BaseModel):
    quantize: bool = True
    prune: bool = True
    reduce_features: bool = True
    compress: bool = True

class ConnectivityRequest(BaseModel):
    status: str # 'GOOD', 'WEAK', 'INTERMITTENT', 'OFFLINE'

@app.get("/api/health")
def get_health():
    return {
        "status": "healthy",
        "service": "SMART FARM SIM Engine",
        "current_day": ctx.farm.current_day,
        "farm_size": ctx.farm.farm_size,
        "crop": ctx.farm.crop_type,
        "connectivity": ctx.connectivity
    }

@app.post("/api/farm/create")
def create_farm(req: CreateFarmRequest):
    ctx.reset(size=req.size, crop=req.crop, climate=req.climate, seed=req.seed)
    ctx.connectivity = req.connectivity
    ctx.active_model = req.model
    return {
        "message": f"Virtual farm created successfully with {req.size} zones.",
        "summary": ctx.farm.get_summary()
    }

@app.get("/api/farm/state")
def get_farm_state():
    summary = ctx.farm.get_summary()
    lod_cells = ctx.farm.get_lod_representation(max_cells=100)
    
    # Compute active events
    for ev in ctx.active_events:
        ev["days_remaining"] = max(0, ev["start_day"] + ev["duration"] - ctx.farm.current_day)
    ctx.active_events = [ev for ev in ctx.active_events if ev["days_remaining"] > 0]
    
    # Check satellite update trigger
    if ctx.satellite.should_update(ctx.farm.current_day):
        ctx.satellite.trigger_pass(ctx.farm.current_day, ctx.farm.zones, cloud_cover=ctx.climate.current_weather["cloud_cover"])

    return {
        "summary": summary,
        "weather": ctx.climate.current_weather,
        "connectivity": ctx.connectivity,
        "active_model": ctx.active_model,
        "compute": {
            "budget_units": ctx.compute_budget,
            "used_units": round(ctx.compute_used, 1),
            "queue_length": 0 if ctx.active_model != "STANDARD" or ctx.farm.farm_size <= 1000 else int((ctx.farm.farm_size - 1000) * 0.05),
            "active_mode": ctx.compute_mode,
            "latency_ms": 14.8 if ctx.active_model == "STANDARD" else (1.4 if ctx.active_model == "EDGE_OPTIMIZED" else 4.6),
            "offline_mode_active": (ctx.connectivity == "OFFLINE"),
            "local_model_running": True
        },
        "active_events": ctx.active_events,
        "cells": lod_cells
    }

@app.get("/api/farm/zone/{zone_id}")
def get_zone_detail(zone_id: int):
    zone = next((z for z in ctx.farm.zones if z.zone_id == zone_id), None)
    if not zone:
        raise HTTPException(status_code=404, detail="Zone not found")
    
    explanation = ctx.prediction_engine.standard_model.explain_prediction(zone, ctx.climate.current_weather)
    return {
        "zone": zone.to_dict(),
        "explanation": explanation
    }

@app.post("/api/farm/step")
def step_simulation(req: StepRequest):
    days_to_advance = max(1, req.days)
    for _ in range(days_to_advance):
        if ctx.farm.current_day >= ctx.farm.season_length:
            break
        ctx.farm.current_day += 1
        weather = ctx.climate.step_climate(ctx.farm.current_day, ctx.active_events)
        ctx.consequence.step_zones_day(ctx.farm.zones, weather, ctx.farm.current_day)
        
        # Satellite check
        if ctx.satellite.should_update(ctx.farm.current_day):
            ctx.satellite.trigger_pass(ctx.farm.current_day, ctx.farm.zones, cloud_cover=weather["cloud_cover"])

    return {
        "current_day": ctx.farm.current_day,
        "weather": ctx.climate.current_weather,
        "summary": ctx.farm.get_summary()
    }

@app.post("/api/farm/decision")
def apply_decision(req: ActionRequest):
    ctx.actions_count += 1
    if req.zone_id is not None:
        zone = next((z for z in ctx.farm.zones if z.zone_id == req.zone_id), None)
        if not zone:
            raise HTTPException(status_code=404, detail="Zone not found")
        result = ctx.consequence.execute_action(zone, req.action_type, ctx.farm.current_day, req.note or "")
        log_action(1, ctx.farm.current_day, zone.zone_id, req.action_type, result["result"])
        return {"success": True, "result": result, "zone": zone.to_dict()}
    else:
        # Batch action on all zones (or all stressed zones)
        results = []
        for z in ctx.farm.zones:
            res = ctx.consequence.execute_action(z, req.action_type, ctx.farm.current_day, req.note or "")
            results.append(res)
        return {
            "success": True,
            "action": req.action_type,
            "zones_affected": len(results),
            "summary": ctx.farm.get_summary()
        }

@app.post("/api/farm/event")
def trigger_event(req: EventRequest):
    ctx.events_endured += 1
    event_id = f"EVT-{ctx.farm.current_day}-{req.event_type}"
    
    # Event parameter mapping
    params = {"temp_delta": 0.0, "rain_delta": 0.0, "moisture_delta": 0.0, "humidity_delta": 0.0}
    if req.event_type == "HEATWAVE":
        params["temp_delta"] = 7.5
        params["moisture_delta"] = -15.0
        params["humidity_delta"] = -18.0
    elif req.event_type == "DROUGHT":
        params["temp_delta"] = 4.0
        params["rain_delta"] = -30.0
        params["moisture_delta"] = -25.0
    elif req.event_type == "HEAVY_RAIN":
        params["rain_delta"] = 45.0
        params["moisture_delta"] = 35.0
        params["humidity_delta"] = 25.0
    elif req.event_type == "HUMIDITY_SPIKE":
        params["humidity_delta"] = 30.0
        params["temp_delta"] = 1.0

    ev = {
        "event_id": event_id,
        "event_type": req.event_type,
        "name": req.event_type.replace("_", " ").title(),
        "severity": req.severity,
        "duration": req.duration,
        "days_remaining": req.duration,
        "start_day": ctx.farm.current_day,
        "affected_zones": len(ctx.farm.zones),
        "parameters": params,
        "active": True
    }
    ctx.active_events.append(ev)
    
    # Immediately trigger climate shift
    ctx.climate.step_climate(ctx.farm.current_day, ctx.active_events)
    return {"message": f"Climate event {ev['name']} initiated.", "event": ev}

@app.post("/api/farm/scale")
def scale_farm(size: int = 1000):
    ctx.reset(size=size, crop=ctx.farm.crop_type, climate=ctx.farm.climate_preset)
    return {
        "message": f"Farm scaled to {size} virtual agricultural zones.",
        "summary": ctx.farm.get_summary()
    }

@app.post("/api/farm/connectivity")
def set_connectivity(req: ConnectivityRequest):
    ctx.connectivity = req.status
    if req.status == "OFFLINE":
        # Force fallback to local edge-optimized model
        ctx.active_model = "EDGE_OPTIMIZED"
    return {
        "connectivity": ctx.connectivity,
        "active_model": ctx.active_model,
        "cloud_available": (req.status in ["GOOD", "WEAK"]),
        "local_model_active": True
    }

@app.get("/api/weather")
def get_weather():
    return ctx.climate.current_weather

@app.get("/api/forecast")
def get_forecast(days: int = 7):
    return ctx.climate.generate_forecast(ctx.farm.current_day, days_ahead=days)

@app.get("/api/satellite")
def get_satellite_history():
    return {
        "observations": ctx.satellite.observations_history,
        "cadence_days": ctx.satellite.cadence_days,
        "latest_pass": ctx.satellite.observations_history[-1] if ctx.satellite.observations_history else None
    }

@app.post("/api/satellite/trigger")
def trigger_satellite():
    pass_info = ctx.satellite.trigger_pass(ctx.farm.current_day, ctx.farm.zones, cloud_cover=ctx.climate.current_weather["cloud_cover"])
    return {"message": "Sentinel-2 observation pass executed.", "pass": pass_info}

@app.get("/api/satellite/compare")
def compare_satellite(day_a: int, day_b: int):
    return ctx.satellite.get_comparison(day_a, day_b)

@app.get("/api/ai/profiles")
def get_ai_profiles():
    return ctx.prediction_engine.get_profiles()

@app.post("/api/ai/predict")
def run_ai_prediction(model_type: Optional[str] = None):
    chosen_model = model_type or ctx.active_model
    if ctx.connectivity == "OFFLINE":
        chosen_model = "EDGE_OPTIMIZED"
    
    result = ctx.prediction_engine.run_prediction_batch(ctx.farm.zones, ctx.climate.current_weather, chosen_model)
    return result

@app.post("/api/ai/optimize")
def run_optimization_lab(req: OptimizeRequest):
    result = OptimizationLabEngine.apply_optimizations(req.quantize, req.prune, req.reduce_features, req.compress)
    return result

@app.post("/api/sim/whatif")
def simulate_whatif(req: WhatIfRequest):
    result = WhatIfSimulator.simulate(
        ctx.farm.zones,
        ctx.climate.current_weather,
        temp_delta=req.temp_delta,
        rain_delta=req.rain_delta,
        humidity_delta=req.humidity_delta,
        irrigation_applied=req.irrigation_applied,
        days_ahead=req.days_ahead
    )
    return result

@app.get("/api/scalability/benchmark")
def run_scalability_benchmark(size: int = 1000, model: str = "STANDARD"):
    res = ctx.scalability_manager.run_benchmark(zone_count=size, model_type=model)
    return res

@app.get("/api/scalability/curve")
def get_scalability_curve():
    return ctx.scalability_manager.get_scalability_curve()

@app.get("/api/research/ablation")
def get_ablation_results():
    return ctx.prediction_engine.run_ablation_study()

@app.get("/api/report")
def get_season_report():
    summary = ctx.farm.get_summary()
    dist = summary["health_distribution"]
    total = max(ctx.farm.farm_size, 1)
    
    healthy_score = min(100, int((dist["Healthy"] / total) * 100))
    water_eff_score = max(40, min(100, int(100 - (ctx.consequence.total_water_used_mm / 10.0))))
    climate_resp_score = max(50, min(100, int(75 + ctx.events_endured * 5)))
    ai_util_score = min(100, int(ctx.actions_count * 8 + 40))
    comp_score = 95 if ctx.active_model == "EDGE_OPTIMIZED" else 80

    avg_score = (healthy_score + water_eff_score + climate_resp_score + ai_util_score + comp_score) // 5
    rating = "S" if avg_score >= 90 else ("A" if avg_score >= 80 else ("B" if avg_score >= 70 else ("C" if avg_score >= 60 else "D")))

    return {
        "season_completed": ctx.farm.current_day >= ctx.farm.season_length,
        "total_days": ctx.farm.current_day,
        "farm_size": ctx.farm.farm_size,
        "crop_type": ctx.farm.crop_type,
        "final_health_distribution": dist,
        "average_final_yield_pct": summary["avg_yield_estimate"],
        "total_water_consumed_mm": round(ctx.consequence.total_water_used_mm, 1),
        "climate_events_endured": ctx.events_endured,
        "player_actions_executed": ctx.actions_count,
        "game_scores": {
            "farm_health": healthy_score,
            "water_efficiency": water_eff_score,
            "climate_response": climate_resp_score,
            "ai_utilization": ai_util_score,
            "computational_efficiency": comp_score,
            "overall_rating": rating
        }
    }

@app.get("/api/export/{fmt}")
def export_data(fmt: str):
    zones_data = [z.to_dict() for z in ctx.farm.zones]
    if fmt.lower() == "csv":
        csv_str = export_zones_csv(zones_data)
        return Response(content=csv_str, media_type="text/csv", headers={"Content-Disposition": f"attachment; filename=smart_farm_export_day{ctx.farm.current_day}.csv"})
    else:
        return {"day": ctx.farm.current_day, "summary": ctx.farm.get_summary(), "zones": zones_data}

# Mount static frontend build if present
frontend_dist = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "frontend", "dist")
if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="static")
