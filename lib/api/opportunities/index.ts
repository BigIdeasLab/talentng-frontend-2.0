/**
 * Opportunities API Client
 * Handles all opportunity-related API calls
 */

import apiClient from "@/lib/api";
import { buildQueryString } from "@/lib/utils/query";
import type {
  Opportunity,
  GetOpportunitiesParams,
  PaginatedOpportunitiesResponse,
  ReopenOpportunityResponse,
} from "./types";

/**
 * Browse opportunities (generic, used for public browsing)
 * GET /opportunities
 */
export async function getOpportunities(
  params?: GetOpportunitiesParams,
): Promise<PaginatedOpportunitiesResponse> {
  const queryString = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const endpoint = `/opportunities${queryString ? `?${queryString}` : ""}`;
  return apiClient<PaginatedOpportunitiesResponse>(endpoint);
}

/**
 * Browse opportunities as a talent
 * GET /talent/opportunities
 */
export async function getTalentOpportunities(
  params?: GetOpportunitiesParams,
): Promise<PaginatedOpportunitiesResponse> {
  const queryString = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const endpoint = `/talent/opportunities${queryString ? `?${queryString}` : ""}`;
  return apiClient<PaginatedOpportunitiesResponse>(endpoint);
}

/**
 * List recruiter's posted opportunities
 * GET /recruiter/opportunities
 */
export async function getRecruiterOpportunities(
  params?: GetOpportunitiesParams,
): Promise<PaginatedOpportunitiesResponse> {
  const queryString = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const endpoint = `/recruiter/opportunities${queryString ? `?${queryString}` : ""}`;
  return apiClient<PaginatedOpportunitiesResponse>(endpoint);
}

export async function getOpportunityById(id: string): Promise<Opportunity> {
  const endpoint = `/opportunities/${id}`;
  return apiClient<Opportunity>(endpoint);
}

/**
 * Create opportunity (recruiter only)
 * POST /recruiter/opportunities
 */
export async function createOpportunity(
  data: Partial<Opportunity>,
): Promise<Opportunity> {
  return apiClient<Opportunity>("/recruiter/opportunities", {
    method: "POST",
    body: data,
  });
}

export async function updateOpportunity(
  id: string,
  data: Partial<Opportunity>,
): Promise<Opportunity> {
  return apiClient<Opportunity>(`/opportunities/${id}`, {
    method: "PATCH",
    body: data,
  });
}

export async function postOpportunity(id: string): Promise<Opportunity> {
  return apiClient<Opportunity>(`/opportunities/${id}`, {
    method: "PATCH",
    body: { status: "active" },
  });
}

export async function deleteOpportunity(id: string): Promise<void> {
  return apiClient<void>(`/opportunities/${id}`, {
    method: "DELETE",
  });
}

/**
 * Save an opportunity (talent only)
 * POST /talent/opportunities/:id/save
 */
export async function saveOpportunity(id: string): Promise<Opportunity> {
  return apiClient<Opportunity>(`/talent/opportunities/${id}/save`, {
    method: "POST",
    body: {},
  });
}

/**
 * Unsave an opportunity (talent only)
 * DELETE /talent/opportunities/:id/save
 */
export async function unsaveOpportunity(id: string): Promise<void> {
  return apiClient<void>(`/talent/opportunities/${id}/save`, {
    method: "DELETE",
  });
}

/**
 * Check if opportunity is saved (talent only)
 * GET /talent/opportunities/:id/is-saved
 */
export async function getSaveStatus(
  id: string,
): Promise<{ saved: boolean }> {
  return apiClient<{ saved: boolean }>(`/talent/opportunities/${id}/is-saved`);
}

/**
 * Get saved opportunities (talent only)
 * GET /talent/opportunities/saved
 */
export async function getSavedOpportunities(
  limit = 20,
  offset = 0,
): Promise<PaginatedOpportunitiesResponse> {
  const query = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });
  const response = await apiClient<PaginatedOpportunitiesResponse>(
    `/talent/opportunities/saved?${query.toString()}`,
  );
  return response;
}

export async function reopenOpportunity(
  id: string,
): Promise<ReopenOpportunityResponse> {
  return apiClient<ReopenOpportunityResponse>(`/opportunities/${id}/reopen`, {
    method: "POST",
  });
}

// Export types
export type {
  Opportunity,
  GetOpportunitiesParams,
  PaginatedOpportunitiesResponse,
  ReopenOpportunityResponse,
};
