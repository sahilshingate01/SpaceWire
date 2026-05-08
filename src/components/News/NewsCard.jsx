import React from 'react';

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 animate-pulse">
      <div className="h-44 bg-gray-200 dark:bg-gray-700" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        </div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-28" />
      </div>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return 'Unknown date';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function truncate(str, max = 100) {
  if (!str) return '';
  return str.length > max ? str.slice(0, max) + '…' : str;
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1504711434969-e33886168d6c?w=600&h=300&fit=crop&q=60';

export default function NewsCard({ article, loading }) {
  if (loading) return <SkeletonCard />;

  const { title, source, author, publishedAt, description, url, urlToImage } = article;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow flex flex-col">
      {/* Image */}
      <img
        src={urlToImage || FALLBACK_IMAGE}
        alt={title}
        className="h-44 w-full object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = FALLBACK_IMAGE;
        }}
      />

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="text-base font-semibold text-gray-800 dark:text-white leading-snug line-clamp-2">
          {title}
        </h3>

        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="font-medium text-indigo-600 dark:text-indigo-400">{source?.name}</span>
          {author && (
            <>
              <span>•</span>
              <span className="truncate max-w-[120px]">{author}</span>
            </>
          )}
          <span>•</span>
          <span>{formatDate(publishedAt)}</span>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 flex-1">
          {truncate(description, 100)}
        </p>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
        >
          Read More <span aria-hidden>→</span>
        </a>
      </div>
    </div>
  );
}

export { SkeletonCard };
