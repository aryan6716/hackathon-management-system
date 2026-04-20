import React, { useState } from 'react'
import { Check, Hash, Copy, Plus } from 'lucide-react'
import { Button, Input, Select } from '../ui'
import { useToast } from '../../context/ToastContext'
import { useHackathons } from '../../hooks/useHackathons'
import { useCreateTeam } from '../../hooks/useTeams'

export function CreateTeamForm({ onCreated }) {
  const { showToast } = useToast()
  const [form, setForm] = useState({ name: '', hackathon: '' })
  
  const { hackathons } = useHackathons()
  const hackathonOptions = [
    { value: '', label: 'Select a hackathon...' }, 
    ...hackathons.map((e) => ({ value: String(e.id || e.event_id), label: e.name || e.title }))
  ]

  const { createTeam, loading, error, success, teamCode } = useCreateTeam()

  const handleSubmit = async () => {
    if (!form.name || !form.hackathon) return
    const ok = await createTeam(form)
    if (ok && onCreated) onCreated()
  }

  if (success) {
    return (
    return (
      <div className="text-center py-10">
        <div className="w-16 h-16 rounded-full bg-emerald-900/50 border border-emerald-700 flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-white text-xl font-bold mb-2">Team Created</h3>
        <p className="text-sm text-gray-400 mb-6">Share this team code so others can join.</p>
        <div className="inline-flex items-center gap-4 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg">
          <Hash className="w-5 h-5 text-indigo-400" />
          <span className="font-semibold text-white tracking-widest text-xl">{teamCode}</span>
          <button
            type="button"
            aria-label="Copy team code"
            onClick={() => {
              navigator.clipboard?.writeText(teamCode).then(() => {
                showToast('Team code copied to clipboard.', 'success')
              }).catch(() => {
                showToast('Could not copy code. Please copy it manually.', 'error')
              })
            }}
            className="p-2 text-gray-400 hover:text-white"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div>
        <p className="text-sm text-gray-400 text-center">Create a team for a hackathon. You will receive a team code to invite members.</p>
      </div>
      {error && (
        <div className="text-sm bg-red-900/50 p-4 rounded-lg border border-red-800 text-red-200 text-center">{error}</div>
      )}
      <Input
        label="Team Name"
        placeholder="e.g. BuildMasters"
        value={form.name}
        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
      />
      <Select
        label="Hackathon"
        options={hackathonOptions}
        value={form.hackathon}
        onChange={e => setForm(p => ({ ...p, hackathon: e.target.value }))}
      />
      <Button
        onClick={handleSubmit}
        loading={loading}
        className="w-full mt-2"
        disabled={!form.name || !form.hackathon}
      >
        <Plus className="w-5 h-5 mr-2" /> Create Team
      </Button>
    </div>
  )
}
