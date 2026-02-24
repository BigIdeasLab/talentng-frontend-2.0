"use client";

import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SortType } from "@/lib/types";

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortType;
  onSortChange: (sort: SortType) => void;
  onFilterClick: () => void;
}

export function SearchAndFilters({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  onFilterClick,
}: SearchAndFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
      <div className="flex-1 relative">
        <svg
          className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
          width="15"
          height="15"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.75 12.75L15.75 15.75"
            stroke="#B2B2B2"
            strokeWidth="1.125"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25Z"
            stroke="#B2B2B2"
            strokeWidth="1.125"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <Input
          type="text"
          placeholder="Search role, Level or jobs"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 h-9 rounded-lg border-[#E1E4EA] font-inter-tight text-xs placeholder:text-black/30 placeholder:capitalize"
        />
      </div>

      <button
        onClick={onFilterClick}
        className="flex items-center gap-1.5 px-3 h-9 hover:bg-gray-50 rounded-lg transition-colors flex-shrink-0"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.25 5.25H4.5"
            stroke="black"
            strokeWidth="1.125"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2.25 12.75H6.75"
            stroke="black"
            strokeWidth="1.125"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.5 12.75H15.75"
            stroke="black"
            strokeWidth="1.125"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.25 5.25H15.75"
            stroke="black"
            strokeWidth="1.125"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.5 5.25C4.5 4.55109 4.5 4.20164 4.61418 3.92597C4.76642 3.55844 5.05844 3.26642 5.42597 3.11418C5.70164 3 6.05109 3 6.75 3C7.44891 3 7.79835 3 8.07405 3.11418C8.44155 3.26642 8.7336 3.55844 8.88585 3.92597C9 4.20164 9 4.55109 9 5.25C9 5.94891 9 6.29837 8.88585 6.57403C8.7336 6.94157 8.44155 7.23358 8.07405 7.38582C7.79835 7.5 7.44891 7.5 6.75 7.5C6.05109 7.5 5.70164 7.5 5.42597 7.38582C5.05844 7.23358 4.76642 6.94157 4.61418 6.57403C4.5 6.29837 4.5 5.94891 4.5 5.25Z"
            stroke="black"
            strokeWidth="1.125"
          />
          <path
            d="M9 12.75C9 12.0511 9 11.7017 9.11415 11.426C9.2664 11.0585 9.55845 10.7664 9.92595 10.6141C10.2017 10.5 10.5511 10.5 11.25 10.5C11.9489 10.5 12.2983 10.5 12.574 10.6141C12.9415 10.7664 13.2336 11.0585 13.3858 11.426C13.5 11.7017 13.5 12.0511 13.5 12.75C13.5 13.4489 13.5 13.7983 13.3858 14.074C13.2336 14.4415 12.9415 14.7336 12.574 14.8858C12.2983 15 11.9489 15 11.25 15C10.5511 15 10.2017 15 9.92595 14.8858C9.55845 14.7336 9.2664 14.4415 9.11415 14.074C9 13.7983 9 13.4489 9 12.75Z"
            stroke="black"
            strokeWidth="1.125"
          />
        </svg>
        <span className="text-xs font-normal font-inter-tight">Filter</span>
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-1.5 px-3 h-9 hover:bg-gray-50 rounded-lg transition-colors flex-shrink-0">
            <span className="text-xs font-normal font-inter-tight text-black">
              {sortBy === "newest"
                ? "Newest"
                : sortBy === "oldest"
                  ? "Oldest"
                  : sortBy === "rate-high"
                    ? "Rate: High to Low"
                    : "Rate: Low to High"}
            </span>
            <svg
              width="13"
              height="13"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.2826 6.2209C11.3525 6.29058 11.4079 6.37338 11.4458 6.46454C11.4837 6.5557 11.5031 6.65344 11.5031 6.75215C11.5031 6.85086 11.4837 6.9486 11.4458 7.03977C11.4079 7.13093 11.3525 7.21373 11.2826 7.2834L8.28255 10.2834C8.21287 10.3533 8.13008 10.4088 8.03892 10.4467C7.94775 10.4845 7.85001 10.504 7.7513 10.504C7.65259 10.504 7.55485 10.4845 7.46369 10.4467C7.37252 10.4088 7.28973 10.3533 7.22005 10.2834L4.22005 7.2834C4.07915 7.14251 4 6.95141 4 6.75215C4 6.5529 4.07915 6.3618 4.22005 6.2209C4.36095 6.08001 4.55204 6.00085 4.7513 6.00085C4.95056 6.00085 5.14165 6.08001 5.28255 6.2209L7.75193 8.68903L10.2213 6.21903C10.2911 6.14942 10.3739 6.09425 10.465 6.05666C10.5561 6.01908 10.6538 5.99983 10.7523 6C10.8509 6.00018 10.9484 6.01977 11.0394 6.05768C11.1304 6.09558 11.213 6.15105 11.2826 6.2209Z"
                fill="black"
              />
            </svg>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onSortChange("newest")}>
            Newest
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange("oldest")}>
            Oldest
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange("rate-high")}>
            Rate: High to Low
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange("rate-low")}>
            Rate: Low to High
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
