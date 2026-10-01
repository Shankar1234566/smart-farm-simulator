import React, { useState, useEffect } from 'react';
import { 
  Cpu, Zap, Sliders, CheckSquare, Square, 
  ArrowRight, Sparkles, Scale, RefreshCw
} from 'lucide-react';
import { api } from '../services/api';

export const AiOptimizationView: React.FC = () => {
  const [quantize, setQuantize] = useState<boolean>(true);
  const [prune, setPrune] = useState<boolean>(true);
  const [reduceFeatures, setReduceFeatures] = useState<boolean>(true);
  const [compress, setCompress] = useState<boolean>(true);
  const [benchmarkResult, setBenchmarkResult] = useState<any | null>(null);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);

  useEffect(() => {
    runOptimizationExperiment();
  }, [quantize, prune, reduceFeatures, compress]);

  const runOptimizationExperiment = async () => {
    setIsOptimizing(true);
    try {
      const res = await api.runOptimizationLab({
        quantize,
        prune,
        reduce_features: reduceFeatures,
        compress,
      });
      setBenchmarkResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="content-area">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--green-healthy)' }}>
            AI OPTIMIZATION LABORATORY
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Investigating Edge AI Compression • Quantization • Tree Pruning • Feature Selection
          </p>
        </div>

        <button onClick={runOptimizationExperiment} className="btn btn-secondary btn-sm">
          <RefreshCw size={14} /> Re-evaluate Model Parameters
        </button>
      </div>

      {/* Optimization Toggles Card */}
      <div className="agri-card" style={{ marginBottom: '20px' }}>
        <div className="agri-card-header">
          <span className="agri-title">
            <Sliders size={18} color="#c084fc" /> EDGE OPTIMIZATION LEVERS (MICRO-CONTROLLER TARGETING)
          </span>
          <span className="badge badge-tech">INTERACTIVE CONTROLS</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {/* Quantization Toggle */}
          <button
            onClick={() => setQuantize(!quantize)}
            style={{
              backgroundColor: quantize ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-secondary)',
              border: quantize ? '1px solid var(--green-healthy)' : '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '12px',
              textAlign: 'left',
              cursor: 'pointer',
              color: '#fff'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              {quantize ? <CheckSquare size={16} color="var(--green-healthy)" /> : <Square size={16} color="var(--text-muted)" />}
              <strong style={{ fontSize: '13px' }}>INT8 Quantization</strong>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Converts 32-bit floats to 8-bit integers, reducing memory footprint by ~72%.
            </div>
          </button>

          {/* Pruning Toggle */}
          <button
            onClick={() => setPrune(!prune)}
            style={{
              backgroundColor: prune ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-secondary)',
              border: prune ? '1px solid var(--green-healthy)' : '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '12px',
              textAlign: 'left',
              cursor: 'pointer',
              color: '#fff'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              {prune ? <CheckSquare size={16} color="var(--green-healthy)" /> : <Square size={16} color="var(--text-muted)" />}
              <strong style={{ fontSize: '13px' }}>Tree Depth Pruning</strong>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Trims low-information tree branches, cutting branch complexity and inference time.
            </div>
          </button>

          {/* Feature Selection Toggle */}
          <button
            onClick={() => setReduceFeatures(!reduceFeatures)}
            style={{
              backgroundColor: reduceFeatures ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-secondary)',
              border: reduceFeatures ? '1px solid var(--green-healthy)' : '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '12px',
              textAlign: 'left',
              cursor: 'pointer',
              color: '#fff'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              {reduceFeatures ? <CheckSquare size={16} color="var(--green-healthy)" /> : <Square size={16} color="var(--text-muted)" />}
              <strong style={{ fontSize: '13px' }}>Feature Reduction</strong>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Ranks 14 multimodal inputs and retains top 6 highest-importance features.
            </div>
          </button>

          {/* Compression Toggle */}
          <button
            onClick={() => setCompress(!compress)}
            style={{
              backgroundColor: compress ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-secondary)',
              border: compress ? '1px solid var(--green-healthy)' : '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '12px',
              textAlign: 'left',
              cursor: 'pointer',
              color: '#fff'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              {compress ? <CheckSquare size={16} color="var(--green-healthy)" /> : <Square size={16} color="var(--text-muted)" />}
              <strong style={{ fontSize: '13px' }}>Sparse Compression</strong>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Applies sparse matrix representation and Huffman weight encoding.
            </div>
          </button>
        </div>
      </div>

      {/* Before vs After Side-by-Side Comparison */}
      {benchmarkResult && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {/* Baseline Model */}
          <div className="agri-card" style={{ borderColor: 'var(--border-color)' }}>
            <div className="agri-card-header">
              <span className="agri-title" style={{ color: '#94a3b8' }}>
                BASELINE UNCOMPRESSED MODEL (SERVER / CLOUD)
              </span>
              <span className="badge badge-tech">FP32 FULL</span>
            </div>

            <table className="data-table">
              <tbody>
                <tr>
                  <td>Model Size</td>
                  <td><strong style={{ color: '#fff' }}>{benchmarkResult.baseline.model_size_kb} KB</strong></td>
                </tr>
                <tr>
                  <td>Inference Latency</td>
                  <td><strong style={{ color: '#fff' }}>{benchmarkResult.baseline.latency_ms} ms</strong> / 100 zones</td>
                </tr>
                <tr>
                  <td>Accuracy</td>
                  <td><strong style={{ color: '#34d399' }}>{benchmarkResult.baseline.accuracy}%</strong></td>
                </tr>
                <tr>
                  <td>F1 Score</td>
                  <td><strong style={{ color: '#34d399' }}>{benchmarkResult.baseline.f1_score}</strong></td>
                </tr>
                <tr>
                  <td>RAM Memory</td>
                  <td><strong style={{ color: '#fff' }}>{benchmarkResult.baseline.ram_mb} MB</strong></td>
                </tr>
                <tr>
                  <td>CPU Overhead</td>
                  <td><strong style={{ color: '#fff' }}>{benchmarkResult.baseline.cpu_pct}%</strong></td>
                </tr>
                <tr>
                  <td>Input Features</td>
                  <td><strong>{benchmarkResult.baseline.features_count} Multimodal Features</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Optimized Edge Model */}
          <div className="agri-card" style={{ borderColor: 'var(--green-healthy)', backgroundColor: 'rgba(19, 34, 25, 0.95)' }}>
            <div className="agri-card-header">
              <span className="agri-title" style={{ color: 'var(--green-healthy)' }}>
                OPTIMIZED EDGE PROFILE (ON-DEVICE DEPLOYMENT)
              </span>
              <span className="badge badge-healthy">QUANTIZED & PRUNED</span>
            </div>

            <table className="data-table">
              <tbody>
                <tr>
                  <td>Model Size</td>
                  <td><strong style={{ color: '#a7f3d0' }}>{benchmarkResult.optimized.model_size_kb} KB</strong></td>
                </tr>
                <tr>
                  <td>Inference Latency</td>
                  <td><strong style={{ color: '#a7f3d0' }}>{benchmarkResult.optimized.latency_ms} ms</strong> / 100 zones</td>
                </tr>
                <tr>
                  <td>Accuracy</td>
                  <td><strong style={{ color: '#34d399' }}>{benchmarkResult.optimized.accuracy}%</strong></td>
                </tr>
                <tr>
                  <td>F1 Score</td>
                  <td><strong style={{ color: '#34d399' }}>{benchmarkResult.optimized.f1_score}</strong></td>
                </tr>
                <tr>
                  <td>RAM Memory</td>
                  <td><strong style={{ color: '#a7f3d0' }}>{benchmarkResult.optimized.ram_mb} MB</strong></td>
                </tr>
                <tr>
                  <td>CPU Overhead</td>
                  <td><strong style={{ color: '#a7f3d0' }}>{benchmarkResult.optimized.cpu_pct}%</strong></td>
                </tr>
                <tr>
                  <td>Input Features</td>
                  <td><strong>{benchmarkResult.optimized.features_count} Selected Features</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Trade-off Analysis Card */}
      {benchmarkResult && (
        <div className="agri-card">
          <div className="agri-card-header">
            <span className="agri-title">
              <Scale size={18} color="#fbbf24" /> RESEARCH PARETO TRADE-OFF ANALYSIS
            </span>
            <span className="badge badge-healthy">{benchmarkResult.tradeoff_analysis.verdict}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '12px', borderRadius: '6px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>STORAGE COMPRESSION</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--green-healthy)' }}>
                {benchmarkResult.tradeoff_analysis.size_reduction_pct}%
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Bytes saved on flash storage</div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '12px', borderRadius: '6px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>INFERENCE SPEEDUP</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#38bdf8' }}>
                {benchmarkResult.tradeoff_analysis.speedup_factor}x
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Faster prediction execution</div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '12px', borderRadius: '6px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ACCURACY PENALTY</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#fbbf24' }}>
                -{benchmarkResult.tradeoff_analysis.accuracy_tradeoff_pct}%
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Negligible clinical fidelity loss</div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '12px', borderRadius: '6px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>F1 SCORE DELTA</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#c084fc' }}>
                {benchmarkResult.tradeoff_analysis.f1_delta}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Balanced precision/recall</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
