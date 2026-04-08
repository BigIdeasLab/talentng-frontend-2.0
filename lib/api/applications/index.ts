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
  RescheduleInterviewInput,
  PaginatedApplicationsResponse,
} from "./types";

/**
 * Submit an application (talent only)
 * POST /talent/applications
 * Handles FormData for file uploads
 */
export async function submitApplication(
  submission: ApplicationSubmission,
): Promise<ApplicationResponse> {
  return apiClient<ApplicationResponse>("/talent/applications", {
    method: "POST",
    body: submission,
  });
}

/**
 * Legacy method - submit basic application (talent only)
 * POST /talent/applications
 */
export async function applyToOpportunity(
  application: Application,
): Promise<ApplicationResponse> {
  return apiClient<ApplicationResponse>("/talent/applications", {
    method: "POST",
    body: application,
  });
}

/**
 * Get all applications for current talent
 * GET /talent/applications
 */
export async function getTalentApplications(params?: {
  q?: string;
  status?: string;
  dateRange?: "today" | "week" | "month";
  limit?: number;
  offset?: number;
}): Promise<PaginatedApplicationsResponse> {
  const query = new URLSearchParams();
  if (params?.q) query.append("q", params.q);
  if (params?.status) query.append("status", params.status);
  if (params?.dateRange) query.append("dateRange", params.dateRange);
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.offset) query.append("offset", String(params.offset));
  const queryString = query.toString();
  return apiClient<PaginatedApplicationsResponse>(
    `/talent/applications${queryString ? `?${queryString}` : ""}`,
  );
}

/**
 * Get applications for a recruiter (with filters)
 * GET /recruiter/applications
 */
export async function getRecruiterApplications(params: {
  status?: string;
  opportunityId?: string;
  q?: string;
  location?: string;
  skills?: string;
  dateRange?: "today" | "week" | "month";
  sortBy?: "newest" | "oldest" | "name-asc" | "name-desc";
  limit?: number;
  offset?: number;
}): Promise<PaginatedApplicationsResponse> {
  const query = new URLSearchParams();
  if (params.status) query.append("status", params.status);
  if (params.opportunityId) query.append("opportunityId", params.opportunityId);
  if (params.q) query.append("q", params.q);
  if (params.location) query.append("location", params.location);
  if (params.skills) query.append("skills", params.skills);
  if (params.dateRange) query.append("dateRange", params.dateRange);
  if (params.sortBy) query.append("sortBy", params.sortBy);
  if (params.limit) query.append("limit", String(params.limit));
  if (params.offset) query.append("offset", String(params.offset));

  const queryString = query.toString();
  const endpoint = `/recruiter/applications${queryString ? `?${queryString}` : ""}`;

  return apiClient<PaginatedApplicationsResponse>(endpoint);
}

/**
 * Get all applications for current user (generic, kept for backward compat)
 * GET /applications
 */
export async function getApplications(): Promise<Application[]> {
  return apiClient<Application[]>("/applications");
}

/**
 * Get a single application by ID
 */
export async function getApplicationById(
  applicationId: string,
): Promise<Application> {
  return apiClient<Application>(`/applications/${applicationId}`);
}

/**
 * Get applications with filters (generic, kept for backward compat)
 */
export async function getApplicationsWithFilters(params: {
  status?: string;
  opportunityId?: string;
  searchQuery?: string;
  location?: string;
  skills?: string;
  dateRange?: "today" | "week" | "month";
  sortBy?: "newest" | "oldest" | "name-asc" | "name-desc";
  limit?: number;
  offset?: number;
}): Promise<Application[]> {
  const query = new URLSearchParams();
  if (params.status) query.append("status", params.status);
  if (params.opportunityId) query.append("opportunityId", params.opportunityId);
  if (params.searchQuery) query.append("searchQuery", params.searchQuery);
  if (params.location) query.append("location", params.location);
  if (params.skills) query.append("skills", params.skills);
  if (params.dateRange) query.append("dateRange", params.dateRange);
  if (params.sortBy) query.append("sortBy", params.sortBy);
  if (params.limit) query.append("limit", String(params.limit));
  if (params.offset) query.append("offset", String(params.offset));

  const queryString = query.toString();
  const endpoint = `/applications${queryString ? `?${queryString}` : ""}`;

  return apiClient<Application[]>(endpoint);
}

/**
 * Delete an application
 */
export async function deleteApplication(applicationId: string): Promise<void> {
  return apiClient<void>(`/applications/${applicationId}`, {
    method: "DELETE",
  });
}

/**
 * Update application status (shortlist, reject, hire)
 * PATCH /applications/{id}
 */
