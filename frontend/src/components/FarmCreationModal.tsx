import React, { useState } from 'react';
import { Layers, X, Sparkles } from 'lucide-react';
import { CropType, ConnectivityStatus } from '../types';

interface FarmCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (config: {
    crop: CropType;
    size: number;
    climate: string;
    connectivity: ConnectivityStatus;
    model: string;
    seasonDays: number;
  }) => void;
}

export const FarmCreationModal: React.FC<FarmCreationModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
}) => {
  const [crop, setCrop] = useState<CropType>('Rice');
  const [size, setSize] = useState<number>(100);
  const [climate, setClimate] = useState<string>('Normal');
  const [connectivity, setConnectivity] = useState<ConnectivityStatus>('GOOD');
  const [model, setModel] = useState<string>('STANDARD');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--green-healthy)' }}>
              FARM GENERATION & EXPERIMENT SETUP
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Configure virtual field parameters, climate regime, edge computing profile, and network resilience.
            </p>
          </div>
          <button onClick={onClose} className="btn btn-outline btn-sm">
            <X size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Crop Selector */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
              AGRICULTURAL CROP SPECIES
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
              {(['Rice', 'Maize', 'Cotton', 'Chilli', 'Wheat'] as CropType[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCrop(c)}
                  className={`btn ${crop === c ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '12px', padding: '8px 4px' }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Farm Size */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
              FIELD SCALE (VIRTUAL ZONES)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {[
                { count: 100, label: '100 Zones', desc: 'Detailed Grid' },
                { count: 1000, label: '1,000 Zones', desc: 'Regional Plot' },
                { count: 10000, label: '10,000 Zones', desc: 'Commercial' },
                { count: 100000, label: '100,000 Zones', desc: 'Mega-Watershed' },
              ].map((s) => (
                <button
                  key={s.count}
                  onClick={() => setSize(s.count)}
                  className={`btn ${size === s.count ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ display: 'flex', flexDirection: 'column', padding: '8px 4px' }}
                >
                  <strong>{s.label}</strong>
                  <span style={{ fontSize: '10px', opacity: 0.8 }}>{s.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Climate Regime */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
              CLIMATE REGIME / SCENARIO PRESET
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {[
                { id: 'Normal', label: 'Normal Climate', desc: 'Balanced precipitation' },
                { id: 'Drought', label: 'Drought Stress', desc: 'Persistent water deficit' },
                { id: 'Heatwave', label: 'Heatwave Extreme', desc: 'High thermal load' },
                { id: 'Heavy Rain', label: 'Heavy Monsoonal Rain', desc: 'Saturation & disease risk' },
                { id: 'Delayed Rainfall', label: 'Delayed Rainfall', desc: 'Precipitation lag' },
                { id: 'Extreme Humidity', label: 'Extreme Humidity', desc: 'Fungal environment' },
              ].map((cl) => (
                <button
                  key={cl.id}
                  onClick={() => setClimate(cl.id)}
                  className={`btn ${climate === cl.id ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ display: 'flex', flexDirection: 'column', padding: '8px 4px', textAlign: 'left' }}
                >
                  <strong>{cl.label}</strong>
                  <span style={{ fontSize: '10px', opacity: 0.8 }}>{cl.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Network Connectivity */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
              NETWORK CONNECTIVITY SIMULATION
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {[
                { id: 'GOOD', label: 'Good (Cloud)', desc: '100% cloud access' },
                { id: 'WEAK', label: 'Weak 2G/3G', desc: 'High latency' },
                { id: 'INTERMITTENT', label: 'Intermittent', desc: 'Frequent drops' },
                { id: 'OFFLINE', label: 'Offline Edge', desc: 'Local model only' },
              ].map((net) => (
                <button
                  key={net.id}
                  onClick={() => setConnectivity(net.id as ConnectivityStatus)}
                  className={`btn ${connectivity === net.id ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ display: 'flex', flexDirection: 'column', padding: '8px 4px' }}
                >
                  <strong>{net.label}</strong>
                  <span style={{ fontSize: '10px', opacity: 0.8 }}>{net.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Model Strategy */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
              INITIAL AI MODEL ARCHITECTURE
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {[
                { id: 'STANDARD', label: 'Standard Multimodal', desc: '94% acc, 1.2MB, 15ms' },
                { id: 'EDGE_OPTIMIZED', label: 'Quantized Edge Model', desc: '91% acc, 64KB, 1.4ms' },
                { id: 'ADAPTIVE', label: 'Adaptive Hybrid Router', desc: '93% acc, Dynamic budget' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setModel(m.id)}
                  className={`btn ${model === m.id ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ display: 'flex', flexDirection: 'column', padding: '8px 6px', textAlign: 'left' }}
                >
                  <strong>{m.label}</strong>
                  <span style={{ fontSize: '10px', opacity: 0.8 }}>{m.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button
              onClick={() => {
                onGenerate({ crop, size, climate, connectivity, model, seasonDays: 120 });
                onClose();
              }}
              className="btn btn-primary"
              style={{ padding: '8px 24px', fontSize: '14px' }}
            >
              <Sparkles size={16} /> GENERATE FARM
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
