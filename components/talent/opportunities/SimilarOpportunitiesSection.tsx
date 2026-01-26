"use client";

import { OpportunityCard } from "@/components/talent/opportunities/opportunity-card";
import type { DisplayOpportunity } from "@/components/talent/opportunities/types";
import type { Opportunity } from "@/lib/api/opportunities/types";

interface SimilarOpportunitiesSectionProps {
  similarOpportunities?: Opportunity[];
  onRefresh: () => void;
}

/**
 * Convert Opportunity to DisplayOpportunity format
 */
const convertToDisplayOpportunity = (opp: Opportunity): DisplayOpportunity => {
  const DEFAULT_LOGO =
    "https://api.builder.io/api/v1/image/assets/TEMP/ac611f16c20ce30fd01ad9af988e5821beb576eb?width=180";

  const formatDate = (isoDate?: string): string => {
    if (!isoDate) return "Recently";
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getPaymentTypeAbbr = (paymentType?: string): string => {
    if (!paymentType) return "mo";
    const type = paymentType.toLowerCase();
    if (type === "hourly") return "hr";
    if (type === "weekly") return "wk";
    if (type === "yearly" || type === "annual") return "yr";
    return "mo";
  };

  let rate = "N/A";
  if (opp.type?.toLowerCase() === "volunteer") {
    rate = "Volunteer";
  } else if (opp.minBudget && opp.maxBudget) {
    const abbr = getPaymentTypeAbbr(opp.compensationType);
    rate = `₦${Math.round(parseFloat(opp.minBudget.toString()) || 0).toLocaleString()} - ₦${Math.round(parseFloat(opp.maxBudget.toString()) || 0).toLocaleString()}/${abbr}`;
  } else if (opp.compensation) {
    rate = opp.compensation;
  }

  const paymentType = opp.paymentType
    ? ["weekly", "monthly", "hourly"].includes(opp.paymentType.toLowerCase())
      ? (opp.paymentType.toLowerCase() as "weekly" | "monthly" | "hourly")
      : undefined
    : undefined;

  return {
    id: opp.id,
    companyName: opp.company || "Unknown Company",
    companyLogo: opp.logo || DEFAULT_LOGO,
    date: formatDate(opp.createdAt),
    type: opp.type || "job",
    title: opp.title,
    category: opp.category,
    skills: opp.tags || [],
    rate: rate,
    status: (opp.status as "active" | "closed" | "draft") || "draft",
    applied: opp.applied || false,
    saved: opp.saved || false,
    priceMode: opp.priceMode,
    minBudget: opp.minBudget,
    maxBudget: opp.maxBudget,
    price: opp.price,
    paymentType,
    duration: opp.duration,
  };
};

export function SimilarOpportunitiesSection({
  similarOpportunities,
  onRefresh,
}: SimilarOpportunitiesSectionProps) {
  const hasOpportunities =
    similarOpportunities && similarOpportunities.length > 0;

  if (!hasOpportunities) {
    return null;
  }

  return (
    <div className="flex flex-col gap-5 mt-8">
      <h2 className="font-inter-tight text-[13px] font-medium text-black leading-[105%]">
        Similar Jobs
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {similarOpportunities.map((similarOpp) => (
          <OpportunityCard
            key={similarOpp.id}
            opportunity={convertToDisplayOpportunity(similarOpp)}
            onApplicationSubmitted={onRefresh}
            onSaveToggle={onRefresh}
          />
        ))}
      </div>
    </div>
  );
}
