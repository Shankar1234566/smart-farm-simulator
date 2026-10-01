import React, { useState, useEffect } from 'react';
import { 
  Sliders, ArrowRight, Play, RefreshCw, 
  Sparkles, CheckCircle2, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { WhatIfScenarioResult } from '../types';
import { api } from '../services/api';

export const WhatIfView: React.FC = () => {
  const [tempDelta, setTempDelta] = useState<number>(5.0);
  const [rainDelta, setRainDelta] = useState<number>(-20.0);
  const [humidityDelta, setHumidityDelta] = useState<number>(-15.0);
  const [irrigationApplied, setIrrigationApplied] = useState<boolean>(true);
  const [daysAhead, setDaysAhead] = useState<number>(7);
  const [result, setResult] = useState<WhatIfScenarioResult | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  useEffect(() => {
    runWhatIf();
  }, []);

  const runWhatIf = async () => {
    setIsSimulating(true);
    try {
      const res = await api.simulateWhatIf({
        temp_delta: tempDelta,
        rain_delta: rainDelta,
        humidity_delta: humidityDelta,
        wind_delta: 0,
        irrigation_applied: irrigationApplied,
        days_ahead: daysAhead,
      });
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="content-area">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--green-healthy)' }}>
            WHAT-IF COUNTERFACTUAL CLIMATE SCENARIO SIMULATOR
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Model hypothetical climate variations and evaluate agronomic impact before executing decisions on the live farm.
          </p>
        </div>

        <button onClick={runWhatIf} disabled={isSimulating} className="btn btn-primary btn-sm">
          <Play size={14} /> RUN COUNTERFACTUAL SIMULATION
        </button>
      </div>

      {/* Interactive Controls */}
      <div className="agri-card" style={{ marginBottom: '20px' }}>
        <div className="agri-card-header">
          <span className="agri-title">
            <Sliders size={18} color="#38bdf8" /> COUNTERFACTUAL PARAMETER MODIFIERS
          </span>
          <span className="badge badge-tech">FORWARD LOOKING {daysAhead} DAYS</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {/* Temperature Delta */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
              <span>TEMPERATURE DELTA:</span>
              <strong style={{ color: tempDelta > 0 ? '#f87171' : '#38bdf8' }}>
                {tempDelta > 0 ? `+${tempDelta}°C` : `${tempDelta}°C`}
              </strong>
            </div>
            <input
              type="range"
              min={-8}
              max={15}
              step={0.5}
              value={tempDelta}
              onChange={(e) => setTempDelta(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          {/* Rainfall Delta */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
              <span>RAINFALL DELTA:</span>
              <strong style={{ color: rainDelta >= 0 ? '#38bdf8' : '#fb923c' }}>
                {rainDelta >= 0 ? `+${rainDelta} mm` : `${rainDelta} mm`}
              </strong>
            </div>
            <input
              type="range"
              min={-40}
              max={60}
              step={1}
              value={rainDelta}
              onChange={(e) => setRainDelta(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          {/* Relative Humidity Delta */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
              <span>HUMIDITY DELTA:</span>
              <strong style={{ color: '#fff' }}>
                {humidityDelta >= 0 ? `+${humidityDelta}%` : `${humidityDelta}%`}
              </strong>
            </div>
            <input
              type="range"
              min={-35}
              max={35}
              step={1}
              value={humidityDelta}
              onChange={(e) => setHumidityDelta(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          {/* Manager Action Choice */}
          <div>
            <div style={{ fontSize: '12px', marginBottom: '6px' }}>PREVENTIVE ACTION:</div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px' }}>
              <input
                type="checkbox"
                checked={irrigationApplied}
                onChange={(e) => setIrrigationApplied(e.target.checked)}
              />
              <span>Pre-emptive Irrigation (+30mm buffer)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Before vs After Projections */}
      {result && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {/* Baseline Live State */}
          <div className="agri-card">
            <div className="agri-card-header">
              <span className="agri-title" style={{ color: '#94a3b8' }}>
                CURRENT LIVE FARM BASELINE (DAY 1)
              </span>
              <span className="badge badge-tech">CURRENT</span>
            </div>

            <table className="data-table">
              <tbody>
                <tr>
                  <td>Healthy Canopy Area</td>
                  <td><strong style={{ color: '#34d399' }}>{result.baseline.healthy_pct}%</strong></td>
                </tr>
                <tr>
                  <td>Stressed / Critical Area</td>
                  <td><strong style={{ color: result.baseline.stressed_pct > 20 ? '#ef4444' : '#fbbf24' }}>{result.baseline.stressed_pct}%</strong></td>
                </tr>
                <tr>
                  <td>Average Soil Moisture</td>
                  <td><strong style={{ color: '#38bdf8' }}>{result.baseline.avg_soil_moisture}%</strong></td>
                </tr>
                <tr>
                  <td>Average Crop Stress</td>
                  <td><strong>{result.baseline.avg_crop_stress}%</strong></td>
                </tr>
                <tr>
                  <td>Projected Harvest Yield</td>
                  <td><strong style={{ color: '#a3e635' }}>{result.baseline.avg_yield}% of target</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Counterfactual Projected State */}
          <div className="agri-card" style={{ borderColor: 'var(--green-healthy)' }}>
            <div className="agri-card-header">
              <span className="agri-title" style={{ color: 'var(--green-healthy)' }}>
                PROJECTED FUTURE AFTER {daysAhead} DAYS
              </span>
              <span className="badge badge-healthy">COUNTERFACTUAL</span>
            </div>

            <table className="data-table">
              <tbody>
                <tr>
                  <td>Projected Healthy Canopy</td>
                  <td><strong style={{ color: '#34d399' }}>{result.projected.healthy_pct}%</strong></td>
                </tr>
                <tr>
                  <td>Projected Stressed Canopy</td>
                  <td><strong style={{ color: result.projected.stressed_pct > 25 ? '#ef4444' : '#34d399' }}>{result.projected.stressed_pct}%</strong></td>
                </tr>
                <tr>
                  <td>Projected Soil Moisture</td>
                  <td><strong style={{ color: '#38bdf8' }}>{result.projected.avg_soil_moisture}%</strong></td>
                </tr>
                <tr>
                  <td>Projected Crop Stress</td>
                  <td><strong>{result.projected.avg_crop_stress}%</strong></td>
                </tr>
                <tr>
                  <td>Net Yield Impact</td>
                  <td>
                    <strong style={{ color: result.projected.yield_impact_pct >= 0 ? '#34d399' : '#ef4444' }}>
                      {result.projected.yield_impact_pct >= 0 ? `+${result.projected.yield_impact_pct}%` : `${result.projected.yield_impact_pct}%`}
                    </strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Explanatory Factors Card */}
      {result && result.factors_summary && (
        <div className="agri-card">
          <div className="agri-card-header">
            <span className="agri-title">
              <Sparkles size={18} color="#34d399" /> AGRONOMIC CAUSAL MECHANISMS
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {result.factors_summary.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-main)' }}>
                <CheckCircle2 size={16} color="var(--green-healthy)" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
