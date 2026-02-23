/**
 * Centralized User API Hook
 * Single point of access for all user API operations
 *
 * Consolidates all user API calls from scattered components
 * Provides consistent error handling and loading states
 */

import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getCurrentUser,
  checkUsernameAvailability,
  completeOnboarding,
  type UsernameAvailability,
} from "@/lib/api/users";
import type { User } from "@/lib/types/auth";

/**
 * Profile Hooks
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Onboarding Hooks
 */
export function useCheckUsernameAvailability(username: string) {
  return useQuery({
    queryKey: ["username-availability", username],
    queryFn: () => checkUsernameAvailability(username),
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: username.length > 0, // Only run when username is not empty
  });
}

export function useCompleteOnboarding() {
  return useMutation({
    mutationFn: completeOnboarding,
  });
}

