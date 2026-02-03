/**
 * Recruiter API Type Definitions
 */

export type Visibility = "public" | "private";

export interface RecruiterProfile {
  id: string;
  userId: string;
  username: string;
  bio: string | null;
  companyName: string | null;
  companyWebsite: string | null;
  industry: string | null;
  location: string | null;
  companyLogoUrl: string | null;
  companySize: string | null;
  companyStage: string | null;
  operatingModel: string | null;
  visibility: Visibility;
  isFeatured: boolean;
  featuredUntil: string | null;
  views: number;
  coverImageUrl: string | null;
  profileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateRecruiterProfileInput {
  companyName?: string;
  companyWebsite?: string;
  industry?: string;
  bio?: string;
  location?: string;
  companyLogoUrl?: string;
  companySize?: string;
  companyStage?: string;
  operatingModel?: string;
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
