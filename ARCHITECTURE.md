# SMART FARM SIM: Technical Architecture Specification

## 1. System Philosophy
SMART FARM SIM decouples agricultural domain simulation from heavy physics/3D game rendering, targeting an **interpretable, data-driven, edge-evaluable research simulator**.

```
+---------------------------------------------------------------+
|                       REACT 18 FRONTEND                       |
|   +-------------------+  +-------------------+  +-----------+ |
|   | HTML5 Grid Canvas |  |  Zone Inspector   |  | Lab Views | |
|   +-------------------+  +-------------------+  +-----------+ |
+-------------------------------+-------------------------------+
                                | (HTTP / JSON)
+-------------------------------v-------------------------------+
|                        FASTAPI BACKEND                        |
|   /api/farm/*    /api/weather/*    /api/ai/*    /api/export/* |
+-------------------------------+-------------------------------+
                                |
        +-----------------------+-----------------------+
        |                                               |
+-------v-----------------------+       +---------------v---------------+
|      SIMULATION ENGINE        |       |        DATA SCIENCE & ML      |
| - FarmManager (100-100k zones)|       | - FeatureFusionEngine         |
| - ClimateEngine (Dynamic & FC)|       | - PredictionEngine            |
| - SatelliteEngine (Sentinel-2)|       | - OptimizationLabEngine       |
| - ConsequenceEngine (Causality|       | - ScalabilityManager          |
| - WhatIfSimulator (Projections|       | - SHAP-Style Attributions     |
+-------------------------------+       +-------------------------------+
        |                                               |
+-------v-----------------------------------------------v---------------+
|                       PERSISTENCE LAYER                       |
|   SQLite (smart_farm.db) • CSV Exporter • JSON Serializer     |
+---------------------------------------------------------------+
```

## 2. Component Specifications

### 2.1 Virtual Farm & Zone Model (`backend/simulation/farm_state.py`)
- Each zone is an autonomous entity tracking 24 agronomic, meteorological, and remote-sensing features:
  - In-Situ: `soil_moisture`, `temperature`, `humidity`, `rainfall`, `wind`, `water_requirement`
  - Phenological: `crop_type`, `growth_stage`, `growth_stage_progress`, `crop_stress`, `yield_estimate`
  - Remote Sensing: `NDVI` (canopy greenness), `NDMI` (canopy water content), `LST` (surface temperature)
  - Diagnostic: `disease_probability`, `climate_risk`, `crop_health` ('Healthy', 'Moderate', 'Stressed', 'Critical')
  - AI & Advisory: `AI_confidence`, `last_satellite_update`, `last_action`, `ai_recommendation`

### 2.2 Vectorized Scalability Engine (`backend/simulation/scalability_manager.py`)
- When scaling to 100,000 zones:
  - Vectorized NumPy arrays process daily biological progression in **< 150 ms**.
  - Level of Detail (LOD) downsamples the 100,000 plots into an aggregated spatial matrix for rendering at 60 FPS.

### 2.3 Edge Optimization Subsystem (`backend/ml/optimization_engine.py`)
- Standard Model: 14 multimodal inputs, FP32 floating point, 80 estimators, ~1,280 KB footprint.
- Edge-Optimized Model:
  1. **Quantization:** Weights converted from FP32 to INT8 (72% size reduction).
  2. **Pruning:** Max depth bounded to 4 splits, cutting redundant branches.
  3. **Feature Selection:** Top 6 features retained (Soil Moisture, Temp, Forecast Rain, Rain Prob, NDVI, LST).
  4. **Performance:** Delivers a **10.6x speedup** on large-scale field sweeps.
