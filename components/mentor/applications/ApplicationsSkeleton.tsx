import { ROLE_COLORS } from "@/lib/theme/role-colors";

const color = ROLE_COLORS.mentor.light;

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded ${className ?? ""}`}
      style={{ backgroundColor: color }}
    />
  );
}

function CardSkeleton() {
  return (
    <div className="flex flex-col border border-[#E1E4EA] rounded-[16px] bg-white">
      <div className="flex flex-col gap-3.5 px-4 pt-4 pb-3">
        {/* Header - Avatar + Info + Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-[13px] w-[120px]" />
              <Skeleton className="h-[12px] w-[160px]" />
            </div>
          </div>
          <Skeleton className="h-[26px] w-[70px] rounded-md" />
        </div>

        {/* Topic */}
        <Skeleton className="h-[15px] w-3/4" />

        {/* Message */}
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-[13px] w-full" />
          <Skeleton className="h-[13px] w-4/5" />
        </div>

        {/* Detail pills */}
        <div className="flex items-center gap-1 flex-wrap">
          <Skeleton className="h-[32px] w-[140px] rounded-[24px]" />
          <Skeleton className="h-[32px] w-[90px] rounded-[24px]" />
          <Skeleton className="h-[32px] w-[100px] rounded-[24px]" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end px-4 py-2.5 border-t border-[#E1E4EA]">
        <div className="flex items-center gap-1">
          <Skeleton className="h-8 w-[80px] rounded-[40px]" />
          <Skeleton className="h-8 w-[80px] rounded-[40px]" />
        </div>
      </div>
    </div>
  );
}

export function ApplicationsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-[7px]">
      {Array.from({ length: 4 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
