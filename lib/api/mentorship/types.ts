/**
 * Mentorship API Type Definitions
 * Types for requests and sessions endpoints
 */

// ============ Request Types ============

export type RequestStatus = "pending" | "accepted" | "rejected" | "cancelled";

export interface MentorshipRequest {
  id: string;
  mentorId: string;
  menteeId: string;
  topic: string;
  message: string | null;
  scheduledAt: string;
  status: RequestStatus;
  mentor: {
    id: string;
    name: string;
    avatar: string | null;
    title: string | null;
  };
  mentee: {
    id: string;
    name: string;
    avatar: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateRequestInput {
  mentorId: string;
  topic: string;
  message?: string;
  scheduledAt: string;
}

export interface RequestsQueryParams {
  role?: "sent" | "received";
  status?: RequestStatus;
  page?: number;
  limit?: number;
}

export interface PendingCountResponse {
  count: number;
}

export interface AcceptRequestResponse {
  request: MentorshipRequest;
  session: MentorshipSession;
}

export interface RejectRequestInput {
  reason?: string;
}

// ============ Session Types ============

export type SessionStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface MentorshipSession {
  id: string;
  requestId: string;
  mentorId: string;
  menteeId: string;
  topic: string;
  scheduledAt: string;
  duration: number;
  meetingLink: string | null;
  status: SessionStatus;
  notes: string | null;
  mentor: {
    id: string;
    name: string;
    avatar: string | null;
    title: string | null;
  };
  mentee: {
    id: string;
    name: string;
    avatar: string | null;
  };
  review?: SessionReview | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  cancelledAt: string | null;
  rescheduledAt: string | null;
}

export interface SessionsQueryParams {
  role?: "mentor" | "mentee";
  status?: SessionStatus;
  page?: number;
  limit?: number;
}

export interface RescheduleSessionInput {
  scheduledAt: string;
}

export interface CancelSessionInput {
  reason?: string;
}

// ============ Review Types ============

export interface SessionReview {
  id: string;
  sessionId: string;
  rating: number;
  comment: string | null;
  mentee: {
    id: string;
    name: string;
    avatar: string | null;
  };
  createdAt: string;
}

export interface CreateReviewInput {
  rating: number;
  comment?: string;
}

// ============ Mentor Availability Types (Extended) ============

export interface AvailabilitySlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface SetAvailabilityInput {
  sessionDuration: number;
  bufferTime?: number;
  timezone?: string;
  defaultMeetingLink?: string;
  slots: AvailabilitySlot[];
}

export interface MentorAvailabilityResponse {
  mentorId: string;
  sessionDuration: number;
  timezone: string;
  availableSlots: {
    date: string;
    dayOfWeek: number;
    slots: {
      startTime: string;
      endTime: string;
    }[];
  }[];
}

export interface GetAvailabilityParams {
  startDate?: string;
  endDate?: string;
}

// ============ Mentor Dashboard Types ============

export interface MentorDashboardStats {
  totalSessions: number;
  completedSessions: number;
  upcomingSessions: number;
  pendingRequests: number;
  averageRating: number;
  totalReviews: number;
}

// ============ Paginated Response ============

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ============ Public Mentor Types (Extended) ============

export interface PublicMentor {
  id: string;
  userId: string;
  name: string;
  avatar: string | null;
  title: string | null;
  company: string | null;
  bio: string | null;
  expertise: string[];
  industries: string[];
  sessionDuration: number;
  rating: number;
  totalReviews: number;
  totalSessions: number;
}

export interface PublicMentorDetail extends PublicMentor {
  bufferTime: number;
  timezone: string;
  defaultMeetingLink: string | null;
}
