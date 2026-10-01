import numpy as np
import math
from typing import List, Dict, Any, Optional

CROP_PROFILES = {
    "Rice": {
        "water_need_base": 12.0,
        "ideal_temp_min": 22.0,
        "ideal_temp_max": 32.0,
        "drought_sensitivity": 0.85,
        "humidity_tolerance": 0.90,
        "disease_susceptibility": 0.45,
        "stages": ["Germination", "Tillering", "Panicle Initiation", "Flowering", "Maturity"]
    },
    "Maize": {
        "water_need_base": 7.5,
        "ideal_temp_min": 18.0,
        "ideal_temp_max": 30.0,
        "drought_sensitivity": 0.65,
        "humidity_tolerance": 0.70,
        "disease_susceptibility": 0.35,
        "stages": ["Emergence", "Vegetative", "Tasseling", "Silking", "Maturity"]
    },
    "Cotton": {
        "water_need_base": 8.0,
        "ideal_temp_min": 21.0,
        "ideal_temp_max": 35.0,
        "drought_sensitivity": 0.50,
        "humidity_tolerance": 0.55,
        "disease_susceptibility": 0.40,
        "stages": ["Seedling", "Squaring", "Flowering", "Boll Development", "Open Boll"]
    },
    "Chilli": {
        "water_need_base": 6.5,
        "ideal_temp_min": 20.0,
        "ideal_temp_max": 30.0,
        "drought_sensitivity": 0.70,
        "humidity_tolerance": 0.60,
        "disease_susceptibility": 0.55,
        "stages": ["Vegetative", "Budding", "Flowering", "Fruit Setting", "Ripening"]
    },
    "Wheat": {
        "water_need_base": 6.0,
        "ideal_temp_min": 15.0,
        "ideal_temp_max": 25.0,
        "drought_sensitivity": 0.60,
        "humidity_tolerance": 0.50,
        "disease_susceptibility": 0.30,
        "stages": ["Crown Root", "Tillering", "Jointing", "Heading", "Ripening"]
    }
}

