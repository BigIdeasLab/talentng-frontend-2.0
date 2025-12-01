export type Role = "talent" | "employer" | "mentor";

export interface ProfileData {
  firstName: string;
  lastName: string;
  username: string;
  location: string;
  bio: string;
}

export interface SkillsData {
  category: string;
  headline: string;
  skills: string[];
  stack: string[];
  portfolioLink: string;
}

export interface CompanyProfileData {
  companyName: string;
  companyWebsite: string;
  companyIndustry: string;
  companySize: string;
  companyBio: string;
}

export interface MentorExpertiseData {
  expertise: string;
  experience: string;
  mentorshipStyle: string;
  linkedIn: string;
}
