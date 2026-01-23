/**
 * Hook for handling role-switch query parameters
 * Extracted pattern from dashboard and opportunities pages
 *
 * Usage:
 * useSwitchRoleParam();
 */

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";

/**
 * Automatically switches user's active role based on "switchRole" query param
 * Used for onboarding or role selection flows that redirect with query params
 *
 * Example URL: /dashboard?switchRole=recruiter
 */
export function useSwitchRoleParam(): void {
  const searchParams = useSearchParams();
  const { userRoles, setActiveRole } = useProfile();

  useEffect(() => {
    const switchRole = searchParams.get("switchRole");

    // Only set active role if:
    // 1. switchRole param exists
    // 2. User actually has that role
    if (switchRole && userRoles.includes(switchRole)) {
      setActiveRole(switchRole);
    }
  }, [searchParams, userRoles, setActiveRole]);
}
