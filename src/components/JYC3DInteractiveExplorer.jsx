import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './JYC3DInteractiveExplorer.css';

const HUBS = [
  { id: 'cicr', name: 'CICR', family: 'Technical', role: 'Robotics & Automation', color: '#38bdf8', icon: '🤖', x: -140, y: -60, z: 40 },
  { id: 'osdc', name: 'OSDC', family: 'Technical', role: 'Open Source Software', color: '#38bdf8', icon: '💻', x: -110, y: 70, z: -50 },
  { id: 'dronotics', name: 'Dronotics', family: 'Technical', role: 'UAV & Drones', color: '#38bdf8', icon: '🛸', x: -170, y: 20, z: 20 },
  { id: 'fortissimo', name: 'Fortissimo', family: 'Cultural', role: 'Music & Live Bands', color: '#f59e0b', icon: '🎸', x: 130, y: -80, z: 60 },
  { id: 'vamunique', name: 'VamUnique', family: 'Cultural', role: 'Western & Classical Dance', color: '#f59e0b', icon: '💃', x: 160, y: 30, z: -30 },
  { id: 'panache', name: 'Panache', family: 'Cultural', role: 'Fashion & Runway', color: '#f59e0b', icon: '✨', x: 120, y: 90, z: 40 },
  { id: 'abhivyakti', name: 'Abhivyakti', family: 'Cultural', role: 'Dramatics & Street Theatre', color: '#f59e0b', icon: '🎭', x: 90, y: -20, z: -60 },
  { id: 'aura', name: 'Aura', family: 'Creative', role: 'Photography & Cinematography', color: '#ec4899', icon: '📷', x: -30, y: -130, z: -40 },
  { id: 'aakriti', name: 'Aakriti', family: 'Creative', role: 'Fine Arts & Installations', color: '#ec4899', icon: '🎨', x: 40, y: -120, z: 50 },
  { id: 'eloquence', name: 'Eloquence', family: 'Literary', role: 'Debate, MUN & Poetry', color: '#a78bfa', icon: '🖋️', x: -40, y: 130, z: 30 },
  { id: 'jsa', name: 'JSA Sports', family: 'Sports', role: 'Athletics, Football & Cricket', color: '#10b981', icon: '🏆', x: 30, y: 140, z: -50 }
];

