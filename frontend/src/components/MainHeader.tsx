import React from 'react';
import { 
  Play, Pause, FastForward, RotateCcw, 
  Wifi, WifiOff, Cpu, CloudSun, Layers, Sparkles 
} from 'lucide-react';
import { ConnectivityStatus } from '../types';

interface MainHeaderProps {
  day: number;
  seasonLength: number;
  farmSize: number;
  crop: string;
  weather: any;
  connectivity: ConnectivityStatus;
  activeModel: string;
  compute: any;
  activeEventsCount: number;
  isPlaying: boolean;
  speed: number;
  onTogglePlay: () => void;
  onSetSpeed: (speed: number) => void;
  onStepDay: () => void;
  onReset: () => void;
  onOpenNewFarmModal: () => void;
  onStartDemo: () => void;
}

export const MainHeader: React.FC<MainHeaderProps> = ({
  day,
  seasonLength,
  farmSize,
  crop,
  weather,
  connectivity,
  activeModel,
  compute,
  activeEventsCount,
  isPlaying,
  speed,
  onTogglePlay,
  onSetSpeed,
  onStepDay,
  onReset,
  onOpenNewFarmModal,
  onStartDemo
}) => {
  return (
    <header style={{
      backgroundColor: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      padding: '10px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
      zIndex: 50
    }}>
      {/* Title & Academic Subtitle */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--green-healthy)', letterSpacing: '1px' }}>
            SMART FARM
          </span>
          <span className="badge badge-tech" style={{ fontSize: '10px' }}>RESEARCH SIM v1.0</span>
          {activeEventsCount > 0 && (
            <span className="badge badge-critical" style={{ animation: 'pulse 2s infinite' }}>
              ⚠️ {activeEventsCount} CLIMATE EVENT ACTIVE
            </span>
          )}
        </div>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          Climate-Aware Virtual Smart Farm Simulator • Edge AI Optimization
        </span>
      </div>

      {/* Center Telemetry HUD */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Day Counter */}
        <div style={{
          backgroundColor: 'var(--bg-panel)',
          padding: '4px 12px',
          borderRadius: '6px',
          border: '1px solid var(--border-color)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>SEASON PROGRESS</div>
          <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>
            DAY {day} <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/ {seasonLength}</span>
          </div>
        </div>

        {/* Farm & Crop */}
        <div style={{
          backgroundColor: 'var(--bg-panel)',
          padding: '4px 12px',
          borderRadius: '6px',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>CROP / SCALE</div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#6ee7b7' }}>
            {crop} • {farmSize.toLocaleString()} ZONES
          </div>
        </div>

        {/* Climate Readout */}
        <div style={{
          backgroundColor: 'var(--bg-panel)',
          padding: '4px 12px',
          borderRadius: '6px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CloudSun size={18} color="#38bdf8" />
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>CLIMATE</div>
            <div style={{ fontSize: '12px', fontWeight: '600' }}>
              {weather ? `${weather.temperature}°C • ${weather.humidity}% RH` : '--'}
            </div>
          </div>
        </div>

        {/* Connectivity */}
        <div style={{
          backgroundColor: 'var(--bg-panel)',
          padding: '4px 12px',
          borderRadius: '6px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          {connectivity === 'OFFLINE' ? <WifiOff size={16} color="#ef4444" /> : <Wifi size={16} color="#10b981" />}
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>NETWORK</div>
            <span className={`badge ${connectivity === 'OFFLINE' ? 'badge-offline' : 'badge-healthy'}`} style={{ fontSize: '10px', padding: '1px 6px' }}>
              {connectivity}
            </span>
          </div>
        </div>

        {/* Compute Load */}
        <div style={{
          backgroundColor: 'var(--bg-panel)',
          padding: '4px 12px',
          borderRadius: '6px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Cpu size={16} color="#c084fc" />
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>COMPUTE / MODEL</div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#e9d5ff' }}>
              {activeModel} ({compute?.latency_ms || 14.8}ms)
            </div>
          </div>
        </div>
      </div>

      {/* Right Controls: Playback, Steps, New Farm, Demo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button 
          onClick={onTogglePlay} 
          className={`btn ${isPlaying ? 'btn-danger' : 'btn-primary'}`}
          title={isPlaying ? "Pause Simulation" : "Start Simulation"}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          {isPlaying ? "PAUSE" : "PLAY"}
        </button>

        <button onClick={onStepDay} className="btn btn-secondary" title="Advance by 1 Day">
          <FastForward size={14} /> +1 DAY
        </button>

        {/* Speed Controls */}
        <div style={{ display: 'flex', backgroundColor: 'var(--bg-panel)', borderRadius: '6px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
          {[1, 2, 5, 10].map(s => (
            <button
              key={s}
              onClick={() => onSetSpeed(s)}
              style={{
                backgroundColor: speed === s ? 'var(--accent-emerald)' : 'transparent',
                color: speed === s ? '#fff' : 'var(--text-muted)',
                border: 'none',
                padding: '4px 8px',
                fontSize: '11px',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              {s}x
            </button>
          ))}
        </div>

        <button onClick={onStartDemo} className="btn btn-secondary" style={{ borderColor: '#8b5cf6', color: '#c084fc' }} title="Professor Demo Guided Walkthrough">
          <Sparkles size={14} /> DEMO
        </button>

        <button onClick={onOpenNewFarmModal} className="btn btn-outline" title="New Simulation Configuration">
          <Layers size={14} /> CONFIG
        </button>
      </div>
    </header>
  );
};
