
import { Skeleton } from "@/components/ui/skeleton";

export default function MentorDetailSkeleton() {
  return (
    <div className="max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-12">
      {/* Back Button */}
      <Skeleton className="h-6 w-24" />

      {/* Mentor Details Section */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex justify-between items-start">
          <Skeleton className="w-32 h-32 rounded-full" />
          <Skeleton className="h-11 w-36 rounded-3xl" />
        </div>

        <div className="flex-1 mt-6">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>

          <Skeleton className="h-4 w-64 mt-2" />
          <Skeleton className="h-4 w-32 mt-2" />

          <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          <div className="mt-6 max-w-xl">
            <Skeleton className="h-5 w-32" />
            <div className="flex flex-wrap gap-2 mt-3">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-full" />
            </div>
          </div>

          {/* Social icons */}
          <div className="mt-6 flex items-center gap-8">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
        </div>

        {/* Resume */}
        <div className="mt-8">
          <Skeleton className="h-8 w-32" />
          <div className="mt-6 space-y-6">
            <div className="pb-4 border-b border-gray-200">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-48 mt-1" />
            </div>
            <div className="pb-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-48 mt-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Similar Mentors */}
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
