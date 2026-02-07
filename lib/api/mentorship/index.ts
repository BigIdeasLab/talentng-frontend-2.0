/**
 * Mentorship API Client
 * Handles all mentorship-related API calls for requests and sessions
 * Uses centralized apiClient from @/lib/api
 */

import apiClient from "@/lib/api";
import type {
  // Request types
  MentorshipRequest,
  CreateRequestInput,
  RequestsQueryParams,
  PendingCountResponse,
  AcceptRequestResponse,
  RejectRequestInput,
  MyRequestsResponse,
  // Session types
  MentorshipSession,
  SessionsQueryParams,
  SessionsListResponse,
  SessionsMetaResponse,
  RescheduleSessionInput,
  CancelSessionInput,
  // Review types
  SessionReview,
  CreateReviewInput,
  // Availability types
  SetAvailabilityInput,
  MentorAvailabilityResponse,
  GetAvailabilityParams,
  // Dashboard types
  MentorDashboardStats,
  // Paginated response
  PaginatedResponse,
  // Public mentor types
  PublicMentor,
  PublicMentorDetail,
} from "./types";

// ============ Discovery (Public) - /mentors ============

/**
 * List all available mentors
 * GET /mentors
 */
export async function listMentors(): Promise<PublicMentor[]> {
  return apiClient<PublicMentor[]>("/mentors");
}

/**
 * Search mentors by name, expertise, or bio
 * GET /mentors/search?q={query}
 */
export async function searchMentors(query: string): Promise<PublicMentor[]> {
  return apiClient<PublicMentor[]>(
    `/mentors/search?q=${encodeURIComponent(query)}`,
  );
}

/**
 * Get a specific mentor's public profile
 * GET /mentors/:id
 */
export async function getMentorProfile(
  mentorId: string,
): Promise<PublicMentorDetail> {
  return apiClient<PublicMentorDetail>(`/mentors/${mentorId}`);
}

/**
 * Get reviews for a mentor
 * GET /mentors/:id/reviews
 */
export async function getMentorReviews(
  mentorId: string,
  params?: { page?: number; limit?: number },
): Promise<PaginatedResponse<SessionReview>> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());

  const queryString = queryParams.toString();
  const endpoint = `/mentors/${mentorId}/reviews${queryString ? `?${queryString}` : ""}`;
  return apiClient<PaginatedResponse<SessionReview>>(endpoint);
}

/**
 * Get available booking times for a mentor
 * GET /mentors/:id/availability
 */
export async function getMentorBookingSlots(
  mentorId: string,
  params?: GetAvailabilityParams,
): Promise<MentorAvailabilityResponse> {
  const queryParams = new URLSearchParams();
  if (params?.startDate) queryParams.append("startDate", params.startDate);
  if (params?.endDate) queryParams.append("endDate", params.endDate);

  const queryString = queryParams.toString();
  const endpoint = `/mentors/${mentorId}/availability${queryString ? `?${queryString}` : ""}`;
  return apiClient<MentorAvailabilityResponse>(endpoint);
}

// ============ Mentor Dashboard (Auth) - /mentor ============

/**
 * Get current mentor's profile
 * GET /mentor/me
 */
export async function getMyMentorProfile(): Promise<PublicMentorDetail> {
  return apiClient<PublicMentorDetail>("/mentor/me");
}

/**
 * Update current mentor's profile
 * PATCH /mentor/me
 */
export async function updateMyMentorProfile(
  data: Partial<PublicMentorDetail>,
): Promise<PublicMentorDetail> {
  return apiClient<PublicMentorDetail>("/mentor/me", {
    method: "PATCH",
    body: data,
  });
}

/**
 * Get current mentor's availability settings
 * GET /mentor/availability
 */
export async function getMyAvailability(): Promise<MentorAvailabilityResponse> {
  return apiClient<MentorAvailabilityResponse>("/mentor/availability");
}

/**
 * Set mentor availability
 * PUT /mentor/availability
 */
export async function setMyAvailability(
  data: SetAvailabilityInput,
): Promise<MentorAvailabilityResponse> {
  return apiClient<MentorAvailabilityResponse>("/mentor/availability", {
    method: "PUT",
    body: data,
  });
}

/**
 * Delete specific availability slot
 * DELETE /mentor/availability/:id
 */
export async function deleteAvailabilitySlot(
  slotId: string,
): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`/mentor/availability/${slotId}`, {
    method: "DELETE",
  });
}

/**
 * Get mentor dashboard stats
 * GET /mentor/dashboard
 */
export async function getMentorDashboard(): Promise<MentorDashboardStats> {
  return apiClient<MentorDashboardStats>("/mentor/dashboard");
}

/**
 * Get reviews received as mentor
 * GET /mentor/reviews
 */
export async function getMyMentorReviews(params?: {
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<SessionReview>> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());

  const queryString = queryParams.toString();
  const endpoint = `/mentor/reviews${queryString ? `?${queryString}` : ""}`;
  return apiClient<PaginatedResponse<SessionReview>>(endpoint);
}

// ============ Requests (Auth) - /requests ============

/**
 * Create a mentorship request
 * POST /requests
 */
export async function createRequest(
  data: CreateRequestInput,
): Promise<MentorshipRequest> {
  return apiClient<MentorshipRequest>("/requests", {
    method: "POST",
    body: data,
  });
}

/**
 * List mentorship requests
 * GET /requests
 */
