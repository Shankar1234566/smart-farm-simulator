import numpy as np
import math
from typing import List, Dict, Any, Optional

class ClimateEngine:
    def __init__(self, preset: str = "Normal", seed: int = 42):
        self.preset = preset
        self.seed = seed
        self.rng = np.random.RandomState(seed)
        
        # Base climate parameters based on preset
        self.base_temp = 28.0
        self.base_humidity = 65.0
        self.base_rain_chance = 0.25
        
        if preset == "Drought":
            self.base_temp = 34.0
            self.base_humidity = 35.0
            self.base_rain_chance = 0.05
        elif preset == "Heatwave":
            self.base_temp = 38.0
            self.base_humidity = 40.0
            self.base_rain_chance = 0.10
        elif preset == "Heavy Rain":
            self.base_temp = 25.0
            self.base_humidity = 88.0
            self.base_rain_chance = 0.80
        elif preset == "Extreme Humidity":
            self.base_temp = 29.0
            self.base_humidity = 92.0
            self.base_rain_chance = 0.50

        self.current_weather = self._generate_weather(day=1)

    def _generate_weather(self, day: int, temp_offset: float = 0.0, rain_offset: float = 0.0) -> Dict[str, Any]:
        day_noise = self.rng.normal(0, 1.5)
        seasonal_trend = math.sin((day / 120.0) * math.pi) * 3.0
        
        temp = float(np.clip(self.base_temp + seasonal_trend + day_noise + temp_offset, 12.0, 48.0))
        humidity = float(np.clip(self.base_humidity - (temp - 25.0) * 0.8 + self.rng.normal(0, 4.0), 20.0, 98.0))
        
        # Rainfall generation
        will_rain = self.rng.uniform(0, 1) < (self.base_rain_chance + (rain_offset > 0) * 0.4)
        if will_rain:
            rain = float(np.clip(self.rng.exponential(12.0) + rain_offset, 1.0, 85.0))
            rain_prob = float(np.clip(70.0 + self.rng.normal(0, 8.0), 50.0, 98.0))
            cloud_cover = float(np.clip(80.0 + self.rng.normal(0, 10.0), 60.0, 100.0))
        else:
            rain = 0.0
            rain_prob = float(np.clip(self.base_rain_chance * 60.0 + self.rng.normal(0, 6.0), 5.0, 40.0))
            cloud_cover = float(np.clip(25.0 + self.rng.normal(0, 15.0), 0.0, 65.0))

        wind = float(np.clip(12.0 + self.rng.normal(0, 3.5), 3.0, 45.0))
        heatwave_risk = float(np.clip(max(0.0, (temp - 33.0) * 12.0), 0.0, 100.0))
        drought_index = float(np.clip((35.0 - humidity) * 1.5 + (temp - 28.0) * 2.0, 0.0, 100.0))

        return {
            "temperature": round(temp, 1),
            "humidity": round(humidity, 1),
            "rainfall": round(rain, 1),
            "wind": round(wind, 1),
            "rain_probability": round(rain_prob, 1),
            "cloud_cover": round(cloud_cover, 1),
            "heatwave_risk": round(heatwave_risk, 1),
            "drought_index": round(drought_index, 1)
        }

    def generate_forecast(self, current_day: int, days_ahead: int = 7) -> List[Dict[str, Any]]:
        forecast = []
        for offset in range(1, days_ahead + 1):
            future_day = current_day + offset
            weather = self._generate_weather(day=future_day)
            
            # Predict condition
            if weather["rainfall"] > 25.0:
                condition = "Heavy Rain"
                irrigation_opportunity = "DO_NOT_IRRIGATE"
            elif weather["rainfall"] > 3.0:
                condition = "Light Rain"
                irrigation_opportunity = "POOR"
            elif weather["temperature"] > 36.0:
                condition = "Extreme Heat"
                irrigation_opportunity = "OPTIMAL" # pre-heatwave watering
            elif weather["cloud_cover"] > 60.0:
                condition = "Cloudy"
                irrigation_opportunity = "MODERATE"
            elif weather["cloud_cover"] > 30.0:
                condition = "Partly Cloudy"
                irrigation_opportunity = "OPTIMAL"
            else:
                condition = "Sunny"
                irrigation_opportunity = "OPTIMAL"

            heat_stress = "HIGH" if weather["temperature"] > 35.0 else ("MEDIUM" if weather["temperature"] > 30.0 else "LOW")

            forecast.append({
                "day_offset": offset,
                "day_label": f"Day {future_day}",
                "temp_min": round(weather["temperature"] - 5.5, 1),
                "temp_max": round(weather["temperature"] + 3.0, 1),
                "rainfall": weather["rainfall"],
                "rain_probability": weather["rain_probability"],
                "condition": condition,
                "heat_stress": heat_stress,
                "irrigation_opportunity": irrigation_opportunity
            })
        return forecast

    def step_climate(self, current_day: int, active_events: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Progress climate by 1 day applying active event effects."""
        temp_delta = 0.0
        rain_delta = 0.0
        
        for ev in active_events:
            params = ev.get("parameters", {})
            temp_delta += params.get("temp_delta", 0.0)
            rain_delta += params.get("rain_delta", 0.0)

        self.current_weather = self._generate_weather(day=current_day, temp_offset=temp_delta, rain_offset=rain_delta)
        return self.current_weather
