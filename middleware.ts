import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import {
  ROLE_ROUTES,
  isPublicRoute,
  canAccessRoute,
  getRedirectForRole,
} from "@/lib/auth/role-routes";

const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/learning",
  "/mentorship",
  "/opportunities",
  "/settings",
  "/notifications",
  "/projects",
  "/discover-talent",
  "/support",
  "/employer",
  "/applicants",
  "/hired-talents",
  "/mentor",
  "/talent-profile",
];

const isProtectedRoute = (pathname: string) => {
  return protectedRoutes.some((route) => pathname.startsWith(route));
};

async function verifyToken(token: string, secret: string) {
  try {
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (error: any) {
    if (error?.code !== "ERR_JWT_EXPIRED") {
      console.error("Token verification failed:", error);
    }
    return null;
  }
}

/**
 * Extract roles from JWT payload
 */
function extractRolesFromToken(payload: any): string[] {
  if (!payload) return [];

  // Try different possible role field names
  const roles =
    payload.roles ||
    payload.userRoles ||
    payload.role ||
    (Array.isArray(payload.role) ? payload.role : []);

  if (Array.isArray(roles)) {
    return roles;
  }

  return [];
}

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const tokenFromUrl = searchParams.get("accessToken");
  const refreshTokenFromUrl = searchParams.get("refreshToken");
  const userIdFromUrl = searchParams.get("userId");
  const isNewUserFromUrl = searchParams.get("isNewUser");
  const rolesFromUrl = searchParams.get("roles");
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error(
      "JWT_SECRET is not set. Authentication checks will be skipped.",
    );
    return NextResponse.next();
  }

  // If tokens are in the URL (OAuth callback), validate and redirect to store in localStorage
  // Skip this processing for /redirect (it handles its own token storage)
  if (tokenFromUrl && pathname !== "/redirect") {
    const isNewUser = isNewUserFromUrl === "true";

    // If already on onboarding, only proceed if it's a new user
    // (existing users should be redirected to dashboard)
    if (pathname === "/onboarding") {
      if (!isNewUser) {
        // Existing user should not be on onboarding, redirect to dashboard
        const params = new URLSearchParams();
        params.set("accessToken", tokenFromUrl);
        if (refreshTokenFromUrl)
          params.set("refreshToken", refreshTokenFromUrl);
        if (userIdFromUrl) params.set("userId", userIdFromUrl);
        if (rolesFromUrl) params.set("roles", rolesFromUrl);

        const redirectUrl = `/redirect?${params.toString()}`;
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }
      // New user on onboarding - allow it (TokenStorage component will handle)
      return NextResponse.next();
    }

    const payload = await verifyToken(tokenFromUrl, jwtSecret);
    if (payload) {
      // For new users, go to onboarding; for existing users, go to dashboard
      if (isNewUser) {
        // Redirect to onboarding with tokens in query params
        // Client component will read these and store in localStorage
        const params = new URLSearchParams();

        params.set("accessToken", tokenFromUrl);
        if (refreshTokenFromUrl)
          params.set("refreshToken", refreshTokenFromUrl);
        if (userIdFromUrl) params.set("userId", userIdFromUrl);

        const redirectUrl = `/onboarding?${params.toString()}`;
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      } else {
        // Existing user - go to dashboard with tokens in query params
        const params = new URLSearchParams();

        params.set("accessToken", tokenFromUrl);
        if (refreshTokenFromUrl)
          params.set("refreshToken", refreshTokenFromUrl);
        if (userIdFromUrl) params.set("userId", userIdFromUrl);
        if (rolesFromUrl) params.set("roles", rolesFromUrl);

        const redirectUrl = `/redirect?${params.toString()}`;
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }
    } else {
      // Invalid URL token, redirect to login without the bad token
      const url = new URL("/login", request.url);
      return NextResponse.redirect(url);
    }
  }

  // Protected routes: Check role-based access
  if (isProtectedRoute(pathname)) {
    // Try to get token from cookies/storage (set by client)
    // For server-side verification, we'd need to check Authorization header or cookies
    // For now, we let the client components handle it and fallback to client-side checks

    // Extract roles from stored tokens if available
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      const payload = await verifyToken(token, jwtSecret);

      if (payload) {
        const userRoles = extractRolesFromToken(payload);

        // Check if user has access to this route
        if (!canAccessRoute(pathname, userRoles)) {
          // User doesn't have the required role - redirect to appropriate page
          const redirectUrl = getRedirectForRole(userRoles);
          return NextResponse.redirect(new URL(redirectUrl, request.url));
        }
      }
    }
    // If no valid token in header, let client-side auth handle it
    // Client components will redirect to login if needed
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
