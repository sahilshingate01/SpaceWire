import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function useISS() {
  const [position, setPosition] = useState(null);
  const [positions, setPositions] = useState([]);
  const [speed, setSpeed] = useState(0);
  const [speedHistory, setSpeedHistory] = useState([]);
  const [location, setLocation] = useState('Fetching location...');
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const fetchLocation = useCallback(async (lat, lon) => {
    try {
      const { data } = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (data && data.display_name) {
        setLocation(data.display_name);
      } else {
        setLocation('Over the ocean');
      }
    } catch {
      setLocation('Location unavailable');
    }
  }, []);

  const fetchPeople = useCallback(async () => {
    try {
      const { data } = await axios.get('http://api.open-notify.org/astros.json');
      if (data.message === 'success') {
        setPeople(data.people);
      }
    } catch {
      // silently fail for people fetch — non-critical
    }
  }, []);

  const fetchPosition = useCallback(async () => {
    try {
      setError(null);
      const { data } = await axios.get('http://api.open-notify.org/iss-now.json');
      if (data.message === 'success') {
        const lat = parseFloat(data.iss_position.latitude);
        const lon = parseFloat(data.iss_position.longitude);
        const newPos = { lat, lon, timestamp: data.timestamp };

        setPosition(newPos);

        setPositions((prev) => {
          const updated = [...prev, newPos].slice(-15);

          // Calculate speed from last two positions
          if (updated.length >= 2) {
            const last = updated[updated.length - 2];
            const curr = updated[updated.length - 1];
            const dist = haversine(last.lat, last.lon, curr.lat, curr.lon);
            const calculatedSpeed = (dist / 15) * 3600;
            setSpeed(calculatedSpeed);
            setSpeedHistory((hist) =>
              [...hist, { time: new Date().toLocaleTimeString(), speed: calculatedSpeed }].slice(-30)
            );
          }

          return updated;
        });

        fetchLocation(lat, lon);
        setLoading(false);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch ISS position');
      setLoading(false);
    }
  }, [fetchLocation]);

  const startTracking = useCallback(() => {
    fetchPosition();
    fetchPeople();
    intervalRef.current = setInterval(fetchPosition, 15000);
  }, [fetchPosition, fetchPeople]);

  const refresh = useCallback(() => {
    setLoading(true);
    setPositions([]);
    setSpeed(0);
    setSpeedHistory([]);
    clearInterval(intervalRef.current);
    startTracking();
  }, [startTracking]);

  useEffect(() => {
    startTracking();
    return () => clearInterval(intervalRef.current);
  }, [startTracking]);

  return { position, positions, speed, speedHistory, location, people, loading, error, refresh };
}
