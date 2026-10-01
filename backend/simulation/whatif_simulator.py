import numpy as np
import copy
from typing import List, Dict, Any

class WhatIfSimulator:
    """Projects future agricultural outcomes under hypothetical counterfactual climate conditions."""
    @staticmethod
    def simulate(zones: List[Any], current_weather: Dict[str, Any], temp_delta: float, rain_delta: float, humidity_delta: float, irrigation_applied: bool = False, days_ahead: int = 7) -> Dict[str, Any]:
        hypothetical_temp = current_weather["temperature"] + temp_delta
        hypothetical_rain = max(0.0, current_weather["rainfall"] + rain_delta)
        hypothetical_humidity = np.clip(current_weather["humidity"] + humidity_delta, 10.0, 99.0)

        # Baseline stats
        base_healthy = sum(1 for z in zones if z.crop_health == "Healthy") / max(len(zones), 1) * 100
        base_stressed = sum(1 for z in zones if z.crop_health in ["Stressed", "Critical"]) / max(len(zones), 1) * 100
        base_moisture = float(np.mean([z.soil_moisture for z in zones]))
        base_stress = float(np.mean([z.crop_stress for z in zones]))
        base_yield = float(np.mean([z.yield_estimate for z in zones]))

        # Counterfactual projections over days_ahead
        proj_moistures = []
        proj_stresses = []
        proj_yields = []
        health_counts = {"Healthy": 0, "Moderate": 0, "Stressed": 0, "Critical": 0}

        for z in zones:
            m = z.soil_moisture
            s = z.crop_stress
            y = z.yield_estimate
            
            if irrigation_applied:
                m = min(100.0, m + 30.0)

            for _ in range(days_ahead):
                et = max(1.5, (hypothetical_temp - 18.0) * 0.22)
                gain = (hypothetical_rain / max(days_ahead, 1)) * 0.75
                m = np.clip(m - et + gain, 5.0, 98.0)

                m_stress = max(0.0, (38.0 - m) * 1.6)
                h_stress = max(0.0, (hypothetical_temp - 33.0) * 3.5)
                target_s = m_stress + h_stress
                s = np.clip(s * 0.7 + target_s * 0.3, 0.0, 100.0)

                if s > 40.0:
                    y = max(10.0, y - (s - 40.0) * 0.08)

            proj_moistures.append(m)
            proj_stresses.append(s)
            proj_yields.append(y)

            # Categorize
            if s >= 75.0:
                health_counts["Critical"] += 1
            elif s >= 50.0:
                health_counts["Stressed"] += 1
            elif s >= 28.0:
                health_counts["Moderate"] += 1
            else:
                health_counts["Healthy"] += 1

        n = max(len(zones), 1)
        proj_healthy_pct = (health_counts["Healthy"] / n) * 100.0
        proj_critical_pct = (health_counts["Critical"] / n) * 100.0
        proj_stressed_pct = ((health_counts["Stressed"] + health_counts["Critical"]) / n) * 100.0
        proj_avg_moisture = float(np.mean(proj_moistures))
        proj_avg_stress = float(np.mean(proj_stresses))
        proj_avg_yield = float(np.mean(proj_yields))

        factors = []
        if temp_delta >= 4.0:
            factors.append(f"Excess thermal load (+{temp_delta:.1f}°C) accelerating root evapotranspiration by {((temp_delta)*0.22):.1f} mm/day.")
        elif temp_delta <= -3.0:
            factors.append(f"Temperature reduction ({temp_delta:.1f}°C) lowers evaporative demand.")
            
        if rain_delta <= -15.0:
            factors.append(f"Severe precipitation deficit ({rain_delta:.1f}mm) deprives upper soil column of replenishment.")
        elif rain_delta >= 20.0:
            factors.append(f"Sufficient projected rainfall (+{rain_delta:.1f}mm) stabilizes soil moisture buffer.")

        if irrigation_applied:
            factors.append("Preventive manager irrigation buffer (+30mm) significantly cushions heat/drought impact.")

        return {
            "days_ahead": days_ahead,
            "baseline": {
                "healthy_pct": round(base_healthy, 1),
                "stressed_pct": round(base_stressed, 1),
                "avg_soil_moisture": round(base_moisture, 1),
                "avg_crop_stress": round(base_stress, 1),
                "avg_yield": round(base_yield, 1)
            },
            "projected": {
                "healthy_pct": round(proj_healthy_pct, 1),
                "stressed_pct": round(proj_stressed_pct, 1),
                "critical_pct": round(proj_critical_pct, 1),
                "avg_soil_moisture": round(proj_avg_moisture, 1),
                "avg_crop_stress": round(proj_avg_stress, 1),
                "avg_yield": round(proj_avg_yield, 1),
                "yield_impact_pct": round(proj_avg_yield - base_yield, 1)
            },
            "factors_summary": factors
        }
