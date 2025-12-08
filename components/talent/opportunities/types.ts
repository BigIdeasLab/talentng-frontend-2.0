export type OpportunityType = "internship" | "job-listing" | "volunteer" | "part-time";
export type FilterType = "all" | "job-listing" | "internship" | "volunteer" | "applied" | "part-time";
export type ApplicationStatus = "awaiting-review" | "hired" | "not-hired";

export interface Opportunity {
  id: string;
  posterName: string;
  posterAvatar?: string;
  date: string;
  type: OpportunityType;
  title: string;
  skills: string[];
  rate: string;
  showActions: boolean;
  applicationStatus?: ApplicationStatus;
}