class ZoneData:
    def __init__(self, zone_id: int, row: int, col: int, crop_type: str = "Rice", seed: int = 42):
        self.zone_id = zone_id
        self.row = row
        self.col = col
        self.crop_type = crop_type
        
        # Spatial variation using deterministic sinusoidal microclimate
        rng = np.random.RandomState(seed + zone_id)
        spatial_noise = math.sin(row * 0.4) * math.cos(col * 0.4) * 5.0
        
        self.soil_moisture = float(np.clip(55.0 + spatial_noise + rng.normal(0, 3.0), 20.0, 90.0))
        self.temperature = float(28.0 + rng.normal(0, 1.2))
        self.humidity = float(np.clip(68.0 + rng.normal(0, 4.0), 30.0, 95.0))
        self.rainfall = 0.0
        self.wind = float(12.0 + rng.normal(0, 2.5))
        self.forecast_rainfall = float(np.clip(rng.exponential(4.0), 0.0, 35.0))
        self.rain_probability = float(np.clip(self.forecast_rainfall * 3.5 + rng.normal(0, 5), 5.0, 95.0))
        
        # Multi-spectral remote-sensing indices
        self.NDVI = float(np.clip(0.68 + rng.normal(0, 0.05), 0.20, 0.88))
        self.NDMI = float(np.clip(0.42 + (self.soil_moisture - 50) * 0.006 + rng.normal(0, 0.03), -0.1, 0.75))
        self.LST = float(self.temperature - (self.soil_moisture * 0.08) + rng.normal(0, 0.5))
        
        self.growth_stage_index = 0
        self.growth_stage_progress = 5.0
        self.crop_stress = float(np.clip((100 - self.soil_moisture) * 0.35 + rng.normal(0, 3), 5.0, 40.0))
        self.disease_probability = float(np.clip((self.humidity - 60) * 0.4 + rng.normal(0, 3), 5.0, 35.0))
        
        profile = CROP_PROFILES.get(crop_type, CROP_PROFILES["Rice"])
        self.water_requirement = float(profile["water_need_base"] * (1.0 + (self.crop_stress / 100.0) * 0.4))
        self.climate_risk = float(np.clip(self.crop_stress * 0.6 + (self.temperature > 35) * 20, 5.0, 60.0))
        self.yield_estimate = float(np.clip(100.0 - (self.crop_stress * 0.4), 40.0, 105.0))
        self.AI_confidence = float(np.clip(94.0 - rng.exponential(3.0), 65.0, 99.0))
        
        self.crop_health = self._derive_health()
        self.last_satellite_update = 1
        self.last_action = None
        self.action_history = []
        self.ai_recommendation = self._generate_recommendation()

    def _derive_health(self) -> str:
        if self.crop_stress >= 75.0 or self.disease_probability >= 75.0:
            return "Critical"
        elif self.crop_stress >= 50.0 or self.disease_probability >= 50.0:
            return "Stressed"
        elif self.crop_stress >= 28.0 or self.disease_probability >= 30.0:
            return "Moderate"
        else:
            return "Healthy"

    def _generate_recommendation(self) -> Dict[str, Any]:
        factors = []
        if self.rain_probability > 65.0 and self.forecast_rainfall > 12.0:
            factors.append({"name": "Forecast Rainfall", "impact": -0.8, "description": f"{self.forecast_rainfall:.1f}mm expected within 24h"})
            if self.soil_moisture > 35.0:
                return {
                    "recommendation": "DELAY IRRIGATION",
                    "rationale": f"High probability ({self.rain_probability:.0f}%) of natural precipitation ({self.forecast_rainfall:.1f}mm) will replenish root zone. Irrigating now risks saturation and resource waste.",
                    "confidence": round(self.AI_confidence, 1),
                    "factors": factors
                }
        
        if self.soil_moisture < 35.0 or (self.temperature > 34.0 and self.soil_moisture < 45.0):
            factors.append({"name": "Soil Moisture Deficit", "impact": 0.9, "description": f"Moisture is {self.soil_moisture:.1f}%, below root buffer threshold"})
            factors.append({"name": "Evapotranspiration Demand", "impact": 0.7, "description": f"Temp {self.temperature:.1f}°C driving water loss"})
            return {
                "recommendation": "IRRIGATE ZONE",
                "rationale": f"Soil moisture deficit is critical ({self.soil_moisture:.1f}%). High evapotranspiration ({self.temperature:.1f}°C) is causing physiological stress ({self.crop_stress:.0f}%).",
                "confidence": round(self.AI_confidence, 1),
                "factors": factors
            }
        
        if self.disease_probability > 45.0 or (self.humidity > 82.0 and self.temperature > 28.0):
            factors.append({"name": "High Humidity Microclimate", "impact": 0.85, "description": f"Relative humidity {self.humidity:.1f}% facilitates fungal sporulation"})
            return {
                "recommendation": "INSPECT FOR PATHOGENS",
                "rationale": f"Elevated humidity ({self.humidity:.1f}%) and warm canopy create high fungal risk ({self.disease_probability:.0f}%). Physical/drone scouting recommended.",
                "confidence": round(self.AI_confidence, 1),
                "factors": factors
            }
            
        factors.append({"name": "Optimum Soil Moisture", "impact": 0.1, "description": f"Soil moisture at balanced {self.soil_moisture:.1f}%"})
        factors.append({"name": "Vegetation Vigor", "impact": 0.2, "description": f"NDVI at healthy {self.NDVI:.2f}"})
        return {
            "recommendation": "MONITOR ROUTINELY",
            "rationale": "Crop parameters remain within physiological tolerance limits. Maintain sensor monitoring schedule.",
            "confidence": round(self.AI_confidence, 1),
            "factors": factors
        }

    def to_dict(self) -> Dict[str, Any]:
        profile = CROP_PROFILES.get(self.crop_type, CROP_PROFILES["Rice"])
        stage_name = profile["stages"][min(self.growth_stage_index, len(profile["stages"]) - 1)]
        return {
            "zone_id": self.zone_id,
            "row": self.row,
            "col": self.col,
            "crop_type": self.crop_type,
            "growth_stage": stage_name,
            "growth_stage_progress": round(self.growth_stage_progress, 1),
            "soil_moisture": round(self.soil_moisture, 1),
            "temperature": round(self.temperature, 1),
            "humidity": round(self.humidity, 1),
            "rainfall": round(self.rainfall, 1),
            "wind": round(self.wind, 1),
            "forecast_rainfall": round(self.forecast_rainfall, 1),
            "rain_probability": round(self.rain_probability, 1),
            "NDVI": round(self.NDVI, 3),
            "NDMI": round(self.NDMI, 3),
            "LST": round(self.LST, 1),
            "crop_health": self.crop_health,
            "crop_stress": round(self.crop_stress, 1),
            "disease_probability": round(self.disease_probability, 1),
            "water_requirement": round(self.water_requirement, 1),
            "climate_risk": round(self.climate_risk, 1),
            "yield_estimate": round(self.yield_estimate, 1),
            "AI_confidence": round(self.AI_confidence, 1),
            "last_satellite_update": self.last_satellite_update,
            "last_action": self.last_action,
            "action_history": self.action_history,
            "ai_recommendation": self.ai_recommendation
        }


