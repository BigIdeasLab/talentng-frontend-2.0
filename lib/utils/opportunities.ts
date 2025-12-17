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
  const lowerType = (type || "").toLowerCase();
  if (lowerType === "job") return "job-listing";
  if (lowerType === "internship") return "internship";
  if (lowerType === "volunteer") return "volunteer";
  if (lowerType === "parttime" || lowerType === "part-time") return "part-time";
  return "job-listing"; // default
};

/**
 * Transform API Opportunity to OpportunityCard format
 * Consolidates duplicate logic from multiple components
 */
export const transformOpportunityToCard = (opp: Opportunity): OpportunityCard => {
   const result = {
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
     applicantsCount: opp.applicationCount || 0,
     status: (opp.status || "draft") as "active" | "closed" | "draft",
     applicationCap: opp.applicationCap,
     closingDate: opp.closingDate,
     applied: opp.applied ?? false,
     saved: opp.saved ?? false,
   };
   if (opp.applied) {
     console.log("transformOpportunityToCard - APPLIED:", {
       id: opp.id,
       title: opp.title,
       oppApplied: opp.applied,
       resultApplied: result.applied,
     });
   }
   return result;
};
