"use client";

import { Spinner } from "@/components/ui/spinner";
import { ROLE_COLORS } from "@/lib/theme/role-colors";

export function LoadingScreen() {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-white">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" style={{ color: ROLE_COLORS.talent.primary }} />
        <p className="text-sm text-gray-500 mt-2">Loading your profile...</p>
      </div>
    </div>
  );
}
