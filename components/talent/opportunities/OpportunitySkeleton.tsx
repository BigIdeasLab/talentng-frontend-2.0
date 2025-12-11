"use client";

export function OpportunityCardSkeleton() {
  return (
    <div className="bg-white border border-[#E1E4EA] rounded-[12px] overflow-hidden animate-pulse p-[12px_10px] flex flex-col gap-[8px]">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-[16px]">
        <div className="flex gap-[8px] items-start justify-between">
          {/* Avatar and Title */}
          <div className="flex gap-[8px] flex-1">
            <div className="w-[34px] h-[34px] bg-gray-200 rounded-full flex-shrink-0" />
            <div className="flex-1 flex flex-col gap-[8px]">
              <div className="h-[13px] bg-gray-200 rounded w-3/4" />
              <div className="h-[12px] bg-gray-200 rounded w-1/2" />
            </div>
          </div>
          {/* Button Skeleton */}
          <div className="w-[80px] h-[36px] bg-gray-200 rounded-full flex-shrink-0" />
        </div>

        {/* Stats Skeleton */}
        <div className="flex items-center gap-[18px]">
          <div className="h-[12px] bg-gray-200 rounded w-[80px] flex-shrink-0" />
          <div className="h-[12px] bg-gray-200 rounded w-[100px] flex-shrink-0" />
          <div className="h-[12px] bg-gray-200 rounded w-[120px] flex-shrink-0" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="flex flex-col gap-[11px]">
        {/* Description Skeleton */}
        <div className="flex flex-col gap-[6px]">
          <div className="h-[13px] bg-gray-200 rounded w-full" />
          <div className="h-[13px] bg-gray-200 rounded w-5/6" />
        </div>

        {/* Tags/Skills Skeleton */}
        <div className="flex flex-wrap gap-[4px]">
          <div className="h-[28px] bg-gray-200 rounded-full w-[80px]" />
          <div className="h-[28px] bg-gray-200 rounded-full w-[100px]" />
          <div className="h-[28px] bg-gray-200 rounded-full w-[70px]" />
        </div>
      </div>
    </div>
  );
}

export function OpportunitiesGridSkeleton() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Result Count Skeleton */}
      <div className="flex-shrink-0 px-[25px] py-[12px] border-b border-[#E1E4EA]">
        <div className="h-[14px] bg-gray-200 rounded w-[140px] animate-pulse" />
      </div>

      {/* Grid Skeleton */}
      <div className="flex-1 overflow-y-auto scrollbar-styled px-[25px] py-[16px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[7px] pb-8">
          {Array.from({ length: 20 }).map((_, i) => (
            <OpportunityCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex-shrink-0 px-[25px] py-[16px] border-t border-[#E1E4EA] flex items-center justify-between">
        <div className="h-[36px] bg-gray-200 rounded w-[100px] animate-pulse" />
        <div className="h-[14px] bg-gray-200 rounded w-[80px] animate-pulse" />
        <div className="h-[36px] bg-gray-200 rounded w-[100px] animate-pulse" />
      </div>
    </div>
  );
}
