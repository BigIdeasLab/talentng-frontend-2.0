function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className ?? ""}`} />
  );
}

export function MentorDashboardSkeleton() {
  return (
    <div className="px-4 py-6 md:px-8 md:py-7 flex flex-col gap-5 h-full overflow-y-auto scrollbar-styled">
      {/* Hero Section Skeleton */}
      <Skeleton className="w-full h-[105px] rounded-2xl flex-shrink-0" />

      {/* Stat Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 flex-shrink-0">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[95px] rounded-lg" />
        ))}
      </div>

      {/* Weekly Overview and Hiring Pipeline Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-[5fr_3fr] gap-4 flex-shrink-0">
        <Skeleton className="h-[270px] rounded-lg" />
        <Skeleton className="h-[270px] rounded-lg" />
      </div>

      {/* Upcoming Sessions and Mentee Progress Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-shrink-0">
        <Skeleton className="h-[220px] rounded-lg" />
        <Skeleton className="h-[220px] rounded-lg" />
      </div>

      {/* Recent Reviews Skeleton */}
      <Skeleton className="h-[160px] rounded-lg flex-shrink-0" />

      {/* Achievements Skeleton */}
      <Skeleton className="h-[130px] rounded-lg flex-shrink-0" />
    </div>
  );
}
