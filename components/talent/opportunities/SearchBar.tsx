import { SlidersHorizontal } from "lucide-react";
import { SearchInput } from "@/components/ui/SearchInput";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterClick: () => void;
  isLoading?: boolean;
  filterCount?: number;
  filterModal?: React.ReactNode;
}

export function SearchBar({
  searchQuery,
  onSearchChange,
  onFilterClick,
  isLoading = false,
  filterCount = 0,
  filterModal,
}: SearchBarProps) {
  return (
    <div className="flex items-center gap-[8px] mb-[19px]">
      {/* Search Bar */}
      <div className="flex-1 max-w-[585px]">
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          onSearch={onSearchChange}
          placeholder="Search opportunities, skills..."
          isLoading={isLoading}
          debounceDelay={400}
        />
      </div>

      {/* Filter Button */}
      <div className="relative flex-shrink-0">
        <button
          onClick={onFilterClick}
          className={`h-[38px] px-[15px] py-[7px] flex items-center gap-[5px] rounded-[8px] transition-colors ${
            filterCount > 0
              ? "bg-[#8463FF0D] border border-[#8463FF] text-[#8463FF]"
              : "bg-[#F5F5F5] hover:bg-gray-100 text-black border border-transparent"
          }`}
        >
          <SlidersHorizontal className="w-[15px] h-[15px]" />
          <span className="text-[13px] font-normal font-inter-tight">
            Filter
          </span>
          {filterCount > 0 && (
            <span className="ml-1 bg-[#8463FF] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
              {filterCount}
            </span>
          )}
        </button>
        {filterModal}
      </div>
    </div>
  );
}
