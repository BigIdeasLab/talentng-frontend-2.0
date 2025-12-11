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

async function refreshAccessToken(request: NextRequest) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_TALENTNG_API_URL || "http://localhost:3001";
    const response = await fetch(`${apiUrl}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
    });

    if (response.ok) {
      const setCookie = response.headers.get("set-cookie");
      return { success: true, setCookie };
    }
    return { success: false };
  } catch (error) {
    console.error("Token refresh failed:", error);
    return { success: false };
  }
}

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const tokenFromCookie = request.cookies.get("accessToken")?.value;
  const tokenFromUrl = searchParams.get("accessToken");
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error(
      "JWT_SECRET is not set. Authentication checks will be skipped.",
    );
    return NextResponse.next();
  }

  // If a token is in the URL, validate it, set it as a cookie, and redirect.
  if (tokenFromUrl) {
    const payload = await verifyToken(tokenFromUrl, jwtSecret);
    if (payload) {
      const url = request.nextUrl.clone();
      url.searchParams.delete("accessToken");
      const response = NextResponse.redirect(url);
      response.cookies.set("accessToken", tokenFromUrl, {
        path: "/",
        maxAge: 604800, // 7 days
        sameSite: "lax",
      });
      return response;
    } else {
      // Invalid URL token, just redirect to login without the bad token
      const url = new URL("/login", request.url);
      return NextResponse.redirect(url);
    }
  }

  const token = tokenFromCookie;

  // Handle protected routes
  if (isProtectedRoute(pathname)) {
    let payload = token ? await verifyToken(token, jwtSecret) : null;
    
    // If token is invalid or expired, try to refresh
    if (!payload && token) {
      const refreshResult = await refreshAccessToken(request);
      if (refreshResult.success) {
        // Retry verification with refreshed token from response
        const newToken = request.cookies.get("accessToken")?.value;
        if (newToken) {
          payload = await verifyToken(newToken, jwtSecret);
        }
      }
    }
    
    if (!payload) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      // Store the intended destination to redirect after login
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Handle auth routes
  if (isAuthRoute(pathname)) {
    const payload = token ? await verifyToken(token, jwtSecret) : null;
    if (payload) {
      // Allow access to onboarding for users who haven't completed it
      // (role is "general" or undefined/empty, or roles array is empty)
      const userRole =
        payload.role ||
        (Array.isArray(payload.roles) && payload.roles.length > 0
          ? payload.roles[0]
          : undefined);
      const hasCompletedOnboarding = userRole && userRole !== "general";

      // Only redirect away from auth pages if user has completed onboarding
      // Always allow /onboarding and /set-username for users who need to complete setup
      if (
        hasCompletedOnboarding &&
        pathname !== "/onboarding" &&
        pathname !== "/set-username"
      ) {
        // User is logged in and has completed onboarding, redirect from auth pages to their dashboard
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
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
