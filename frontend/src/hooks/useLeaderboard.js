import { useState, useEffect } from 'react';
import { apiGet } from '../utils/api';

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiGet('/leaderboard');
      setLeaderboard(Array.isArray(data) ? data : (Array.isArray(data?.leaderboard) ? data.leaderboard : []));
    } catch (err) {
      setError(err.message || 'Could not load leaderboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return { leaderboard, loading, error, refetch: fetchLeaderboard };
}