class FarmManager:
    """Manages the full virtual farm grid, vectorization for 100 to 100,000 zones, and state updates."""
    def __init__(self, size: int = 100, crop: str = "Rice", climate_preset: str = "Normal", seed: int = 42):
        self.farm_size = size
        self.crop_type = crop
        self.climate_preset = climate_preset
        self.seed = seed
        self.current_day = 1
        self.season_length = 120
        self.connectivity = "GOOD"
        self.compute_mode = "ADAPTIVE"
        self.active_events: List[Dict[str, Any]] = []
        self.zones: List[ZoneData] = []
        
        # Grid dimensions
        self.grid_cols = int(math.isqrt(size))
        if self.grid_cols * self.grid_cols < size:
            self.grid_cols = int(math.ceil(math.sqrt(size)))
        self.grid_rows = int(math.ceil(size / self.grid_cols))
        
        self._initialize_zones()

    def _initialize_zones(self):
        self.zones = []
        # Generate zones with spatial coordinates
        for idx in range(self.farm_size):
            r = idx // self.grid_cols
            c = idx % self.grid_cols
            self.zones.append(ZoneData(zone_id=idx + 1, row=r, col=c, crop_type=self.crop_type, seed=self.seed))

    def get_summary(self) -> Dict[str, Any]:
        health_counts = {"Healthy": 0, "Moderate": 0, "Stressed": 0, "Critical": 0}
        total_moisture = 0.0
        total_stress = 0.0
        total_ndvi = 0.0
        total_yield = 0.0
        
        for z in self.zones:
            health_counts[z.crop_health] += 1
            total_moisture += z.soil_moisture
            total_stress += z.crop_stress
            total_ndvi += z.NDVI
            total_yield += z.yield_estimate
            
        n = max(len(self.zones), 1)
        return {
            "farm_size": self.farm_size,
            "current_day": self.current_day,
            "crop_type": self.crop_type,
            "health_distribution": health_counts,
            "avg_soil_moisture": round(total_moisture / n, 1),
            "avg_crop_stress": round(total_stress / n, 1),
            "avg_ndvi": round(total_ndvi / n, 3),
            "avg_yield_estimate": round(total_yield / n, 1),
            "connectivity": self.connectivity,
            "active_events_count": len(self.active_events)
        }

    def get_lod_representation(self, max_cells: int = 100) -> List[Dict[str, Any]]:
        """Level-of-Detail downsampling for rendering up to 100,000 zones responsively."""
        if len(self.zones) <= max_cells:
            return [z.to_dict() for z in self.zones]
        
        # Spatial block aggregation
        step = int(math.ceil(len(self.zones) / max_cells))
        lod_cells = []
        for i in range(0, len(self.zones), step):
            subset = self.zones[i:i+step]
            avg_moisture = float(np.mean([z.soil_moisture for z in subset]))
            avg_stress = float(np.mean([z.crop_stress for z in subset]))
            avg_ndvi = float(np.mean([z.NDVI for z in subset]))
            avg_temp = float(np.mean([z.temperature for z in subset]))
            avg_disease = float(np.mean([z.disease_probability for z in subset]))
            dominant_health = max(set([z.crop_health for z in subset]), key=[z.crop_health for z in subset].count)
            
            lead = subset[0]
            lod_cells.append({
                "zone_id": lead.zone_id,
                "row": lead.row,
                "col": lead.col,
                "is_aggregated": True,
                "aggregated_count": len(subset),
                "crop_type": lead.crop_type,
                "growth_stage": lead.to_dict()["growth_stage"],
                "growth_stage_progress": lead.growth_stage_progress,
                "soil_moisture": round(avg_moisture, 1),
                "temperature": round(avg_temp, 1),
                "humidity": round(lead.humidity, 1),
                "rainfall": round(lead.rainfall, 1),
                "wind": round(lead.wind, 1),
                "forecast_rainfall": round(lead.forecast_rainfall, 1),
                "rain_probability": round(lead.rain_probability, 1),
                "NDVI": round(avg_ndvi, 3),
                "NDMI": round(lead.NDMI, 3),
                "LST": round(lead.LST, 1),
                "crop_health": dominant_health,
                "crop_stress": round(avg_stress, 1),
                "disease_probability": round(avg_disease, 1),
                "water_requirement": round(lead.water_requirement, 1),
                "climate_risk": round(lead.climate_risk, 1),
                "yield_estimate": round(lead.yield_estimate, 1),
                "AI_confidence": round(lead.AI_confidence, 1),
                "last_satellite_update": lead.last_satellite_update,
                "ai_recommendation": lead.ai_recommendation
            })
        return lod_cells
