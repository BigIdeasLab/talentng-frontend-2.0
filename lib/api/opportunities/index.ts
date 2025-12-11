/**
 * Opportunities API Client
 * Handles all opportunity-related API calls
 */

import apiClient from "@/lib/api";
import type { Opportunity, GetOpportunitiesParams, PaginatedOpportunitiesResponse } from "./types";

export const getOpportunities = async (
  params?: GetOpportunitiesParams
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
  return apiClient<PaginatedOpportunitiesResponse>(endpoint);
};

export const getOpportunityById = async (id: string): Promise<Opportunity> => {
  const endpoint = `/opportunities/${id}`;
  return apiClient<Opportunity>(endpoint);
};

export const createOpportunity = async (
  data: Partial<Opportunity>
): Promise<Opportunity> => {
  return apiClient<Opportunity>("/opportunities", {
    method: "POST",
    body: data,
  });
};

export const updateOpportunity = async (
  id: string,
  data: Partial<Opportunity>
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

// Export types
export type { Opportunity, GetOpportunitiesParams, PaginatedOpportunitiesResponse };
