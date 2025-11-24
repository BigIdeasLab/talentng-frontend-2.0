
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function MentorCardSkeleton() {
  return (
    <div className="flex p-4 flex-col items-start gap-4 border border-gray-200 rounded-[32px] bg-white shadow-sm">
      <div className="flex flex-col items-start gap-5 self-stretch">
        <Skeleton className="w-16 h-16 rounded-full" />

        <div className="flex flex-col items-start gap-4 self-stretch">
          <div className="flex w-full flex-col items-start gap-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="w-5 h-5 rounded-full" />
            </div>

            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-24" />
          </div>

          <div className="space-y-2 self-stretch">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start gap-2 self-stretch">
        <Skeleton className="h-5 w-24" />
        <div className="flex items-center gap-3 self-stretch flex-wrap">
          <Skeleton className="h-8 w-20 rounded-3xl" />
          <Skeleton className="h-8 w-24 rounded-3xl" />
        </div>
      </div>

      <Skeleton className="h-10 w-full rounded-3xl" />
    </div>
  );
}
