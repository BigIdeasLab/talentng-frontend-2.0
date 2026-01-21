import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

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
];

const authRoutes = [
  "/login",
  "/signup",
  "/confirm-email",
  "/forgot-password",
  "/forgot-password-confirmation",
  "/reset-password",
  "/onboarding",
];

const isProtectedRoute = (pathname: string) => {
  return protectedRoutes.some((route) => pathname.startsWith(route));
};

const isAuthRoute = (pathname: string) => {
  return authRoutes.some((route) => pathname.startsWith(route));
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
        if (refreshTokenFromUrl) params.set("refreshToken", refreshTokenFromUrl);
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
        if (refreshTokenFromUrl) params.set("refreshToken", refreshTokenFromUrl);
        if (userIdFromUrl) params.set("userId", userIdFromUrl);
        
        const redirectUrl = `/onboarding?${params.toString()}`;
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      } else {
        // Existing user - go to dashboard with tokens in query params
        const params = new URLSearchParams();
        
        params.set("accessToken", tokenFromUrl);
        if (refreshTokenFromUrl) params.set("refreshToken", refreshTokenFromUrl);
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

  // Protected routes: Let client-side authentication handle it
  // If user has no token, they'll get redirected to login by the client or on 401
  if (isProtectedRoute(pathname)) {
    // Don't block - client components will handle authentication
    // This allows pages to load with a spinner while the app checks auth
  }

  // Auth routes: Simple check - if coming from onboarding with tokens, allow
  if (isAuthRoute(pathname)) {
    // Let client determine if user should be redirected based on login state
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
