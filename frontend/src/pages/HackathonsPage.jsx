import React, { useEffect, useState, useMemo } from 'react'
import { Search, Calendar, Users, ArrowRight, Star, Zap, Plus, Trophy, ChevronLeft } from 'lucide-react'
import { Card, Button, Badge, FilterChip, Tag, Skeleton, EmptyState, Input } from '../components/ui'
import { apiGet } from '../utils/api'
import { useNavigate, useParams } from 'react-router-dom'
import clsx from 'clsx'
import { useHackathons, useHackathonDetail } from '../hooks/useHackathons'

const STATUS_FILTERS = ['All', 'Active', 'Upcoming', 'Completed']

import { getHackathonStatus } from '../utils/hackathonHelpers'
import { HackathonCard } from '../components/hackathons/HackathonCard'
import { HackathonSkeleton } from '../components/hackathons/HackathonSkeleton'
import { HackathonDetailView } from '../components/hackathons/HackathonDetailView'

export default function HackathonsPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  
  const { hackathons, loading: hackathonsLoading, error: hackathonsError } = useHackathons()
  const loading = id ? false : hackathonsLoading
  const error = id ? null : hackathonsError

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')

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
