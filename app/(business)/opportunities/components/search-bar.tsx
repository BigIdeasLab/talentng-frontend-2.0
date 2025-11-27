import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-4">
      {/* Search Container */}
      <div className="flex-1 min-w-0 max-w-full sm:max-w-[585px]">
        <div className="flex items-center gap-1 px-3 py-2 border border-[#E1E4EA] rounded-[8px] bg-white">
          <Search className="w-4 h-4 text-[#B2B2B2] flex-shrink-0" />
          <input
            type="text"
            placeholder="Search Role, Level or Jobs"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 text-[13px] font-normal font-inter-tight text-black placeholder:text-[rgba(0,0,0,0.3)] bg-transparent outline-none capitalize"
          />
        </div>
      </div>

      {/* Filter and Sort Buttons */}
      <div className="flex items-center gap-2">
        {/* Filter Button */}
        <button className="flex items-center gap-1 px-3 py-2 bg-[#F5F5F5] rounded-[8px] hover:bg-gray-200 transition-colors">
          <SlidersHorizontal className="w-4 h-4 text-black" />
          <span className="text-[13px] font-normal font-inter-tight text-black">
            Filter
          </span>
        </button>

        {/* Sort Button */}
        <button className="flex items-center gap-1 px-3 py-2 bg-[#F5F5F5] rounded-[8px] hover:bg-gray-200 transition-colors">
          <span className="text-[13px] font-normal font-inter-tight text-black">
            Newest
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-black" />
        </button>
      </div>
    </div>
  );
}
