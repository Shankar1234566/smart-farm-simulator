import React from 'react';
import { 
  Play, Sparkles, Tractor, CloudSun, Satellite, 
  Cpu, BarChart3, Activity, Info, X, Compass
} from 'lucide-react';
import { ScreenId } from './SidebarNav';

interface MainMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewSimulation: () => void;
  onContinue: () => void;
  onStartDemo: () => void;
  onNavigateScreen: (screen: ScreenId) => void;
}

export const MainMenuModal: React.FC<MainMenuModalProps> = ({
  isOpen,
  onClose,
  onNewSimulation,
  onContinue,
  onStartDemo,
  onNavigateScreen,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ backgroundColor: 'rgba(5, 10, 7, 0.92)' }}>
      <div style={{
        width: '90%',
        maxWidth: '820px',
        backgroundColor: '#0f1c14',
        border: '1px solid #2a4734',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        position: 'relative'
      }}>
        {/* Landscape Banner */}
        <div style={{
          height: '200px',
          background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.25) 0%, rgba(15, 28, 20, 0.95) 100%), radial-gradient(circle at top right, #1e3a2b 0%, #0d1a12 70%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '24px',
          borderBottom: '1px solid #2a4734',
          position: 'relative'
        }}>
          <button 
            onClick={onClose} 
            className="btn btn-outline btn-sm"
            style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10 }}
          >
            <X size={16} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-healthy" style={{ fontSize: '11px', letterSpacing: '1px' }}>
              DATA SCIENCE FINAL YEAR PROJECT
            </span>
            <span className="badge badge-tech" style={{ fontSize: '11px' }}>
              VIRTUAL AGRI-ENVIRONMENT
            </span>
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#f0fdf4', letterSpacing: '1.5px', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
            SMART FARM
          </h1>

          <p style={{ fontSize: '14px', color: '#86efac', fontWeight: 600 }}>
            Climate-Aware Virtual Smart Farm Simulator
          </p>

          <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', fontStyle: 'italic' }}>
            “A Data-Driven Climate-Aware Virtual Farm Simulator for Scalable Agricultural Decision Support and Edge-Oriented AI Optimization”
          </p>
        </div>

        {/* Buttons Grid */}
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
            <button
              onClick={onNewSimulation}
              className="btn btn-primary"
              style={{ padding: '14px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}
            >
              <Tractor size={20} />
              <span>NEW SIMULATION</span>
            </button>

            <button
              onClick={onContinue}
              className="btn btn-secondary"
              style={{ padding: '14px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}
            >
              <Play size={20} />
              <span>CONTINUE CURRENT</span>
            </button>

            <button
              onClick={onStartDemo}
              className="btn btn-secondary"
              style={{ padding: '14px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px', borderColor: '#8b5cf6', color: '#c084fc' }}
            >
              <Sparkles size={20} />
              <span>PROFESSOR DEMO</span>
            </button>
          </div>

          <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px' }}>
            RESEARCH EXPERIMENT LABORATORIES
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            <button
              onClick={() => { onNavigateScreen('climate'); onClose(); }}
              className="btn btn-outline"
              style={{ padding: '10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-start' }}
            >
              <CloudSun size={16} color="#38bdf8" />
              <span>CLIMATE LAB</span>
            </button>

            <button
              onClick={() => { onNavigateScreen('satellite'); onClose(); }}
              className="btn btn-outline"
              style={{ padding: '10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-start' }}
            >
              <Satellite size={16} color="#34d399" />
              <span>SATELLITE LAB</span>
            </button>

            <button
              onClick={() => { onNavigateScreen('optimization'); onClose(); }}
              className="btn btn-outline"
              style={{ padding: '10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-start' }}
            >
              <Cpu size={16} color="#c084fc" />
              <span>AI OPT LAB</span>
            </button>

            <button
              onClick={() => { onNavigateScreen('scalability'); onClose(); }}
              className="btn btn-outline"
              style={{ padding: '10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-start' }}
            >
              <BarChart3 size={16} color="#fbbf24" />
              <span>SCALABILITY</span>
            </button>

            <button
              onClick={() => { onNavigateScreen('analytics'); onClose(); }}
              className="btn btn-outline"
              style={{ padding: '10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-start' }}
            >
              <Activity size={16} color="#f87171" />
              <span>ANALYTICS</span>
            </button>

            <button
              onClick={() => { onNavigateScreen('what_if'); onClose(); }}
              className="btn btn-outline"
              style={{ padding: '10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-start' }}
            >
              <Compass size={16} color="#38bdf8" />
              <span>WHAT-IF SIM</span>
            </button>

            <button
              onClick={() => { onNavigateScreen('season_report'); onClose(); }}
              className="btn btn-outline"
              style={{ padding: '10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-start' }}
            >
              <Activity size={16} color="#a3e635" />
              <span>SEASON REPORT</span>
            </button>

            <button
              onClick={() => { onNavigateScreen('about_help'); onClose(); }}
              className="btn btn-outline"
              style={{ padding: '10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-start' }}
            >
              <Info size={16} color="#94a3b8" />
              <span>ABOUT & HELP</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{ backgroundColor: '#09120c', padding: '12px 24px', borderTop: '1px solid #2a4734', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748b' }}>
          <span>SIMULATE THE FARM. EXPERIENCE THE CLIMATE. OPTIMIZE THE AI.</span>
          <span>100% Software-Based • No Physical IoT Required</span>
        </div>
      </div>
    </div>
  );
};
