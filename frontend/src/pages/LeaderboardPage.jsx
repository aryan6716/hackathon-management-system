import React, { useState, useEffect } from 'react'
import { Trophy, Zap, TrendingUp } from 'lucide-react'
import { Card, Badge, Avatar, Skeleton, SectionHeader, EmptyState, Button } from '../components/ui'
import { apiGet } from '../utils/api'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { useLeaderboard } from '../hooks/useLeaderboard'
import { LeaderboardSkeleton } from '../components/leaderboard/LeaderboardSkeleton'
import { LeaderboardRow } from '../components/leaderboard/LeaderboardRow'

const podiumConfig = {
  1: { color: 'from-amber-400/20 to-amber-600/5', border: 'border-amber-400/30', ring: 'ring-amber-400/40', label: 'text-amber-300', score: 'text-amber-400', icon: '🥇', size: 'lg', height: 'pt-8 pb-4', delay: 0.1 },
  2: { color: 'from-slate-400/10 to-slate-600/5', border: 'border-slate-400/20', ring: 'ring-slate-400/30', label: 'text-slate-300', score: 'text-slate-400', icon: '🥈', size: 'md', height: 'pt-5 pb-4', delay: 0.2 },
  3: { color: 'from-orange-400/15 to-orange-600/5', border: 'border-orange-400/25', ring: 'ring-orange-400/35', label: 'text-orange-300', score: 'text-orange-400', icon: '🥉', size: 'md', height: 'pt-5 pb-4', delay: 0.3 },
}

function PodiumCard({ entry, position }) {
  const cfg = podiumConfig[position]
  const order = position === 1 ? 'order-2 z-10' : position === 2 ? 'order-1' : 'order-3'

  return (
    <div className={clsx('flex-1 flex flex-col items-center relative', order)}>
      <div className="text-4xl sm:text-5xl mb-3">
        {cfg.icon}
      </div>
      <Avatar name={entry.team} size={cfg.size} className={clsx('mb-3 ring-4 z-20', cfg.ring)} />
      
      <div 
        className={clsx(
          'w-full rounded-t-lg border border-b-0 bg-gray-900 text-center px-4 py-6',
          cfg.border, cfg.height,
          position === 1 ? 'sm:scale-105 sm:-translate-y-2' : ''
        )}
      >
        <div className="relative z-10">
          <p className={clsx('text-base sm:text-lg font-bold truncate tracking-tight', cfg.label)}>{entry.team}</p>
          <div className={clsx('text-sm sm:text-base mt-1 font-bold flex items-center justify-center gap-1.5', cfg.score)}>
              <TrendingUp className="w-4 h-4" />
              {Number(entry.score || 0).toFixed(1)}
          </div>
          <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest">{entry.members} REVIEWS</p>
        </div>
      </div>
    </div>
  )
}

export default function LeaderboardPage() {
  const navigate = useNavigate()
  const { leaderboard, loading, error } = useLeaderboard()

  const top3 = [
    leaderboard[1], // 2nd
    leaderboard[0], // 1st
    leaderboard[2], // 3rd
  ].filter(Boolean)

  if (loading) return <LeaderboardSkeleton />

  return (
    <div className="px-4 lg:px-8 py-6 space-y-6 pb-12">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2 tracking-tight text-gray-100">
            <Trophy className="w-6 h-6 text-amber-400" />
            Leaderboard
          </h1>
          <p className="text-gray-400 text-sm mt-1 max-w-lg">
            Live ranking of teams based on current scoring data.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-lg">
          <span className="text-[10px] font-semibold text-gray-300 uppercase tracking-wider">Live Data</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm font-medium">{error}</p>
            <Button variant="secondary" onClick={() => window.location.reload()} className="w-full sm:w-auto hover:bg-red-500/20 border-red-500/30 text-red-400">Retry</Button>
          </div>
        </div>
      )}

      {/* ── PODIUM ── */}
      {top3.length > 0 && (
        <Card className="p-6 sm:p-10 border border-gray-800 bg-gray-900">
          <SectionHeader title="Top Three Teams" subtitle="Top performing squads globally" center />
          <div className="flex items-end justify-center gap-4 sm:gap-6 max-w-3xl mx-auto pt-8">
            {top3.map((entry, i) => {
              const position = i === 0 ? 2 : i === 1 ? 1 : 3
              return (
                <PodiumCard 
                    key={entry.team_id || i} 
                    entry={{ 
                        team: entry.team_name, 
                        score: Number(entry.avg_score || entry.final_score || 0), 
                        members: entry.judge_count 
                    }} 
                    position={position} 
                />
              )
            })}
          </div>
        </Card>
      )}

      {/* ── RANKINGS TABLE ── */}
      <div>
        <Card className="overflow-hidden border border-gray-800 bg-gray-900 p-0">
            
            <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-800 bg-gray-800/50">
              <span className="text-xs font-semibold text-gray-400 w-12 text-center">Rank</span>
              <span className="text-xs font-semibold text-gray-400 flex-1">Team Name</span>
              <span className="text-xs font-semibold text-gray-400 hidden sm:block w-32 text-center">Avg Score</span>
              <span className="text-xs font-semibold text-gray-400 w-24 text-center hidden sm:block">Standing</span>
            </div>

            <div className="divide-y divide-gray-800">
            {leaderboard.map((entry, idx) => (
                <LeaderboardRow key={entry.team_id || idx} entry={entry} idx={idx} />
            ))}

            {leaderboard.length === 0 && !loading && (
                <div className="px-6 py-12 text-center">
                    <EmptyState 
                        icon={Trophy}
                        title="No Rankings Yet"
                        description="No scored submissions are available yet."
                        action={() => navigate('/submissions')}
                        actionLabel="View Submissions"
                    />
                </div>
            )}
            </div>
        </Card>
      </div>
    </div>
  )
}
