import { ROLE_COLORS } from "@/lib/theme/role-colors";

function Sk({ className, color }: { className?: string; color: string }) {
  return (
    <div
      className={`animate-pulse rounded ${className ?? ""}`}
      style={{ backgroundColor: color }}
    />
  );
}

interface ProfileSkeletonProps {
  role?: "talent" | "recruiter" | "mentor";
}

export function ProfileSkeleton({ role = "talent" }: ProfileSkeletonProps) {
  const color = ROLE_COLORS[role].light;

  return (
    <div className="flex flex-col h-full bg-white md:flex-row">
      {/* Sidebar Skeleton */}
      <div className="hidden lg:flex w-[350px] flex-col bg-white border-r border-[#E1E4EA] px-[25px] py-[15px] overflow-y-auto h-screen">
        {/* Profile Image */}
        <div className="flex flex-col items-center gap-[20px]">
          <Sk className="w-[110px] h-[110px] rounded-full" color={color} />

          {/* Name */}
          <div className="flex flex-col items-center gap-[12px] w-full">
            <Sk className="h-4 w-32" color={color} />
            <Sk className="h-3 w-24" color={color} />
          </div>

          {/* Details */}
          <div className="flex flex-col items-start gap-[10px] w-full">
            <div className="flex items-center gap-[6px] w-full">
              <Sk className="w-[18px] h-[18px]" color={color} />
              <Sk className="h-3 flex-1" color={color} />
            </div>
            <div className="flex items-center gap-[6px] w-full">
              <Sk className="w-[18px] h-[18px]" color={color} />
              <Sk className="h-3 flex-1" color={color} />
            </div>
            <div className="flex items-center gap-[6px] w-full">
              <Sk className="w-[18px] h-[18px]" color={color} />
              <Sk className="h-3 flex-1" color={color} />
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <Sk className="w-full mt-[15px] h-[40px] rounded-full" color={color} />

        {/* Visibility Toggle */}
        <div className="flex justify-between items-center w-full mt-[10px]">
          <div className="flex flex-col gap-1">
            <Sk className="h-3 w-24" color={color} />
            <Sk className="h-2 w-20" color={color} />
          </div>
          <Sk className="w-10 h-5 rounded-full" color={color} />
        </div>

        {/* Social Links */}
        <div className="mt-[20px] flex flex-col items-start gap-[12px]">
          <Sk className="h-3 w-20" color={color} />
          <div className="flex flex-col gap-[10px] w-full">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between items-center w-full">
                <div className="flex items-center gap-[6px]">
                  <Sk className="w-4 h-4" color={color} />
                  <Sk className="h-3 w-16" color={color} />
                </div>
                <Sk className="w-4 h-4" color={color} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <main className="flex-1 flex flex-col bg-white h-screen overflow-hidden">
        {/* Navigation Tabs */}
        <div className="h-[56px] border-b border-[#E1E4EA] flex items-center justify-between px-3 md:px-5">
          <div className="flex gap-5">
            {[1, 2, 3].map((i) => (
              <Sk key={i} className="h-8 w-24" color={color} />
            ))}
          </div>
          <Sk className="h-10 rounded-full w-32" color={color} />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-3 md:p-4 lg:p-5">
          <div className="max-w-[700px] flex flex-col gap-7">
            {/* Section 1 */}
            <div className="flex flex-col gap-4">
              <Sk className="h-6 w-32" color={color} />
              <div className="flex flex-col gap-3">
                <Sk className="h-4 w-full" color={color} />
                <Sk className="h-4 w-full" color={color} />
                <Sk className="h-4 w-3/4" color={color} />
              </div>
            </div>

            {/* Section 2 */}
            <div className="flex flex-col gap-4">
              <Sk className="h-6 w-40" color={color} />
              <div className="flex flex-col gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center px-3 py-2.5 rounded-[8px] border border-[#E1E4EA]"
                  >
                    <Sk className="h-4 w-24" color={color} />
                    <Sk className="h-4 w-32" color={color} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
