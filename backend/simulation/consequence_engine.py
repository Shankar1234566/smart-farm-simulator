import numpy as np
from typing import List, Dict, Any, Optional

class ConsequenceEngine:
    def __init__(self):
        self.total_water_used_mm = 0.0
        self.actions_log: List[Dict[str, Any]] = []

    def execute_action(self, zone: Any, action_type: str, current_day: int, note: str = "") -> Dict[str, Any]:
        """Apply player action to a zone with deterministic causal consequences."""
        zone.last_action = action_type
        
        result_message = ""
        water_delta = 0.0
        
        if action_type == "IRRIGATE":
            water_delta = 25.0
            self.total_water_used_mm += water_delta
            
            old_moisture = zone.soil_moisture
            zone.soil_moisture = float(np.clip(zone.soil_moisture + water_delta, 0.0, 100.0))
            
            if zone.soil_moisture > 88.0:
                # Saturation penalty
                zone.crop_stress = float(np.clip(zone.crop_stress + 10.0, 0.0, 100.0))
                zone.disease_probability = float(np.clip(zone.disease_probability + 15.0, 0.0, 100.0))
                result_message = f"Over-irrigation: Moisture reached {zone.soil_moisture:.1f}%. Root saturation risk!"
            else:
                zone.crop_stress = float(np.clip(zone.crop_stress - 25.0, 0.0, 100.0))
                zone.NDMI = float(np.clip(zone.NDMI + 0.12, -0.2, 0.85))
                zone.LST = float(zone.LST - 2.0)
                result_message = f"Irrigation applied (+{water_delta}mm). Stress reduced to {zone.crop_stress:.1f}%."

        elif action_type == "DELAY":
            result_message = "Irrigation delayed to leverage upcoming forecast precipitation or conserve reserves."

        elif action_type == "MONITOR":
            zone.AI_confidence = float(np.clip(zone.AI_confidence + 6.0, 0.0, 99.0))
            result_message = f"High-cadence sensor telemetry activated. AI Confidence boosted to {zone.AI_confidence:.1f}%."

        elif action_type == "INSPECT":
            zone.AI_confidence = float(np.clip(zone.AI_confidence + 8.0, 0.0, 99.0))
            if zone.disease_probability > 30.0:
                zone.disease_probability = float(np.clip(zone.disease_probability - 15.0, 0.0, 100.0))
                result_message = f"Field inspection confirmed pathogen pockets. Localized biocontrol applied (-15% disease)."
            else:
                result_message = "Field inspection verified clean canopy and healthy root development."

        elif action_type == "APPLY_PROTECTION":
            zone.disease_probability = float(np.clip(zone.disease_probability - 35.0, 0.0, 100.0))
            zone.crop_stress = float(np.clip(zone.crop_stress - 15.0, 0.0, 100.0))
            result_message = "Protective organic fungicide and anti-transpirant barrier deployed."

        elif action_type == "IGNORE":
            result_message = "Advisory dismissed by manager."

        # Re-derive health and recommendation
        zone.crop_health = zone._derive_health()
        zone.ai_recommendation = zone._generate_recommendation()

        log_entry = {
            "day": current_day,
            "zone_id": zone.zone_id,
            "action": action_type,
            "result": result_message,
            "soil_moisture": round(zone.soil_moisture, 1),
            "crop_stress": round(zone.crop_stress, 1),
            "health": zone.crop_health
        }
        zone.action_history.append(log_entry)
        self.actions_log.append(log_entry)

        return log_entry

    def step_zones_day(self, zones: List[Any], weather: Dict[str, Any], current_day: int):
        """Simulate daily ecological progression for all zones."""
        temp = weather["temperature"]
        rain = weather["rainfall"]
        humidity = weather["humidity"]

        for z in zones:
            # 1. Soil moisture budget
            # Evapotranspiration
            et_loss = max(1.5, (temp - 18.0) * 0.22 + (z.wind * 0.05))
            # Precipitation recharge
            rain_gain = rain * 0.75
            z.soil_moisture = float(np.clip(z.soil_moisture - et_loss + rain_gain, 5.0, 98.0))
            z.temperature = float(temp + (z.zone_id % 5) * 0.3 - 0.6)
            z.humidity = float(humidity)
            z.rainfall = float(rain)

            # 2. Stress accumulation
            moisture_stress = max(0.0, (38.0 - z.soil_moisture) * 1.6)
            heat_stress = max(0.0, (z.temperature - 33.0) * 3.5)
            saturation_stress = max(0.0, (z.soil_moisture - 85.0) * 2.0)
            
            target_stress = moisture_stress + heat_stress + saturation_stress
            # Smooth transition
            z.crop_stress = float(np.clip(z.crop_stress * 0.7 + target_stress * 0.3, 0.0, 100.0))

            # 3. Disease progression
            if z.humidity > 78.0 and z.temperature > 24.0:
                disease_inc = (z.humidity - 70.0) * 0.2
            else:
                disease_inc = -2.5 # Pathogens recede in dry conditions
            z.disease_probability = float(np.clip(z.disease_probability + disease_inc, 2.0, 95.0))

            # 4. Multi-spectral index progression
            # NDVI reflects sustained stress
            if z.crop_stress > 45.0:
                z.NDVI = float(np.clip(z.NDVI - 0.015, 0.15, 0.88))
            elif z.crop_stress < 20.0 and z.growth_stage_progress < 80.0:
                z.NDVI = float(np.clip(z.NDVI + 0.008, 0.15, 0.88))

            z.NDMI = float(np.clip(0.40 + (z.soil_moisture - 50.0) * 0.007, -0.2, 0.85))
            z.LST = float(z.temperature - (z.soil_moisture * 0.07))

            # 5. Growth stage progression
            z.growth_stage_progress = float(np.clip((current_day / 120.0) * 100.0, 0.0, 100.0))
            z.growth_stage_index = min(4, int(z.growth_stage_progress / 20.0))

            # 6. Yield penalty calculation
            if z.crop_stress > 40.0:
                z.yield_estimate = float(np.clip(z.yield_estimate - (z.crop_stress - 40.0) * 0.08, 15.0, 105.0))

            # Update health state and recommendation
            z.crop_health = z._derive_health()
            z.ai_recommendation = z._generate_recommendation()
