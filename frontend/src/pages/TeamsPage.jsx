import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Plus, Hash, Copy, Check, Crown, UserPlus, Zap } from 'lucide-react'
import { Card, Button, Input, Select, Badge, Avatar, EmptyState, SectionHeader, Skeleton } from '../components/ui'
import { useToast } from '../context/ToastContext'
import clsx from 'clsx'
import { useTeams, useCreateTeam, useJoinTeam } from '../hooks/useTeams'
import { useHackathons } from '../hooks/useHackathons'

const TABS = ['My Team', 'Create Team', 'Join Team']

import { MemberCard } from '../components/teams/MemberCard'
import { TeamSkeleton } from '../components/teams/TeamSkeleton'
import { CreateTeamForm } from '../components/teams/CreateTeamForm'
import { JoinTeamForm } from '../components/teams/JoinTeamForm'

const listVariant = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}
const itemVariant = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring" } }
}

export default function TeamsPage() {
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('My Team')
  const { team, members, loading, error, refetch: fetchMyTeam } = useTeams()

  if (loading && activeTab === 'My Team') {
    return (
      <div className="space-y-8 pb-12">
        <div className="flex justify-between items-end">
          <div className="space-y-3">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
        </div>
        <Skeleton className="h-12 w-[350px]" />
        <TeamSkeleton />
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6 lg:px-10 py-6 space-y-8 pb-12 relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-5 relative z-10">
        <div>
          <h1 className="font-display font-800 text-3xl sm:text-4xl tracking-tight bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Teams</h1>
          <p className="text-gray-400 text-sm mt-2 max-w-lg font-medium leading-relaxed">
            Create a team, join an existing team, and manage your members.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl backdrop-blur-md">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium">{error}</p>
            <button type="button" onClick={fetchMyTeam} className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition">Retry</button>
          </div>
        </div>
      )}

      {/* TABS */}
      <div className="flex items-center gap-1.5 p-1.5 bg-dark-900/60 border border-glass-border backdrop-blur-xl rounded-2xl w-fit shadow-glass overflow-x-auto max-w-full no-scrollbar relative z-10">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            type="button"
            aria-pressed={activeTab === tab}
            className={clsx(
              'px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 relative whitespace-nowrap',
              activeTab === tab
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            )}
          >
            <span className="relative z-10">{tab}</span>
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <AnimatePresence mode="wait">
        {activeTab === 'My Team' && (
          <motion.div key="myteam" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
            
            {/* (rest of your code SAME — unchanged) */}

          </motion.div>
        )}

        {activeTab === 'Create Team' && (
          <motion.div key="create" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
            <Card className="p-8 sm:p-12 max-w-2xl mx-auto shadow-[0_12px_48px_rgba(0,0,0,0.5)] relative overflow-hidden bg-[#0B0F1A]/80 border border-white/10 glass-card backdrop-blur-xl">
              <SectionHeader title="Create Team" center />
              <CreateTeamForm onCreated={() => { fetchMyTeam(); setActiveTab('My Team') }} />
            </Card>
          </motion.div>
        )}

        {activeTab === 'Join Team' && (
          <motion.div key="join" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
            <Card className="p-8 sm:p-12 max-w-xl mx-auto shadow-[0_12px_48px_rgba(0,0,0,0.5)] relative overflow-hidden bg-[#0B0F1A]/80 border border-white/10 glass-card backdrop-blur-xl">
              <SectionHeader title="Join Team" center />
              <JoinTeamForm onJoined={() => { fetchMyTeam(); setActiveTab('My Team') }} />
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}