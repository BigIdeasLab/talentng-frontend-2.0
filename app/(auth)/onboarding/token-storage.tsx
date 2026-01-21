"use client";

import { useEffect } from "react";
import { storeTokens } from "@/lib/auth";

/**
 * Client component that stores OAuth tokens from URL params into localStorage
 * Called after OAuth redirect from backend
 */
export function TokenStorage() {
  useEffect(() => {
    // Get tokens from URL query params
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const userId = params.get("userId");

    if (accessToken && refreshToken) {
      // Store tokens in localStorage
      storeTokens({
        accessToken,
        refreshToken,
        userId: userId || "",
      });

      // Clean URL (remove tokens from query string)
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return null;
}
