import { Search, SlidersHorizontal, X } from "lucide-react";

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
      <div className="flex-1 max-w-[585px] h-[38px] px-[12px] py-[7px] flex items-center gap-[6px] border border-[#E1E4EA] rounded-[8px]">
        {isLoading ? (
          <div className="w-[15px] h-[15px] border-2 border-[#B2B2B2] border-t-transparent rounded-full animate-spin flex-shrink-0" />
        ) : (
          <Search className="w-[15px] h-[15px] text-[#B2B2B2] flex-shrink-0" />
        )}
        <input
          type="text"
          placeholder="Search opportunities, skills..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 text-[13px] font-normal font-inter-tight placeholder:text-black/30 border-0 focus:outline-none bg-transparent"
        />
        {searchQuery && !isLoading && (
          <button
            onClick={() => onSearchChange("")}
            className="flex-shrink-0 text-[#B2B2B2] hover:text-black transition-colors"
            aria-label="Clear search"
          >
            <X className="w-[15px] h-[15px]" />
          </button>
        )}
      </div>

      {/* Filter Button */}
      <div className="relative">
        <button
          onClick={onFilterClick}
          className={`h-[38px] px-[15px] py-[7px] flex items-center gap-[5px] rounded-[8px] flex-shrink-0 transition-colors ${
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
