
import { Skeleton } from "@/components/ui/skeleton";

export default function OpportunityDetailSkeleton() {
  return (
    <div className="max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-12">
      {/* Back Button */}
      <Skeleton className="h-6 w-24" />

      {/* Job Details Section */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
        {/* Left Column - Job Info */}
        <div className="flex-shrink-0 lg:w-[400px] space-y-6">
          <div className="p-8 border border-gray-200 rounded-[44px] space-y-6">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-36 rounded-3xl" />
              <Skeleton className="h-12 w-24 rounded-3xl" />
            </div>

            {/* Budget */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-32" />
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-12" />
              <div className="flex flex-wrap gap-2.5">
                <Skeleton className="h-8 w-20 rounded-2xl" />
                <Skeleton className="h-8 w-24 rounded-2xl" />
                <Skeleton className="h-8 w-16 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Description */}
        <div className="flex-1 space-y-10">
          <Skeleton className="h-8 w-48" />

          {/* Job Description */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-36" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>

          {/* Key Responsibilities */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>

          {/* Job Qualifications */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </div>
      </div>

      {/* Similar Opportunities */}
      <div className="space-y-6">
        <div className="space-y-2.5">
          <Skeleton className="h-8 w-64" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
