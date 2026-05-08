import React from 'react';
import toast from 'react-hot-toast';
import { CATEGORIES } from '../../hooks/useNews';
import NewsCard, { SkeletonCard } from './NewsCard';

const CATEGORY_LABELS = {
  space: '🚀 Space',
  technology: '💻 Technology',
  science: '🔬 Science',
  business: '💼 Business',
  health: '🏥 Health',
  sports: '⚽ Sports',
};

export default function NewsPanel({
  activeCategory,
  onActiveCategoryChange,
  articles,
  loading,
  error,
  refresh,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  onArticlesUpdate,
}) {

  React.useEffect(() => {
    if (onArticlesUpdate && articles) {
      onArticlesUpdate(articles);
    }
  }, [articles, onArticlesUpdate]);

  const handleRefresh = async () => {
    try {
      await refresh?.();
      toast.success(`Refreshing ${activeCategory} news…`);
    } catch (e) {
      toast.error(e?.message || 'Failed to refresh news');
    }
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-3xl">📰</span>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">News Dashboard</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Top headlines from around the world</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onActiveCategoryChange?.(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Controls: Search, Sort, Refresh */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search articles…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-colors"
          />
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
        >
          <option value="date">Sort by Date</option>
          <option value="source">Sort by Source</option>
        </select>

        {/* Refresh */}
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-md whitespace-nowrap"
        >
          <span className={loading ? 'animate-spin inline-block' : ''}>🔄</span> Refresh
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
          <p className="text-red-600 dark:text-red-400 font-semibold mb-2">⚠️ {error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Articles Grid */}
      {!error && (
        <>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-gray-500 dark:text-gray-400 font-medium">No articles found</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                {searchQuery ? 'Try a different search term' : 'Try refreshing or switching categories'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article, i) => (
                <NewsCard key={article.url || i} article={article} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
