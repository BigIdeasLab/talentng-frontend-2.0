/**
 * Hook for handling role-switch query parameters
 * Extracted pattern from dashboard and opportunities pages
 *
 * Usage:
 * useSwitchRoleParam();
 */

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";

/**
 * Automatically switches user's active role based on "switchRole" query param.
 * Used for onboarding / role selection flows that redirect with query params.
 *
 * Example URL: /dashboard?switchRole=recruiter
 *
 * After onboarding, the new role may not yet be in `userRoles` context because
 * the profile fetch hasn't completed. We watch `userRoles` and retry until the
 * role appears, then perform the switch + page reload to clear stale state.
 */
export function useSwitchRoleParam(): void {
  const searchParams = useSearchParams();
  const { userRoles, switchRole } = useProfile();
  const switchedRef = useRef(false);

  useEffect(() => {
    const roleToSwitch = searchParams.get("switchRole");

    // Nothing to do if no param or already switched this session
    if (!roleToSwitch || switchedRef.current) return;

    // Wait until context has loaded the roles and confirms the user has this role
    if (!userRoles.includes(roleToSwitch)) {
      console.log(
        `[useSwitchRoleParam] Waiting for role "${roleToSwitch}" to appear in context. Current roles: [${userRoles.join(", ")}]`,
      );
      return;
    }

    switchedRef.current = true;
    console.log(`[useSwitchRoleParam] Switching to role: ${roleToSwitch}`);

    switchRole(roleToSwitch)
      .then(() => {
        // Reload without the query param so we land cleanly on the new role's dashboard
        window.location.href = window.location.pathname;
      })
      .catch((err) => {
        console.error(
          `[useSwitchRoleParam] Failed to switch role to ${roleToSwitch}:`,
          err,
        );
        switchedRef.current = false; // allow retry
      });
  }, [searchParams, userRoles, switchRole]);
}
