import React, { useState, useEffect } from 'react'
import { Camera, Edit3, Save, Palette, Key, Check, Monitor, Moon } from 'lucide-react'
import { apiGet } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Card, Button, Badge, Avatar, Input, SectionHeader, Skeleton } from '../components/ui'
import clsx from 'clsx'

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const SKILL_BADGES = ['React', 'Python', 'ML/AI', 'Node.js', 'TypeScript', 'Design', 'Docker', 'AWS']
const SETTINGS_TABS = ['Profile', 'Account', 'Notifications', 'Appearance']

// ─────────────────────────────────────────────────────────────────────────────
// Profile Tab
// ─────────────────────────────────────────────────────────────────────────────
function ProfileTab({ user }) {
  const [editing, setEditing] = useState(false)
  const [stats, setStats] = useState({ hackathons: 0, teams: 0, submissions: 0, rank: 'N/A' })
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    name: user?.name || 'User',
    bio: 'Full-stack dev & ML enthusiast. Hackathon veteran. Building cool stuff.',
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

  const StatItem = ({ label, value, loading }) => (
    <div className="text-center p-3 rounded-xl bg-dark-700/30 border border-white/5 flex flex-col items-center justify-center min-h-[70px]">
      {loading ? <Skeleton className="h-6 w-12 mb-1" /> : <p className="font-display font-bold text-white text-lg">{value}</p>}
      <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wide font-semibold">{label}</p>
    </div>
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom duration-500">
      <div className="space-y-6">
        <Card className="p-6 text-center shadow-glow-sm">
          <div className="relative inline-block mb-4">
            <Avatar name={user?.name || 'U'} size="xl" className="mx-auto border-4 border-white/5 ring-4 ring-brand-purple/10" />
            <button className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-brand-violet border-2 border-dark-800 flex items-center justify-center hover:bg-brand-indigo transition-all hover:scale-110 active:scale-95 shadow-lg">
              <Camera className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
          <h2 className="font-display font-800 text-white text-xl">{form.name}</h2>
          <p className="text-sm text-slate-500 mt-1">{user?.email || 'Email hidden'}</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="upcoming" className="shadow-sm">{user?.role || 'Participant'}</Badge>
            <Badge variant="active" className="shadow-sm">Active</Badge>
          </div>
        </Card>
        <Card className="p-6">
          <SectionHeader title="Community Impact" />
          <div className="grid grid-cols-2 gap-3">
            <StatItem label="Participated" value={stats.hackathons} loading={loading} />
            <StatItem label="Active Team" value={stats.teams} loading={loading} />
            <StatItem label="Projects" value={stats.submissions} loading={loading} />
            <StatItem label="Global Rank" value={stats.rank} loading={loading} />
          </div>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-5">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-5">
            <SectionHeader title="Profile Details" subtitle="How others see you" />
            <Button variant={editing ? 'primary' : 'secondary'} size="sm" onClick={editing ? handleSave : () => setEditing(true)}>
              {editing ? <><Save className="w-3.5 h-3.5" /> Save</> : <><Edit3 className="w-3.5 h-3.5" /> Edit</>}
            </Button>
          </div>
          {saved && (
            <div className="mb-4 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm text-emerald-400">
              ✓ Profile updated successfully
            </div>
          )}
          <div className="space-y-4">
            <Input label="Display Name" value={form.name} onChange={e => update('name', e.target.value)} disabled={!editing} />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-400">Bio</label>
              <textarea
                rows={3}
                value={form.bio}
                onChange={e => update('bio', e.target.value)}
                disabled={!editing}
                className="w-full bg-dark-700/70 border border-dark-500 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 outline-none transition-all focus:border-brand-violet/60 focus:ring-2 focus:ring-brand-violet/10 resize-none disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input label="GitHub" value={form.github} onChange={e => update('github', e.target.value)} disabled={!editing} />
              <Input label="Website" value={form.website} onChange={e => update('website', e.target.value)} disabled={!editing} />
              <Input label="Twitter" value={form.twitter} onChange={e => update('twitter', e.target.value)} disabled={!editing} />
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <SectionHeader title="Skills" subtitle={editing ? 'Click to toggle' : 'Your tech stack'} />
          <div className="flex flex-wrap gap-2">
            {SKILL_BADGES.map(skill => (
              <button
                key={skill}
                onClick={() => editing && toggleSkill(skill)}
                className={clsx(
                  'px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-all duration-150',
                  form.skills.includes(skill)
                    ? 'bg-brand-purple/20 border-brand-violet/30 text-brand-violet'
                    : 'bg-dark-700/40 border-dark-600/50 text-slate-500',
                  editing && 'cursor-pointer hover:border-brand-violet/40',
                  !editing && 'cursor-default'
                )}
              >
                {skill}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Account Tab
// ─────────────────────────────────────────────────────────────────────────────
function AccountTab() {
  return (
    <div className="max-w-lg space-y-5">
      <Card className="p-5">
        <SectionHeader title="Change Password" icon={Key} />
        <div className="space-y-4">
          <Input label="Current Password" type="password" placeholder="••••••••" />
          <Input label="New Password" type="password" placeholder="••••••••" />
          <Input label="Confirm New Password" type="password" placeholder="••••••••" />
          <Button size="sm"><Key className="w-3.5 h-3.5" /> Update Password</Button>
        </div>
      </Card>
      <Card className="p-5 border-red-500/20">
        <SectionHeader title="Danger Zone" />
        <p className="text-sm text-slate-500 mb-4">Once you delete your account, all data will be permanently removed.</p>
        <Button variant="danger" size="sm">Delete Account</Button>
      </Card>
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
    { key: 'hackathonUpdates', label: 'Hackathon Updates', desc: 'New events, deadline reminders' },
    { key: 'teamInvites', label: 'Team Invites', desc: 'When someone invites you to a team' },
    { key: 'submissionReviews', label: 'Submission Reviews', desc: 'Score and feedback notifications' },
    { key: 'leaderboardChanges', label: 'Leaderboard Changes', desc: 'Rank up/down alerts' },
    { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Summary of your hackathon activity' },
  ]
  return (
    <Card className="p-5 max-w-lg">
      <SectionHeader title="Email Notifications" />
      <div className="space-y-1">
        {items.map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between p-3 rounded-xl hover:bg-dark-700/30 transition-colors">
            <div>
              <p className="text-sm font-medium text-white">{label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
            </div>
            <button
              onClick={() => toggle(key)}
              className={clsx('w-11 h-6 rounded-full transition-all duration-200 relative flex-shrink-0', prefs[key] ? 'bg-brand-violet' : 'bg-dark-600')}
            >
              <span className={clsx('absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200', prefs[key] ? 'translate-x-5' : 'translate-x-0')} />
            </button>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Appearance Tab – CONNECTED TO ThemeContext
// ─────────────────────────────────────────────────────────────────────────────
const THEME_OPTIONS = [
  {
    id: 'dark',
    label: 'Dark',
    description: 'Default dark interface',
    icon: Moon,
    swatches: ['#05050f', '#0d0e1a', '#1a1b2e'],
    preview: 'bg-[#05050f]',
  },
  {
    id: 'darker',
    label: 'Darker',
    description: 'Deeper, subdued tones',
    icon: Monitor,
    swatches: ['#020209', '#070710', '#0f101f'],
    preview: 'bg-[#020209]',
  },
  {
    id: 'oled',
    label: 'OLED',
    description: 'Pure black, max contrast',
    icon: Palette,
    swatches: ['#000000', '#080808', '#111111'],
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
    <div className="max-w-xl space-y-5">
      <Card className="p-6">
        <SectionHeader title="Theme" subtitle="Choose your preferred color scheme" />
        <div className="grid grid-cols-3 gap-3 mt-4">
          {THEME_OPTIONS.map(({ id, label, description, icon: Icon, swatches, preview }) => {
            const isActive = theme === id
            return (
              <button
                key={id}
                onClick={() => handleSelect(id)}
                className={clsx(
                  'relative flex flex-col items-center gap-3 p-4 rounded-2xl border text-center cursor-pointer',
                  'transition-all duration-200',
                  isActive
                    ? 'border-brand-violet/60 bg-brand-purple/10 ring-2 ring-brand-violet/30'
                    : 'border-dark-600/50 bg-dark-800/30 hover:border-dark-500 hover:bg-dark-700/40 hover:scale-[1.02]',
                  'active:scale-[0.97]'
                )}
              >
                {/* Theme preview swatch box */}
                <div className={clsx('w-full h-16 rounded-xl overflow-hidden relative border', isActive ? 'border-brand-violet/20' : 'border-white/5')}>
                  <div className={clsx('absolute inset-0', preview)} />
                  <div className="absolute inset-0 p-2 flex flex-col gap-1.5">
                    <div className="h-1.5 w-3/4 rounded-full opacity-20 bg-white" />
                    <div className="h-1 w-1/2 rounded-full opacity-10 bg-white" />
                    <div className="mt-auto flex gap-1">
                      {swatches.map((c, i) => (
                        <div key={i} className="h-3 flex-1 rounded-sm" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <p className={clsx('text-sm font-bold tracking-tight', isActive ? 'text-brand-violet' : 'text-white')}>{label}</p>
                  <p className="text-[10px] text-slate-500 leading-snug">{description}</p>
                </div>

                {/* Check indicator */}
                {(isActive || justChanged === id) && (
                  <div className={clsx(
                    'absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300',
                    justChanged === id ? 'bg-emerald-500 scale-110' : 'bg-brand-violet'
                  )}>
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
        <p className="mt-4 text-[11px] text-slate-600">
          Theme preference is saved to your browser and restored on next visit.
        </p>
      </Card>
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
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="font-display font-800 text-2xl text-white">Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your account and preferences.</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 p-1 bg-dark-800/60 border border-dark-600/50 rounded-xl w-fit flex-wrap">
        {SETTINGS_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              activeTab === tab ? 'bg-gradient-brand text-white shadow-brand' : 'text-slate-500 hover:text-slate-300'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Profile' && <ProfileTab user={user} />}
      {activeTab === 'Account' && <AccountTab />}
      {activeTab === 'Notifications' && <NotificationsTab />}
      {activeTab === 'Appearance' && <AppearanceTab />}
    </div>
  )
}
