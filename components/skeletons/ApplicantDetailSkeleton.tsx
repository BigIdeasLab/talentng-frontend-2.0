"use client";

export const ApplicantDetailSkeleton = () => {
  return (
    <div className="h-screen bg-white overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto px-[16px] md:px-[40px] py-[24px]">
        <div className="max-w-full flex flex-col gap-[25px]">
          {/* Back Button Skeleton */}
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />

          {/* Profile Card Skeleton */}
          <div className="flex flex-col gap-[18px]">
            <div className="flex flex-col gap-[18px] p-[18px] rounded-[10px] border border-[#E1E4EA] bg-white">
              {/* Profile Header */}
              <div className="flex items-start justify-between gap-[10px]">
                <div className="flex items-center gap-[10px]">
                  {/* Avatar Skeleton */}
                  <div className="w-[59px] h-[59px] rounded-full bg-gray-200 animate-pulse flex-shrink-0" />

                  <div className="flex flex-col justify-center gap-[10px] flex-1">
                    {/* Name Skeleton */}
                    <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
                    {/* Headline Skeleton */}
                    <div className="h-4 w-56 bg-gray-200 rounded animate-pulse" />
                    {/* Status Badge Skeleton */}
                    <div className="h-5 w-24 bg-gray-200 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Stats Section Skeleton */}
              <div className="flex items-center justify-between py-[18px] pr-[18px] border-t border-b border-[#E1E4EA]">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-[6px]">
                    <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
                    <div className="flex flex-col gap-[4px]">
                      <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Opportunity Info Skeleton */}
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-[10px] flex-1">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="h-5 w-64 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Interview Section Skeleton */}
          <div className="flex flex-col gap-[18px] p-[18px] rounded-[10px] border border-[#E1E4EA] bg-white">
            <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
            <div className="flex flex-col gap-[12px]">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-12 w-full bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Proposal Section Skeleton */}
          <div className="flex flex-col gap-[18px] p-[18px] pt-[23px] rounded-[10px] border border-[#E1E4EA] bg-white">
            <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="p-[18px_12px] rounded-[8px] border border-[#E1E4EA] bg-[#F5F5F5]">
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Projects Section Skeleton */}
          <div className="flex flex-col gap-[18px] p-[18px] pt-[23px] rounded-[10px] border border-[#E1E4EA] bg-white">
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="flex items-center gap-[4px]">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-[210px] h-[160px] bg-gray-200 rounded-[12px] animate-pulse flex-shrink-0"
                />
              ))}
            </div>
          </div>

          {/* Actions Section Skeleton */}
          <div className="flex flex-col gap-[18px] p-[18px] pt-[23px] rounded-[10px] border border-[#E1E4EA] bg-white">
            <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="flex items-center gap-[10px]">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-8 w-32 bg-gray-200 rounded-[8px] animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
