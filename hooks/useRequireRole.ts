"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "./useProfile";

type AllowedRole = "recruiter" | "employer";

interface UseRequireRoleOptions {
  allowedRoles?: AllowedRole[];
  redirectTo?: string;
}

/**
 * Hook to enforce role-based access control
 * Redirects to /opportunities if user doesn't have required role
 * @param allowedRoles - Roles that have access (default: ["recruiter"])
 * @param redirectTo - Path to redirect to if no permission (default: "/opportunities")
 * @returns true if user has required role, false otherwise
 */
export function useRequireRole(
  allowedRoles: AllowedRole[] = ["recruiter"],
  redirectTo: string = "/opportunities",
): boolean {
  const router = useRouter();
  const { activeRole, userRoles, isLoading } = useProfile();

  useEffect(() => {
    if (isLoading) return;

    const role = activeRole || userRoles?.[0] || "talent";
    const hasAccess = allowedRoles.includes(role as AllowedRole);

    if (!hasAccess) {
      router.replace(redirectTo);
    }
  }, [activeRole, userRoles, isLoading, allowedRoles, redirectTo, router]);

  if (isLoading) return false;

  const role = activeRole || userRoles?.[0] || "talent";
  return allowedRoles.includes(role as AllowedRole);
}
