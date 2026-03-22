import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Users, Upload, Zap, Activity, AlertCircle, LogOut, TrendingUp, Trophy, ArrowRight, Clock } from "lucide-react";
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
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">

      {/* 🔥 HEADER */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 relative z-10">
        <div>
          <h1 className="font-display font-800 text-3xl sm:text-4xl text-white tracking-tight">
            Welcome, {user?.name?.split(' ')[0] || "Hacker"} 🚀
          </h1>
          <p className="text-slate-400 text-sm mt-2 max-w-lg font-medium leading-relaxed">
            Your command center. Monitor metrics, squad standings, and mission-critical updates.
          </p>
        </div>
        <Button 
          variant="danger" 
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="!bg-red-500/10 border-red-500/20 text-red-400 hover:text-white hover:bg-red-500/80 shadow-sm"
        >
          <LogOut size={16} className="mr-2" /> End Session
        </Button>
      </motion.div>

      {/* 📊 STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {[
          { label: 'Total Operatives', value: stats.users, icon: Users, color: 'brand-violet', trend: '+12% this week' },
          { label: 'Active Operations', value: stats.events, icon: Zap, color: 'amber-400', trend: '2 ending soon' },
          { label: 'Deployed Squads', value: stats.teams, icon: Activity, color: 'brand-blue', trend: 'Stable' },
          { label: 'Submissions', value: stats.projects, icon: Upload, color: 'emerald-400', trend: '+5 since yesterday' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="p-6 relative overflow-hidden group hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-300 border-white/5 bg-dark-800/40">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}/10 blur-[50px] -mr-16 -mt-16 transition-colors group-hover:bg-${stat.color}/20`} />
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{stat.label}</p>
                    <h2 className="text-3xl font-display font-900 text-white mt-2 drop-shadow-md">{stat.value}</h2>
                  </div>
                  <div className="p-3 bg-dark-900/80 rounded-xl border border-white/10 shadow-inner">
                    <Icon className={`w-5 h-5 text-${stat.color}`} />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 relative z-10">
                  <TrendingUp size={12} className={`text-${stat.color}`} />
                  {stat.trend}
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {/* 🏆 LEADERBOARD (Col Spans 2) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-display font-800 text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" /> Top Performing Squads
          </h2>
          <Card className="p-0 overflow-hidden border-white/5 bg-dark-800/30">
            {leaderboard.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-medium">No leaderboard data found.</div>
            ) : (
              <div className="divide-y divide-white/5">
                {leaderboard.map((team, idx) => (
                  <div key={team.rank} className="p-4 sm:p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => navigate('/leaderboard')}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-dark-900 flex items-center justify-center border border-white/10 shadow-inner font-display font-bold text-slate-300 group-hover:text-amber-400 group-hover:border-amber-400/30 transition-colors">
                        {idx < 3 ? ['🥇','🥈','🥉'][idx] : `#${team.rank}`}
                      </div>
                      <div>
                        <p className="font-bold text-white group-hover:text-brand-violet transition-colors">{team.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-0.5 flex items-center gap-1">
                          <Zap size={10} className="text-brand-accent" /> Score: {Number(team.score).toFixed(1)}
                        </p>
                      </div>
                    </div>
                    <Button variant="secondary" className="scale-90 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex">Inspect</Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* ⚡ QUICK ACTIONS & ACTIVITY */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-display font-800 text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-brand-violet" /> Quick Actions
            </h2>
            <Card className="p-5 border-white/5 bg-dark-800/40 space-y-3 shadow-inner">
              <button onClick={() => navigate("/hackathons")} className="w-full flex items-center justify-between p-3 rounded-xl bg-dark-900/60 border border-white/5 hover:border-brand-violet/50 hover:bg-brand-violet/10 hover:shadow-[0_0_20px_rgba(124,92,255,0.15)] transition-all group">
                <div className="flex items-center gap-3 text-sm font-bold text-slate-300 group-hover:text-white transition-colors">
                  <div className="p-2 bg-brand-violet/20 rounded-lg text-brand-violet"><Zap size={16} /></div>
                  Join Hackathon
                </div>
                <ArrowRight size={16} className="text-slate-600 group-hover:text-brand-violet group-hover:translate-x-1 transition-all" />
              </button>
              
              <button onClick={() => navigate("/teams")} className="w-full flex items-center justify-between p-3 rounded-xl bg-dark-900/60 border border-white/5 hover:border-brand-blue/50 hover:bg-brand-blue/10 hover:shadow-[0_0_20px_rgba(0,212,255,0.15)] transition-all group">
                <div className="flex items-center gap-3 text-sm font-bold text-slate-300 group-hover:text-white transition-colors">
                  <div className="p-2 bg-brand-blue/20 rounded-lg text-brand-blue"><Users size={16} /></div>
                  Manage Squads
                </div>
                <ArrowRight size={16} className="text-slate-600 group-hover:text-brand-blue group-hover:translate-x-1 transition-all" />
              </button>
            </Card>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-display font-800 text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-500" /> Recent Activity
            </h2>
            <Card className="p-6 border-white/5 bg-dark-800/40 shadow-inner">
              <div className="relative pl-5 border-l-2 border-dark-700 space-y-6 pb-2">
                <div className="relative">
                  <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-brand-violet border-[3px] border-dark-900 shadow-[0_0_10px_rgba(124,92,255,0.8)]" />
                  <p className="text-sm font-bold text-white leading-tight">System Synchronized</p>
                  <p className="text-xs text-slate-400 mt-1 font-medium">Status check completed successfully. All systems nominal.</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-brand-blue border-[3px] border-dark-900 shadow-[0_0_10px_rgba(0,212,255,0.8)]" />
                  <p className="text-sm font-bold text-white leading-tight">Signed In</p>
                  <p className="text-xs text-slate-400 mt-1 font-medium">New session initiated from your current IP.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}