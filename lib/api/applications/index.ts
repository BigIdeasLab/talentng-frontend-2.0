/**
 * Applications API Client
 * Handles all application-related API calls for talent hiring workflow
 */

import apiClient from "@/lib/api";
import type {
  Application,
  ApplicationInterview,
  ApplicationSubmission,
  ApplicationResponse,
  InvitationResponse,
} from "./types";

/**
 * Submit an application (talent only)
 * POST /talent/applications
 * Handles FormData for file uploads
 */
export const submitApplication = async (
  submission: ApplicationSubmission & { files?: File[] },
): Promise<ApplicationResponse> => {
  // Create FormData for multipart upload
  const formData = new FormData();
  formData.append("opportunityId", submission.opportunityId);

  if (submission.note) {
    formData.append("note", submission.note);
  }

  // Add files if provided
  if (submission.files && submission.files.length > 0) {
    submission.files.forEach((file) => {
      formData.append("attachments", file, file.name);
    });
  }

  return apiClient<ApplicationResponse>("/talent/applications", {
    method: "POST",
    body: formData,
  });
};

/**
 * Legacy method - submit basic application (talent only)
 * POST /talent/applications
 */
export const applyToOpportunity = async (
  application: Application,
): Promise<ApplicationResponse> => {
  return apiClient<ApplicationResponse>("/talent/applications", {
    method: "POST",
    body: application,
  });
};

/**
 * Get all applications for current talent
 * GET /talent/applications
 */
export const getTalentApplications = async (): Promise<Application[]> => {
  return apiClient<Application[]>("/talent/applications");
};

/**
 * Get applications for a recruiter (with filters)
 * GET /recruiter/applications
 */
export const getRecruiterApplications = async (params: {
  status?: string;
  opportunityId?: string;
  limit?: number;
  offset?: number;
}): Promise<Application[]> => {
  const query = new URLSearchParams();
  if (params.status) query.append("status", params.status);
  if (params.opportunityId) query.append("opportunityId", params.opportunityId);
  if (params.limit) query.append("limit", String(params.limit));
  if (params.offset) query.append("offset", String(params.offset));

  const queryString = query.toString();
  const endpoint = `/recruiter/applications${queryString ? `?${queryString}` : ""}`;

  return apiClient<Application[]>(endpoint);
};

/**
 * Get all applications for current user (generic, kept for backward compat)
 * GET /applications
 */
export const getApplications = async (): Promise<Application[]> => {
  return apiClient<Application[]>("/applications");
};

/**
 * Get a single application by ID
 */
export const getApplicationById = async (
  applicationId: string,
): Promise<Application> => {
  return apiClient<Application>(`/applications/${applicationId}`);
};

/**
 * Get applications with filters (generic, kept for backward compat)
 */
export const getApplicationsWithFilters = async (params: {
  status?: string;
  opportunityId?: string;
  limit?: number;
  offset?: number;
}): Promise<Application[]> => {
  const query = new URLSearchParams();
  if (params.status) query.append("status", params.status);
  if (params.opportunityId) query.append("opportunityId", params.opportunityId);
  if (params.limit) query.append("limit", String(params.limit));
  if (params.offset) query.append("offset", String(params.offset));

  const queryString = query.toString();
  const endpoint = `/applications${queryString ? `?${queryString}` : ""}`;

  return apiClient<Application[]>(endpoint);
};

/**
 * Delete an application
 */
export const deleteApplication = async (
  applicationId: string,
): Promise<void> => {
  return apiClient<void>(`/applications/${applicationId}`, {
    method: "DELETE",
  });
};

/**
 * Update application status (shortlist, reject, hire)
 * PATCH /applications/{id}
 */
export const updateApplicationStatus = async (
  applicationId: string,
  status: "shortlisted" | "rejected" | "hired",
): Promise<Application> => {
  return apiClient<Application>(`/applications/${applicationId}`, {
    method: "PATCH",
    body: { status },
  });
};

/**
 * Schedule an interview for an application
 * POST /applications/{id}/schedule-interview
 */
export const scheduleInterview = async (
  applicationId: string,
  input: {
    scheduledDate: string;
    message?: string;
    meetingLink?: string;
  },
): Promise<Application> => {
  return apiClient<Application>(
    `/applications/${applicationId}/schedule-interview`,
    {
      method: "POST",
      body: input,
    },
  );
};

/**
 * Reschedule an interview
 * POST /applications/{id}/interviews/{interviewId}/reschedule
 */
export const rescheduleInterview = async (
  applicationId: string,
  interviewId: string,
  input: {
    newDate: string;
    message?: string;
  },
): Promise<Application> => {
  return apiClient<Application>(
    `/applications/${applicationId}/interviews/${interviewId}/reschedule`,
    {
      method: "POST",
      body: input,
    },
  );
};

/**
 * Cancel an interview
 * DELETE /applications/{id}/interviews/{interviewId}
 */
export const cancelInterview = async (
  applicationId: string,
  interviewId: string,
  reason?: string,
): Promise<Application> => {
  return apiClient<Application>(
    `/applications/${applicationId}/interviews/${interviewId}`,
    {
      method: "DELETE",
      body: reason ? { reason } : undefined,
    },
  );
};

/**
 * Complete an interview (mark as done and add notes/rating)
 * POST /applications/{id}/interviews/{interviewId}/complete
 */
export const completeInterview = async (
  applicationId: string,
  interviewId: string,
  input: {
    notes?: string;
    rating?: number;
    verdict?: "pass" | "fail";
  },
): Promise<Application> => {
  return apiClient<Application>(
    `/applications/${applicationId}/interviews/${interviewId}/complete`,
    {
      method: "POST",
      body: input,
    },
  );
};

/**
 * Send job invitations to talents (recruiter only)
 * POST /recruiter/invitations/send
 */
export const sendInvitations = async (input: {
  opportunityId: string;
  talentIds: string[];
}): Promise<InvitationResponse[]> => {
  return apiClient<InvitationResponse[]>("/recruiter/invitations/send", {
    method: "POST",
    body: input,
  });
};

/**
 * Respond to an invitation (accept/decline)
 * PATCH /applications/invitations/{id}/respond
 */
export const respondToInvitation = async (
  applicationId: string,
  response: "accepted" | "declined",
): Promise<Application> => {
  return apiClient<Application>(
    `/applications/invitations/${applicationId}/respond`,
    {
      method: "PATCH",
      body: { response },
    },
  );
};

/**
 * Leave a recommendation for a hired talent
 * POST /applications/{id}/recommendation
 */
export const leaveRecommendation = async (
  applicationId: string,
  input: {
    title: string;
    comment?: string;
    rating?: number;
  },
): Promise<any> => {
  return apiClient(`/applications/${applicationId}/recommendation`, {
    method: "POST",
    body: input,
  });
};

// Export types
export type {
  Application,
  ApplicationInterview,
  ApplicationSubmission,
  ApplicationResponse,
  ScheduleInterviewInput,
  CompleteInterviewInput,
  RescheduleInterviewInput,
  CreateRecommendationInput,
  SendInvitationInput,
  RespondToInvitationInput,
  InvitationResponse,
} from "./types";
