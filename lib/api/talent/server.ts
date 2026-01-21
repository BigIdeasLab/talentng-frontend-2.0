/**
 * Talent API Client (Server Exports)
 * These functions are called from client-side hooks
 * Uses the client API which reads tokens from localStorage
 */

import apiClient from "@/lib/api";
import type { APIProfileData } from "@/lib/profileMapper";
import type {
  TalentProfile,
  DashboardStats,
  Service,
  TalentRecommendationDto,
  RecommendationStatsDto,
} from "./types";

/**
 * Get Current User's Talent Profile
 * GET /talent/me
 */
export async function getServerCurrentProfile(): Promise<TalentProfile> {
  return apiClient<TalentProfile>("/talent/me");
}

/**
 * Update Current User's Talent Profile
 * PATCH /talent/me
 */
export async function updateServerTalentProfile(
  data: APIProfileData,
): Promise<TalentProfile> {
  return apiClient<TalentProfile>("/talent/me", {
    method: "PATCH",
    body: data,
  });
}

/**
 * Get Dashboard Statistics
 * GET /talent/dashboard
 */
export async function getServerDashboardStats(): Promise<DashboardStats> {
  return apiClient<DashboardStats>("/talent/dashboard");
}

/**
 * Get My Services
 * GET /talent/services
 */
export async function getServerMyServices(): Promise<Service[]> {
  return apiClient<Service[]>("/talent/services");
}

/**
 * Get Talent's Services (Public)
 * GET /talent/:talentId/services
 */
export async function getServerTalentServices(
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
 * Get Talent's Recommendations (Public)
 * GET /talent/:talentUserId/recommendations
 */
export async function getServerTalentRecommendations(
  talentUserId: string,
): Promise<TalentRecommendationDto[]> {
  return apiClient<TalentRecommendationDto[]>(
    `/talent/${talentUserId}/recommendations`,
  );
}
