export interface RecruiterProfile {
  id: string;
  company: string;
  location: string;
  profileImageUrl: string;
}

export interface PostedBy {
  id: string;
  username: string;
  recruiterProfile: RecruiterProfile;
}

export interface Opportunity {
  id: string;
  type: "Job" | "Internship" | "Mentorship" | string;
  title: string;
  description: string;
  requirements: string[];
  company: string;
  logo: string;
  keyResponsibilities: string[];
  employmentType: "Full-Time" | "Part-Time" | "Contract" | string;
  location: string;
  compensation: string;
  tags: string[];
  category: string;
  workType: string;
  compensationType: "Fixed" | "Hourly" | "Project-based" | string;
  experienceLevel: "Junior" | "Mid" | "Senior" | string;
  minBudget: number;
  maxBudget: number;
  paymentType: "weekly" | "monthly" | "hourly" | string;
  tools: string[];
  duration: string;
  maxHours: number;
  startDate: string;
  applicationCap: number;
  closingDate: string;
  applicationCount: number;
  status: "active" | "draft" | "closed" | string;
  postedById: string;
  isFeatured: boolean;
  featuredUntil: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  postedBy: PostedBy;
  applied?: boolean;
  saved?: boolean;
}

export interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export type PaginationInfoOptional = Partial<PaginationInfo>;

export interface PaginatedOpportunitiesResponse {
  data: Opportunity[];
  pagination: PaginationInfo;
}

export interface GetOpportunitiesParams {
  q?: string;
  type?: string;
  title?: string;
  location?: string;
  tags?: string;
  status?: string;
  category?: string;
  experienceLevel?: string;
  isFeatured?: boolean;
  postedById?: string;
  limit?: number;
  offset?: number;
  sortBy?: "createdAt" | "applicationCount" | "title";
  sortOrder?: "asc" | "desc";
}
