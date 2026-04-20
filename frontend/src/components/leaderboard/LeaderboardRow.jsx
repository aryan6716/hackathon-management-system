import React from 'react'
import { Avatar, Badge } from '../ui'
import { Zap } from 'lucide-react'
import clsx from 'clsx'

export function LeaderboardRow({ entry, idx }) {
  const rank = idx + 1
  const rankColor = idx < 3 ? 'font-black drop-shadow-md' : 'font-bold text-gray-400'

  return (
    <div className="flex items-center gap-4 px-6 py-4 transition-all duration-200 hover:bg-gray-800/50 group">
        {/* Rank */}
        <div className="w-12 text-center flex-shrink-0">
        {idx < 3
            ? <span className="text-xl">{['🥇', '🥈', '🥉'][idx]}</span>
            : <span className={clsx('text-sm', rankColor)}>#{rank}</span>
        }
        </div>

        {/* Team */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Avatar name={entry.team_name} size="md" className="ring-2 ring-gray-800 transition-all shadow-sm" />
          <div className="min-w-0">
              <p className="text-sm font-medium text-gray-200 truncate">{entry.team_name}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">{entry.judge_count} Appraisals</p>
          </div>
        </div>

        {/* Score */}
        <div className="hidden sm:block w-32 text-center flex-shrink-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-gray-900 border border-gray-800">
                <Zap className="w-3 h-3 text-indigo-400" />
                <span className="font-semibold text-sm text-gray-200">
                    {Number(entry.avg_score || entry.final_score || 0).toFixed(1)}
                </span>
            </div>
        </div>

        {/* Status */}
        <div className="hidden sm:block w-24 text-center flex-shrink-0">
          <Badge variant={idx < 10 ? 'active' : 'default'} className="!px-2 !py-0.5 text-xs">
              {idx < 10 ? 'Elite' : 'Pro'}
          </Badge>
        </div>
    </div>
  )
}
