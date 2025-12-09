"use client";

import { useState, useMemo, useEffect } from "react";
import { useOpportunitiesManager } from "@/hooks/useOpportunitiesManager";
import { Spinner } from "@/components/ui/spinner";
import { TalentOpportunitiesHeader } from "./header";
import { SearchBar } from "./search-bar";
import { FilterTabs } from "./filter-tabs";
import { OpportunitiesGrid } from "./opportunities-grid";
import type { FilterType } from "./types";
import type { OpportunityCard, OpportunityType } from "@/types/opportunities";

// Helper function to format date
const formatDate = (isoDate?: string): string => {
  if (!isoDate) return "Recently";
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

// Helper function to get payment type abbreviation
const getPaymentTypeAbbr = (paymentType: string): string => {
  if (!paymentType) return "mo";
  const type = paymentType.toLowerCase();
  if (type === "hourly") return "hr";
  if (type === "weekly") return "wk";
  if (type === "yearly" || type === "annual") return "yr";
  return "mo"; // default to monthly
};

// Helper function to map opportunity types
const mapOpportunityType = (type: string): OpportunityType => {
  const lowerType = (type || "").toLowerCase();
  if (lowerType === "job") return "job-listing";
  if (lowerType === "internship") return "internship";
  if (lowerType === "volunteer") return "volunteer";
  if (lowerType === "parttime" || lowerType === "part-time") return "part-time";
  return "job-listing"; // default
};

// Convert display opportunity to grid-compatible format
interface DisplayOpportunity {
  id: string;
  posterName: string;
  posterAvatar: string;
  date: string;
  type: FilterType | string;
  title: string;
  skills: string[];
  rate: string;
  showActions: boolean;
  applied?: boolean;
}

const mapOpportunityToDisplay = (opp: OpportunityCard): DisplayOpportunity => {
   const mapped = {
     id: opp.id,
     posterName: opp.companyName,
     posterAvatar: opp.companyLogo,
     date: opp.date,
     type: opp.type,
     title: opp.title,
     skills: opp.skills,
     rate: opp.rate,
     showActions: opp.status === "active",
     applied: (opp as any).applied || false,
   };
   return mapped;
};

export function TalentOpportunities() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch only active opportunities from API
  const { getAll, isLoading } = useOpportunitiesManager();
  const [apiOpportunities, setApiOpportunities] = useState<any[]>([]);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
     const fetchOpportunities = async () => {
       try {
         const data = await getAll({ status: "active" });
         setApiOpportunities(data);
       } catch (error) {
         setIsError(true);
       }
     };
     fetchOpportunities();
   }, [getAll]);

  // Transform API opportunities to display format
  const opportunities = useMemo(() => {
    return (apiOpportunities || []).map(
      (opp: any) =>
        ({
          id: opp.id || "",
          companyName: opp.company || "Company",
          companyLogo: opp.logo || "",
          date: formatDate(opp.createdAt),
          type: mapOpportunityType(opp.type),
          title: opp.title || "",
          skills: opp.tags || [],
          rate: `₦${Math.round(parseFloat(opp.minBudget) || 0).toLocaleString()} - ₦${Math.round(parseFloat(opp.maxBudget) || 0).toLocaleString()} / ${getPaymentTypeAbbr(opp.paymentType)}`,
          applicantsCount: opp.applicationCount || 0,
          status: (opp.status || "draft") as "active" | "closed" | "draft",
          applicationCap: opp.applicationCap,
          closingDate: opp.closingDate,
          applied: opp.applied || false,
        }) as OpportunityCard,
    );
  }, [apiOpportunities]);

  // Convert to display format for grid
  const displayOpportunities = useMemo(() => {
    return opportunities.map(mapOpportunityToDisplay);
  }, [opportunities]);

  // Filter opportunities based on active filter and search
  const filteredOpportunities = useMemo(() => {
    return displayOpportunities.filter((opportunity) => {
      // Handle filter
      if (activeFilter !== "all") {
        if (opportunity.type !== activeFilter) return false;
      }
      // Handle search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          opportunity.title.toLowerCase().includes(query) ||
          opportunity.posterName.toLowerCase().includes(query) ||
          opportunity.skills.some((skill) =>
            skill.toLowerCase().includes(query)
          )
        );
      }
      return true;
    });
  }, [displayOpportunities, activeFilter, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" className="text-blue-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900">
            Error loading opportunities
          </p>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto overflow-x-hidden bg-white">
      <div className="w-full px-[25px] pt-[19px]">
        {/* Header */}
        <div className="mb-4">
          <TalentOpportunitiesHeader />

          {/* Search and Filters */}
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Filter Tabs */}
          <FilterTabs
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>

        {/* Opportunities Grid */}
         <OpportunitiesGrid 
           opportunities={filteredOpportunities}
           onApplicationSubmitted={() => {
             // Refetch opportunities to get updated applied status
             const fetchOpportunities = async () => {
               try {
                 const data = await getAll({ status: "active" });
                 setApiOpportunities(data);
               } catch (error) {
                 // Silent fail - opportunities will remain as is
               }
             };
             fetchOpportunities();
           }}
         />
      </div>
    </div>
  );
}
