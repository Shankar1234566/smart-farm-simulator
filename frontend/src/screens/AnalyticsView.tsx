import React from 'react';
import { Activity, BarChart3, Droplets, TrendingUp, ShieldCheck, Heart } from 'lucide-react';

interface AnalyticsViewProps {
  summary: any;
  currentDay: number;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ summary, currentDay }) => {
  const dist = summary?.health_distribution || { Healthy: 0, Moderate: 0, Stressed: 0, Critical: 0 };
  const total = Math.max(1, (dist.Healthy + dist.Moderate + dist.Stressed + dist.Critical));

  const healthyPct = Math.round((dist.Healthy / total) * 100);
  const moderatePct = Math.round((dist.Moderate / total) * 100);
  const stressedPct = Math.round((dist.Stressed / total) * 100);
  const criticalPct = Math.round((dist.Critical / total) * 100);

  return (
    <div className="content-area">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--green-healthy)' }}>
            RESEARCH ANALYTICS & PHENOLOGY DASHBOARD
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Empirical farm-wide health distributions, water consumption metrics, and harvest yield trajectories.
          </p>
        </div>

        <span className="badge badge-tech" style={{ fontSize: '12px', padding: '4px 10px' }}>
          DAY {currentDay} TELEMETRY
        </span>
      </div>

      {/* Primary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
        <div className="agri-card">
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>CANOPY HEALTH RATIO</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--green-healthy)', margin: '4px 0' }}>
            {healthyPct}%
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{dist.Healthy} Zones in prime vigor</div>
        </div>

        <div className="agri-card">
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>MEAN SOIL MOISTURE</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#38bdf8', margin: '4px 0' }}>
            {summary?.avg_soil_moisture || 55.0}%
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Root zone hydration level</div>
        </div>

        <div className="agri-card">
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>MEAN VEGETATION NDVI</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#a7f3d0', margin: '4px 0' }}>
            {summary?.avg_ndvi || 0.68}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Orbital green biomass</div>
        </div>

        <div className="agri-card">
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>HARVEST YIELD ESTIMATE</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#fbbf24', margin: '4px 0' }}>
            {summary?.avg_yield_estimate || 92.4}%
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Percentage of reference target</div>
        </div>
      </div>

      {/* Spatial Health Distribution Bar */}
      <div className="agri-card" style={{ marginBottom: '20px' }}>
        <div className="agri-card-header">
          <span className="agri-title">
            <Heart size={18} color="#f87171" /> SPATIAL CANOPY HEALTH COHORT DISTRIBUTION
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {summary?.farm_size?.toLocaleString()} Total Simulated Zones
          </span>
        </div>

        {/* Progress Bar Segment */}
        <div style={{ height: '24px', display: 'flex', borderRadius: '6px', overflow: 'hidden', marginBottom: '14px' }}>
          <div style={{ width: `${healthyPct}%`, backgroundColor: '#10b981' }} title={`Healthy: ${healthyPct}%`} />
          <div style={{ width: `${moderatePct}%`, backgroundColor: '#f59e0b' }} title={`Moderate: ${moderatePct}%`} />
          <div style={{ width: `${stressedPct}%`, backgroundColor: '#f97316' }} title={`Stressed: ${stressedPct}%`} />
          <div style={{ width: `${criticalPct}%`, backgroundColor: '#ef4444' }} title={`Critical: ${criticalPct}%`} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', textAlign: 'center' }}>
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '10px', borderRadius: '6px' }}>
            <div style={{ color: '#10b981', fontWeight: 700 }}>HEALTHY</div>
            <div style={{ fontSize: '18px', fontWeight: 800 }}>{dist.Healthy} ({healthyPct}%)</div>
          </div>
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '10px', borderRadius: '6px' }}>
            <div style={{ color: '#f59e0b', fontWeight: 700 }}>MODERATE</div>
            <div style={{ fontSize: '18px', fontWeight: 800 }}>{dist.Moderate} ({moderatePct}%)</div>
          </div>
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '10px', borderRadius: '6px' }}>
            <div style={{ color: '#f97316', fontWeight: 700 }}>STRESSED</div>
            <div style={{ fontSize: '18px', fontWeight: 800 }}>{dist.Stressed} ({stressedPct}%)</div>
          </div>
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '10px', borderRadius: '6px' }}>
            <div style={{ color: '#ef4444', fontWeight: 700 }}>CRITICAL</div>
            <div style={{ fontSize: '18px', fontWeight: 800 }}>{dist.Critical} ({criticalPct}%)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
