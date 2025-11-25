
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function LearningPathCardSkeleton() {
  return (
    <div className="relative flex-shrink-0 h-[300px] rounded-[32px] overflow-hidden">
      <Skeleton className="w-full h-full" />
      <div className="absolute bottom-0 left-0 right-0 h-[114px] bg-black bg-opacity-50 rounded-b-[32px] p-4 flex flex-col justify-between">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}
