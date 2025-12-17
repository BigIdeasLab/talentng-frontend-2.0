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
  const response = await apiClient<PaginatedOpportunitiesResponse>(endpoint);
  return response;
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

export const saveOpportunity = async (id: string): Promise<Opportunity> => {
  return apiClient<Opportunity>(`/opportunities/${id}/save`, {
    method: "POST",
    body: {},
  });
};

export const unsaveOpportunity = async (id: string): Promise<void> => {
  return apiClient<void>(`/opportunities/${id}/save`, {
    method: "DELETE",
  });
};

export const getSaveStatus = async (
  id: string
): Promise<{ saved: boolean }> => {
  return apiClient<{ saved: boolean }>(`/opportunities/${id}/is-saved`);
};

export const getSavedOpportunities = async (
  limit = 20,
  offset = 0
): Promise<PaginatedOpportunitiesResponse> => {
  const query = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });
  const response = await apiClient<PaginatedOpportunitiesResponse>(
    `/opportunities/saved?${query.toString()}`
  );
  return response;
};

// Export types
export type { Opportunity, GetOpportunitiesParams, PaginatedOpportunitiesResponse };
