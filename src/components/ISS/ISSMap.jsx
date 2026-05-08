import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom ISS icon using a satellite emoji rendered as a div icon
const issIcon = L.divIcon({
  html: '<span style="font-size:32px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5));">🛰️</span>',
  className: 'iss-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// Component to recenter the map when position changes
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
    <div className="w-full rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
      <MapContainer
        center={[position.lat, position.lon]}
        zoom={3}
        scrollWheelZoom={true}
        style={{ height: '400px', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterMap lat={position.lat} lon={position.lon} />

        <Marker position={[position.lat, position.lon]} icon={issIcon}>
          <Tooltip direction="top" offset={[0, -20]} permanent={false}>
            <div className="text-sm">
              <p><strong>Lat:</strong> {position.lat.toFixed(4)}</p>
              <p><strong>Lon:</strong> {position.lon.toFixed(4)}</p>
              <p><strong>Speed:</strong> {speed.toFixed(0)} km/h</p>
              <p><strong>Near:</strong> {location}</p>
            </div>
          </Tooltip>
        </Marker>

        {polylinePositions.length > 1 && (
          <Polyline
            positions={polylinePositions}
            pathOptions={{ color: '#6366f1', weight: 3, opacity: 0.8, dashArray: '8 4' }}
          />
        )}
      </MapContainer>
    </div>
  );
}
