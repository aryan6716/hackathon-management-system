import React, { useState, useEffect } from 'react'
import { Upload, ExternalLink, Clock, CheckCircle, Plus, Github, Globe, BarChart3, Zap } from 'lucide-react'
import { Card, Button, Input, Select, Badge, EmptyState, SectionHeader, Skeleton, Tag } from '../components/ui'
import { apiGet, apiPost } from '../utils/api'
import clsx from 'clsx'
import { useSubmissions, useSubmitProject } from '../hooks/useSubmissions'
import { useHackathons } from '../hooks/useHackathons'

import { SubmissionCard } from '../components/submissions/SubmissionCard'
import { SubmissionSkeleton } from '../components/submissions/SubmissionSkeleton'
import { SubmitForm } from '../components/submissions/SubmitForm'
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
    <div className="px-6 lg:px-10 py-6 space-y-8 pb-12 relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-100 tracking-tight">Submissions</h1>
          <p className="text-gray-400 text-sm mt-1 max-w-lg">
            Submit and track your hackathon projects in one place.
          </p>
        </div>
        <div>
          <Button 
              onClick={() => setShowForm(p => !p)}
              variant={showForm ? 'secondary' : 'primary'}
          >
            {showForm ? 'Close Form' : <><Plus className="w-5 h-5 mr-1" /> New Submission</>}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl backdrop-blur-md">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium">{error}</p>
            <button type="button" onClick={() => window.location.reload()} className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition">Retry</button>
          </div>
        </div>
      )}

      {showForm && (
        <div className="mt-4">
          <Card className="p-6 sm:p-8 bg-gray-900 border border-gray-800">
            <SectionHeader title="Create Submission" subtitle="Add your project details and repository link" center className="mb-6" />
            <div>
              <SubmitForm onClose={() => setShowForm(false)} />
            </div>
          </Card>
        </div>
      )}

      {submissions.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-6">
          {submissions.map(sub => (
            <div key={sub.id}>
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
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 border border-gray-800 bg-gray-900 rounded-lg flex flex-col items-center justify-center text-center py-16">
          <div className="mb-4">
            <Globe className="w-12 h-12 text-gray-500" />
          </div>
          <h3 className="text-xl font-medium text-gray-200 mb-2">No Submissions Yet</h3>
          <p className="text-sm text-gray-400 mb-6 max-w-sm mx-auto">You have not submitted a project yet. Add your first submission to start getting reviews.</p>
          <Button onClick={() => setShowForm(true)}>
            Create Submission
          </Button>
        </div>
      )}
    </div>
  )
}
