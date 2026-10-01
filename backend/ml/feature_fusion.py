import numpy as np
from typing import List, Dict, Any, Tuple

FEATURE_NAMES = [
    "soil_moisture",
    "temperature",
    "humidity",
    "rainfall",
    "wind",
    "forecast_rainfall",
    "rain_probability",
    "heatwave_risk",
    "drought_index",
    "NDVI",
    "NDMI",
    "LST",
    "growth_stage_progress",
    "previous_stress"
]

TOP_EDGE_FEATURES = [
    "soil_moisture",
    "temperature",
    "forecast_rainfall",
    "rain_probability",
    "NDVI",
    "LST"
]

class FeatureFusionEngine:
    """Fuses multi-modal tabular signals: Farm In-Situ + Weather + Forecast + Remote Sensing."""
    
    @staticmethod
    def extract_features(zone: Any, weather: Dict[str, Any], use_top_edge_only: bool = False) -> np.ndarray:
        heatwave_risk = weather.get("heatwave_risk", 0.0)
        drought_index = weather.get("drought_index", 0.0)
        
        full_vector = np.array([
            zone.soil_moisture,
            zone.temperature,
            zone.humidity,
            zone.rainfall,
            zone.wind,
            zone.forecast_rainfall,
            zone.rain_probability,
            heatwave_risk,
            drought_index,
            zone.NDVI,
            zone.NDMI,
            zone.LST,
            zone.growth_stage_progress,
            zone.crop_stress
        ], dtype=np.float32)

        if use_top_edge_only:
            # Indices: 0 (soil_moisture), 1 (temp), 5 (forecast_rain), 6 (rain_prob), 9 (NDVI), 11 (LST)
            indices = [0, 1, 5, 6, 9, 11]
            return full_vector[indices]
            
        return full_vector

    @staticmethod
    def extract_batch(zones: List[Any], weather: Dict[str, Any], use_top_edge_only: bool = False) -> np.ndarray:
        return np.vstack([FeatureFusionEngine.extract_features(z, weather, use_top_edge_only) for z in zones])

    @staticmethod
    def extract_ablation_features(zone: Any, weather: Dict[str, Any], mode: str) -> np.ndarray:
        """
        Supports systematic ablation studies:
        - 'farm_only': soil_moisture, crop_stress, growth_stage
        - 'weather_only': temperature, humidity, rainfall, wind, rain_probability
        - 'satellite_only': NDVI, NDMI, LST
        - 'farm_weather': farm + weather
        - 'farm_satellite': farm + satellite
        - 'all_multimodal': farm + weather + satellite + forecast
        """
        if mode == "farm_only":
            return np.array([zone.soil_moisture, zone.crop_stress, zone.growth_stage_progress], dtype=np.float32)
        elif mode == "weather_only":
            return np.array([zone.temperature, zone.humidity, zone.rainfall, zone.wind, zone.rain_probability], dtype=np.float32)
        elif mode == "satellite_only":
            return np.array([zone.NDVI, zone.NDMI, zone.LST], dtype=np.float32)
        elif mode == "farm_weather":
            return np.array([zone.soil_moisture, zone.crop_stress, zone.temperature, zone.humidity, zone.rainfall, zone.rain_probability], dtype=np.float32)
        elif mode == "farm_satellite":
            return np.array([zone.soil_moisture, zone.crop_stress, zone.NDVI, zone.NDMI, zone.LST], dtype=np.float32)
        else: # all_multimodal
            return FeatureFusionEngine.extract_features(zone, weather, use_top_edge_only=False)
