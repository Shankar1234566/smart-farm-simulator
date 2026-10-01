import React, { useState } from 'react';
import { 
  GraduationCap, ArrowRight, ArrowLeft, Play, Pause, 
  RotateCcw, Sparkles, CheckCircle2, ChevronRight, Zap
} from 'lucide-react';
import { api } from '../services/api';

interface ProfessorDemoViewProps {
  onExecuteDemoStep: (stepNumber: number) => void;
}

export const ProfessorDemoView: React.FC<ProfessorDemoViewProps> = ({ onExecuteDemoStep }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  const demoSteps = [
    {
      step: 1,
      title: "1. Baseline Healthy Farm State",
      narration: "We begin with a healthy 100-zone virtual farm plot. Sensors report normal moisture (55-65%) and high vegetation vigor (NDVI ~0.68).",
      actionLabel: "Verify Initial State",
      action: async () => { await api.createFarm({ crop: "Rice", size: 100, climate: "Normal", connectivity: "GOOD", model: "STANDARD" }); }
    },
    {
      step: 2,
      title: "2. Climate & Weather Forecast Integration",
      narration: "The simulator integrates a 7-day meteorological forecast. Farmers can anticipate upcoming precipitation before making costly irrigation investments.",
      actionLabel: "Inspect 7-Day Forecast",
      action: async () => { await api.getForecast(7); }
    },
    {
      step: 3,
      title: "3. Periodic Sentinel-2 Satellite Sweep",
      narration: "Orbital remote sensing cannot be real-time. We simulate periodic 7-day revisit passes measuring multi-spectral canopy indices (NDVI, NDMI, LST).",
      actionLabel: "Trigger Satellite Pass",
      action: async () => { await api.triggerSatellite(); }
    },
    {
      step: 4,
      title: "4. Injecting Climate Shock (Severe Heatwave)",
      narration: "We introduce a severe heatwave (+7.5°C). Immediate physical consequences: soil evapotranspiration spikes, moisture drops, and canopy stress elevates.",
      actionLabel: "Inject Heatwave",
      action: async () => { await api.triggerEvent("HEATWAVE", "SEVERE", 4); }
    },
    {
      step: 5,
      title: "5. Multimodal AI Prediction Engine",
      narration: "The AI fuses ground sensors, atmospheric forecasts, and orbital NDVI. It flags high water deficit and recommends preventive irrigation.",
      actionLabel: "Run Multimodal AI",
      action: async () => { await api.runAiPredict("STANDARD"); }
    },
    {
      step: 6,
      title: "6. Manager Decision & Interventions",
      narration: "The AI Farm Manager decides to irrigate the stressed zones. Causality takes effect: soil moisture replenishes, reducing heat stress from 65% to 22%.",
      actionLabel: "Execute Manager Irrigation",
      action: async () => { await api.applyDecision("IRRIGATE"); }
    },
    {
      step: 7,
      title: "7. Observable Farm Consequences",
      narration: "As simulation days advance, the crop recovers vegetative vigor. The decision prevented permanent harvest yield penalties.",
      actionLabel: "Step 2 Days Forward",
      action: async () => { await api.stepSimulation(2); }
    },
    {
      step: 8,
      title: "8. Scaling to 10,000 Zones (Commercial Scale)",
      narration: "We scale the virtual field to 10,000 zones. State calculations are vectorized in NumPy. Inference begins demanding higher memory and CPU cycles.",
      actionLabel: "Scale to 10,000 Zones",
      action: async () => { await api.scaleFarm(10000); }
    },
    {
      step: 9,
      title: "9. Scaling to 100,000 Zones (Mega-Watershed)",
      narration: "At 100,000 zones, the simulator switches to spatial Level of Detail (LOD) aggregation. Without optimization, server latency hits ~14.8 seconds!",
      actionLabel: "Scale to 100,000 Zones",
      action: async () => { await api.scaleFarm(100000); }
    },
    {
      step: 10,
      title: "10. Computational Bottleneck Demonstration",
      narration: "We benchmark standard FP32 models against 100,000 zone loads. Computational pressure causes inference latency spikes and queuing.",
      actionLabel: "Benchmark Server Load",
      action: async () => { await api.runScalabilityBenchmark(100000, "STANDARD"); }
    },
    {
      step: 11,
      title: "11. AI Optimization Lab (Quantization & Pruning)",
      narration: "We open the AI Optimization Lab. We apply INT8 Quantization and Tree Pruning, compressing model size from 1,280 KB down to 64 KB.",
      actionLabel: "Apply INT8 Quantization",
      action: async () => { await api.runOptimizationLab({ quantize: true, prune: true, reduce_features: true, compress: true }); }
    },
    {
      step: 12,
      title: "12. Performance Trade-off Verification",
      narration: "The edge-optimized model delivers a 10.6x speedup (1,400ms vs 14,800ms) with only a 0.8% accuracy drop. Pareto-optimal for field deployment.",
      actionLabel: "Verify Edge Speedup",
      action: async () => { await api.runScalabilityBenchmark(100000, "EDGE_OPTIMIZED"); }
    },
    {
      step: 13,
      title: "13. Complete Network Disconnection (Offline Outage)",
      narration: "Rural farms suffer frequent connectivity loss. We simulate total cloud failure. Cloud endpoints are unreachable.",
      actionLabel: "Sever Internet Connection",
      action: async () => { await api.setConnectivity("OFFLINE"); }
    },
    {
      step: 14,
      title: "14. Autonomous Offline Edge Inference",
      narration: "The local edge model continues running without interruption on cached satellite observations and localized telemetry.",
      actionLabel: "Execute Offline Prediction",
      action: async () => { await api.runAiPredict("EDGE_OPTIMIZED"); }
    },
    {
      step: 15,
      title: "15. Counterfactual What-If Sandbox",
      narration: "The farmer tests what would happen under a prolonged drought (+5°C, -20mm rain) before committing resources.",
      actionLabel: "Project What-If Scenario",
      action: async () => { await api.simulateWhatIf({ temp_delta: 5, rain_delta: -20, humidity_delta: -15, wind_delta: 0, irrigation_applied: true, days_ahead: 7 }); }
    },
    {
      step: 16,
      title: "16. Final Harvest Season Defense Report",
      narration: "At Day 120, the simulator aggregates full empirical metrics: final yield, water efficiency score, edge energy savings, and CSV data export.",
      actionLabel: "Generate Season Defense Report",
      action: async () => { await api.getSeasonReport(); }
    }
  ];

  const currentStepData = demoSteps[currentStep - 1];

  const handleRunCurrentStep = async () => {
    if (currentStepData.action) {
      await currentStepData.action();
    }
    onExecuteDemoStep(currentStep);
  };

  const handleNext = async () => {
    if (currentStep < demoSteps.length) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      const nextData = demoSteps[nextStep - 1];
      if (nextData.action) await nextData.action();
      onExecuteDemoStep(nextStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      onExecuteDemoStep(currentStep - 1);
    }
  };

  return (
    <div className="content-area">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--green-healthy)' }}>
              PROFESSOR DEMONSTRATION & PROJECT DEFENSE MODE
            </h1>
            <span className="badge badge-tech">STEP {currentStep} OF {demoSteps.length}</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Curated 16-step interactive academic sequence demonstrating all core Data Science & Edge AI research goals.
          </p>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={handleBack} disabled={currentStep === 1} className="btn btn-secondary btn-sm">
            <ArrowLeft size={14} /> BACK
          </button>
          <button onClick={handleNext} disabled={currentStep === demoSteps.length} className="btn btn-primary btn-sm">
            NEXT STEP <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Main Step Card */}
      <div className="agri-card" style={{ marginBottom: '20px', borderColor: '#8b5cf6', backgroundColor: 'rgba(24, 43, 32, 0.95)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#e9d5ff' }}>
            {currentStepData.title}
          </span>
          <button onClick={handleRunCurrentStep} className="btn btn-primary btn-sm" style={{ backgroundColor: '#7c3aed' }}>
            <Zap size={14} /> {currentStepData.actionLabel}
          </button>
        </div>

        {/* Speaker Narration Box */}
        <div style={{
          backgroundColor: '#0c1610',
          borderLeft: '4px solid #8b5cf6',
          padding: '16px',
          borderRadius: '4px',
          marginBottom: '16px'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#c084fc', textTransform: 'uppercase', marginBottom: '6px' }}>
            RESEARCH DEFENSE NARRATIVE (WHAT TO SAY TO EVALUATORS)
          </div>
          <p style={{ fontSize: '15px', color: '#f5f3ff', lineHeight: '1.6', fontStyle: 'italic' }}>
            “{currentStepData.narration}”
          </p>
        </div>
      </div>

      {/* 16-Step Roadmap Grid */}
      <div className="agri-card">
        <div className="agri-card-header">
          <span className="agri-title">
            <GraduationCap size={18} color="#8b5cf6" /> COMPLETE 16-STAGE DEFENSE SEQUENCE
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Click any step to jump immediately</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {demoSteps.map((s) => {
            const isCurrent = s.step === currentStep;
            const isCompleted = s.step < currentStep;
            return (
              <button
                key={s.step}
                onClick={async () => {
                  setCurrentStep(s.step);
                  if (s.action) await s.action();
                  onExecuteDemoStep(s.step);
                }}
                style={{
                  backgroundColor: isCurrent ? 'rgba(139, 92, 246, 0.25)' : (isCompleted ? 'var(--bg-panel-hover)' : 'var(--bg-secondary)'),
                  border: isCurrent ? '2px solid #8b5cf6' : '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '10px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: isCurrent ? '#fff' : (isCompleted ? '#a7f3d0' : 'var(--text-muted)')
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700 }}>STEP {s.step}</span>
                  {isCompleted && <CheckCircle2 size={13} color="#10b981" />}
                </div>
                <div style={{ fontSize: '11px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {s.title.split('. ')[1]}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
