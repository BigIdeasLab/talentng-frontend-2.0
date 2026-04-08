import type { FilterType } from "./types";
import { cn } from "@/lib/utils";

interface FilterTabsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const FILTERS = [
  { id: "all", label: "All" },
  { id: "FullTime", label: "Full-time" },
  { id: "PartTime", label: "Part-time" },
  { id: "Contract", label: "Contract" },
  { id: "Internship", label: "Internship" },
  { id: "Volunteer", label: "Volunteer" },
  { id: "Freelance", label: "Freelance" },
  { id: "Remote", label: "Remote" },
  { id: "Hybrid", label: "Hybrid" },
  { id: "OnSite", label: "On-Site" },
  { id: "applied", label: "Applied" },
];

export function FilterTabs({ activeFilter, onFilterChange }: FilterTabsProps) {
  return (
    <div className="flex items-center gap-[8px] overflow-x-auto scrollbar-hidden">
      {FILTERS.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id as FilterType)}
          className={cn(
            "px-[12px] py-[6px] flex justify-center items-center whitespace-nowrap flex-shrink-0 rounded transition-colors",
            activeFilter === filter.id
              ? "text-black font-medium border-b-2 border-black"
              : "text-black/30 font-medium hover:text-black/50",
          )}
        >
          <span className="text-[13px] font-inter-tight">{filter.label}</span>
        </button>
      ))}
    </div>
  );
}
