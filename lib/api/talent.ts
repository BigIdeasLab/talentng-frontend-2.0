/**
 * Talent API Client
 * Handles all API calls related to talent profiles
 * Base URL: /talent
 */

import { APIProfileData } from "@/lib/profileMapper";

const BASE_URL = "/api/talent";

// Types
export interface TalentProfile extends APIProfileData {
  id: string;
  userId: string;
  visibility: "public" | "private";
  isFeatured: boolean;
  featuredUntil?: string;
  views: number;
  stats: {
    earnings: string;
    hired: number;
    views: number;
    completionPercentage: number;
  };
  coverImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

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
  earnings: string;
  hired: number;
  views: number;
  completionPercentage: number;
}

export interface TalentFilterParams {
  headline?: string;
  bio?: string;
  skills?: string;
  location?: string;
  visibility?: "public" | "private";
  isFeatured?: boolean;
}

// Helper function to get auth token
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

// Helper function to get headers
function getHeaders(includeAuth = true): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
}

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `API Error: ${response.statusText}`);
  }

  return response.json();
}

/**
 * 1. Get Current User's Talent Profile
 * GET /talent/me
 */
export async function getCurrentProfile(): Promise<TalentProfile> {
  return apiCall<TalentProfile>("/me");
}

/**
 * 2. Update Current User's Talent Profile
 * PATCH /talent/me
 */
export async function updateProfile(
  data: Partial<APIProfileData>
): Promise<TalentProfile> {
  return apiCall<TalentProfile>("/me", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * 3. Get Dashboard Statistics
 * GET /talent/dashboard
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  return apiCall<DashboardStats>("/dashboard");
}

/**
 * 4. Update Profile Image
 * PATCH /talent/profile-image
 */
export async function updateProfileImage(file: File): Promise<{
  id: string;
  profileImageUrl: string;
  updatedAt: string;
}> {
  const formData = new FormData();
  formData.append("file", file);

  const token = getAuthToken();
  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/profile-image`, {
    method: "PATCH",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to upload profile image");
  }

  return response.json();
}

/**
 * 5. Update Cover Image
 * PATCH /talent/cover-image
 */
export async function updateCoverImage(file: File): Promise<{
  id: string;
  coverImageUrl: string;
  updatedAt: string;
}> {
  const formData = new FormData();
  formData.append("file", file);

  const token = getAuthToken();
  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/cover-image`, {
    method: "PATCH",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to upload cover image");
  }

  return response.json();
}

/**
 * 6. Upload Portfolio Item
 * POST /talent/portfolio
 */
export async function uploadPortfolioItem(file: File): Promise<PortfolioItem> {
  const formData = new FormData();
  formData.append("file", file);

  const token = getAuthToken();
  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/portfolio`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to upload portfolio item");
  }

  return response.json();
}

/**
 * 7. Delete Portfolio Item
 * DELETE /talent/portfolio/:id
 */
export async function deletePortfolioItem(itemId: string): Promise<{
  message: string;
}> {
  return apiCall<{ message: string }>(`/portfolio/${itemId}`, {
    method: "DELETE",
  });
}

/**
 * 8. Upload Gallery Images
 * POST /talent/gallery
 */
export async function uploadGalleryImages(
  files: File[]
): Promise<GalleryItem[]> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const token = getAuthToken();
  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/gallery`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to upload gallery images");
  }

  return response.json();
}

/**
 * 9. Delete Gallery Item
 * DELETE /talent/gallery/:id
 */
export async function deleteGalleryItem(itemId: string): Promise<{
  message: string;
}> {
  return apiCall<{ message: string }>(`/gallery/${itemId}`, {
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
  const endpoint = query ? `/?${query}` : "/";

  return apiCall<TalentProfile[]>(endpoint, {
    headers: getHeaders(false), // No auth required for public endpoint
  });
}

/**
 * 11. Get Talent Profile by User ID
 * GET /talent/:userId
 */
export async function getTalentProfileByUserId(
  userId: string
): Promise<TalentProfile> {
  return apiCall<TalentProfile>(`/${userId}`, {
    headers: getHeaders(false), // No auth required for public endpoint
  });
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
