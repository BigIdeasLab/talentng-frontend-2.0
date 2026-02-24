/**
 * Mentor API Type Definitions
 */

export type Visibility = "public" | "private";

export interface MentorProfile {
  id: string;
  userId: string;
  username: string;
  fullName: string | null;
  headline: string | null;
  expertise: string[];
  industries: string[];
  stack: string[];
  languages: string[];
  mentorshipTopics: string[];
  bio: string | null;
  company: string | null;
  description: string | null;
  location: string | null;
  profileImageUrl: string | null;
  coverImageUrl: string | null;
  links: Record<string, string> | null;
  visibility: Visibility;
  isFeatured: boolean;
  featuredUntil: string | null;
  views: number;
  avgRating: number | null;
  totalSessions: number;
  totalMentees: number;
  sessionDuration: number;
  bufferTime: number;
  advanceBookingDays: number;
  cancellationPolicy: string;
  autoAccept: boolean;
  showStats: boolean;
  defaultMeetingLink: string | null;
  timezone: string;
  experience: any[];
  // Notification preferences
  emailNewRequests: boolean;
  emailSessionReminders: boolean;
  emailMarketing: boolean;
  pushNewRequests: boolean;
  pushSessionReminders: boolean;
  // Deprecated (kept in DB, removed from API)
  /** @deprecated */ totalEarnings?: string;
  /** @deprecated */ sessionRate?: number | null;
  /** @deprecated */ sessionCurrency?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface UpdateMentorProfileInput {
  fullName?: string;
  headline?: string;
  expertise?: string[];
  mentorshipTopics?: string[];
  bio?: string;
  company?: string;
  description?: string;
  location?: string;
  profileImageUrl?: string;
  links?: Record<string, string>;
  visibility?: Visibility;
}

export interface MentorAvailabilitySlot {
  startTime: string; // ISO 8601
  endTime: string; // ISO 8601
}

export interface SetMentorAvailabilityInput {
  slots: MentorAvailabilitySlot[];
}

export interface CreateBookingInput {
  mentorId: string;
  startTime: string; // ISO 8601
  topic?: string;
  note?: string;
}

export interface MentorAvailability {
  startTime: string; // ISO 8601
  endTime: string; // ISO 8601
}

export interface Booking {
  id: string;
  menteeId: string;
  mentorId: string;
  startTime: string; // ISO 8601
  endTime: string; // ISO 8601
  status: "confirmed" | "cancelled" | "completed";
  topic: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MentorSearchFilters {
  expertise?: string[];
  location?: string;
  isFeatured?: boolean;
  visibility?: Visibility;
}

export interface MentorProfileResponse {
  profile: MentorProfile | null;
  isProfileCreated: boolean;
  message?: string;
}

/**
 * Mentor Settings (returned by GET /mentor/settings)
 */
export interface MentorSettings {
  // Session settings
  sessionDuration: number;
  bufferTime: number;
  advanceBookingDays: number;
  cancellationPolicy: string;
  autoAccept: boolean;
  // Visibility settings
  visibility: Visibility;
  showStats: boolean;
  // Notification preferences
  emailNewRequests: boolean;
  emailSessionReminders: boolean;
  emailMarketing: boolean;
  pushNewRequests: boolean;
  pushSessionReminders: boolean;
}

/**
 * Input for PATCH /mentor/settings
 */
export type UpdateMentorSettingsInput = Partial<MentorSettings>;
