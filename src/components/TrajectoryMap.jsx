import React from 'react';

export default function TrajectoryMap() {
  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <h3 className="section-title">Trajectory Prediction Map</h3>
      
      <div style={{ flex: 1, borderRadius: '12px', overflow: 'hidden', position: 'relative', minHeight: '220px', background: '#05070a' }}>
        <img 
          src="https://www.mapsofworld.com/world-maps/image/world-map-night.jpg" 
          alt="Night World Map" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} 
        />
        
        {/* Trajectory SVG Overlay */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} viewBox="0 0 1000 500">
          <path 
            d="M 100 250 Q 250 150 400 280 T 700 200 T 900 300" 
            fill="none" 
            stroke="var(--accent-cyan)" 
            strokeWidth="2" 
            strokeDasharray="6 4"
            opacity="0.8"
          />
          
          <circle cx="100" cy="250" r="3" fill="var(--accent-cyan)" />
          <circle cx="400" cy="280" r="3" fill="var(--accent-cyan)" />
          <circle cx="700" cy="200" r="3" fill="var(--accent-cyan)" />
          <circle cx="900" cy="300" r="3" fill="var(--accent-cyan)" />
          
          {/* Current Position Marker */}
          <g>
            <circle cx="400" cy="280" r="8" fill="var(--accent-cyan)" opacity="0.3">
              <animate attributeName="r" values="8;14;8" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="400" cy="280" r="3" fill="var(--accent-cyan)" />
          </g>
        </svg>
      </div>
    </div>
  );
}
