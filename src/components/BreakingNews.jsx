import React from 'react';
import { ChevronRight, MessageSquare } from 'lucide-react';

const newsItems = [
  {
    id: 1,
    category: 'ENGINEERING',
    title: 'New Propulsion System Ready for Deep Space Tests',
    description: "NASA's latest ion thruster reaches record efficiency in vacuum chamber tests...",
    source: 'Space Intel',
    image: '/assets/news/thruster.png',
    color: 'var(--accent-orange)'
  },
  {
    id: 2,
    category: 'SCIENCE',
    title: 'James Webb Captures Unprecedented Galactic Spiral',
    description: 'The latest imagery revealed hidden structures in the NGC 1566 galaxy core...',
    source: 'NASA Web',
    image: '/assets/news/galaxy.png',
    color: 'var(--accent-cyan)'
  },
  {
    id: 3,
    category: 'DISCOVERY',
    title: 'Evidence of Ancient River Deltas on Mars Surface',
    description: 'Rover data confirms mineral deposits consistent with long-term water flow...',
    source: 'Planetary Sci',
    image: '/assets/news/mars.png',
    color: '#a78bfa'
  },
  {
    id: 4,
    category: 'COMMUNICATION',
    title: 'Deep Space Network Upgrade Completes Early Phase',
    description: 'New laser-based communication arrays triple data bandwidth for lunar missions...',
    source: 'Tech Radar Space',
    image: '/assets/news/satellite.png',
    color: '#f472b6'
  }
];

export default function BreakingNews() {
  return (
    <div className="flex-col gap-4">
      <div className="flex-between">
        <h2 className="header-title" style={{ fontSize: '1.75rem' }}>Breaking News</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['All', 'Tech', 'Science', 'Astrophysics'].map((tab, i) => (
            <button 
              key={tab} 
              style={{ 
                padding: '0.4rem 1rem', 
                borderRadius: '20px', 
                border: '1px solid var(--border-color)',
                background: i === 0 ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.05)',
                color: i === 0 ? '#000' : 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
        {newsItems.map((item) => (
          <div key={item.id} className="glass-card" style={{ display: 'flex', overflow: 'hidden', cursor: 'pointer' }}>
            <div style={{ width: '180px', minWidth: '180px', height: '140px', position: 'relative' }}>
              <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(90deg, transparent 0%, rgba(18, 20, 28, 0.8) 100%)' }}></div>
            </div>
            
            <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: item.color, letterSpacing: '0.1em', marginBottom: '0.25rem' }}>{item.category}</span>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem', lineHeight: 1.3 }}>{item.title}</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {item.description}
              </p>
              
              <div className="flex-between">
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>Source: {item.source}</span>
                <ChevronRight size={16} color="var(--accent-cyan)" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button style={{
        position: 'fixed',
        right: '2rem',
        bottom: '8rem',
        width: '56px',
        height: '56px',
        borderRadius: '16px',
        background: 'var(--accent-cyan)',
        color: '#000',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 24px rgba(56, 189, 248, 0.3)',
        cursor: 'pointer',
        zIndex: 100
      }}>
        <MessageSquare size={24} />
      </button>
    </div>
  );
}
