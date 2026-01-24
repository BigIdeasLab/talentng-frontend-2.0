"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useOpportunitiesManager } from "@/hooks/useOpportunitiesManager";
import { TalentOpportunitiesHeader } from "./header";
import { OpportunitiesGrid } from "./opportunities-grid";
import {
  OpportunitiesFilterModal,
  type OpportunitiesFilterState,
} from "./OpportunitiesFilterModal";
import { OpportunitiesGridSkeleton } from "./OpportunitySkeleton";
import type { FilterType, DisplayOpportunity } from "./types";
import type { OpportunityCard } from "@/types/opportunities";
import { transformOpportunityToCard } from "@/lib/utils/opportunities";

// Helper function to convert filter types to API format
const convertFilterTypesToAPI = (types: string[]): string[] => {
  return types.map((type) => {
    // Already in API format (Job, Internship, Volunteer, PartTime)
    if (["Job", "Internship", "Volunteer", "PartTime"].includes(type)) {
      return type;
    }
    // Convert from display format
    const typeMap: Record<string, string> = {
      "job-listing": "Job",
      internship: "Internship",
      volunteer: "Volunteer",
      "part-time": "PartTime",
    };
    return typeMap[type.toLowerCase()] || type;
  });
};

const mapOpportunityToDisplay = (opp: OpportunityCard): DisplayOpportunity => {
  const mapped = {
    id: opp.id,
    companyName: opp.companyName,
    companyLogo: opp.companyLogo,
    date: opp.date,
    type: opp.type,
    title: opp.title,
    category: (opp as any).category,
    skills: opp.skills,
    rate: opp.rate,
    status: opp.status,
    applied: (opp as any).applied || false,
  };
  return mapped;
};

