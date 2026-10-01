import unittest
import numpy as np
from backend.simulation.farm_state import FarmManager, ZoneData
from backend.simulation.climate_engine import ClimateEngine
from backend.simulation.satellite_engine import SatelliteEngine
from backend.simulation.consequence_engine import ConsequenceEngine
from backend.simulation.whatif_simulator import WhatIfSimulator
from backend.simulation.scalability_manager import ScalabilityManager
from backend.ml.prediction_engine import PredictionEngine
from backend.ml.optimization_engine import OptimizationLabEngine

def test_farm_initialization():
    fm = FarmManager(size=100, crop="Rice")
    assert len(fm.zones) == 100
    summary = fm.get_summary()
    assert summary["farm_size"] == 100
    assert summary["current_day"] == 1
    assert "Healthy" in summary["health_distribution"]

def test_climate_engine_and_forecast():
    ce = ClimateEngine(preset="Normal")
    w = ce.current_weather
    assert 12.0 <= w["temperature"] <= 50.0
    assert 0.0 <= w["humidity"] <= 100.0
    forecast = ce.generate_forecast(current_day=1, days_ahead=7)
    assert len(forecast) == 7
    assert "condition" in forecast[0]
    assert "heat_stress" in forecast[0]

def test_satellite_engine():
    se = SatelliteEngine(cadence_days=7)
    assert len(se.observations_history) >= 1
    first_pass = se.observations_history[0]
    assert "avg_ndvi" in first_pass
    assert first_pass["avg_ndvi"] > 0.0

def test_consequence_irrigation():
    fm = FarmManager(size=10, crop="Rice")
    ce = ConsequenceEngine()
    zone = fm.zones[0]
    zone.soil_moisture = 30.0
    zone.crop_stress = 60.0
    res = ce.execute_action(zone, "IRRIGATE", current_day=1)
    assert zone.soil_moisture > 30.0
    assert zone.crop_stress < 60.0
    assert res["action"] == "IRRIGATE"

def test_prediction_engine():
    pe = PredictionEngine()
    fm = FarmManager(size=10, crop="Rice")
    ce = ClimateEngine()
    result = pe.run_prediction_batch(fm.zones, ce.current_weather, model_type="STANDARD")
    assert result["zones_processed"] == 10
    assert result["inference_latency_ms"] >= 0.0
    assert "Healthy" in result["health_distribution"]

def test_edge_optimization():
    opt = OptimizationLabEngine.apply_optimizations(quantize=True, prune=True, reduce_features=True, compress=True)
    assert opt["optimized"]["model_size_kb"] < opt["baseline"]["model_size_kb"]
    assert opt["tradeoff_analysis"]["speedup_factor"] > 1.0

def test_whatif_simulator():
    fm = FarmManager(size=20, crop="Rice")
    ce = ClimateEngine()
    res = WhatIfSimulator.simulate(fm.zones, ce.current_weather, temp_delta=5.0, rain_delta=-20.0, humidity_delta=-15.0, days_ahead=7)
    assert "baseline" in res
    assert "projected" in res
    assert res["days_ahead"] == 7

def test_scalability_sweep():
    curve = ScalabilityManager.get_scalability_curve()
    assert len(curve) == 4 # 100, 1000, 10000, 100000
    assert curve[0]["farm_size"] == 100
    assert curve[3]["farm_size"] == 100000
    assert curve[3]["speedup"] > 1.0

if __name__ == "__main__":
    test_farm_initialization()
    test_climate_engine_and_forecast()
    test_satellite_engine()
    test_consequence_irrigation()
    test_prediction_engine()
    test_edge_optimization()
    test_whatif_simulator()
    test_scalability_sweep()
    print("All backend tests PASSED!")
