/**
 * Recruiter Opportunity Hooks
 * React Query hooks for recruiter-specific opportunity management
 * Targets /recruiter/opportunities/* and /opportunities/:id endpoints
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getRecruiterOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  postOpportunity,
  deleteOpportunity,
  reopenOpportunity,
  type Opportunity,
  type GetOpportunitiesParams,
  type PaginatedOpportunitiesResponse,
  type ReopenOpportunityResponse,
} from "@/lib/api/opportunities";

/**
 * List recruiter's posted opportunities
 * GET /recruiter/opportunities
 */
export function useRecruiterOpportunitiesQuery(
  params?: GetOpportunitiesParams,
) {
  return useQuery({
    queryKey: ["opportunities", "recruiter", params],
    queryFn: () => getRecruiterOpportunities(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch a single opportunity by ID
 * GET /opportunities/:id
 */
export function useRecruiterOpportunityQuery(id: string) {
  return useQuery({
    queryKey: ["opportunity", id],
    queryFn: () => getOpportunityById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}

/**
 * Create a new opportunity (draft)
 * POST /recruiter/opportunities
 */
export function useCreateOpportunity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Opportunity>) => createOpportunity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["opportunities", "recruiter"],
      });
    },
  });
}

/**
 * Update an existing opportunity
 * PATCH /opportunities/:id
 */
export function useUpdateOpportunity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Opportunity> }) =>
      updateOpportunity(id, data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ["opportunities", "recruiter"],
      });
      queryClient.invalidateQueries({ queryKey: ["opportunity", id] });
    },
  });
}

/**
 * Post (publish) a draft opportunity
 * PATCH /opportunities/:id → { status: "active" }
 */
export function usePostOpportunity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => postOpportunity(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({
        queryKey: ["opportunities", "recruiter"],
      });
      queryClient.invalidateQueries({ queryKey: ["opportunity", id] });
    },
  });
}

/**
 * Delete an opportunity
 * DELETE /opportunities/:id
 */
export function useDeleteOpportunity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteOpportunity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["opportunities", "recruiter"],
      });
    },
  });
}

/**
 * Reopen a closed/filled opportunity
 * POST /opportunities/:id/reopen
 */
export function useReopenOpportunity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reopenOpportunity(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({
        queryKey: ["opportunities", "recruiter"],
      });
      queryClient.invalidateQueries({ queryKey: ["opportunity", id] });
    },
  });
}
