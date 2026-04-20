import React from 'react'
import { motion } from 'framer-motion'
import { Avatar, Badge } from '../ui'
import { Zap } from 'lucide-react'
import clsx from 'clsx'

const tableRow = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: "spring" } }
}

export function LeaderboardRow({ entry, idx }) {
  const rank = idx + 1
  const rankColor = idx < 3 ? 'font-black drop-shadow-md' : 'font-bold text-gray-400'

  return (
    <motion.div variants={tableRow} className="flex items-center gap-4 px-6 py-5 transition-all duration-200 hover:bg-white/[0.04] group">
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
}
