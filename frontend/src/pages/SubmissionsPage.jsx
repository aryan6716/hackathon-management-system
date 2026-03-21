import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, ExternalLink, Clock, CheckCircle, FileText, Plus, Github, Globe, AlertCircle, BarChart3, Zap } from 'lucide-react'
import { Card, Button, Input, Select, Badge, EmptyState, SectionHeader, Skeleton, Tag } from '../components/ui'
import { apiGet, apiPost } from '../utils/api'
import clsx from 'clsx'

const STATUS_MAP = {
  under_review: { variant: 'review', label: 'Under Review' },
  draft: { variant: 'draft', label: 'Draft' },
  scored: { variant: 'scored', label: 'Scored' },
}

const HACKATHON_OPTIONS = [
  { value: '', label: 'Select hackathon...' },
  { value: '1', label: 'BuildAI 2025' },
  { value: '2', label: 'GreenTech Sprint' },
  { value: '3', label: 'HealthHack Global' },
]

function SubmissionCard({ sub }) {
  const status = STATUS_MAP[sub.status] || STATUS_MAP.under_review
  
  return (
    <Card hover className="p-7 flex flex-col gap-5 group h-full relative overflow-hidden bg-dark-900/40">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-violet/10 blur-[50px] -mr-16 -mt-16 group-hover:bg-brand-violet/20 transition-colors pointer-events-none" />
      
      <div className="flex items-start justify-between gap-4 relative z-10">
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-800 text-white text-xl truncate tracking-tight transition-colors">
            {sub.project}
          </h3>
          <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            <Zap className="w-3.5 h-3.5 text-brand-accent drop-shadow-glow" />
            {sub.hackathon}
          </div>
        </div>
        <Badge variant={status.variant} className="shadow-sm">{status.label}</Badge>
      </div>

      <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 flex-1 relative z-10 font-medium">
        {sub.description || 'No description provided for this innovation.'}
      </p>

      <div className="flex flex-wrap gap-2 relative z-10">
        {(sub.techStack || ['Web3', 'AI']).map(t => <Tag key={t}>{t}</Tag>)}
      </div>

      <div className="flex flex-col gap-4 relative z-10 mt-2">
        <div className="flex items-center justify-between pt-5 border-t border-glass-border">
          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            <Clock className="w-3.5 h-3.5" />
            {sub.submittedAt
              ? <span>{new Date(sub.submittedAt).toLocaleDateString()}</span>
              : <span>Draft</span>
            }
          </div>
          {sub.score !== null ? (
            <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1.5 rounded-xl border border-emerald-500/20 shadow-inner">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-display font-800 text-emerald-400 text-sm tracking-tighter">{sub.score}</span>
            </div>
          ) : (
              <div className="flex items-center gap-1.5 bg-brand-violet/10 px-2.5 py-1.5 rounded-xl border border-brand-violet/20 shadow-inner">
                  <Clock className="w-3.5 h-3.5 text-brand-violet" />
                  <span className="font-display font-800 text-brand-violet text-[10px] uppercase">Pending</span>
              </div>
          )}
        </div>
        <Button variant="secondary" size="md" className="w-full">
          <ExternalLink className="w-4 h-4 mr-2" />
          {sub.status === 'draft' ? 'Resume Draft' : 'Launch Build'}
        </Button>
      </div>
    </Card>
  )
}

const SubmissionSkeleton = () => (
  <Card className="p-7 h-full space-y-5 bg-dark-900/40">
    <div className="flex justify-between items-start">
        <div className="space-y-3">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
    </div>
    <div className="flex gap-2 pt-2">
        <Skeleton className="h-6 w-16 !rounded-md" />
        <Skeleton className="h-6 w-16 !rounded-md" />
    </div>
    <div className="pt-5 border-t border-glass-border flex justify-between">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-7 w-16" />
    </div>
    <Skeleton className="h-11 w-full mt-2" />
  </Card>
)

