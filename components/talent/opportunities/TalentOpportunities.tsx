"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useOpportunitiesManager } from "@/hooks/useOpportunitiesManager";
import { Spinner } from "@/components/ui/spinner";
import { TalentOpportunitiesHeader } from "./header";
import { SearchBar } from "./search-bar";
import { FilterTabs } from "./filter-tabs";
import { OpportunitiesGrid } from "./opportunities-grid";
import { OpportunitiesFilterModal, type OpportunitiesFilterState } from "./OpportunitiesFilterModal";
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

// Helper function to convert filter types to API format
const convertFilterTypesToAPI = (types: string[]): string[] => {
  return types.map(type => {
    // Already in API format (Job, Internship, Volunteer, PartTime)
    if (["Job", "Internship", "Volunteer", "PartTime"].includes(type)) {
      return type;
    }
    // Convert from display format
    const typeMap: Record<string, string> = {
      "job-listing": "Job",
      "internship": "Internship",
      "volunteer": "Volunteer",
      "part-time": "PartTime",
    };
    return typeMap[type.toLowerCase()] || type;
  });
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
   const [isFilterOpen, setIsFilterOpen] = useState(false);
   const [appliedFilters, setAppliedFilters] = useState<OpportunitiesFilterState | null>(null);
   const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

   // Fetch only active opportunities from API
   const { getAll, isLoading } = useOpportunitiesManager();
   const [apiOpportunities, setApiOpportunities] = useState<any[]>([]);
   const [isError, setIsError] = useState(false);

   const fetchOpportunitiesWithFilters = useCallback(async () => {
     try {
       const params: any = { status: "active" };

       // Add search query
       if (searchQuery) {
         params.q = searchQuery;
       }

       // Add filter parameters
       if (appliedFilters) {
         if (appliedFilters.types.length > 0) {
           params.type = convertFilterTypesToAPI(appliedFilters.types).join(",");
         }
         if (appliedFilters.skills.length > 0) {
           params.tags = appliedFilters.skills.join(",");
         }
         if (appliedFilters.categories?.length) {
           params.category = appliedFilters.categories.join(",");
         }
         if (appliedFilters.experienceLevels?.length) {
           params.experienceLevel = appliedFilters.experienceLevels.join(",");
         }
         if (appliedFilters.location) {
           params.location = appliedFilters.location;
         }
       }

       console.log("API params:", params);
       const data = await getAll(params);
       console.log("API response:", data);
       setApiOpportunities(data);
     } catch (error) {
       console.error("Fetch error:", error);
       setIsError(true);
     }
   }, [getAll, searchQuery, appliedFilters]);

   useEffect(() => {
     fetchOpportunitiesWithFilters();
   }, [fetchOpportunitiesWithFilters]);

  // Transform API opportunities to display format
  const opportunities = useMemo(() => {
    return (apiOpportunities || []).map(
      (opp: any) =>
        ({
          id: opp.id || "",
          companyName: opp.company || "Company",
          companyLogo: opp.logo || "",
          date: formatDate(opp.createdAt),
          type: opp.type || "Job",
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
    const display = opportunities.map(mapOpportunityToDisplay);
    console.log("displayOpportunities:", display);
    return display;
  }, [opportunities]);

  // Helper to map tab filter type to API type for comparison
  const mapTabTypeToAPI = (tabType: string): string => {
    const typeMap: Record<string, string> = {
      "job-listing": "Job",
      "internship": "Internship",
      "volunteer": "Volunteer",
      "part-time": "PartTime",
    };
    return typeMap[tabType] || tabType;
  };

  // Filter opportunities based on active filter, search, and applied filters
  // Note: Most filtering is done server-side now, this is client-side for better UX
  const filteredOpportunities = useMemo(() => {
    console.log("Starting filter - activeFilter:", activeFilter, "displayOpportunities count:", displayOpportunities.length);
    const result = displayOpportunities.filter((opportunity) => {
      console.log("Checking opportunity:", opportunity.title, "type:", opportunity.type);
      // Handle tab filter
      if (activeFilter !== "all") {
        if (activeFilter === "applied") {
          if (!opportunity.applied) return false;
        } else {
          const apiType = mapTabTypeToAPI(activeFilter);
          if (opportunity.type !== apiType) return false;
        }
      }

      // Handle advanced filters (these should ideally be server-side)
      if (appliedFilters) {
        if (appliedFilters.types.length > 0 && !appliedFilters.types.includes(opportunity.type)) {
         console.log("Filtered out - type mismatch", appliedFilters.types, opportunity.type);
          return false;
        }
        if (appliedFilters.skills.length > 0) {
          const hasMatchingSkill = appliedFilters.skills.some((skill) =>
            opportunity.skills.some((s) => s.toLowerCase().includes(skill.toLowerCase()))
          );
          if (!hasMatchingSkill) return false;
        }
      }

      return true;
    });
    console.log("filteredOpportunities count:", result.length);
    return result;
  }, [displayOpportunities, activeFilter, appliedFilters]);

  // Get all unique skills for filter modal
  const allSkills = useMemo(() => {
    const skillSet = new Set<string>();
    displayOpportunities.forEach((opp) => {
      opp.skills.forEach((skill) => skillSet.add(skill));
    });
    return Array.from(skillSet).sort();
  }, [displayOpportunities]);

  // Get filter count
  const getFilterCount = (): number => {
    if (!appliedFilters) return 0;
    let count = 0;
    if (appliedFilters.types.length > 0) count += appliedFilters.types.length;
    if (appliedFilters.skills.length > 0) count += appliedFilters.skills.length;
    if (appliedFilters.categories?.length) count += appliedFilters.categories.length;
    if (appliedFilters.experienceLevels?.length) count += appliedFilters.experienceLevels.length;
    if (appliedFilters.location) count += 1;
    return count;
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debouncing
    searchTimeoutRef.current = setTimeout(() => {
      // Search happens automatically via useMemo
    }, 300);
  };

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
            onSearchChange={handleSearch}
            onFilterClick={() => setIsFilterOpen(true)}
            isLoading={isLoading}
            filterCount={getFilterCount()}
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
             fetchOpportunitiesWithFilters();
           }}
         />

        {/* Filter Modal */}
        <OpportunitiesFilterModal
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApply={(filters) => {
            console.log("TalentOpportunities - Setting applied filters:", filters);
            setAppliedFilters(filters);
            setIsFilterOpen(false);
          }}
          availableSkills={allSkills}
          initialFilters={appliedFilters || undefined}
        />
      </div>
    </div>
  );
  }
