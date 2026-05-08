import React from 'react';

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-100 dark:border-gray-700 flex items-start gap-3 transition-colors">
      <span className="text-2xl mt-0.5">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">{label}</p>
        <p className="text-lg font-bold text-gray-800 dark:text-white truncate">{value}</p>
      </div>
    </div>
  );
}

export default function ISSStats({ position, speed, location, positions, people, loading, error, refresh, autoRefresh, onToggleAutoRefresh }) {
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
        <p className="text-red-600 dark:text-red-400 font-semibold mb-2">⚠️ {error}</p>
        <button
          onClick={refresh}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (loading || !position) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 dark:text-gray-400 text-sm">Fetching ISS data…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard icon="🌍" label="Latitude" value={position.lat.toFixed(4)} />
        <StatCard icon="🌐" label="Longitude" value={position.lon.toFixed(4)} />
        <StatCard icon="⚡" label="Speed" value={`${speed.toFixed(0)} km/h`} />
        <StatCard icon="📍" label="Location" value={location} />
        <StatCard icon="📡" label="Tracked" value={`${positions.length} / 15`} />
      </div>

      {/* People in Space */}
      {people.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border border-gray-100 dark:border-gray-700 transition-colors">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
            <span>🧑‍🚀</span> People in Space
            <span className="ml-auto text-sm font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2.5 py-0.5 rounded-full">
              {people.length}
            </span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {people.map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm text-gray-700 dark:text-gray-300"
              >
                <span className="text-base">👤</span>
                <span className="font-medium">{p.name}</span>
                <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">{p.craft}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Refresh button & Auto-Refresh Toggle */}
      <div className="flex justify-end items-center gap-4">
        <button
          onClick={onToggleAutoRefresh}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            autoRefresh 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
          Auto-Refresh: {autoRefresh ? 'ON' : 'OFF'}
        </button>

        <button
          onClick={refresh}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-md"
        >
          <span>🔄</span> Refresh
        </button>
      </div>
    </div>
  );
}
