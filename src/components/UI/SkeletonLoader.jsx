import React from 'react';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function SkeletonLoader({ variant = 'card', className }) {
  if (variant === 'text-line') {
    return (
      <div
        className={cx(
          'h-3 w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse',
          className
        )}
      />
    );
  }

  if (variant === 'image') {
    return (
      <div
        className={cx(
          'w-full h-44 rounded bg-gray-200 dark:bg-gray-700 animate-pulse',
          className
        )}
      />
    );
  }

  // card
  return (
    <div
      className={cx(
        'bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 animate-pulse',
        className
      )}
    >
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

