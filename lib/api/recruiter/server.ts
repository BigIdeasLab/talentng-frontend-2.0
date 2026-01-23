/**
 * Recruiter API Client (Server Exports)
 * These functions are called from client-side hooks
 * Uses the client API which reads tokens from localStorage
 */

import apiClient from "@/lib/api";
import type { RecruiterProfile, UpdateRecruiterProfileInput } from "./types";

/**
 * Get Current User's Recruiter Profile
 * GET /recruiter/me
 */
export async function getServerCurrentRecruiterProfile(): Promise<RecruiterProfile> {
  return apiClient<RecruiterProfile>("/recruiter/me");
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
