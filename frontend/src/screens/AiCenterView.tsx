import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, Sparkles, Cpu, Layers, CheckCircle2, 
  Activity, ArrowDown, ShieldCheck, Zap
} from 'lucide-react';
import { AIModelProfile } from '../types';
import { api } from '../services/api';

interface AiCenterViewProps {
  onRunAi: (modelType?: string) => void;
}

export const AiCenterView: React.FC<AiCenterViewProps> = ({ onRunAi }) => {
  const [profiles, setProfiles] = useState<{ standard?: AIModelProfile; edge_optimized?: AIModelProfile; adaptive?: AIModelProfile }>({});
  const [selectedModel, setSelectedModel] = useState<string>('STANDARD');
  const [lastPredictionResult, setLastPredictionResult] = useState<any | null>(null);
  const [isInferring, setIsInferring] = useState<boolean>(false);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const data = await api.getAiProfiles();
      setProfiles(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleInference = async () => {
    setIsInferring(true);
    try {
      const res = await api.runAiPredict(selectedModel);
      setLastPredictionResult(res);
      onRunAi(selectedModel);
    } catch (e) {
      console.error(e);
    } finally {
      setIsInferring(false);
    }
  };

  return (
    <div className="content-area">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--green-healthy)' }}>
            MULTIMODAL AGRICULTURAL AI DECISION CENTER
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Feature fusion of Ground In-Situ Telemetry + Climate Projections + Orbital Remote Sensing
          </p>
        </div>

        <button
          onClick={handleInference}
          disabled={isInferring}
          className="btn btn-primary"
          style={{ padding: '8px 20px', fontSize: '13px' }}
        >
          <Sparkles size={16} /> {isInferring ? 'EXECUTING INFERENCE...' : 'RUN FIELD-WIDE AI INFERENCE'}
        </button>
      </div>

      {/* Multimodal Architecture Fusion Diagram */}
      <div className="agri-card" style={{ marginBottom: '20px' }}>
        <div className="agri-card-header">
          <span className="agri-title">
            <Layers size={18} color="#38bdf8" /> MULTIMODAL FEATURE FUSION PIPELINE
          </span>
          <span className="badge badge-tech">END-TO-END DATA SCIENCE PIPELINE</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', textAlign: 'center', marginBottom: '14px' }}>
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--green-healthy)' }}>GROUND SENSORS</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Soil Moisture • Root Zone Temp • Micro-Humidity • Canopy Stress
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#38bdf8' }}>WEATHER PROJECTIONS</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
              24h/72h Rain • Rain Prob % • Heatwave Hazard • Evaporative Deficit
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#c084fc' }}>ORBITAL SATELLITE</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Sentinel-2 NDVI • NDMI Water Index • Land Surface Temp (LST)
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#fbbf24' }}>HISTORICAL PHENOLOGY</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Growth Stage Progress • Accumulated Stress • Phenological Target
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <ArrowDown size={18} color="var(--green-healthy)" />
          <div style={{ backgroundColor: 'var(--bg-panel-hover)', padding: '8px 24px', borderRadius: '20px', border: '1px solid var(--green-healthy)', fontWeight: 700, color: '#f0fdf4' }}>
            FEATURE FUSION LAYER (14 Multimodal Normalized Input Vectors)
          </div>
        </div>
      </div>

      {/* Model Architecture Profiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
        {[
          { key: 'STANDARD', profile: profiles.standard, title: 'Standard Multimodal Model', badge: 'High Fidelity' },
          { key: 'EDGE_OPTIMIZED', profile: profiles.edge_optimized, title: 'Edge-Optimized Compact Model', badge: 'Ultra-Low Latency' },
          { key: 'ADAPTIVE', profile: profiles.adaptive, title: 'Adaptive Dynamic Router', badge: 'Resource-Aware' }
        ].map((m) => {
          const isSelected = selectedModel === m.key;
          const p = m.profile;
          if (!p) return null;
          return (
            <div
              key={m.key}
              onClick={() => setSelectedModel(m.key)}
              style={{
                backgroundColor: isSelected ? 'var(--bg-panel-hover)' : 'var(--bg-panel)',
                border: isSelected ? '2px solid var(--green-healthy)' : '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '16px',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="badge badge-tech">{m.badge}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.version}</span>
              </div>

              <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
                {m.title}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                <div>Accuracy: <strong style={{ color: '#34d399' }}>{p.accuracy}%</strong></div>
                <div>F1 Score: <strong style={{ color: '#34d399' }}>{p.f1_score}</strong></div>
                <div>Inference Latency: <strong>{p.latency_per_100_ms} ms</strong></div>
                <div>RAM Memory: <strong>{p.memory_ram_mb} MB</strong></div>
                <div>Model Footprint: <strong style={{ color: '#c084fc' }}>{p.model_size_kb} KB</strong></div>
                <div>Input Features: <strong>{p.features_count}</strong></div>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); setSelectedModel(m.key); }}
                className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                style={{ width: '100%', marginTop: '14px' }}
              >
                {isSelected ? '✓ ACTIVE ENGINE' : 'ACTIVATE MODEL'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Latest Batch Inference Run Report */}
      {lastPredictionResult && (
        <div className="agri-card">
          <div className="agri-card-header">
            <span className="agri-title">
              <Activity size={18} color="#34d399" /> LATEST MODEL INFERENCE EXECUTION TELEMETRY
            </span>
            <span className="badge badge-healthy">SUCCESSFUL RUN</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ZONES CLASSIFIED</div>
              <div style={{ fontSize: '20px', fontWeight: 800 }}>{lastPredictionResult.zones_processed}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>MEASURED WALL-CLOCK LATENCY</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#38bdf8' }}>{lastPredictionResult.inference_latency_ms} ms</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>AVERAGE MODEL CONFIDENCE</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#34d399' }}>{lastPredictionResult.avg_confidence}%</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>DEPLOYED ARCHITECTURE</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#c084fc', marginTop: '4px' }}>{lastPredictionResult.version}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
