"use client";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { userProfileApi, type User } from "@/lib/api/user-service";
import { logout as logoutAPI } from "@/lib/api/auth-service";
import { clearTokens, getAccessToken } from "@/lib/auth";
import { resetRefreshState } from "@/lib/token-refresh";

const fetchUser = async (): Promise<User | null> => {
  try {
    const userData = await userProfileApi.getCurrentUser();
    return userData;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return null;
  }
};

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // Check if token exists - this should be checked on every render
  // to handle token expiry and refresh scenarios
  const hasToken = typeof window !== 'undefined' && !!getAccessToken();

  const {
    data: user,
    isLoading: loading,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    staleTime: 0, // Always consider cache stale to ensure fresh data after login
    enabled: hasToken, // Only run query if token exists in localStorage
    retry: 1, // Retry once on failure (allows refresh to kick in)
  });

  // Refetch user when tokens change (after login or after page reload)
  useEffect(() => {
    if (hasToken && !loading) {
      refetchUser();
    }
  }, [hasToken, refetchUser, loading]);

  const logout = async () => {
    try {
      await logoutAPI();
    } catch (error) {
      console.error("Logout error:", error);
      // Continue logout even if API call fails
    } finally {
      // Clear all tokens and state
      clearTokens();
      resetRefreshState();
      localStorage.removeItem("user");
      queryClient.setQueryData(["user"], null);
      
      // Hard redirect to force middleware to re-check
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  };

  return { user: user ?? null, loading, logout, refetchUser };
};