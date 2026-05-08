import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { PieChart as PieIcon } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const CATEGORY_COLORS = {
  space: '#00d4ff',      // Cyan
  technology: '#7b6fff', // Purple
  science: '#00ff9d',    // Green
  business: '#ff9500',   // Amber
  health: '#ff4d4d',     // Red
  sports: '#f0abfc',     // Pink
};

const centerLabelPlugin = {
  id: 'centerLabel',
  afterDraw(chart, args, opts) {
    const { ctx, chartArea } = chart;
    if (!chartArea) return;
    const total = opts?.total ?? 0;
    const label = opts?.label ?? 'SENSORS';

    const x = (chartArea.left + chartArea.right) / 2;
    const y = (chartArea.top + chartArea.bottom) / 2;

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 24px "Space Grotesk"';
    ctx.fillText(String(total), x, y - 8);
    ctx.font = '700 10px "JetBrains Mono"';
    ctx.fillStyle = '#64748b';
    ctx.fillText(label, x, y + 15);
    ctx.restore();
  },
};

import { motion } from 'framer-motion';

export default function NewsDistributionChart({
  articleCounts = {},
  onCategorySelect,
}) {
  const categories = useMemo(() => Object.keys(articleCounts), [articleCounts]);
  const counts = useMemo(() => categories.map((c) => articleCounts[c] || 0), [categories, articleCounts]);
  const total = useMemo(() => counts.reduce((a, b) => a + b, 0), [counts]);

  const data = useMemo(() => {
    return {
      labels: categories.map(c => c.toUpperCase()),
      datasets: [
        {
          data: counts,
          backgroundColor: categories.map((c) => CATEGORY_COLORS[c] || '#475569'),
          borderColor: 'rgba(5, 10, 20, 0.8)',
          borderWidth: 4,
          hoverOffset: 15,
        },
      ],
    };
  }, [categories, counts]);

  const options = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { 
            color: '#859398', 
            usePointStyle: true, 
            boxWidth: 8,
            font: { family: 'JetBrains Mono', size: 10, weight: '700' },
            padding: 20
          },
        },
        centerLabel: { total, label: 'HEADLINES', color: '#ffffff' },
        tooltip: {
          backgroundColor: 'rgba(13, 22, 40, 0.95)',
          titleFont: { family: 'JetBrains Mono', size: 10 },
          bodyFont: { family: 'JetBrains Mono', size: 12, weight: '700' },
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          padding: 12,
          displayColors: true,
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${ctx.raw} RECORDS`,
          },
        },
      },
      onClick: (_evt, elements, chart) => {
        if (!elements?.length || !onCategorySelect) return;
        const idx = elements[0].index;
        const label = chart.data.labels?.[idx]?.toLowerCase();
        if (typeof label === 'string') onCategorySelect(label);
      },
      cutout: '75%',
    };
  }, [onCategorySelect, total]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="glass-panel p-6 border-white/5 flex flex-col"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <PieIcon className="text-cyan-400" size={18} />
          <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em] font-display">Intelligence Distribution</h3>
        </div>
        <div className="flex gap-1">
          <div className="w-1 h-1 rounded-full bg-cyan-500/40"></div>
          <div className="w-1 h-1 rounded-full bg-cyan-500/20"></div>
        </div>
      </div>
      <div className="h-[280px]">
        <Doughnut data={data} options={options} plugins={[centerLabelPlugin]} />
      </div>
    </motion.div>
  );
}

