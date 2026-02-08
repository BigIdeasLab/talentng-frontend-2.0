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
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  location: string | null;
  status: RequestStatus;
  rejectReason: string | null;
  rejectedAt: string | null;
  mentor: {
    id: string;
    name?: string;
    fullName?: string;
    avatar?: string | null;
    profileImageUrl?: string | null;
    title?: string | null;
    headline?: string | null;
  };
  mentee: {
    id: string;
    name?: string;
    fullName?: string;
    username?: string;
    avatar?: string | null;
    profileImageUrl?: string | null;
    headline?: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateRequestInput {
  mentorId: string;
  topic: string;
  message?: string;
  scheduledDate: string;
  scheduledTime: string;
}

export interface BookedSlot {
  requestId: string;
  scheduledDate: string;
  scheduledTime: string;
  status: string;
}

export interface MyRequestsResponse {
  mentorId: string;
  bookedSlots: BookedSlot[];
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

export type SessionStatus =
  | "pending"
  | "confirmed"
  | "rescheduled"
  | "in_progress"
  | "pending_completion"
  | "disputed"
  | "completed"
  | "cancelled";

export interface MentorshipSession {
  id: string;
  requestId?: string;
  mentorId: string;
  menteeId: string;
  topic: string;
  scheduledAt?: string;
  startTime?: string;
  endTime?: string;
  duration: number;
  meetingLink: string | null;
  location?: string | null;
  status: SessionStatus;
  notes: string | null;
  message?: string | null;
  mentor: {
    id: string;
    name?: string;
    fullName?: string;
    avatar?: string | null;
    profileImageUrl?: string | null;
    title?: string | null;
    headline?: string | null;
  };
  mentee: {
    id: string;
    name?: string;
    fullName?: string;
    avatar?: string | null;
    profileImageUrl?: string | null;
    headline?: string | null;
  };
  review?: SessionReview | null;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
  cancelledAt?: string | null;
  rescheduledAt?: string | null;
}

export interface SessionsQueryParams {
  role?: "mentor" | "mentee";
  status?: SessionStatus;
  upcoming?: boolean;
  past?: boolean;
  page?: number;
  limit?: number;
}

export interface SessionsMetaResponse {
  total: number;
  pending: number;
  upcoming: number;
  completed: number;
  cancelled: number;
}

export interface SessionsListResponse {
  success: boolean;
  data: MentorshipSession[];
  meta: SessionsMetaResponse;
}

export interface RescheduleSessionInput {
  newStartTime: string;
  newEndTime: string;
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
  mentorId?: string;
  sessionDuration: number;
  bufferTime?: number;
  timezone: string;
  defaultMeetingLink?: string | null;
  slots: AvailabilitySlot[];
  // Legacy format for public mentor availability (booking view)
  availableSlots?: {
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
  location: string | null;
  expertise: string[];
  industries: string[];
  languages: string[];
  stack: string[];
  links: Record<string, string> | null;
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
