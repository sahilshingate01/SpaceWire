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
  // t may already be HH:MM:SS; if it's a Date/number, format it.
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
          label: 'Speed (km/h)',
          data: values,
          borderColor: '#6366f1',
          borderWidth: 2,
          pointRadius: 2,
          pointHoverRadius: 5,
          pointBackgroundColor: '#6366f1',
          tension: 0.4,
          fill: true,
          backgroundColor: (ctx) => {
            const chart = ctx.chart;
            const { ctx: canvasCtx, chartArea } = chart;
            if (!chartArea) return 'rgba(99, 102, 241, 0.15)';
            const g = canvasCtx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            g.addColorStop(0, 'rgba(99, 102, 241, 0.35)');
            g.addColorStop(1, 'rgba(99, 102, 241, 0.05)');
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
        title: {
          display: true,
          text: 'ISS Speed Over Time',
          color: '#9ca3af',
          font: { size: 14, weight: '600' },
          padding: { top: 6, bottom: 10 },
        },
        tooltip: {
          enabled: true,
          callbacks: {
            title: (items) => (items?.[0]?.label ? `Time: ${items[0].label}` : 'Time'),
            label: (item) => `Speed: ${Number(item.raw).toFixed(0)} km/h`,
          },
        },
      },
      scales: {
        x: {
          ticks: { color: '#9ca3af', maxRotation: 0, autoSkip: true },
          grid: { color: 'rgba(156,163,175,0.12)' },
        },
        y: {
          title: { display: true, text: 'km/h', color: '#9ca3af' },
          ticks: { color: '#9ca3af' },
          grid: { color: 'rgba(156,163,175,0.12)' },
        },
      },
    };
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-100 dark:border-gray-700 transition-colors">
      <div className="h-[320px]">
        <Line ref={chartRef} data={data} options={options} />
      </div>
    </div>
  );
}

