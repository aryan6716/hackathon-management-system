import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Github, Globe, Upload } from 'lucide-react'
import { Button, Input, Select } from '../ui'
import { useHackathons } from '../../hooks/useHackathons'
import { useSubmitProject } from '../../hooks/useSubmissions'
import clsx from 'clsx'

export function SubmitForm({ onClose }) {
  const [step, setStep] = useState(1)
  const { hackathons } = useHackathons()
  
  const hackathonOptions = [
    { value: '', label: 'Select hackathon...' }, 
    ...hackathons.map((event) => ({
      value: String(event.id || event.event_id),
      label: event.name || event.title || `Event ${event.id || event.event_id}`,
    }))
  ]

  const [form, setForm] = useState({
    hackathon: '', projectName: '', description: '', github: '', demo: '', techStack: ''
  })

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const { submitProject, loading, error, success } = useSubmitProject()

  const handleSubmit = async () => {
    const ok = await submitProject({
      event_id: parseInt(form.hackathon, 10),
      title: form.projectName,
      description: form.description,
      github_link: form.github,
      demo_link: form.demo
    })
    if (ok && onClose) setTimeout(() => onClose(), 3000)
  }

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
        <div className="w-20 h-20 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(16,185,129,0.15)]">
          <CheckCircle className="w-10 h-10 text-emerald-400" />
        </div>
        <h3 className="font-display font-800 text-white text-2xl mb-2 tracking-tight">Submission Successful</h3>
        <p className="text-sm font-medium text-gray-400 mb-8 max-w-sm mx-auto leading-relaxed">Your project has been submitted and is now under review.</p>
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
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">Step 1 · Project Details</p>
            <Select label="Target Hackathon" options={hackathonOptions} value={form.hackathon} onChange={e => update('hackathon', e.target.value)} />
            <Input label="Project Name" placeholder="e.g. Team Dashboard" value={form.projectName} onChange={e => update('projectName', e.target.value)} />
            <div className="space-y-2">
              <label htmlFor="submission-summary" className="block text-xs font-bold uppercase tracking-widest text-slate-400">Project Summary</label>
              <textarea
                id="submission-summary"
                placeholder="Describe what your project does..."
                value={form.description}
                onChange={e => update('description', e.target.value)}
                rows={4}
                className="w-full bg-dark-800/50 backdrop-blur-sm border border-glass-border rounded-xl px-4 py-3.5 text-sm text-slate-200 placeholder:text-slate-600 outline-none transition-all duration-200 focus:border-brand-violet/50 focus:ring-4 focus:ring-brand-violet/10 resize-none"
              />
            </div>
            <Button onClick={() => setStep(2)} disabled={!form.hackathon || !form.projectName} className="w-full mt-4 py-3.5 btn-premium-primary shadow-lg shadow-purple-500/30">
              Continue
            </Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-5">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">Step 2 · Links & Tech Stack</p>
            <Input label="Repository URL" placeholder="https://github.com/..." icon={Github} value={form.github} onChange={e => update('github', e.target.value)} />
            <Input label="Live Demo URL" placeholder="https://your-project.vercel.app" icon={Globe} value={form.demo} onChange={e => update('demo', e.target.value)} />
            <Input label="Tech Stack (comma separated)" placeholder="React, Node.js, Python..." value={form.techStack} onChange={e => update('techStack', e.target.value)} />
            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">{error}</p>
            )}
            <div className="flex gap-3 pt-4">
              <Button variant="secondary" onClick={() => setStep(1)} className="w-1/3">Back</Button>
              <Button onClick={handleSubmit} loading={loading} disabled={!form.github} className="flex-1 btn-premium-primary shadow-lg shadow-purple-500/30">
                <Upload className="w-4 h-4" /> Submit Project
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
