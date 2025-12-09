export type FilterType = "all" | "job-listing" | "internship" | "volunteer" | "applied" | "part-time";
export type ApplicationStatus = "awaiting-review" | "hired" | "not-hired";

// Display opportunity for grid/list views
export interface DisplayOpportunity {
  id: string;
  posterName: string;
  posterAvatar: string;
  date: string;
  type: string;
  title: string;
  skills: string[];
  rate: string;
  showActions: boolean;
  applicationStatus?: ApplicationStatus;
  applied?: boolean;
}

// Grid component props
export interface OpportunitiesGridProps {
  opportunities: DisplayOpportunity[];
}

// Legacy alias for backward compatibility
export interface Opportunity extends DisplayOpportunity {}
