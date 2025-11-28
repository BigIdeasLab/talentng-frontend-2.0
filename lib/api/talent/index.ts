/**
 * Talent API Client
 * Handles all API calls related to talent profiles
 * Uses centralized apiClient from @/lib/api
 */

import apiClient from "@/lib/api";
import type { APIProfileData } from "@/lib/profileMapper";
import type {
  TalentProfile,
  DashboardStats,
  TalentFilterParams,
  PortfolioItem,
  GalleryItem,
} from "./types";

/**
 * 1. Get Current User's Talent Profile
 * GET /talent/me
 */
export async function getCurrentProfile(): Promise<TalentProfile> {
  return apiClient<TalentProfile>("/talent/me");
}

/**
 * 2. Update Current User's Talent Profile
 * PATCH /talent/me
 */
export async function updateProfile(
  data: Partial<APIProfileData>
): Promise<TalentProfile> {
  return apiClient<TalentProfile>("/talent/me", {
    method: "PATCH",
    body: data,
  });
}

/**
 * 3. Get Dashboard Statistics
 * GET /talent/dashboard
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  return apiClient<DashboardStats>("/talent/dashboard");
}

/**
 * 4. Update Profile Image
 * PATCH /talent/profile-image
 * Returns the entire updated TalentProfile object
 */
export async function updateProfileImage(file: File): Promise<TalentProfile> {
  const formData = new FormData();
  formData.append("file", file);

  return apiClient<TalentProfile>("/talent/profile-image", {
    method: "PATCH",
    body: formData,
  });
}

/**
 * 5. Update Cover Image
 * PATCH /talent/cover-image
 * Returns the entire updated TalentProfile object
 */
export async function updateCoverImage(file: File): Promise<TalentProfile> {
  const formData = new FormData();
  formData.append("file", file);

  return apiClient<TalentProfile>("/talent/cover-image", {
    method: "PATCH",
    body: formData,
  });
}

/**
 * 6. Upload Portfolio Item
 * POST /talent/portfolio
 * Returns the entire updated TalentProfile object with new portfolio item added
 */
export async function uploadPortfolioItem(file: File): Promise<TalentProfile> {
  const formData = new FormData();
  formData.append("file", file);

  return apiClient<TalentProfile>("/talent/portfolio", {
    method: "POST",
    body: formData,
  });
}

/**
 * 7. Delete Portfolio Item
 * DELETE /talent/portfolio/:id
 * Returns the entire updated TalentProfile object with portfolio item removed
 */
export async function deletePortfolioItem(itemId: string): Promise<TalentProfile> {
  return apiClient<TalentProfile>(`/talent/portfolio/${itemId}`, {
    method: "DELETE",
  });
}

/**
 * 8. Upload Gallery Images
 * POST /talent/gallery
 * Returns the entire updated TalentProfile object with new gallery items added
 */
export async function uploadGalleryImages(
  files: File[]
): Promise<TalentProfile> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  return apiClient<TalentProfile>("/talent/gallery", {
    method: "POST",
    body: formData,
  });
}

/**
 * 9. Delete Gallery Item
 * DELETE /talent/gallery/:id
 * Returns the entire updated TalentProfile object with gallery item removed
 */
export async function deleteGalleryItem(itemId: string): Promise<TalentProfile> {
  return apiClient<TalentProfile>(`/talent/gallery/${itemId}`, {
    method: "DELETE",
  });
}

/**
 * 10. List All Talent Profiles
 * GET /talent
 */
export async function listTalentProfiles(
  filters?: TalentFilterParams
): Promise<TalentProfile[]> {
  const queryParams = new URLSearchParams();

  if (filters) {
    if (filters.headline) queryParams.append("headline", filters.headline);
    if (filters.bio) queryParams.append("bio", filters.bio);
    if (filters.skills) queryParams.append("skills", filters.skills);
    if (filters.location) queryParams.append("location", filters.location);
    if (filters.visibility)
      queryParams.append("visibility", filters.visibility);
    if (filters.isFeatured !== undefined)
      queryParams.append("isFeatured", String(filters.isFeatured));
  }

  const query = queryParams.toString();
  const endpoint = query ? `/talent?${query}` : "/talent";

  return apiClient<TalentProfile[]>(endpoint);
}

/**
 * 11. Get Talent Profile by User ID
 * GET /talent/:userId
 */
export async function getTalentProfileByUserId(
  userId: string
): Promise<TalentProfile> {
  return apiClient<TalentProfile>(`/talent/${userId}`);
}

/**
 * Helper: Update profile image URL only (without file upload)
 */
export async function updateProfileImageUrl(
  imageUrl: string
): Promise<TalentProfile> {
  return updateProfile({
    profileImageUrl: imageUrl,
  });
}

/**
 * Helper: Batch update multiple profile fields
 */
export async function batchUpdateProfile(
  updates: Partial<APIProfileData>
): Promise<TalentProfile> {
  return updateProfile(updates);
}

// Export types
export type { TalentProfile, DashboardStats, TalentFilterParams, PortfolioItem, GalleryItem };
