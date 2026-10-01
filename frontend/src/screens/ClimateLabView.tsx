import React, { useState, useEffect } from 'react';
import { 
  CloudSun, CloudRain, Flame, Droplets, Wind, 
  AlertTriangle, Play, RefreshCw, Zap, ShieldAlert
} from 'lucide-react';
import { WeatherCurrent, WeatherForecastDay } from '../types';
import { api } from '../services/api';

interface ClimateLabViewProps {
  weather: WeatherCurrent;
  onTriggerEvent: (eventType: string, severity?: string, duration?: number) => void;
  onRefresh: () => void;
}

export const ClimateLabView: React.FC<ClimateLabViewProps> = ({
  weather,
  onTriggerEvent,
  onRefresh,
}) => {
  const [forecast, setForecast] = useState<WeatherForecastDay[]>([]);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('MODERATE');
  const [selectedDuration, setSelectedDuration] = useState<number>(4);
  const [triggerStatus, setTriggerStatus] = useState<string | null>(null);

  useEffect(() => {
    loadForecast();
  }, []);

  const loadForecast = async () => {
    try {
      const data = await api.getForecast(7);
      setForecast(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleTrigger = (eventType: string) => {
    onTriggerEvent(eventType, selectedSeverity, selectedDuration);
    setTriggerStatus(`Event ${eventType} (${selectedSeverity}, ${selectedDuration} days) triggered!`);
    setTimeout(() => setTriggerStatus(null), 4000);
  };

  return (
    <div className="content-area">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--green-healthy)' }}>
            CLIMATE & METEOROLOGICAL LAB
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Dynamic climate simulation, multi-day agricultural forecasting, and synthetic extreme event injector.
          </p>
        </div>

        <button onClick={onRefresh} className="btn btn-secondary btn-sm">
          <RefreshCw size={14} /> Refresh Atmospheric Data
        </button>
      </div>

      {triggerStatus && (
        <div style={{
          backgroundColor: 'rgba(249, 115, 22, 0.2)',
          border: '1px solid #f97316',
          borderRadius: '8px',
          padding: '10px 16px',
          color: '#fed7aa',
          fontSize: '13px',
          marginBottom: '16px'
        }}>
          ⚡ {triggerStatus}
        </div>
      )}

      {/* Atmospheric State Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
        <div className="agri-card">
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>AMBIENT TEMPERATURE</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: weather.temperature > 34 ? '#f87171' : '#34d399', margin: '4px 0' }}>
            {weather.temperature}°C
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Thermal Stress: {weather.heatwave_risk > 30 ? 'ELEVATED' : 'NOMINAL'}</div>
        </div>

        <div className="agri-card">
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>RELATIVE HUMIDITY</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: weather.humidity > 80 ? '#fbbf24' : '#38bdf8', margin: '4px 0' }}>
            {weather.humidity}%
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Pathogen Environment: {weather.humidity > 78 ? 'HIGH RISK' : 'LOW'}</div>
        </div>

        <div className="agri-card">
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>24-HOUR PRECIPITATION</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#60a5fa', margin: '4px 0' }}>
            {weather.rainfall} mm
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Rain Probability: {weather.rain_probability}%</div>
        </div>

        <div className="agri-card">
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>DROUGHT STRESS INDEX</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: weather.drought_index > 40 ? '#f97316' : '#a3e635', margin: '4px 0' }}>
            {weather.drought_index} <span style={{ fontSize: '13px' }}>/ 100</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Evapotranspiration Load: Active</div>
        </div>
      </div>

      {/* 7-Day Agricultural Forecast */}
      <div className="agri-card" style={{ marginBottom: '20px' }}>
        <div className="agri-card-header">
          <span className="agri-title">
            <CloudSun size={18} color="#38bdf8" /> 7-DAY AGRICULTURAL RISK & IRRIGATION PROJECTION
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Model forecasts natural precipitation to optimize water conservation
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
          {forecast.map((f, i) => (
            <div key={i} style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '10px 8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>{f.day_label}</div>
              <div style={{ fontSize: '12px', fontWeight: 800, margin: '6px 0', color: '#6ee7b7' }}>
                {f.temp_min}° / {f.temp_max}°
              </div>
              <div style={{ fontSize: '11px', color: '#38bdf8' }}>
                {f.rainfall} mm ({f.rain_probability}%)
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', margin: '4px 0' }}>
                {f.condition}
              </div>

              <div style={{ marginTop: '8px' }}>
                <span className={`badge ${f.irrigation_opportunity === 'DO_NOT_IRRIGATE' ? 'badge-critical' : (f.irrigation_opportunity === 'OPTIMAL' ? 'badge-healthy' : 'badge-moderate')}`} style={{ fontSize: '9px', padding: '1px 4px' }}>
                  {f.irrigation_opportunity.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Climate Event Injection Lab */}
      <div className="agri-card" style={{ marginBottom: '20px' }}>
        <div className="agri-card-header">
          <span className="agri-title">
            <Zap size={18} color="#fbbf24" /> CLIMATE SHOCK INJECTOR (EXPERIMENT SANDBOX)
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Severity:</span>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              style={{ backgroundColor: 'var(--bg-panel)', color: '#fff', border: '1px solid var(--border-color)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px' }}
            >
              <option value="MILD">MILD</option>
              <option value="MODERATE">MODERATE</option>
              <option value="SEVERE">SEVERE</option>
              <option value="EXTREME">EXTREME</option>
            </select>

            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Duration:</span>
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(Number(e.target.value))}
              style={{ backgroundColor: 'var(--bg-panel)', color: '#fff', border: '1px solid var(--border-color)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px' }}
            >
              <option value={2}>2 Days</option>
              <option value={4}>4 Days</option>
              <option value={7}>7 Days</option>
              <option value={14}>14 Days</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <button onClick={() => handleTrigger('HEATWAVE')} className="btn btn-secondary" style={{ padding: '12px', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f87171', fontWeight: 700 }}>
              <Flame size={16} /> TRIGGER HEATWAVE
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Spikes temp +7.5°C, accelerates soil moisture depletion, raises thermal stress.
            </span>
          </button>

          <button onClick={() => handleTrigger('DROUGHT')} className="btn btn-secondary" style={{ padding: '12px', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fb923c', fontWeight: 700 }}>
              <Sun size={16} /> TRIGGER DROUGHT
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Eliminates rainfall, raises water deficit, challenges AI irrigation scheduling.
            </span>
          </button>

          <button onClick={() => handleTrigger('HEAVY_RAIN')} className="btn btn-secondary" style={{ padding: '12px', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#60a5fa', fontWeight: 700 }}>
              <CloudRain size={16} /> TRIGGER HEAVY MONSOON
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Dumps +45mm rain, creates root saturation, elevates fungal risk.
            </span>
          </button>

          <button onClick={() => handleTrigger('HUMIDITY_SPIKE')} className="btn btn-secondary" style={{ padding: '12px', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c084fc', fontWeight: 700 }}>
              <Droplets size={16} /> TRIGGER HUMIDITY SPIKE
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Elevates relative humidity to 95%+, triggering pathogen advisories.
            </span>
          </button>

          <button onClick={() => handleTrigger('DELAYED_RAIN')} className="btn btn-secondary" style={{ padding: '12px', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24', fontWeight: 700 }}>
              <Clock size={16} /> DELAYED RAINFALL SCENARIO
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Simulates forecast inaccuracy: expected rain fails to arrive.
            </span>
          </button>

          <button onClick={() => handleTrigger('EXTREME_TEMPERATURE')} className="btn btn-secondary" style={{ padding: '12px', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontWeight: 700 }}>
              <AlertTriangle size={16} /> EXTREME THERMAL SPIKE
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Severe 42°C+ peak causing rapid chlorophyll degradation.
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

const Sun = ({ size }: { size: number }) => <CloudSun size={size} />;
const Clock = ({ size }: { size: number }) => <CloudRain size={size} />;
