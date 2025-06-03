import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted relative overflow-hidden", className)}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  )
}

function SkeletonCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-4 space-y-3 border rounded-lg bg-white animate-pulse", className)} {...props}>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  )
}

function SkeletonChart({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6 space-y-4 border rounded-lg bg-white", className)} {...props}>
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-64 w-full" />
        <div className="flex justify-center space-x-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  )
}

function SkeletonSummaryCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-4 space-y-3 border rounded-lg bg-white animate-pulse", className)} {...props}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-3 w-32" />
    </div>
  )
}

function SkeletonTransaction({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center justify-between p-3 rounded-lg border bg-white animate-pulse", className)} {...props}>
      <div className="flex items-center space-x-3 flex-1">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-32" />
          <div className="flex space-x-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>
      <Skeleton className="h-5 w-16" />
    </div>
  )
}

function SkeletonList({ count = 5, className, ...props }: { count?: number } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonTransaction key={i} />
      ))}
    </div>
  )
}

function SkeletonDashboard() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }, (_, i) => (
          <SkeletonSummaryCard key={i} style={{ animationDelay: `${i * 100}ms` }} />
        ))}
      </div>
      
      {/* Chart and Transactions Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2" style={{ animationDelay: '400ms' }}>
          <SkeletonChart />
        </div>
        <div style={{ animationDelay: '500ms' }}>
          <div className="border rounded-lg bg-white p-6">
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-5 w-8" />
            </div>
            <SkeletonList count={6} />
          </div>
        </div>
      </div>
    </div>
  )
}

export { 
  Skeleton, 
  SkeletonCard, 
  SkeletonChart, 
  SkeletonSummaryCard, 
  SkeletonTransaction,
  SkeletonList,
  SkeletonDashboard
}
