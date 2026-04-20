import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Hash, UserPlus } from 'lucide-react'
import { Button, Input } from '../ui'
import { useJoinTeam } from '../../hooks/useTeams'

export function JoinTeamForm({ onJoined }) {
  const [code, setCode] = useState('')
  const [localError, setLocalError] = useState('')
  const { joinTeam, loading, error: joinError, success } = useJoinTeam()
  const error = localError || joinError

  const handleJoin = async () => {
    if (code.length < 4) { setLocalError('Please enter a valid team code'); return }
    setLocalError('')
    const ok = await joinTeam(code)
    if (ok && onJoined) onJoined()
  }

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
        <div className="w-16 h-16 rounded-2xl bg-brand-violet/10 border border-brand-violet/20 shadow-[0_0_30px_rgba(124,92,255,0.15)] flex items-center justify-center mx-auto mb-5">
          <Users className="w-8 h-8 text-brand-violet" />
        </div>
        <h3 className="font-display font-800 text-white text-xl tracking-tight mb-2">You Joined the Team</h3>
        <p className="text-sm font-medium text-slate-400">You are now part of this team.</p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <p className="text-sm font-medium text-slate-400 text-center leading-relaxed">Enter the team code shared by your team lead.</p>
      <Input
        label="Team Code"
        placeholder="e.g. HACK-7X92"
        value={code}
        onChange={e => { setCode(e.target.value.toUpperCase()); setLocalError('') }}
        icon={Hash}
        error={error}
      />
      <Button onClick={handleJoin} loading={loading} className="w-full py-4 mt-2 btn-premium-primary shadow-lg shadow-purple-500/30" disabled={!code}>
        <UserPlus className="w-5 h-5 mr-2" /> Join Team
      </Button>
    </div>
  )
}
