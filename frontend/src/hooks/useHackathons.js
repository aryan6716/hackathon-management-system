import { useState, useEffect } from 'react';
import { apiGet } from '../utils/api';

export function useHackathons() {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchHackathons = async () => {
      try {
        setLoading(true);
        const data = await apiGet('/events');
        if (!isMounted) return;

        const events = Array.isArray(data) ? data : (Array.isArray(data?.events) ? data.events : []);
        setHackathons(events);
      } catch (err) {
        if (isMounted) setError('Failed to load hackathons. Please check your connection.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHackathons();
    return () => { isMounted = false; };
  }, []);

  return { hackathons, loading, error };
}

export function useHackathonDetail(eventId) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadEvent = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await apiGet(`/events/${eventId}`);
        if (!mounted) return;
        setEvent(data?.event || null);
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load hackathon details.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (eventId) {
      loadEvent();
    } else {
      setLoading(false);
    }
    
    return () => { mounted = false; };
  }, [eventId]);

  return { event, loading, error };
}
