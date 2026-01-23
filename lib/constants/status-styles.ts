/**
 * Status styling constants
 * Centralized definitions for status badges and indicators
 */

export interface StatusStyle {
  bg: string;
  text: string;
  dot?: string;
  border?: string;
}

export const STATUS_STYLES = {
  // Application/Applicant statuses
  "In Review": {
    bg: "#DBE9FE",
    text: "#5C30FF",
    dot: "#5C30FF",
  },
  Pending: {
    bg: "#FEF3C7",
    text: "#92400D",
    dot: "#D99400",
  },
  Rejected: {
    bg: "#FEE2E1",
    text: "#991B1B",
    dot: "#991B1B",
  },
  Hired: {
    bg: "#D1FAE5",
    text: "#076046",
    dot: "#008B47",
  },

  // Alternative names for same statuses
  review: {
    bg: "#DBE9FE",
    text: "#5C30FF",
    dot: "#5C30FF",
  },
  pending: {
    bg: "#FEF3C7",
    text: "#92400D",
    dot: "#D99400",
  },
  rejected: {
    bg: "#FEE2E1",
    text: "#991B1B",
    dot: "#991B1B",
  },
  hired: {
    bg: "#D1FAE5",
    text: "#076046",
    dot: "#008B47",
  },
} as const;

export const OPPORTUNITY_TYPE_STYLES = {
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
} as const;
