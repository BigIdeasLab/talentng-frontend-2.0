"use client";

export function WorksGridSkeleton() {
  return (
    <div className="w-full px-[20px] py-[20px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[15px] auto-rows-max">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="w-full rounded-lg bg-gray-200 animate-pulse"
            style={{ aspectRatio: "4/3" }}
          />
        ))}
      </div>
    </div>
  );
}

export function ProfilePanelSkeleton() {
  return (
    <div className="hidden lg:flex h-screen overflow-hidden flex-col gap-6 p-6">
      {/* Profile Image Skeleton */}
      <div className="w-[120px] h-[120px] rounded-full bg-gray-200 animate-pulse mx-auto" />

      {/* Name Skeleton */}
      <div className="h-6 bg-gray-200 animate-pulse rounded w-3/4 mx-auto" />

      {/* Headline Skeleton */}
      <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3 mx-auto" />

      {/* Stats Skeleton */}
      <div className="flex gap-4 justify-center">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="flex flex-col gap-2">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-16" />
            <div className="h-5 bg-gray-200 animate-pulse rounded w-12" />
          </div>
        ))}
      </div>

      {/* Skills Skeleton */}
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="h-8 bg-gray-200 animate-pulse rounded-full w-20"
          />
        ))}
      </div>
    </div>
  );
}

export function GridContentSkeleton() {
  return (
    <div className="w-full px-[20px] py-[20px]">
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="h-16 bg-gray-200 animate-pulse rounded-lg"
          />
        ))}
      </div>
    </div>
  );
}
