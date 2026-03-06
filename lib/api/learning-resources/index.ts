/**
 * Learning Resources API Client
 * Handles all learning resource-related API calls
 */

import apiClient from "@/lib/api";
import type {
  LearningResource,
  GetLearningResourcesParams,
  PaginatedLearningResourcesResponse,
} from "./types";

export const getLearningResources = async (
  params?: GetLearningResourcesParams,
): Promise<PaginatedLearningResourcesResponse> => {
  const query = new URLSearchParams();
  if (params) {
    for (const key in params) {
      const value = params[key as keyof GetLearningResourcesParams];
      if (value !== undefined && value !== null) {
        query.append(key, String(value));
      }
    }
  }
  const queryString = query.toString();
  const endpoint = `/learning-resources${queryString ? `?${queryString}` : ""}`;
  return apiClient<PaginatedLearningResourcesResponse>(endpoint);
};

// Export types
export type {
  LearningResource,
  GetLearningResourcesParams,
  PaginatedLearningResourcesResponse,
};
