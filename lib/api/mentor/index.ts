/**
 * Mentor API Client
 * Handles all API calls related to mentor profiles, availability, and bookings
 * Uses centralized apiClient from @/lib/api
 */

import apiClient from "@/lib/api";
import type {
  MentorProfile,
  UpdateMentorProfileInput,
  SetMentorAvailabilityInput,
  CreateBookingInput,
  MentorAvailability,
  Booking,
  MentorSearchFilters,
  MentorSettings,
  UpdateMentorSettingsInput,
} from "./types";

/**
 * 1. Get All Mentors (Public)
 * GET /mentors
 */
export async function getAllMentors(): Promise<MentorProfile[]> {
  return apiClient<MentorProfile[]>("/mentors");
}

/**
 * 2. Search Mentors (Public)
 * GET /mentors/search
 */
export async function searchMentors(query: string): Promise<MentorProfile[]> {
  const queryParams = new URLSearchParams();
  queryParams.append("q", query);

  return apiClient<MentorProfile[]>(
    `/mentors/search?${queryParams.toString()}`,
  );
}

/**
 * 3. Get Current User's Mentor Profile
 * GET /mentor/profile
 */
export async function getCurrentMentorProfile(): Promise<MentorProfile> {
  return apiClient<MentorProfile>("/mentor/profile");
}

/**
 * 4. Update Current User's Mentor Profile
 * PATCH /mentor/profile
 */
export async function updateMentorProfile(
  data: UpdateMentorProfileInput,
): Promise<MentorProfile> {
  return apiClient<MentorProfile>("/mentor/profile", {
    method: "PATCH",
    body: data,
  });
}

/**
 * 5. Get Mentor Profile by ID (Public)
 * GET /mentors/:id
 */
export async function getMentorProfileById(id: string): Promise<MentorProfile> {
  return apiClient<MentorProfile>(`/mentors/${id}`);
}

/**
 * 6. Update Profile Image
 * PATCH /mentor/profile-image
 */
export async function updateMentorProfileImage(
  file: File,
): Promise<MentorProfile> {
  const formData = new FormData();
  formData.append("file", file);

  return apiClient<MentorProfile>("/mentor/profile-image", {
    method: "PATCH",
    body: formData,
  });
}

/**
 * 7. Update Cover Image
 * PATCH /mentor/cover-image
 */
export async function updateMentorCoverImage(
  file: File,
): Promise<MentorProfile> {
  const formData = new FormData();
  formData.append("file", file);

  return apiClient<MentorProfile>("/mentor/cover-image", {
    method: "PATCH",
    body: formData,
  });
}

/**
 * 8. Set Mentor Availability
 * PUT /mentor/availability
 */
export async function setMentorAvailability(
  data: SetMentorAvailabilityInput,
): Promise<MentorAvailability[]> {
  return apiClient<MentorAvailability[]>("/mentor/availability", {
    method: "PUT",
    body: data,
  });
}

/**
 * 9. Get Mentor's Available Slots (Public)
 * GET /mentors/:id/availability
 */
export async function getMentorAvailableSlots(
  mentorId: string,
): Promise<MentorAvailability[]> {
  return apiClient<MentorAvailability[]>(`/mentors/${mentorId}/availability`);
}

/**
 * 10. Create Booking with Mentor
 * POST /mentor/booking
 */
export async function createMentorBooking(
  data: CreateBookingInput,
): Promise<Booking> {
  return apiClient<Booking>("/mentor/booking", {
    method: "POST",
    body: data,
  });
}

/**
 * 11. Get Mentor's Bookings
 * GET /mentor/bookings
 */
export async function getMentorBookings(): Promise<Booking[]> {
  return apiClient<Booking[]>("/mentor/bookings");
}

/**
 * 12. Get Mentee's Bookings
 * GET /mentor/my-bookings
 */
export async function getMyMentorBookings(): Promise<Booking[]> {
  return apiClient<Booking[]>("/mentor/my-bookings");
}

/**
 * 13. Cancel Booking
 * PATCH /mentor/booking/:id/cancel
 */
export async function cancelMentorBooking(
  bookingId: string,
): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`/mentor/booking/${bookingId}/cancel`, {
    method: "PATCH",
  });
}

/**
 * Helper: Update profile image URL only (without file upload)
 */
export async function updateMentorProfileImageUrl(
  imageUrl: string,
): Promise<MentorProfile> {
  return updateMentorProfile({
    profileImageUrl: imageUrl,
  });
}

/**
 * Helper: Batch update multiple profile fields
 */
export async function batchUpdateMentorProfile(
  updates: UpdateMentorProfileInput,
): Promise<MentorProfile> {
  return updateMentorProfile(updates);
}

// Export types
export type {
  MentorProfile,
  UpdateMentorProfileInput,
  SetMentorAvailabilityInput,
  CreateBookingInput,
  MentorAvailability,
  Booking,
  MentorSearchFilters,
  MentorSettings,
  UpdateMentorSettingsInput,
} from "./types";

/**
 * Get Mentor Settings
 * GET /mentor/settings
 */
export async function getMentorSettings(): Promise<MentorSettings> {
  return apiClient<MentorSettings>("/mentor/settings");
}

/**
 * Update Mentor Settings
 * PATCH /mentor/settings
 */
export async function updateMentorSettings(
  data: UpdateMentorSettingsInput,
): Promise<MentorSettings> {
  return apiClient<MentorSettings>("/mentor/settings", {
    method: "PATCH",
    body: data,
  });
}
