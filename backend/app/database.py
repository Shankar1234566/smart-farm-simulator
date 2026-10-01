import sqlite3
import json
import os
import csv
import io
from pathlib import Path
from typing import List, Dict, Any, Optional

def get_db_path() -> str:
    env_db = os.environ.get("DATABASE_PATH")
    if env_db:
        return env_db
    # In Vercel / AWS Lambda serverless read-only filesystem, use /tmp
    if os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME"):
        return "/tmp/smart_farm.db"
    return str(Path(__file__).resolve().parent.parent / "smart_farm.db")

DB_PATH = get_db_path()

def init_db():
    global DB_PATH
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        
        cur.execute("""
        CREATE TABLE IF NOT EXISTS simulations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            farm_size INTEGER,
            crop_type TEXT,
            climate_preset TEXT,
            total_days INTEGER,
            final_yield REAL,
            water_used REAL,
            avg_health_pct REAL
        )
        """)
        
        cur.execute("""
        CREATE TABLE IF NOT EXISTS player_actions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            simulation_id INTEGER,
            day INTEGER,
            zone_id INTEGER,
            action TEXT,
            result TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        """)

        cur.execute("""
        CREATE TABLE IF NOT EXISTS experiments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            config_json TEXT,
            results_json TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        """)
        
        cur.execute("""
        CREATE TABLE IF NOT EXISTS scalability_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            farm_size INTEGER,
            latency_ms REAL,
            ram_mb REAL,
            cpu_pct REAL,
            model_type TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        """)
        
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"[WARN] Database initialization warning on {DB_PATH}: {e}. Falling back to in-memory SQLite.")
        try:
            DB_PATH = ":memory:"
            conn = sqlite3.connect(DB_PATH)
            conn.close()
        except Exception as inner_e:
            print(f"[WARN] In-memory database fallback error: {inner_e}")

def log_action(sim_id: int, day: int, zone_id: int, action: str, result: str):
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute("INSERT INTO player_actions (simulation_id, day, zone_id, action, result) VALUES (?, ?, ?, ?, ?)",
                    (sim_id, day, zone_id, action, result))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"[WARN] Error logging action: {e}")

def export_zones_csv(zones_data: List[Dict[str, Any]]) -> str:
    if not zones_data:
        return ""
    output = io.StringIO()
    fields = [
        "zone_id", "row", "col", "crop_type", "growth_stage", "soil_moisture",
        "temperature", "humidity", "rainfall", "wind", "forecast_rainfall",
        "rain_probability", "NDVI", "NDMI", "LST", "crop_health", "crop_stress",
        "disease_probability", "water_requirement", "climate_risk", "yield_estimate",
        "AI_confidence", "last_satellite_update", "last_action"
    ]
    writer = csv.DictWriter(output, fieldnames=fields, extrasaction='ignore')
    writer.writeheader()
    for z in zones_data:
        writer.writerow(z)
    return output.getvalue()
