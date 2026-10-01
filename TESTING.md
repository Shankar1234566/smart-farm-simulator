# SMART FARM SIM: Verification & Testing Suite

## Overview
The SMART FARM simulator includes an automated multi-level verification suite ensuring testability across all simulation modules, REST endpoints, and ML inference pipelines.

---

## 1. Unit & Domain Tests (`backend/tests/test_simulation.py`)
Verifies individual sub-systems:
- **Farm Initialization:** Verifies 100 virtual zones, crop profile properties, spatial coordinate layouts.
- **Climate Engine & Forecast:** Verifies diurnal noise, temperature bounds (12-50°C), and 7-day forecast generation.
- **Satellite Engine:** Verifies periodic Sentinel-2 pass cadence, multi-spectral indices (NDVI, NDMI, LST).
- **Consequence Engine:** Tests deterministic physical impacts of irrigation (+25mm, stress drop, saturation risk).
- **Prediction Engine:** Tests batch inference latency and health classifications.
- **Edge Optimization Lab:** Verifies INT8 quantization, pruning, and size reduction.
- **What-If Simulator:** Tests counterfactual future projections.
- **Scalability Sweep:** Tests 100 to 100,000 zone scaling benchmarks.

### Running Unit Tests:
```bash
python -m backend.tests.test_simulation
```
**Expected Output:**
```
All backend tests PASSED!
```

---

## 2. End-to-End Integration Verification (`backend/tests/test_e2e_flow.py`)
Exercises the complete 13-stage interactive lifecycle against the live running server:
1. Health check `/api/health`
2. Create virtual farm (100 zones)
3. State verification
4. Simulation time advance (+3 days)
5. Climate shock injection (Severe Heatwave)
6. Multimodal AI inference execution
7. Farm Manager player intervention (Irrigate Zone 1)
8. Rural offline connectivity failover
9. AI Optimization Lab quantization & pruning
10. Large-scale field scaling (10,000 zones)
11. What-If counterfactual scenario projection
12. Harvest season defense scorecard generation
13. CSV research data export

### Running E2E Verification:
```bash
python backend/tests/test_e2e_flow.py
```
**Expected Output:**
```
=== STARTING FULL END-TO-END VERIFICATION ===
[OK] Step 1: Health check passed.
[OK] Step 2: Create farm passed (100 zones generated).
[OK] Step 3: Farm state verified.
[OK] Step 4: Step days passed (Current Day: 4).
[OK] Step 5: Climate event triggered: Heatwave.
[OK] Step 6: AI Prediction executed.
[OK] Step 7: Player action executed.
[OK] Step 8: Network set to OFFLINE; local edge model autonomously activated.
[OK] Step 9: Optimization Lab tested (Size: 1280KB -> 51KB, Speedup: 5.1x).
[OK] Step 10: Scaled farm to 10,000 zones.
[OK] Step 11: What-If simulation executed.
[OK] Step 12: Season report generated.
[OK] Step 13: Export CSV verified.

*** ALL 13 END-TO-END CHAIN STEPS PASSED WITHOUT ERRORS! ***
```
