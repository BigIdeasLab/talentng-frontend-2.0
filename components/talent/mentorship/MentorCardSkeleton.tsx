import { ROLE_COLORS } from "@/lib/theme/role-colors";

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded ${className ?? ""}`}
      style={{ backgroundColor: ROLE_COLORS.talent.light }}
    />
  );
}

export function MentorCardSkeleton() {
  return (
    <div className="flex flex-col gap-2.5 p-1.5 rounded-xl bg-[#F5F5F5]">
      <Skeleton className="w-full aspect-[261/190] rounded-xl" />

      <div className="flex flex-col gap-3.5">
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-[13px] w-3/4 rounded" />
            <Skeleton className="h-[12px] w-1/2 rounded" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-[12px] w-[120px] rounded" />
            <Skeleton className="h-[12px] w-[160px] rounded" />
          </div>
        </div>

        <div className="flex items-start gap-1">
          <Skeleton className="flex-1 h-[40px] rounded-full" />
          <Skeleton className="h-[40px] w-[40px] rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function MentorGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1.5 md:gap-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <MentorCardSkeleton key={i} />
      ))}
    </div>
  );
}
