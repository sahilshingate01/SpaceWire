import React from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { TrendingUp, BarChart2 } from 'lucide-react';

const data = [
  { val: 26000 },
  { val: 26200 },
  { val: 26500 },
  { val: 26800 },
  { val: 27100 },
  { val: 27400 },
  { val: 27500 },
  { val: 27300 },
  { val: 26800 },
  { val: 26400 },
  { val: 26200 },
  { val: 26500 },
  { val: 27100 },
  { val: 27581 }
];

export default function SpeedTrend() {
  return (
    <div className="glass-card flex-col" style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="section-title">
        <span>Speed Trend</span>
        <TrendingUp size={18} color="var(--accent-orange)" />
      </div>

      <div style={{ position: 'relative', flex: 1, marginTop: '1rem', minHeight: '200px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <YAxis domain={['dataMin - 1000', 'dataMax + 1000']} hide />
            <Line 
              type="monotone" 
              dataKey="val" 
              stroke="var(--accent-orange)" 
              strokeWidth={4} 
              dot={false}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
        
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>28k</div>
          <div style={{ position: 'absolute', top: 0, right: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>MAX</div>
          
          <div style={{ position: 'absolute', top: '50%', left: 0, fontSize: '0.75rem', color: 'var(--text-muted)', transform: 'translateY(-50%)' }}>27k</div>
          <div style={{ position: 'absolute', top: '50%', right: 0, fontSize: '0.75rem', color: 'var(--text-muted)', transform: 'translateY(-50%)' }}>AVG</div>
          
          <div style={{ position: 'absolute', bottom: 0, left: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>26k</div>
          <div style={{ position: 'absolute', bottom: 0, right: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>MIN</div>
          
          <div style={{ position: 'absolute', top: '10%', left: 0, right: 0, borderTop: '1px dashed var(--border-color)' }}></div>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '1px dashed var(--border-color)' }}></div>
          <div style={{ position: 'absolute', bottom: '10%', left: 0, right: 0, borderTop: '1px dashed var(--border-color)' }}></div>
        </div>
      </div>


    </div>
  );
}
