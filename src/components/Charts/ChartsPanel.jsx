import React from 'react';
import ISSSpeedChart from './ISSSpeedChart';
import NewsDistributionChart from './NewsDistributionChart';

export default function ChartsPanel({
  speedHistory,
  articleCounts,
  onCategorySelect,
}) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ISSSpeedChart speedHistory={speedHistory} />
      <NewsDistributionChart
        articleCounts={articleCounts}
        onCategorySelect={onCategorySelect}
      />
    </section>
  );
}

