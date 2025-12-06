"use client";

export function TalentCardSkeleton() {
  return (
    <div className="bg-white border border-[#E1E4EA] rounded-[12px] overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-[200px] bg-gray-200" />

      {/* Content Skeleton */}
      <div className="p-[16px] flex flex-col gap-[12px]">
        {/* Name Skeleton */}
        <div className="h-[16px] bg-gray-200 rounded w-3/4" />

        {/* Headline Skeleton */}
        <div className="h-[14px] bg-gray-200 rounded w-full" />
        <div className="h-[14px] bg-gray-200 rounded w-5/6" />

        {/* Location Skeleton */}
        <div className="h-[14px] bg-gray-200 rounded w-1/2" />

        {/* Stats Skeleton */}
        <div className="flex gap-[12px] pt-[8px]">
          <div className="h-[12px] bg-gray-200 rounded flex-1" />
          <div className="h-[12px] bg-gray-200 rounded flex-1" />
        </div>
      </div>
    </div>
  );
}

export function TalentGridSkeleton() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Result Count Skeleton */}
      <div className="flex-shrink-0 px-[25px] py-[12px] border-b border-[#E1E4EA]">
        <div className="h-[14px] bg-gray-200 rounded w-[120px] animate-pulse" />
      </div>

      {/* Grid Skeleton */}
      <div className="flex-1 overflow-y-auto scrollbar-styled px-[25px] py-[16px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[7px] pb-8">
          {Array.from({ length: 20 }).map((_, i) => (
            <TalentCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex-shrink-0 px-[25px] py-[16px] border-t border-[#E1E4EA] flex items-center justify-between">
        <div className="h-[36px] bg-gray-200 rounded w-[100px] animate-pulse" />
        <div className="h-[14px] bg-gray-200 rounded w-[60px] animate-pulse" />
        <div className="h-[36px] bg-gray-200 rounded w-[100px] animate-pulse" />
      </div>
    </div>
  );
}
