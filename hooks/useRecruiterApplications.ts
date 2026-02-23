/**
 * Recruiter Application Hooks
 * React Query hooks for recruiter-specific application management
 * Targets /recruiter/applications and shared /applications/:id endpoints
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getRecruiterApplications,
  getApplicationById,
  updateApplicationStatus,
  scheduleInterview,
  rescheduleInterview,
  cancelInterview,
  completeInterview,
  sendInvitations,
  leaveRecommendation,
  type Application,
  type ScheduleInterviewInput,
  type CompleteInterviewInput,
  type RescheduleInterviewInput,
  type InvitationResponse,
} from "@/lib/api/applications";

interface RecruiterApplicationsParams {
  opportunityId?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

/**
 * Get applications for the recruiter (optionally filtered by opportunity)
 * GET /recruiter/applications
 */
export function useRecruiterApplicationsQuery(
  params: RecruiterApplicationsParams = {},
) {
  return useQuery({
    queryKey: ["applications", "recruiter", params],
    queryFn: () => getRecruiterApplications(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: true,
  });
}

/**
 * Get a single application by ID
 */
export function useApplicationQuery(id: string) {
  return useQuery({
    queryKey: ["applications", "recruiter", "detail", id],
    queryFn: () => getApplicationById(id),
    staleTime: 2 * 60 * 1000,
    enabled: !!id,
  });
}

/**
 * Update application status (shortlist / reject / hire)
 * PATCH /applications/:id
 */
export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      applicationId,
      status,
    }: {
      applicationId: string;
      status: "shortlisted" | "rejected" | "hired";
    }) => updateApplicationStatus(applicationId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications", "recruiter"] });
    },
  });
}

/**
 * Schedule an interview for an application
 * POST /applications/:id/schedule-interview
 */
export function useScheduleInterview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      applicationId,
      input,
    }: {
      applicationId: string;
      input: ScheduleInterviewInput;
    }) => scheduleInterview(applicationId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications", "recruiter"] });
    },
  });
}

/**
 * Reschedule an existing interview
 * POST /applications/:id/interviews/:interviewId/reschedule
 */
export function useRescheduleInterview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      applicationId,
      interviewId,
      input,
    }: {
      applicationId: string;
      interviewId: string;
      input: RescheduleInterviewInput;
    }) => rescheduleInterview(applicationId, interviewId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications", "recruiter"] });
    },
  });
}

/**
 * Cancel an interview
 * DELETE /applications/:id/interviews/:interviewId
 */
export function useCancelInterview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      applicationId,
      interviewId,
      reason,
    }: {
      applicationId: string;
      interviewId: string;
      reason?: string;
    }) => cancelInterview(applicationId, interviewId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications", "recruiter"] });
    },
  });
}

/**
 * Mark an interview as complete
 * POST /applications/:id/interviews/:interviewId/complete
 */
export function useCompleteInterview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      applicationId,
      interviewId,
      input,
    }: {
      applicationId: string;
      interviewId: string;
      input: CompleteInterviewInput;
    }) => completeInterview(applicationId, interviewId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications", "recruiter"] });
    },
  });
}

/**
 * Send invitations to talents for an opportunity (recruiter only)
 * POST /recruiter/invitations/send
 */
export function useSendInvitations() {
  return useMutation({
    mutationFn: (input: { opportunityId: string; talentIds: string[] }) =>
      sendInvitations(input),
  });
}

/**
 * Leave a recommendation for a hired talent
 * POST /applications/:id/recommendation
 */
export function useLeaveRecommendation() {
  return useMutation({
    mutationFn: ({
      applicationId,
      input,
    }: {
      applicationId: string;
      input: { title: string; comment?: string; rating?: number };
    }) => leaveRecommendation(applicationId, input),
  });
}
