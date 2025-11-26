export interface User {
  id: string;
  email: string;
  role: "TALENT" | "BUSINESS";
  onboardingComplete: boolean;
  emailVerified: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
  profile: TalentProfile | BusinessProfile;
}

export interface TalentProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  username: string;
  headline: string;
  bio: string;
  skills: string[];
  portfolio: string[];
  workExperience: WorkExperience[];
  education: Education[];
  socialLinks: SocialLinks;
  profileImage: string;
  bannerImage: string;
  availability: string;
  location: string;
  isFeatured: boolean;
  viewCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessProfile {
  id: string;
  userId: string;
  companyName: string;
  companySize: string;
  industry: string;
  about: string;
  website: string;
  socialLinks: SocialLinks;
  logo: string;
  bannerImage: string;
  location: string;
  isFeatured: boolean;
  viewCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface SocialLinks {
  linkedIn?: string;
  twitter?: string;
  github?: string;
  portfolio?: string;
}
