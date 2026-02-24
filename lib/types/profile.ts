export type PortfolioItem = {
  id: string;
  key: string;
  url: string;
  mime: string;
  createdAt: string;
  sizeBytes: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  images: string[];
};

export type StackItem = {
  id?: string;
  name: string;
};

export type TalentProfile = {
  id: string;
  userId: string;

  fullName: string | null;
  headline: string | null;
  bio: string | null;

  skills: string[];
  stack: StackItem[] | string[];
  workExperience: any[];
  education: any[];
  company: string | null;
  duration: string | null;
  description: string | null;

  availability: string | null;
  location: string | null;

  links: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    portfolio?: string;
  } | null;

  resumeUrl: string | null;
  visibility: "public" | "private" | "PUBLIC" | "PRIVATE";
  isFeatured: boolean;
  featuredUntil: string | null;

  views: number;

  coverImageUrl: string | null;
  profileImageUrl: string | null;

  portfolioItems: PortfolioItem[];
  gallery: GalleryItem[];

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  user: {
    id: string;
    username: string;
    email: string;
    role: string;
    status: string;
    isVerified: boolean;
    verificationLevel: string;
    emailVerifiedAt: string | null;
    lastLoginAt: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    oneSignalPlayerId: string | null;
    twoFactorEnabled?: boolean;
  };
  stats?: {
    earnings: string;
    hired: number;
    views: number;
    completionPercentage: number;
  };
};
