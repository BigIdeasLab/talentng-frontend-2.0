import { ROLE_COLORS } from "@/lib/theme/role-colors";

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded ${className ?? ""}`}
      style={{ backgroundColor: ROLE_COLORS.recruiter.light }}
    />
  );
}

function OpportunityCardSkeleton() {
  return (
    <div className="flex flex-col border border-[#E1E4EA] rounded-[16px] overflow-hidden bg-white">
      <div className="flex flex-col gap-4 p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
            <div className="flex flex-col gap-0.5">
              <Skeleton className="h-[12px] w-[80px]" />
              <Skeleton className="h-[11px] w-[60px]" />
            </div>
          </div>
          <Skeleton className="h-[24px] w-[70px] rounded-md" />
        </div>

        {/* Title */}
        <Skeleton className="h-[20px] w-3/4" />

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5">
          <Skeleton className="h-[14px] w-[50px]" />
          <Skeleton className="h-[14px] w-[70px]" />
          <Skeleton className="h-[14px] w-[60px]" />
        </div>

        {/* Rate and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-3 border-t border-[#E1E4EA]">
          <Skeleton className="h-[18px] w-[120px]" />
          <div className="sm:ml-auto">
            <Skeleton className="h-8 w-[100px] rounded-full" />
          </div>
        </div>
      </div>
      {/* Applicants Section Footer */}
      <div className="flex items-center gap-2 p-3 border-t border-[#E1E4EA]">
        <div className="flex -space-x-2.5">
          <Skeleton className="w-6 h-6 rounded-full border border-white" />
          <Skeleton className="w-6 h-6 rounded-full border border-white" />
          <Skeleton className="w-6 h-6 rounded-full border border-white" />
        </div>
        <Skeleton className="h-[12px] w-2/3" />
      </div>
    </div>
  );
}

export function OpportunitiesSkeleton() {
  return (
    <div className="h-screen overflow-y-auto overflow-x-hidden bg-white">
      <div className="w-full mx-auto px-3 py-5 md:px-5 md:py-6">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-[24px] w-[150px]" />
            <Skeleton className="h-[40px] w-[120px] rounded-lg" />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <Skeleton className="flex-1 h-[38px] rounded-lg" />
            <div className="flex gap-2">
              <Skeleton className="h-[38px] w-[80px] rounded-lg" />
              <Skeleton className="h-[38px] w-[120px] rounded-lg" />
            </div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="flex gap-4 mb-6 border-b border-[#E1E4EA] pb-2">
          <Skeleton className="h-[20px] w-[60px]" />
          <Skeleton className="h-[20px] w-[80px]" />
          <Skeleton className="h-[20px] w-[60px]" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <OpportunityCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
