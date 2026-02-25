export interface TalentProfile {
  id: string;
  fullName: string;
  headline: string;
  bio?: string;
  skills: string[];
  location: string;
  profileImageUrl: string;
  category: string;
  gallery?: Array<{ url: string; title: string }>;
  hiredCount: number;
  earnings: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  talentProfile: TalentProfile;
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  type: string;
  description?: string;
  location: string;
  logo?: string | null;
  postedBy?: {
    id: string;
    username: string;
    recruiterProfile: {
      profileImageUrl: string | null;
      company: string | null;
    } | null;
  } | null;
}

export interface ApplicationInterview {
  id: string;
  applicationId: string;
  scheduledDate: string;
  message?: string;
  meetingLink?: string;
  status: "scheduled" | "completed" | "cancelled" | "rescheduled";
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  userId: string;
  opportunityId: string;
  profileType: "talent" | "mentor";
  profileId: string;
  status: "invited" | "applied" | "shortlisted" | "rejected" | "hired";
  note?: string;
  attachments: Array<any>;
  galleryIds: string[];
  createdAt: string;
  updatedAt: string;
  user: User;
  opportunity: Opportunity;
  interviews?: ApplicationInterview[];
}

export interface ApplicationSubmission {
  opportunityId: string;
  profileType: "talent" | "mentor";
  note: string;
  attachments: any[];
  galleryIds: string[];
}

export interface ApplicationResponse {
  id: string;
  opportunityId: string;
  applicantId: string;
  profileType: "talent" | "mentor";
  profileId: string;
  status: "invited" | "applied" | "shortlisted" | "hired" | "rejected";
  note?: string;
  createdAt: string;
}

export interface ScheduleInterviewInput {
  scheduledDate: string; // ISO timestamp
  message?: string;
  meetingLink?: string;
}

export interface CompleteInterviewInput {
  notes?: string;
  rating?: number;
  verdict?: "pass" | "fail";
}

export interface RescheduleInterviewInput {
  scheduledDate: string; // ISO timestamp
  message?: string;
  meetingLink?: string;
}

export interface CreateRecommendationInput {
  title: string;
  comment?: string;
  rating?: number;
}

export interface SendInvitationInput {
  opportunityId: string;
  talentIds: string[];
}

export interface RespondToInvitationInput {
  response: "accepted" | "declined";
}

export interface InvitationResponse {
  talentId: string;
  success: boolean;
  applicationId?: string;
  data?: Application;
  error?: string;
}
