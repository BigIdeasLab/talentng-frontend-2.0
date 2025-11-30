"use client";

import { useState } from "react";
import {
  DiscoverTalentHeader,
  TalentGrid,
  talentData,
  FilterModal,
  FilterState,
} from "@/components/business/DiscoverTalent";

export default function DiscoverTalentPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    skills: [],
    location: "",
    availability: "All",
    experienceLevel: null,
  });

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <DiscoverTalentHeader
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterClick={() => setIsFilterModalOpen(true)}
      />
      <TalentGrid talents={talentData} />
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        initialFilters={filters}
      />
    </div>
  );
}
