export interface DetailPageSkeletonProps {
  type: "talent" | "mentor" | "recruiter" | "opportunity";
}

export function DetailPageSkeleton({ type }: DetailPageSkeletonProps) {
  return (
    <div className="animate-pulse">
      {/* Profile Header Skeleton */}
      <div className="bg-white border-b border-[#F0F0F0] py-8">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gray-200" />
            
            {/* Info */}
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3" />
              <div className="h-6 bg-gray-200 rounded w-1/4" />
              <div className="flex gap-4">
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-4 bg-gray-200 rounded w-24" />
              </div>
            </div>

            {/* CTA Button */}
            <div className="h-12 bg-gray-200 rounded-full w-48" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-8">
        {type === "talent" && (
          <div className="space-y-8">
            {/* Gallery */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg" />
              ))}
            </div>

            {/* About */}
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded w-32" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-4/6" />
            </div>

            {/* Skills */}
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded w-32" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-8 bg-gray-200 rounded-full w-24" />
                ))}
              </div>
            </div>
          </div>
        )}

        {type === "mentor" && (
          <div className="grid md:grid-cols-[300px_1fr] gap-8">
            {/* Left Panel */}
            <div className="space-y-6">
              <div className="h-6 bg-gray-200 rounded w-32" />
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded w-full" />
                ))}
              </div>
            </div>

            {/* Right Content */}
            <div className="space-y-6">
              <div className="flex gap-4 border-b border-gray-200">
                <div className="h-10 bg-gray-200 rounded w-24" />
                <div className="h-10 bg-gray-200 rounded w-24" />
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
                <div className="h-4 bg-gray-200 rounded w-4/6" />
              </div>
            </div>
          </div>
        )}

        {type === "recruiter" && (
          <div className="space-y-8">
            {/* About */}
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded w-32" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>

            {/* Hiring For */}
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded w-32" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 bg-gray-200 rounded-full w-32" />
                ))}
              </div>
            </div>

            {/* Open Positions */}
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded w-32" />
              <div className="grid gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        )}

        {type === "opportunity" && (
          <div className="grid md:grid-cols-[1fr_350px] gap-8">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="h-6 bg-gray-200 rounded w-32" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
                <div className="h-4 bg-gray-200 rounded w-4/6" />
              </div>

              <div className="space-y-3">
                <div className="h-6 bg-gray-200 rounded w-48" />
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded w-full" />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Summary */}
            <div className="space-y-4">
              <div className="h-48 bg-gray-200 rounded-lg" />
              <div className="h-32 bg-gray-200 rounded-lg" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
