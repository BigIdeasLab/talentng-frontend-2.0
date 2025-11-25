
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const JobCardSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="p-6 border border-gray-200 rounded-[32px] bg-white space-y-4 shadow-sm">
        <div className="flex items-start gap-4">
          <Skeleton className="w-8 h-8 rounded-3xl" />
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-5 w-3/4" />
            </div>
            <Skeleton className="h-4 w-1/2" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-24 rounded-3xl" />
              <Skeleton className="h-10 w-24 rounded-3xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
