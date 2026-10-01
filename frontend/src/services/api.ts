import { FarmZone, WeatherCurrent, WeatherForecastDay, ClimateEvent, SatellitePass, AIModelProfile, ComputeStatus, ScalabilityBenchmarkResult, WhatIfScenarioInput, WhatIfScenarioResult, AblationStudyResult, SeasonReportData, ActionType } from '../types';

const API_BASE = '/api';

export const api = {
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  async createFarm(config: { crop: string; size: number; climate: string; connectivity: string; model: string; seed?: number }) {
    const res = await fetch(`${API_BASE}/farm/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    return res.json();
  },

  async getFarmState(): Promise<{
    summary: any;
    weather: WeatherCurrent;
    connectivity: string;
    active_model: string;
    compute: ComputeStatus;
    active_events: ClimateEvent[];
    cells: FarmZone[];
  }> {
    const res = await fetch(`${API_BASE}/farm/state`);
    return res.json();
  },

  async getZoneDetail(zoneId: number): Promise<{ zone: FarmZone; explanation: any }> {
    const res = await fetch(`${API_BASE}/farm/zone/${zoneId}`);
    return res.json();
  },

  async stepSimulation(days: number = 1) {
    const res = await fetch(`${API_BASE}/farm/step`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ days }),
    });
    return res.json();
  },

  async applyDecision(actionType: ActionType, zoneId?: number, note?: string) {
    const res = await fetch(`${API_BASE}/farm/decision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action_type: actionType, zone_id: zoneId, note }),
    });
    return res.json();
  },

  async triggerEvent(eventType: string, severity: string = 'MODERATE', duration: number = 4) {
    const res = await fetch(`${API_BASE}/farm/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_type: eventType, severity, duration }),
    });
    return res.json();
  },

  async scaleFarm(size: number) {
    const res = await fetch(`${API_BASE}/farm/scale?size=${size}`, { method: 'POST' });
    return res.json();
  },

  async setConnectivity(status: string) {
    const res = await fetch(`${API_BASE}/farm/connectivity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  async getWeather(): Promise<WeatherCurrent> {
    const res = await fetch(`${API_BASE}/weather`);
    return res.json();
  },

  async getForecast(days: number = 7): Promise<WeatherForecastDay[]> {
    const res = await fetch(`${API_BASE}/forecast?days=${days}`);
    return res.json();
  },

  async getSatelliteHistory(): Promise<{ observations: SatellitePass[]; cadence_days: number; latest_pass: SatellitePass }> {
    const res = await fetch(`${API_BASE}/satellite`);
    return res.json();
  },

  async triggerSatellite() {
    const res = await fetch(`${API_BASE}/satellite/trigger`, { method: 'POST' });
    return res.json();
  },

  async compareSatellite(dayA: number, dayB: number) {
    const res = await fetch(`${API_BASE}/satellite/compare?day_a=${dayA}&day_b=${dayB}`);
    return res.json();
  },

  async getAiProfiles(): Promise<{ standard: AIModelProfile; edge_optimized: AIModelProfile; adaptive: AIModelProfile }> {
    const res = await fetch(`${API_BASE}/ai/profiles`);
    return res.json();
  },

  async runAiPredict(modelType?: string) {
    const url = modelType ? `${API_BASE}/ai/predict?model_type=${modelType}` : `${API_BASE}/ai/predict`;
    const res = await fetch(url, { method: 'POST' });
    return res.json();
  },

  async runOptimizationLab(settings: { quantize: boolean; prune: boolean; reduce_features: boolean; compress: boolean }) {
    const res = await fetch(`${API_BASE}/ai/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    return res.json();
  },

  async simulateWhatIf(input: WhatIfScenarioInput): Promise<WhatIfScenarioResult> {
    const res = await fetch(`${API_BASE}/sim/whatif`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return res.json();
  },

  async runScalabilityBenchmark(size: number, model: string = 'STANDARD'): Promise<ScalabilityBenchmarkResult> {
    const res = await fetch(`${API_BASE}/scalability/benchmark?size=${size}&model=${model}`);
    return res.json();
  },

  async getScalabilityCurve(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/scalability/curve`);
    return res.json();
  },

  async getAblationResults(): Promise<AblationStudyResult[]> {
    const res = await fetch(`${API_BASE}/research/ablation`);
    return res.json();
  },

  async getSeasonReport(): Promise<SeasonReportData> {
    const res = await fetch(`${API_BASE}/report`);
    return res.json();
  },

  getExportUrl(format: 'csv' | 'json') {
    return `${API_BASE}/export/${format}`;
  }
};
