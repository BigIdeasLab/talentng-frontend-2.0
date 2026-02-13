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

export function AvailabilitySkeleton() {
  return (
    <div className="h-screen overflow-x-hidden bg-white flex flex-col">
      {/* Header */}
      <div className="w-full px-[25px] pt-[19px] pb-[16px] border-b border-[#E1E4EA] flex-shrink-0">
        <Skeleton className="h-[16px] w-[100px]" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {/* Stats & Quick Actions */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-3">
            <Skeleton className="h-[40px] w-[120px] rounded-lg" />
            <Skeleton className="h-[40px] w-[130px] rounded-lg" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-[36px] w-[70px] rounded-lg" />
            <Skeleton className="h-[36px] w-[100px] rounded-lg" />
            <Skeleton className="h-[36px] w-[80px] rounded-lg" />
            <Skeleton className="h-[36px] w-[90px] rounded-lg" />
          </div>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-xl border border-[#E1E4EA] bg-white shadow-sm">
          {/* Settings Bar */}
          <div className="flex flex-wrap gap-4 border-b border-[#E1E4EA] bg-[#FAFAFA] px-5 py-4">
            <Skeleton className="h-[32px] w-[120px] rounded-md" />
            <Skeleton className="h-[32px] w-[100px] rounded-md" />
            <Skeleton className="h-[32px] w-[110px] rounded-md" />
            <Skeleton className="h-[32px] w-[200px] rounded-md" />
          </div>

          {/* Grid */}
          <div className="p-4">
            <div
              className="grid"
              style={{ gridTemplateColumns: "60px repeat(7, 1fr)" }}
            >
              {/* Header Row */}
              <div />
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className="border-b border-l border-[#E1E4EA] bg-[#FAFAFA] px-2 py-3 flex flex-col items-center gap-1"
                >
                  <Skeleton className="h-[14px] w-[30px]" />
                  <Skeleton className="h-[10px] w-[50px]" />
                </div>
              ))}

              {/* Time Rows */}
              {Array.from({ length: 16 }).map((_, timeIndex) => (
                <div key={timeIndex} className="contents">
                  <div
                    className="flex items-center justify-end pr-3"
                    style={{ height: "24px" }}
                  >
                    <Skeleton className="h-[11px] w-[35px]" />
                  </div>
                  {Array.from({ length: 7 }).map((_, dayIndex) => (
                    <div
                      key={dayIndex}
                      className="border-l border-b border-[#E1E4EA]"
                      style={{ height: "24px" }}
                    >
                      {(timeIndex + dayIndex) % 4 === 0 && (
                        <Skeleton className="h-full w-full rounded-none" />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-4">
          <Skeleton className="h-[14px] w-[60px]" />
          <Skeleton className="h-[14px] w-[80px]" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 border-t border-[#E1E4EA] bg-white px-6 py-4 flex items-center justify-between">
        <Skeleton className="h-[14px] w-[120px]" />
        <Skeleton className="h-[44px] w-[160px] rounded-[40px]" />
      </div>
    </div>
  );
}
