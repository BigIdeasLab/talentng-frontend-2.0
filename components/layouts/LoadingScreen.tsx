"use client";

import { Spinner } from "@/components/ui/spinner";

export function LoadingScreen() {
  console.log("[LoadingScreen] Rendering loading screen", {
    timestamp: typeof window !== "undefined" ? window.performance.now() : 0,
  });

  return (
    <div className="flex items-center justify-center w-full h-screen bg-white">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" className="text-[#5C30FF]" />
        <p className="text-sm text-gray-500 mt-2">Loading your profile...</p>
      </div>
    </div>
  );
}
