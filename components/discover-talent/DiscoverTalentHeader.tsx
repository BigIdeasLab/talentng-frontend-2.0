"use client";

import { useState, useCallback } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FilterModal, type FilterState } from "./FilterModal";
import categories from "@/lib/data/categories.json";
import { SearchInput } from "@/components/ui/SearchInput";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

interface DiscoverTalentHeaderProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterApply?: (filters: FilterState) => void;
  sortBy?: string;
  onSortChange?: (sort: string) => void;
  isLoading?: boolean;
  error?: string | null;
  isMobile?: boolean;
}

const CONSTANTS = {
  SEARCH_MAX_LENGTH: 100,
  PLACEHOLDER: "Search talents, skills, or services",
} as const;

export function DiscoverTalentHeader({
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  onFilterApply,
  sortBy = "newest",
  onSortChange,
  isLoading = false,
  error = null,
  isMobile = false,
}: DiscoverTalentHeaderProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterState | null>(
    null,
  );

  const handleCategoryChange = useCallback(
    (category: string) => {
      onCategoryChange(category);
    },
    [onCategoryChange],
  );

  const getFilterCount = (): number => {
    if (!appliedFilters) return 0;
    let count = 0;
    if (appliedFilters.skills?.length > 0)
      count += appliedFilters.skills.length;
    if (appliedFilters.stack?.length > 0) count += appliedFilters.stack.length;
    if (appliedFilters.location) count += 1;
    if (appliedFilters.availability?.length > 0)
      count += appliedFilters.availability.length;
    if (appliedFilters.headline) count += 1;
    return count;
  };

  return (
    <>
      {/* Desktop Header */}
      <div className="hidden md:block flex-shrink-0 px-[25px] pt-[19px] pb-[16px] border-b border-[#E1E4EA]">
        {/* Title */}
        <h1 className="text-[16px] font-medium text-black font-inter-tight leading-[16px] mb-[19px]">
          Discover Talent
        </h1>

        {/* Search Bar and Filter */}
        <div className="flex flex-col gap-[8px] mb-[19px]">
          <div className="flex items-center gap-[8px]">
            {/* Search Input */}
            <div className="flex-1 max-w-[585px]">
              <SearchInput
                value={searchQuery}
                onChange={onSearchChange}
                onSearch={onSearchChange}
                placeholder={CONSTANTS.PLACEHOLDER}
                maxLength={CONSTANTS.SEARCH_MAX_LENGTH}
                isLoading={isLoading}
                error={error || undefined}
                ariaLabel="Search talents"
              />
            </div>

            {/* Filter and Sort Container */}
            <div className="flex items-center gap-[8px]">
              {/* Filter Button */}
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(true)}
                  disabled={isLoading}
                  className={`h-[38px] px-[15px] py-[7px] flex items-center justify-center gap-[5px] rounded-[8px] transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                    getFilterCount() > 0
                      ? "bg-[#5C30FF0D] border border-[#5C30FF] text-[#5C30FF]"
                      : "bg-[#F5F5F5] hover:bg-gray-100 text-black border border-transparent"
                  }`}
                  aria-label="Filter results"
                >
                  <SlidersHorizontal className="w-[15px] h-[15px]" />
                  <span className="text-[13px] font-normal font-inter-tight">
                    Filter
                  </span>
                  {getFilterCount() > 0 && (
                    <span className="ml-1 bg-[#5C30FF] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                      {getFilterCount()}
                    </span>
                  )}
                </button>

                {/* Filter Modal */}
                <FilterModal
                  isOpen={isFilterOpen}
                  onClose={() => setIsFilterOpen(false)}
                  onApply={(filters) => {
                    setAppliedFilters(filters);
                    setIsFilterOpen(false);
                    onFilterApply?.(filters);
                  }}
                />
              </div>

              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    disabled={isLoading}
                    className={cn(
                      "h-[38px] px-[15px] py-[7px] flex items-center justify-center gap-[5px] rounded-[8px] transition-opacity disabled:opacity-60 disabled:cursor-not-allowed",
                      isLoading ? "bg-gray-100" : "bg-[#F5F5F5]",
                    )}
                  >
                    <span className="text-[13px] font-normal text-black font-inter-tight capitalize">
                      {sortBy === "newest" ? "Newest" : "Oldest"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-black" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onSortChange?.("newest")}>
                    Newest
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onSortChange?.("oldest")}>
                    Oldest
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div
          className="flex items-center gap-[8px] overflow-x-auto scrollbar-hidden"
          role="tablist"
        >
          {["All", ...categories].map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              disabled={isLoading}
              role="tab"
              aria-selected={selectedCategory === category}
              aria-label={`Filter by ${category}`}
              className={cn(
                "px-[12px] py-[6px] flex justify-center items-center whitespace-nowrap flex-shrink-0 rounded transition-colors disabled:opacity-60 disabled:cursor-not-allowed",
                selectedCategory === category
                  ? "text-black font-medium border-b-2 border-black"
                  : "text-black/30 font-medium hover:text-black/50",
              )}
            >
              <span className="text-[13px] font-inter-tight">{category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Header - Only title, search, filters (tabs are in parent) */}
      {isMobile && (
        <div className="px-4 pt-[19px] pb-4 border-b border-[#E1E4EA]">
          {/* Title */}
          <h1 className="text-[16px] font-medium text-black font-inter-tight leading-[16px] mb-[19px]">
            Discover Talent
          </h1>

          {/* Search Bar */}
          <div className="mb-4">
            <SearchInput
              value={searchQuery}
              onChange={onSearchChange}
              onSearch={onSearchChange}
              placeholder={CONSTANTS.PLACEHOLDER}
              maxLength={CONSTANTS.SEARCH_MAX_LENGTH}
              isLoading={isLoading}
              error={error || undefined}
              ariaLabel="Search talents"
            />
          </div>

          {/* Filter and Sort Container */}
          <div className="flex items-center gap-[8px]">
            {/* Filter Button */}
            <div className="relative flex-1">
              <button
                onClick={() => setIsFilterOpen(true)}
                disabled={isLoading}
                className={`h-[44px] px-[15px] py-[7px] flex items-center justify-center gap-[5px] rounded-[8px] w-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                  getFilterCount() > 0
                    ? "bg-[#5C30FF0D] border border-[#5C30FF] text-[#5C30FF]"
                    : "bg-[#F5F5F5] hover:bg-gray-100 text-black border border-transparent"
                }`}
                aria-label="Filter results"
              >
                <SlidersHorizontal className="w-[15px] h-[15px]" />
                <span className="text-[13px] font-normal font-inter-tight">
                  Filter
                </span>
                {getFilterCount() > 0 && (
                  <span className="ml-1 bg-[#5C30FF] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {getFilterCount()}
                  </span>
                )}
              </button>

              {/* Filter Modal */}
              <FilterModal
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApply={(filters) => {
                  setAppliedFilters(filters);
                  setIsFilterOpen(false);
                  onFilterApply?.(filters);
                }}
              />
            </div>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  disabled={isLoading}
                  className={cn(
                    "h-[44px] px-[15px] py-[7px] flex items-center justify-center gap-[5px] rounded-[8px] flex-1 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed",
                    isLoading ? "bg-gray-100" : "bg-[#F5F5F5]",
                  )}
                >
                  <span className="text-[13px] font-normal text-black font-inter-tight capitalize">
                    {sortBy === "newest" ? "Newest" : "Oldest"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-black" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onSortChange?.("newest")}>
                  Newest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSortChange?.("oldest")}>
                  Oldest
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
    </>
  );
}
