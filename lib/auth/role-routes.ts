/**
 * Role-Based Route Access Control
 * Maps routes to allowed roles for middleware protection
 */

import type { Role } from "@/lib/types/onboarding";

/**
 * Define which roles can access which routes
 * Routes are checked with startsWith, so more specific routes should come first
 */
export const ROLE_ROUTES: Record<string, Role[]> = {
  // Employer/Recruiter only routes
  "/employer": ["recruiter", "employer"],
  "/applicants": ["recruiter", "employer"],
  "/hired-talents": ["recruiter", "employer"],

  // Mentor only routes
  "/mentor": ["mentor"],
  "/mentorship": ["talent", "mentor"], // Both can access but may see different content

  // Talent-focused routes (all roles can access, but may see different content)
  "/discover-talent": ["talent", "recruiter", "mentor"],
  "/opportunities": ["talent", "recruiter", "mentor"],
  "/learning": ["talent", "mentor"],
  "/projects": ["talent"],
  "/support": ["talent", "recruiter", "mentor"],

  // Universal routes (all authenticated users can access)
  "/dashboard": ["talent", "recruiter", "mentor", "employer"],
  "/profile": ["talent", "recruiter", "mentor", "employer"],
  "/settings": ["talent", "recruiter", "mentor", "employer"],
  "/notifications": ["talent", "recruiter", "mentor", "employer"],
  "/talent-profile": ["talent", "recruiter", "mentor", "employer"],
};

/**
 * Check if a user with given roles can access a route
 */
export const canAccessRoute = (
  pathname: string,
  userRoles: string[],
): boolean => {
  // If no roles, deny access to protected routes
  if (!userRoles || userRoles.length === 0) {
    return false;
  }

  // Find matching route config (exact match or prefix match)
  for (const [route, allowedRoles] of Object.entries(ROLE_ROUTES)) {
    if (pathname.startsWith(route)) {
      // Check if user has any of the allowed roles
      return userRoles.some((role) => allowedRoles.includes(role as Role));
    }
  }

  // If no route config found, check if it's a protected route
  // Routes without config are denied by default
  return false;
};

/**
 * Get the primary redirect destination based on user roles
 * Used when user tries to access a route they don't have access to
 */
export const getRedirectForRole = (userRoles: string[]): string => {
  if (!userRoles || userRoles.length === 0) {
    return "/onboarding";
  }

  const primaryRole = userRoles[0];

  switch (primaryRole) {
    case "recruiter":
    case "employer":
      return "/employer";
    case "mentor":
      return "/mentor";
    case "talent":
    default:
      return "/dashboard";
  }
};

/**
 * Public routes that don't require role checking
 */
export const PUBLIC_ROUTES = [
  "/login",
  "/signup",
  "/confirm-email",
  "/forgot-password",
  "/forgot-password-confirmation",
  "/reset-password",
  "/onboarding",
  "/redirect",
];

/**
 * Check if a route is public (doesn't require authentication)
 */
export const isPublicRoute = (pathname: string): boolean => {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
};
