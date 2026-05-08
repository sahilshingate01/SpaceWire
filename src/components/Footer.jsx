import React from 'react';

export default function Footer() {
  return (
    <footer className="flex-between" style={{ padding: '2rem 0', borderTop: '1px solid var(--border-color)', marginTop: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.05em' }}>ISS INTELLIGENCE</span>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>© 2026 ORBITAL COMMAND</span>
      </div>

      <div style={{ display: 'flex', gap: '2rem' }}>
        <a href="#" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600, letterSpacing: '0.05em' }}>PRIVACY</a>
        <a href="#" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600, letterSpacing: '0.05em' }}>PROTOCOLS</a>
        <a href="#" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600, letterSpacing: '0.05em' }}>SUPPORT</a>
      </div>
    </footer>
  );
}
