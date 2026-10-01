import React, { useState } from 'react';
import { 
  Wifi, WifiOff, Cpu, Cloud, Database, 
  CheckCircle2, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { ConnectivityStatus } from '../types';
import { api } from '../services/api';

interface ConnectivityViewProps {
  currentStatus: ConnectivityStatus;
  onStatusChange: (status: ConnectivityStatus) => void;
}

export const ConnectivityView: React.FC<ConnectivityViewProps> = ({
  currentStatus,
  onStatusChange,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSelect = async (status: ConnectivityStatus) => {
    setIsUpdating(true);
    try {
      await api.setConnectivity(status);
      onStatusChange(status);
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="content-area">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--green-healthy)' }}>
            CONNECTIVITY & OFFLINE-EDGE RESILIENCE LAB
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Simulating rural weak networks, internet outages, and offline edge model failover.
          </p>
        </div>

        <span className={`badge ${currentStatus === 'OFFLINE' ? 'badge-offline' : 'badge-healthy'}`} style={{ fontSize: '12px', padding: '4px 12px' }}>
          NETWORK: {currentStatus}
        </span>
      </div>

      {/* Network Profile Toggles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
        {[
          { id: 'GOOD', label: 'Good (Fiber / 4G)', desc: 'Full cloud-hosted standard model access with real-time updates.', icon: <Wifi size={24} color="#10b981" /> },
          { id: 'WEAK', label: 'Weak 2G / Satellite', desc: 'High packet latency (~1200ms); models prioritize lightweight payloads.', icon: <Wifi size={24} color="#f59e0b" /> },
          { id: 'INTERMITTENT', label: 'Intermittent Dropouts', desc: 'Frequent connection drops; system caches state periodically.', icon: <AlertTriangle size={24} color="#f97316" /> },
          { id: 'OFFLINE', label: 'Complete Offline Outage', desc: 'Zero cloud connection. On-device edge model takes over 100%.', icon: <WifiOff size={24} color="#ef4444" /> },
        ].map((item) => {
          const isSelected = currentStatus === item.id;
          return (
            <div
              key={item.id}
              onClick={() => handleSelect(item.id as ConnectivityStatus)}
              style={{
                backgroundColor: isSelected ? 'var(--bg-panel-hover)' : 'var(--bg-panel)',
                border: isSelected ? '2px solid var(--green-healthy)' : '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '16px',
                cursor: 'pointer'
              }}
            >
              <div style={{ marginBottom: '10px' }}>{item.icon}</div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                {item.desc}
              </div>
              <button
                className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                style={{ width: '100%' }}
              >
                {isSelected ? '✓ ACTIVE REGIME' : 'SIMULATE REGIME'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Offline Status Architecture Box */}
      <div className="agri-card" style={{ borderColor: currentStatus === 'OFFLINE' ? '#ef4444' : 'var(--border-color)' }}>
        <div className="agri-card-header">
          <span className="agri-title">
            <Cpu size={18} color="#c084fc" /> EDGE ON-DEVICE FAILOVER TELEMETRY
          </span>
          <span className={`badge ${currentStatus === 'OFFLINE' ? 'badge-offline' : 'badge-healthy'}`}>
            {currentStatus === 'OFFLINE' ? 'OFFLINE FAILOVER ENGAGED' : 'ONLINE COOPERATIVE'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '14px', borderRadius: '8px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
              CLOUD DEPENDENT SERVICES
            </div>
            <div style={{ fontSize: '12px', color: currentStatus === 'OFFLINE' ? '#f87171' : '#34d399', fontWeight: 600 }}>
              {currentStatus === 'OFFLINE' ? '❌ DISCONNECTED (UNAVAILABLE)' : '✓ CONNECTED (ACTIVE)'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>
              Standard Heavy FP32 Model, Remote Telemetry Ingestion
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '14px', borderRadius: '8px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
              LOCAL ON-DEVICE EDGE MODEL
            </div>
            <div style={{ fontSize: '12px', color: '#34d399', fontWeight: 600 }}>
              ✓ 100% OPERATIONAL (AUTONOMOUS)
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>
              Quantized INT8 Model executing on local edge microcontroller gateway
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '14px', borderRadius: '8px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
              DATA CONTINUITY ENGINE
            </div>
            <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 600 }}>
              ✓ CACHED SATELLITE + LOCAL LOGS
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>
              Using last orbital sweep and local sensor cache buffer
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
