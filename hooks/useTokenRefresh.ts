/**
 * Hook to ensure token is valid before performing operations
 * Useful for onboarding and other sensitive operations
 */

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ensureValidToken, resetRefreshState } from "@/lib/token-refresh";
import { getAccessToken, clearTokens } from "@/lib/auth";

const API_URL =
  process.env.NEXT_PUBLIC_TALENTNG_API_URL || "http://localhost:3001";

export const useTokenRefresh = () => {
  const router = useRouter();
  const { toast } = useToast();

  /**
   * Ensure token is valid before proceeding with an operation
   * Returns true if token is valid, false otherwise
   */
  const ensureValidTokenBeforeOperation = useCallback(
    async (operationName: string = "operation"): Promise<boolean> => {
      const token = getAccessToken();

      if (!token) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "Please log in to continue.",
        });
        router.push("/login");
        return false;
      }

      try {
        const isValid = await ensureValidToken(API_URL);

        if (!isValid) {
          toast({
            variant: "destructive",
            title: "Session Expired",
            description: "Your session has expired. Please log in again.",
          });
          clearTokens();
          resetRefreshState();
          router.push("/login");
          return false;
        }

        return true;
      } catch (error) {
        console.error(`Token validation failed for ${operationName}:`, error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Failed to validate session. Please log in again.",
        });
        clearTokens();
        resetRefreshState();
        router.push("/login");
        return false;
      }
    },
    [router, toast],
  );

  return { ensureValidTokenBeforeOperation };
};

export default useTokenRefresh;
