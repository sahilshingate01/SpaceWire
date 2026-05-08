import React from 'react';

export default function ErrorCard({ message, onRetry }) {
  return (
    <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
      <p className="text-red-600 dark:text-red-400 font-semibold mb-3 flex items-center justify-center gap-2">
        <span aria-hidden>⚠️</span>
        <span className="break-words">{message}</span>
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}

