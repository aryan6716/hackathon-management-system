import React from 'react'
import { motion } from 'framer-motion'
import { Crown } from 'lucide-react'
import { Avatar, Badge } from '../ui'

export function MemberCard({ member }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="flex items-center gap-4 p-4 rounded-2xl bg-dark-800/60 border border-glass-border shadow-inner hover:border-brand-violet/30 hover:bg-dark-800/80 hover:shadow-[0_0_20px_rgba(124,92,255,0.1)] transition-all duration-300 group"
    >
      <Avatar name={member.name} size="md" className="ring-2 ring-white/5 group-hover:ring-brand-violet/20" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-white truncate">{member.name}</p>
          {member.isLead && <Crown className="w-3.5 h-3.5 text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)] flex-shrink-0" />}
        </div>
        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{member.role}</p>
      </div>
      {member.isLead
        ? <Badge variant="featured" className="shadow-sm">Lead</Badge>
        : <Badge variant="default">Agent</Badge>
      }
    </motion.div>
  )
}
