import { getTalentOpportunities } from "@/lib/api/opportunities";
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
  category?: string;
  tags?: string;
  location?: string;
  experienceLevel?: string;
  minBudget?: number;
  maxBudget?: number;
}): Promise<OpportunitiesResponse> {
  try {
    const response = await getTalentOpportunities({
      status: "active",
      limit: params?.limit || 20,
      offset: params?.offset || 0,
      ...(params?.searchQuery && { q: params.searchQuery }),
      ...(params?.type && { type: params.type }),
      ...(params?.category && { category: params.category }),
      ...(params?.tags && { tags: params.tags }),
      ...(params?.location && { location: params.location }),
      ...(params?.experienceLevel && {
        experienceLevel: params.experienceLevel,
      }),
      ...(params?.minBudget && { minBudget: params.minBudget }),
      ...(params?.maxBudget && { maxBudget: params.maxBudget }),
    });

    console.log(
      "[Opportunities] API response:",
      JSON.stringify({
        dataLength: response?.data?.length,
        pagination: response?.pagination,
        rawKeys: Object.keys(response || {}),
      }),
    );

    // Handle different response structures (object with .data or raw array)
    const rawData = Array.isArray(response)
      ? response
      : response?.data || (response as any)?.opportunities || [];

    // 🔍 DEBUG: log raw budget fields from the API for the first 5 opps
    rawData.slice(0, 20).forEach((opp: any) => {
      console.log(`[Budget Debug] "${opp.title}" → priceMode=${JSON.stringify(opp.priceMode)}, price=${JSON.stringify(opp.price)}, minBudget=${JSON.stringify(opp.minBudget)}, maxBudget=${JSON.stringify(opp.maxBudget)}`);
    });

    const opportunities: OpportunityData[] = rawData.map((opp: any) => ({
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
      rate:
        opp.priceMode === "fixed" && opp.price
          ? `₦${Math.round(parseFloat(opp.price) || 0).toLocaleString()} / ${getPaymentTypeAbbr(opp.paymentType)}`
          : `₦${Math.round(parseFloat(opp.minBudget) || 0).toLocaleString()} - ₦${Math.round(parseFloat(opp.maxBudget) || 0).toLocaleString()} / ${getPaymentTypeAbbr(opp.paymentType)}`,
      status: (opp.status || "draft") as "active" | "closed" | "draft",
      appliedAs: opp.appliedAs || [],
      saved: opp.saved || opp.userHasSaved || false,
      priceMode: opp.priceMode,
      minBudget: opp.minBudget,
      maxBudget: opp.maxBudget,
      price: opp.price,
      paymentType: opp.paymentType,
      location: opp.location,
      experienceLevel: opp.experienceLevel,
      duration: opp.duration,
    }));

    return {
      opportunities,
      pagination: (!Array.isArray(response) && response.pagination) || {
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
