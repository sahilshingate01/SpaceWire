import React from 'react';
import ISSMap from './ISSMap';
import ISSStats from './ISSStats';

export default function ISSPanel({ position, positions, speed, location, people, loading, error, refresh }) {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-3xl">🛰️</span>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">ISS Live Tracker</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Real-time International Space Station tracking</p>
        </div>
      </div>

      <ISSMap position={position} positions={positions} speed={speed} location={location} />
      <ISSStats
        position={position}
        speed={speed}
        location={location}
        positions={positions}
        people={people}
        loading={loading}
        error={error}
        refresh={refresh}
      />
    </section>
  );
}
