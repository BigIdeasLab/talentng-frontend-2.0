"use client";

import { useRoleColors } from "@/lib/theme/RoleColorContext";

function Skeleton({ className, color }: { className?: string; color: string }) {
  return (
    <div
      className={`animate-pulse rounded ${className ?? ""}`}
      style={{ backgroundColor: color }}
    />
  );
}

function OpportunityCardSkeleton({ color }: { color: string }) {
  return (
    <div className="bg-white border border-[#E1E4EA] rounded-[12px] overflow-hidden animate-pulse p-[12px_10px] flex flex-col gap-[8px]">
      <div className="flex flex-col gap-[16px]">
        <div className="flex gap-[8px] items-start justify-between">
          <div className="flex gap-[8px] flex-1">
            <Skeleton className="w-[34px] h-[34px] rounded-full flex-shrink-0" color={color} />
            <div className="flex-1 flex flex-col gap-[8px]">
              <Skeleton className="h-[13px] w-3/4" color={color} />
              <Skeleton className="h-[12px] w-1/2" color={color} />
            </div>
          </div>
          <Skeleton className="w-[80px] h-[36px] rounded-full flex-shrink-0" color={color} />
        </div>

        <div className="flex items-center gap-[18px]">
          <Skeleton className="h-[12px] w-[80px] flex-shrink-0" color={color} />
          <Skeleton className="h-[12px] w-[100px] flex-shrink-0" color={color} />
          <Skeleton className="h-[12px] w-[120px] flex-shrink-0" color={color} />
        </div>
      </div>

      <div className="flex flex-col gap-[11px]">
        <div className="flex flex-col gap-[6px]">
          <Skeleton className="h-[13px] w-full" color={color} />
          <Skeleton className="h-[13px] w-5/6" color={color} />
        </div>

        <div className="flex flex-wrap gap-[4px]">
          <Skeleton className="h-[28px] rounded-full w-[80px]" color={color} />
          <Skeleton className="h-[28px] rounded-full w-[100px]" color={color} />
          <Skeleton className="h-[28px] rounded-full w-[70px]" color={color} />
        </div>
      </div>
    </div>
  );
}

export function OpportunitiesGridSkeleton() {
  const { light } = useRoleColors();

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-shrink-0 px-[25px] py-[12px] border-b border-[#E1E4EA]">
        <Skeleton className="h-[14px] w-[140px]" color={light} />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-styled px-[25px] py-[16px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[7px] pb-8">
          {Array.from({ length: 20 }).map((_, i) => (
            <OpportunityCardSkeleton key={i} color={light} />
          ))}
        </div>
      </div>

      <div className="flex-shrink-0 px-[25px] py-[16px] border-t border-[#E1E4EA] flex items-center justify-between">
        <Skeleton className="h-[36px] w-[100px]" color={light} />
        <Skeleton className="h-[14px] w-[80px]" color={light} />
        <Skeleton className="h-[36px] w-[100px]" color={light} />
      </div>
    </div>
  );
}
