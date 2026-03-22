import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Camera, Edit3, Save, Palette, Key, Check, Monitor, Moon, 
  User, Mail, Link as LinkIcon, Twitter, Github, Award, 
  Settings, Bell, Shield, Zap, Target, Activity, Sparkles,
  ArrowRight, Trophy, Star, Lock
} from 'lucide-react'
import { apiGet } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Card, Button, Badge, Avatar, Input, Skeleton } from '../components/ui'
import clsx from 'clsx'

const SKILLS = ['React', 'Python', 'ML/AI', 'Node.js', 'TypeScript']

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const { theme, setTheme } = useTheme()

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
      bio: 'Full-stack dev & ML enthusiast 🚀',
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
    <div className="p-6 space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-white">Profile Settings ⚙️</h1>
        <p className="text-slate-400">Manage your account</p>
      </div>

      {/* PROFILE CARD */}
      <Card className="p-8 rounded-2xl">

        {/* USER INFO */}
        <div className="flex items-center gap-6 mb-8">
          <Avatar name={user.name} size="xl" />
          <div>
            <h2 className="text-xl text-white font-bold">{form.name}</h2>
            <p className="text-slate-400">{user.email}</p>
            <Badge className="mt-2">{user.role || 'User'}</Badge>
          </div>
        </div>

        {/* SAVE MESSAGE */}
        <AnimatePresence>
          {saved && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-4 text-green-400"
            >
              ✔ Profile Saved
            </motion.div>
          )}
        </AnimatePresence>

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

        <textarea
          className="mt-6 w-full p-4 rounded-xl bg-slate-800 text-white"
          value={form.bio}
          onChange={(e) => update('bio', e.target.value)}
          disabled={!editing}
        />

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
              onClick={() => editing && toggleSkill(skill)}
              className={clsx(
                'px-4 py-2 rounded-xl border',
                form.skills.includes(skill)
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400'
              )}
            >
              {skill}
            </button>
          ))}
        </div>

        {/* ACTION BUTTON */}
        <div className="mt-8">
          <Button onClick={editing ? save : () => setEditing(true)}>
            {editing ? <><Save className="w-4 h-4 mr-2"/>Save</> : <><Edit3 className="w-4 h-4 mr-2"/>Edit</>}
          </Button>
        </div>
      </Card>

      {/* SECURITY */}
      <Card className="p-8 rounded-2xl">
        <h3 className="text-white font-bold mb-4">Security 🔐</h3>

        <Input label="Password" type="password" icon={Lock}/>
        <Button className="mt-4">
          <Key className="w-4 h-4 mr-2"/>Update Password
        </Button>
      </Card>

    </div>
  )
}