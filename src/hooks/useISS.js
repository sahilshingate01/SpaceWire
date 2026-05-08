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
  const [autoRefresh, setAutoRefresh] = useState(true);
  const intervalRef = useRef(null);

  const fetchLocation = useCallback(async (lat, lon) => {
    try {
      const { data } = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
        { 
          headers: { 
            'Accept-Language': 'en',
            'User-Agent': 'SpaceWire-App-v1.0'
          } 
        }
      );
      if (data && data.address) {
        const city = data.address.city || data.address.town || data.address.village;
        const country = data.address.country;
        setLocation(city ? `${city}, ${country}` : country || 'Over the ocean');
      } else {
        setLocation('Over the ocean');
      }
    } catch {
      setLocation('Location unavailable');
    }
  }, []);

  const fetchPeople = useCallback(async () => {
    try {
      const { data } = await axios.get('https://corsproxy.io/?' + encodeURIComponent('http://api.open-notify.org/astros.json'));
      if (data.message === 'success') {
        setPeople(data.people);
      }
    } catch {
      if (people.length === 0) {
         setPeople([{ name: 'Oleg Kononenko', craft: 'ISS' }, { name: 'Nikolai Chub', craft: 'ISS' }, { name: 'Tracy Caldwell Dyson', craft: 'ISS' }]);
      }
    }
  }, [people.length]);

  const fetchPosition = useCallback(async () => {
    try {
      setError(null);
      const { data } = await axios.get('https://api.wheretheiss.at/v1/satellites/25544');
      
      const lat = parseFloat(data.latitude);
      const lon = parseFloat(data.longitude);
      const newPos = { lat, lon, timestamp: data.timestamp };

      setPosition(newPos);
      setSpeed(data.velocity);
      
      setSpeedHistory((hist) =>
        [...hist, { time: new Date().toLocaleTimeString(), speed: data.velocity }].slice(-30)
      );

      setPositions((prev) => {
        const updated = [...prev, newPos].slice(-15);
        return updated;
      });

      fetchLocation(lat, lon);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch ISS position');
      setLoading(false);
    }
  }, [fetchLocation]);

  const refresh = useCallback(() => {
    setLoading(true);
    fetchPosition();
    fetchPeople();
  }, [fetchPosition, fetchPeople]);

  useEffect(() => {
    refresh();
    if (autoRefresh) {
      intervalRef.current = setInterval(fetchPosition, 10000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoRefresh, fetchPosition, refresh]);

  return { 
    position, 
    positions, 
    speed, 
    speedHistory, 
    location, 
    people, 
    loading, 
    error, 
    refresh,
    autoRefresh,
    toggleAutoRefresh: () => setAutoRefresh(prev => !prev)
  };
}
