export type FilterType =
  | "all"
  | "Job"
  | "Internship"
  | "Volunteer"
  | "PartTime"
  | "applied";
export type ApplicationStatus = "awaiting-review" | "hired" | "not-hired";

// Display opportunity for grid/list views
export interface DisplayOpportunity {
  id: string;
  companyName: string;
  companyLogo: string;
  date: string;
  type: string;
  title: string;
  category?: string;
  skills: string[];
  rate: string;
  status: "active" | "closed" | "draft";
  applicationStatus?: ApplicationStatus;
  appliedAs?: ("talent" | "mentor")[];
  saved?: boolean;
  priceMode?: "range" | "fixed";
  minBudget?: string | number;
  maxBudget?: string | number;
  price?: string | number;
  paymentType?: "hourly" | "weekly" | "monthly";
  duration?: string;
}

// Grid component props
export interface OpportunitiesGridProps {
  opportunities: DisplayOpportunity[];
}

// Legacy alias for backward compatibility
export type Opportunity = DisplayOpportunity;
