"use client";
import { useEffect } from "react";
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

  const {
    data: user,
    isLoading: loading,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    staleTime: 0, // Always consider cache stale to ensure fresh data after login
  });

  // Refetch user when auth tokens change (after login)
  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      refetchUser();
    }
  }, [refetchUser]);

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