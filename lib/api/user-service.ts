/**
 * Centralized User API Service (Client-side)
 * Single source of truth for all user API interactions
 * 
 * Any changes to user API calls should be made here
 * This ensures consistent error handling, logging, and debugging
 * 
 * NOTE: This is for client-side APIs only
 * For server-side APIs, import directly from ./users/server
 */

import {
  checkUsernameAvailability,
  getCurrentUser,
  completeOnboarding,
} from "./users";

export type { UsernameAvailability } from "./users";
export type { User } from "@/lib/types/auth";

/**
 * User Authentication & Profile APIs (Client-side)
 */
export const userProfileApi = {
  getCurrentUser,
};

/**
 * User Onboarding APIs (Client-side)
 */
export const userOnboardingApi = {
  checkUsernameAvailability,
  completeOnboarding,
};

/**
 * Comprehensive export for backward compatibility
 * Use specific APIs above for better organization
 */
export const userApi = {
  profile: userProfileApi,
  onboarding: userOnboardingApi,
};
