import React, { useEffect, useState, useRef } from 'react';
import Globe from 'react-globe.gl';

export default function ISSLiveTracking() {
  const [issData, setIssData] = useState({ lat: -24.582, lng: 132.844, vel: 27581, alt: 418 });
  const globeEl = useRef();

  useEffect(() => {
    // Optionally fetch real ISS data here
    // For now we use the static placeholder resembling the screenshot
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
    }
  }, []);

  const gData = [{
    lat: issData.lat,
    lng: issData.lng,
    size: 0.1,
    color: '#38bdf8'
  }];

  const N = 100;
  const arcsData = [...Array(N).keys()].map(() => ({
    startLat: (Math.random() - 0.5) * 180,
    startLng: (Math.random() - 0.5) * 360,
    endLat: (Math.random() - 0.5) * 180,
    endLng: (Math.random() - 0.5) * 360,
    color: ['rgba(251, 146, 60, 0.1)', 'rgba(251, 146, 60, 0.1)']
  }));

  // Create a trajectory line
  const pathData = [[
    [-20, 100, 400],
    [-24.582, 132.844, 418],
    [-30, 160, 420]
  ]];

  return (
    <div className="glass-card flex-col" style={{ position: 'relative', overflow: 'hidden', height: '100%', minHeight: '400px' }}>
      <div style={{ padding: '1.5rem', position: 'relative', zIndex: 10 }}>
        <div className="section-title">
          <span>ISS Live Tracking</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button style={{ 
                padding: '0.35rem 0.85rem', 
                background: 'rgba(56, 189, 248, 0.1)', 
                color: 'var(--accent-cyan)', 
                border: '1px solid rgba(56, 189, 248, 0.3)', 
                borderRadius: '20px', 
                fontSize: '0.7rem', 
                fontWeight: 600,
                cursor: 'pointer'
              }}>
                Refresh Now
              </button>
              <button style={{ 
                padding: '0.35rem 0.85rem', 
                background: 'rgba(255, 255, 255, 0.05)', 
                color: 'var(--text-secondary)', 
                border: '1px solid var(--border-color)', 
                borderRadius: '20px', 
                fontSize: '0.7rem', 
                fontWeight: 600,
                cursor: 'pointer'
              }}>
                Auto-Refresh: <span style={{ color: 'var(--accent-cyan)' }}>ON</span>
              </button>
            </div>
            <div className="live-badge">
              <div className="live-dot"></div>
              LIVE
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem' }}>
          <div className="flex-col gap-2">
            <span className="text-muted">Latitude</span>
            <span className="text-value">{issData.lat}</span>
          </div>
          <div className="flex-col gap-2">
            <span className="text-muted">Longitude</span>
            <span className="text-value">{issData.lng}</span>
          </div>
          <div className="flex-col gap-2">
            <span className="text-muted">Velocity</span>
            <span className="text-value">{issData.vel.toLocaleString()}<span className="text-unit"> km/h</span></span>
          </div>
          <div className="flex-col gap-2">
            <span className="text-muted">Altitude</span>
            <span className="text-value">{issData.alt}<span className="text-unit"> km</span></span>
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', top: '100px', left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', opacity: 0.8 }}>
        <Globe
          ref={globeEl}
          width={800}
          height={600}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          pointsData={gData}
          pointAltitude={0.1}
          pointColor="color"
          pointRadius={0.5}
          pathsData={pathData}
          pathColor={() => 'rgba(251, 146, 60, 0.8)'}
          pathDashLength={0.1}
          pathDashGap={0.05}
          pathDashAnimateTime={12000}
        />
      </div>

      <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', zIndex: 10 }}>
        <div style={{ background: 'rgba(0,0,0,0.5)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          NEAREST: ALICE SPRINGS, AU
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', zIndex: 10, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>PEOPLE IN SPACE: 07</span>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#333', border: '2px solid var(--bg-card)', marginLeft: i > 1 ? '-8px' : 0, overflow: 'hidden' }}>
              <img src={`https://i.pravatar.cc/100?img=${i+10}`} style={{ width: '100%', height: '100%' }} />
            </div>
          ))}
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '2px solid var(--bg-card)', marginLeft: '-8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 'bold' }}>
            +4
          </div>
        </div>
      </div>
    </div>
  );
}
