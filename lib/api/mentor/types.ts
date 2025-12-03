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
  createdAt: string;
  updatedAt: string;
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
