"use client";

import { ROLE_COLORS } from "@/lib/theme/role-colors";

const color = ROLE_COLORS.recruiter.light;

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded ${className ?? ""}`}
      style={{ backgroundColor: color }}
    />
  );
}

export function TalentCardSkeleton() {
  return (
    <div className="bg-white border border-[#E1E4EA] rounded-[12px] overflow-hidden animate-pulse">
      <Skeleton className="w-full h-[200px] rounded-none" />
      <div className="p-[16px] flex flex-col gap-[12px]">
        <Skeleton className="h-[16px] w-3/4" />
        <Skeleton className="h-[14px] w-full" />
        <Skeleton className="h-[14px] w-5/6" />
        <Skeleton className="h-[14px] w-1/2" />
        <div className="flex gap-[12px] pt-[8px]">
          <Skeleton className="h-[12px] flex-1" />
          <Skeleton className="h-[12px] flex-1" />
        </div>
      </div>
    </div>
  );
}

export function TalentGridSkeleton() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-shrink-0 px-[25px] py-[12px] border-b border-[#E1E4EA]">
        <Skeleton className="h-[14px] w-[120px]" />
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-styled px-[25px] py-[16px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[7px] pb-8">
          {Array.from({ length: 20 }).map((_, i) => (
            <TalentCardSkeleton key={i} />
          ))}
        </div>
      </div>
      <div className="flex-shrink-0 px-[25px] py-[16px] border-t border-[#E1E4EA] flex items-center justify-between">
        <Skeleton className="h-[36px] w-[100px]" />
        <Skeleton className="h-[14px] w-[60px]" />
        <Skeleton className="h-[36px] w-[100px]" />
      </div>
    </div>
  );
}
