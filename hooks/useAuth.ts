"use client";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { userProfileApi, type User } from "@/lib/api/user-service";
import { logout as logoutAPI } from "@/lib/api/auth-service";
import { resetRefreshState } from "@/lib/token-refresh";

const fetchUser = async (): Promise<User | null> => {
  try {
    const userData = await userProfileApi.getCurrentUser();
    console.log("[useAuth] User fetched from GET /users/me", {
      userId: userData?.id,
      roles: userData?.roles,
    });
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
      console.log(
        "[useAuth] Triggering refetchUser on mount/dependency change",
      );
      refetchUser();
    }
  }, [hasToken, refetchUser, loading]);

  // Log whenever user data changes
  useEffect(() => {
    console.log("[useAuth] User state updated", {
      timestamp: typeof window !== "undefined" ? window.performance.now() : 0,
      userId: user?.id,
      rolesCount: user?.roles?.length,
      roles: user?.roles,
      loading,
    });
  }, [user, loading]);

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
