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
