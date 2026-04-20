import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.15)] flex items-center justify-center mx-auto mb-5">
          <Check className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="font-display font-800 text-white text-xl tracking-tight mb-2">Team Created</h3>
        <p className="text-sm font-medium text-slate-400 mb-6 font-medium">Share this team code so others can join.</p>
        <div className="inline-flex items-center gap-4 px-5 py-3.5 bg-dark-900/80 border border-glass-border rounded-xl shadow-inner">
          <Hash className="w-5 h-5 text-brand-violet drop-shadow-glow" />
          <span className="font-display font-900 text-white tracking-[0.2em] text-xl">{teamCode}</span>
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
            className="p-2 bg-white/5 rounded-lg hover:bg-brand-violet/20 hover:text-brand-violet transition-colors text-slate-400"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div>
        <p className="text-sm font-medium text-slate-400 text-center leading-relaxed">Create a team for a hackathon. You will receive a team code to invite members.</p>
      </div>
      <AnimatePresence>
      {error && (
        <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-xs font-bold text-red-400 bg-red-500/10 p-4 rounded-xl border border-red-500/20 text-center">{error}</motion.p>
      )}
      </AnimatePresence>
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
        className="w-full py-4 mt-2 btn-premium-primary shadow-lg shadow-purple-500/30"
        disabled={!form.name || !form.hackathon}
      >
        <Plus className="w-5 h-5 mr-2" /> Create Team
      </Button>
    </div>
  )
}
