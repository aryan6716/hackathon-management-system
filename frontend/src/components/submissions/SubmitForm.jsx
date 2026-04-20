import React, { useState } from 'react'
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
    return (
      <div className="text-center py-10">
        <div className="w-16 h-16 rounded-full bg-emerald-900/50 border border-emerald-700 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Submission Successful</h3>
        <p className="text-sm text-gray-400 mb-8 max-w-sm mx-auto">Your project has been submitted and is now under review.</p>
        <Button onClick={onClose} className="px-8">Acknowledge</Button>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8">
        {[1, 2].map(s => (
          <React.Fragment key={s}>
            <div className={clsx(
              'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all',
              step >= s
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-500 border border-gray-700'
            )}>
              {s}
            </div>
            {s < 2 && <div className={clsx('flex-1 h-1 rounded-full transition-all', step > s ? 'bg-indigo-600' : 'bg-gray-800')} />}
          </React.Fragment>
        ))}
      </div>

      <div>
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Step 1 · Project Details</p>
            <Select label="Target Hackathon" options={hackathonOptions} value={form.hackathon} onChange={e => update('hackathon', e.target.value)} />
            <Input label="Project Name" placeholder="e.g. Team Dashboard" value={form.projectName} onChange={e => update('projectName', e.target.value)} />
            <div className="space-y-1">
              <label htmlFor="submission-summary" className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Project Summary</label>
              <textarea
                id="submission-summary"
                placeholder="Describe what your project does..."
                value={form.description}
                onChange={e => update('description', e.target.value)}
                rows={4}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder:text-gray-500 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
              />
            </div>
            <Button onClick={() => setStep(2)} disabled={!form.hackathon || !form.projectName} className="w-full mt-2 py-3">
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Step 2 · Links & Tech Stack</p>
            <Input label="Repository URL" placeholder="https://github.com/..." icon={Github} value={form.github} onChange={e => update('github', e.target.value)} />
            <Input label="Live Demo URL" placeholder="https://your-project.vercel.app" icon={Globe} value={form.demo} onChange={e => update('demo', e.target.value)} />
            <Input label="Tech Stack (comma separated)" placeholder="React, Node.js, Python..." value={form.techStack} onChange={e => update('techStack', e.target.value)} />
            {error && (
              <p className="text-sm text-red-200 bg-red-900/50 border border-red-800 rounded-lg p-3">{error}</p>
            )}
            <div className="flex gap-3 pt-4">
              <Button variant="secondary" onClick={() => setStep(1)} className="w-1/3">Back</Button>
              <Button onClick={handleSubmit} loading={loading} disabled={!form.github} className="flex-1">
                <Upload className="w-4 h-4 mr-2" /> Submit Project
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
