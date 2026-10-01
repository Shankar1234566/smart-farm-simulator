import React from 'react';
import { HelpCircle, AlertTriangle, ShieldCheck, Sparkles, Compass } from 'lucide-react';

export const AboutHelpView: React.FC = () => {
  return (
    <div className="content-area">
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--green-healthy)' }}>
          ACADEMIC POSITIONING, RESEARCH LIMITATIONS & KNOWLEDGE BASE
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Honest academic disclosure • Research framing • Agronomic and Edge AI terminology glossary.
        </p>
      </div>

      {/* Project Honesty & Academic Positioning Banner */}
      <div className="agri-card" style={{ marginBottom: '20px', borderColor: '#38bdf8', backgroundColor: 'rgba(19, 34, 25, 0.95)' }}>
        <div className="agri-card-header">
          <span className="agri-title" style={{ color: '#38bdf8' }}>
            <ShieldCheck size={18} /> RESEARCH HONESTY & DEFENSE FRAMING (SECTION 73)
          </span>
          <span className="badge badge-tech">ACADEMIC INTEGRITY</span>
        </div>

        <p style={{ fontSize: '13px', color: '#f0fdf4', lineHeight: '1.6', marginBottom: '12px' }}>
          This system is strictly positioned as:
          <br />
          <em>“A software-based virtual agricultural environment for simulating scalable field deployment, integrating climate and satellite context into agricultural prediction, and evaluating computationally efficient AI strategies for edge-oriented agricultural decision support.”</em>
        </p>

        <div style={{ backgroundColor: '#0b1610', padding: '12px', borderRadius: '6px', borderLeft: '4px solid #ef4444', fontSize: '12px', color: '#fca5a5' }}>
          <strong>Explicit Research Disclosures:</strong>
          <ul style={{ marginLeft: '16px', marginTop: '4px' }}>
            <li>This project is completely software-based and does NOT require physical Arduino, ESP32, or LoRa hardware.</li>
            <li>Metrics marked as SIMULATED reflect mathematical and biological modeling equations, not real physical field sensors.</li>
            <li>Satellite passes are modeled periodically (7-day cadence) to reflect true remote sensing operational constraints.</li>
            <li>No claim of guaranteed real-world crop yield improvement is made without physical ground truthing.</li>
          </ul>
        </div>
      </div>

      {/* Academic Terminology Glossary */}
      <div className="agri-card" style={{ marginBottom: '20px' }}>
        <div className="agri-card-header">
          <span className="agri-title">
            <HelpCircle size={18} color="#c084fc" /> KEY CONCEPTS & DEFINITIONS
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '12px', borderRadius: '6px' }}>
            <strong style={{ color: 'var(--green-healthy)', fontSize: '13px' }}>NDVI (Normalized Difference Vegetation Index)</strong>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.4' }}>
              Formula: (NIR - Red) / (NIR + Red). Measures photosynthetic vigor and chlorophyll density. Values from 0.2 to 0.9 represent active healthy canopy.
            </p>
          </div>

          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '12px', borderRadius: '6px' }}>
            <strong style={{ color: '#38bdf8', fontSize: '13px' }}>NDMI (Normalized Difference Moisture Index)</strong>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.4' }}>
              Formula: (NIR - SWIR) / (NIR + SWIR). Highlights liquid water content in the crop canopy, serving as an indicator of drought and water deficit.
            </p>
          </div>

          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '12px', borderRadius: '6px' }}>
            <strong style={{ color: '#c084fc', fontSize: '13px' }}>Edge AI & On-Device Quantization</strong>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.4' }}>
              Converting 32-bit floating point model weights to 8-bit integers (INT8). Cuts model memory by 70%+ and accelerates CPU inference on low-power rural field gateways.
            </p>
          </div>

          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '12px', borderRadius: '6px' }}>
            <strong style={{ color: '#fbbf24', fontSize: '13px' }}>Multimodal Feature Fusion</strong>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.4' }}>
              Concatenating complementary data modalities: local ground moisture sensors + atmospheric 7-day forecast + orbital multi-spectral reflectances for robust predictive accuracy.
            </p>
          </div>

          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '12px', borderRadius: '6px' }}>
            <strong style={{ color: '#f87171', fontSize: '13px' }}>Decision Tree Pruning</strong>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.4' }}>
              Eliminating non-critical decision splits and deep branches, reducing tree depth from 12 to 4 to bound execution latency within deterministic microsecond budgets.
            </p>
          </div>

          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '12px', borderRadius: '6px' }}>
            <strong style={{ color: '#a3e635', fontSize: '13px' }}>Level of Detail (LOD) Field Aggregation</strong>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.4' }}>
              Downsampling spatial matrices when scaling from 100 to 100,000 zones to maintain 60 FPS rendering without consuming gigabytes of browser GPU/VRAM memory.
            </p>
          </div>
        </div>
      </div>

      {/* Limitations and Future Work */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="agri-card">
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#f87171', marginBottom: '8px' }}>
            RESEARCH LIMITATIONS (SECTION 74)
          </div>
          <ul style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '16px', lineHeight: '1.6' }}>
            <li>Purely virtual field simulation environment without real field hardware.</li>
            <li>Atmospheric forecasts contain inherent meteorological uncertainty.</li>
            <li>Synthetic crop biological relationships are approximations of complex plant pathology.</li>
            <li>Micro-controller latency benchmarks are measured on host CPU runtime.</li>
          </ul>
        </div>

        <div className="agri-card">
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--green-healthy)', marginBottom: '8px' }}>
            FUTURE WORK (SECTION 75)
          </div>
          <ul style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '16px', lineHeight: '1.6' }}>
            <li>Ground truth validation against open datasets (e.g. USDA / Copernicus Sentinel-2).</li>
            <li>Federated Learning across decentralized rural cooperative farm clusters.</li>
            <li>Integration of real OpenWeatherMap and Sentinel-Hub Copernicus APIs.</li>
            <li>Expansion to perennial tree crops, viticulture, and greenhouse hydroponics.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
