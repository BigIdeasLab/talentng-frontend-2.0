type FilterType =
  | "all"
  | "job-listing"
  | "internship"
  | "volunteer"
  | "applied"
  | "part-time";

interface FilterTabsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const FILTERS = [
  { id: "all", label: "All" },
  { id: "job-listing", label: "Job Listing" },
  { id: "internship", label: "Internship" },
  { id: "part-time", label: "Part-time" },
  { id: "volunteer", label: "Volunteer" },
  { id: "applied", label: "Applied" },
];

export function FilterTabs({ activeFilter, onFilterChange }: FilterTabsProps) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pb-1.5">
      {FILTERS.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id as FilterType)}
          className={`flex items-center justify-center px-3 py-2.5 whitespace-nowrap transition-colors flex-shrink-0 ${
            activeFilter === filter.id
              ? "text-black"
              : "text-[rgba(0,0,0,0.3)] hover:text-black"
          }`}
        >
          <span className="text-[13px] font-medium font-inter-tight text-center">
            {filter.label}
          </span>
        </button>
      ))}
    </div>
  );
}
