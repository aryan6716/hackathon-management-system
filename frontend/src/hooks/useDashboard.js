import { useState, useEffect } from 'react';
import { apiGet } from '../utils/api';

export function useDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    events: 0,
    teams: 0,
    projects: 0,
  });

  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const safeFetch = async (url) => {
    try {
      return await apiGet(url);
    } catch (err) {
      return null;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [statsData, leaderboardData] = await Promise.all([
          safeFetch("/stats"),
          safeFetch("/leaderboard"),
        ]);
        
        setStats({
          users: statsData?.stats?.totalUsers || statsData?.totalUsers || 0,
          events: statsData?.stats?.activeEvents || statsData?.activeEvents || 0,
          teams: statsData?.stats?.totalTeams || statsData?.totalTeams || 0,
          projects: statsData?.stats?.totalProjects || statsData?.totalProjects || 0,
        });

        const safeLeaderboard = Array.isArray(leaderboardData) ? leaderboardData : (Array.isArray(leaderboardData?.leaderboard) ? leaderboardData.leaderboard : []);
        setLeaderboard(
          safeLeaderboard.slice(0, 5).map((l, i) => ({
            rank: i + 1,
            name: l.team_name || "Unknown",
            score: l.final_score || l.score || l.avg_score || 0,
          }))
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { stats, leaderboard, loading, error };
}
