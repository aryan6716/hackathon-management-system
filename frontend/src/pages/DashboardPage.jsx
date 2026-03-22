import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Users, Upload, Zap, Activity, AlertCircle, LogOut } from "lucide-react";
import { Card, Button } from "../components/ui";
import { apiGet } from "../utils/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [stats, setStats] = useState({
    users: 0,
    events: 0,
    teams: 0,
    projects: 0,
  });

  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Safe API call
  const safeFetch = async (url) => {
    try {
      return await apiGet(url);
    } catch (err) {
      console.error("API Error:", url, err.message);
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
        
        console.log("📊 API Response [Stats]:", statsData);
        console.log("🏆 API Response [Leaderboard]:", leaderboardData);

        setStats({
          users: statsData?.totalUsers || 0,
          events: statsData?.activeEvents || 0,
          teams: statsData?.totalTeams || 0,
          projects: statsData?.totalProjects || 0,
        });

        const safeLeaderboard = Array.isArray(leaderboardData) ? leaderboardData : [];
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

  // ⏳ LOADING UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading dashboard...
      </div>
    );
  }

  // ❌ ERROR UI
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-400 gap-4">
        <AlertCircle size={40} />
        <p>{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 text-white p-6 space-y-8">

      {/* 🔥 HEADER */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome, {user?.name || "Hacker"} 🚀
          </h1>
          <p className="text-gray-400 mt-2">
            Your hackathon dashboard overview
          </p>
        </div>
        <Button 
          variant="secondary" 
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="flex items-center gap-2 border-red-500/20 text-red-400 hover:bg-red-500/10"
        >
          <LogOut size={16} /> Logout
        </Button>
      </motion.div>

      {/* 📊 STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <Users /> Users
          <h2 className="text-xl font-bold">{stats.users}</h2>
        </Card>

        <Card className="p-4">
          <Zap /> Events
          <h2 className="text-xl font-bold">{stats.events}</h2>
        </Card>

        <Card className="p-4">
          <Activity /> Teams
          <h2 className="text-xl font-bold">{stats.teams}</h2>
        </Card>

        <Card className="p-4">
          <Upload /> Projects
          <h2 className="text-xl font-bold">{stats.projects}</h2>
        </Card>
      </div>

      {/* 🏆 LEADERBOARD */}
      <div>
        <h2 className="text-xl font-bold mb-4">Top Teams</h2>

        {leaderboard.length === 0 ? (
          <p className="text-gray-400">No leaderboard data</p>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((team) => (
              <Card key={team.rank} className="p-4 flex justify-between">
                <span>#{team.rank} {team.name}</span>
                <span>{team.score}</span>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ⚡ ACTIONS */}
      <div className="flex gap-4">
        <Button onClick={() => navigate("/hackathons")}>
          Join Hackathon
        </Button>

        <Button variant="secondary" onClick={() => navigate("/teams")}>
          Create Team
        </Button>
      </div>

    </div>
  );
}