"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  "All",
  "Designer",
  "Developer",
  "Writer",
  "Illustrator",
  "Animator",
  "Marketing",
  "Photographer",
  "Music & Audio",
  "Content Creation",
  "Videography",
];

interface DiscoverTalentHeaderProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function DiscoverTalentHeader({
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: DiscoverTalentHeaderProps) {
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
        <button className="h-[38px] px-[15px] py-[7px] flex items-center gap-[5px] bg-[#F5F5F5] rounded-[8px] flex-shrink-0">
          <SlidersHorizontal className="w-[15px] h-[15px] text-black" />
          <span className="text-[13px] font-normal text-black font-inter-tight">
            Filter
          </span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-[8px] overflow-x-auto scrollbar-hide">
        {categories.map((category) => (
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
