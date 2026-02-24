"use client";

import { useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "./useProfile";

type AllowedRole = "talent" | "recruiter" | "employer" | "mentor";

/**
 * Hook to enforce role-based access control
 * Redirects to /dashboard if user doesn't have required role
 * @param allowedRoles - Roles that have access
 * @param redirectTo - Path to redirect to if no permission (default: "/dashboard")
 * @returns true if user has required role, false otherwise
 */
export function useRequireRole(
  allowedRoles: AllowedRole[],
  redirectTo: string = "/dashboard",
): boolean {
  const router = useRouter();
  const { activeRole, userRoles, isLoading } = useProfile();
  const hasRedirected = useRef(false);

  // Stabilize allowedRoles so a new array literal on each render
  // doesn't cause the useEffect to re-fire infinitely
  const rolesKey = JSON.stringify(allowedRoles);
  const stableAllowedRoles = useMemo<AllowedRole[]>(
    () => JSON.parse(rolesKey),
    [rolesKey],
  );

  useEffect(() => {
    if (isLoading) return;

    const role = activeRole || userRoles?.[0] || "talent";
    const hasAccess = stableAllowedRoles.includes(role as AllowedRole);

    if (!hasAccess && !hasRedirected.current) {
      hasRedirected.current = true;
      router.replace(redirectTo);
    }
  }, [activeRole, userRoles, isLoading, stableAllowedRoles, redirectTo, router]);

  // Reset redirect guard when role changes (allows re-evaluation)
  useEffect(() => {
    hasRedirected.current = false;
  }, [activeRole]);

  if (isLoading) return false;

  const role = activeRole || userRoles?.[0] || "talent";
  return stableAllowedRoles.includes(role as AllowedRole);
}
