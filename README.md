# SMART FARM: Climate-Aware Virtual Smart Farm Simulator

**Academic Title:** *“A Data-Driven Climate-Aware Virtual Farm Simulator for Scalable Agricultural Decision Support and Edge-Oriented AI Optimization”*  
**Short Name:** `SMART FARM SIM`  
**Tagline:** *“SIMULATE THE FARM. EXPERIENCE THE CLIMATE. OPTIMIZE THE AI.”*  

---

## 🌾 Project Overview

**SMART FARM** is a 100% software-based, playable agricultural research simulator designed for a final-year Data Science degree project. It combines **in-silico agronomic modeling**, **dynamic meteorological forecasting**, **periodic Sentinel-2 multi-spectral remote sensing**, and **edge-oriented Machine Learning optimization**.

The user acts as an **AI Farm Manager** managing 100 to 100,000 virtual agricultural zones, observing crop phenology, soil moisture depletion, pathogen microclimates, and extreme climate shocks.

### Key Research Demonstrations
1. **Large-Scale Virtual Field Scalability:** Managing 100 to 100,000 agricultural zones using vectorized NumPy state progression and Level of Detail (LOD) spatial aggregation.
2. **Climate Forecast Integration:** Utilizing 7-day meteorological forecasts to eliminate premature over-irrigation and conserve water resources.
3. **Edge AI Optimization:** Evaluating INT8 Quantization, Tree Pruning, and Feature Selection to deploy models on resource-constrained rural micro-controllers.
4. **Offline Resilience:** Autonomous failover to local quantized models during rural network outages.
5. **Multimodal Feature Fusion & Explainability:** Combining ground telemetry, climate forecasts, and orbital NDVI/NDMI/LST into an interpretable decision advisory.

---

## 🏛️ Architecture Overview

```
                      +-----------------------------+
                      |   React 18 + TypeScript     |
                      |   High-Performance Canvas   |
                      +--------------+--------------+
                                     |
                                     v HTTP / REST
                      +-----------------------------+
                      |       FastAPI Backend       |
                      +--------------+--------------+
                                     |
      +------------------------------+------------------------------+
      |                              |                              |
      v                              v                              v
+---------------+             +---------------+             +---------------+
|  Simulation   |             |   Multimodal  |             |  SQLite &     |
|    Engine     |             |   ML Engine   |             |  Export Layer |
+---------------+             +---------------+             +---------------+
| - Farm Manager|             | - Fast Forests|             | - Runs & Logs |
| - Climate Eng |             | - Quantizer   |             | - Actions     |
| - Satellite   |             | - Feature Red |             | - CSV / JSON  |
| - What-If     |             | - Explainers  |             |               |
+---------------+             +---------------+             +---------------+
```

---

## 🚀 Quickstart & Run Instructions

### Prerequisites
- Python 3.10+ (tested on Python 3.12)
- Node.js 18+ and npm (tested on Node v22.18.0)

### 1. Backend Server
```bash
# From repository root
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
The FastAPI documentation is available at `http://127.0.0.1:8000/docs`.

### 2. Frontend Development Server
```bash
# In frontend directory
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in any modern web browser.

Alternatively, the production frontend build is automatically mounted by FastAPI at `http://127.0.0.1:8000/`.

---

## 📁 Repository Structure

```
d:/SMART FARM/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI REST endpoints
│   │   └── database.py          # SQLite schema, action logger, CSV exporter
│   ├── simulation/
│   │   ├── farm_state.py        # 100 to 100k zone models, crops, LOD
│   │   ├── climate_engine.py    # Dynamic weather, forecasts, event injector
│   │   ├── satellite_engine.py  # Sentinel-2 revisit passes, NDVI, NDMI, LST
│   │   ├── consequence_engine.py# Causal decisions, irrigation, stress
│   │   ├── whatif_simulator.py  # Counterfactual future scenario projection
│   │   └── scalability_manager.py# 100k zone latency/RAM/CPU benchmarks
│   ├── ml/
│   │   ├── feature_fusion.py    # Multimodal tabular feature concatenation
│   │   ├── prediction_engine.py # Decision ensembles, explainability, ablations
│   │   └── optimization_engine.py# INT8 quantization, pruning, compression
│   ├── tests/
│   │   ├── test_simulation.py   # Unit test suite
│   │   └── test_e2e_flow.py     # 13-stage end-to-end integration test
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/          # Canvas, Inspector, Header, Modals, Nav
│   │   ├── screens/             # 13 dedicated research screens
│   │   ├── services/api.ts      # REST API client
│   │   ├── types/index.ts       # TypeScript interfaces
│   │   ├── App.tsx              # Main application coordinator
│   │   └── index.css            # Agri-tech styling
│   ├── package.json
│   └── vite.config.ts
├── data/                        # Demo, raw, processed, models, exports
├── docs/                        # Architecture, research, testing documentation
├── ARCHITECTURE.md
├── RESEARCH.md
└── TESTING.md
```

---

## 🧪 Testing

To run the automated unit tests:
```bash
python -m backend.tests.test_simulation
```

To run the full 13-stage end-to-end verification against the running server:
```bash
python backend/tests/test_e2e_flow.py
```

---

## ⚖️ Academic Honesty & Limitations (Section 73 & 74)

- **Purely Software-Based:** This system is a virtual research simulator and does NOT require physical field sensors (Arduino, ESP32, LoRa) or pumps.
- **Simulated Metrics:** All telemetry marked as SIMULATED is computed through mathematical biological and agronomic models.
- **No Commercial Deployment Claims:** The system is positioned for academic research and evaluation, not commercial farm guarantees without physical ground validation.
