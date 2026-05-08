import React from 'react';
import { ExternalLink, Calendar, User } from 'lucide-react';
import { motion } from 'framer-motion';

function SkeletonCard() {
  return (
    <div className="glass-panel overflow-hidden border-white/5 animate-pulse">
      <div className="h-48 bg-white/5" />
      <div className="p-6 space-y-4">
        <div className="h-4 bg-white/5 rounded w-3/4" />
        <div className="h-3 bg-white/5 rounded w-1/2" />
        <div className="space-y-2">
          <div className="h-3 bg-white/5 rounded w-full" />
          <div className="h-3 bg-white/5 rounded w-5/6" />
        </div>
        <div className="h-10 bg-white/5 rounded-xl w-32" />
      </div>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return 'Unknown';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80';

export default function NewsCard({ article, loading, index = 0 }) {
  if (loading) return <SkeletonCard />;

  const { title, source, author, publishedAt, description, url, urlToImage } = article;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.1, 1) }}
      whileHover={{ y: -5 }}
      className="glass-panel overflow-hidden border-white/5 hover:border-cyan-500/30 transition-all duration-500 flex flex-col group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.7 }}
          src={urlToImage || FALLBACK_IMAGE}
          alt={title}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = FALLBACK_IMAGE;
          }}
        />
        <div className="absolute top-4 left-4 z-20">
          <span className="px-3 py-1 bg-cyan-500/20 backdrop-blur-md border border-cyan-500/30 rounded-full text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
            {source?.name || 'Intelligence'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 relative z-20">
        <h3 className="text-lg font-bold text-white leading-snug line-clamp-2 mb-3 group-hover:text-cyan-400 transition-colors font-display">
          {title}
        </h3>

        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
            <Calendar size={12} className="text-cyan-500/50" />
            {formatDate(publishedAt)}
          </div>
          {author && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono truncate max-w-[150px]">
              <User size={12} className="text-cyan-500/50" />
              {author}
            </div>
          )}
        </div>

        <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 mb-6">
          {description || "Intelligence stream active. Further analysis required to extract secondary metadata."}
        </p>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest hover:text-white transition-colors group/link"
        >
          Access Intelligence 
          <ExternalLink size={14} className="group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
        </a>
      </div>

      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none">
        <div className="absolute top-0 right-0 w-[1px] h-4 bg-cyan-500/40"></div>
        <div className="absolute top-0 right-0 h-[1px] w-4 bg-cyan-500/40"></div>
      </div>
    </motion.div>
  );
}

export { SkeletonCard };
