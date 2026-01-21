/**
 * Mentor API Client (Server Exports)
 * These functions are called from client-side hooks
 * Uses the client API which reads tokens from localStorage
 */

import apiClient from "@/lib/api";
import type {
  MentorProfile,
  UpdateMentorProfileInput,
  Booking,
} from "./types";

/**
 * Get Current User's Mentor Profile
 * GET /mentor/me
 */
export async function getServerCurrentMentorProfile(): Promise<MentorProfile> {
  return apiClient<MentorProfile>("/mentor/me");
}

/**
 * Update Current User's Mentor Profile
 * PATCH /mentor/me
 */
export async function updateServerMentorProfile(
  data: UpdateMentorProfileInput,
): Promise<MentorProfile> {
  return apiClient<MentorProfile>("/mentor/me", {
    method: "PATCH",
    body: data,
  });
}

/**
 * Get Mentor Profile by ID
 * GET /mentor/:id
 */
export async function getServerMentorProfileById(
  id: string,
): Promise<MentorProfile> {
  return apiClient<MentorProfile>(`/mentor/${id}`);
}

/**
 * Get All Mentors (Public)
 * GET /mentor
 */
export async function getServerAllMentors(): Promise<MentorProfile[]> {
  return apiClient<MentorProfile[]>("/mentor");
}

/**
 * Search Mentors (Public)
 * GET /mentor/search
 */
export async function getServerSearchMentors(
  query: string,
): Promise<MentorProfile[]> {
  const queryParams = new URLSearchParams();
  queryParams.append("q", query);

  return apiClient<MentorProfile[]>(
    `/mentor/search?${queryParams.toString()}`,
  );
}

/**
 * Get Mentor's Bookings
 * GET /mentor/bookings
 */
export async function getServerMentorBookings(): Promise<Booking[]> {
  return apiClient<Booking[]>("/mentor/bookings");
}

/**
 * Get Mentee's Bookings
 * GET /mentor/my-bookings
 */
export async function getServerMyMentorBookings(): Promise<Booking[]> {
  return apiClient<Booking[]>("/mentor/my-bookings");
}
