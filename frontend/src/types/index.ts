export type CropType = 'Rice' | 'Maize' | 'Cotton' | 'Chilli' | 'Wheat';

export type HealthStatus = 'Healthy' | 'Moderate' | 'Stressed' | 'Critical';

export type ConnectivityStatus = 'GOOD' | 'WEAK' | 'INTERMITTENT' | 'OFFLINE';

export type MapMode = 
  | 'NORMAL' 
  | 'CROP_HEALTH' 
  | 'SOIL_MOISTURE' 
  | 'DISEASE_RISK' 
  | 'CLIMATE_RISK' 
  | 'WATER_STRESS' 
  | 'NDVI' 
  | 'NDMI' 
  | 'LST' 
  | 'YIELD_RISK' 
  | 'AI_CONFIDENCE' 
  | 'COMPUTE_LOAD' 
  | 'SATELLITE';

export type EventType = 
  | 'HEATWAVE' 
  | 'DROUGHT' 
  | 'HEAVY_RAIN' 
  | 'HUMIDITY_SPIKE' 
  | 'DELAYED_RAIN' 
  | 'EXTREME_TEMPERATURE';

export type ActionType = 
  | 'IRRIGATE' 
  | 'DELAY' 
  | 'MONITOR' 
  | 'INSPECT' 
  | 'APPLY_PROTECTION' 
  | 'IGNORE';

export interface FarmZone {
  zone_id: number;
  row: number;
  col: number;
  crop_type: CropType;
  growth_stage: string; // 'Vegetative' | 'Reproductive' | 'Ripening' | 'Maturity'
  growth_stage_progress: number; // 0 to 100%
  soil_moisture: number; // 0 to 100%
  temperature: number; // Celsius
  humidity: number; // 0 to 100%
  rainfall: number; // mm
  wind: number; // km/h
  forecast_rainfall: number; // mm in next 24h
  rain_probability: number; // 0 to 100%
  NDVI: number; // -0.1 to 0.95
  NDMI: number; // -0.2 to 0.85
  LST: number; // Land Surface Temp (C)
  crop_health: HealthStatus;
  crop_stress: number; // 0 to 100%
  disease_probability: number; // 0 to 100%
  water_requirement: number; // mm/day
  climate_risk: number; // 0 to 100%
  yield_estimate: number; // percentage of target yield (0 to 120%)
  AI_confidence: number; // 0 to 100%
  last_satellite_update: number; // day number
  last_action?: ActionType;
  action_history?: { day: number; action: ActionType; note?: string }[];
  ai_recommendation?: {
    recommendation: string;
    rationale: string;
    confidence: number;
    factors: { name: string; impact: number; description: string }[];
  };
}

export interface WeatherCurrent {
  temperature: number;
  humidity: number;
  rainfall: number;
  wind: number;
  rain_probability: number;
  cloud_cover: number;
  heatwave_risk: number;
  drought_index: number;
}

export interface WeatherForecastDay {
  day_offset: number;
  day_label: string;
  temp_min: number;
  temp_max: number;
  rainfall: number;
  rain_probability: number;
  condition: 'Sunny' | 'Partly Cloudy' | 'Cloudy' | 'Light Rain' | 'Heavy Rain' | 'Extreme Heat';
  heat_stress: 'LOW' | 'MEDIUM' | 'HIGH';
  irrigation_opportunity: 'POOR' | 'MODERATE' | 'OPTIMAL' | 'DO_NOT_IRRIGATE';
}

export interface ClimateEvent {
  event_id: string;
  event_type: EventType;
  name: string;
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'EXTREME';
  duration: number; // in days
  days_remaining: number;
  start_day: number;
  affected_zones: number; // count
  parameters: {
    temp_delta: number;
    moisture_delta: number;
    rain_delta: number;
    humidity_delta: number;
  };
  active: boolean;
}

export interface SatellitePass {
  pass_id: string;
  day: number;
  avg_ndvi: number;
  avg_ndmi: number;
  avg_lst: number;
  stressed_pct: number;
  cloud_cover_pct: number;
  resolution: string;
  notes: string;
}

export interface AIModelProfile {
  model_id: string;
  name: string;
  version: string;
  type: 'STANDARD' | 'EDGE_OPTIMIZED' | 'ADAPTIVE';
  accuracy: number;
  f1_score: number;
  precision: number;
  recall: number;
  latency_per_100_ms: number;
  memory_ram_mb: number;
  cpu_utilization_pct: number;
  model_size_kb: number;
  features_count: number;
  quantized: boolean;
  pruned: boolean;
  compressed: boolean;
}

export interface ComputeStatus {
  budget_units: number;
  used_units: number;
  queue_length: number;
  active_mode: 'CENTRALIZED' | 'EDGE_FIRST' | 'HYBRID' | 'ADAPTIVE';
  cpu_usage_pct: number;
  ram_usage_mb: number;
  avg_latency_ms: number;
  predictions_processed: number;
}

export interface ScalabilityBenchmarkResult {
  farm_size: number;
  generation_time_ms: number;
  simulation_step_ms: number;
  inference_latency_ms: number;
  cpu_percent: number;
  ram_mb: number;
  predictions_per_sec: number;
  queue_depth: number;
  rendering_fps: number;
}

export interface WhatIfScenarioInput {
  temp_delta: number;
  rain_delta: number;
  humidity_delta: number;
  wind_delta: number;
  irrigation_applied: boolean;
  days_ahead: number;
}

export interface WhatIfScenarioResult {
  days_ahead: number;
  baseline: {
    healthy_pct: number;
    stressed_pct: number;
    avg_soil_moisture: number;
    avg_crop_stress: number;
    avg_yield: number;
  };
  projected: {
    healthy_pct: number;
    stressed_pct: number;
    critical_pct: number;
    avg_soil_moisture: number;
    avg_crop_stress: number;
    avg_yield: number;
    yield_impact_pct: number;
  };
  factors_summary: string[];
}

export interface AblationStudyResult {
  dataset_config: string;
  features: string[];
  accuracy: number;
  f1_score: number;
  auc_roc: number;
  latency_ms: number;
  description: string;
}

export interface SeasonReportData {
  season_completed: boolean;
  total_days: number;
  farm_size: number;
  crop_type: CropType;
  final_health_distribution: { Healthy: number; Moderate: number; Stressed: number; Critical: number };
  average_final_yield_pct: number;
  total_water_consumed_mm: number;
  climate_events_endured: number;
  ai_recommendations_given: number;
  player_actions_executed: number;
  ai_adoption_rate_pct: number;
  edge_energy_saved_pct: number;
  game_scores: {
    farm_health: number; // 0-100
    water_efficiency: number; // 0-100
    climate_response: number; // 0-100
    ai_utilization: number; // 0-100
    computational_efficiency: number; // 0-100
    overall_rating: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  };
}
