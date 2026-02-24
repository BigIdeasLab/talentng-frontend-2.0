"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { TalentOpportunitiesHeader } from "@/components/talent/opportunities/header";
import { OpportunitiesGrid } from "@/components/talent/opportunities/opportunities-grid";
import {
  OpportunitiesFilterModal,
  type OpportunitiesFilterState,
} from "@/components/talent/opportunities/OpportunitiesFilterModal";
import { OpportunitiesGridSkeleton } from "@/components/talent/opportunities/OpportunitySkeleton";
import type {
  FilterType,
  DisplayOpportunity,
} from "@/components/talent/opportunities/types";
import type { OpportunityData } from "./server-data";
import { getOpportunitiesData } from "./server-data";
import { useProfile } from "@/hooks";
import { RoleColorProvider } from "@/lib/theme/RoleColorContext";

interface OpportunitiesClientProps {
  initialOpportunities: OpportunityData[];
  initialError: string | null;
  initialPagination?: any;
}

const convertFilterTypesToAPI = (types: string[]): string[] => {
  return types.map((type) => {
    if (["Job", "Internship", "Volunteer", "PartTime"].includes(type)) {
      return type;
    }
    const typeMap: Record<string, string> = {
      "job-listing": "Job",
      internship: "Internship",
      volunteer: "Volunteer",
      "part-time": "PartTime",
    };
    return typeMap[type.toLowerCase()] || type;
  });
};

export function OpportunitiesClient({
  initialOpportunities,
  initialError,
  initialPagination,
}: OpportunitiesClientProps) {
  const LIMIT = 20;
  const { activeRole } = useProfile();
  const currentProfileType = (activeRole === "mentor" ? "mentor" : "talent") as
    | "talent"
    | "mentor";
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] =
    useState<OpportunitiesFilterState | null>(null);
  const [offset, setOffset] = useState(0);
  const [opportunities, setOpportunities] =
    useState<OpportunityData[]>(initialOpportunities);
  const [pagination, setPagination] = useState(initialPagination);
  const [isLoading, setIsLoading] = useState(initialOpportunities.length === 0);
  const [error, setError] = useState<string | null>(initialError);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoadRef = useRef(true);
  const fetchIdRef = useRef(0);

  useEffect(() => {
    fetchOpportunitiesWithFilters(0);
  }, []);

  const fetchOpportunitiesWithFilters = useCallback(
    async (
      pageOffset: number = 0,
      filterType?: FilterType,
      overrideSearchQuery?: string,
      overrideFilters?: OpportunitiesFilterState | null,
    ) => {
      const currentFetchId = ++fetchIdRef.current;

      // Only show loading skeleton on initial load, not on filter changes
      if (isInitialLoadRef.current) {
        setIsLoading(true);
      }
      setError(null);

      const query = overrideSearchQuery ?? searchQuery;
      const filters = overrideFilters !== undefined ? overrideFilters : appliedFilters;
      const filter = filterType ?? activeFilter;

      try {
        // Fetch results with the applied filters
        const {
          opportunities: newOpportunities,
          pagination: newPagination,
          error: fetchError,
        } = await getOpportunitiesData({
          searchQuery: query,
          limit: LIMIT,
          offset: pageOffset,
          type: filter === "all" || filter === "applied" ? undefined : filter,
          category: filters?.categories?.join(","),
          tags: filters?.skills?.join(","),
          location: filters?.location,
          experienceLevel: filters?.experienceLevels?.join(","),
        });

        // Discard stale responses (e.g. from React Strict Mode double-mount)
        if (currentFetchId !== fetchIdRef.current) return;

        // Filter by "applied" status if that's the active filter (based on current profile type)
        const filtered =
          filter === "applied"
            ? newOpportunities.filter((opp) =>
                opp.appliedAs?.includes(currentProfileType),
              )
            : newOpportunities;

        setOpportunities(filtered);
        setPagination(newPagination);
        setError(fetchError);
        setOffset(pageOffset);
        isInitialLoadRef.current = false;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch opportunities",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [searchQuery, activeFilter, appliedFilters, currentProfileType],
  );

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      // Only trigger search API with min 2 characters (or empty to clear)
      if (query.length >= 2 || query.length === 0) {
        fetchOpportunitiesWithFilters(0, undefined, query);
      }
    }, 400);
  };

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    setOffset(0);
    fetchOpportunitiesWithFilters(0, filter);
  };

  const handleNextPage = () => {
    fetchOpportunitiesWithFilters(offset + LIMIT);
  };

  const handlePreviousPage = () => {
    if (offset > 0) {
      fetchOpportunitiesWithFilters(offset - LIMIT);
    }
  };

  const handleApplicationSubmitted = useCallback(
    (opportunityId: string) => {
      // Optimistically update the appliedAs status locally for current profile type
      setOpportunities((prev) =>
        prev.map((opp) =>
          opp.id === opportunityId
            ? {
                ...opp,
                appliedAs: [...(opp.appliedAs || []), currentProfileType],
              }
            : opp,
        ),
      );
    },
    [currentProfileType],
  );

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

  return (
    <RoleColorProvider role={activeRole}>
      <div className="h-screen overflow-x-hidden bg-white flex flex-col">
        {/* Header */}
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

          <OpportunitiesFilterModal
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            onApply={(filters) => {
              setAppliedFilters(filters);
              setIsFilterOpen(false);
              fetchOpportunitiesWithFilters(0, undefined, undefined, filters);
            }}
            availableSkills={[]}
            initialFilters={appliedFilters || undefined}
          />
        </div>

        {/* Grid Container */}
        <div className="flex-1 overflow-hidden">
          {isLoading && <OpportunitiesGridSkeleton />}
          {error && !isLoading && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">
                  Error loading opportunities
                </p>
                <p className="text-gray-600">{error}</p>
              </div>
            </div>
          )}
          {!isLoading && !error && (
            <OpportunitiesGrid
              opportunities={opportunities as DisplayOpportunity[]}
              onApplicationSubmitted={handleApplicationSubmitted}
              onNextPage={handleNextPage}
              onPreviousPage={handlePreviousPage}
              hasNextPage={pagination?.hasNextPage || false}
              hasPreviousPage={pagination?.hasPreviousPage || false}
              currentPage={pagination?.currentPage || 1}
              totalPages={pagination?.totalPages || 1}
              totalOpportunities={pagination?.total}
            />
          )}
        </div>
      </div>
    </RoleColorProvider>
  );
}
