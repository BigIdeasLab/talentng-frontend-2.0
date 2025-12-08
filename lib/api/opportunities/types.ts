export interface Opportunity {
  id?: string;
  title: string;
  description: string;
  type?: string;
  location?: string;
  tags?: string[];
  status?: string;
  orgId?: string;
  postedById?: string;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
  logo?: string;
  minBudget?: number;
  maxBudget?: number;
  paymentType?: string;
  category?: string;
  workType?: string;
  employmentType?: string;
  experienceLevel?: string;
  requirements?: string[];
  keyResponsibilities?: string[];
  tools?: string[];
  duration?: string;
  maxHours?: number;
  startDate?: string;
  company?: string;
  postedBy?: {
    recruiterProfile?: {
      company?: string;
    };
  };
}

export interface GetOpportunitiesParams {
  q?: string;
  type?: string;
  title?: string;
  location?: string;
  tags?: string;
  status?: string;
  orgId?: string;
  postedById?: string;
  isFeatured?: boolean;
}
