import React, { useRef, useEffect, useState, useMemo } from 'react';
import { FarmZone, MapMode } from '../types';

interface FarmCanvasProps {
  zones: FarmZone[];
  farmSize: number;
  activeMapMode: MapMode;
  selectedZoneId?: number;
  onSelectZone: (zone: FarmZone) => void;
}

export const FarmCanvas: React.FC<FarmCanvasProps> = ({
  zones,
  farmSize,
  activeMapMode,
  selectedZoneId,
  onSelectZone,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredZone, setHoveredZone] = useState<FarmZone | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Compute grid dimensions
  const cols = useMemo(() => {
    const c = Math.ceil(Math.sqrt(zones.length));
    return c > 0 ? c : 10;
  }, [zones.length]);

  const rows = useMemo(() => {
    return Math.ceil(zones.length / cols) || 10;
  }, [zones.length, cols]);

  // Color mapper based on map mode
  const getZoneColor = (z: FarmZone, mode: MapMode): string => {
    switch (mode) {
      case 'CROP_HEALTH':
        if (z.crop_health === 'Critical') return '#ef4444';
        if (z.crop_health === 'Stressed') return '#f97316';
        if (z.crop_health === 'Moderate') return '#f59e0b';
        return '#10b981';

      case 'SOIL_MOISTURE':
        // Blue scale: dry (amber) to wet (deep blue)
        if (z.soil_moisture > 75) return '#0284c7';
        if (z.soil_moisture > 50) return '#0ea5e9';
        if (z.soil_moisture > 35) return '#38bdf8';
        if (z.soil_moisture > 20) return '#fbbf24';
        return '#ea580c';

      case 'DISEASE_RISK':
        if (z.disease_probability > 60) return '#dc2626';
        if (z.disease_probability > 40) return '#9333ea';
        if (z.disease_probability > 20) return '#6366f1';
        return '#10b981';

      case 'CLIMATE_RISK':
        if (z.climate_risk > 65) return '#b91c1c';
        if (z.climate_risk > 45) return '#ea580c';
        if (z.climate_risk > 25) return '#eab308';
        return '#16a34a';

      case 'WATER_STRESS':
        if (z.crop_stress > 60) return '#ef4444';
        if (z.crop_stress > 35) return '#f97316';
        if (z.crop_stress > 15) return '#eab308';
        return '#10b981';

      case 'NDVI':
        // NDVI Greenness Palette
        if (z.NDVI > 0.75) return '#065f46';
        if (z.NDVI > 0.60) return '#059669';
        if (z.NDVI > 0.45) return '#10b981';
        if (z.NDVI > 0.30) return '#84cc16';
        if (z.NDVI > 0.15) return '#eab308';
        return '#78350f';

      case 'NDMI':
        if (z.NDMI > 0.50) return '#0369a1';
        if (z.NDMI > 0.30) return '#0284c7';
        if (z.NDMI > 0.10) return '#38bdf8';
        return '#f97316';

      case 'LST':
        // Thermal IR Palette
        if (z.LST > 36) return '#991b1b';
        if (z.LST > 32) return '#dc2626';
        if (z.LST > 28) return '#f97316';
        if (z.LST > 24) return '#fbbf24';
        return '#0284c7';

      case 'YIELD_RISK':
        if (z.yield_estimate < 60) return '#ef4444';
        if (z.yield_estimate < 80) return '#f97316';
        if (z.yield_estimate < 95) return '#f59e0b';
        return '#10b981';

      case 'AI_CONFIDENCE':
        if (z.AI_confidence > 90) return '#06b6d4';
        if (z.AI_confidence > 80) return '#3b82f6';
        if (z.AI_confidence > 70) return '#6366f1';
        return '#64748b';

      case 'COMPUTE_LOAD':
        return z.crop_stress > 50 ? '#9333ea' : '#334155';

      case 'SATELLITE':
        // Sentinel-2 optical false color composite simulation
        return z.NDVI > 0.5 ? '#15803d' : '#854d0e';

      case 'NORMAL':
      default:
        // Agri naturalistic
        if (z.crop_health === 'Critical') return '#b91c1c';
        if (z.crop_health === 'Stressed') return '#d97706';
        if (z.soil_moisture > 60) return '#15803d';
        return '#16a34a';
    }
  };

  // Draw Grid Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.fillStyle = '#0a120d';
    ctx.fillRect(0, 0, width, height);

    if (zones.length === 0) return;

    const padding = 12;
    const availWidth = width - padding * 2;
    const availHeight = height - padding * 2;

    const cellW = availWidth / cols;
    const cellH = availHeight / rows;
    const gap = zones.length <= 100 ? 3 : (zones.length <= 1000 ? 1.5 : 0.5);

    zones.forEach((z, idx) => {
      const c = idx % cols;
      const r = Math.floor(idx / cols);

      const x = padding + c * cellW;
      const y = padding + r * cellH;
      const w = Math.max(1, cellW - gap);
      const h = Math.max(1, cellH - gap);

      // Cell Fill
      ctx.fillStyle = getZoneColor(z, activeMapMode);
      ctx.fillRect(x, y, w, h);

      // Selection Highlight
      if (selectedZoneId === z.zone_id) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(x - 1, y - 1, w + 2, h + 2);
      }

      // Draw Zone Label if small farm (e.g. 100 zones)
      if (zones.length <= 100) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(x, y + h - 14, w, 14);

        ctx.fillStyle = '#ffffff';
        ctx.font = '9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`Z${z.zone_id}`, x + w / 2, y + h - 3);

        // Health indicator dot
        ctx.beginPath();
        ctx.arc(x + 6, y + 6, 3, 0, Math.PI * 2);
        ctx.fillStyle = z.crop_health === 'Healthy' ? '#10b981' : (z.crop_health === 'Moderate' ? '#f59e0b' : '#ef4444');
        ctx.fill();
      }
    });
  }, [zones, cols, rows, activeMapMode, selectedZoneId]);

  // Handle Mouse Click
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || zones.length === 0) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const padding = 12;
    const availWidth = canvas.width - padding * 2;
    const availHeight = canvas.height - padding * 2;

    const cellW = availWidth / cols;
    const cellH = availHeight / rows;

    const c = Math.floor((x - padding) / cellW);
    const r = Math.floor((y - padding) / cellH);

    if (c >= 0 && c < cols && r >= 0 && r < rows) {
      const idx = r * cols + c;
      if (idx < zones.length) {
        onSelectZone(zones[idx]);
      }
    }
  };

  // Handle Mouse Move for Tooltip
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || zones.length === 0) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x: e.clientX, y: e.clientY });

    const padding = 12;
    const availWidth = canvas.width - padding * 2;
    const availHeight = canvas.height - padding * 2;

    const cellW = availWidth / cols;
    const cellH = availHeight / rows;

    const c = Math.floor((x - padding) / cellW);
    const r = Math.floor((y - padding) / cellH);

    if (c >= 0 && c < cols && r >= 0 && r < rows) {
      const idx = r * cols + c;
      if (idx < zones.length) {
        setHoveredZone(zones[idx]);
        return;
      }
    }
    setHoveredZone(null);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <canvas
        ref={canvasRef}
        width={720}
        height={560}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredZone(null)}
        style={{
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
          cursor: 'pointer',
          maxWidth: '100%',
          boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
        }}
      />

      {/* Floating Hover Tooltip */}
      {hoveredZone && (
        <div style={{
          position: 'fixed',
          left: mousePos.x + 14,
          top: mousePos.y + 14,
          backgroundColor: 'rgba(19, 34, 25, 0.95)',
          border: '1px solid var(--border-highlight)',
          borderRadius: '6px',
          padding: '8px 12px',
          color: '#fff',
          fontSize: '11px',
          pointerEvents: 'none',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          minWidth: '160px'
        }}>
          <div style={{ fontWeight: 700, color: 'var(--green-healthy)', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px', marginBottom: '4px' }}>
            ZONE #{hoveredZone.zone_id} ({hoveredZone.crop_type})
          </div>
          <div>Health: <strong style={{ color: hoveredZone.crop_health === 'Healthy' ? '#34d399' : '#f87171' }}>{hoveredZone.crop_health}</strong></div>
          <div>Moisture: <strong>{hoveredZone.soil_moisture}%</strong></div>
          <div>Stress: <strong>{hoveredZone.crop_stress}%</strong></div>
          <div>NDVI: <strong>{hoveredZone.NDVI}</strong></div>
          <div>LST: <strong>{hoveredZone.LST}°C</strong></div>
          <div style={{ marginTop: '4px', fontSize: '9px', color: 'var(--text-muted)' }}>Click to inspect & take action</div>
        </div>
      )}
    </div>
  );
};
