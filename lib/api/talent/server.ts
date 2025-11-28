/**
 * Server-side Talent API Client
 * Used only in Next.js Server Components and Server Actions
 * Retrieves auth token from cookies via Next.js
 */

import serverApiClient from "@/lib/api/server-client";
import type { APIProfileData } from "@/lib/profileMapper";
import type {
  TalentProfile,
  DashboardStats,
  Service,
  TalentRecommendationDto,
  RecommendationStatsDto,
} from "./types";

/**
 * Get Current User's Talent Profile (Server-side)
 * GET /talent/me
 */
export async function getServerCurrentProfile(): Promise<TalentProfile> {
  return serverApiClient<TalentProfile>("/talent/me");
}

/**
 * Get Dashboard Statistics (Server-side)
 * GET /talent/dashboard
 */
export async function getServerDashboardStats(): Promise<DashboardStats> {
  return serverApiClient<DashboardStats>("/talent/dashboard");
}

/**
 * Get My Services (Server-side)
 * GET /talent/services
 */
export async function getServerMyServices(): Promise<Service[]> {
  return serverApiClient<Service[]>("/talent/services");
}

/**
 * Get Talent's Services (Server-side, Public)
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

  return serverApiClient<Service[]>(endpoint);
}

/**
 * Get Talent's Recommendations (Server-side, Public)
 * GET /talent/:talentUserId/recommendations
 */
export async function getServerTalentRecommendations(
  talentUserId: string,
): Promise<TalentRecommendationDto[]> {
  return serverApiClient<TalentRecommendationDto[]>(
    `/talent/${talentUserId}/recommendations`,
  );
}
