export interface TalentProfile {
  id: string;
  fullName: string;
  headline: string;
  bio?: string;
  skills: string[];
  location: string;
  profileImageUrl: string;
  category: string;
  gallery?: Array<{ url: string; title: string }>;
  hiredCount: number;
  earnings: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  talentProfile: TalentProfile;
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  type: string;
  description?: string;
  location: string;
}

export interface Application {
  id: string;
  userId: string;
  opportunityId: string;
  status: "applied" | "shortlisted" | "rejected" | "hired";
  note?: string;
  attachments: Array<any>;
  galleryIds: string[];
  createdAt: string;
  updatedAt: string;
  user: User;
  opportunity: Opportunity;
}

export interface ApplicationSubmission {
  opportunityId: string;
  note?: string;
  attachments?: File[];
}

export interface ApplicationResponse {
  id: string;
  opportunityId: string;
  applicantId: string;
  status: "applied" | "shortlisted" | "hired" | "rejected";
  note?: string;
  createdAt: string;
}
