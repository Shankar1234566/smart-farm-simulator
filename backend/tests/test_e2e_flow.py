import urllib.request
import json
import sys

BASE_URL = "http://127.0.0.1:8000/api"

def make_req(endpoint, method="GET", data=None):
    url = f"{BASE_URL}{endpoint}"
    req = urllib.request.Request(url, method=method)
    if data:
        req.add_header("Content-Type", "application/json")
        body = json.dumps(data).encode("utf-8")
        req.data = body
    with urllib.request.urlopen(req, timeout=10) as resp:
        return resp.status, json.loads(resp.read().decode("utf-8"))

def run_e2e():
    print("=== STARTING FULL END-TO-END VERIFICATION ===")
    
    # 1. Health check
    code, res = make_req("/health")
    assert code == 200 and res["status"] == "healthy"
    print("[OK] Step 1: Health check passed.")

    # 2. Create farm (100 zones, Rice, Normal)
    code, res = make_req("/farm/create", method="POST", data={
        "crop": "Rice",
        "size": 100,
        "climate": "Normal",
        "connectivity": "GOOD",
        "model": "STANDARD"
    })
    assert code == 200
    print("[OK] Step 2: Create farm passed (100 zones generated).")

    # 3. Check farm state
    code, res = make_req("/farm/state")
    assert code == 200
    assert len(res["cells"]) == 100
    print(f"[OK] Step 3: Farm state verified ({len(res['cells'])} active zones, weather {res['weather']['temperature']}°C).")

    # 4. Advance days
    code, res = make_req("/farm/step", method="POST", data={"days": 3})
    assert code == 200
    assert res["current_day"] == 4
    print(f"[OK] Step 4: Step days passed (Current Day: {res['current_day']}).")

    # 5. Trigger climate event: HEATWAVE
    code, res = make_req("/farm/event", method="POST", data={"event_type": "HEATWAVE", "severity": "SEVERE", "duration": 4})
    assert code == 200
    assert res["event"]["event_type"] == "HEATWAVE"
    print(f"[OK] Step 5: Climate event triggered: {res['event']['name']}.")

    # 6. Run AI prediction
    code, res = make_req("/ai/predict", method="POST")
    assert code == 200
    assert res["zones_processed"] == 100
    print(f"[OK] Step 6: AI Prediction executed ({res['zones_processed']} zones, latency: {res['inference_latency_ms']}ms).")

    # 7. Make player decision (Irrigate Zone 1)
    code, res = make_req("/farm/decision", method="POST", data={"zone_id": 1, "action_type": "IRRIGATE"})
    assert code == 200
    assert res["success"] is True
    print(f"[OK] Step 7: Player action executed: {res['result']['action']} -> {res['result']['result']}")

    # 8. Change network connectivity to OFFLINE
    code, res = make_req("/farm/connectivity", method="POST", data={"status": "OFFLINE"})
    assert code == 200
    assert res["connectivity"] == "OFFLINE"
    assert res["active_model"] == "EDGE_OPTIMIZED"
    print("[OK] Step 8: Network set to OFFLINE; local edge model autonomously activated.")

    # 9. AI Optimization Lab benchmark
    code, res = make_req("/ai/optimize", method="POST", data={"quantize": True, "prune": True, "reduce_features": True, "compress": True})
    assert code == 200
    assert res["optimized"]["model_size_kb"] < res["baseline"]["model_size_kb"]
    print(f"[OK] Step 9: Optimization Lab tested (Size: {res['baseline']['model_size_kb']}KB -> {res['optimized']['model_size_kb']}KB, Speedup: {res['tradeoff_analysis']['speedup_factor']}x).")

    # 10. Scale farm to 10,000 zones
    code, res = make_req("/farm/scale?size=10000", method="POST")
    assert code == 200
    print("[OK] Step 10: Scaled farm to 10,000 zones.")

    # 11. Run What-If Counterfactual
    code, res = make_req("/sim/whatif", method="POST", data={"temp_delta": 4.0, "rain_delta": -15.0, "humidity_delta": -10.0, "irrigation_applied": True, "days_ahead": 7})
    assert code == 200
    assert "projected" in res
    print(f"[OK] Step 11: What-If simulation executed (Projected health: {res['projected']['healthy_pct']}%).")

    # 12. Generate harvest season report
    code, res = make_req("/report")
    assert code == 200
    assert "game_scores" in res
    print(f"[OK] Step 12: Season report generated (Rating: {res['game_scores']['overall_rating']}).")

    # 13. Export CSV
    url = f"{BASE_URL}/export/csv"
    with urllib.request.urlopen(url) as resp:
        content = resp.read().decode("utf-8")
        assert "zone_id" in content
        print(f"[OK] Step 13: Export CSV verified (Length: {len(content)} bytes).")

    print("\n*** ALL 13 END-TO-END CHAIN STEPS PASSED WITHOUT ERRORS! ***")

if __name__ == "__main__":
    run_e2e()
