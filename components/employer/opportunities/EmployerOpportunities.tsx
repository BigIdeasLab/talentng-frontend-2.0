"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";
import { OpportunitiesHeader } from "./OpportunitiesHeader";
import { SearchAndFilters } from "./SearchAndFilters";
import { OpportunitiesTabs } from "./OpportunitiesTabs";
import { OpportunityCard } from "./OpportunityCard";

type TabType = "open" | "closed" | "draft";
type SortType = "newest" | "oldest" | "rate-high" | "rate-low";

interface Opportunity {
  id: string;
  companyName: string;
  companyLogo: string;
  date: string;
  type: "job-listing" | "internship";
  title: string;
  skills: string[];
  rate: string;
  applicantsCount: number;
  status: "active" | "closed" | "draft";
  applicationCap?: number;
  closingDate?: string;
}

export function EmployerOpportunities() {
  const router = useRouter();
  const { currentProfile } = useProfile();
  const [activeTab, setActiveTab] = useState<TabType>("open");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortType>("newest");
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch opportunities on mount
  useEffect(() => {
    fetchOpportunities();
  }, [currentProfile]);

  const fetchOpportunities = async () => {
    try {
      setIsLoading(true);
      const { getOpportunities } = await import("@/lib/api/opportunities");

      const userId = (currentProfile as any)?.userId;
      console.log("Current user ID:", userId);
      console.log("Current profile:", currentProfile);
      if (!userId) return;

      // Fetch opportunities with active status (we'll handle draft/closed in UI tabs)
      const data = await getOpportunities({ 
        postedById: userId,
        status: "active" 
      });
      console.log("API response data:", data);

      // Transform API response to card format
      const transformedOpportunities = (data || []).map(
        (opp: any) =>
          ({
            id: opp.id || "",
            companyName: opp.company || "Company",
            companyLogo: opp.logo || "",
            date: formatDate(opp.createdAt),
            type:
              (opp.type || "").toLowerCase() === "job"
                ? "job-listing"
                : "internship",
            title: opp.title || "",
            skills: opp.tags || [],
            rate: `₦${Math.round(parseFloat(opp.minBudget) || 0).toLocaleString()} - ₦${Math.round(parseFloat(opp.maxBudget) || 0).toLocaleString()} / ${getPaymentTypeAbbr(opp.paymentType)}`,
            applicantsCount: opp.applicationCount || 0,
            status: (opp.status || "draft") as "active" | "closed" | "draft",
            applicationCap: opp.applicationCap,
            closingDate: opp.closingDate,
          }) as Opportunity,
      );

      console.log("Transformed opportunities:", transformedOpportunities);
      setOpportunities(transformedOpportunities);
    } catch (error) {
      console.error("Error fetching opportunities:", error);
      setOpportunities([]);
    } finally {
      setIsLoading(false);
    }
  };

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
    return "mo"; // default to monthly
  };

  const handlePostClick = () => {
    router.push("/opportunities/post");
  };

  const getOpportunitiesByTab = () => {
    // Filter by status based on tab
    const statusMap: Record<TabType, string> = {
      open: "active",
      closed: "closed",
      draft: "draft",
    };

    const targetStatus = statusMap[activeTab];
    return opportunities.filter((opp) => opp.status === targetStatus);
  };

  const filteredOpportunities = getOpportunitiesByTab().filter((opp) => {
    const matchesSearch =
      searchQuery === "" ||
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.skills.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="h-screen overflow-y-auto overflow-x-hidden bg-white flex items-center justify-center">
        <p className="text-gray-500">Loading opportunities...</p>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto overflow-x-hidden bg-white">
      <div className="w-full mx-auto px-3 py-5 md:px-5 md:py-6">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-6">
          <OpportunitiesHeader onPostClick={handlePostClick} />
          <SearchAndFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>

        {/* Tabs */}
        <OpportunitiesTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredOpportunities.map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              activeTab={activeTab}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredOpportunities.length === 0 && (
          <>
            {console.log(
              "No opportunities found. Search query:",
              searchQuery,
              "Active tab:",
              activeTab,
            )}
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-gray-500 text-xs mb-1.5">
                No opportunities found
              </p>
              <p className="text-gray-400 text-[11px]">
                Try adjusting your search or filters
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
