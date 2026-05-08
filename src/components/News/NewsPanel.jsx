import React from 'react';
import toast from 'react-hot-toast';
import { CATEGORIES } from '../../hooks/useNews';
import NewsCard, { SkeletonCard } from './NewsCard';
import { Search, Filter, RefreshCw, LayoutGrid } from 'lucide-react';

const CATEGORY_LABELS = {
  space: 'Cosmos',
  technology: 'Tech',
  science: 'Science',
  business: 'Finance',
  health: 'Life',
  sports: 'Sports',
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
}) {

  const handleRefresh = async () => {
    try {
      await refresh?.();
    } catch (e) {
      toast.error(e?.message || 'Uplink failed');
    }
  };

  return (
    <section className="space-y-10">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-3 p-1.5 glass-panel rounded-2xl w-fit border-white/5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onActiveCategoryChange?.(cat)}
            className={`px-6 py-2.5 rounded-[14px] text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
              activeCategory === cat
                ? 'bg-cyan-500 text-[#003642] shadow-[0_0_20px_rgba(0,212,255,0.3)] scale-105'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full lg:w-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search Intelligence Database..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl glass-panel bg-white/5 border-white/10 text-sm focus:border-cyan-500/50 outline-none transition-all placeholder:text-slate-600"
          />
        </div>

        <div className="flex gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:flex-none">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-12 pr-8 py-4 rounded-2xl glass-panel bg-white/5 border-white/10 text-sm appearance-none outline-none focus:border-cyan-500/50 transition-all text-slate-300 w-full lg:w-48"
            >
              <option value="date" className="bg-[#050a14]">Chrono Sort</option>
              <option value="source" className="bg-[#050a14]">Source Sort</option>
            </select>
          </div>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="btn-mission min-w-[140px]"
          >
            <RefreshCw className={`${loading ? 'animate-spin' : ''}`} size={18} />
            SYNC FEED
          </button>
        </div>
      </div>

      {/* Articles Grid */}
      {error ? (
        <div className="glass-panel p-12 text-center border-red-500/20 bg-red-500/5">
          <p className="text-red-400 font-bold uppercase tracking-widest mb-4">{error}</p>
          <button onClick={handleRefresh} className="btn-mission bg-red-500 text-white mx-auto">Retry Sync</button>
        </div>
      ) : (
        <>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="glass-panel p-20 text-center border-white/5">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <LayoutGrid className="text-slate-600" size={32} />
              </div>
              <p className="text-slate-400 font-display font-bold uppercase tracking-widest">No Intelligence Data Found</p>
              <p className="text-slate-600 text-sm mt-2 font-mono">Try adjusting your filters or search parameters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {articles.map((article, i) => (
                <NewsCard key={article.url || i} article={article} index={i} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
