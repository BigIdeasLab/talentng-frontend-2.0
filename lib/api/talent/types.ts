export interface PortfolioItem {
  id: string;
  key: string;
  url: string;
  mime: string;
  sizeBytes: string;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  images: string[];
}

export interface DashboardStats {
  profileCompletion: number;
  applicationsSubmitted: number;
  interviewsScheduled: number;
  profileViews: number;
  hired: number;
  earnings: string;
}

export interface TalentFilterParams {
  q?: string;
  category?: string;
  skills?: string;
  location?: string;
  availability?: string;
  limit?: number;
  offset?: number;
}

export interface TalentPaginationInfo {
  total: number;
  limit: number;
  offset: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedTalentResponse {
  data: TalentProfile[];
  pagination: TalentPaginationInfo;
}

export interface StackItem {
  id?: string;
  name: string;
}

export interface TalentProfile {
  id: string;
  userId: string;
  fullName: string | null;
  headline: string | null;
  bio: string | null;
  profileImageUrl: string | null;
  coverImageUrl: string | null;
  skills: string[];
  stack: StackItem[] | string[];
  location: string | null;
  availability: string | null;
  phoneNumber: string | null;
  category: string | null;
  company: string | null;
  duration: string | null;
  description: string | null;
  resumeUrl: string | null;
  visibility: "public" | "private" | "PUBLIC" | "PRIVATE";
  isFeatured: boolean;
  featuredUntil: string | null;
  createdAt: string;
  updatedAt: string;
  views: number;
  earnings: string | number;
  hiredCount: number;
  stats?: {
    earnings: string;
    hired: number;
    views: number;
    completionPercentage: number;
  };
  workExperience?: Array<{
    id?: string;
    company: string;
    role: string;
    duration: string;
  }>;
  education?: Array<{
    id?: string;
    institution: string;
    degree: string;
    field: string;
  }>;
  portfolioItems?: PortfolioItem[];
  gallery?: GalleryItem[];
  socialLinks?: {
    github?: string | null;
    linkedin?: string | null;
    twitter?: string | null;
    instagram?: string | null;
    telegram?: string | null;
    dribbble?: string | null;
    portfolio?: string | null;
  };
  services?: Service[];
  recommendations?: TalentRecommendationDto[];
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
    status: string;
    isVerified: boolean;
    verificationLevel: string;
    twoFactorEnabled: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface APIProfileData {
  fullName?: string;
  headline?: string;
  bio?: string;
  phoneNumber?: string;
  location?: string;
  profileImageUrl?: string;
  skills?: string[];
  stack?: string[];
  workExperience?: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string | null;
    description: string;
    location?: string;
  }>;
  education?: Array<{
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  resumeUrl?: string;
  portfolioItems?: Array<{
    id?: string;
    title: string;
    description: string;
    url: string;
    image: string;
    technologies: string[];
  }>;
  links?: {
    dribbble?: string;
    telegram?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  company?: string;
  category?: string;
  availability?: string;
  description?: string;
  visibility?: "public" | "private";
  isFeatured?: boolean;
}

/**
 * Service Types
 */
export interface Review {
  id: string;
  reviewerId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  talentProfileId: string;
  title: string;
  about: string;
  price?: string;
  images: string[];
  tags: string[];
  status: "active" | "inactive" | "archived";
  averageRating: number;
  totalReviews: number;
  reviews?: ServiceReview[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface ServiceReview {
  id: string;
  serviceId: string;
  reviewerId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceInput {
  title: string;
  about: string;
  price?: string;
  images?: string[];
  tags?: string[];
}

export interface UpdateServiceInput {
  title?: string;
  about?: string;
  price?: string;
  images?: string[];
  tags?: string[];
}

export interface AddReviewInput {
  rating: number;
  comment?: string;
}

/**
 * Recommendation Types
 */
export interface TalentRecommendationDto {
  id: string;
  talentProfileId: string;
  title: string;
  comment?: string;
  rating?: number | null;
  isVerified: boolean;
  recommendedBy?: {
    id: string;
    username?: string;
    email: string;
    company?: string;
    companyImage?: string;
    profileImageUrl?: string;
  };
  recommendedById?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface RecommendationStatsDto {
  totalCount: number;
  averageRating?: number;
  verifiedCount: number;
  topSkills?: string[];
}

export interface CreateRecommendationDto {
  title: string;
  comment?: string;
  rating?: number;
}

export interface UpdateRecommendationDto {
  title?: string;
  comment?: string;
  rating?: number;
}

export interface TalentProfileResponse {
  profile: TalentProfile | null;
  isProfileCreated: boolean;
  message?: string;
}

/**
 * Talent Settings — GET/PATCH /talent/settings
 * Fields are read directly from the raw profile row (bypasses formatTalentProfile).
 * Never returns 404; returns safe defaults if no profile exists yet.
 */
export interface TalentSettings {
  // Visibility
  profileVisible: boolean;

  // Email Notifications
  emailApplications: boolean;
  emailInterviews: boolean;
  emailMarketing: boolean;

  // Push Notifications
  pushApplications: boolean;
  pushInterviews: boolean;
}

export type UpdateTalentSettingsInput = Partial<TalentSettings>;
