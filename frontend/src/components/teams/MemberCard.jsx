import React from 'react'
import { Crown } from 'lucide-react'
import { Avatar, Badge } from '../ui'

export function MemberCard({ member }) {
  return (
    <div 
      className="flex items-center gap-4 p-4 rounded-xl bg-gray-800 border border-gray-700 hover:border-gray-500 transition-all duration-300 group"
    >
      <Avatar name={member.name} size="md" className="ring-2 ring-gray-700" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-gray-200 truncate">{member.name}</p>
          {member.isLead && <Crown className="w-4 h-4 text-amber-400 flex-shrink-0" />}
        </div>
        <p className="text-xs text-gray-400 font-medium uppercase mt-0.5">{member.role}</p>
      </div>
      {member.isLead
        ? <Badge variant="featured">Lead</Badge>
        : <Badge variant="default">Agent</Badge>
      }
    </div>
  )
}
