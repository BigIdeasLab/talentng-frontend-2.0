/**
 * Opportunities API Client
 * Handles all opportunity-related API calls
 */

import apiClient from "@/lib/api";
import type { Opportunity, GetOpportunitiesParams } from "./types";

export const getOpportunities = async (
  params?: GetOpportunitiesParams
): Promise<Opportunity[]> => {
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
  return apiClient<Opportunity[]>(endpoint);
};

export const getOpportunityById = async (id: string): Promise<Opportunity> => {
  const endpoint = `/opportunities/${id}`;
  return apiClient<Opportunity>(endpoint);
};

// Export types
export type { Opportunity, GetOpportunitiesParams };
