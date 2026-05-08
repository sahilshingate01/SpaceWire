import React from 'react';
import { MapPin, Zap, Globe, Navigation, Users, RefreshCw, Radio } from 'lucide-react';
import { motion } from 'framer-motion';

function StatCard({ label, value, icon, color = 'cyan', index = 0 }) {
  const borderClass = color === 'cyan' ? 'glow-border-cyan' : 'glow-border-amber';
  const iconColor = color === 'cyan' ? 'text-cyan-400' : 'text-amber-400';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`glass-panel p-5 relative overflow-hidden group hover:bg-white/5 transition-all duration-500`}
    >
      <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-${color}-500/10 transition-all`}></div>
      
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg bg-${color}-500/10 ${iconColor}`}>
          {icon}
        </div>
        <div className="flex gap-1">
          <div className={`w-1 h-1 rounded-full bg-${color}-500/40`}></div>
          <div className={`w-1 h-1 rounded-full bg-${color}-500/20`}></div>
        </div>
      </div>

      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-1">{label}</p>
        <p className="text-xl font-bold text-white font-mono tracking-tight truncate group-hover:text-cyan-400 transition-colors">
          {value}
        </p>
      </div>

      <div className={`absolute bottom-0 left-0 h-[2px] bg-${color}-500/30 w-0 group-hover:w-full transition-all duration-700`}></div>
    </motion.div>
  );
}

export default function ISSStats({ position, speed, location, positions, people, loading, error, refresh, autoRefresh, onToggleAutoRefresh, compact = false }) {
  if (error) {
    return (
      <div className="glass-panel p-8 border-red-500/20 bg-red-500/5 text-center">
        <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Radio className="text-red-400 animate-pulse" size={24} />
        </div>
        <p className="text-red-400 font-display font-bold mb-4 uppercase tracking-widest text-sm">Signal Lost: {error}</p>
        <button
          onClick={refresh}
          className="btn-mission bg-red-500 text-white hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.3)] mx-auto"
        >
          Re-establish Link
        </button>
      </div>
    );
  }

  if (loading && !position) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6 glass-panel border-white/5">
        <div className="relative">
          <div className="w-16 h-16 border-2 border-cyan-500/20 rounded-full animate-[spin_3s_linear_infinite]"></div>
          <div className="w-16 h-16 border-t-2 border-cyan-500 rounded-full absolute top-0 left-0 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="text-cyan-500 font-mono text-xs uppercase tracking-[0.3em] animate-pulse">Synchronizing Uplink...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4`}>
        <StatCard index={0} icon={<Navigation size={18} />} label="Latitude" value={position.lat.toFixed(4)} />
        <StatCard index={1} icon={<Globe size={18} />} label="Longitude" value={position.lon.toFixed(4)} />
        <StatCard index={2} icon={<Zap size={18} />} label="Velocity" value={`${speed.toFixed(0)} km/h`} color="amber" />
        <StatCard index={3} icon={<MapPin size={18} />} label="Position" value={location} />
        <StatCard index={4} icon={<Radio size={18} />} label="Telemetry" value={`${positions.length} Nodes`} />
      </div>

      {/* People in Space & Controls */}
      {!compact && (
        <div className="flex flex-col xl:flex-row gap-6">
          {people.length > 0 && (
            <div className="glass-panel p-6 flex-1 border-white/5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em] flex items-center gap-2 font-display">
                  <Users className="text-cyan-400" size={18} />
                  Personnel In Orbit
                </h3>
                <span className="text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full border border-cyan-500/20">
                  COUNT: {people.length}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {people.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-cyan-500/20 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20">
                      <span className="text-[10px] font-bold">{p.name.charAt(0)}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{p.name}</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">{p.craft}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row xl:flex-col justify-center gap-4">
            <button
              onClick={onToggleAutoRefresh}
              className={`flex items-center justify-between gap-4 px-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-500 border ${
                autoRefresh 
                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_20px_rgba(0,212,255,0.1)]' 
                  : 'bg-white/5 text-slate-500 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-cyan-500 animate-pulse shadow-[0_0_10px_rgba(0,212,255,0.8)]' : 'bg-slate-700'}`}></div>
                AUTO-UPLINK
              </div>
              <span className={autoRefresh ? 'text-cyan-400' : 'text-slate-600'}>{autoRefresh ? 'ACTIVE' : 'OFFLINE'}</span>
            </button>

            <button
              onClick={refresh}
              className="btn-mission h-full min-h-[60px]"
            >
              <RefreshCw size={18} className={`${loading ? 'animate-spin' : ''}`} />
              MANUAL REFRESH
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