export async function updateApplicationStatus(
  applicationId: string,
  status: "shortlisted" | "rejected" | "hired",
): Promise<Application> {
  return apiClient<Application>(`/recruiter/applications/${applicationId}`, {
    method: "PATCH",
    body: { status },
  });
}

/**
 * Schedule an interview for an application
 * POST /applications/{id}/schedule-interview
 */
export async function scheduleInterview(
  applicationId: string,
  input: {
    scheduledDate: string;
    message?: string;
    meetingLink?: string;
  },
): Promise<Application> {
  return apiClient<Application>(
    `/recruiter/applications/${applicationId}/schedule-interview`,
    {
      method: "POST",
      body: input,
    },
  );
}

/**
 * Reschedule an interview
 * POST /applications/{id}/interviews/{interviewId}/reschedule
 */
export async function rescheduleInterview(
  applicationId: string,
  interviewId: string,
  input: RescheduleInterviewInput,
): Promise<Application> {
  return apiClient<Application>(
    `/recruiter/applications/${applicationId}/interviews/${interviewId}/reschedule`,
    {
      method: "POST",
      body: input,
    },
  );
}

/**
 * Cancel an interview
 * DELETE /applications/{id}/interviews/{interviewId}
 */
export async function cancelInterview(
  applicationId: string,
  interviewId: string,
  reason?: string,
): Promise<Application> {
  return apiClient<Application>(
    `/recruiter/applications/${applicationId}/interviews/${interviewId}/cancel`,
    {
      method: "POST",
      body: { reason },
    },
  );
}

/**
 * Complete an interview (mark as done and add notes/rating)
 * POST /applications/{id}/interviews/{interviewId}/complete
 */
export async function completeInterview(
  applicationId: string,
  interviewId: string,
  input: {
    notes?: string;
    rating?: number;
    verdict?: "pass" | "fail";
  },
): Promise<Application> {
  return apiClient<Application>(
    `/recruiter/applications/${applicationId}/interviews/${interviewId}/complete`,
    {
      method: "POST",
      body: input,
    },
  );
}

/**
 * Send job invitations to talents (recruiter only)
 * POST /recruiter/invitations/send
 */
export async function sendInvitations(input: {
  opportunityId: string;
  talentIds: string[];
}): Promise<InvitationResponse[]> {
  return apiClient<InvitationResponse[]>("/recruiter/invitations/send", {
    method: "POST",
    body: input,
  });
}

/**
 * Respond to an invitation (accept/decline)
 * PATCH /applications/invitations/{id}/respond
 */
export async function respondToInvitation(
  applicationId: string,
  response: "accepted" | "declined",
): Promise<Application> {
  return apiClient<Application>(
    `/applications/invitations/${applicationId}/respond`,
    {
      method: "PATCH",
      body: { response },
    },
  );
}

/**
 * Leave a recommendation for a hired talent
 * POST /applications/{id}/recommendation
 */
export async function leaveRecommendation(
  applicationId: string,
  input: {
    title: string;
    comment?: string;
    rating?: number;
  },
): Promise<any> {
  return apiClient(`/recruiter/applications/${applicationId}/recommendation`, {
    method: "POST",
    body: input,
  });
}

/**
 * Get unified recruiter interview feed
 * GET /recruiter/interviews
 */
export async function getRecruiterInterviews(params?: {
  q?: string;
  dateRange?: "today" | "week" | "month";
  limit?: number;
  offset?: number;
}): Promise<{
  data: any[];
  pagination: any;
}> {
  const query = new URLSearchParams();
  if (params?.q) query.append("q", params.q);
  if (params?.dateRange) query.append("dateRange", params.dateRange);
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.offset) query.append("offset", String(params.offset));
  const queryString = query.toString();
  return apiClient<{ data: any[]; pagination: any }>(
    `/recruiter/interviews${queryString ? `?${queryString}` : ""}`,
  );
}

/**
 * Get recruiter interview count for badges
 * GET /recruiter/interviews/count
 */
export async function getRecruiterInterviewsCount(): Promise<{
  count: number;
}> {
  return apiClient<{ count: number }>("/recruiter/interviews/count");
}

/**
 * Get recruiter applicants count for badges
 * GET /recruiter/applications/count
 */
export async function getRecruiterApplicationsCount(): Promise<{
  count: number;
}> {
  return apiClient<{ count: number }>("/recruiter/applications/count");
}

/**
 * Get talent pending invitations count for badges
 * GET /talent/applications/pending-invites/count
 */
export async function getTalentPendingInvitesCount(): Promise<{
  count: number;
}> {
  return apiClient<{ count: number }>(
    "/talent/applications/pending-invites/count",
  );
}

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
  PaginatedApplicationsResponse,
  PaginationInfo,
} from "./types";
