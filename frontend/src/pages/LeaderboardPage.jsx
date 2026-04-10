import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Zap, TrendingUp } from 'lucide-react'
import { Card, Badge, Avatar, Skeleton, SectionHeader, EmptyState, Button } from '../components/ui'
import { apiGet } from '../utils/api'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'

const podiumConfig = {
  1: { color: 'from-amber-400/20 to-amber-600/5', border: 'border-amber-400/30', ring: 'ring-amber-400/40', label: 'text-amber-300', score: 'text-amber-400', icon: '🥇', size: 'lg', height: 'pt-8 pb-4', delay: 0.1 },
  2: { color: 'from-slate-400/10 to-slate-600/5', border: 'border-slate-400/20', ring: 'ring-slate-400/30', label: 'text-slate-300', score: 'text-slate-400', icon: '🥈', size: 'md', height: 'pt-5 pb-4', delay: 0.2 },
  3: { color: 'from-orange-400/15 to-orange-600/5', border: 'border-orange-400/25', ring: 'ring-orange-400/35', label: 'text-orange-300', score: 'text-orange-400', icon: '🥉', size: 'md', height: 'pt-5 pb-4', delay: 0.3 },
}

function PodiumCard({ entry, position }) {
  const cfg = podiumConfig[position]
  const order = position === 1 ? 'order-2 z-10' : position === 2 ? 'order-1' : 'order-3'

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: cfg.delay, type: 'spring', stiffness: 200, damping: 20 }}
      className={clsx('flex-1 flex flex-col items-center relative', order)}
    >
      <motion.div 
        animate={{ y: [0, -3, 0] }} 
        transition={{ duration: 0.8, ease: "easeOut", delay: position * 0.1 }}
        className="text-4xl sm:text-5xl mb-3 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
      >
        {cfg.icon}
      </motion.div>
      <Avatar name={entry.team} size={cfg.size} className={clsx('mb-3 ring-4 shadow-[0_0_30px_rgba(0,0,0,0.5)] z-20', cfg.ring)} />
      
      <motion.div 
        layoutId={`podium-base-${position}`}
        className={clsx(
          'w-full rounded-t-3xl border border-b-0 bg-gradient-to-b text-center px-4 shadow-[inset_0_2px_20px_rgba(255,255,255,0.05)] transition-all group hover:bg-white/5 relative overflow-hidden',
          cfg.color, cfg.border, cfg.height,
          position === 1 ? 'sm:scale-110 sm:-translate-y-2' : ''
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 to-transparent opacity-80 pointer-events-none" />
        <div className="relative z-10">
          <p className={clsx('text-base sm:text-lg font-display font-900 truncate tracking-tight', cfg.label)}>{entry.team}</p>
          <div className={clsx('text-sm sm:text-base mt-1 font-black flex items-center justify-center gap-1.5', cfg.score)}>
              <TrendingUp className="w-4 h-4" />
              {Number(entry.score || 0).toFixed(1)}
          </div>
          <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest">{entry.members} REVIEWS</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

const LeaderboardSkeleton = () => (
  <div className="px-6 lg:px-10 py-6 space-y-8 pb-12">
    <div className="flex justify-between items-end">
        <div className="space-y-3">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-48" />
        </div>
    </div>
    <Card className="p-8 h-[350px] flex items-end justify-center gap-6">
        <Skeleton className="h-[180px] w-32 rounded-t-2xl" />
        <Skeleton className="h-[250px] w-40 rounded-t-2xl" />
        <Skeleton className="h-[150px] w-32 rounded-t-2xl" />
    </Card>
    <Card className="overflow-hidden">
        {[1,2,3,4,5].map(i => (
            <div key={i} className="flex items-center gap-4 px-6 py-5 border-b border-white/5">
                <Skeleton className="h-6 w-8" />
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-6 w-56 flex-1" />
                <Skeleton className="h-6 w-24 hidden sm:block" />
            </div>
        ))}
    </Card>
  </div>
)

const tableContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.4 }
  }
}

const tableRow = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

