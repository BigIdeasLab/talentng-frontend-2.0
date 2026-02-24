/**
 * Recruiter API Client
 * Handles all API calls related to recruiter profiles
 * Uses centralized apiClient from @/lib/api
 */

import apiClient from "@/lib/api";
import type {
  RecruiterProfile,
  UpdateRecruiterProfileInput,
  RecruiterFilterParams,
  RecruiterDashboardResponse,
  RecruiterSettings,
  UpdateRecruiterSettingsInput,
} from "./types";

/**
 * 1. Get Current User's Recruiter Profile
 * GET /recruiter/profile
 */
export async function getCurrentRecruiterProfile(): Promise<RecruiterProfile> {
  return apiClient<RecruiterProfile>("/recruiter/profile");
}

/**
 * 2. Update Current User's Recruiter Profile
 * PATCH /recruiter/profile
 */
export async function updateRecruiterProfile(
  data: UpdateRecruiterProfileInput,
): Promise<RecruiterProfile> {
  return apiClient<RecruiterProfile>("/recruiter/profile", {
    method: "PATCH",
    body: data,
  });
}

/**
 * 3. Get Recruiter Profile by User ID (Public)
 * GET /recruiters/:userId
 */
export async function getRecruiterProfileByUserId(
  userId: string,
): Promise<RecruiterProfile> {
  return apiClient<RecruiterProfile>(`/recruiters/${userId}`);
}

/**
 * 4. Update Profile Image
 * PATCH /recruiter/profile-image
 * Returns the entire updated RecruiterProfile object
 */
export async function updateRecruiterProfileImage(
  file: File,
): Promise<RecruiterProfile> {
  const formData = new FormData();
  formData.append("file", file);

  return apiClient<RecruiterProfile>("/recruiter/profile-image", {
    method: "PATCH",
    body: formData,
  });
}

/**
 * 5. Update Cover Image
 * PATCH /recruiter/cover-image
 * Returns the entire updated RecruiterProfile object
 */
export async function updateRecruiterCoverImage(
  file: File,
): Promise<RecruiterProfile> {
  const formData = new FormData();
  formData.append("file", file);

  return apiClient<RecruiterProfile>("/recruiter/cover-image", {
    method: "PATCH",
    body: formData,
  });
}

/**
 * 6. Update Logo Image
 * PATCH /recruiter/logo-image
 * Returns the entire updated RecruiterProfile object
 */
export async function updateRecruiterLogoImage(
  file: File,
): Promise<RecruiterProfile> {
  const formData = new FormData();
  formData.append("file", file);

  return apiClient<RecruiterProfile>("/recruiter/logo-image", {
    method: "PATCH",
    body: formData,
  });
}

/**
 * 7. List All Recruiter Profiles (Public)
 * GET /recruiters
 */
export async function listRecruiterProfiles(
  filters?: RecruiterFilterParams,
): Promise<RecruiterProfile[]> {
  const queryParams = new URLSearchParams();

  if (filters) {
    if (filters.industry) queryParams.append("industry", filters.industry);
    if (filters.location) queryParams.append("location", filters.location);
    if (filters.companyName)
      queryParams.append("companyName", filters.companyName);
    if (filters.visibility)
      queryParams.append("visibility", filters.visibility);
    if (filters.isFeatured !== undefined)
      queryParams.append("isFeatured", String(filters.isFeatured));
  }

  const query = queryParams.toString();
  const endpoint = query ? `/recruiters?${query}` : "/recruiters";

  return apiClient<RecruiterProfile[]>(endpoint);
}

/**
 * Helper: Batch update multiple profile fields
 */
export async function batchUpdateRecruiterProfile(
  updates: UpdateRecruiterProfileInput,
): Promise<RecruiterProfile> {
  return updateRecruiterProfile(updates);
}

/**
 * Get Recruiter Dashboard Data
 * GET /recruiter/dashboard
 */
export async function getRecruiterDashboard(): Promise<RecruiterDashboardResponse> {
  return apiClient<RecruiterDashboardResponse>("/recruiter/dashboard");
}

// Export types
export type {
  RecruiterProfile,
  UpdateRecruiterProfileInput,
  RecruiterFilterParams,
  RecruiterDashboardResponse,
  RecruiterSettings,
  UpdateRecruiterSettingsInput,
} from "./types";

/**
 * Get Recruiter Settings
 * GET /recruiter/settings
 */
export async function getRecruiterSettings(): Promise<RecruiterSettings> {
  return apiClient<RecruiterSettings>("/recruiter/settings");
}

/**
 * Update Recruiter Settings
 * PATCH /recruiter/settings
 */
export async function updateRecruiterSettings(
  data: UpdateRecruiterSettingsInput,
): Promise<RecruiterSettings> {
  return apiClient<RecruiterSettings>("/recruiter/settings", {
    method: "PATCH",
    body: data,
  });
}
