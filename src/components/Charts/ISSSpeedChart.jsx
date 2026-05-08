import React, { useMemo, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Activity as ActivityIcon } from 'lucide-react';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

function formatHMS(t) {
  if (typeof t === 'string' && t.includes(':')) return t;
  const d = new Date(t);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('en-US', { hour12: false });
}

export default function ISSSpeedChart({ speedHistory = [] }) {
  const chartRef = useRef(null);

  const last = useMemo(() => speedHistory.slice(-30), [speedHistory]);
  const labels = useMemo(() => last.map((p) => formatHMS(p.time)), [last]);
  const values = useMemo(() => last.map((p) => p.speed), [last]);

  const data = useMemo(() => {
    return {
      labels,
      datasets: [
        {
          label: 'Orbital Velocity',
          data: values,
          borderColor: '#00d4ff',
          borderWidth: 3,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#00d4ff',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2,
          tension: 0.4,
          fill: true,
          backgroundColor: (ctx) => {
            const chart = ctx.chart;
            const { ctx: canvasCtx, chartArea } = chart;
            if (!chartArea) return 'rgba(0, 212, 255, 0.1)';
            const g = canvasCtx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            g.addColorStop(0, 'rgba(0, 212, 255, 0.25)');
            g.addColorStop(1, 'rgba(0, 212, 255, 0)');
            return g;
          },
        },
      ],
    };
  }, [labels, values]);

  const options = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(13, 22, 40, 0.95)',
          titleColor: '#859398',
          titleFont: { family: 'JetBrains Mono', size: 10, weight: '700' },
          bodyColor: '#00d4ff',
          bodyFont: { family: 'JetBrains Mono', size: 12, weight: '700' },
          borderColor: 'rgba(0, 212, 255, 0.2)',
          borderWidth: 1,
          padding: 12,
          displayColors: false,
          callbacks: {
            title: (items) => (items?.[0]?.label ? `TIMESTAMP: ${items[0].label}` : 'TIME'),
            label: (item) => `VELOCITY: ${Number(item.raw).toLocaleString()} KM/H`,
          },
        },
      },
      scales: {
        x: {
          ticks: { 
            color: '#475569', 
            font: { family: 'JetBrains Mono', size: 9 },
            maxRotation: 0, 
            autoSkip: true 
          },
          grid: { display: false },
        },
        y: {
          ticks: { 
            color: '#475569',
            font: { family: 'JetBrains Mono', size: 9 },
            callback: (val) => `${(val/1000).toFixed(1)}k`
          },
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
        },
      },
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      className="glass-panel p-6 border-white/5 flex flex-col"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ActivityIcon className="text-cyan-400" size={18} />
          <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em] font-display">Velocity Metrics</h3>
        </div>
        <div className="flex gap-1">
          <div className="w-1 h-3 bg-cyan-500/20 rounded-full"></div>
          <div className="w-1 h-3 bg-cyan-500/40 rounded-full"></div>
          <div className="w-1 h-3 bg-cyan-500/60 rounded-full"></div>
        </div>
      </div>
      <div className="h-[280px]">
        <Line ref={chartRef} data={data} options={options} />
      </div>
      <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-slate-500">
        <span>UPLINK: ACTIVE</span>
        <span className="text-cyan-500/60">SENSORS: NOMINAL</span>
      </div>
    </motion.div>
  );
}

