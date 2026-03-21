import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Plus, Hash, Copy, Check, Crown, UserPlus, Zap, LogOut } from 'lucide-react'
import { Card, Button, Input, Select, Badge, Avatar, EmptyState, SectionHeader, Skeleton } from '../components/ui'
import { apiGet, apiPost } from '../utils/api'
import clsx from 'clsx'

const TABS = ['My Team', 'Create Team', 'Join Team']

const HACKATHON_OPTIONS = [
  { value: '', label: 'Select a hackathon...' },
  { value: '1', label: 'BuildAI 2025' },
  { value: '2', label: 'GreenTech Sprint' },
  { value: '3', label: 'HealthHack Global' },
  { value: '4', label: 'EduTech Challenge' },
]

function MemberCard({ member }) {
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

const TeamSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2 space-y-6">
      <Card className="p-8 space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-6 w-40 rounded-full" />
          </div>
          <Skeleton className="h-12 w-32" />
        </div>
        <div className="pt-6 border-t border-glass-border">
            <Skeleton className="h-7 w-48 mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[1,2,3,4].map(i => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}
            </div>
        </div>
      </Card>
    </div>
    <div className="space-y-6">
      <Card className="p-8 space-y-5">
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-12 w-full" />
      </Card>
    </div>
  </div>
)

function CreateTeamForm({ onCreated }) {
  const [form, setForm] = useState({ name: '', hackathon: '' })
  const [hackathons, setHackathons] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [teamCode, setTeamCode] = useState('')

  useEffect(() => {
    apiGet('/events').then(data => {
      const events = data.events || data || []
      setHackathons(events.map(e => ({ value: e.id.toString(), label: e.name })))
    }).catch(console.error)
  }, [])

  const handleSubmit = async () => {
    if (!form.name || !form.hackathon) return
    try {
      setLoading(true)
      setError('')
      const data = await apiPost('/teams', { 
        name: form.name, 
        event_id: parseInt(form.hackathon) 
      })
      setTeamCode(data?.team_code || 'HACK-NEW')
      setSuccess(true)
      if (onCreated) onCreated()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.15)] flex items-center justify-center mx-auto mb-5">
          <Check className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="font-display font-800 text-white text-xl tracking-tight mb-2">Protocol Established!</h3>
        <p className="text-sm font-medium text-slate-400 mb-6 font-medium">Distribute this decryption key to your allies.</p>
        <div className="inline-flex items-center gap-4 px-5 py-3.5 bg-dark-900/80 border border-glass-border rounded-xl shadow-inner">
          <Hash className="w-5 h-5 text-brand-violet drop-shadow-glow" />
          <span className="font-display font-900 text-white tracking-[0.2em] text-xl">{teamCode}</span>
          <button className="p-2 bg-white/5 rounded-lg hover:bg-brand-violet/20 hover:text-brand-violet transition-colors text-slate-400">
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div>
        <p className="text-sm font-medium text-slate-400 text-center leading-relaxed">Form a new operative unit. Once deployed, you will receive a secure token to invite your agents.</p>
      </div>
      <AnimatePresence>
      {error && (
        <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-xs font-bold text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-center">{error}</motion.p>
      )}
      </AnimatePresence>
      <Input
        label="Squad Designation"
        placeholder="e.g. NeuralNomads"
        value={form.name}
        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
      />
      <Select
        label="Target Operation"
        options={[{ value: '', label: 'Select a hackathon...' }, ...hackathons]}
        value={form.hackathon}
        onChange={e => setForm(p => ({ ...p, hackathon: e.target.value }))}
      />
      <Button
        onClick={handleSubmit}
        loading={loading}
        className="w-full py-4 mt-2"
        disabled={!form.name || !form.hackathon}
      >
        <Plus className="w-5 h-5 mr-2" /> Forge Squad
      </Button>
    </div>
  )
}

