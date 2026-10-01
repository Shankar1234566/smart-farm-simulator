import React from 'react';
import { 
  Droplets, Thermometer, Wind, Eye, 
  ShieldCheck, AlertTriangle, Sparkles, CheckCircle2, X
} from 'lucide-react';
import { FarmZone, ActionType } from '../types';

interface ZoneInspectorProps {
  zone: FarmZone | null;
  onClose: () => void;
  onApplyAction: (action: ActionType, zoneId: number) => void;
  onRunAi: () => void;
}

export const ZoneInspector: React.FC<ZoneInspectorProps> = ({
  zone,
  onClose,
  onApplyAction,
  onRunAi
}) => {
  if (!zone) return null;

  const rec = zone.ai_recommendation;

  const getHealthBadgeClass = (h: string) => {
    switch (h) {
      case 'Healthy': return 'badge-healthy';
      case 'Moderate': return 'badge-moderate';
      case 'Stressed': return 'badge-stressed';
      case 'Critical': return 'badge-critical';
      default: return 'badge-tech';
    }
  };

  return (
    <div style={{
      width: '360px',
      backgroundColor: 'var(--bg-secondary)',
      borderLeft: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      height: '100%',
      overflowY: 'auto'
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'var(--bg-panel)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
              ZONE #{zone.zone_id}
            </span>
            <span className={`badge ${getHealthBadgeClass(zone.crop_health)}`}>
              {zone.crop_health}
            </span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {zone.crop_type} • Stage: {zone.growth_stage} ({zone.growth_stage_progress}%)
          </div>
        </div>

        <button onClick={onClose} className="btn btn-outline btn-sm" style={{ padding: '2px 6px' }}>
          <X size={14} />
        </button>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Multimodal AI Recommendation Card */}
        {rec && (
          <div style={{
            backgroundColor: 'var(--bg-panel)',
            border: '1px solid var(--border-highlight)',
            borderRadius: '8px',
            padding: '14px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#38bdf8' }}>
                <Sparkles size={14} /> AI DECISION ADVISORY
              </div>
              <span className="badge badge-tech" style={{ fontSize: '10px' }}>
                {rec.confidence}% CONFIDENCE
              </span>
            </div>

            <div style={{ fontSize: '14px', fontWeight: 800, color: '#6ee7b7', marginBottom: '6px' }}>
              {rec.recommendation}
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '10px' }}>
              {rec.rationale}
            </div>

            {/* Contributing factors */}
            {rec.factors && rec.factors.length > 0 && (
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  KEY DRIVING SIGNALS
                </div>
                {rec.factors.map((f, i) => (
                  <div key={i} style={{ fontSize: '11px', display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-main)' }}>{f.name}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{f.description}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Controls */}
        <div className="agri-card" style={{ padding: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
            AI FARM MANAGER ACTIONS
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button onClick={() => onApplyAction('IRRIGATE', zone.zone_id)} className="btn btn-primary btn-sm">
              <Droplets size={13} /> IRRIGATE
            </button>
            <button onClick={() => onApplyAction('DELAY', zone.zone_id)} className="btn btn-secondary btn-sm">
              DELAY (RAIN)
            </button>
            <button onClick={() => onApplyAction('MONITOR', zone.zone_id)} className="btn btn-secondary btn-sm">
              <Eye size={13} /> MONITOR
            </button>
            <button onClick={() => onApplyAction('INSPECT', zone.zone_id)} className="btn btn-secondary btn-sm">
              <CheckCircle2 size={13} /> INSPECT
            </button>
            <button onClick={() => onApplyAction('APPLY_PROTECTION', zone.zone_id)} className="btn btn-secondary btn-sm" style={{ gridColumn: 'span 2' }}>
              <ShieldCheck size={13} /> APPLY BIO-PROTECTION
            </button>
          </div>
        </div>

        {/* Ground In-Situ Telemetry */}
        <div className="agri-card" style={{ padding: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
            GROUND SENSORS (IN-SITU)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
            <div>Moisture: <strong>{zone.soil_moisture}%</strong></div>
            <div>Temp: <strong>{zone.temperature}°C</strong></div>
            <div>Humidity: <strong>{zone.humidity}%</strong></div>
            <div>Wind: <strong>{zone.wind} km/h</strong></div>
            <div>Rain 24h: <strong>{zone.rainfall} mm</strong></div>
            <div>Water Need: <strong>{zone.water_requirement} mm/d</strong></div>
          </div>
        </div>

        {/* Remote Sensing / Satellite Telemetry */}
        <div className="agri-card" style={{ padding: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
            ORBITAL MULTI-SPECTRAL (SENTINEL-2)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
            <div>NDVI: <strong style={{ color: '#34d399' }}>{zone.NDVI}</strong></div>
            <div>NDMI: <strong>{zone.NDMI}</strong></div>
            <div>LST: <strong>{zone.LST}°C</strong></div>
            <div>Last Pass: <strong>Day {zone.last_satellite_update}</strong></div>
          </div>
        </div>

        {/* Forecast Readout */}
        <div className="agri-card" style={{ padding: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
            WEATHER PROJECTION
          </div>
          <div style={{ fontSize: '12px' }}>
            <div>Rain Expected: <strong>{zone.forecast_rainfall} mm</strong></div>
            <div>Rain Probability: <strong>{zone.rain_probability}%</strong></div>
            <div>Disease Risk: <strong>{zone.disease_probability}%</strong></div>
            <div>Yield Estimate: <strong style={{ color: '#fbbf24' }}>{zone.yield_estimate}% of target</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};
