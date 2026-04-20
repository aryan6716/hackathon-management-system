import React, { useState, useEffect } from 'react'
import { Edit3, Save, Key, User, Mail, Link as LinkIcon, Twitter, Github, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Card, Button, Badge, Avatar, Input, Skeleton } from '../components/ui'
import clsx from 'clsx'

const SKILLS = ['React', 'Python', 'ML/AI', 'Node.js', 'TypeScript']

export default function ProfilePage() {
  const { user, updateUser } = useAuth()

  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState({
    name: '',
    bio: '',
    github: '',
    website: '',
    twitter: '',
    skills: []
  })

  // ✅ SAFE LOAD USER
  useEffect(() => {
    if (!user) return
    setForm({
      name: user.name || '',
      bio: 'Full-stack developer and hackathon participant.',
      github: '',
      website: '',
      twitter: '',
      skills: ['React']
    })
    setLoading(false)
  }, [user])

  // ✅ SAFE LOADING (PREVENT CRASH)
  if (!user || loading) {
    return (
      <div className="p-10">
        <Skeleton className="h-40 w-full rounded-2xl mb-6" />
        <Skeleton className="h-60 w-full rounded-2xl" />
      </div>
    )
  }

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const save = async () => {
    updateUser({ name: form.name })
    setSaved(true)
    setEditing(false)
    setTimeout(() => setSaved(false), 2000)
  }

  const toggleSkill = (skill) => {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  return (
    <div className="px-6 lg:px-10 py-6 space-y-8 pb-12">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-100 tracking-tight">Profile Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your account details and preferences.</p>
      </div>

      {/* PROFILE CARD */}
      <Card className="p-6 md:p-8 border border-gray-800 bg-gray-900">

        {/* USER INFO */}
        <div className="flex items-center gap-6 mb-8">
          <Avatar name={user.name} size="xl" />
          <div>
            <h2 className="text-2xl text-white font-display font-800 mb-1">{form.name}</h2>
            <p className="text-gray-400">{user.email}</p>
            <Badge className="mt-2">{user.role || 'User'}</Badge>
          </div>
        </div>

        {/* SAVE MESSAGE */}
        {saved && (
          <div className="mb-6 p-4 bg-emerald-900/40 border border-emerald-800 text-emerald-400 rounded-xl text-sm font-medium flex items-center justify-center flex-1">
            Profile updated successfully.
          </div>
        )}

        {/* INPUTS */}
        <div className="grid md:grid-cols-2 gap-6">
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            disabled={!editing}
            icon={User}
          />
          <Input
            label="Email"
            value={user.email || ''}
            disabled
            icon={Mail}
          />
        </div>

        <div className="mt-6 space-y-2">
            <label htmlFor="profile-bio" className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Bio</label>
            <textarea
              id="profile-bio"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder:text-gray-500 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
              value={form.bio}
              onChange={(e) => update('bio', e.target.value)}
              disabled={!editing}
              rows={4}
            />
        </div>

        {/* SOCIAL */}
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <Input label="Github" value={form.github} onChange={(e)=>update('github', e.target.value)} icon={Github} disabled={!editing}/>
          <Input label="Website" value={form.website} onChange={(e)=>update('website', e.target.value)} icon={LinkIcon} disabled={!editing}/>
          <Input label="Twitter" value={form.twitter} onChange={(e)=>update('twitter', e.target.value)} icon={Twitter} disabled={!editing}/>
        </div>

        {/* SKILLS */}
        <div className="mt-6 flex flex-wrap gap-3">
          {SKILLS.map(skill => (
            <button
              key={skill}
              type="button"
              onClick={() => editing && toggleSkill(skill)}
              aria-pressed={form.skills.includes(skill)}
              aria-label={`Toggle ${skill} skill`}
              className={clsx(
                'px-4 py-2 rounded-xl border text-sm font-medium transition-colors',
                form.skills.includes(skill)
                  ? 'bg-purple-600/20 border-purple-500/30 text-purple-300'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
              )}
            >
              {skill}
            </button>
          ))}
        </div>

        {/* ACTION BUTTON */}
        <div className="mt-8">
          <Button onClick={editing ? save : () => setEditing(true)} className="px-8">
            {editing ? <><Save className="w-4 h-4 mr-2"/>Save</> : <><Edit3 className="w-4 h-4 mr-2"/>Edit</>}
          </Button>
        </div>
      </Card>

      {/* SECURITY */}
      <Card className="p-6 md:p-8 border border-gray-800 bg-gray-900">
        <h3 className="text-gray-100 font-semibold text-xl mb-6">Security</h3>

        <Input label="Password" type="password" icon={Lock} disabled />
        <Button className="mt-6" disabled variant="secondary">
          <Key className="w-4 h-4 mr-2"/>Not Available Yet
        </Button>
      </Card>

    </div>
  )
}
