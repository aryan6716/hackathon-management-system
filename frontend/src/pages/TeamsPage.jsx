import React, { useState } from 'react'
import { Users, Hash, Copy, Zap } from 'lucide-react'
import { Card, Badge, EmptyState, SectionHeader, Skeleton } from '../components/ui'
import { useToast } from '../context/ToastContext'
import clsx from 'clsx'
import { useTeams } from '../hooks/useTeams'

import { MemberCard } from '../components/teams/MemberCard'
import { TeamSkeleton } from '../components/teams/TeamSkeleton'
import { CreateTeamForm } from '../components/teams/CreateTeamForm'
import { JoinTeamForm } from '../components/teams/JoinTeamForm'

const TABS = ['My Team', 'Create Team', 'Join Team']

export default function TeamsPage() {
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('My Team')
  const { team, members, loading, error, refetch: fetchMyTeam } = useTeams()

  if (loading && activeTab === 'My Team') {
    return (
      <div className="px-4 lg:px-8 py-6 space-y-6 pb-12">
        <Skeleton className="h-10 w-48 mb-6" />
        <TeamSkeleton />
      </div>
    )
  }

  return (
    <div className="px-4 lg:px-8 py-6 space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-100 tracking-tight">Teams</h1>
          <p className="text-gray-400 text-sm mt-1 max-w-lg">
            Create a team, join an existing team, and manage your members.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-md">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium">{error}</p>
            <button type="button" onClick={fetchMyTeam} className="px-3 py-1 bg-red-800 rounded font-medium text-xs">Retry</button>
          </div>
        </div>
      )}

      {/* TABS */}
      <div className="flex items-center gap-1 p-1 bg-gray-900 border border-gray-800 rounded-lg w-fit">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            type="button"
            aria-pressed={activeTab === tab}
            className={clsx(
              'px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap',
              activeTab === tab
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div>
        {activeTab === 'My Team' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {team ? (
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-6 bg-gray-900 border border-gray-800">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-8">
                    <div>
                      <h2 className="text-xl font-semibold text-white">{team.team_name || team.name}</h2>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant="active" className="text-xs">Active Team</Badge>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <Zap className="w-3.5 h-3.5 text-indigo-400" /> Event ID: {team.event_id}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-start sm:items-end gap-1">
                        <p className="text-xs text-gray-400 font-medium uppercase">Team Code</p>
                        <div className="flex items-center gap-3 px-3 py-2 bg-gray-800 rounded border border-gray-700">
                          <Hash className="w-4 h-4 text-indigo-400" />
                          <span className="text-base font-semibold text-white tracking-widest">{team.team_code}</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText(team.team_code || '').then(() => {
                                showToast('Copied to clipboard.', 'success')
                              }).catch(() => {
                                showToast('Copy failed.', 'error')
                              })
                            }}
                            className="text-gray-400 hover:text-white"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                    </div>
                  </div>

                  <SectionHeader title="Team Members" subtitle={`${members.length} members`} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    {members.map(m => (
                      <MemberCard 
                        key={m.id}
                        member={{ 
                          id: m.id, 
                          name: m.name, 
                          role: m.role || 'Member', 
                          isLead: m.id === team.leader_id 
                        }} 
                      />
                    ))}
                  </div>
                </Card>
              </div>
            ) : (
                <div className="lg:col-span-3">
                  <Card className="p-12 border border-gray-800 bg-gray-900 flex flex-col items-center justify-center text-center">
                    <EmptyState 
                        icon={Users}
                        title="You are not in a team"
                        description="Create a new team or enter a team code to join an existing one."
                        action={() => setActiveTab('Create Team')}
                        actionLabel="Create Team"
                    />
                  </Card>
                </div>
            )}
          </div>
        )}

        {activeTab === 'Create Team' && (
          <Card className="p-6 sm:p-8 max-w-2xl bg-gray-900 border border-gray-800 mx-auto">
            <SectionHeader title="Create Team" center className="mb-6" />
            <CreateTeamForm onCreated={() => { fetchMyTeam(); setActiveTab('My Team') }} />
          </Card>
        )}

        {activeTab === 'Join Team' && (
          <Card className="p-6 sm:p-8 max-w-xl bg-gray-900 border border-gray-800 mx-auto">
            <SectionHeader title="Join Team" center className="mb-6" />
            <JoinTeamForm onJoined={() => { fetchMyTeam(); setActiveTab('My Team') }} />
          </Card>
        )}
      </div>
    </div>
  )
}