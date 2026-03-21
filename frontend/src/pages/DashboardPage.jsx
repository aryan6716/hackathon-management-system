import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { 
  Upload, Users, TrendingUp, Zap, Activity, 
  AlertCircle, Clock, Trophy 
} from 'lucide-react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts'
import { Card, StatCard, Button, Badge, SectionHeader, Avatar, Skeleton } from '../components/ui'
import { apiGet } from '../utils/api'
import clsx from 'clsx'

import { mockChartData, mockActivity } from '../utils/mockData'

const activityIcons = {
  upload: Upload,
  'user-plus': Users,
  'trending-up': TrendingUp,
  zap: Zap,
  'message-circle': Activity,
}

// ── Framer Motion Variants ──
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-dark-800/90 backdrop-blur-xl border border-glass-border rounded-xl px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">{payload[0]?.payload?.month}</p>
      <p className="text-base font-display font-800 text-brand-violet">{payload[0]?.value?.toLocaleString()} pts</p>
    </div>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    if (hour < 21) return 'Good Evening'
    return 'Good Night'
  }

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeEvents: 0,
    totalTeams: 0,
    totalProjects: 0,
    userHackathons: 0
  })
  const [deadlines, setDeadlines] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const loadDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)
        const [statsData, eventsData, myTeamData, projectsData, leaderboardData] = await Promise.all([
          apiGet('/stats'),
          apiGet('/events'),
          apiGet('/teams/my'),
          apiGet('/submissions'),
          apiGet('/leaderboard')
        ])
        if (!isMounted) return

        const now = new Date()
        const allEvents = eventsData || []
        const activeEventsList = allEvents.filter(e => new Date(e.end_date) > now)
        const teamObj = myTeamData
        const submissionsCount = projectsData ? projectsData.length : 0

        setStats({
          totalUsers: statsData?.totalUsers || 0,
          activeEvents: statsData?.activeEvents || activeEventsList.length,
          totalTeams: statsData?.totalTeams || 0,
          totalProjects: statsData?.totalProjects || submissionsCount,
          userHackathons: teamObj ? 1 : 0
        })

        const mappedDeadlines = activeEventsList.slice(0, 4).map(e => {
          const daysLeft = Math.ceil((new Date(e.end_date) - now) / (1000 * 60 * 60 * 24))
          return {
            name: e.name,
            deadline: e.end_date,
            daysLeft,
            urgency: daysLeft <= 7 ? 'high' : 'normal'
          }
        }).sort((a,b) => a.daysLeft - b.daysLeft)
        
        setDeadlines(mappedDeadlines)

        if (leaderboardData) {
          setLeaderboard(
            leaderboardData.map((l, i) => ({
              rank: l.rank || (i + 1),
              team: l.team_name,
              score: parseFloat(l.avg_score || l.final_score || 0),
              members: l.judge_count || 1,
              badge: i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : null,
              isYou: teamObj && teamObj.id === l.team_id
            }))
          )
        }
      } catch (err) {
        if (isMounted) setError(err.message)
      } finally {
        if (isMounted) setTimeout(() => setLoading(false), 400)
      }
    }

    loadDashboardData()
    return () => { isMounted = false }
  }, [])

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse-slow">
        <div className="flex justify-between items-center">
          <div className="space-y-3">
            <Skeleton className="h-10 w-72" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-36 w-full" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-[450px] w-full" />
          <Skeleton className="h-[450px] w-full" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center min-h-[500px] gap-5 text-red-400">
        <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.15)]">
          <AlertCircle className="w-10 h-10" />
        </div>
        <div className="text-center">
          <p className="font-display font-800 text-2xl text-white mb-2 tracking-tight">System Disconnected</p>
          <p className="text-sm font-medium text-slate-400 max-w-sm mx-auto leading-relaxed">{error}</p>
        </div>
        <Button onClick={() => window.location.reload()} variant="primary" className="mt-4 shadow-[0_0_30px_rgba(124,92,255,0.2)]">
          <Activity className="w-4 h-4 mr-2" /> Reconnect Environment
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-12"
    >
      {/* ── HEADER ── */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-display font-800 text-4xl text-white tracking-tight leading-tight">
            {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-brand">{user?.name || "Hacker"}</span>
          </h1>
          <p className="text-slate-400 text-sm mt-2 font-medium">
            There are <span className="text-brand-violet font-bold px-1">{stats.activeEvents}</span> active events happening globally.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => navigate('/teams')}>
            <Users className="w-4 h-4" /> Assemble Team
          </Button>
          <Button onClick={() => navigate('/hackathons')}>
            <Zap className="w-4 h-4" /> Enter Hackathon
          </Button>
        </div>
      </motion.div>

      {/* ── METRICS ── */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Global Network" value={stats.totalUsers.toLocaleString()} icon={Users} color="purple" delta={12} />
        <StatCard label="Active Deployments" value={stats.totalProjects.toLocaleString()} icon={Upload} color="cyan" delta={24} />
        <StatCard label="Registered Teams" value={stats.totalTeams.toLocaleString()} icon={Activity} color="emerald" delta={8} />
        <StatCard label="Your Events" value={stats.userHackathons.toString()} icon={Zap} color="blue" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={itemVariants}>
            <Card className="p-7">
              <SectionHeader 
                title="Activity Pulse" 
                subtitle="Your ecosystem engagement over 6 months" 
              />
              <div className="h-[300px] mt-6 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7C5CFF" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#7C5CFF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis 
                      dataKey="month" 
                      stroke="#64748b" 
                      fontSize={11} 
                      fontWeight={700}
                      tickLine={false}
                      axisLine={false}
                      dy={15}
                    />
                    <YAxis 
                      stroke="#64748b" 
                      fontSize={11} 
                      fontWeight={700}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) => `${val/1000}k`}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#7C5CFF', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#7C5CFF" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorScore)" 
                      activeDot={{ r: 6, fill: '#0B0F1A', stroke: '#7C5CFF', strokeWidth: 3 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-5 mt-4">
              <h2 className="font-display font-800 text-white text-xl tracking-tight">Timeline</h2>
              <Badge variant="default">Deadlines</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {deadlines.length === 0 ? (
                  <Card className="p-8 flex flex-col items-center justify-center text-center col-span-2">
                    <Clock className="w-8 h-8 text-slate-600 mb-3" />
                    <p className="text-slate-400 font-medium">No upcoming deadlines.</p>
                  </Card>
              ) : deadlines.map((deadline, idx) => (
                <Card key={idx} hover className="p-6">
                  <div className="flex justify-between items-start mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                      <Clock className="w-6 h-6 text-orange-400" />
                    </div>
                    <Badge variant={deadline.urgency === 'high' ? 'active' : 'upcoming'} className="font-bold">
                      {deadline.daysLeft}d left
                    </Badge>
                  </div>
                  <h3 className="font-display font-800 text-white text-lg truncate mb-1">{deadline.name}</h3>
                  <p className="text-[13px] font-medium text-slate-500 uppercase tracking-widest">
                    Due • {new Date(deadline.deadline).toLocaleDateString()}
                  </p>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card className="p-7">
              <SectionHeader 
                title="Hall of Fame" 
                subtitle="Top performing squads" 
                action
                actionLabel="View Details"
                onAction={() => navigate('/leaderboard')}
              />
              
              <div className="space-y-3 mt-4">
                {leaderboard.length === 0 ? (
                   <div className="py-6 text-center bg-white/[0.02] rounded-xl border border-white/5">
                     <p className="text-sm font-medium text-slate-500">No scores ranked yet</p>
                   </div>
                ) : leaderboard.slice(0, 5).map((l, idx) => (
                  <motion.div 
                    whileHover={{ scale: 1.02, x: 4 }}
                    key={idx} 
                    className={clsx(
                      'flex items-center justify-between p-3.5 rounded-xl border transition-colors',
                      l.isYou 
                        ? 'bg-brand-violet/15 border-brand-violet/30 shadow-[0_0_20px_rgba(124,92,255,0.1)]' 
                        : 'bg-white/[0.02] border-glass-border hover:bg-white/[0.05]'
                    )}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="flex items-center justify-center w-6 text-xs font-bold font-display text-slate-400 shrink-0">
                        #{l.rank}
                      </div>
                      <Avatar name={l.team} size="sm" className="shrink-0 ring-2 ring-white/5" />
                      <div className="truncate">
                        <p className={clsx('text-sm font-bold truncate leading-tight', l.isYou ? 'text-white' : 'text-slate-200')}>
                          {l.team} {l.isYou && <span className="text-[10px] uppercase font-bold text-brand-accent tracking-wider ml-1">You</span>}
                        </p>
                        <p className="text-[11px] font-medium text-slate-500 mt-0.5">{l.members} members</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <p className="text-sm font-display font-800 text-white">{l.score.toLocaleString()}</p>
                      {l.badge && <Trophy className={clsx('w-3.5 h-3.5 inline-block ml-1', l.badge === 'gold' ? 'text-amber-400' : l.badge === 'silver' ? 'text-slate-300' : 'text-orange-400')} />}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="p-7">
              <SectionHeader title="Log Stream" />
              <div className="space-y-6 mt-6">
                {mockActivity.slice(0, 4).map((activity) => {
                  const Icon = activityIcons[activity.icon] || Activity
                  return (
                    <div key={activity.id} className="flex gap-4 group">
                      <div className="relative mt-0.5">
                        <div className="w-9 h-9 rounded-xl bg-dark-800 border border-glass-border shadow-inner flex items-center justify-center group-hover:bg-brand-violet/10 group-hover:border-brand-violet/30 transition-colors z-10 relative">
                          <Icon className="w-4 h-4 text-slate-400 group-hover:text-brand-violet transition-colors" />
                        </div>
                        <div className="absolute top-9 bottom-[-24px] left-1/2 -ml-px w-px bg-glass-border group-last:hidden" />
                      </div>
                      <div className="pt-1">
                        <p className="text-[13px] font-bold text-slate-300 leading-snug">{activity.text}</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
              <Button variant="ghost" className="w-full mt-8 text-xs font-bold uppercase tracking-widest bg-white/[0.02]">
                Expand Logs
              </Button>
            </Card>
          </motion.div>
        </div>

      </div>
    </motion.div>
  )
}