/**
 * Recruiter API Type Definitions
 */

export type Visibility = "public" | "private";

export interface RecruiterProfile {
  id: string;
  userId: string;
  username: string;
  company: string | null;
  industry: string | null;
  bio: string | null;
  location: string | null;
  companySize: string | null;
  companyStage: string | null;
  operatingModel: string | null;
  links: Record<string, any> | null;
  visibility: string | null;
  profileImageUrl: string | null;
  // Notification preferences
  emailNewApplications: boolean;
  emailMarketing: boolean;
  pushNewApplications: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateRecruiterProfileInput {
  company?: string;
  industry?: string;
  bio?: string;
  location?: string;
  companySize?: string;
  companyStage?: string;
  operatingModel?: string;
  links?: Record<string, any>;
  visibility?: Visibility;
}

export interface RecruiterFilterParams {
  industry?: string;
  location?: string;
  companyName?: string;
  visibility?: Visibility;
  isFeatured?: boolean;
}

export interface RecruiterProfileResponse {
  profile: RecruiterProfile | null;
  isProfileCreated: boolean;
  profileCompleteness: number;
  message?: string;
}

export interface RecruiterDashboardResponse {
  companyName: string | null;

  totalApplicants: {
    value: number;
    change: number;
  };

  activeOpportunities: {
    value: number;
    change: number;
  };

  hiredThisMonth: {
    value: number;
    change: number;
  };

  pendingReviews: {
    value: number;
    change: number;
  };

  weeklyOverview: Array<{
    day: "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";
    applications: number;
    interviews: number;
  }>;

  hiringPipeline: {
    applied: number;
    shortlisted: number;
    invited: number;
    rejected: number;
    hired: number;
  };

  topOpportunities: Array<{
    id: string;
    title: string;
    applicants: number;
    status: "active" | "closed" | "draft";
  }>;

  recentActivity: Array<{
    id: string;
    type: "application" | "interview";
    message: string;
    timestamp: string;
  }>;
}

/**
 * Recruiter notification settings (GET/PATCH /recruiter/settings)
 */
export interface RecruiterSettings {
  emailNewApplications: boolean;
  emailMarketing: boolean;
  pushNewApplications: boolean;
}

export type UpdateRecruiterSettingsInput = Partial<RecruiterSettings>;
