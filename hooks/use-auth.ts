"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { userProfileApi, type User } from "@/lib/api/user-service";
import { logout as logoutAPI } from "@/lib/api";

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
  });

  const logout = async () => {
    try {
      await logoutAPI();
    } catch (error) {
      console.error("Logout error:", error);
      // Continue logout even if API call fails
    } finally {
      // Clear client state
      localStorage.removeItem("user");
      queryClient.setQueryData(["user"], null);
      
      // HTTP-only cookies are cleared by server
      // Hard redirect to force middleware to re-check
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  };

  return { user: user ?? null, loading, logout, refetchUser };
};