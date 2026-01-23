"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { OpportunityCard } from "./opportunity-card";
import { EmptyState } from "./empty-state";
import type { OpportunitiesGridProps } from "./types";

interface OpportunitiesGridExtendedProps extends OpportunitiesGridProps {
  onApplicationSubmitted?: (opportunityId: string) => void;
  onNextPage?: () => void;
  onPreviousPage?: () => void;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  currentPage?: number;
  totalPages?: number;
}

export function OpportunitiesGrid({
  opportunities,
  onApplicationSubmitted,
  onNextPage,
  onPreviousPage,
  hasNextPage = false,
  hasPreviousPage = false,
  currentPage = 1,
  totalPages = 1,
}: OpportunitiesGridExtendedProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Result Count */}
      <div className="flex-shrink-0 px-[25px] py-[12px] border-b border-[#E1E4EA]">
        <p className="text-[12px] text-gray-600">
          {opportunities.length} opportunit
          {opportunities.length !== 1 ? "ies" : "y"} found
        </p>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto scrollbar-styled px-[25px] py-[16px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[7px] pb-8">
          {opportunities.length > 0 ? (
            opportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                onApplicationSubmitted={(oppId: string) => {
                  if (onApplicationSubmitted) {
                    onApplicationSubmitted(oppId);
                  }
                }}
              />
            ))
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex-shrink-0 px-[25px] py-[16px] border-t border-[#E1E4EA] flex items-center justify-between">
        <button
          onClick={onPreviousPage}
          disabled={!hasPreviousPage}
          className="flex items-center gap-[6px] px-[12px] py-[8px] rounded-[8px] border border-[#E1E4EA] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F5F5F5]"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-[13px] font-normal">Previous</span>
        </button>

        <span className="text-[13px] font-normal text-gray-600">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={onNextPage}
          disabled={!hasNextPage}
          className="flex items-center gap-[6px] px-[12px] py-[8px] rounded-[8px] border border-[#E1E4EA] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F5F5F5]"
        >
          <span className="text-[13px] font-normal">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
