/**
 * Simple React Query hook for opportunities
 * Replaces useOpportunitiesManager with cleaner, more testable approach
 * Uses TanStack React Query for state management
 */

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  postOpportunity,
  deleteOpportunity,
  saveOpportunity,
  unsaveOpportunity,
  getSaveStatus,
  getSavedOpportunities,
  type Opportunity,
  type GetOpportunitiesParams,
  type PaginatedOpportunitiesResponse,
} from "@/lib/services/opportunities-service";

/**
 * Fetch all opportunities (with optional filters/pagination)
 */
export function useOpportunitiesQuery(params?: GetOpportunitiesParams) {
  return useQuery({
    queryKey: ["opportunities", params],
    queryFn: () => getOpportunities(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch a single opportunity by ID
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
 * Create a new opportunity
 */
export function useCreateOpportunity() {
  return useMutation({
    mutationFn: (data: Partial<Opportunity>) => createOpportunity(data),
  });
}

/**
 * Update an existing opportunity
 */
export function useUpdateOpportunity() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Opportunity> }) =>
      updateOpportunity(id, data),
  });
}

/**
 * Post (publish) an opportunity
 */
export function usePostOpportunity() {
  return useMutation({
    mutationFn: (id: string) => postOpportunity(id),
  });
}

/**
 * Delete an opportunity
 */
export function useDeleteOpportunity() {
  return useMutation({
    mutationFn: (id: string) => deleteOpportunity(id),
  });
}

/**
 * Update opportunity status (active/closed/draft)
 */
export function useUpdateOpportunityStatus() {
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "active" | "closed" | "draft";
    }) => updateOpportunity(id, { status }),
  });
}

/**
 * Save an opportunity
 */
export function useSaveOpportunity() {
  return useMutation({
    mutationFn: (id: string) => saveOpportunity(id),
  });
}

/**
 * Unsave an opportunity
 */
export function useUnsaveOpportunity() {
  return useMutation({
    mutationFn: (id: string) => unsaveOpportunity(id),
  });
}

/**
 * Check if an opportunity is saved
 */
export function useCheckSaveStatus(id: string) {
  return useQuery({
    queryKey: ["opportunity-save-status", id],
    queryFn: () => getSaveStatus(id),
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: !!id,
  });
}

/**
 * Fetch saved opportunities
 */
export function useSavedOpportunitiesQuery(limit = 20, offset = 0) {
  return useQuery({
    queryKey: ["saved-opportunities", { limit, offset }],
    queryFn: () => getSavedOpportunities(limit, offset),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Legacy hook for backward compatibility
 * Provides the old useOpportunitiesManager interface
 * (Deprecated - use individual hooks above instead)
 */
export function useOpportunitiesManager() {
  const getAllQuery = useQuery({
    queryKey: ["opportunities"],
    queryFn: () => getOpportunities(),
    staleTime: 5 * 60 * 1000,
    enabled: false, // Don't auto-fetch
  });

  const createMutation = useCreateOpportunity();
  const updateMutation = useUpdateOpportunity();
  const deleteMutation = useDeleteOpportunity();
  const statusMutation = useUpdateOpportunityStatus();
  const saveMutation = useSaveOpportunity();
  const unsaveMutation = useUnsaveOpportunity();
  const saveStatusQuery = useQuery({
    queryKey: ["save-status"],
    queryFn: async () => ({ saved: false }),
    enabled: false,
  });

  return {
    isLoading:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending ||
      statusMutation.isPending ||
      saveMutation.isPending ||
      unsaveMutation.isPending,
    error:
      createMutation.error ||
      updateMutation.error ||
      deleteMutation.error ||
      statusMutation.error ||
      saveMutation.error ||
      unsaveMutation.error ||
      null,
    getAll: (params?: GetOpportunitiesParams) => getOpportunities(params),
    getById: (id: string) => getOpportunityById(id),
    create: (data: Partial<Opportunity>) => createMutation.mutateAsync(data),
    update: (id: string, data: Partial<Opportunity>) =>
      updateMutation.mutateAsync({ id, data }),
    post: (id: string) => postOpportunity(id),
    delete: (id: string) => deleteMutation.mutateAsync(id),
    updateStatus: (id: string, status: "active" | "closed" | "draft") =>
      statusMutation.mutateAsync({ id, status }),
    save: (id: string) => saveMutation.mutateAsync(id),
    unsave: (id: string) => unsaveMutation.mutateAsync(id),
    checkSaveStatus: (id: string) => getSaveStatus(id),
    getSaved: (limit?: number, offset?: number) =>
      getSavedOpportunities(limit || 20, offset || 0),
  };
}
