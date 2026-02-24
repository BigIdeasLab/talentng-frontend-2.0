import type { GalleryItem, StackItem } from "./profile";

export interface Talent {
  id: string;
  userId: string;
  fullName: string | null;
  headline: string | null;
  bio: string | null;
  skills: string[];
  stack?: StackItem[] | string[];
  workExperience: any[];
  education: any[];
  location: string | null;
  links: any | null;
  portfolioItems: any[];
  resumeUrl: string | null;
  visibility: "public" | "private" | "PUBLIC" | "PRIVATE";
  isFeatured: boolean;
  featuredUntil: string | null;
  views: number;
  coverImageUrl: string | null;
  profileImageUrl: string | null;
  company: string | null;
  duration: string | null;
  description: string | null;
  gallery: GalleryItem[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  availability: string | null;
  category: string | null;
  phoneNumber: string | null;
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
    twoFactorEnabled: boolean;
  };
  stats?: {
    earnings: string;
    hired: number;
    views: number;
    completionPercentage: number;
  };
}
