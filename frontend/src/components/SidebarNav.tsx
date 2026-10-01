import React from 'react';
import { 
  Tractor, Satellite, CloudRain, BrainCircuit, 
  Cpu, BarChart3, Wifi, FlaskConical, Sliders, 
  GraduationCap, FileSpreadsheet, HelpCircle, Activity
} from 'lucide-react';

export type ScreenId = 
  | 'farm' 
  | 'satellite' 
  | 'climate' 
  | 'ai_center' 
  | 'optimization' 
  | 'scalability' 
  | 'connectivity' 
  | 'what_if' 
  | 'ablation' 
  | 'analytics' 
  | 'professor_demo' 
  | 'season_report' 
  | 'about_help';

interface SidebarNavProps {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ currentScreen, onSelectScreen }) => {
  const navItems = [
    { id: 'farm', label: 'Virtual Farm', icon: <Tractor size={18} />, badge: 'Primary' },
    { id: 'satellite', label: 'Satellite Lab', icon: <Satellite size={18} /> },
    { id: 'climate', label: 'Climate & Weather', icon: <CloudRain size={18} /> },
    { id: 'ai_center', label: 'AI Decision Center', icon: <BrainCircuit size={18} /> },
    { id: 'optimization', label: 'AI Optimization Lab', icon: <Cpu size={18} />, highlight: true },
    { id: 'scalability', label: 'Scalability Simulator', icon: <BarChart3 size={18} />, highlight: true },
    { id: 'connectivity', label: 'Offline & Edge Mode', icon: <Wifi size={18} /> },
    { id: 'what_if', label: 'What-If Simulator', icon: <Sliders size={18} /> },
    { id: 'ablation', label: 'Research Ablation', icon: <FlaskConical size={18} /> },
    { id: 'analytics', label: 'Research Analytics', icon: <Activity size={18} /> },
    { id: 'professor_demo', label: 'Professor Demo Mode', icon: <GraduationCap size={18} />, demo: true },
    { id: 'season_report', label: 'Season Report & Export', icon: <FileSpreadsheet size={18} /> },
    { id: 'about_help', label: 'Academic Help & Honesty', icon: <HelpCircle size={18} /> },
  ];

  return (
    <aside style={{
      width: '240px',
      backgroundColor: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0
    }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-color)', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
        RESEARCH MODULES
      </div>

      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectScreen(item.id as ScreenId)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 12px',
                marginBottom: '4px',
                borderRadius: '6px',
                border: isActive ? '1px solid var(--green-healthy)' : '1px solid transparent',
                backgroundColor: isActive 
                  ? 'rgba(16, 185, 129, 0.15)' 
                  : item.highlight 
                  ? 'rgba(59, 130, 246, 0.05)' 
                  : 'transparent',
                color: isActive ? 'var(--text-main)' : item.demo ? '#c084fc' : 'var(--text-muted)',
                fontSize: '13px',
                fontWeight: isActive ? 700 : 500,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{ color: isActive ? 'var(--green-healthy)' : (item.demo ? '#c084fc' : 'currentColor') }}>
                {item.icon}
              </span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span className="badge badge-healthy" style={{ fontSize: '9px', padding: '1px 5px' }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Tagline */}
      <div style={{ padding: '12px', borderTop: '1px solid var(--border-color)', fontSize: '10px', color: 'var(--text-dim)', textAlign: 'center' }}>
        “SIMULATE THE FARM. EXPERIENCE THE CLIMATE. OPTIMIZE THE AI.”
      </div>
    </aside>
  );
};
