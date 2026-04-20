import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, ExternalLink, Clock, CheckCircle, Plus, Github, Globe, BarChart3, Zap } from 'lucide-react'
import { Card, Button, Input, Select, Badge, EmptyState, SectionHeader, Skeleton, Tag } from '../components/ui'
import { apiGet, apiPost } from '../utils/api'
import clsx from 'clsx'
import { useSubmissions, useSubmitProject } from '../hooks/useSubmissions'
import { useHackathons } from '../hooks/useHackathons'

import { SubmissionCard } from '../components/submissions/SubmissionCard'
import { SubmissionSkeleton } from '../components/submissions/SubmissionSkeleton'
import { SubmitForm } from '../components/submissions/SubmitForm'

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
  const { submissions, loading, error } = useSubmissions()

  if (loading) {
    return (
      <div className="px-6 lg:px-10 py-6 space-y-8 pb-12">
        <div className="flex justify-between items-end">
            <div className="space-y-3">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-4 w-72" />
            </div>
            <Skeleton className="h-12 w-48" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1,2,3,4,5,6].map(i => <SubmissionSkeleton key={i} />)}
        </div>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6 lg:px-10 py-6 space-y-8 pb-12 relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-5 relative z-10">
        <div>
          <h1 className="font-display font-800 text-3xl sm:text-4xl tracking-tight bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Submissions</h1>
          <p className="text-gray-400 text-sm mt-2 max-w-lg font-medium leading-relaxed">
            Submit and track your hackathon projects in one place.
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
              onClick={() => setShowForm(p => !p)}
              variant={showForm ? 'secondary' : 'primary'}
              className={clsx(showForm ? '' : 'btn-premium-primary shadow-lg shadow-purple-500/30')}
          >
            {showForm ? 'Close Form' : <><Plus className="w-5 h-5 mr-1" /> New Submission</>}
          </Button>
        </motion.div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl backdrop-blur-md">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium">{error}</p>
            <button type="button" onClick={() => window.location.reload()} className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition">Retry</button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="overflow-hidden relative z-20"
          >
            <Card className="p-8 sm:p-12 shadow-[0_12px_60px_rgba(0,0,0,0.5)] relative bg-[#0B0F1A]/80 border border-white/10 glass-card backdrop-blur-xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 blur-3xl -mr-40 -mt-40 pointer-events-none" />
              <SectionHeader title="Create Submission" subtitle="Add your project details and repository link" center className="mb-10" />
              <div className="relative z-10">
                <SubmitForm onClose={() => setShowForm(false)} />
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {submissions.length > 0 ? (
        <motion.div variants={listVariant} initial="hidden" animate="show" className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 relative z-10">
          {submissions.map(sub => (
            <motion.div variants={itemVariant} key={sub.id}>
              <SubmissionCard 
                sub={{
                  id: sub.id,
                  project: sub.title || sub.name,
                  hackathon: sub.event_name || `Event 00${sub.event_id}`,
                  description: sub.description,
                  status: sub.status || 'under_review',
                  techStack: sub.github_link ? ['Repository', 'Live Demo'] : ['Core', 'Framework'], 
                  submittedAt: sub.submitted_at || sub.created_at,
                  score: sub.avg_score ?? sub.score ?? null,
                  githubLink: sub.github_link || ''
                }} 
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="glass-card border border-white/10 backdrop-blur-xl rounded-2xl flex flex-col items-center justify-center text-center py-16 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-radial-purple opacity-20 pointer-events-none bg-[length:100%_100%] group-hover:opacity-40 transition-opacity duration-1000" />
            <div className="mb-4 p-4 rounded-xl bg-white/5 relative z-10">
              <Globe className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="font-display font-800 text-white text-xl tracking-tight mb-2 relative z-10">No Submissions Yet</h3>
            <p className="text-sm font-medium text-slate-400 mb-6 max-w-sm mx-auto relative z-10">You have not submitted a project yet. Add your first submission to start getting reviews.</p>
            <Button onClick={() => setShowForm(true)} className="btn-premium-primary shadow-lg shadow-purple-500/30 relative z-10">
              Create Submission
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