export async function getRequests(
  params?: RequestsQueryParams,
): Promise<PaginatedResponse<MentorshipRequest>> {
  const queryParams = new URLSearchParams();
  if (params?.role) queryParams.append("role", params.role);
  if (params?.status) queryParams.append("status", params.status);
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());

  const queryString = queryParams.toString();
  const endpoint = `/requests${queryString ? `?${queryString}` : ""}`;
  return apiClient<PaginatedResponse<MentorshipRequest>>(endpoint);
}

/**
 * Get pending requests count (for badge)
 * GET /requests/pending-count
 */
export async function getPendingRequestsCount(): Promise<PendingCountResponse> {
  return apiClient<PendingCountResponse>("/requests/pending-count");
}

/**
 * Get a specific request
 * GET /requests/:id
 */
export async function getRequest(
  requestId: string,
): Promise<MentorshipRequest> {
  return apiClient<MentorshipRequest>(`/requests/${requestId}`);
}

/**
 * Accept a request (mentor only)
 * POST /requests/:id/accept
 */
export async function acceptRequest(
  requestId: string,
): Promise<AcceptRequestResponse> {
  return apiClient<AcceptRequestResponse>(`/requests/${requestId}/accept`, {
    method: "POST",
  });
}

/**
 * Reject a request (mentor only)
 * POST /requests/:id/reject
 */
export async function rejectRequest(
  requestId: string,
  data?: RejectRequestInput,
): Promise<MentorshipRequest> {
  return apiClient<MentorshipRequest>(`/requests/${requestId}/reject`, {
    method: "POST",
    body: data,
  });
}

/**
 * Get mentee's active requests for a specific mentor
 * GET /requests/my-requests/:mentorId
 */
export async function getMyRequestsForMentor(
  mentorId: string,
): Promise<MyRequestsResponse> {
  return apiClient<MyRequestsResponse>(`/requests/my-requests/${mentorId}`);
}

/**
 * Cancel a request (mentee only)
 * PATCH /requests/:id/cancel
 */
export async function cancelRequest(
  requestId: string,
): Promise<MentorshipRequest> {
  return apiClient<MentorshipRequest>(`/requests/${requestId}/cancel`, {
    method: "PATCH",
  });
}

// ============ Sessions (Auth) - /sessions ============

/**
 * List mentorship sessions
 * GET /sessions
 */
export async function getSessions(
  params?: SessionsQueryParams,
): Promise<SessionsListResponse> {
  const queryParams = new URLSearchParams();
  if (params?.role) queryParams.append("role", params.role);
  if (params?.status) queryParams.append("status", params.status);
  if (params?.upcoming) queryParams.append("upcoming", "true");
  if (params?.past) queryParams.append("past", "true");
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());

  const queryString = queryParams.toString();
  const endpoint = `/sessions${queryString ? `?${queryString}` : ""}`;
  return apiClient<SessionsListResponse>(endpoint);
}

/**
 * Get a specific session
 * GET /sessions/:id
 */
export async function getSession(
  sessionId: string,
): Promise<MentorshipSession> {
  return apiClient<MentorshipSession>(`/sessions/${sessionId}`);
}

/**
 * Confirm a session (mentor only)
 * POST /sessions/:id/confirm
 */
export async function confirmSession(
  sessionId: string,
): Promise<MentorshipSession> {
  return apiClient<MentorshipSession>(`/sessions/${sessionId}/confirm`, {
    method: "POST",
  });
}

/**
 * Complete a session (mentor only)
 * POST /sessions/:id/complete
 */
export async function completeSession(
  sessionId: string,
): Promise<MentorshipSession> {
  return apiClient<MentorshipSession>(`/sessions/${sessionId}/complete`, {
    method: "POST",
  });
}

/**
 * Cancel a session (either party)
 * POST /sessions/:id/cancel
 */
export async function cancelSession(
  sessionId: string,
  data?: CancelSessionInput,
): Promise<MentorshipSession> {
  return apiClient<MentorshipSession>(`/sessions/${sessionId}/cancel`, {
    method: "POST",
    body: data,
  });
}

/**
 * Reschedule a session (mentor only)
 * PUT /sessions/:id/reschedule
 */
export async function rescheduleSession(
  sessionId: string,
  data: RescheduleSessionInput,
): Promise<MentorshipSession> {
  return apiClient<MentorshipSession>(`/sessions/${sessionId}/reschedule`, {
    method: "PUT",
    body: data,
  });
}

/**
 * Leave a review for a session (mentee only)
 * POST /sessions/:id/review
 */
export async function createSessionReview(
  sessionId: string,
  data: CreateReviewInput,
): Promise<SessionReview> {
  return apiClient<SessionReview>(`/sessions/${sessionId}/review`, {
    method: "POST",
    body: data,
  });
}

// Export all types
export type {
  // Request types
  MentorshipRequest,
  CreateRequestInput,
  RequestsQueryParams,
  PendingCountResponse,
  AcceptRequestResponse,
  RejectRequestInput,
  RequestStatus,
  MyRequestsResponse,
  BookedSlot,
  // Session types
  MentorshipSession,
  SessionsQueryParams,
  SessionsListResponse,
  SessionsMetaResponse,
  RescheduleSessionInput,
  CancelSessionInput,
  SessionStatus,
  // Review types
  SessionReview,
  CreateReviewInput,
  // Availability types
  AvailabilitySlot,
  SetAvailabilityInput,
  MentorAvailabilityResponse,
  GetAvailabilityParams,
  // Dashboard types
  MentorDashboardStats,
  // Paginated response
  PaginatedResponse,
  // Public mentor types
  PublicMentor,
  PublicMentorDetail,
} from "./types";
