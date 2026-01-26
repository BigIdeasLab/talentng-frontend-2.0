import { getOpportunities } from "@/lib/api/opportunities";
import type { DisplayOpportunity } from "@/components/talent/opportunities/types";

export type OpportunityData = DisplayOpportunity;

interface PaginationData {
  total?: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface OpportunitiesResponse {
  opportunities: OpportunityData[];
  pagination: PaginationData;
  error: string | null;
}

const formatDate = (isoDate?: string): string => {
  if (!isoDate) return "Recently";
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const getPaymentTypeAbbr = (paymentType: string): string => {
  if (!paymentType) return "mo";
  const type = paymentType.toLowerCase();
  if (type === "hourly") return "hr";
  if (type === "weekly") return "wk";
  if (type === "yearly" || type === "annual") return "yr";
  return "mo";
};

export async function getOpportunitiesData(params?: {
  searchQuery?: string;
  status?: string;
  limit?: number;
  offset?: number;
  type?: string;
}): Promise<OpportunitiesResponse> {
  try {
    const response = await getOpportunities({
      status: "active",
      limit: params?.limit || 20,
      offset: params?.offset || 0,
      ...(params?.searchQuery && { q: params.searchQuery }),
      ...(params?.type && { type: params.type }),
    });

    const opportunities: OpportunityData[] = (response.data || []).map(
      (opp: any) => ({
        id: opp.id || "",
        companyName:
          opp.postedBy?.recruiterProfile?.company || opp.company || "Company",
        companyLogo:
          opp.postedBy?.recruiterProfile?.profileImageUrl || opp.logo || "",
        date: formatDate(opp.createdAt),
        type: opp.type || "Job",
        title: opp.title || "",
        category: opp.category,
        skills: opp.tags || [],
        rate: `₦${Math.round(parseFloat(opp.minBudget) || 0).toLocaleString()} - ₦${Math.round(parseFloat(opp.maxBudget) || 0).toLocaleString()} / ${getPaymentTypeAbbr(opp.paymentType)}`,
        status: (opp.status || "draft") as "active" | "closed" | "draft",
        applied: opp.applied || opp.userHasApplied || false,
        saved: opp.saved || opp.userHasSaved || false,
        priceMode: opp.priceMode,
        minBudget: opp.minBudget,
        maxBudget: opp.maxBudget,
        price: opp.price,
        paymentType: opp.paymentType,
        duration: opp.duration,
      }),
    );

    return {
      opportunities,
      pagination: response.pagination || {
        currentPage: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
      error: null,
    };
  } catch (error) {
    console.error("Error fetching opportunities:", error);
    return {
      opportunities: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch opportunities",
    };
  }
}