function JoinTeamForm({ onJoined }) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleJoin = async () => {
    if (code.length < 4) { setError('Please enter a valid team code'); return }
    try {
      setError('')
      setLoading(true)
      await apiPost('/teams/join', { team_code: code })
      setSuccess(true)
      if (onJoined) onJoined()
    } catch (err) {
      setError(err.message || 'Squad not found. Verify the decryption key.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
        <div className="w-16 h-16 rounded-2xl bg-brand-violet/10 border border-brand-violet/20 shadow-[0_0_30px_rgba(124,92,255,0.15)] flex items-center justify-center mx-auto mb-5">
          <Users className="w-8 h-8 text-brand-violet" />
        </div>
        <h3 className="font-display font-800 text-white text-xl tracking-tight mb-2">Access Granted!</h3>
        <p className="text-sm font-medium text-slate-400">You have been synchronized with the squad. Let's build.</p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <p className="text-sm font-medium text-slate-400 text-center leading-relaxed">Enter the secure decryption key provided by your operative commander.</p>
      <Input
        label="Squad Key"
        placeholder="e.g. HACK-7X92"
        value={code}
        onChange={e => { setCode(e.target.value.toUpperCase()); setError('') }}
        icon={Hash}
        error={error}
      />
      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-600 text-center mt-2">Try <span className="text-brand-violet bg-brand-violet/10 px-2 py-0.5 rounded ml-1">HACK-DEMO</span> to bypass</p>
      <Button onClick={handleJoin} loading={loading} className="w-full py-4 mt-2" disabled={!code}>
        <UserPlus className="w-5 h-5 mr-2" /> Authenticate
      </Button>
    </div>
  )
}

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
  const [activeTab, setActiveTab] = useState('My Team')
  const [team, setTeam] = useState(null)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchMyTeam = async () => {
    try {
      setLoading(true)
      const data = await apiGet('/teams/my')
      if (data) {
        setTeam(data)
        setMembers(data.members || [])
      } else {
        setTeam(null)
      }
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setTimeout(() => setLoading(false), 400)
    }
  }

  useEffect(() => {
    fetchMyTeam()
  }, [])

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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-12 relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-5 relative z-10">
        <div>
          <h1 className="font-display font-800 text-3xl sm:text-4xl text-white tracking-tight">Squad Central</h1>
          <p className="text-slate-400 text-sm mt-2 max-w-lg font-medium leading-relaxed">
            Mobilize your operatives. Form alliances and coordinate deployments here natively.
          </p>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="flex items-center gap-1.5 p-1.5 bg-dark-900/60 border border-glass-border backdrop-blur-xl rounded-2xl w-fit shadow-glass overflow-x-auto max-w-full no-scrollbar relative z-10">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              'px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 relative whitespace-nowrap',
              activeTab === tab ? 'text-white' : 'text-slate-500 hover:text-slate-300'
            )}
          >
            {activeTab === tab && (
              <motion.div layoutId="team-tabs" className="absolute inset-0 bg-gradient-brand shadow-brand rounded-xl z-0" />
            )}
            <span className="relative z-10">{tab}</span>
          </button>
        ))}
      </div>

      {/* ── TAB CONTENT ── */}
      <AnimatePresence mode="wait">
        {activeTab === 'My Team' && (
          <motion.div key="myteam" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
            {team ? (
              <>
                <div className="lg:col-span-2 space-y-6">
                  <Card className="p-7 sm:p-9 relative overflow-hidden group shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-violet/5 blur-[80px] -mr-32 -mt-32 pointer-events-none group-hover:bg-brand-violet/15 transition-colors duration-700" />
                    
                    <div className="flex flex-col sm:flex-row items-start justify-between mb-10 gap-6 relative z-10">
                      <div>
                        <h2 className="font-display font-900 text-white text-3xl sm:text-4xl tracking-tight leading-none drop-shadow-md">{team.name}</h2>
                        <div className="flex items-center gap-3 mt-4">
                          <Badge variant="active" className="shadow-[0_0_15px_rgba(16,185,129,0.2)] px-3 py-1.5 text-xs">Active Squad</Badge>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-dark-800/80 px-2.5 py-1.5 border border-glass-border rounded-lg shadow-inner">
                              <Zap className="w-3.5 h-3.5 text-brand-accent drop-shadow-glow" /> Op ID {team.event_id}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-start sm:items-end gap-2 shrink-0 w-full sm:w-auto">
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none ml-1 sm:ml-0">Decryption Key</p>
                          <div className="flex items-center justify-between w-full gap-4 px-4 py-3 bg-dark-900/80 rounded-xl border border-glass-border shadow-inner group/code overflow-hidden relative">
                              <div className="absolute inset-0 bg-brand-violet/5 translate-x-[-100%] group-hover/code:translate-x-0 transition-transform duration-500" />
                              <div className="flex items-center gap-3 relative z-10">
                                <Hash className="w-4 h-4 text-brand-violet drop-shadow-glow" />
                                <span className="text-lg sm:text-xl font-display font-900 text-white tracking-[0.15em]">{team.team_code}</span>
                              </div>
                              <button className="text-slate-500 hover:text-white bg-white/5 p-1.5 rounded-md hover:bg-brand-violet/20 transition-colors relative z-10 shadow-sm ml-2">
                                  <Copy className="w-4 h-4" />
                              </button>
                          </div>
                      </div>
                    </div>

                    <SectionHeader title="Operative Roster" subtitle={`${members.length} agents deployed`} className="relative z-10" />
                    <motion.div variants={listVariant} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10 mt-2">
                      {members.map(m => (
                        <motion.div variants={itemVariant} key={m.id}>
                          <MemberCard 
                            member={{ 
                              id: m.id, 
                              name: m.name, 
                              role: m.role || 'Operative', 
                              isLead: m.id === team.lead_id 
                            }} 
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="p-7 border-brand-violet/20 bg-[#0B0F1A]/80 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                    <SectionHeader title="Squad Intel" />
                    <div className="space-y-5 mt-2">
                      <p className="text-[13px] font-medium text-slate-400 leading-relaxed">
                          Your squad is locked into this operation. Coordinates set. Ready for launch.
                      </p>
                      <div className="p-5 rounded-2xl bg-dark-900/50 border border-glass-border shadow-inner">
                          <div className="flex items-center justify-between mb-3 text-xs font-bold uppercase tracking-widest">
                              <span className="text-slate-500">Operation Readiness</span>
                              <span className="text-brand-accent drop-shadow-glow">80%</span>
                          </div>
                          <div className="w-full h-2 bg-dark-950 rounded-full overflow-hidden border border-white/5">
                              <motion.div 
                                initial={{ width: 0 }} 
                                animate={{ width: '80%' }} 
                                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                                className="h-full bg-gradient-brand rounded-full shadow-[0_0_15px_rgba(0,212,255,0.6)]" 
                              />
                          </div>
                      </div>
                    </div>
                  </Card>

                  <Button variant="danger" className="w-full !rounded-2xl py-4 group shadow-[0_4px_20px_rgba(239,68,68,0.15)]" size="lg">
                    <LogOut className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Disconnect from Squad
                  </Button>
                </div>
              </>
            ) : (
              <div className="lg:col-span-3">
                <Card className="p-16 sm:p-24 text-center shadow-glass bg-dark-900/40 relative overflow-hidden group border-glass-border">
                  <div className="absolute inset-0 bg-gradient-radial-blue opacity-10 pointer-events-none bg-[length:100%_100%] group-hover:opacity-30 transition-opacity duration-1000" />
                  <EmptyState
                    icon={Users}
                    title="No Squad Detected"
                    description="You are currently isolated. Hackathons require collaborative operations. Form a new unit or synchronize with an existing one."
                    action={() => setActiveTab('Create Team')}
                    actionLabel="Forge New Team"
                  />
                  <div className="flex items-center justify-center gap-4 mt-8">
                    <Button variant="secondary" onClick={() => setActiveTab('Join Team')} className="px-8 !rounded-2xl shadow-inner">
                      <Hash className="w-4 h-4 mr-2" /> Sync with Code
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'Create Team' && (
          <motion.div key="create" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
            <Card className="p-8 sm:p-12 max-w-2xl mx-auto shadow-[0_12px_48px_rgba(0,0,0,0.5)] relative overflow-hidden bg-[#0B0F1A]/80 border-brand-violet/20">
              <div className="absolute top-0 right-0 w-80 h-80 bg-brand-violet/10 blur-[100px] -mr-40 -mt-40 pointer-events-none mix-blend-screen" />
              <SectionHeader title="Establish Protocol" subtitle="Define your mission parameters and recruit your agents" center className="mb-10" />
              <div className="relative z-10">
                <CreateTeamForm onCreated={() => { fetchMyTeam(); setActiveTab('My Team') }} />
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'Join Team' && (
          <motion.div key="join" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
            <Card className="p-8 sm:p-12 max-w-xl mx-auto shadow-[0_12px_48px_rgba(0,0,0,0.5)] relative overflow-hidden bg-[#0B0F1A]/80 border-brand-violet/20">
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-blue/10 blur-[100px] -ml-40 -mb-40 pointer-events-none mix-blend-screen" />
              <SectionHeader title="Engage Protocol" subtitle="Enter your operative decryption key to mobilize" center className="mb-10" />
              <div className="relative z-10">
                <JoinTeamForm onJoined={() => { fetchMyTeam(); setActiveTab('My Team') }} />
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
