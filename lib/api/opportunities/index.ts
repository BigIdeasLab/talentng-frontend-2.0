/**
 * Opportunities API Client
 * Handles all opportunity-related API calls
 */

import apiClient from "@/lib/api";
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
export const getOpportunities = async (
  params?: GetOpportunitiesParams,
): Promise<PaginatedOpportunitiesResponse> => {
  const query = new URLSearchParams();
  if (params) {
    for (const key in params) {
      const value = params[key as keyof GetOpportunitiesParams];
      if (value !== undefined && value !== null) {
        query.append(key, String(value));
      }
    }
  }
  const queryString = query.toString();
  const endpoint = `/opportunities${queryString ? `?${queryString}` : ""}`;
  const response = await apiClient<PaginatedOpportunitiesResponse>(endpoint);
  return response;
};

/**
 * Browse opportunities as a talent
 * GET /talent/opportunities
 */
export const getTalentOpportunities = async (
  params?: GetOpportunitiesParams,
): Promise<PaginatedOpportunitiesResponse> => {
  const query = new URLSearchParams();
  if (params) {
    for (const key in params) {
      const value = params[key as keyof GetOpportunitiesParams];
      if (value !== undefined && value !== null) {
        query.append(key, String(value));
      }
    }
  }
  const queryString = query.toString();
  const endpoint = `/talent/opportunities${queryString ? `?${queryString}` : ""}`;
  return apiClient<PaginatedOpportunitiesResponse>(endpoint);
};

/**
 * List recruiter's posted opportunities
 * GET /recruiter/opportunities
 */
export const getRecruiterOpportunities = async (
  params?: GetOpportunitiesParams,
): Promise<PaginatedOpportunitiesResponse> => {
  const query = new URLSearchParams();
  if (params) {
    for (const key in params) {
      const value = params[key as keyof GetOpportunitiesParams];
      if (value !== undefined && value !== null) {
        query.append(key, String(value));
      }
    }
  }
  const queryString = query.toString();
  const endpoint = `/recruiter/opportunities${queryString ? `?${queryString}` : ""}`;
  return apiClient<PaginatedOpportunitiesResponse>(endpoint);
};

export const getOpportunityById = async (id: string): Promise<Opportunity> => {
  const endpoint = `/opportunities/${id}`;
  return apiClient<Opportunity>(endpoint);
};

/**
 * Create opportunity (recruiter only)
 * POST /recruiter/opportunities
 */
export const createOpportunity = async (
  data: Partial<Opportunity>,
): Promise<Opportunity> => {
  return apiClient<Opportunity>("/recruiter/opportunities", {
    method: "POST",
    body: data,
  });
};

export const updateOpportunity = async (
  id: string,
  data: Partial<Opportunity>,
): Promise<Opportunity> => {
  return apiClient<Opportunity>(`/opportunities/${id}`, {
    method: "PATCH",
    body: data,
  });
};

export const postOpportunity = async (id: string): Promise<Opportunity> => {
  return apiClient<Opportunity>(`/opportunities/${id}`, {
    method: "PATCH",
    body: { status: "active" },
  });
};

export const deleteOpportunity = async (id: string): Promise<void> => {
  return apiClient<void>(`/opportunities/${id}`, {
    method: "DELETE",
  });
};

/**
 * Save an opportunity (talent only)
 * POST /talent/opportunities/:id/save
 */
export const saveOpportunity = async (id: string): Promise<Opportunity> => {
  return apiClient<Opportunity>(`/talent/opportunities/${id}/save`, {
    method: "POST",
    body: {},
  });
};

/**
 * Unsave an opportunity (talent only)
 * DELETE /talent/opportunities/:id/save
 */
export const unsaveOpportunity = async (id: string): Promise<void> => {
  return apiClient<void>(`/talent/opportunities/${id}/save`, {
    method: "DELETE",
  });
};

/**
 * Check if opportunity is saved (talent only)
 * GET /talent/opportunities/:id/is-saved
 */
export const getSaveStatus = async (
  id: string,
): Promise<{ saved: boolean }> => {
  return apiClient<{ saved: boolean }>(`/talent/opportunities/${id}/is-saved`);
};

/**
 * Get saved opportunities (talent only)
 * GET /talent/opportunities/saved
 */
export const getSavedOpportunities = async (
  limit = 20,
  offset = 0,
): Promise<PaginatedOpportunitiesResponse> => {
  const query = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });
  const response = await apiClient<PaginatedOpportunitiesResponse>(
    `/talent/opportunities/saved?${query.toString()}`,
  );
  return response;
};

export const reopenOpportunity = async (
  id: string,
): Promise<ReopenOpportunityResponse> => {
  return apiClient<ReopenOpportunityResponse>(`/opportunities/${id}/reopen`, {
    method: "POST",
  });
};

// Export types
export type {
  Opportunity,
  GetOpportunitiesParams,
  PaginatedOpportunitiesResponse,
  ReopenOpportunityResponse,
};
