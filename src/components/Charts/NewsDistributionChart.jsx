import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const CATEGORY_COLORS = {
  space: '#8b5cf6',
  technology: '#6366f1',
  science: '#22c55e',
  business: '#f59e0b',
  health: '#ef4444',
  sports: '#06b6d4',
};

const centerLabelPlugin = {
  id: 'centerLabel',
  afterDraw(chart, args, opts) {
    const { ctx, chartArea } = chart;
    if (!chartArea) return;
    const total = opts?.total ?? 0;
    const label = opts?.label ?? 'Total';

    const x = (chartArea.left + chartArea.right) / 2;
    const y = (chartArea.top + chartArea.bottom) / 2;

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = opts?.color ?? '#9ca3af';
    ctx.font = '600 18px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto';
    ctx.fillText(String(total), x, y - 8);
    ctx.font = '500 12px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto';
    ctx.fillText(label, x, y + 12);
    ctx.restore();
  },
};

export default function NewsDistributionChart({
  articleCounts = {},
  onCategorySelect,
}) {
  const categories = useMemo(() => Object.keys(articleCounts), [articleCounts]);
  const counts = useMemo(() => categories.map((c) => articleCounts[c] || 0), [categories, articleCounts]);
  const total = useMemo(() => counts.reduce((a, b) => a + b, 0), [counts]);

  const data = useMemo(() => {
    return {
      labels: categories,
      datasets: [
        {
          data: counts,
          backgroundColor: categories.map((c) => CATEGORY_COLORS[c] || '#a3a3a3'),
          borderColor: 'rgba(255,255,255,0.8)',
          borderWidth: 2,
          hoverOffset: 10,
        },
      ],
    };
  }, [categories, counts]);

  const options = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'News by Category',
          color: '#9ca3af',
          font: { size: 14, weight: '600' },
          padding: { top: 6, bottom: 10 },
        },
        legend: {
          position: 'bottom',
          labels: { color: '#9ca3af', usePointStyle: true, boxWidth: 10 },
        },
        centerLabel: { total, label: 'articles', color: '#9ca3af' },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label}: ${ctx.raw}`,
          },
        },
      },
      onClick: (_evt, elements, chart) => {
        if (!elements?.length || !onCategorySelect) return;
        const idx = elements[0].index;
        const label = chart.data.labels?.[idx];
        if (typeof label === 'string') onCategorySelect(label);
      },
      cutout: '68%',
    };
  }, [onCategorySelect, total]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-100 dark:border-gray-700 transition-colors">
      <div className="h-[320px]">
        <Doughnut data={data} options={options} plugins={[centerLabelPlugin]} />
      </div>
    </div>
  );
}

