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

export function HiredTalentCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-[10px] border border-[#E5E7EB] bg-white flex-shrink-0">
      {/* Profile Section */}
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <Skeleton className="w-[42px] h-[42px] rounded-full flex-shrink-0" />
          <div className="flex-1 flex flex-col justify-center gap-2">
            <div className="flex flex-col gap-1">
              <Skeleton className="h-[13px] w-3/4" />
              <Skeleton className="h-[11px] w-1/2" />
            </div>
            <Skeleton className="h-[18px] w-[80px] rounded-full" />
          </div>
        </div>

        {/* Opportunities List */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-[12px] w-[100px]" />
          <div className="flex flex-col gap-1 p-2 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
            <Skeleton className="h-[11px] w-full" />
            <Skeleton className="h-[11px] w-2/3" />
          </div>
        </div>

        {/* Location */}
        <Skeleton className="h-[11px] w-3/4" />
      </div>

      {/* Actions Section */}
      <div className="flex flex-col gap-3 pt-2 border-t border-[#E5E7EB]">
        <Skeleton className="h-[36px] w-full rounded-[8px]" />
      </div>
    </div>
  );
}

export function HiredTalentsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <HiredTalentCardSkeleton key={i} />
      ))}
    </div>
  );
}
