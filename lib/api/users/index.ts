/**
 * Users API Client
 * Handles all user-related API calls
 */

import apiClient from "@/lib/api";
import type { UsernameAvailability } from "./types";

export const checkUsernameAvailability = async (
  username: string
): Promise<UsernameAvailability> => {
  const endpoint = `/users/me/username-available/${encodeURIComponent(username)}`;
  return apiClient<UsernameAvailability>(endpoint);
};

// Export types
export type { UsernameAvailability };
