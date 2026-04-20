import React from 'react'
import { Card, Skeleton } from '../ui'

export const HackathonSkeleton = () => (
  <Card className="p-5 h-full space-y-4">
    <div className="flex justify-between">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-5 w-16" />
    </div>
    <Skeleton className="h-20 w-full" />
    <div className="flex gap-2">
      <Skeleton className="h-5 w-12" />
      <Skeleton className="h-5 w-12" />
    </div>
    <div className="grid grid-cols-2 gap-4 pt-2">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </div>
    <Skeleton className="h-10 w-full mt-4" />
  </Card>
)
