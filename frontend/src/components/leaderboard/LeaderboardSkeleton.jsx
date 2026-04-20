import React from 'react'
import { Card, Skeleton } from '../ui'

export const LeaderboardSkeleton = () => (
  <div className="px-6 lg:px-10 py-6 space-y-8 pb-12">
    <div className="flex justify-between items-end">
        <div className="space-y-3">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-48" />
        </div>
    </div>
    <Card className="p-8 h-[350px] flex items-end justify-center gap-6">
        <Skeleton className="h-[180px] w-32 rounded-t-2xl" />
        <Skeleton className="h-[250px] w-40 rounded-t-2xl" />
        <Skeleton className="h-[150px] w-32 rounded-t-2xl" />
    </Card>
    <Card className="overflow-hidden">
        {[1,2,3,4,5].map(i => (
            <div key={i} className="flex items-center gap-4 px-6 py-5 border-b border-white/5">
                <Skeleton className="h-6 w-8" />
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-6 w-56 flex-1" />
                <Skeleton className="h-6 w-24 hidden sm:block" />
            </div>
        ))}
    </Card>
  </div>
)
