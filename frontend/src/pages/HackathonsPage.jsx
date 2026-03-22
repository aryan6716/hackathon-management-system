import React, { useEffect, useState, useMemo } from 'react'
import { Search, Calendar, Users, ArrowRight, Star, Zap, SlidersHorizontal, Plus } from 'lucide-react'
import { Card, Button, Badge, FilterChip, Tag, Skeleton, EmptyState, Input } from '../components/ui'
import { apiGet } from '../utils/api'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'

const STATUS_FILTERS = ['All', 'Active', 'Upcoming', 'Completed']

function HackathonCard({ h, featured }) {
  const navigate = useNavigate()
  const badgeMap = { active: 'active', upcoming: 'upcoming', completed: 'completed' }
  const statusLabels = { active: 'Active', upcoming: 'Upcoming', completed: 'Completed' }

  return (
    <Card
      hover
      onClick={() => navigate(`/hackathons/${h.id || h.event_id}`)}
      className={clsx(
        'p-6 flex flex-col group h-full relative overflow-hidden transition-all duration-500 hover:shadow-[0_8px_40px_rgba(124,92,255,0.15)] bg-dark-800/40 border-white/5',
        featured && 'border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-dark-800/80 shadow-[0_0_20px_rgba(251,191,36,0.1)]'
      )}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-violet/10 blur-[50px] -mr-16 -mt-16 transition-colors group-hover:bg-brand-violet/20" />
      
      {featured && (
        <div className="flex items-center gap-1.5 mb-4 relative z-10">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 drop-shadow-md" />
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">Featured Event</span>
        </div>
      )}

      <div className="flex items-start justify-between mb-3 gap-3 relative z-10">
        <h3 className="font-display font-900 text-white text-xl leading-tight group-hover:text-brand-violet transition-colors">
          {h.name || h.title}
        </h3>
        <Badge variant={badgeMap[h.status?.toLowerCase()] || 'active'} className="shrink-0 shadow-sm">
          {statusLabels[h.status?.toLowerCase()] || h.status || 'Active'}
        </Badge>
      </div>

      <p className="text-sm text-slate-400 mb-6 flex-1 line-clamp-3 leading-relaxed font-medium relative z-10">
        {h.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-6 relative z-10">
        {(h.tags || ['General', 'Code']).map((t, i) => (
          <Tag key={i} className="bg-dark-900/50 border border-white/5 text-slate-300">{t}</Tag>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs text-slate-400 mb-6 bg-dark-900/60 p-4 rounded-xl border border-white/5 shadow-inner relative z-10">
        <div className="flex items-center gap-2.5">
          <Calendar className="w-4 h-4 text-brand-blue" />
          <span className="font-bold text-slate-200">{h.start_date ? new Date(h.start_date).toLocaleDateString() : (h.date || 'TBD')}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Users className="w-4 h-4 text-brand-purple" />
          <span className="font-bold text-slate-200">{h.team_count || h.participants || 0} Teams</span>
        </div>
      </div>

      <Button variant={featured ? 'primary' : 'secondary'} className="w-full mt-auto group/btn !rounded-xl relative z-10 overflow-hidden shadow-inner hover:shadow-lg">
        <span className="relative z-10 flex items-center justify-center">
            {h.status === 'completed' ? 'View Results' : 'Explore Event'}
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
        </span>
      </Button>
    </Card>
  )
}

const HackathonSkeleton = () => (
  <Card className="p-5 h-full space-y-4">
    <div className="flex justify-between">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-5 w-16" />
    </div>
    <Skeleton className="h-20 w-full" />
    <div className="flex gap-2">
      <Skeleton className="h-5 w-12" />
      <Skeleton className="h-5 w-12" />
    </div>
    <div className="grid grid-cols-2 gap-4 pt-2">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </div>
    <Skeleton className="h-10 w-full mt-4" />
  </Card>
)

export default function HackathonsPage() {
  const navigate = useNavigate()
  const [hackathons, setHackathons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')

  // 🔥 FETCH FROM BACKEND
  useEffect(() => {
    let isMounted = true

    const fetchHackathons = async () => {
      try {
        setLoading(true)
        const data = await apiGet('/events')
        
        console.log("📅 API Response [Hackathons]:", data);
        
        if (!isMounted) return

        // 🛡️ Safe array extraction
        const events = Array.isArray(data) ? data : [];
        setHackathons(events)
      } catch (err) {
        console.error(err)
        if (isMounted) setError('Failed to load hackathons. Please check your connection.')
      } finally {
        if (isMounted) setTimeout(() => setLoading(false), 500)
      }
    }

    fetchHackathons()
    return () => { isMounted = false }
  }, [])

  const safeHackathons = Array.isArray(hackathons) ? hackathons : [];
  
  const filtered = useMemo(() => {
    return safeHackathons.filter((h) => {
      const name = h.name || h.title || '';
      const desc = h.description || '';
      const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) || 
                           desc.toLowerCase().includes(search.toLowerCase())
      const matchesStatus =
        status === 'All' || h.status?.toLowerCase() === status.toLowerCase()
      return matchesSearch && matchesStatus
    })
  }, [safeHackathons, search, status])

  const featured = filtered.filter(h => h?.status?.toLowerCase() === 'active').slice(0, 2)
  const rest = filtered.filter(h => !featured.find(f => f.id === h.id))

  if (error) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
            <Zap className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-xl font-display font-800 text-white mb-2">Connection Error</h2>
        <p className="text-slate-500 max-w-sm mb-6">{error}</p>
        <Button variant="secondary" onClick={() => window.location.reload()}>Retry Loading</Button>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display font-800 text-3xl text-white">Explore Hackathons</h1>
          <p className="text-slate-500 text-sm mt-1 max-w-lg">
            Find the perfect competition to showcase your skills, collaborate with top talent, and win amazing prizes.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => navigate('/teams')}>
            <Plus className="w-4 h-4 mr-2" /> Start a Team
        </Button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-dark-800/40 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
        <div className="w-full md:flex-1">
            <Input 
                placeholder="Search by name, tech stack, or description..." 
                icon={Search}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="!bg-dark-900/50"
            />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            {STATUS_FILTERS.map((s) => (
                <FilterChip 
                    key={s} 
                    label={s} 
                    active={status === s} 
                    onClick={() => setStatus(s)} 
                />
            ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <HackathonSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="min-h-[400px] flex items-center justify-center">
            <EmptyState 
                icon={Zap}
                title="No hackathons found"
                description={search ? `No results for "${search}". Try adjusting your filters or search terms.` : "There are no active hackathons available at the moment."}
                action={() => { setSearch(''); setStatus('All'); }}
                actionLabel="Clear Filters"
            />
        </Card>
      ) : (
        <div className="space-y-8">
            {featured.length > 0 && status === 'All' && !search && (
                <div>
                    <h2 className="font-display font-700 text-white text-lg mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                        Featured Competitions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {featured.map((h) => (
                        <HackathonCard key={h.id || h.event_id} h={h} featured />
                    ))}
                    </div>
                </div>
            )}

            <div>
                <h2 className="font-display font-700 text-white text-lg mb-4">
                    {search || status !== 'All' ? `${filtered.length} Results Found` : 'Upcoming & Ongoing Events'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((h) => (
                    <HackathonCard key={h.id || h.event_id} h={h} />
                ))}
                </div>
            </div>
        </div>
      )}
    </div>
  )
}