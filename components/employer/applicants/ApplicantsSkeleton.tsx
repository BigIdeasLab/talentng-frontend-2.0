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

function RowSkeleton() {
  return (
    <div className="grid grid-cols-[40px_1fr_80px_1.2fr_140px_120px_110px_1.3fr] gap-4 items-center py-2">
      {/* S/N */}
      <Skeleton className="h-[13px] w-[20px] mx-auto" />

      {/* Talent - Avatar + Name */}
      <div className="flex items-center gap-[8px]">
        <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
        <div className="flex flex-col gap-1 flex-1">
          <Skeleton className="h-[13px] w-3/4" />
          <Skeleton className="h-[12px] w-1/2" />
        </div>
      </div>

      {/* Hires */}
      <Skeleton className="h-[13px] w-[30px]" />

      {/* Opportunity */}
      <div className="flex flex-col gap-1">
        <Skeleton className="h-[12px] w-4/5" />
        <Skeleton className="h-[11px] w-1/2" />
      </div>

      {/* Location */}
      <Skeleton className="h-[13px] w-[100px]" />

      {/* Date Applied */}
      <Skeleton className="h-[13px] w-[80px]" />

      {/* Status */}
      <Skeleton className="h-[26px] w-[80px] rounded-[50px] mx-auto" />

      {/* Actions */}
      <div className="flex items-center justify-end gap-1">
        <Skeleton className="h-8 w-[100px] rounded-[50px]" />
        <Skeleton className="h-8 w-[70px] rounded-[50px]" />
      </div>
    </div>
  );
}

export function ApplicantsSkeleton() {
  return (
    <div className="h-screen overflow-x-hidden bg-white flex flex-col">
      {/* Header */}
      <div className="w-full px-[25px] pt-[19px] pb-[16px] border-b border-[#E1E4EA] flex-shrink-0">
        <div className="flex items-center justify-between mb-[19px]">
          <Skeleton className="h-[16px] w-[100px]" />
          <Skeleton className="h-[34px] w-[140px] rounded-[8px]" />
        </div>

        <div className="flex items-center gap-[8px] mb-[19px]">
          <Skeleton className="flex-1 max-w-[585px] h-[38px] rounded-[8px]" />
          <Skeleton className="h-[38px] w-[80px] rounded-[8px]" />
        </div>

        <div className="flex items-center gap-[8px]">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-[30px] w-[70px] rounded" />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-4 md:p-6">
          <div className="rounded-[16px] border border-[#E1E4EA] bg-white overflow-hidden">
            {/* Table Header */}
            <div className="px-[24px] py-[16px] border-b border-[#E1E4EA]">
              <div className="grid grid-cols-[40px_1fr_80px_1.2fr_140px_120px_110px_1.3fr] gap-4">
                {[
                  "S/N",
                  "Talents",
                  "Hires",
                  "Opportunity",
                  "Location",
                  "Date Applied",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <Skeleton key={h} className="h-[13px] w-[60px]" />
                ))}
              </div>
            </div>

            {/* Table Rows */}
            <div className="px-[24px] py-[19px] flex flex-col gap-[19px]">
              {Array.from({ length: 8 }).map((_, i) => (
                <RowSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
