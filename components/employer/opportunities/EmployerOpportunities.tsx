"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";
import { useRecruiterOpportunitiesQuery } from "@/hooks/useRecruiterOpportunities";
import type { TabType, SortType } from "@/lib/types";
import { transformOpportunityToCard } from "@/lib/utils/opportunities";
import { OpportunitiesHeader } from "./OpportunitiesHeader";
import { SearchAndFilters } from "./SearchAndFilters";
import { OpportunitiesTabs } from "./OpportunitiesTabs";
import { OpportunityCard as OpportunityCardComponent } from "./OpportunityCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Briefcase } from "lucide-react";
import { OpportunitiesFilterModal } from "@/components/talent/opportunities/OpportunitiesFilterModal";
import { RoleColorProvider } from "@/lib/theme/RoleColorContext";
import { OpportunitiesSkeleton } from "./OpportunitiesSkeleton";

export function EmployerOpportunities() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<TabType>("open");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortType>("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<any>(null);
  const [offset, setOffset] = useState(0);

  const LIMIT = 20;
  const isInitialLoadRef = useRef(true);

  const STATUS_MAP: Record<TabType, string> = {
    open: "active",
    closed: "closed",
    draft: "draft",
  };
  const SORT_MAP: Record<
    SortType,
    {
      sortBy: "createdAt" | "applicationCount" | "title" | "minBudget";
      sortOrder: "asc" | "desc";
    }
  > = {
    newest: { sortBy: "createdAt", sortOrder: "desc" },
    oldest: { sortBy: "createdAt", sortOrder: "asc" },
    "rate-high": { sortBy: "minBudget", sortOrder: "desc" },
    "rate-low": { sortBy: "minBudget", sortOrder: "asc" },
  };

  const queryParams = {
    status: STATUS_MAP[activeTab],
    ...(searchQuery ? { q: searchQuery } : {}),
    ...(appliedFilters?.types?.length
      ? { type: appliedFilters.types.join(",") }
      : {}),
    ...(appliedFilters?.skills?.length
      ? { tags: appliedFilters.skills.join(",") }
      : {}),
    ...(appliedFilters?.categories?.length
      ? { category: appliedFilters.categories.join(",") }
      : {}),
    ...(appliedFilters?.experienceLevels?.length
      ? { experienceLevel: appliedFilters.experienceLevels.join(",") }
      : {}),
    ...(appliedFilters?.location ? { location: appliedFilters.location } : {}),
    ...(appliedFilters?.minBudget && appliedFilters.minBudget > 0
      ? { minBudget: appliedFilters.minBudget }
      : {}),
    ...(appliedFilters?.maxBudget && appliedFilters.maxBudget > 0
      ? { maxBudget: appliedFilters.maxBudget }
      : {}),
    ...SORT_MAP[sortBy],
    limit: LIMIT,
    offset: offset,
  };

  const {
    data: opportunitiesRaw,
    isLoading,
    isPending,
    refetch: fetchOpportunities,
  } = useRecruiterOpportunitiesQuery(queryParams);

  // Filter count calculation
  const getFilterCount = (): number => {
    if (!appliedFilters) return 0;
    let count = 0;
    if (appliedFilters.skills?.length) count += appliedFilters.skills.length;
    if (appliedFilters.types?.length) count += appliedFilters.types.length;
    if (appliedFilters.categories?.length)
      count += appliedFilters.categories.length;
    if (appliedFilters.experienceLevels?.length)
      count += appliedFilters.experienceLevels.length;
    if (appliedFilters.location) count += 1;
    if (appliedFilters.minBudget && appliedFilters.minBudget > 0) count += 1;
    if (appliedFilters.maxBudget && appliedFilters.maxBudget > 0) count += 1;
    return count;
  };

  // Handle filter application
  const handleApplyFilters = (filters: any) => {
    setAppliedFilters(filters);
    setIsFilterOpen(false);
    setOffset(0); // Reset to first page on filter change
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (opportunitiesRaw?.pagination?.hasNextPage) {
      setOffset(offset + LIMIT);
    }
  };

  const handlePreviousPage = () => {
    if (opportunitiesRaw?.pagination?.hasPreviousPage) {
      setOffset(Math.max(0, offset - LIMIT));
    }
  };

  // Server handles all filtering and sorting — render results directly
  const filteredOpportunities = (opportunitiesRaw?.data || []).map(
    transformOpportunityToCard,
  );

  // Handle tab from query params
  useEffect(() => {
    const tabParam = searchParams.get("tab") as TabType | null;
    if (tabParam && ["open", "closed", "draft"].includes(tabParam)) {
      setActiveTab(tabParam);
      setOffset(0); // Reset to first page on tab change
    }
  }, [searchParams]);

  // Mark initial load as complete after first successful fetch
  useEffect(() => {
    if (opportunitiesRaw && isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
    }
  }, [opportunitiesRaw]);

  // Reset to page 0 when filters change
  useEffect(() => {
    setOffset(0);
  }, [activeTab, searchQuery, sortBy, appliedFilters]);

  const handlePostClick = () => {
    router.push("/opportunities/post");
  };

  if (
    (isLoading || isPending) &&
    isInitialLoadRef.current &&
    !opportunitiesRaw
  ) {
    return (
      <RoleColorProvider role="recruiter">
        <div className="h-screen overflow-x-hidden bg-white flex flex-col">
          {/* Fixed Header */}
          <div className="w-full px-[25px] pt-[19px] pb-[16px] border-b border-[#E1E4EA] flex-shrink-0">
            {/* Header */}
            <div className="flex flex-col gap-[8px] mb-[19px]">
              <OpportunitiesHeader onPostClick={handlePostClick} />
              <SearchAndFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onFilterClick={() => setIsFilterOpen(true)}
                isSearching={false}
                filterCount={getFilterCount()}
                filterModal={
                  <OpportunitiesFilterModal
                    isOpen={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                    onApply={handleApplyFilters}
                    availableSkills={[]}
                    initialFilters={appliedFilters || undefined}
                  />
                }
              />
            </div>

            {/* Tabs */}
            <OpportunitiesTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          {/* Scrollable Content with Skeleton */}
          <div className="flex-1 overflow-y-auto scrollbar-styled">
            <div className="px-3 md:px-5 pt-5 md:pt-6">
              <OpportunitiesSkeleton />
            </div>
          </div>
        </div>
      </RoleColorProvider>
    );
  }

  return (
    <RoleColorProvider role="recruiter">
      {/* Desktop Layout */}
      <div className="hidden md:flex h-screen overflow-x-hidden bg-white flex-col">
        {/* Fixed Header */}
        <div className="w-full px-[25px] pt-[19px] pb-[16px] border-b border-[#E1E4EA] flex-shrink-0">
          {/* Header */}
          <div className="flex flex-col gap-[8px] mb-[19px]">
            <OpportunitiesHeader onPostClick={handlePostClick} />
            <SearchAndFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onFilterClick={() => setIsFilterOpen(true)}
              isSearching={isPending}
              filterCount={getFilterCount()}
              filterModal={
                <OpportunitiesFilterModal
                  isOpen={isFilterOpen}
                  onClose={() => setIsFilterOpen(false)}
                  onApply={handleApplyFilters}
                  availableSkills={[]}
                  initialFilters={appliedFilters || undefined}
                />
              }
            />
          </div>

          {/* Tabs */}
          <OpportunitiesTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scrollbar-styled">
          <div className="px-3 md:px-5 pt-5 md:pt-6 pb-6">
            {/* Opportunities Grid or Empty State */}
            {filteredOpportunities.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                title="No opportunities match your search"
                description={
                  searchQuery.trim()
                    ? "Try adjusting your search query"
                    : appliedFilters &&
                        (appliedFilters.skills?.length > 0 ||
                          appliedFilters.types?.length > 0 ||
                          appliedFilters.categories?.length > 0 ||
                          appliedFilters.experienceLevels?.length > 0 ||
                          appliedFilters.location ||
                          (appliedFilters.minBudget &&
                            appliedFilters.minBudget > 0) ||
                          (appliedFilters.maxBudget &&
                            appliedFilters.maxBudget > 0))
                      ? "Try adjusting your filters"
                      : activeTab === "draft"
                        ? "You haven't created any draft opportunities yet"
                        : activeTab === "closed"
                          ? "You don't have any closed opportunities"
                          : "You haven't posted any opportunities yet"
                }
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredOpportunities.map((opportunity) => (
                  <OpportunityCardComponent
                    key={opportunity.id}
                    opportunity={opportunity}
                    activeTab={activeTab}
                    onMutationSuccess={fetchOpportunities}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pagination Controls - Desktop */}
        {opportunitiesRaw?.pagination &&
          opportunitiesRaw.pagination.total > 0 && (
            <div className="hidden md:flex items-center justify-between px-5 py-4 border-t border-[#E1E4EA] flex-shrink-0">
              <div className="text-[13px] text-[#525866] font-inter-tight">
                Showing {opportunitiesRaw.pagination.offset + 1} to{" "}
                {Math.min(
                  opportunitiesRaw.pagination.offset +
                    opportunitiesRaw.pagination.limit,
                  opportunitiesRaw.pagination.total,
                )}{" "}
                of {opportunitiesRaw.pagination.total} opportunities
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={!opportunitiesRaw.pagination.hasPreviousPage}
                  className="px-4 py-2 border border-[#E1E4EA] rounded-lg text-[13px] font-inter-tight disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 active:bg-gray-100 active:scale-95 transition-all"
                >
                  Previous
                </button>
                <span className="text-[13px] text-[#525866] font-inter-tight">
                  Page {opportunitiesRaw.pagination.currentPage} of{" "}
                  {opportunitiesRaw.pagination.totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={!opportunitiesRaw.pagination.hasNextPage}
                  className="px-4 py-2 border border-[#E1E4EA] rounded-lg text-[13px] font-inter-tight disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 active:bg-gray-100 active:scale-95 transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          )}

        {/* Pagination Controls - Mobile */}
        {opportunitiesRaw?.pagination &&
          opportunitiesRaw.pagination.total > 0 && (
            <div className="md:hidden px-4 py-4 border-t border-[#E1E4EA] bg-white flex-shrink-0">
              <div className="flex flex-col gap-3">
                <div className="text-[13px] text-[#525866] font-inter-tight text-center">
                  Showing {opportunitiesRaw.pagination.offset + 1} to{" "}
                  {Math.min(
                    opportunitiesRaw.pagination.offset +
                      opportunitiesRaw.pagination.limit,
                    opportunitiesRaw.pagination.total,
                  )}{" "}
                  of {opportunitiesRaw.pagination.total} opportunities
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      handlePreviousPage();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    disabled={!opportunitiesRaw.pagination.hasPreviousPage}
                    className="px-4 py-2 border border-[#E1E4EA] rounded-lg text-[13px] font-inter-tight disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 active:bg-gray-100 active:scale-95 transition-all min-h-[44px]"
                  >
                    Previous
                  </button>
                  <span className="text-[13px] text-[#525866] font-inter-tight">
                    Page {opportunitiesRaw.pagination.currentPage} of{" "}
                    {opportunitiesRaw.pagination.totalPages}
                  </span>
                  <button
                    onClick={() => {
                      handleNextPage();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    disabled={!opportunitiesRaw.pagination.hasNextPage}
                    className="px-4 py-2 border border-[#E1E4EA] rounded-lg text-[13px] font-inter-tight disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 active:bg-gray-100 active:scale-95 transition-all min-h-[44px]"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>

      {/* Mobile Layout - Single scroll container */}
      <div className="md:hidden h-[calc(100vh-60px)] overflow-y-auto scrollbar-styled bg-white">
        {/* Header */}
        <div className="px-4 pt-[19px] pb-4 border-b border-[#E1E4EA]">
          <div className="mb-[19px]">
            <OpportunitiesHeader onPostClick={handlePostClick} />
          </div>
          <SearchAndFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onFilterClick={() => setIsFilterOpen(true)}
            isSearching={isPending}
            filterCount={getFilterCount()}
            filterModal={
              <OpportunitiesFilterModal
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApply={handleApplyFilters}
                availableSkills={[]}
                initialFilters={appliedFilters || undefined}
              />
            }
          />
        </div>

        {/* Tabs - Sticky */}
        <div className="sticky top-0 z-10 bg-white px-4 py-2 border-b border-[#E1E4EA]">
          <OpportunitiesTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Content */}
        <div className="px-3 pt-5 pb-6">
          {filteredOpportunities.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No opportunities match your search"
              description={
                searchQuery.trim()
                  ? "Try adjusting your search query"
                  : appliedFilters &&
                      (appliedFilters.skills?.length > 0 ||
                        appliedFilters.types?.length > 0 ||
                        appliedFilters.categories?.length > 0 ||
                        appliedFilters.experienceLevels?.length > 0 ||
                        appliedFilters.location ||
                        (appliedFilters.minBudget &&
                          appliedFilters.minBudget > 0) ||
                        (appliedFilters.maxBudget &&
                          appliedFilters.maxBudget > 0))
                    ? "Try adjusting your filters"
                    : activeTab === "draft"
                      ? "You haven't created any draft opportunities yet"
                      : activeTab === "closed"
                        ? "You don't have any closed opportunities"
                        : "You haven't posted any opportunities yet"
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredOpportunities.map((opportunity) => (
                <OpportunityCardComponent
                  key={opportunity.id}
                  opportunity={opportunity}
                  activeTab={activeTab}
                  onMutationSuccess={fetchOpportunities}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pagination - Mobile */}
        {opportunitiesRaw?.pagination &&
          opportunitiesRaw.pagination.total > 0 && (
            <div className="px-4 py-4 border-t border-[#E1E4EA] bg-white">
              <div className="flex flex-col gap-3">
                <div className="text-[13px] text-[#525866] font-inter-tight text-center">
                  Showing {opportunitiesRaw.pagination.offset + 1} to{" "}
                  {Math.min(
                    opportunitiesRaw.pagination.offset +
                      opportunitiesRaw.pagination.limit,
                    opportunitiesRaw.pagination.total,
                  )}{" "}
                  of {opportunitiesRaw.pagination.total} opportunities
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      handlePreviousPage();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    disabled={!opportunitiesRaw.pagination.hasPreviousPage}
                    className="px-4 py-2 border border-[#E1E4EA] rounded-lg text-[13px] font-inter-tight disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 active:bg-gray-100 active:scale-95 transition-all min-h-[44px]"
                  >
                    Previous
                  </button>
                  <span className="text-[13px] text-[#525866] font-inter-tight">
                    Page {opportunitiesRaw.pagination.currentPage} of{" "}
                    {opportunitiesRaw.pagination.totalPages}
                  </span>
                  <button
                    onClick={() => {
                      handleNextPage();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    disabled={!opportunitiesRaw.pagination.hasNextPage}
                    className="px-4 py-2 border border-[#E1E4EA] rounded-lg text-[13px] font-inter-tight disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 active:bg-gray-100 active:scale-95 transition-all min-h-[44px]"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
    </RoleColorProvider>
  );
}
