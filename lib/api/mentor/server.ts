/**
 * Server-side Mentor API Client
 * Used only in Next.js Server Components and Server Actions
 * Retrieves auth token from cookies via Next.js
 */

import serverApiClient from "@/lib/api/server-client";
import type {
  MentorProfile,
  UpdateMentorProfileInput,
  Booking,
} from "./types";

/**
 * Get Current User's Mentor Profile (Server-side)
 * GET /mentor/me
 */
export async function getServerCurrentMentorProfile(): Promise<MentorProfile> {
  return serverApiClient<MentorProfile>("/mentor/me");
}

/**
 * Update Current User's Mentor Profile (Server-side)
 * PATCH /mentor/me
 */
export async function updateServerMentorProfile(
  data: UpdateMentorProfileInput,
): Promise<MentorProfile> {
  return serverApiClient<MentorProfile>("/mentor/me", {
    method: "PATCH",
    body: data,
  });
}

/**
 * Get Mentor Profile by ID (Server-side)
 * GET /mentor/:id
 */
export async function getServerMentorProfileById(
  id: string,
): Promise<MentorProfile> {
  return serverApiClient<MentorProfile>(`/mentor/${id}`);
}

/**
 * Get All Mentors (Server-side, Public)
 * GET /mentor
 */
export async function getServerAllMentors(): Promise<MentorProfile[]> {
  return serverApiClient<MentorProfile[]>("/mentor");
}

/**
 * Search Mentors (Server-side, Public)
 * GET /mentor/search
 */
export async function getServerSearchMentors(
  query: string,
): Promise<MentorProfile[]> {
  const queryParams = new URLSearchParams();
  queryParams.append("q", query);

  return serverApiClient<MentorProfile[]>(
    `/mentor/search?${queryParams.toString()}`,
  );
}

/**
 * Get Mentor's Bookings (Server-side)
 * GET /mentor/bookings
 */
export async function getServerMentorBookings(): Promise<Booking[]> {
  return serverApiClient<Booking[]>("/mentor/bookings");
}

/**
 * Get Mentee's Bookings (Server-side)
 * GET /mentor/my-bookings
 */
export async function getServerMyMentorBookings(): Promise<Booking[]> {
  return serverApiClient<Booking[]>("/mentor/my-bookings");
}
