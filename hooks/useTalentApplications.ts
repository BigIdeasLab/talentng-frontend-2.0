/**
 * Talent Application Hooks
 * React Query hooks for talent-specific application interactions
 * Targets /talent/applications endpoints
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getTalentApplications,
  submitApplication,
  respondToInvitation,
  type Application,
  type ApplicationSubmission,
  type ApplicationResponse,
} from "@/lib/api/applications";

/**
 * Get all applications for the current talent
 * GET /talent/applications
 */
export function useTalentApplicationsQuery() {
  return useQuery({
    queryKey: ["applications", "talent"],
    queryFn: () => getTalentApplications(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Submit an application to an opportunity (talent only)
 * POST /talent/applications
 */
export function useSubmitApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ApplicationSubmission) =>
      submitApplication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications", "talent"] });
    },
  });
}

/**
 * Accept or decline an invitation (talent only)
 * PATCH /applications/invitations/:id/respond
 */
export function useRespondToInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      applicationId,
      response,
    }: {
      applicationId: string;
      response: "accepted" | "declined";
    }) => respondToInvitation(applicationId, response),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications", "talent"] });
    },
  });
}
