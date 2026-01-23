"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { storeTokens } from "@/lib/auth";

/**
 * Redirect page for existing users after OAuth login
 * Stores tokens from URL params and redirects to dashboard
 */
function AuthRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const userId = searchParams.get("userId");
    const roles = searchParams.get("roles");

    if (accessToken && refreshToken) {
      // Store tokens in localStorage
      storeTokens({
        accessToken,
        refreshToken,
        userId: userId || "",
      });

      // Store user roles if provided
      if (roles) {
        localStorage.setItem("userRoles", roles);
      }

      // Redirect to dashboard
      router.push("/dashboard");
    } else {
      // No tokens found, redirect to login
      router.push("/login");
    }
  }, [searchParams, router]);

  return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
    </div>
  );
}

export default function AuthRedirectPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      }
    >
      <AuthRedirectContent />
    </Suspense>
  );
}
