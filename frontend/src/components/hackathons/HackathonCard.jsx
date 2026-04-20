import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Badge, Tag, Button } from '../ui'
import { Star, Calendar, Users, ArrowRight } from 'lucide-react'
import clsx from 'clsx'
import { getHackathonStatus, formatDate } from '../../utils/hackathonHelpers'

export function HackathonCard({ h, featured }) {
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
