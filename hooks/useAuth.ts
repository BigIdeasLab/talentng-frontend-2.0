"use client";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/api/users";
import type { User } from "@/lib/types/auth";
import { logout as logoutAPI } from "@/lib/api/auth-service";
import { resetRefreshState } from "@/lib/token-refresh";

const fetchUser = async (): Promise<User | null> => {
  try {
    const userData = await getCurrentUser();
    return userData;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return null;
  }
};

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Check if user is authenticated by attempting to fetch user data
  // Cookies are sent automatically with the request
  const hasToken = true; // Always attempt to fetch, cookies will determine auth

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
      // Clear frontend state (backend already cleared cookies)
      resetRefreshState();
      localStorage.removeItem("user");
      queryClient.setQueryData(["user"], null);

      // Redirect to login
      router.push("/login");
    }
  };

  return { user: user ?? null, loading, logout, refetchUser };
};
