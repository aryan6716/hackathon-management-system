import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Skeleton, Card, Button, Badge } from '../ui'
import { ChevronLeft, Users, Trophy } from 'lucide-react'
import { getHackathonStatus, formatDate } from '../../utils/hackathonHelpers'
import { useHackathonDetail } from '../../hooks/useHackathons'

export function HackathonDetailView({ eventId }) {
  const navigate = useNavigate()
  const { event, loading, error } = useHackathonDetail(eventId)

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
