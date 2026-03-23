"use client";

/**
 * Profile-specific loading state with skeleton layout
 * Mimics the actual profile structure for better UX
 */
export function ProfileLoadingState() {
  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar Skeleton */}
      <div className="hidden lg:flex w-[350px] flex-col bg-white border-r border-[#E1E4EA] px-[25px] py-[15px] overflow-y-auto h-screen scrollbar-hide">
        {/* Profile Picture Skeleton */}
        <div className="flex flex-col items-center gap-[20px]">
          <div className="relative w-[110px] h-[110px]">
            <div className="w-full h-full bg-gray-200 rounded-full animate-pulse" />
          </div>

          {/* User Info Skeleton */}
          <div className="flex flex-col items-center gap-[12px] w-full">
            <div className="text-center space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
            </div>

            {/* Details Container Skeleton */}
            <div className="flex flex-col items-start gap-[10px] w-full">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex justify-between items-center w-full"
                >
                  <div className="flex items-center gap-[6px]">
                    <div className="w-[18px] h-[18px] bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills Section Skeleton */}
        <div className="mt-[20px] flex flex-col items-start gap-[12px] flex-shrink-0">
          <div className="h-3 bg-gray-200 rounded animate-pulse w-12" />
          <div className="flex flex-wrap gap-[6px] w-full">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="px-[10px] py-[6px] rounded-full bg-gray-200 animate-pulse"
              >
                <div className="h-3 w-16 bg-gray-300 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Stack Section Skeleton */}
        <div className="mt-[20px] flex flex-col items-start gap-[12px] flex-shrink-0">
          <div className="h-3 bg-gray-200 rounded animate-pulse w-10" />
          <div className="flex flex-wrap gap-[6px] w-full">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="px-[10px] py-[7px] rounded-full bg-gray-200 animate-pulse flex items-center gap-[5px]"
              >
                <div className="w-[16px] h-[16px] rounded-full bg-gray-300" />
                <div className="h-3 w-12 bg-gray-300 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area Skeleton */}
      <main className="flex-1 flex flex-col bg-white overflow-hidden">
        {/* Top Navigation Skeleton */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E1E4EA]">
          <div className="flex space-x-8">
            {["Works", "Services", "Recommendations", "About"].map((tab) => (
              <div
                key={tab}
                className="h-4 bg-gray-200 rounded animate-pulse w-16"
              />
            ))}
          </div>
        </div>

        {/* Content Section Skeleton */}
        <div className="flex-1 overflow-y-auto scrollbar-styled p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col space-y-3">
                {/* Image Skeleton */}
                <div className="w-full aspect-[4/3] bg-gray-200 rounded-lg animate-pulse" />

                {/* Content Skeleton */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                  <div className="flex space-x-2">
                    <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16" />
                    <div className="h-6 bg-gray-200 rounded-full animate-pulse w-12" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
