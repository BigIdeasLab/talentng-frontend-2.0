"use client";

import { useState, useCallback, useRef } from "react";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FilterModal, type FilterState } from "./FilterModal";
import categories from "@/lib/data/categories.json";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
}

const CONSTANTS = {
  SEARCH_MAX_LENGTH: 100,
  DEBOUNCE_DELAY: 300,
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
}: DiscoverTalentHeaderProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterState | null>(
    null,
  );
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const debounceTimer = useRef<NodeJS.Timeout>();

  const handleSearchChange = useCallback(
    (value: string) => {
      // Validate input length
      if (value.length > CONSTANTS.SEARCH_MAX_LENGTH) return;

      // Update local state immediately for responsive input
      setLocalSearchQuery(value);

      // Clear previous debounce
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // Debounce the search call
      debounceTimer.current = setTimeout(() => {
        onSearchChange(value);
      }, CONSTANTS.DEBOUNCE_DELAY);
    },
    [onSearchChange],
  );

  const handleClearSearch = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    setLocalSearchQuery("");
    onSearchChange("");
  }, [onSearchChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape" && searchQuery) {
        handleClearSearch();
      }
    },
    [searchQuery, handleClearSearch],
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
    if (appliedFilters.categories.length > 0)
      count += appliedFilters.categories.length;
    if (appliedFilters.skills.length > 0) count += appliedFilters.skills.length;
    if (appliedFilters.location) count += 1;
    if (appliedFilters.availability !== "All") count += 1;
    return count;
  };

  return (
    <div className="flex-shrink-0 px-[25px] pt-[19px] pb-[16px] border-b border-[#E1E4EA]">
      {/* Title */}
      <h1 className="text-[16px] font-medium text-black font-inter-tight leading-[16px] mb-[19px]">
        Discover Talent
      </h1>

      {/* Search Bar and Filter */}
      <div className="flex flex-col gap-[8px] mb-[19px]">
        <div className="flex items-center gap-[8px]">
          {/* Search Input */}
          <div
            className={cn(
              "flex-1 max-w-[585px] h-[38px] px-[12px] py-[7px] flex items-center gap-[6px] border rounded-[8px] transition-colors",
              error ? "border-red-500 bg-red-50" : "border-[#E1E4EA]",
            )}
          >
            {isLoading ? (
              <div className="w-[15px] h-[15px] border-2 border-[#B2B2B2] border-t-transparent rounded-full animate-spin flex-shrink-0" />
            ) : (
              <Search className="w-[15px] h-[15px] text-[#B2B2B2] flex-shrink-0" />
            )}
            <input
              type="text"
              placeholder={CONSTANTS.PLACEHOLDER}
              value={localSearchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={CONSTANTS.SEARCH_MAX_LENGTH}
              aria-label="Search talents"
              aria-busy={isLoading}
              aria-describedby={error ? "search-error" : undefined}
              className={cn(
                "flex-1 text-[13px] font-normal font-inter-tight placeholder:text-black/30 placeholder:capitalize border-0 focus:outline-none bg-transparent transition-opacity",
              )}
            />
            {localSearchQuery && !isLoading && (
              <button
                onClick={handleClearSearch}
                className="flex-shrink-0 text-[#B2B2B2] hover:text-black transition-colors"
                aria-label="Clear search"
                type="button"
              >
                <X className="w-[15px] h-[15px]" />
              </button>
            )}
          </div>

          {/* Filter Button */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(true)}
              disabled={isLoading}
              className={cn(
                "h-[38px] px-[15px] py-[7px] flex items-center gap-[5px] rounded-[8px] flex-shrink-0 relative transition-opacity disabled:opacity-60 disabled:cursor-not-allowed",
                isLoading ? "bg-gray-100" : "bg-[#F5F5F5]",
              )}
              aria-label="Filter results"
            >
              <SlidersHorizontal className="w-[15px] h-[15px] text-black" />
              <span className="text-[13px] font-normal text-black font-inter-tight">
                Filter
              </span>
              {getFilterCount() > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                  {getFilterCount()}
                </div>
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
                  "h-[38px] px-[15px] py-[7px] flex items-center gap-[5px] rounded-[8px] flex-shrink-0 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed",
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

        {/* Error Message */}
        {error && (
          <p id="search-error" className="text-[12px] text-red-500 px-[12px]">
            {error}
          </p>
        )}
      </div>

      {/* Category Tabs */}
      <div
        className="flex items-center gap-[8px] overflow-x-auto scrollbar-hide"
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
  );
}
