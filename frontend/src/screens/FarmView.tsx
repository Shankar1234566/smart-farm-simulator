import React, { useState } from 'react';
import { 
  Droplets, ShieldAlert, Sparkles, Filter, 
  Layers, RefreshCw, AlertCircle, CheckCircle, Info
} from 'lucide-react';
import { FarmCanvas } from '../components/FarmCanvas';
import { ZoneInspector } from '../components/ZoneInspector';
import { FarmZone, MapMode, ActionType } from '../types';

interface FarmViewProps {
  zones: FarmZone[];
  farmSize: number;
  crop: string;
  summary: any;
  activeEvents: any[];
  selectedZone: FarmZone | null;
  onSelectZone: (zone: FarmZone) => void;
  onApplyAction: (action: ActionType, zoneId?: number) => void;
  onRunAi: () => void;
  onTriggerEvent: (eventType: string) => void;
}

export const FarmView: React.FC<FarmViewProps> = ({
  zones,
  farmSize,
  crop,
  summary,
  activeEvents,
  selectedZone,
  onSelectZone,
  onApplyAction,
  onRunAi,
  onTriggerEvent,
}) => {
  const [mapMode, setMapMode] = useState<MapMode>('CROP_HEALTH');
  const [batchActionNotice, setBatchActionNotice] = useState<string | null>(null);

  const mapModes: { id: MapMode; label: string; desc: string }[] = [
    { id: 'NORMAL', label: 'Realistic Farm', desc: 'Canopy & Soil' },
    { id: 'CROP_HEALTH', label: 'Crop Health', desc: 'Green to Red' },
    { id: 'SOIL_MOISTURE', label: 'Soil Moisture', desc: 'Hydration Level' },
    { id: 'WATER_STRESS', label: 'Water Stress', desc: 'Transpiration Deficit' },
    { id: 'DISEASE_RISK', label: 'Disease Risk', desc: 'Pathogen Hazard' },
    { id: 'CLIMATE_RISK', label: 'Climate Risk', desc: 'Thermal Extremes' },
    { id: 'NDVI', label: 'NDVI (Orbital)', desc: 'Vegetation Greenness' },
    { id: 'NDMI', label: 'NDMI (Moisture)', desc: 'Water Index' },
    { id: 'LST', label: 'LST Surface Temp', desc: 'Thermal Infrared' },
    { id: 'YIELD_RISK', label: 'Yield Risk', desc: 'Harvest Potential' },
    { id: 'AI_CONFIDENCE', label: 'AI Confidence', desc: 'Model Certainty' },
    { id: 'COMPUTE_LOAD', label: 'Compute Load', desc: 'Edge vs Cloud' },
  ];

  const handleBatchIrrigate = () => {
    onApplyAction('IRRIGATE');
    setBatchActionNotice('Field-wide irrigation applied (+25mm across all zones).');
    setTimeout(() => setBatchActionNotice(null), 4000);
  };

  const handleBatchProtection = () => {
    onApplyAction('APPLY_PROTECTION');
    setBatchActionNotice('Bio-fungicide barrier applied to all susceptible plots.');
    setTimeout(() => setBatchActionNotice(null), 4000);
  };

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%', overflow: 'hidden' }}>
      {/* Main Canvas and Toolbar Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '16px' }}>
        
        {/* Active Climate Event Warning Banner */}
        {activeEvents && activeEvents.length > 0 && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            borderRadius: '8px',
            padding: '10px 16px',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertCircle size={20} color="#f87171" />
              <div>
                <strong style={{ color: '#fca5a5' }}>
                  CLIMATE EVENT ACTIVE: {activeEvents[0].name} ({activeEvents[0].severity})
                </strong>
                <div style={{ fontSize: '11px', color: '#fecaca' }}>
                  Duration: {activeEvents[0].days_remaining} days remaining. Soil moisture and canopy thermal stress elevated.
                </div>
              </div>
            </div>
            <button onClick={() => onApplyAction('IRRIGATE')} className="btn btn-primary btn-sm">
              <Droplets size={12} /> MITIGATE HEAT (IRRIGATE)
            </button>
          </div>
        )}

        {/* Action Notice */}
        {batchActionNotice && (
          <div style={{
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            border: '1px solid #10b981',
            borderRadius: '6px',
            padding: '8px 12px',
            marginBottom: '10px',
            fontSize: '12px',
            color: '#6ee7b7',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle size={16} /> {batchActionNotice}
          </div>
        )}

        {/* Top Controls: Map Modes & Batch Actions */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '10px 14px',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          {/* Map Layer Mode Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', maxWidth: '70%' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Layers size={14} /> LAYER:
            </span>
            {mapModes.map((m) => (
              <button
                key={m.id}
                onClick={() => setMapMode(m.id)}
                className={`btn btn-sm ${mapMode === m.id ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '11px', padding: '3px 8px', whiteSpace: 'nowrap' }}
                title={m.desc}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button onClick={onRunAi} className="btn btn-secondary btn-sm" style={{ color: '#38bdf8', borderColor: '#0284c7' }}>
              <Sparkles size={13} /> RUN AI PREDICTION
            </button>
            <button onClick={handleBatchIrrigate} className="btn btn-secondary btn-sm">
              <Droplets size={13} /> IRRIGATE ALL
            </button>
          </div>
        </div>

        {/* Grid Canvas */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 0 }}>
          <FarmCanvas
            zones={zones}
            farmSize={farmSize}
            activeMapMode={mapMode}
            selectedZoneId={selectedZone?.zone_id}
            onSelectZone={onSelectZone}
          />
        </div>

        {/* Legend Footer */}
        <div style={{
          marginTop: '10px',
          backgroundColor: 'var(--bg-panel)',
          border: '1px solid var(--border-color)',
          borderRadius: '6px',
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>HEALTH LEGEND:</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10b981' }} /> Healthy ({summary?.health_distribution?.Healthy || 0})
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#f59e0b' }} /> Moderate ({summary?.health_distribution?.Moderate || 0})
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#f97316' }} /> Stressed ({summary?.health_distribution?.Stressed || 0})
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ef4444' }} /> Critical ({summary?.health_distribution?.Critical || 0})
            </span>
          </div>

          <div style={{ color: 'var(--text-muted)' }}>
            Showing <strong>{zones.length}</strong> active virtual zones • Click any zone to inspect & act
          </div>
        </div>
      </div>

      {/* Right Zone Inspector Drawer */}
      <ZoneInspector
        zone={selectedZone}
        onClose={() => onSelectZone(null as any)}
        onApplyAction={(act, zid) => onApplyAction(act, zid)}
        onRunAi={onRunAi}
      />
    </div>
  );
};
