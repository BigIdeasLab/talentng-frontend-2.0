"use client";

import { useState, useRef, useCallback } from "react";
import { TalentOpportunitiesHeader } from "@/components/talent/opportunities/header";
import { SearchBar } from "@/components/talent/opportunities/search-bar";
import { FilterTabs } from "@/components/talent/opportunities/filter-tabs";
import { OpportunitiesGrid } from "@/components/talent/opportunities/opportunities-grid";
import {
  OpportunitiesFilterModal,
  type OpportunitiesFilterState,
} from "@/components/talent/opportunities/OpportunitiesFilterModal";
import { OpportunitiesGridSkeleton } from "@/components/talent/opportunities/OpportunitySkeleton";
import type { FilterType, DisplayOpportunity } from "@/components/talent/opportunities/types";
import type { OpportunityData } from "./server-data";
import { getOpportunitiesData } from "./server-data";

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
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] =
    useState<OpportunitiesFilterState | null>(null);
  const [offset, setOffset] = useState(0);
  const [opportunities, setOpportunities] =
    useState<OpportunityData[]>(initialOpportunities);
  const [pagination, setPagination] = useState(initialPagination);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchOpportunitiesWithFilters = useCallback(
    async (pageOffset: number = 0) => {
      setIsLoading(true);
      setError(null);

      try {
        const { opportunities: newOpportunities, pagination: newPagination, error: fetchError } =
          await getOpportunitiesData({
            searchQuery,
            limit: LIMIT,
            offset: pageOffset,
          });

        setOpportunities(newOpportunities);
        setPagination(newPagination);
        setError(fetchError);
        setOffset(pageOffset);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch opportunities");
      } finally {
        setIsLoading(false);
      }
    },
    [searchQuery],
  );

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      fetchOpportunitiesWithFilters(0);
    }, 300);
  };

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    setOffset(0);
  };

  const handleNextPage = () => {
    fetchOpportunitiesWithFilters(offset + LIMIT);
  };

  const handlePreviousPage = () => {
    if (offset > 0) {
      fetchOpportunitiesWithFilters(offset - LIMIT);
    }
  };

  const getFilterCount = (): number => {
    if (!appliedFilters) return 0;
    let count = 0;
    if (appliedFilters.types.length > 0) count += appliedFilters.types.length;
    if (appliedFilters.skills.length > 0)
      count += appliedFilters.skills.length;
    if (appliedFilters.categories?.length)
      count += appliedFilters.categories.length;
    if (appliedFilters.experienceLevels?.length)
      count += appliedFilters.experienceLevels.length;
    if (appliedFilters.location) count += 1;
    return count;
  };

  return (
    <div className="h-screen overflow-x-hidden bg-white flex flex-col">
      {/* Header */}
      <div className="w-full px-[25px] pt-[19px] pb-[16px] border-b border-[#E1E4EA] flex-shrink-0">
        <TalentOpportunitiesHeader />

        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearch}
          onFilterClick={() => setIsFilterOpen(true)}
          isLoading={isLoading}
          filterCount={getFilterCount()}
        />

        <FilterTabs
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />

        <OpportunitiesFilterModal
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApply={(filters) => {
            setAppliedFilters(filters);
            setIsFilterOpen(false);
            fetchOpportunitiesWithFilters(0);
          }}
          availableSkills={[]}
          initialFilters={appliedFilters || undefined}
        />
      </div>

      {/* Grid Container */}
      <div className="flex-1 overflow-hidden">
        {isLoading && (
          <OpportunitiesGridSkeleton />
        )}
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
            onNextPage={handleNextPage}
            onPreviousPage={handlePreviousPage}
            hasNextPage={pagination?.hasNextPage || false}
            hasPreviousPage={pagination?.hasPreviousPage || false}
            currentPage={pagination?.currentPage || 1}
            totalPages={pagination?.totalPages || 1}
          />
        )}
      </div>
    </div>
  );
}