export function JYC3DInteractiveExplorer() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const nav = useNavigate();
  const [selectedHub, setSelectedHub] = useState(HUBS[0]);
  const [activeFamily, setActiveFamily] = useState('ALL');
  const [rotX, setRotX] = useState(0.2);
  const [rotY, setRotY] = useState(0.4);
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const filteredHubs = useMemo(() => {
    if (activeFamily === 'ALL') return HUBS;
    return HUBS.filter(h => h.family.toUpperCase() === activeFamily);
  }, [activeFamily]);

  // 3D Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let width = 0;
    let height = 0;
    let currentRotX = rotX;
    let currentRotY = rotY;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.width = Math.round(rect.width * dpr);
      height = canvas.height = Math.round(rect.height * dpr);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    let isVisible = true;
    const handleVis = () => {
      isVisible = !document.hidden;
      if (isVisible && !animId) animId = requestAnimationFrame(render);
    };
    document.addEventListener('visibilitychange', handleVis);

    const render = () => {
      if (!isVisible) {
        animId = 0;
        return;
      }

      // Smooth auto-rotation when not dragging
      if (!isDragging) {
        setRotY(r => r + 0.0035);
      }
      currentRotX += (rotX - currentRotX) * 0.12;
      currentRotY += (rotY - currentRotY) * 0.12;

      ctx.clearRect(0, 0, width, height);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cx = width / 2;
      const cy = height / 2;
      const fov = 380 * dpr;

      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

      // Transform nodes into 3D camera coordinates
      const cosY = Math.cos(currentRotY);
      const sinY = Math.sin(currentRotY);
      const cosX = Math.cos(currentRotX);
      const sinX = Math.sin(currentRotX);

      const projected = filteredHubs.map(hub => {
        // Y-axis rotation
        let x1 = hub.x * cosY - hub.z * sinY;
        let z1 = hub.z * cosY + hub.x * sinY;

        // X-axis rotation
        let y2 = hub.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + hub.y * sinX;

        const depth = z2 + 280;
        const scale = fov / Math.max(80, depth);
        const px = cx + x1 * scale * 0.95;
        const py = cy + y2 * scale * 0.95;

        return {
          ...hub,
          px,
          py,
          depth,
          scale,
          isSelected: selectedHub?.id === hub.id
        };
      });

      // Sort back-to-front
      projected.sort((a, b) => b.depth - a.depth);

      // Draw 3D glowing connection grid lines
      ctx.lineWidth = 1 * dpr;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const a = projected[i];
          const b = projected[j];
          const dist3D = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
          if (dist3D < 190) {
            const alpha = Math.max(0.04, (1 - dist3D / 190) * 0.28);
            ctx.strokeStyle = isDark ? `rgba(56, 189, 248, ${alpha})` : `rgba(191, 156, 111, ${alpha * 1.2})`;
            ctx.beginPath();
            ctx.moveTo(a.px, a.py);
            ctx.lineTo(b.px, b.py);
            ctx.stroke();
          }
        }
      }

      // Draw Center Campus Anchor Core
      ctx.beginPath();
      ctx.arc(cx, cy, 6 * dpr, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? '#d4af37' : '#b8860b';
      ctx.shadowColor = isDark ? 'rgba(212, 175, 55, 0.6)' : 'rgba(184, 134, 11, 0.4)';
      ctx.shadowBlur = 14 * dpr;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Orbiting Nodes
      projected.forEach(node => {
        const radius = (node.isSelected ? 10 : 6.5) * dpr;

        // Outer Glow Ring
        ctx.beginPath();
        ctx.arc(node.px, node.py, radius * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `${node.color}${node.isSelected ? '33' : '18'}`;
        ctx.fill();

        // Node Circle
        ctx.beginPath();
        ctx.arc(node.px, node.py, radius, 0, Math.PI * 2);
        ctx.fillStyle = node.isSelected ? '#ffffff' : node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = node.isSelected ? 20 * dpr : 8 * dpr;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Node Label
        ctx.fillStyle = isDark ? (node.isSelected ? '#ffffff' : '#cbd5e1') : (node.isSelected ? '#1e293b' : '#475569');
        ctx.font = `${node.isSelected ? '700' : '600'} ${Math.max(9, 11 * dpr)}px 'Space Grotesk', sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(node.name, node.px, node.py + radius + 14 * dpr);
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVis);
    };
  }, [filteredHubs, rotX, rotY, selectedHub, isDragging]);

  // Pointer interactions for dragging in 3D
  const handlePointerDown = e => {
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = e => {
    if (!isDragging) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    setRotY(r => r + dx * 0.008);
    setRotX(r => Math.max(-0.8, Math.min(0.8, r - dy * 0.008)));
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Click on Canvas to pick closest node
  const handleCanvasClick = e => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const clickX = (e.clientX - rect.left) * dpr;
    const clickY = (e.clientY - rect.top) * dpr;

    let closest = null;
    let minDist = 35 * dpr;

    filteredHubs.forEach(hub => {
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      let x1 = hub.x * cosY - hub.z * sinY;
      let z1 = hub.z * cosY + hub.x * sinY;
      let y2 = hub.y * cosX - z1 * sinX;
      let z2 = z1 * cosX + hub.y * sinX;

      const fov = 380 * dpr;
      const scale = fov / Math.max(80, z2 + 280);
      const px = (canvas.width / 2) + x1 * scale * 0.95;
      const py = (canvas.height / 2) + y2 * scale * 0.95;

      const dist = Math.hypot(clickX - px, clickY - py);
      if (dist < minDist) {
        minDist = dist;
        closest = hub;
      }
    });

    if (closest) {
      setSelectedHub(closest);
    }
  };

  const FAMILIES = ['ALL', 'TECHNICAL', 'CULTURAL', 'CREATIVE', 'LITERARY', 'SPORTS'];

  return (
    <section className="jyc-3d-explorer-section reveal" aria-labelledby="jyc-3d-title">
      <div className="jyc-3d-header">
        <div className="jyc-3d-title-group">
          <div className="jyc-3d-cyber-tag">
            <span className="cyber-pulse-dot" />
            <span>INTERACTIVE WEBGL TWIN · CAMPUS CLUSTERS</span>
          </div>
          <h2 id="jyc-3d-title">
            Explore the JYC Constellation.<br />
            <em className="title-gold-gradient">In 3D Digital Space.</em>
          </h2>
          <p>
            An interactive 3D digital topology of JIIT-128 student societies, technical hubs, cultural troops and athletic programs. Rotate the cluster and inspect any community.
          </p>
        </div>

        {/* Family Filter Tabs */}
        <div className="jyc-3d-family-tabs" role="tablist">
          {FAMILIES.map(fam => (
            <button
              key={fam}
              type="button"
              className={`jyc-3d-tab ${activeFamily === fam ? 'active' : ''}`}
              onClick={() => setActiveFamily(fam)}
            >
              {fam}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={containerRef}
        className="jyc-3d-stage-wrapper"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onClick={handleCanvasClick}
      >
        {/* WebGL Canvas */}
        <canvas ref={canvasRef} className="jyc-3d-canvas" />

        {/* Interactive Drag Hint */}
        <div className="jyc-3d-drag-hint">
          <span>⤹ Drag to rotate 3D cluster · Click node to inspect</span>
        </div>

        {/* Active Node Telemetry Card HUD */}
        {selectedHub && (
          <div className="jyc-3d-hud-card" onClick={e => e.stopPropagation()}>
            <div className="hud-header">
              <span className="hud-icon">{selectedHub.icon}</span>
              <div>
                <span className="hud-family">{selectedHub.family} FAMILY</span>
                <h3 className="hud-name">{selectedHub.name}</h3>
              </div>
            </div>
            <p className="hud-role">{selectedHub.role}</p>
            <div className="hud-actions">
              <button
                type="button"
                className="hud-btn-primary"
                onClick={() => nav(`/clubs/${selectedHub.id}`)}
              >
                View Society Profile ↗
              </button>
              <button
                type="button"
                className="hud-btn-secondary"
                onClick={() => nav('/events')}
              >
                Events
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
