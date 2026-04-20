import { Upload } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { 
  Users, Zap, Activity, Trophy, ArrowRight, 
  Clock, Sparkles, Target, Rocket
} from "lucide-react";
import { Card, Button, StatCard, Badge, SectionHeader } from "../components/ui";
import { apiGet } from "../utils/api";
import { StaggerContainer, StaggerItem } from "../components/ui/Animations";
import clsx from 'clsx';

import { useDashboard } from "../hooks/useDashboard";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { stats, leaderboard, loading, error } = useDashboard();

  if (loading) {
    return (
      <div className="px-6 lg:px-10 py-6 space-y-10 pb-20 animate-pulse">
        {/* HEADER SKELETON */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="h-6 w-24 bg-white/10 rounded-full" />
            <div className="h-10 w-64 bg-white/10 rounded-lg" />
            <div className="h-12 w-full max-w-sm bg-white/5 rounded-lg" />
          </div>
          <div className="h-12 w-48 bg-white/10 rounded-2xl" />
        </div>

        {/* STATS SKELETON */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-white/5 border border-white/5 rounded-2xl" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEADERBOARD SKELETON */}
          <div className="lg:col-span-2 space-y-6">
            <div className="h-6 w-48 bg-white/10 rounded" />
            <div className="h-96 bg-white/5 border border-white/5 rounded-[24px]" />
          </div>
          
          {/* SIDE ACTIVITY SKELETON */}
          <div className="space-y-6">
            <div className="h-6 w-32 bg-white/10 rounded" />
            <div className="h-24 bg-white/5 border border-white/5 rounded-[24px]" />
            <div className="h-24 bg-white/5 border border-white/5 rounded-[24px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <StaggerContainer className="px-6 lg:px-10 py-6 space-y-10 pb-20">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm font-medium">Could not load some dashboard data. {error}</p>
            <Button variant="secondary" onClick={() => window.location.reload()} className="w-full sm:w-auto hover:bg-red-500/20 border-red-500/30">Retry</Button>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <StaggerItem>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="active" className="px-3 py-1">System Online</Badge>
              <div className="h-1 w-1 rounded-full bg-slate-700" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">v2.4.0-premium</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight flex flex-wrap items-center gap-x-4">
              <span>Team</span>
              <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Dashboard</span>
              <Sparkles className="text-indigo-400 w-8 h-8 hidden sm:block" />
            </h1>
            <p className="text-gray-400 text-base mt-3 max-w-2xl font-medium leading-relaxed">
              Welcome back, <span className="text-slate-200 font-bold underline decoration-indigo-500/30 underline-offset-4">{user?.name?.split(' ')[0]}</span>.
              Here is a quick overview of your current hackathon activity.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button size="lg" className="btn-premium-primary shadow-lg shadow-purple-500/30 !rounded-2xl" onClick={() => navigate('/hackathons')}>
              <Rocket size={18} className="mr-2" />
              <span>Explore Hackathons</span>
            </Button>
          </div>
        </div>
      </StaggerItem>

      {/* STATS GRID */}
      <StaggerItem>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            label="Active Hackers" 
            value={stats.users.toLocaleString()} 
            icon={Users} 
            delta={12.5} 
            isPositive={true}
          />
          <StatCard 
            label="Live Operations" 
            value={stats.events.toLocaleString()} 
            icon={Zap} 
            delta="2 Global" 
            isPositive={true}
          />
          <StatCard 
            label="Total Squads" 
            value={stats.teams.toLocaleString()} 
            icon={Target} 
            delta={-3} 
            isPositive={false}
          />
          <StatCard 
            label="Submissions" 
            value={stats.projects.toLocaleString()} 
            icon={Upload} 
            delta="+24 Today" 
            isPositive={true}
          />
        </div>
      </StaggerItem>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEADERBOARD SECTION */}
        <StaggerItem className="lg:col-span-2 space-y-6">
          <SectionHeader 
            title="Top Team Standings" 
            subtitle="Leading teams from recent scoring activity"
            className="mb-0"
          />
          <Card className="overflow-hidden p-2 !rounded-[24px] glass-card border border-white/10 backdrop-blur-xl">
            {leaderboard.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-500">
                <Trophy size={48} className="opacity-10 opacity-20 mb-4" />
                <p className="font-bold uppercase tracking-widest text-xs">No active standings found</p>
                <Button variant="secondary" size="sm" className="mt-6" onClick={() => navigate('/submissions')}>
                  Submit a Project
                </Button>
              </div>
            ) : (
              <div className="space-y-1">
                {leaderboard.map((team, idx) => (
                  <motion.div 
                    key={team.rank} 
                    whileHover={{ x: 4 }}
                    className="p-4 rounded-2xl hover:bg-white/[0.03] flex items-center justify-between group transition-all cursor-pointer"
                    onClick={() => navigate('/leaderboard')}
                  >
                    <div className="flex items-center gap-5">
                      <div className={clsx(
                        "w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-inner border transition-all duration-300",
                        idx === 0 ? "bg-amber-400/10 border-amber-400/30 text-amber-400 scale-110 shadow-amber-400/10" :
                        idx === 1 ? "bg-slate-300/10 border-slate-300/30 text-slate-300" :
                        idx === 2 ? "bg-orange-500/10 border-orange-500/30 text-orange-500" :
                        "bg-white/5 border-white/10 text-slate-500"
                      )}>
                        {idx < 3 ? ['🥇','🥈','🥉'][idx] : `#${team.rank}`}
                      </div>
                      <div>
                        <h3 className="font-bold text-white group-hover:text-indigo-400 transition-colors">
                          {team.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Activity size={12} className="text-emerald-500" />
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Team</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <p className="text-xl font-bold text-white">{Number(team.score).toFixed(1)}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Average Score</p>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all">
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            <div className="p-3 bg-white/[0.01] border-t border-white/5">
              <Button variant="ghost" className="w-full !rounded-xl text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/5" onClick={() => navigate('/leaderboard')}>
                View Full Leaderboard
              </Button>
            </div>
          </Card>
        </StaggerItem>

        {/* SIDE ACTIONS & RECENT ACTIVITY */}
        <StaggerItem className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 px-2">
              <Zap className="w-4 h-4 text-indigo-400" /> Quick Actions
            </h3>
            <div className="space-y-3">
              <button onClick={() => navigate('/hackathons')} className="w-full flex items-center justify-between p-4 glass-card rounded-2xl border border-white/10 backdrop-blur-xl hover:border-indigo-500/30 hover:bg-white/[0.05] transition-all group overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/[0.05] to-indigo-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                    <Rocket size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-white">Join Mission</p>
                    <p className="text-[10px] text-slate-500 font-medium">Browse active and upcoming events</p>
                  </div>
                </div>
                <ArrowRight size={18} className="text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </button>

              <button onClick={() => navigate('/teams')} className="w-full flex items-center justify-between p-4 glass-card rounded-2xl border border-white/10 backdrop-blur-xl hover:border-emerald-500/30 hover:bg-white/[0.05] transition-all group overflow-hidden relative">
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <Users size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-white">Manage Squad</p>
                    <p className="text-[10px] text-slate-500 font-medium">Invite members and manage your team</p>
                  </div>
                </div>
                <ArrowRight size={18} className="text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 px-2">
              <Clock className="w-4 h-4" /> Recent Activity
            </h3>
            <Card className="!rounded-[24px] p-6 relative glass-card border border-white/10 backdrop-blur-xl">
              <div className="space-y-8 relative before:absolute before:inset-0 before:left-[11px] before:w-[2px] before:bg-white/5">
                {[
                  { title: "Dashboard updated", desc: "Latest stats and rankings are ready.", time: "Now", icon: Zap, color: "text-indigo-400", dot: "bg-indigo-400" },
                  { title: "Team reminder", desc: "Make sure everyone has joined your team.", time: "Today", icon: Users, color: "text-emerald-400", dot: "bg-emerald-400" },
                  { title: "Submission tip", desc: "Add your project early to get feedback faster.", time: "Today", icon: Target, color: "text-rose-400", dot: "bg-rose-400" },
                ].map((item, i) => (
                  <div key={i} className="relative pl-8 group">
                    <div className={`absolute left-[-26px] top-1 w-[24px] h-[24px] rounded-full border-4 border-slate-900 ${item.dot} shadow-lg z-10 transition-transform group-hover:scale-125`} />
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{item.title}</p>
                        <span className="text-[10px] font-bold text-slate-600 uppercase">{item.time}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </StaggerItem>
      </div>
    </StaggerContainer>
  );
}
