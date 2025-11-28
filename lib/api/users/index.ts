/**
 * Users API Client
 * Handles all user-related API calls
 */

import apiClient from "@/lib/api";
import type { UsernameAvailability } from "./types";
import type { User } from "@/lib/types/auth";

export const checkUsernameAvailability = async (
  username: string
): Promise<UsernameAvailability> => {
  const endpoint = `/users/me/username-available/${encodeURIComponent(username)}`;
  return apiClient<UsernameAvailability>(endpoint);
};

/**
 * Get current authenticated user details
 */
export const getCurrentUser = async (): Promise<User> => {
  return apiClient<User>("/users/me");
};

/**
 * Complete user onboarding
 */
export const completeOnboarding = async (
  formData: FormData
): Promise<any> => {
  return apiClient<any>("/users/me/onboard", {
    method: "POST",
    body: formData,
  });
};

// Export types
export type { UsernameAvailability };
