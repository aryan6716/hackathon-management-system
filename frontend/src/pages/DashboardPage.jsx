import { Upload } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  Users, Zap, Activity, Trophy, ArrowRight, 
  Clock, Sparkles, Target, Rocket
} from "lucide-react";
import { Card, Button, StatCard, Badge, SectionHeader } from "../components/ui";
import { apiGet } from "../utils/api";
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
    <div className="px-6 lg:px-10 py-6 space-y-10 pb-20">
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm font-medium">Could not load dashboard data. {error}</p>
            <Button variant="danger" onClick={() => window.location.reload()} className="w-full sm:w-auto text-sm py-1.5 px-3">Retry</Button>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="active" className="px-3 py-1">System Online</Badge>
              <div className="h-1 w-1 rounded-full bg-slate-700" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">v2.4.0-premium</span>
            </div>
            <h1 className="text-3xl font-semibold text-white tracking-tight flex items-center gap-x-3">
              <span>Team Dashboard</span>
            </h1>
            <p className="text-gray-400 text-sm mt-2 max-w-2xl leading-relaxed">
              Welcome back, <span className="text-white font-medium">{user?.name?.split(' ')[0]}</span>.
              Here is a quick overview of your current hackathon activity.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => navigate('/hackathons')}>
              <Rocket size={16} className="mr-2" />
              <span>Explore Hackathons</span>
            </Button>
          </div>
        </div>
      </div>

      {/* STATS GRID */}
      <div>
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEADERBOARD SECTION */}
        <div className="lg:col-span-2 space-y-6">
          <SectionHeader 
            title="Top Team Standings" 
            subtitle="Leading teams from recent scoring activity"
            className="mb-0"
          />
          <Card className="p-0">
            {leaderboard.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-gray-500">
                <Trophy size={40} className="mb-4 opacity-50" />
                <p className="text-sm font-medium">No active standings found</p>
                <Button variant="secondary" size="sm" className="mt-4" onClick={() => navigate('/submissions')}>
                  Submit a Project
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {leaderboard.map((team, idx) => (
                  <div 
                    key={team.rank} 
                    className="p-4 hover:bg-gray-800 flex items-center justify-between transition-colors cursor-pointer"
                    onClick={() => navigate('/leaderboard')}
                  >
                    <div className="flex items-center gap-4">
                      <div className={clsx(
                        "w-10 h-10 rounded-md flex items-center justify-center font-semibold text-sm border",
                        idx === 0 ? "bg-amber-900/50 border-amber-700 text-amber-500" :
                        idx === 1 ? "bg-gray-700 border-gray-600 text-gray-300" :
                        idx === 2 ? "bg-orange-900/50 border-orange-800 text-orange-500" :
                        "bg-gray-800 border-gray-700 text-gray-400"
                      )}>
                        {idx < 3 ? ['🥇','🥈','🥉'][idx] : `#${team.rank}`}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-200">
                          {team.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">Active Team</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-lg font-semibold text-gray-200">{Number(team.score).toFixed(1)}</p>
                        <p className="text-[11px] text-gray-500">Avg Score</p>
                      </div>
                      <ArrowRight size={16} className="text-gray-500" />
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="p-3 border-t border-gray-800 bg-gray-800/50">
              <Button variant="ghost" className="w-full text-sm text-indigo-400" onClick={() => navigate('/leaderboard')}>
                View Full Leaderboard
              </Button>
            </div>
          </Card>
        </div>

        {/* SIDE ACTIONS & RECENT ACTIVITY */}
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2 px-1">
              <Zap className="w-4 h-4 text-indigo-500" /> Actions
            </h3>
            <div className="space-y-2">
              <button onClick={() => navigate('/hackathons')} className="w-full flex items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded bg-indigo-900/30 flex items-center justify-center text-indigo-400">
                    <Rocket size={16} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-200">Join Mission</p>
                    <p className="text-[11px] text-gray-500">Browse events</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-gray-600" />
              </button>

              <button onClick={() => navigate('/teams')} className="w-full flex items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded bg-emerald-900/30 flex items-center justify-center text-emerald-400">
                    <Users size={16} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-200">Manage Squad</p>
                    <p className="text-[11px] text-gray-500">Invite members</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-gray-600" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2 px-1">
              <Clock className="w-4 h-4" /> Recent Activity
            </h3>
            <Card className="p-5">
              <div className="space-y-6 relative border-l border-gray-800 ml-3">
                {[
                  { title: "Dashboard updated", desc: "Latest stats are ready.", time: "Now", icon: Zap, color: "text-indigo-400", dot: "bg-indigo-500" },
                  { title: "Team reminder", desc: "Make sure everyone has joined.", time: "Today", icon: Users, color: "text-emerald-400", dot: "bg-emerald-500" },
                  { title: "Submission tip", desc: "Add your project early.", time: "Today", icon: Target, color: "text-rose-400", dot: "bg-red-500" },
                ].map((item, i) => (
                  <div key={i} className="relative pl-6">
                    <div className={`absolute left-[-5px] top-1.5 w-2 h-2 rounded-full ${item.dot}`} />
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-200">{item.title}</p>
                        <span className="text-[11px] text-gray-500">{item.time}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
