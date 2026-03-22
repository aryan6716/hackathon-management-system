import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Camera, Edit3, Save, Palette, Key, Check, Monitor, Moon, 
  User, Mail, Link as LinkIcon, Twitter, Github, Award, 
  Settings, Bell, Shield, Zap, Target, Activity, Sparkles,
  ArrowRight
} from 'lucide-react'
import { apiGet } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Card, Button, Badge, Avatar, Input, SectionHeader, Skeleton, StatCard } from '../components/ui'
import { StaggerContainer, StaggerItem, FadeIn, SlideUp } from '../components/ui/Animations'
import { BackgroundBlobs, AnimatedGradient } from '../components/ui/Backgrounds'
import clsx from 'clsx'

const SKILL_BADGES = ['React', 'Python', 'ML/AI', 'Node.js', 'TypeScript', 'Design', 'Docker', 'AWS', 'Rust', 'Go']
const SETTINGS_TABS = [
  { id: 'Profile', icon: User },
  { id: 'Account', icon: Shield },
  { id: 'Notifications', icon: Bell },
  { id: 'Appearance', icon: Palette }
]

// ─────────────────────────────────────────────────────────────────────────────
// Profile Tab
// ─────────────────────────────────────────────────────────────────────────────
function ProfileTab({ user }) {
  const [editing, setEditing] = useState(false)
  const [stats, setStats] = useState({ hackathons: 0, teams: 0, submissions: 0, rank: 'N/A' })
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    name: user?.name || 'User',
    bio: 'Full-stack dev & ML enthusiast. Hackathon veteran. Building cool stuff with modern tech stacks.',
    github: 'arjunsharma',
    website: 'arjun.dev',
    twitter: 'arjundev',
    skills: ['React', 'Python', 'ML/AI', 'Node.js'],
  })
  const [saved, setSaved] = useState(false)
  const { updateUser } = useAuth()

  useEffect(() => {
    let isMounted = true
    const fetchStats = async () => {
      try {
        setLoading(true)
        const [eventsData, teamData, projectsData, leaderboardData] = await Promise.all([
          apiGet('/events'),
          apiGet('/teams/my'),
          apiGet('/submissions'),
          apiGet('/leaderboard'),
        ])
        if (!isMounted) return
        const events = eventsData || []
        const projects = projectsData || []
        const myTeam = teamData
        const leaderboard = leaderboardData || []
        let myRank = 'N/A'
        if (myTeam) {
          const entry = leaderboard.find(l => l.team_id === myTeam.id)
          if (entry) myRank = `#${leaderboard.indexOf(entry) + 1}`
        }
        setStats({ hackathons: events.length, teams: myTeam ? 1 : 0, submissions: projects.length, rank: myRank })
      } catch (err) {
        console.error('Profile stats error:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchStats()
    return () => { isMounted = false }
  }, [])

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSave = async () => {
    try {
      setSaved(false)
      updateUser({ name: form.name })
      await new Promise(r => setTimeout(r, 600))
      setEditing(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error('Save error:', err)
    }
  }

  const toggleSkill = (skill) =>
    setForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Brief & Stats */}
      <div className="lg:col-span-4 space-y-8">
        <StaggerItem>
          <Card className="p-8 text-center relative overflow-hidden group !rounded-[32px]">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/5 to-transparent pointer-events-none" />
            <div className="relative inline-block mb-6">
              <div className="relative z-10">
                <Avatar name={user?.name || 'U'} size="xl" className="mx-auto rounded-[32px] border-4 border-white/10 ring-8 ring-indigo-500/5 shadow-2xl" />
              </div>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-indigo-600 border-4 border-slate-900 flex items-center justify-center hover:bg-indigo-500 transition-colors shadow-lg z-20"
              >
                <Camera className="w-4 h-4 text-white" />
              </motion.button>
            </div>
            
            <h2 className="text-2xl font-bold text-white tracking-tight">{form.name}</h2>
            <p className="text-slate-400 font-medium text-sm mt-1">{user?.email}</p>
            
            <div className="flex items-center justify-center gap-2 mt-6">
              <Badge variant="active" className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                {user?.role || 'Hacker'}
              </Badge>
              <Badge variant="upcoming" className="px-3 py-1">Pro Member</Badge>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-xl font-bold text-white">{stats.hackathons}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Missions</p>
              </div>
              <div className="text-center border-l border-white/5">
                <p className="text-xl font-bold text-white">{stats.rank}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Global Rank</p>
              </div>
            </div>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" /> Achievements
            </h3>
            <Card className="p-6 !rounded-[24px]">
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-400">
                    <Trophy size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">First Blood</p>
                    <p className="text-[10px] text-slate-500">Completed 1st hackathon</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 opacity-40">
                  <div className="w-10 h-10 rounded-xl bg-slate-400/10 flex items-center justify-center text-slate-400">
                    <Star size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Legendary Builder</p>
                    <p className="text-[10px] text-slate-500">Win 3 consecutive events</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </StaggerItem>
      </div>

      {/* Right Column: Settings */}
      <div className="lg:col-span-8 space-y-8">
        <StaggerItem>
          <Card className="p-8 !rounded-[32px]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-white">General Information</h3>
                <p className="text-slate-400 text-sm mt-1 font-medium">Update your profile visibility and identity</p>
              </div>
              <Button 
                variant={editing ? 'primary' : 'secondary'} 
                onClick={editing ? handleSave : () => setEditing(true)}
                className="!rounded-xl px-6"
              >
                {editing ? <><Save className="w-4 h-4 mr-2" /> Save Changes</> : <><Edit3 className="w-4 h-4 mr-2" /> Edit Profile</>}
              </Button>
            </div>

            <AnimatePresence>
              {saved && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-sm text-emerald-400 font-bold flex items-center gap-2"
                >
                  <Check className="w-4 h-4" /> Profile synchronized successfully
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                  label="Display Name" 
                  value={form.name} 
                  onChange={e => update('name', e.target.value)} 
                  disabled={!editing} 
                  icon={User}
                  className="bg-white/[0.03] border-white/5"
                />
                <Input 
                  label="Email" 
                  value={user?.email} 
                  disabled={true} 
                  icon={Mail}
                  className="bg-white/[0.01] border-white/5 opacity-60"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">About You</label>
                <div className="relative">
                  <textarea
                    rows={4}
                    value={form.bio}
                    onChange={e => update('bio', e.target.value)}
                    disabled={!editing}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 resize-none disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Input label="GitHub" value={form.github} onChange={e => update('github', e.target.value)} disabled={!editing} icon={Github} className="bg-white/[0.03] border-white/5" />
                <Input label="Website" value={form.website} onChange={e => update('website', e.target.value)} disabled={!editing} icon={LinkIcon} className="bg-white/[0.03] border-white/5" />
                <Input label="Twitter" value={form.twitter} onChange={e => update('twitter', e.target.value)} disabled={!editing} icon={Twitter} className="bg-white/[0.03] border-white/5" />
              </div>
            </div>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card className="p-8 !rounded-[32px]">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white">Technological Arsenal</h3>
              <p className="text-slate-400 text-sm mt-1 font-medium">These skills will be showcased on your public operative profile</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {SKILL_BADGES.map(skill => (
                <motion.button
                  key={skill}
                  whileHover={editing ? { scale: 1.05 } : {}}
                  whileTap={editing ? { scale: 0.95 } : {}}
                  onClick={() => editing && toggleSkill(skill)}
                  className={clsx(
                    'px-5 py-2.5 rounded-2xl text-sm font-bold border transition-all duration-300',
                    form.skills.includes(skill)
                      ? 'bg-indigo-600/10 border-indigo-500/40 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.1)]'
                      : 'bg-white/5 border-white/5 text-slate-500',
                    editing ? 'cursor-pointer hover:border-indigo-500/30' : 'cursor-default'
                  )}
                >
                  {skill}
                </motion.button>
              ))}
              {editing && (
                <button className="px-5 py-2.5 rounded-2xl border border-dashed border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-400 transition-all text-sm font-bold">
                  + Add Skill
                </button>
              )}
            </div>
          </Card>
        </StaggerItem>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Account Tab
// ─────────────────────────────────────────────────────────────────────────────
function AccountTab() {
  return (
    <div className="max-w-2xl space-y-8">
      <FadeIn>
        <Card className="p-8 !rounded-[32px]">
          <SectionHeader title="Authentication Security" subtitle="Update your system access credentials" icon={Shield} />
          <div className="space-y-6 mt-6">
            <Input label="Current Password" type="password" placeholder="••••••••" icon={Lock} className="bg-white/[0.03] border-white/5" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input label="New Password" type="password" placeholder="••••••••" icon={Lock} className="bg-white/[0.03] border-white/5" />
              <Input label="Confirm Secret" type="password" placeholder="••••••••" icon={Lock} className="bg-white/[0.03] border-white/5" />
            </div>
            <Button className="!rounded-xl px-8 shadow-xl shadow-indigo-600/10">
              <Key className="w-4 h-4 mr-2" /> Synchronization Credentials
            </Button>
          </div>
        </Card>
      </FadeIn>

      <FadeIn delay={0.1}>
        <Card className="p-8 border-rose-500/10 !rounded-[32px] bg-rose-500/[0.02]">
          <SectionHeader title="Danger Protocol" subtitle="Irreversible account termination. All mission data will be scrubbed." />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mt-6 p-6 bg-rose-500/5 rounded-2xl border border-rose-500/10">
            <div>
              <p className="text-white font-bold">Permanently terminate account</p>
              <p className="text-slate-400 text-xs mt-1 font-medium">This action is non-reversible. Proceed with caution.</p>
            </div>
            <Button variant="danger" className="!rounded-xl border-rose-500/20">
              Scrub My Data
            </Button>
          </div>
        </Card>
      </FadeIn>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Notifications Tab
// ─────────────────────────────────────────────────────────────────────────────
function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    hackathonUpdates: true,
    teamInvites: true,
    submissionReviews: true,
    leaderboardChanges: false,
    weeklyDigest: true,
  })
  const toggle = k => setPrefs(p => ({ ...p, [k]: !p[k] }))
  const items = [
    { key: 'hackathonUpdates', label: 'Mission Briefings', desc: 'New events, deadline updates and alerts' },
    { key: 'teamInvites', label: 'Squad Recruitment', desc: 'When elite teams request your participation' },
    { key: 'submissionReviews', label: 'Tactical Feedback', desc: 'Score reports and judge evaluations' },
    { key: 'leaderboardChanges', label: 'Rank Oscillations', desc: 'Real-time global position changes' },
    { key: 'weeklyDigest', label: 'Operative Digest', desc: 'Cumulative summary of weekly activities' },
  ]
  return (
    <div className="max-w-2xl">
      <FadeIn>
        <Card className="p-8 !rounded-[32px]">
          <SectionHeader title="Communication Channels" subtitle="Configure how the center reaches you" icon={Bell} />
          <div className="space-y-2 mt-6">
            {items.map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/[0.02] transition-colors group">
                <div>
                  <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{label}</p>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium tracking-wide">{desc}</p>
                </div>
                <button
                  onClick={() => toggle(key)}
                  className={clsx(
                    'w-14 h-7 rounded-full transition-all duration-300 relative flex-shrink-0 border',
                    prefs[key] ? 'bg-indigo-600 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'bg-white/5 border-white/10'
                  )}
                >
                  <motion.span 
                    animate={{ x: prefs[key] ? 28 : 4 }}
                    className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg" 
                  />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-white/5 flex justify-end">
            <Button variant="secondary" className="!rounded-xl px-6">Reset Defaults</Button>
          </div>
        </Card>
      </FadeIn>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Appearance Tab
// ─────────────────────────────────────────────────────────────────────────────
const THEME_OPTIONS = [
  {
    id: 'dark',
    label: 'Cyber',
    description: 'Neon balanced look',
    icon: Moon,
    colors: ['#6366f1', '#4338ca', '#312e81'],
    preview: 'bg-[#0f172a]',
  },
  {
    id: 'darker',
    label: 'Phantom',
    description: 'Stealth mission mode',
    icon: Monitor,
    colors: ['#334155', '#1e293b', '#0f172a'],
    preview: 'bg-[#020617]',
  },
  {
    id: 'oled',
    label: 'Void',
    description: 'Absolute zero light',
    icon: Sparkles,
    colors: ['#000000', '#111111', '#222222'],
    preview: 'bg-black',
  },
]

function AppearanceTab() {
  const { theme, setTheme } = useTheme()
  const [justChanged, setJustChanged] = useState(null)

  const handleSelect = (id) => {
    setTheme(id)
    setJustChanged(id)
    setTimeout(() => setJustChanged(null), 1200)
  }

  return (
    <div className="max-w-3xl">
      <FadeIn>
        <Card className="p-8 !rounded-[32px]">
          <SectionHeader title="Visual Environment" subtitle="Interface skin and system luminosity" icon={Palette} />
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
            {THEME_OPTIONS.map(({ id, label, description, icon: Icon, colors, preview }) => {
              const isActive = theme === id
              return (
                <motion.button
                  key={id}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(id)}
                  className={clsx(
                    'relative p-5 rounded-[24px] border transition-all duration-300 text-left overflow-hidden group',
                    isActive
                      ? 'bg-indigo-600/10 border-indigo-500/50 ring-1 ring-indigo-500/20 shadow-2xl'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
                  )}
                >
                  <div className={clsx('h-24 rounded-2xl mb-4 relative overflow-hidden border border-white/5 shadow-inner', preview)}>
                    <div className="absolute inset-0 p-3">
                      <div className="h-2 w-3/4 rounded-full bg-white/10 mb-2" />
                      <div className="h-1.5 w-1/2 rounded-full bg-white/5 mb-4" />
                      <div className="flex gap-1.5">
                        {colors.map((c, i) => (
                          <div key={i} className="h-4 flex-1 rounded-md" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className={clsx('font-bold text-sm', isActive ? 'text-indigo-400' : 'text-white')}>{label}</p>
                      <p className="text-[10px] font-medium text-slate-500 mt-0.5">{description}</p>
                    </div>
                    {isActive && (
                      <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                </motion.button>
              )
            })}
          </div>

          <div className="mt-10 p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Sparkles size={18} />
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
              Environment settings are synchronized across your secure browser session. System detection will automatically apply relevant luminosity.
            </p>
          </div>
        </Card>
      </FadeIn>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Profile Page (main export)
// ─────────────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('Profile')

  return (
    <StaggerContainer className="space-y-10 pb-20">
      <StaggerItem>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="active" className="px-3 py-1">Secure Session</Badge>
              <div className="h-1 w-1 rounded-full bg-slate-700" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">User ID: {user?.id}</span>
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight flex items-center gap-4">
              <span>Account</span>
              <span className="text-gradient">Settings</span>
            </h1>
            <p className="text-slate-400 text-base mt-2 font-medium">Manage your operative identity and system configuration.</p>
          </div>
          
          <div className="flex bg-white/5 p-1.5 rounded-[20px] border border-white/5">
            {SETTINGS_TABS.map(({id, icon: Icon}) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={clsx(
                  'relative px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center gap-2',
                  activeTab === id ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                )}
              >
                {activeTab === id && (
                  <motion.div 
                    layoutId="tab-bg"
                    className="absolute inset-0 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon size={16} className="relative z-10" />
                <span className="relative z-10 hidden sm:inline">{id}</span>
              </button>
            ))}
          </div>
        </div>
      </StaggerItem>

      <StaggerItem>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'Profile' && <ProfileTab user={user} />}
            {activeTab === 'Account' && <AccountTab />}
            {activeTab === 'Notifications' && <NotificationsTab />}
            {activeTab === 'Appearance' && <AppearanceTab />}
          </motion.div>
        </AnimatePresence>
      </StaggerItem>
    </StaggerContainer>
  )
}
