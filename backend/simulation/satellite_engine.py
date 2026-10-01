import numpy as np
from typing import List, Dict, Any, Optional

class SatelliteEngine:
    """Simulates periodic multi-spectral Earth observation passes (Sentinel-2 / Landsat-8 style)."""
    def __init__(self, cadence_days: int = 7, seed: int = 42):
        self.cadence_days = cadence_days
        self.seed = seed
        self.rng = np.random.RandomState(seed)
        self.observations_history: List[Dict[str, Any]] = []
        
        # Initial pass at Day 1
        self._record_pass(day=1, avg_ndvi=0.68, avg_ndmi=0.44, avg_lst=26.5, stressed_pct=8.0, cloud_pct=10.0, note="Initial baseline observation pass.")

    def _record_pass(self, day: int, avg_ndvi: float, avg_ndmi: float, avg_lst: float, stressed_pct: float, cloud_pct: float, note: str = ""):
        pass_record = {
            "pass_id": f"SAT-PASS-D{day:03d}",
            "day": day,
            "avg_ndvi": round(avg_ndvi, 3),
            "avg_ndmi": round(avg_ndmi, 3),
            "avg_lst": round(avg_lst, 1),
            "stressed_pct": round(stressed_pct, 1),
            "cloud_cover_pct": round(cloud_pct, 1),
            "resolution": "10m multispectral (B4-Red, B8-NIR, B11-SWIR)",
            "sensor": "Sentinel-2 Virtual MSI Constellation",
            "notes": note
        }
        self.observations_history.append(pass_record)
        return pass_record

    def should_update(self, current_day: int) -> bool:
        if not self.observations_history:
            return True
        last_day = self.observations_history[-1]["day"]
        return (current_day - last_day) >= self.cadence_days

    def trigger_pass(self, current_day: int, farm_zones: List[Any], cloud_cover: float = 15.0) -> Dict[str, Any]:
        """Perform a remote-sensing sweep over the farm."""
        ndvis = [z.NDVI for z in farm_zones]
        ndmis = [z.NDMI for z in farm_zones]
        lsts = [z.LST for z in farm_zones]
        stresses = [z.crop_stress for z in farm_zones]

        avg_ndvi = float(np.mean(ndvis)) if ndvis else 0.65
        avg_ndmi = float(np.mean(ndmis)) if ndmis else 0.40
        avg_lst = float(np.mean(lsts)) if lsts else 28.0
        stressed_count = sum(1 for s in stresses if s > 50.0)
        stressed_pct = (stressed_count / max(len(farm_zones), 1)) * 100.0

        # Update zone metadata
        for z in farm_zones:
            z.last_satellite_update = current_day

        note = f"Cadence update at Day {current_day}. Detected {stressed_pct:.1f}% stressed canopy."
        return self._record_pass(
            day=current_day,
            avg_ndvi=avg_ndvi,
            avg_ndmi=avg_ndmi,
            avg_lst=avg_lst,
            stressed_pct=stressed_pct,
            cloud_pct=cloud_cover,
            note=note
        )

    def get_comparison(self, day_a: int, day_b: int) -> Dict[str, Any]:
        obs_a = next((o for o in self.observations_history if o["day"] == day_a), None)
        obs_b = next((o for o in self.observations_history if o["day"] == day_b), None)
        
        if not obs_a or not obs_b:
            return {"error": "One or both observation dates not found in catalog."}

        return {
            "day_a": obs_a,
            "day_b": obs_b,
            "delta_ndvi": round(obs_b["avg_ndvi"] - obs_a["avg_ndvi"], 3),
            "delta_ndmi": round(obs_b["avg_ndmi"] - obs_a["avg_ndmi"], 3),
            "delta_lst": round(obs_b["avg_lst"] - obs_a["avg_lst"], 1),
            "delta_stressed_pct": round(obs_b["stressed_pct"] - obs_a["stressed_pct"], 1)
        }
