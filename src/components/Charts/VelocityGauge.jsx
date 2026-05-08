import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Gauge, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function VelocityGauge({ speed = 0 }) {
  const maxSpeed = 30000;
  const percentage = Math.min((speed / maxSpeed) * 100, 100);
  
  const data = useMemo(() => {
    return {
      labels: ['Current Velocity', 'Remaining'],
      datasets: [
        {
          data: [speed, Math.max(0, maxSpeed - speed)],
          backgroundColor: [
            '#00d4ff', // Cyan
            'rgba(255, 255, 255, 0.05)', // Background track
          ],
          borderColor: 'transparent',
          borderWidth: 0,
          circumference: 180,
          rotation: 270,
          cutout: '85%',
          borderRadius: 20,
        },
      ],
    };
  }, [speed]);

  const options = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="glass-panel p-8 border-white/5 flex flex-col items-center justify-center relative overflow-hidden h-full"
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="flex items-center gap-2 mb-8 self-start">
        <Zap className="text-cyan-400" size={18} />
        <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em] font-display">Real-Time Velocity</h3>
      </div>

      <div className="relative w-full h-[250px] flex items-center justify-center">
        <Doughnut data={data} options={options} />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-12">
          <motion.div
            key={speed}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <span className="text-5xl md:text-6xl font-bold font-mono tracking-tighter text-white">
              {Math.floor(speed).toLocaleString()}
            </span>
            <div className="text-cyan-400 font-mono text-xs font-bold tracking-[0.3em] mt-2">KM/H</div>
          </motion.div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-8 w-full border-t border-white/5 pt-8">
        <div>
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Max Design</div>
          <div className="text-lg font-mono font-bold text-white">30,000 <span className="text-[10px] text-slate-500">KM/H</span></div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Thrust Status</div>
          <div className="text-lg font-mono font-bold text-cyan-400">NOMINAL</div>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex justify-between px-2">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`w-1 h-1 rounded-full ${i < (percentage/20) ? 'bg-cyan-500' : 'bg-white/10'}`}></div>
          ))}
        </div>
        <div className="text-[8px] font-mono text-slate-600 uppercase tracking-tighter">Velocity-Vector Alpha-7</div>
      </div>
    </motion.div>
  );
}