export function TalentOpportunities() {
  const LIMIT = 20;
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] =
    useState<OpportunitiesFilterState | null>(null);
  const [offset, setOffset] = useState(0);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch only active opportunities from API
  const { getAll, isLoading } = useOpportunitiesManager();
  const [apiOpportunities, setApiOpportunities] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [isError, setIsError] = useState(false);

  const fetchOpportunitiesWithFilters = useCallback(
    async (pageOffset: number = 0) => {
      try {
        const params: any = {
          status: "active",
          limit: LIMIT,
          offset: pageOffset,
        };

        // Add search query
        if (searchQuery) {
          params.q = searchQuery;
        }

        // Add filter parameters
        if (appliedFilters) {
          if (appliedFilters.types.length > 0) {
            params.type = convertFilterTypesToAPI(appliedFilters.types).join(
              ",",
            );
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

        const response = await getAll(params);
        setApiOpportunities(response.data);
        setPagination(response.pagination);
        setOffset(pageOffset);
      } catch (error) {
        console.error("Fetch error:", error);
        setIsError(true);
      }
    },
    [getAll, searchQuery, appliedFilters, LIMIT],
  );

  useEffect(() => {
    fetchOpportunitiesWithFilters();
  }, [fetchOpportunitiesWithFilters]);

  // Transform API opportunities to display format
  const opportunities = useMemo(() => {
    console.log("TalentOpportunities.useMemo - apiOpportunities:", {
      count: apiOpportunities.length,
      allAppliedStatuses: apiOpportunities.map((o) => ({
        id: o.id,
        title: o.title,
        applied: o.applied,
      })),
    });
    const transformed = (apiOpportunities || []).map((opp) => {
      const card = transformOpportunityToCard(opp);
      const withApplied = {
        ...card,
        applied: opp.applied ?? false,
      };
      return withApplied;
    });
    console.log("TalentOpportunities.useMemo - transformed:", {
      count: transformed.length,
      allAppliedStatuses: transformed.map((o) => ({
        id: o.id,
        title: o.title,
        applied: o.applied,
      })),
    });
    return transformed;
  }, [apiOpportunities]);

  // Convert to display format for grid
  const displayOpportunities = useMemo(() => {
    return opportunities.map(mapOpportunityToDisplay);
  }, [opportunities]);

  // Filter opportunities based on active tab only (applied/not applied)
  // Server-side filters already applied, no need for client-side filtering
  const filteredOpportunities = useMemo(() => {
    if (activeFilter === "all" || activeFilter === "applied") {
      return displayOpportunities.filter((opportunity) => {
        if (activeFilter === "applied") {
          return opportunity.applied;
        }
        return true;
      });
    }
    // Tab filters (job-listing, internship, etc) are already filtered server-side
    return displayOpportunities;
  }, [displayOpportunities, activeFilter]);

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
    if (appliedFilters.categories?.length)
      count += appliedFilters.categories.length;
    if (appliedFilters.experienceLevels?.length)
      count += appliedFilters.experienceLevels.length;
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
      fetchOpportunitiesWithFilters(0);
    }, 300);
  };

  const handleNextPage = () => {
    fetchOpportunitiesWithFilters(offset + LIMIT);
  };

  const handlePreviousPage = () => {
    if (offset > 0) {
      fetchOpportunitiesWithFilters(offset - LIMIT);
    }
  };

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    // Reset to first page when filter tab changes
    setOffset(0);
    // Fetch opportunities with new filter
    fetchOpportunitiesWithFilters(0);
  };

  const handleApplicationSubmitted = useCallback(
    (opportunityId: string) => {
      console.log(
        "🔴 handleApplicationSubmitted EXECUTING for:",
        opportunityId,
      );
      // Optimistically update the applied status locally
      setApiOpportunities((prev) => {
        const updated = prev.map((opp) =>
          opp.id === opportunityId ? { ...opp, applied: true } : opp,
        );
        console.log(
          "🟢 Optimistic update - setting applied=true for:",
          opportunityId,
        );
        return updated;
      });
      // Then refetch to verify with backend
      setTimeout(() => {
        console.log(
          "🟡 Refetching opportunities after application for:",
          opportunityId,
        );
        fetchOpportunitiesWithFilters(0);
      }, 500);
    },
    [fetchOpportunitiesWithFilters],
  );

  // Log when callback is created/updated
  useEffect(() => {
    console.log(
      "⚙️  handleApplicationSubmitted useCallback dependencies changed:",
      {
        offset,
        hasFetchOpportunitiesWithFilters: !!fetchOpportunitiesWithFilters,
      },
    );
  }, [fetchOpportunitiesWithFilters]);

  // Debug log every render
  console.log("📋 TalentOpportunities RENDER:", {
    hasHandleApplicationSubmitted: !!handleApplicationSubmitted,
    filteredOpportunitiesCount: filteredOpportunities?.length || 0,
  });

  if (isLoading) {
    return (
      <div className="h-screen overflow-x-hidden bg-white flex flex-col">
        <div className="w-full px-[25px] pt-[19px] pb-[16px] border-b border-[#E1E4EA] flex-shrink-0">
          <TalentOpportunitiesHeader
            searchQuery={searchQuery}
            onSearchChange={handleSearch}
            onFilterClick={() => setIsFilterOpen(true)}
            isLoading={isLoading}
            filterCount={getFilterCount()}
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
          />
        </div>
        <div className="flex-1 overflow-hidden">
          <OpportunitiesGridSkeleton />
        </div>
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
    <div className="h-screen overflow-x-hidden bg-white flex flex-col">
      <div className="w-full px-[25px] pt-[19px] pb-[16px] border-b border-[#E1E4EA] flex-shrink-0">
        {/* Header */}
        <div>
          <TalentOpportunitiesHeader
            searchQuery={searchQuery}
            onSearchChange={handleSearch}
            onFilterClick={() => setIsFilterOpen(true)}
            isLoading={isLoading}
            filterCount={getFilterCount()}
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Filter Modal */}
        <OpportunitiesFilterModal
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApply={(filters) => {
            setAppliedFilters(filters);
            setIsFilterOpen(false);
            // Reset to first page when filters are applied
            fetchOpportunitiesWithFilters(0);
          }}
          availableSkills={allSkills}
          initialFilters={appliedFilters || undefined}
        />
      </div>

      {/* Opportunities Grid */}
      <div className="flex-1 overflow-hidden">
        <OpportunitiesGrid
          opportunities={filteredOpportunities}
          onApplicationSubmitted={handleApplicationSubmitted}
          onNextPage={handleNextPage}
          onPreviousPage={handlePreviousPage}
          hasNextPage={pagination?.hasNextPage || false}
          hasPreviousPage={pagination?.hasPreviousPage || false}
          currentPage={pagination?.currentPage || 1}
          totalPages={pagination?.totalPages || 1}
        />
      </div>
    </div>
  );
}
