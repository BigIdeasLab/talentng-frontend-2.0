import type { FilterType } from "./types";
import { SearchBar } from "./search-bar";
import { FilterTabs } from "./filter-tabs";

interface TalentOpportunitiesHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterClick: () => void;
  isLoading?: boolean;
  filterCount?: number;
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function TalentOpportunitiesHeader({
  searchQuery,
  onSearchChange,
  onFilterClick,
  isLoading = false,
  filterCount = 0,
  activeFilter,
  onFilterChange,
}: TalentOpportunitiesHeaderProps) {
  return (
    <div className="flex-shrink-0">
      {/* Title */}
      <h1 className="text-[16px] font-medium font-inter-tight text-black leading-[16px] mb-[19px]">
        Opportunities
      </h1>

      {/* Search Bar and Filter */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onFilterClick={onFilterClick}
        isLoading={isLoading}
        filterCount={filterCount}
      />

      {/* Filter Tabs */}
      <FilterTabs activeFilter={activeFilter} onFilterChange={onFilterChange} />
    </div>
  );
}
