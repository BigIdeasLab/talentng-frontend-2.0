/**
 * Talent API Client
 * Handles all API calls related to talent profiles
 * Uses centralized apiClient from @/lib/api
 */

import apiClient from "@/lib/api";
import type { APIProfileData } from "@/lib/profileMapper";

export interface PortfolioItem {
  id: string;
  key: string;
  url: string;
  mime: string;
  sizeBytes: string;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  key: string;
  url: string;
  mime: string;
  sizeBytes: string;
  createdAt: string;
}

export interface DashboardStats {
  profileCompletion: number;
  applicationsSubmitted: number;
  interviewsScheduled: number;
  profileViews: number;
  hired: number;
  earnings: string;
}

export interface TalentFilterParams {
  headline?: string;
  bio?: string;
  skills?: string;
  location?: string;
  visibility?: "public" | "private";
  isFeatured?: boolean;
}

export interface TalentProfile {
  id: string;
  userId: string;
  fullName: string | null;
  headline: string | null;
  bio: string | null;
  profileImageUrl: string | null;
  coverImageUrl: string | null;
  skills: string[];
  stack: Array<{ name: string }>;
  location: string | null;
  availability: string | null;
  phoneNumber: string | null;
  preferredRole: string | null;
  company: string | null;
  duration: string | null;
  description: string | null;
  resumeUrl: string | null;
  visibility: "public" | "private";
  isFeatured: boolean;
  featuredUntil: string | null;
  createdAt: string;
  updatedAt: string;
  views: number;
  stats: {
    earnings: string;
    hired: number;
    views: number;
    completionPercentage: number;
  };
  workExperience: Array<{
    id: string;
    company: string;
    role: string;
    duration: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
  }>;
  portfolioItems: PortfolioItem[];
  gallery: GalleryItem[];
  socialLinks: {
    github?: string | null;
    linkedin?: string | null;
    twitter?: string | null;
    instagram?: string | null;
    telegram?: string | null;
    dribbble?: string | null;
    portfolio?: string | null;
  };
}

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
