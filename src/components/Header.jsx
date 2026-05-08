import React, { useState, useEffect } from 'react';
import { Bell, Settings, User } from 'lucide-react';

export default function Header() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toISOString().substr(11, 8);
  };

  return (
    <header className="header">
      <div className="header-brand">
        <span className="header-brand-badge">Mission Control Dashboard</span>
        <h1 className="header-title">Real-Time ISS Intelligence</h1>
      </div>



      <div className="header-controls">
        <div className="time-display">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>{formatTime(time)}</span> GMT
        </div>
        <button className="icon-btn"><Bell size={20} /></button>
        <button className="icon-btn"><Settings size={20} /></button>
        <button className="icon-btn" style={{ background: 'var(--bg-card)', padding: '4px', borderRadius: '50%' }}>
          <User size={20} />
        </button>
      </div>
    </header>
  );
}
