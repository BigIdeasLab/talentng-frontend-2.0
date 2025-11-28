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
  key: string;
  url: string;
  mime: string;
  sizeBytes: string;
  createdAt: string;
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
  headline?: string;
  bio?: string;
  skills?: string;
  location?: string;
  visibility?: "public" | "private";
  isFeatured?: boolean;
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
  stack: Array<{ name: string }>;
  location: string | null;
  availability: string | null;
  phoneNumber: string | null;
  preferredRole: string | null;
  company: string | null;
  duration: string | null;
  description: string | null;
  resumeUrl: string | null;
  visibility: "public" | "private";
  isFeatured: boolean;
  featuredUntil: string | null;
  createdAt: string;
  updatedAt: string;
  views: number;
  stats: {
    earnings: string;
    hired: number;
    views: number;
    completionPercentage: number;
  };
  workExperience: Array<{
    id: string;
    company: string;
    role: string;
    duration: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
  }>;
  portfolioItems: PortfolioItem[];
  gallery: GalleryItem[];
  socialLinks: {
    github?: string | null;
    linkedin?: string | null;
    twitter?: string | null;
    instagram?: string | null;
    telegram?: string | null;
    dribbble?: string | null;
    portfolio?: string | null;
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
  preferredRole?: string;
  availability?: string;
  description?: string;
  visibility?: "public" | "private";
  isFeatured?: boolean;
}
