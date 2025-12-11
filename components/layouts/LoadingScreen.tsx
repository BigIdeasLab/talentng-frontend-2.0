"use client";

import { Spinner } from "@/components/ui/spinner";

export function LoadingScreen() {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-white">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" className="text-[#5C30FF]" />
      </div>
    </div>
  );
}
