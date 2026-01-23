export type PortfolioItem = {
  id: string;
  key: string;
  url: string;
  mime: string;
  createdAt: string;
  sizeBytes: string;
};

export type TalentProfile = {
  id: string;
  userId: string;

  fullName: string | null;
  headline: string | null;
  bio: string | null;

  skills: string[];
  workExperience: string[];
  education: string[];
  company: string | null;
  duration: string | null;
  description: string | null;

  availability: "full_time" | "part_time" | "freelance" | "" | null;
  location: string | null;

  links: {
    github?: string;
    linkedin?: string;
  } | null;

  resumeUrl: string | null;
  visibility: "public" | "private";
  isFeatured: boolean;
  featuredUntil: string | null;

  views: number;

  coverImageUrl: string | null;
  profileImageUrl: string | null;

  portfolioItems: PortfolioItem[];
  gallery: PortfolioItem[];

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
  };
};
