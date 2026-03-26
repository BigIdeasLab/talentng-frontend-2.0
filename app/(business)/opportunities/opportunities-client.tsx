"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import { TalentOpportunitiesHeader } from "@/components/talent/opportunities/header";
import { OpportunitiesGrid } from "@/components/talent/opportunities/opportunities-grid";
import { FilterTabs } from "@/components/talent/opportunities/filter-tabs";
import { SearchInput } from "@/components/ui/search-input";
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
import { ErrorState } from "@/components/ui/error-state";


interface OpportunitiesClientProps {
  initialOpportunities: OpportunityData[];
  initialError: string | null;
  initialPagination?: any;
}

export function OpportunitiesClient({
  initialOpportunities,
  initialError,
  initialPagination,
}: OpportunitiesClientProps) {
  const LIMIT = 20;
  const { activeRole, isLoading: isRoleLoading } = useProfile();
  // This page serves talent + mentor roles. Recruiters who navigate here
  // should not call the talent-only endpoint.
  const isTalentOrMentor = activeRole === "talent" || activeRole === "mentor";
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
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const isInitialLoadRef = useRef(true);
  const fetchIdRef = useRef(0);

  useEffect(() => {
    // Wait for role to be resolved and only fetch for talent/mentor
    if (isRoleLoading || !activeRole) return;
    if (!isTalentOrMentor) return;

    // Skip fetch if we already have initial opportunities (e.g., navigating back)
    if (initialOpportunities.length > 0 && isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      return;
    }

    fetchOpportunitiesWithFilters(0);
  }, [activeRole, isRoleLoading]);

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
      setIsFetching(true);
      setError(null);

      const query = overrideSearchQuery ?? searchQuery;
      const filters =
        overrideFilters !== undefined ? overrideFilters : appliedFilters;
      const filter = filterType ?? activeFilter;

      // Prioritize explicit types from modal filters, otherwise fallback to the active tab filter
      const typeParam =
        filters?.types && filters.types.length > 0
          ? filters.types.join(",")
          : filter === "all" || filter === "applied"
            ? undefined
            : filter;

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
          type: typeParam,
          category: filters?.categories?.join(","),
          tags: filters?.skills?.join(","),
          location: filters?.location,
          experienceLevel: filters?.experienceLevels?.join(","),
          minBudget: filters?.minBudget,
          maxBudget: filters?.maxBudget,
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
        if (currentFetchId !== fetchIdRef.current) return;
        setError(
          err instanceof Error ? err.message : "Failed to fetch opportunities",
        );
      } finally {
        if (currentFetchId === fetchIdRef.current) {
          setIsLoading(false);
          setIsFetching(false);
        }
      }
    },
    [searchQuery, activeFilter, appliedFilters, currentProfileType],
  );

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    // Only trigger search API with min 2 characters (or empty to clear)
    if (query.length >= 2 || query.length === 0) {
      fetchOpportunitiesWithFilters(0, undefined, query);
    }
  };

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    setOffset(0);

    // Sync modal filter types when changing tabs
    if (filter === "all" || filter === "applied") {
      setAppliedFilters((prev) => (prev ? { ...prev, types: [] } : null));
      fetchOpportunitiesWithFilters(0, filter, undefined, {
        ...(appliedFilters || {
          types: [],
          skills: [],
          categories: [],
          experienceLevels: [],
          location: "",
        }),
        types: [],
      });
    } else {
      const newFilters = {
        ...(appliedFilters || {
          types: [],
          skills: [],
          categories: [],
          experienceLevels: [],
          location: "",
        }),
        types: [filter],
      };
      setAppliedFilters(newFilters);
      fetchOpportunitiesWithFilters(0, filter, undefined, newFilters);
    }
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
    // We exclude types from the count because they are controlled by the tabs
    // and the user doesn't want the badge count to change when switching tabs.
    if (appliedFilters.skills.length > 0) count += appliedFilters.skills.length;
    if (appliedFilters.categories?.length)
      count += appliedFilters.categories.length;
    if (appliedFilters.experienceLevels?.length)
      count += appliedFilters.experienceLevels.length;
    if (appliedFilters.location) count += 1;
    if (appliedFilters.minBudget && appliedFilters.minBudget > 0) count += 1;
    if (appliedFilters.maxBudget && appliedFilters.maxBudget > 0) count += 1;
    return count;
  };

  return (
    <RoleColorProvider role={activeRole}>
      <div className="flex flex-col h-[calc(100vh-60px)] md:h-screen overflow-x-hidden bg-white">
        {/* Desktop: Static header */}
        <div className="hidden md:block w-full px-[25px] pt-[19px] pb-[16px] border-b border-[#E1E4EA] flex-shrink-0">
          <TalentOpportunitiesHeader
            searchQuery={searchQuery}
            onSearchChange={handleSearch}
            onFilterClick={() => setIsFilterOpen(true)}
            isLoading={isLoading}
            filterCount={getFilterCount()}
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            filterModal={
              <OpportunitiesFilterModal
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApply={(filters) => {
                  setAppliedFilters(filters);
                  setIsFilterOpen(false);
                  fetchOpportunitiesWithFilters(
                    0,
                    undefined,
                    undefined,
                    filters,
                  );
                }}
                availableSkills={[]}
                initialFilters={appliedFilters || undefined}
              />
            }
          />
        </div>

        {/* Mobile: Simple scrollable layout */}
        <div className="md:hidden flex-1 overflow-y-auto">
          {/* Header - scrolls with content */}
          <div className="w-full px-[25px] pt-[19px] pb-[16px] border-b border-[#E1E4EA]">
            {/* Title */}
            <h1 className="text-[16px] font-medium font-inter-tight text-black leading-[16px] mb-[19px]">
              Opportunities
            </h1>

            {/* Search Bar and Filter */}
            <div className="flex items-center gap-[8px]">
              <div className="flex-1">
                <SearchInput
                  value={searchQuery}
                  onChange={handleSearch}
                  onSearch={handleSearch}
                  placeholder="Search opportunities, skills..."
                  isLoading={isLoading}
                  debounceDelay={400}
                />
              </div>
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className={`h-[38px] px-[15px] py-[7px] flex items-center gap-[5px] rounded-[8px] transition-colors ${
                    getFilterCount() > 0
                      ? "bg-[#8463FF0D] border border-[#8463FF] text-[#8463FF]"
                      : "bg-[#F5F5F5] hover:bg-gray-100 text-black border border-transparent"
                  }`}
                >
                  <SlidersHorizontal className="w-[15px] h-[15px]" />
                  <span className="text-[13px] font-normal font-inter-tight">
                    Filter
                  </span>
                  {getFilterCount() > 0 && (
                    <span className="ml-1 bg-[#8463FF] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                      {getFilterCount()}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Tabs - sticky */}
          <div className="sticky top-0 z-10 w-full px-[25px] py-[12px] bg-white border-b border-[#E1E4EA]">
            <FilterTabs
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Content */}
          <div>
            {(isLoading || (isFetching && opportunities.length === 0)) && (
              <OpportunitiesGridSkeleton />
            )}
            {error && !isLoading && !isFetching && (
              <div className="flex items-center justify-center py-8">
                <ErrorState
                  title="Error loading opportunities"
                  message={error}
                  onRetry={() => window.location.reload()}
                />
              </div>
            )}
            {!isLoading &&
              !error &&
              !(isFetching && opportunities.length === 0) && (
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
                  emptyTitle={
                    searchQuery.trim()
                      ? "No opportunities match your search"
                      : appliedFilters &&
                          (appliedFilters.skills?.length > 0 ||
                            (appliedFilters.categories?.length ?? 0) > 0 ||
                            (appliedFilters.experienceLevels?.length ?? 0) >
                              0 ||
                            appliedFilters.location ||
                            (appliedFilters.minBudget &&
                              appliedFilters.minBudget > 0) ||
                            (appliedFilters.maxBudget &&
                              appliedFilters.maxBudget > 0))
                        ? "No opportunities match your filters"
                        : activeFilter === "applied"
                          ? "No applied opportunities yet"
                          : "No opportunities yet"
                  }
                  emptyDescription={
                    searchQuery.trim()
                      ? "Try adjusting your search query"
                      : appliedFilters &&
                          (appliedFilters.skills?.length > 0 ||
                            (appliedFilters.categories?.length ?? 0) > 0 ||
                            (appliedFilters.experienceLevels?.length ?? 0) >
                              0 ||
                            appliedFilters.location ||
                            (appliedFilters.minBudget &&
                              appliedFilters.minBudget > 0) ||
                            (appliedFilters.maxBudget &&
                              appliedFilters.maxBudget > 0))
                        ? "Try adjusting your filters"
                        : activeFilter === "applied"
                          ? "Opportunities you apply to will appear here"
                          : "Available opportunities will appear here"
                  }
                />
              )}
          </div>
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

        {/* Desktop: Grid Container */}
        <div className="hidden md:block flex-1 overflow-hidden">
          {(isLoading || (isFetching && opportunities.length === 0)) && (
            <OpportunitiesGridSkeleton />
          )}
          {error && !isLoading && !isFetching && (
            <div className="flex-1 flex items-center justify-center">
              <ErrorState
                title="Error loading opportunities"
                message={error}
                onRetry={() => window.location.reload()}
              />
            </div>
          )}
          {!isLoading &&
            !error &&
            !(isFetching && opportunities.length === 0) && (
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
                emptyTitle={
                  searchQuery.trim()
                    ? "No opportunities match your search"
                    : appliedFilters &&
                        (appliedFilters.skills?.length > 0 ||
                          (appliedFilters.categories?.length ?? 0) > 0 ||
                          (appliedFilters.experienceLevels?.length ?? 0) > 0 ||
                          appliedFilters.location ||
                          (appliedFilters.minBudget &&
                            appliedFilters.minBudget > 0) ||
                          (appliedFilters.maxBudget &&
                            appliedFilters.maxBudget > 0))
                      ? "No opportunities match your filters"
                      : activeFilter === "applied"
                        ? "No applied opportunities yet"
                        : "No opportunities yet"
                }
                emptyDescription={
                  searchQuery.trim()
                    ? "Try adjusting your search query"
                    : appliedFilters &&
                        (appliedFilters.skills?.length > 0 ||
                          (appliedFilters.categories?.length ?? 0) > 0 ||
                          (appliedFilters.experienceLevels?.length ?? 0) > 0 ||
                          appliedFilters.location ||
                          (appliedFilters.minBudget &&
                            appliedFilters.minBudget > 0) ||
                          (appliedFilters.maxBudget &&
                            appliedFilters.maxBudget > 0))
                      ? "Try adjusting your filters"
                      : activeFilter === "applied"
                        ? "Opportunities you apply to will appear here"
                        : "Available opportunities will appear here"
                }
              />
            )}
        </div>
      </div>
    </RoleColorProvider>
  );
}
