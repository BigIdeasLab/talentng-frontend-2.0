/**
 * Centralized types for opportunities module
 */

// Tab types
export type TabType = "open" | "closed" | "draft";
export type SortType = "newest" | "oldest" | "rate-high" | "rate-low";

// Opportunity types
export type OpportunityType =
  | "FullTime"
  | "PartTime"
  | "Contract"
  | "Internship"
  | "Volunteer"
  | "Freelance"
  | "Remote"
  | "Hybrid"
  | "OnSite";
export type OpportunityStatus = "active" | "closed" | "draft";

// Card display interface (for UI rendering)
export interface OpportunityCard {
  id: string;
  companyName: string;
  companyLogo: string;
  date: string;
  type: OpportunityType | string;
  title: string;
  category?: string;
  location?: string;
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
  createdAt?: string;
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
  FullTime: {
    label: "Full-time",
    bgColor: "rgba(92, 48, 255, 0.10)",
    textColor: "#5C30FF",
    dotColor: "#5C30FF",
  },
  PartTime: {
    label: "Part-time",
    bgColor: "rgba(92, 48, 255, 0.10)",
    textColor: "#5C30FF",
    dotColor: "#5C30FF",
  },
  Contract: {
    label: "Contract",
    bgColor: "rgba(0, 139, 71, 0.09)",
    textColor: "#008B47",
    dotColor: "#008B47",
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
  Freelance: {
    label: "Freelance",
    bgColor: "rgba(246, 188, 63, 0.10)",
    textColor: "#D99400",
    dotColor: "#D99400",
  },
  Remote: {
    label: "Remote",
    bgColor: "rgba(0, 183, 148, 0.10)",
    textColor: "#00B794",
    dotColor: "#00B794",
  },
  Hybrid: {
    label: "Hybrid",
    bgColor: "rgba(0, 183, 148, 0.10)",
    textColor: "#00B794",
    dotColor: "#00B794",
  },
  OnSite: {
    label: "On-Site",
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