function SubmitForm({ onClose }) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    hackathon: '', projectName: '', description: '', github: '', demo: '', techStack: ''
  })

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async () => {
    try {
      setLoading(true)
      await apiPost('/submissions', {
        event_id: parseInt(form.hackathon),
        name: form.projectName,
        description: form.description,
        github_link: form.github,
        demo_link: form.demo
      })
      setSuccess(true)
      if (onClose) setTimeout(() => onClose(), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
        <div className="w-20 h-20 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(16,185,129,0.15)]">
          <CheckCircle className="w-10 h-10 text-emerald-400" />
        </div>
        <h3 className="font-display font-800 text-white text-2xl mb-2 tracking-tight">Deployment Successful!</h3>
        <p className="text-sm font-medium text-slate-400 mb-8 max-w-sm mx-auto leading-relaxed">Your project is now in the review queue. We will notify your squad upon appraisal.</p>
        <Button variant="secondary" onClick={onClose} className="px-8 shadow-glass">Acknowledge</Button>
      </motion.div>
    )
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8">
        {[1, 2].map(s => (
          <React.Fragment key={s}>
            <div className={clsx(
              'w-8 h-8 rounded-full flex items-center justify-center text-xs font-display font-800 transition-all shadow-inner',
              step >= s
                ? 'bg-brand-violet text-white shadow-[0_0_15px_rgba(124,92,255,0.4)]'
                : 'bg-dark-800 text-slate-500 border border-glass-border'
            )}>
              {s}
            </div>
            {s < 2 && <div className={clsx('flex-1 h-1 rounded-full transition-all', step > s ? 'bg-brand-violet shadow-[0_0_10px_rgba(124,92,255,0.4)]' : 'bg-dark-800 border border-glass-border')} />}
          </React.Fragment>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-5">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">Phase 1 · Implementation Details</p>
            <Select label="Target Hackathon" options={HACKATHON_OPTIONS} value={form.hackathon} onChange={e => update('hackathon', e.target.value)} />
            <Input label="Project Designation" placeholder="e.g. NeuralDash" value={form.projectName} onChange={e => update('projectName', e.target.value)} />
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">Architecture Summary</label>
              <textarea
                placeholder="Describe your technical build in a few sentences..."
                value={form.description}
                onChange={e => update('description', e.target.value)}
                rows={4}
                className="w-full bg-dark-800/50 backdrop-blur-sm border border-glass-border rounded-xl px-4 py-3.5 text-sm text-slate-200 placeholder:text-slate-600 outline-none transition-all duration-200 focus:border-brand-violet/50 focus:ring-4 focus:ring-brand-violet/10 resize-none"
              />
            </div>
            <Button onClick={() => setStep(2)} disabled={!form.hackathon || !form.projectName} className="w-full mt-4 py-3.5">
              Proceed to Phase 2
            </Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-5">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">Phase 2 · Repository & Endpoints</p>
            <Input label="Source Repository" placeholder="https://github.com/..." icon={Github} value={form.github} onChange={e => update('github', e.target.value)} />
            <Input label="Live Environment URL" placeholder="https://your-project.vercel.app" icon={Globe} value={form.demo} onChange={e => update('demo', e.target.value)} />
            <Input label="Capabilities (comma separated)" placeholder="React, Node.js, Python..." value={form.techStack} onChange={e => update('techStack', e.target.value)} />
            <div className="flex gap-3 pt-4">
              <Button variant="secondary" onClick={() => setStep(1)} className="w-1/3">Revert</Button>
              <Button onClick={handleSubmit} loading={loading} disabled={!form.github} className="flex-1 shadow-[0_0_30px_rgba(124,92,255,0.3)] hover:shadow-[0_0_40px_rgba(124,92,255,0.5)]">
                <Upload className="w-4 h-4" /> Finalize Deployment
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" } }
}

export default function SubmissionsPage() {
  const [showForm, setShowForm] = useState(false)
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const data = await apiGet('/submissions')
        setSubmissions(data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setTimeout(() => setLoading(false), 400)
      }
    }
    fetchSubmissions()
  }, [])

  if (loading) {
    return (
      <div className="space-y-8 pb-12">
        <div className="flex justify-between items-end">
            <div className="space-y-3">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-4 w-72" />
            </div>
            <Skeleton className="h-12 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <SubmissionSkeleton key={i} />)}
        </div>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-12 relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-5 relative z-10">
        <div>
          <h1 className="font-display font-800 text-3xl sm:text-4xl text-white tracking-tight">Project Modules</h1>
          <p className="text-slate-400 text-sm mt-2 max-w-lg font-medium leading-relaxed">
            Manage your innovations. Track code reviews and deployment statuses seamlessly.
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
              onClick={() => setShowForm(p => !p)}
              variant={showForm ? 'secondary' : 'primary'}
              className="shadow-glow"
          >
            {showForm ? 'Abort Deployment' : <><Plus className="w-5 h-5 mr-1" /> Initialize Build</>}
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="overflow-hidden relative z-20"
          >
            <Card className="p-8 sm:p-12 shadow-[0_12px_60px_rgba(0,0,0,0.5)] relative bg-[#0B0F1A]/80 border-brand-violet/20">
              <div className="absolute top-0 right-0 w-80 h-80 bg-brand-violet/10 blur-[100px] -mr-40 -mt-40 pointer-events-none mix-blend-screen" />
              <SectionHeader title="Deployment Matrix" subtitle="Package your code and engage the judges" center className="mb-10" />
              <div className="relative z-10">
                <SubmitForm onClose={() => setShowForm(false)} />
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {submissions.length > 0 ? (
        <motion.div variants={listVariant} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {submissions.map(sub => (
            <motion.div variants={itemVariant} key={sub.id}>
              <SubmissionCard 
                sub={{
                  id: sub.id,
                  project: sub.name,
                  hackathon: `Event 00${sub.event_id}`,
                  description: sub.description,
                  status: sub.status || 'under_review',
                  techStack: sub.github_link ? ['Repository', 'Live Demo'] : ['Core', 'Framework'], 
                  submittedAt: sub.created_at,
                  score: sub.score || null
                }} 
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-16 text-center shadow-glass border-glass-border bg-dark-900/40 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-radial-purple opacity-20 pointer-events-none bg-[length:100%_100%] group-hover:opacity-40 transition-opacity duration-1000" />
            <EmptyState
              icon={Globe}
              title="No Deployments Found"
              description="Your staging environment is barren. Construct an application and submit your architecture to the network."
              action={() => setShowForm(true)}
              actionLabel="Initialize Build"
            />
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}
