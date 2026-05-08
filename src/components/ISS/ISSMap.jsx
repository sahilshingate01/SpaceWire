import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Crosshair } from 'lucide-react';

const issIcon = L.divIcon({
  html: `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-12 h-12 bg-cyan-500/20 rounded-full animate-ping"></div>
      <div class="absolute w-8 h-8 bg-cyan-500/30 rounded-full animate-pulse"></div>
      <div class="relative bg-[#050a14] border-2 border-cyan-500 rounded-lg p-1 shadow-[0_0_15px_rgba(0,212,255,0.6)]">
        <span style="font-size:24px;">🛰️</span>
      </div>
    </div>
  `,
  className: 'iss-icon',
  iconSize: [48, 48],
  iconAnchor: [24, 24],
});

function RecenterMap({ lat, lon }) {
  const map = useMap();
  React.useEffect(() => {
    if (lat != null && lon != null) {
      map.setView([lat, lon], map.getZoom(), { animate: true });
    }
  }, [lat, lon, map]);
  return null;
}

export default function ISSMap({ position, positions, speed, location }) {
  const polylinePositions = useMemo(
    () => positions.map((p) => [p.lat, p.lon]),
    [positions]
  );

  if (!position) return null;

  return (
    <div className="w-full h-full glass-panel overflow-hidden border-white/5 relative group">
      <div className="absolute top-6 left-6 z-[400] flex flex-col gap-2">
        <div className="glass-panel px-4 py-2 bg-[#050a14]/80 backdrop-blur-md border-cyan-500/30 flex items-center gap-3">
          <Crosshair className="text-cyan-400 animate-pulse" size={16} />
          <span className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">Orbital Tracking Active</span>
        </div>
        <div className="glass-panel px-4 py-2 bg-[#050a14]/80 backdrop-blur-md border-white/10">
          <div className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Sector Location</div>
          <div className="text-xs font-mono text-cyan-400">{location}</div>
        </div>
      </div>

      <MapContainer
        center={[position.lat, position.lon]}
        zoom={3}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        className="z-0 grayscale-[0.5] contrast-[1.2]"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <RecenterMap lat={position.lat} lon={position.lon} />

        <Marker position={[position.lat, position.lon]} icon={issIcon}>
          <Tooltip direction="top" offset={[0, -24]} opacity={1} permanent={false}>
            <div className="glass-panel p-3 bg-[#050a14]/90 border-cyan-500/40 text-white min-w-[140px]">
              <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2 border-b border-white/5 pb-1">Satellite Telemetry</div>
              <div className="space-y-1 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">LAT:</span>
                  <span>{position.lat.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">LON:</span>
                  <span>{position.lon.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">SPD:</span>
                  <span className="text-amber-400">{speed.toFixed(0)} km/h</span>
                </div>
              </div>
            </div>
          </Tooltip>
        </Marker>

        {polylinePositions.length > 1 && (
          <Polyline
            positions={polylinePositions}
            pathOptions={{ 
              color: '#00d4ff', 
              weight: 2, 
              opacity: 0.6, 
              dashArray: '10 10',
              lineCap: 'round'
            }}
          />
        )}
      </MapContainer>

      {/* Decorative Overlays */}
      <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none z-[400] opacity-20">
        <div className="absolute top-8 right-8 w-[1px] h-12 bg-cyan-500"></div>
        <div className="absolute top-8 right-8 h-[1px] w-12 bg-cyan-500"></div>
      </div>
    </div>
  );
}
