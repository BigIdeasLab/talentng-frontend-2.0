/**
 * Mentor API Client (Server Exports)
 * These functions are called from client-side hooks
 * Uses the client API which reads tokens from localStorage
 */

import apiClient from "@/lib/api";
import type {
  MentorProfile,
  MentorProfileResponse,
  UpdateMentorProfileInput,
  Booking,
} from "./types";

/**
 * Get Current User's Mentor Profile
 * GET /mentor/profile
 * Returns profile response with isProfileCreated flag
 */
export async function getServerCurrentMentorProfile(): Promise<MentorProfileResponse> {
  return apiClient<MentorProfileResponse>("/mentor/profile");
}

/**
 * Update Current User's Mentor Profile
 * PATCH /mentor/profile
 */
export async function updateServerMentorProfile(
  data: UpdateMentorProfileInput,
): Promise<MentorProfile> {
  return apiClient<MentorProfile>("/mentor/profile", {
    method: "PATCH",
    body: data,
  });
}

/**
 * Get Mentor Profile by ID (Public)
 * GET /mentors/:id
 */
export async function getServerMentorProfileById(
  id: string,
): Promise<MentorProfile> {
  return apiClient<MentorProfile>(`/mentors/${id}`);
}

/**
 * Get All Mentors (Public)
 * GET /mentors
 */
export async function getServerAllMentors(): Promise<MentorProfile[]> {
  return apiClient<MentorProfile[]>("/mentors");
}

/**
 * Search Mentors (Public)
 * GET /mentors/search
 */
export async function getServerSearchMentors(
  query: string,
): Promise<MentorProfile[]> {
  const queryParams = new URLSearchParams();
  queryParams.append("q", query);

  return apiClient<MentorProfile[]>(`/mentors/search?${queryParams.toString()}`);
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
