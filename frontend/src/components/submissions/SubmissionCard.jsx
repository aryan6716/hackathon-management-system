import React from 'react'
import { Card, Badge, Tag, Button } from '../ui'
import { Zap, Clock, BarChart3, ExternalLink } from 'lucide-react'

const STATUS_MAP = {
  under_review: { variant: 'review', label: 'Under Review' },
  draft: { variant: 'draft', label: 'Draft' },
  scored: { variant: 'scored', label: 'Scored' },
}

export function SubmissionCard({ sub }) {
  const status = STATUS_MAP[sub.status] || STATUS_MAP.under_review
  const hasRepoLink = Boolean(sub.githubLink)
  
  return (
    <Card hover className="p-7 flex flex-col gap-5 group h-full relative overflow-hidden glass-card border border-white/10 backdrop-blur-xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-3xl -mr-16 -mt-16 group-hover:bg-purple-600/20 transition-colors pointer-events-none" />
      
      <div className="flex items-start justify-between gap-4 relative z-10">
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-800 text-white text-xl truncate tracking-tight transition-colors">
            {sub.project}
          </h3>
          <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            <Zap className="w-3.5 h-3.5 text-brand-accent drop-shadow-glow" />
            {sub.hackathon}
          </div>
        </div>
        <Badge variant={status.variant} className="shadow-sm">{status.label}</Badge>
      </div>

      <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 flex-1 relative z-10 font-medium">
        {sub.description || 'No project description provided yet.'}
      </p>

      <div className="flex flex-wrap gap-2 relative z-10">
        {(sub.techStack || ['Web3', 'AI']).map((t, i) => <Tag key={i}>{t}</Tag>)}
      </div>

      <div className="flex flex-col gap-4 relative z-10 mt-2">
        <div className="flex items-center justify-between pt-5 border-t border-glass-border">
          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            <Clock className="w-3.5 h-3.5" />
            {sub.submittedAt
              ? <span>{new Date(sub.submittedAt).toLocaleDateString()}</span>
              : <span>Draft</span>
            }
          </div>
          {sub.score !== null ? (
            <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1.5 rounded-xl border border-emerald-500/20 shadow-inner">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-display font-800 text-emerald-400 text-sm tracking-tighter">{sub.score}</span>
            </div>
          ) : (
              <div className="flex items-center gap-1.5 bg-brand-violet/10 px-2.5 py-1.5 rounded-xl border border-brand-violet/20 shadow-inner">
                  <Clock className="w-3.5 h-3.5 text-brand-violet" />
                  <span className="font-display font-800 text-brand-violet text-[10px] uppercase">Pending</span>
              </div>
          )}
        </div>
        <Button
          variant="secondary"
          size="md"
          className="w-full"
          onClick={() => hasRepoLink && window.open(sub.githubLink, '_blank', 'noopener,noreferrer')}
          disabled={!hasRepoLink}
          aria-label={hasRepoLink ? `Open repository for ${sub.project}` : `Repository not available for ${sub.project}`}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          {hasRepoLink ? 'Open Repository' : 'Link Unavailable'}
        </Button>
      </div>
    </Card>
  )
}
