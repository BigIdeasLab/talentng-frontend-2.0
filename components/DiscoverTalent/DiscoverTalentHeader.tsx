"use client";

import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { FilterModal, type FilterState } from "./FilterModal";
import categories from "@/lib/data/categories.json";

interface DiscoverTalentHeaderProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterApply?: (filters: FilterState) => void;
}

export function DiscoverTalentHeader({
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  onFilterApply,
}: DiscoverTalentHeaderProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterState | null>(null);

  const getFilterCount = (): number => {
    if (!appliedFilters) return 0;
    let count = 0;
    if (appliedFilters.categories.length > 0) count += appliedFilters.categories.length;
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
      <div className="flex items-center gap-[8px] mb-[19px]">
        <div className="flex-1 max-w-[585px] h-[38px] px-[12px] py-[7px] flex items-center gap-[6px] border border-[#E1E4EA] rounded-[8px]">
          <Search className="w-[15px] h-[15px] text-[#B2B2B2] flex-shrink-0" />
          <input
            type="text"
            placeholder="Search Talent or Services or Location"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 text-[13px] font-normal font-inter-tight placeholder:text-black/30 placeholder:capitalize border-0 focus:outline-none bg-transparent"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="h-[38px] px-[15px] py-[7px] flex items-center gap-[5px] bg-[#F5F5F5] rounded-[8px] flex-shrink-0 relative"
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
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-[8px] overflow-x-auto scrollbar-hide">
        {["All", ...categories].map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={cn(
              "px-[12px] flex justify-center items-center whitespace-nowrap flex-shrink-0",
              selectedCategory === category
                ? "text-black font-medium"
                : "text-black/30 font-medium",
            )}
          >
            <span className="text-[13px] font-inter-tight">{category}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
