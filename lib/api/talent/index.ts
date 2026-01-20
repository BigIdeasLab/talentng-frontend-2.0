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
  PaginatedTalentResponse,
  PortfolioItem,
  GalleryItem,
  Service,
  CreateServiceInput,
  UpdateServiceInput,
  AddReviewInput,
  TalentRecommendationDto,
  RecommendationStatsDto,
  CreateRecommendationDto,
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
  data: Partial<APIProfileData>,
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
export async function deletePortfolioItem(
  itemId: string,
): Promise<TalentProfile> {
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
  files: File[],
  title?: string,
  description?: string,
): Promise<TalentProfile> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  if (title) {
    formData.append("title", title);
  }
  if (description) {
    formData.append("description", description);
  }

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
export async function deleteGalleryItem(
  itemId: string,
): Promise<TalentProfile> {
  return apiClient<TalentProfile>(`/talent/gallery/${itemId}`, {
    method: "DELETE",
  });
}

/**
 * 10. List All Talent Profiles
 * GET /talent
 */
export async function listTalentProfiles(
  filters?: TalentFilterParams,
): Promise<PaginatedTalentResponse> {
  const queryParams = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, String(value));
      }
    });
  }

  const query = queryParams.toString();
  const endpoint = query ? `/talent?${query}` : "/talent";

  return apiClient<PaginatedTalentResponse>(endpoint);
}

/**
 * 11. Get Talent Profile by User ID
 * GET /talent/:userId
 */
export async function getTalentProfileByUserId(
  userId: string,
): Promise<TalentProfile> {
  return apiClient<TalentProfile>(`/talent/${userId}`);
}

/**
 * Helper: Update profile image URL only (without file upload)
 */
export async function updateProfileImageUrl(
  imageUrl: string,
): Promise<TalentProfile> {
  return updateProfile({
    profileImageUrl: imageUrl,
  });
}

/**
 * Helper: Batch update multiple profile fields
 */
export async function batchUpdateProfile(
  updates: Partial<APIProfileData>,
): Promise<TalentProfile> {
  return updateProfile(updates);
}

/**
 * SERVICE MANAGEMENT ENDPOINTS
 */

/**
 * 12. Create a Service
 * POST /talent/services
 */
export async function createService(
  data: CreateServiceInput,
): Promise<Service> {
  return apiClient<Service>("/talent/services", {
    method: "POST",
    body: data,
  });
}

/**
 * 13. Get My Services
 * GET /talent/services
 */
export async function getMyServices(): Promise<Service[]> {
  return apiClient<Service[]>("/talent/services");
}

/**
 * 14. Get Service by ID
 * GET /talent/services/:id
 */
export async function getServiceById(id: string): Promise<Service> {
  return apiClient<Service>(`/talent/services/${id}`);
}

/**
 * 15. Update Service
 * PATCH /talent/services/:id
 */
export async function updateService(
  id: string,
  data: UpdateServiceInput,
): Promise<Service> {
  return apiClient<Service>(`/talent/services/${id}`, {
    method: "PATCH",
    body: data,
  });
}

/**
 * 16. Delete Service
 * DELETE /talent/services/:id
 */
export async function deleteService(id: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`/talent/services/${id}`, {
    method: "DELETE",
  });
}

/**
 * 17. Get Talent's Services (Public)
 * GET /talent/:talentId/services
 */
export async function getTalentServices(
  talentId: string,
  tags?: string[],
): Promise<Service[]> {
  const queryParams = new URLSearchParams();
  if (tags && tags.length > 0) {
    queryParams.append("tags", tags.join(","));
  }

  const query = queryParams.toString();
  const endpoint = query
    ? `/talent/${talentId}/services?${query}`
    : `/talent/${talentId}/services`;

  return apiClient<Service[]>(endpoint);
}

/**
 * 18. Search Services by Tags (Public)
 * GET /talent/services/search/tags
 */
export async function searchServicesByTags(tags: string[]): Promise<Service[]> {
  const tagString = tags.join(",");
  return apiClient<Service[]>(`/talent/services/search/tags?tags=${tagString}`);
}

/**
 * 19. Add Review to Service
 * POST /talent/services/:id/reviews
 */
export async function addServiceReview(
  serviceId: string,
  data: AddReviewInput,
): Promise<Service> {
  return apiClient<Service>(`/talent/services/${serviceId}/reviews`, {
    method: "POST",
    body: data,
  });
}

/**
 * 20. Get Service Reviews
 * GET /talent/services/:id/reviews
 */
export async function getServiceReviews(serviceId: string): Promise<Service> {
  return apiClient<Service>(`/talent/services/${serviceId}/reviews`);
}

/**
 * 21. Delete Review
 * DELETE /talent/services/:id/reviews/:reviewId
 */
export async function deleteServiceReview(
  serviceId: string,
  reviewId: string,
): Promise<{ message: string }> {
  return apiClient<{ message: string }>(
    `/talent/services/${serviceId}/reviews/${reviewId}`,
    {
      method: "DELETE",
    },
  );
}

/**
 * RECOMMENDATION ENDPOINTS
 */

/**
 * 22. Create a Recommendation
 * POST /talent/:talentUserId/recommendations
 * Authentication: Required (JWT Bearer Token)
 */
export async function createRecommendation(
  talentUserId: string,
  data: CreateRecommendationDto,
): Promise<TalentRecommendationDto> {
  return apiClient<TalentRecommendationDto>(
    `/talent/${talentUserId}/recommendations`,
    {
      method: "POST",
      body: data,
    },
  );
}

/**
 * 23. Get All Recommendations for the Authenticated User
 * GET /talent/recommendations
 * Authentication: Required (JWT Bearer token)
 */
export async function getTalentRecommendations(): Promise<
  TalentRecommendationDto[]
> {
  return apiClient<TalentRecommendationDto[]>(`/talent/recommendations`);
}

/**
 * 24. Get Recommendation Statistics
 * GET /talent/:talentUserId/recommendations/stats
 * Authentication: Not required (Public endpoint)
 */
export async function getRecommendationStats(
  talentUserId: string,
): Promise<RecommendationStatsDto> {
  return apiClient<RecommendationStatsDto>(
    `/talent/${talentUserId}/recommendations/stats`,
  );
}

/**
 * 25. Delete a Recommendation
 * DELETE /talent/recommendations/:recommendationId
 * Authentication: Required (JWT Bearer Token)
 * You can only delete your own recommendations
 */
export async function deleteRecommendation(
  recommendationId: string,
): Promise<{ message: string }> {
  return apiClient<{ message: string }>(
    `/talent/recommendations/${recommendationId}`,
    {
      method: "DELETE",
    },
  );
}

// Export types
export type {
  TalentProfile,
  DashboardStats,
  TalentFilterParams,
  PortfolioItem,
  GalleryItem,
  Service,
  CreateServiceInput,
  UpdateServiceInput,
  AddReviewInput,
  TalentRecommendationDto,
  RecommendationStatsDto,
  CreateRecommendationDto,
};
