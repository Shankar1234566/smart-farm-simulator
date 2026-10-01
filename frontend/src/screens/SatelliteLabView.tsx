import React, { useState, useEffect } from 'react';
import { 
  Satellite, Calendar, ArrowRight, RefreshCw, 
  CheckCircle, Layers, AlertCircle, Sparkles
} from 'lucide-react';
import { SatellitePass } from '../types';
import { api } from '../services/api';

interface SatelliteLabViewProps {
  currentDay: number;
  onTriggerPass: () => void;
}

export const SatelliteLabView: React.FC<SatelliteLabViewProps> = ({
  currentDay,
  onTriggerPass,
}) => {
  const [history, setHistory] = useState<SatellitePass[]>([]);
  const [selectedPass, setSelectedPass] = useState<SatellitePass | null>(null);
  const [compareDayA, setCompareDayA] = useState<number>(1);
  const [compareDayB, setCompareDayB] = useState<number>(1);
  const [comparisonResult, setComparisonResult] = useState<any | null>(null);

  useEffect(() => {
    loadSatelliteData();
  }, [currentDay]);

  const loadSatelliteData = async () => {
    try {
      const data = await api.getSatelliteHistory();
      setHistory(data.observations);
      if (data.observations.length > 0) {
        setSelectedPass(data.observations[data.observations.length - 1]);
        if (data.observations.length >= 2) {
          setCompareDayA(data.observations[0].day);
          setCompareDayB(data.observations[data.observations.length - 1].day);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCompare = async () => {
    try {
      const res = await api.compareSatellite(compareDayA, compareDayB);
      setComparisonResult(res);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="content-area">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--green-healthy)' }}>
            SATELLITE REMOTE SENSING LABORATORY
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Simulating periodic Sentinel-2 MSI orbital observations • Multi-spectral vegetative indices (NDVI, NDMI, LST)
          </p>
        </div>

        <button onClick={onTriggerPass} className="btn btn-primary btn-sm">
          <Satellite size={14} /> TRIGGER ORBITAL PASS NOW
        </button>
      </div>

      {/* Latest Orbital Telemetry */}
      {selectedPass && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
          <div className="agri-card">
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>MEAN CANOPY NDVI</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#34d399', margin: '4px 0' }}>
              {selectedPass.avg_ndvi}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>NIR / Red Band Ratio</div>
          </div>

          <div className="agri-card">
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>CANOPY MOISTURE (NDMI)</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#38bdf8', margin: '4px 0' }}>
              {selectedPass.avg_ndmi}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>SWIR Absorption Index</div>
          </div>

          <div className="agri-card">
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>LAND SURFACE TEMP (LST)</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#fb923c', margin: '4px 0' }}>
              {selectedPass.avg_lst}°C
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Thermal Infrared Band (TIRS)</div>
          </div>

          <div className="agri-card">
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>STRESSED CANOPY AREA</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: selectedPass.stressed_pct > 20 ? '#ef4444' : '#a3e635', margin: '4px 0' }}>
              {selectedPass.stressed_pct}%
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Cloud Cover: {selectedPass.cloud_cover_pct}%</div>
          </div>
        </div>
      )}

      {/* Observation History Timeline */}
      <div className="agri-card" style={{ marginBottom: '20px' }}>
        <div className="agri-card-header">
          <span className="agri-title">
            <Calendar size={18} color="#34d399" /> ORBITAL PASS CATALOG & TIMELINE
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Observed every 7 simulated days (Sentinel-2 revisit constellation cycle)
          </span>
        </div>

        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '6px 0' }}>
          {history.map((p) => {
            const isSelected = selectedPass?.pass_id === p.pass_id;
            return (
              <button
                key={p.pass_id}
                onClick={() => setSelectedPass(p)}
                style={{
                  backgroundColor: isSelected ? 'var(--bg-panel-hover)' : 'var(--bg-secondary)',
                  border: isSelected ? '2px solid var(--green-healthy)' : '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  minWidth: '130px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: '#fff'
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--green-healthy)' }}>
                  DAY {p.day}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{p.pass_id}</div>
                <div style={{ fontSize: '13px', fontWeight: 800, marginTop: '4px' }}>
                  NDVI: {p.avg_ndvi}
                </div>
                <div style={{ fontSize: '10px', color: p.stressed_pct > 25 ? '#f87171' : '#86efac' }}>
                  {p.stressed_pct}% Stressed
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Date Comparison Engine */}
      <div className="agri-card" style={{ marginBottom: '20px' }}>
        <div className="agri-card-header">
          <span className="agri-title">
            <Layers size={18} color="#38bdf8" /> MULTI-TEMPORAL CHANGE DETECTION (DATE COMPARISON)
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Compare Day:</span>
            <select
              value={compareDayA}
              onChange={(e) => setCompareDayA(Number(e.target.value))}
              style={{ backgroundColor: 'var(--bg-panel)', color: '#fff', border: '1px solid var(--border-color)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}
            >
              {history.map(p => <option key={p.day} value={p.day}>Day {p.day}</option>)}
            </select>

            <ArrowRight size={14} color="var(--text-muted)" />

            <select
              value={compareDayB}
              onChange={(e) => setCompareDayB(Number(e.target.value))}
              style={{ backgroundColor: 'var(--bg-panel)', color: '#fff', border: '1px solid var(--border-color)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}
            >
              {history.map(p => <option key={p.day} value={p.day}>Day {p.day}</option>)}
            </select>

            <button onClick={handleCompare} className="btn btn-secondary btn-sm">
              Compute Difference
            </button>
          </div>
        </div>

        {comparisonResult && !comparisonResult.error && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', padding: '10px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px' }}>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>DELTA NDVI</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: comparisonResult.delta_ndvi >= 0 ? '#34d399' : '#f87171' }}>
                {comparisonResult.delta_ndvi > 0 ? `+${comparisonResult.delta_ndvi}` : comparisonResult.delta_ndvi}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Vegetation biomass change</div>
            </div>

            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>DELTA NDMI</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: comparisonResult.delta_ndmi >= 0 ? '#38bdf8' : '#f87171' }}>
                {comparisonResult.delta_ndmi > 0 ? `+${comparisonResult.delta_ndmi}` : comparisonResult.delta_ndmi}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Canopy water content</div>
            </div>

            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>DELTA LST</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: comparisonResult.delta_lst <= 0 ? '#34d399' : '#fb923c' }}>
                {comparisonResult.delta_lst > 0 ? `+${comparisonResult.delta_lst}°C` : `${comparisonResult.delta_lst}°C`}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Surface thermal change</div>
            </div>

            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>STRESSED AREA CHANGE</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: comparisonResult.delta_stressed_pct <= 0 ? '#34d399' : '#ef4444' }}>
                {comparisonResult.delta_stressed_pct > 0 ? `+${comparisonResult.delta_stressed_pct}%` : `${comparisonResult.delta_stressed_pct}%`}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Spatial risk expansion</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
