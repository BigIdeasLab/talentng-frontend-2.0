/**
 * Server-side Recruiter API Client
 * Used only in Next.js Server Components and Server Actions
 * Retrieves auth token from cookies via Next.js
 */

import serverApiClient from "@/lib/api/server-client";
import type { RecruiterProfile, UpdateRecruiterProfileInput } from "./types";

/**
 * Get Current User's Recruiter Profile (Server-side)
 * GET /recruiter/me
 */
export async function getServerCurrentRecruiterProfile(): Promise<RecruiterProfile> {
  return serverApiClient<RecruiterProfile>("/recruiter/me");
}

/**
 * Update Current User's Recruiter Profile (Server-side)
 * PATCH /recruiter/me
 */
export async function updateServerRecruiterProfile(
  data: UpdateRecruiterProfileInput,
): Promise<RecruiterProfile> {
  return serverApiClient<RecruiterProfile>("/recruiter/me", {
    method: "PATCH",
    body: data,
  });
}

/**
 * Get Recruiter Profile by User ID (Server-side)
 * GET /recruiter/:userId
 */
export async function getServerRecruiterProfileByUserId(
  userId: string,
): Promise<RecruiterProfile> {
  return serverApiClient<RecruiterProfile>(`/recruiter/${userId}`);
}

/**
 * List All Recruiter Profiles (Server-side)
 * GET /recruiter
 */
export async function getServerListRecruiterProfiles(): Promise<RecruiterProfile[]> {
  return serverApiClient<RecruiterProfile[]>("/recruiter");
}
