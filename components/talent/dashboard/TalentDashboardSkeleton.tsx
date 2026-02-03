function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className ?? ""}`} />
  );
}

export function TalentDashboardSkeleton() {
  return (
    <div className="w-full min-h-screen bg-white p-4 md:p-6 lg:p-8">
      <div className="max-w-[1140px] mx-auto flex flex-col gap-7">
        {/* Welcome Header Skeleton */}
        <Skeleton className="w-full h-[140px] rounded-[20px]" />

        {/* Stat Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[120px] rounded-xl" />
          ))}
        </div>

        {/* Weekly Overview and Hiring Pipeline Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
          <Skeleton className="h-[340px] rounded-xl" />
          <Skeleton className="h-[340px] rounded-xl" />
        </div>

        {/* Recent Applications and Upcoming Interviews Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[280px] rounded-xl" />
          <Skeleton className="h-[280px] rounded-xl" />
        </div>

        {/* Top Skills Skeleton */}
        <Skeleton className="h-[200px] rounded-xl" />

        {/* Achievements Skeleton */}
        <Skeleton className="h-[160px] rounded-xl" />
      </div>
    </div>
  );
}
