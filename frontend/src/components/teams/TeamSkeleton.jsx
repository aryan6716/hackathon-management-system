import React from 'react'
import { Card, Skeleton } from '../ui'

export const TeamSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2 space-y-6">
      <Card className="p-8 space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-6 w-40 rounded-full" />
          </div>
          <Skeleton className="h-12 w-32" />
        </div>
        <div className="pt-6 border-t border-glass-border">
            <Skeleton className="h-7 w-48 mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[1,2,3,4].map(i => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}
            </div>
        </div>
      </Card>
    </div>
    <div className="space-y-6">
      <Card className="p-8 space-y-5">
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-12 w-full" />
      </Card>
    </div>
  </div>
)
