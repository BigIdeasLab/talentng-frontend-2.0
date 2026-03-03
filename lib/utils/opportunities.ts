/**
 * Opportunity utilities for formatting and transforming data
 */

import type { OpportunityCard } from "@/types/opportunities";
import type { Opportunity } from "@/lib/api/opportunities/types";

export const formatDate = (isoDate?: string): string => {
  if (!isoDate) return "Recently";
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export const getPaymentTypeAbbr = (paymentType: string): string => {
  if (!paymentType) return "mo";
  const type = paymentType.toLowerCase();
  if (type === "hourly") return "hr";
  if (type === "weekly") return "wk";
  if (type === "yearly" || type === "annual") return "yr";
  return "mo"; // default to monthly
};

export const mapOpportunityType = (type: string): OpportunityCard["type"] => {
  // The backend now returns consolidated PascalCase types directly
  // Normalize to the expected OpportunityType values
  const normalized = type || "FullTime";
  const legacyMap: Record<string, string> = {
    Job: "FullTime",
    job: "FullTime",
    "job-listing": "FullTime",
    "part-time": "PartTime",
    parttime: "PartTime",
  };
  return (legacyMap[normalized] || normalized) as OpportunityCard["type"];
};

/**
 * Transform API Opportunity to OpportunityCard format
 * Consolidates duplicate logic from multiple components
 */
export const transformOpportunityToCard = (
  opp: Opportunity,
): OpportunityCard => {
  const paymentType = (
    opp.paymentType
      ? ["weekly", "monthly", "hourly"].includes(opp.paymentType.toLowerCase())
        ? (opp.paymentType.toLowerCase() as "weekly" | "monthly" | "hourly")
        : ""
      : ""
  ) as "weekly" | "monthly" | "hourly" | "";

  const result: OpportunityCard = {
    id: opp.id || "",
    companyName:
      opp.postedBy?.recruiterProfile?.company || opp.company || "Company",
    companyLogo:
      opp.postedBy?.recruiterProfile?.profileImageUrl || opp.logo || "",
    date: formatDate(opp.createdAt),
    type: mapOpportunityType(opp.type),
    title: opp.title || "",
    category: opp.category,
    skills: opp.tags || [],
    rate: `₦${Math.round(opp.minBudget || 0).toLocaleString()} - ₦${Math.round(opp.maxBudget || 0).toLocaleString()} / ${getPaymentTypeAbbr(opp.paymentType)}`,
    priceMode: opp.priceMode || "range",
    minBudget: opp.minBudget,
    maxBudget: opp.maxBudget,
    price: opp.price,
    paymentType,
    duration: opp.duration,
    applicantsCount: opp.applicationCount || 0,
    status: (opp.status || "draft") as "active" | "closed" | "draft",
    applicationCap: opp.applicationCap,
    closingDate: opp.closingDate,
    appliedAs: opp.appliedAs || [],
    saved: opp.saved ?? false,
    createdAt: opp.createdAt,
  };
  return result;
};
