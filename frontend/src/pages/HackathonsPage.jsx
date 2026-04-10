import React, { useEffect, useState, useMemo } from 'react'
import { Search, Calendar, Users, ArrowRight, Star, Zap, Plus, Trophy, ChevronLeft } from 'lucide-react'
import { Card, Button, Badge, FilterChip, Tag, Skeleton, EmptyState, Input } from '../components/ui'
import { apiGet } from '../utils/api'
import { useNavigate, useParams } from 'react-router-dom'
import clsx from 'clsx'

const STATUS_FILTERS = ['All', 'Active', 'Upcoming', 'Completed']

const getHackathonStatus = (event) => {
  const now = new Date()
  const start = event?.start_date ? new Date(event.start_date) : null
  const end = event?.end_date ? new Date(event.end_date) : null

  if (end && end < now) return 'completed'
  if (start && start > now) return 'upcoming'
  return event?.status?.toLowerCase?.() || 'active'
}

const formatDate = (value) => {
  if (!value) return 'TBD'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'TBD' : date.toLocaleDateString()
}

function HackathonCard({ h, featured }) {
  const navigate = useNavigate()
  const status = getHackathonStatus(h)
  const badgeMap = { active: 'active', upcoming: 'upcoming', completed: 'completed' }
  const statusLabels = { active: 'Active', upcoming: 'Upcoming', completed: 'Completed' }

  return (
    <Card
      hover
      onClick={() => navigate(`/hackathons/${h.id || h.event_id}`)}
      className={clsx(
        'p-6 flex flex-col group h-full relative overflow-hidden transition-all duration-500 glass-card border border-white/10 backdrop-blur-xl',
        featured && 'border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-dark-800/80 shadow-[0_0_20px_rgba(251,191,36,0.1)]'
      )}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-3xl -mr-16 -mt-16 transition-colors group-hover:bg-purple-600/20" />
      
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
        <Badge variant={badgeMap[status] || 'active'} className="shrink-0 shadow-sm">
          {statusLabels[status] || 'Active'}
        </Badge>
      </div>

      <p className="text-sm text-gray-400 mb-6 flex-1 line-clamp-3 leading-relaxed font-medium relative z-10">
        {h.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-6 relative z-10">
        {(h.tags || ['General', 'Code']).map((t, i) => (
          <Tag key={i} className="bg-dark-900/50 border border-white/5 text-slate-300">{t}</Tag>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs text-gray-400 mb-6 bg-dark-900/60 p-4 rounded-xl border border-white/5 shadow-inner relative z-10">
        <div className="flex items-center gap-2.5">
          <Calendar className="w-4 h-4 text-brand-blue" />
          <span className="font-bold text-slate-200">{formatDate(h.start_date || h.date)}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Users className="w-4 h-4 text-brand-purple" />
          <span className="font-bold text-slate-200">{h.team_count || h.participants || 0} Teams</span>
        </div>
      </div>

      <Button
        variant={featured ? 'primary' : 'secondary'}
        onClick={() => navigate(`/hackathons/${h.id || h.event_id}`)}
        className={clsx("w-full mt-auto group/btn !rounded-xl relative z-10 overflow-hidden", featured && "btn-premium-primary shadow-lg shadow-purple-500/30")}
        aria-label={`View details for ${h.name || h.title || 'hackathon'}`}
      >
        <span className="relative z-10 flex items-center justify-center">
            View Details
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
        </span>
      </Button>
    </Card>
  )
}

function HackathonDetailView({ eventId }) {
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    const loadEvent = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await apiGet(`/events/${eventId}`)
        if (!mounted) return
        setEvent(data?.event || null)
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load hackathon details.')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadEvent()
    return () => { mounted = false }
  }, [eventId])

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-56" />
        <Card className="p-8 space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
          <div className="grid md:grid-cols-3 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </Card>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl max-w-sm mx-auto">
          <h2 className="text-xl font-display font-800 mb-2">Hackathon not found</h2>
          <p className="mb-6">{error || 'The requested hackathon could not be loaded.'}</p>
          <Button variant="secondary" onClick={() => navigate('/hackathons')} aria-label="Back to hackathons list" className="border-red-500/30 hover:bg-red-500/20 text-red-400">
            Back to Hackathons
          </Button>
        </div>
      </div>
    )
  }

  const status = getHackathonStatus(event)
  const badgeMap = { active: 'active', upcoming: 'upcoming', completed: 'completed' }
  const statusLabels = { active: 'Active', upcoming: 'Upcoming', completed: 'Completed' }

  return (
    <div className="space-y-6 pb-12">
      <Button
        variant="ghost"
        onClick={() => navigate('/hackathons')}
        className="px-0 text-gray-400 hover:text-white"
        aria-label="Return to hackathons list"
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <Card className="p-8 md:p-10 space-y-8 glass-card border border-white/10 backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            <Badge variant={badgeMap[status] || 'active'}>{statusLabels[status] || 'Active'}</Badge>
            <h1 className="text-3xl md:text-5xl font-display font-900 tracking-tight bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">{event.name || event.title}</h1>
            <p className="text-gray-400 text-base leading-relaxed">{event.description || 'No description provided.'}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => navigate('/teams')} aria-label="Start a team for this hackathon">
              Start a Team
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-2">Start Date</p>
            <p className="text-white font-semibold">{formatDate(event.start_date)}</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-2">End Date</p>
            <p className="text-white font-semibold">{formatDate(event.end_date)}</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-2">Created By</p>
            <p className="text-white font-semibold">{event.created_by_name || 'Admin'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 flex items-center gap-3">
            <Users className="w-5 h-5 text-indigo-400" />
            <div>
              <p className="text-white font-semibold">{event.team_count || 0} Teams</p>
              <p className="text-gray-400 text-sm">Registered squads</p>
            </div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 flex items-center gap-3">
            <Trophy className="w-5 h-5 text-amber-400" />
            <div>
              <p className="text-white font-semibold">{event.submission_count || 0} Submissions</p>
              <p className="text-gray-400 text-sm">Project entries</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
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
  const { id } = useParams()
  const [hackathons, setHackathons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')

  // 🔥 FETCH FROM BACKEND
  useEffect(() => {
    if (id) {
      setLoading(false)
      return
    }

    let isMounted = true

    const fetchHackathons = async () => {
      try {
        setLoading(true)
        const data = await apiGet('/events')
        if (!isMounted) return

        const events = Array.isArray(data) ? data : (Array.isArray(data?.events) ? data.events : [])
        setHackathons(events)
      } catch (err) {
        if (isMounted) setError('Failed to load hackathons. Please check your connection.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchHackathons()
    return () => { isMounted = false }
  }, [id])

  const safeHackathons = Array.isArray(hackathons) ? hackathons : [];
  
  const filtered = useMemo(() => {
    return safeHackathons.filter((h) => {
      const name = h.name || h.title || '';
      const desc = h.description || '';
      const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) || 
                           desc.toLowerCase().includes(search.toLowerCase())
      const matchesStatus =
        status === 'All' || getHackathonStatus(h) === status.toLowerCase()
      return matchesSearch && matchesStatus
    })
  }, [safeHackathons, search, status])

  const featured = filtered.filter(h => getHackathonStatus(h) === 'active').slice(0, 2)
  const rest = filtered.filter(h => !featured.find(f => (f.id || f.event_id) === (h.id || h.event_id)))

  if (id) {
    return <HackathonDetailView eventId={id} />
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl max-w-sm mx-auto">
          <h2 className="text-xl font-display font-800 mb-2">Connection Error</h2>
          <p className="mb-6">{error}</p>
          <Button variant="secondary" onClick={() => window.location.reload()} className="border-red-500/30 hover:bg-red-500/20 text-red-400">Retry Loading</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="px-6 lg:px-10 py-6 space-y-8 animate-in fade-in duration-700 pb-12">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display font-800 text-3xl md:text-4xl bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Explore Hackathons</h1>
          <p className="text-gray-400 text-sm mt-1 max-w-lg">
            Find the perfect competition to showcase your skills, collaborate with top talent, and win amazing prizes.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => navigate('/teams')} className="btn-premium-primary shadow-lg shadow-purple-500/30">
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
