/**
 * Recruiter API Client (Server Exports)
 * These functions are called from client-side hooks
 * Uses the client API which reads tokens from localStorage
 */

import apiClient from "@/lib/api";
import type {
  RecruiterProfile,
  RecruiterProfileResponse,
  UpdateRecruiterProfileInput,
  RecruiterDashboardResponse,
} from "./types";

/**
 * Get Current User's Recruiter Profile
 * GET /recruiter/me
 * Returns profile response with isProfileCreated flag
 */
export async function getServerCurrentRecruiterProfile(): Promise<RecruiterProfileResponse> {
  return apiClient<RecruiterProfileResponse>("/recruiter/me");
}

/**
 * Update Current User's Recruiter Profile
 * PATCH /recruiter/me
 */
export async function updateServerRecruiterProfile(
  data: UpdateRecruiterProfileInput,
): Promise<RecruiterProfile> {
  return apiClient<RecruiterProfile>("/recruiter/me", {
    method: "PATCH",
    body: data,
  });
}

/**
 * Get Recruiter Profile by User ID
 * GET /recruiter/:userId
 */
export async function getServerRecruiterProfileByUserId(
  userId: string,
): Promise<RecruiterProfile> {
  return apiClient<RecruiterProfile>(`/recruiter/${userId}`);
}

/**
 * List All Recruiter Profiles
 * GET /recruiter
 */
export async function getServerListRecruiterProfiles(): Promise<
  RecruiterProfile[]
> {
  return apiClient<RecruiterProfile[]>("/recruiter");
}

/**
 * Get Recruiter Dashboard Data
 * GET /recruiter/dashboard
 */
export async function getServerRecruiterDashboard(): Promise<RecruiterDashboardResponse> {
  return apiClient<RecruiterDashboardResponse>("/recruiter/dashboard");
}
