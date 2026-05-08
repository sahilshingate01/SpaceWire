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

  const fetchPosition = useCallback(async () => {
    try {
      setError(null);
      // Using wheretheiss.at which supports HTTPS and has CORS enabled
      const { data } = await axios.get('https://api.wheretheiss.at/v1/satellites/25544');
      
      const lat = parseFloat(data.latitude);
      const lon = parseFloat(data.longitude);
      const newPos = { lat, lon, timestamp: data.timestamp };

      setPosition(newPos);

      setPositions((prev) => {
        const updated = [...prev, newPos].slice(-15);

        // wheretheiss.at provides speed directly in km/h
        const calculatedSpeed = data.velocity;
        setSpeed(calculatedSpeed);
        setSpeedHistory((hist) =>
          [...hist, { time: new Date().toLocaleTimeString(), speed: calculatedSpeed }].slice(-30)
        );

        return updated;
      });

      fetchLocation(lat, lon);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch ISS position');
      setLoading(false);
    }
  }, [fetchLocation]);

  const fetchPeople = useCallback(async () => {
    try {
      // open-notify astros does not support HTTPS, so we use a proxy.
      const targetUrl = 'http://api.open-notify.org/astros.json';
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}&timestamp=${Date.now()}`;
      
      const { data } = await axios.get(proxyUrl);
      
      if (data && data.contents) {
        const parsedData = JSON.parse(data.contents);
        if (parsedData.message === 'success') {
          setPeople(parsedData.people);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch people in space:', err);
    }
  }, []);

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