export default function LeaderboardPage() {
  const navigate = useNavigate()
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setError('')
        const data = await apiGet('/leaderboard')
        setLeaderboard(Array.isArray(data) ? data : (Array.isArray(data?.leaderboard) ? data.leaderboard : []))
      } catch (err) {
        setError(err.message || 'Could not load leaderboard.')
      } finally {
        setLoading(false)
      }
    }
    fetchLeaderboard()
  }, [])

  const top3 = [
    leaderboard[1], // 2nd
    leaderboard[0], // 1st
    leaderboard[2], // 3rd
  ].filter(Boolean)

  if (loading) return <LeaderboardSkeleton />

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="px-6 lg:px-10 py-6 space-y-8 pb-12"
    >
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="font-display font-800 text-3xl sm:text-4xl flex items-center gap-3 tracking-tight bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]" />
            Leaderboard
          </h1>
          <p className="text-gray-400 text-sm mt-2 max-w-lg font-medium leading-relaxed">
            Live ranking of teams based on current scoring data.
          </p>
        </motion.div>
        <div className="flex items-center gap-2.5 px-4 py-2 bg-dark-800/80 rounded-xl border border-glass-border shadow-glass backdrop-blur-md self-start sm:self-auto">
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-none">Live Data Feed</span>
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
        <Card className="p-8 sm:p-12 overflow-hidden relative border border-white/10 bg-[#0B0F1A]/50 glass-card backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-radial-purple pointer-events-none opacity-50 mix-blend-screen" />
          <SectionHeader title="The Elite Three" subtitle="Top performing squads globally" center className="relative z-10" />
          <div className="flex items-end justify-center gap-4 sm:gap-6 max-w-3xl mx-auto pt-10 relative z-10">
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
      <motion.div variants={tableContainer} initial="hidden" animate="show">
        <Card className="overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] glass-card border border-white/10 backdrop-blur-xl">
            
            <div className="flex items-center gap-4 px-6 py-4 border-b border-glass-border bg-white/[0.02]">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest w-12 text-center">Rank</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex-1">Squad Name</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden sm:block w-32 text-center">Avg Score</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest w-24 text-center hidden sm:block">Standing</span>
            </div>

            <div className="divide-y divide-glass-border bg-dark-900/40">
            {leaderboard.map((entry, idx) => {
                const rank = idx + 1
                const rankColor = idx < 3 ? 'font-black drop-shadow-md' : 'font-bold text-gray-400'

                return (
                <motion.div variants={tableRow} key={entry.team_id || idx} className="flex items-center gap-4 px-6 py-5 transition-all duration-200 hover:bg-white/[0.04] group">
                    {/* Rank */}
                    <div className="w-12 text-center flex-shrink-0">
                    {idx < 3
                        ? <span className="text-[22px] drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{['🥇', '🥈', '🥉'][idx]}</span>
                        : <span className={clsx('font-display text-base', rankColor)}>#{rank}</span>
                    }
                    </div>

                    {/* Team */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <Avatar name={entry.team_name} size="md" className="ring-2 ring-white/5 group-hover:ring-brand-violet/30 transition-all shadow-md" />
                      <div className="min-w-0">
                          <p className="text-sm sm:text-base font-bold text-white truncate group-hover:text-brand-violet transition-colors">{entry.team_name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">{entry.judge_count} Appraisals</p>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="hidden sm:block w-32 text-center flex-shrink-0">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-800/80 border border-glass-border shadow-inner">
                            <Zap className="w-3.5 h-3.5 text-brand-accent drop-shadow-glow" />
                            <span className="font-display font-900 text-base text-white tracking-tighter">
                                {Number(entry.avg_score || entry.final_score || 0).toFixed(1)}
                            </span>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="hidden sm:block w-24 text-center flex-shrink-0">
                      <Badge variant={idx < 10 ? 'active' : 'default'} className="!px-3 !py-1 scale-95">
                          {idx < 10 ? 'Legendary' : 'Pro'}
                      </Badge>
                    </div>
                </motion.div>
                )
            })}

            {leaderboard.length === 0 && !loading && (
                <motion.div variants={tableRow} className="px-6 py-16 text-center">
                    <EmptyState 
                        icon={Trophy}
                        title="No Rankings Yet"
                        description="No scored submissions are available yet. Submit a project to appear on the leaderboard."
                        action={() => navigate('/submissions')}
                        actionLabel="Go to Submissions"
                    />
                </motion.div>
            )}
            </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}
