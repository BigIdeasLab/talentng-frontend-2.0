/**
 * Talent Opportunity Hooks
 * React Query hooks for talent-specific opportunity interactions
 * Targets /talent/opportunities/* endpoints
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getTalentOpportunities,
  getOpportunityById,
  saveOpportunity,
  unsaveOpportunity,
  getSaveStatus,
  getSavedOpportunities,
  type Opportunity,
  type GetOpportunitiesParams,
  type PaginatedOpportunitiesResponse,
} from "@/lib/api/opportunities";

/**
 * Browse opportunities as Talent
 * GET /talent/opportunities
 */
export function useTalentOpportunitiesQuery(params?: GetOpportunitiesParams) {
  return useQuery({
    queryKey: ["opportunities", "talent", params],
    queryFn: () => getTalentOpportunities(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch a single opportunity by ID (shared)
 */
export function useOpportunityQuery(id: string) {
  return useQuery({
    queryKey: ["opportunity", id],
    queryFn: () => getOpportunityById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}

/**
 * Get talent's saved opportunities
 * GET /talent/opportunities/saved
 */
export function useSavedOpportunitiesQuery(limit = 20, offset = 0) {
  return useQuery({
    queryKey: ["opportunities", "talent", "saved", { limit, offset }],
    queryFn: () => getSavedOpportunities(limit, offset),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Check if a specific opportunity is saved
 * GET /talent/opportunities/:id/is-saved
 */
export function useOpportunitySaveStatus(id: string) {
  return useQuery({
    queryKey: ["opportunities", "talent", "save-status", id],
    queryFn: () => getSaveStatus(id),
    staleTime: 60 * 1000, // 1 minute
    enabled: !!id,
  });
}

/**
 * Save an opportunity mutation
 * POST /talent/opportunities/:id/save
 */
export function useSaveOpportunity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => saveOpportunity(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({
        queryKey: ["opportunities", "talent", "saved"],
      });
      queryClient.invalidateQueries({
        queryKey: ["opportunities", "talent", "save-status", id],
      });
    },
  });
}

/**
 * Unsave an opportunity mutation
 * DELETE /talent/opportunities/:id/save
 */
export function useUnsaveOpportunity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => unsaveOpportunity(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({
        queryKey: ["opportunities", "talent", "saved"],
      });
      queryClient.invalidateQueries({
        queryKey: ["opportunities", "talent", "save-status", id],
      });
    },
  });
}
