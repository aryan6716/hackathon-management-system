import React from 'react'
import { Card, Skeleton } from '../ui'

export const SubmissionSkeleton = () => (
  <Card className="p-7 h-full space-y-5 glass-card border border-white/10 backdrop-blur-xl">
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
