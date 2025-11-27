"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { decodeJwt, getCookie, deleteCookie, setCookie } from "@/lib/utils";
import apiClient from "@/lib/api";
import { User } from "@/lib/types/auth";

const fetchUser = async (): Promise<User | null> => {
  const token = getCookie("accessToken");
  if (token) {
    const decoded = decodeJwt(token);
    if (decoded) {
      try {
        const userData = await apiClient<User>("/users/me");
        return userData;
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        deleteCookie("accessToken");
        return null;
      }
    } else {
      deleteCookie("accessToken");
      return null;
    }
  }
  return null;
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
      await apiClient<void>("/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      deleteCookie("accessToken");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      queryClient.setQueryData(["user"], null);
      router.push("/login");
    }
  };

  return { user: user ?? null, loading, logout, refetchUser };
};