/**
 * Centralized types for opportunities module
 */

// Tab types
export type TabType = "open" | "closed" | "draft";
export type SortType = "newest" | "oldest" | "rate-high" | "rate-low";

// Opportunity types
export type OpportunityType =
  | "job-listing"
  | "internship"
  | "volunteer"
  | "part-time";
export type OpportunityStatus = "active" | "closed" | "draft";

// Card display interface (for UI rendering)
export interface OpportunityCard {
  id: string;
  companyName: string;
  companyLogo: string;
  date: string;
  type: OpportunityType;
  title: string;
  category?: string;
  skills: string[];
  rate: string;
  priceMode?: "range" | "fixed";
  minBudget?: number;
  maxBudget?: number;
  price?: number;
  paymentType?: "weekly" | "monthly" | "hourly" | "";
  duration?: string;
  applicantsCount: number;
  status: OpportunityStatus;
  applicationCap?: number;
  closingDate?: string;
  appliedAs?: ("talent" | "mentor")[];
  saved?: boolean;
  workType?: string;
}

// Component props
export interface OpportunityCardProps {
  opportunity: OpportunityCard;
  activeTab: TabType;
}

// Type configuration for UI styling
export interface TypeConfig {
  label: string;
  bgColor: string;
  textColor: string;
  dotColor: string;
}

export const TYPE_CONFIG: Record<string, TypeConfig> = {
  // API format types
  Job: {
    label: "Job Listing",
    bgColor: "rgba(92, 48, 255, 0.10)",
    textColor: "#5C30FF",
    dotColor: "#5C30FF",
  },
  Internship: {
    label: "Internship",
    bgColor: "rgba(0, 139, 71, 0.09)",
    textColor: "#008B47",
    dotColor: "#008B47",
  },
  Volunteer: {
    label: "Volunteer",
    bgColor: "rgba(246, 188, 63, 0.10)",
    textColor: "#D99400",
    dotColor: "#D99400",
  },
  PartTime: {
    label: "Part-time",
    bgColor: "rgba(92, 48, 255, 0.10)",
    textColor: "#5C30FF",
    dotColor: "#5C30FF",
  },
  // Legacy format types (for backward compatibility)
  internship: {
    label: "Internship",
    bgColor: "rgba(0, 139, 71, 0.09)",
    textColor: "#008B47",
    dotColor: "#008B47",
  },
  "job-listing": {
    label: "Job Listing",
    bgColor: "rgba(92, 48, 255, 0.10)",
    textColor: "#5C30FF",
    dotColor: "#5C30FF",
  },
  volunteer: {
    label: "Volunteer",
    bgColor: "rgba(246, 188, 63, 0.10)",
    textColor: "#D99400",
    dotColor: "#D99400",
  },
  "part-time": {
    label: "Part-time",
    bgColor: "rgba(92, 48, 255, 0.10)",
    textColor: "#5C30FF",
    dotColor: "#5C30FF",
  },
};

// Form section types
export type FormSection =
  | "basic-info"
  | "description"
  | "budget-scope"
  | "application-settings";

// Filter/search params
export interface OpportunitiesFilters {
  searchQuery: string;
  activeTab: TabType;
  sortBy: SortType;
}
