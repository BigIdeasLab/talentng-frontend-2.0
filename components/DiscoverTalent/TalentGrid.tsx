"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { TalentCard } from "./TalentCard";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import type { TalentData } from "@/app/(business)/discover-talent/server-data";

interface TalentGridProps {
  talents: TalentData[];
  onNextPage?: () => void;
  onPreviousPage?: () => void;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  currentPage?: number;
  totalPages?: number;
  totalTalents?: number;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function TalentGrid({
  talents,
  onNextPage,
  onPreviousPage,
  hasNextPage = false,
  hasPreviousPage = false,
  currentPage = 1,
  totalPages = 1,
  totalTalents,
  emptyTitle,
  emptyDescription,
}: TalentGridProps) {
  const displayCount = totalTalents ?? talents.length;

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden md:flex flex-1 flex-col overflow-hidden">
        {/* Result Count */}
        <div className="flex-shrink-0 px-[25px] py-[12px] border-b border-[#E1E4EA]">
          <p className="text-[12px] text-gray-600">
            {displayCount} talent{displayCount !== 1 ? "s" : ""} found
          </p>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-styled px-[25px] py-[16px]">
          {talents.length > 0 ? (
            <ResponsiveGrid columns={3} gap={2} className="pb-8">
              {talents.map((talent) => (
                <TalentCard key={talent.id} talent={talent} />
              ))}
            </ResponsiveGrid>
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <p className="text-[15px] font-medium text-gray-600 mb-1.5">
                {emptyTitle || "No talents found"}
              </p>
              <p className="text-[13px] text-gray-500">
                {emptyDescription || "Try adjusting your filters or search query"}
              </p>
            </div>
          )}
        </div>

        {/* Pagination Controls - Desktop */}
        <div className="flex-shrink-0 px-[25px] py-[16px] border-t border-[#E1E4EA] flex items-center justify-between">
          <button
            onClick={onPreviousPage}
            disabled={!hasPreviousPage}
            className="flex items-center gap-[6px] px-[12px] py-[8px] rounded-[8px] border border-[#E1E4EA] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F5F5F5] active:bg-gray-100 active:scale-95 transition-all"
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
            className="flex items-center gap-[6px] px-[12px] py-[8px] rounded-[8px] border border-[#E1E4EA] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F5F5F5] active:bg-gray-100 active:scale-95 transition-all"
          >
            <span className="text-[13px] font-normal">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Layout - Single scroll container */}
      <div className="md:hidden">
        {/* Result Count */}
        <div className="px-4 py-[12px] border-b border-[#E1E4EA]">
          <p className="text-[12px] text-gray-600">
            {displayCount} talent{displayCount !== 1 ? "s" : ""} found
          </p>
        </div>

        <div className="px-4 py-[16px]">
          {talents.length > 0 ? (
            <ResponsiveGrid columns={3} gap={2} className="pb-8">
              {talents.map((talent) => (
                <TalentCard key={talent.id} talent={talent} />
              ))}
            </ResponsiveGrid>
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <p className="text-[15px] font-medium text-gray-600 mb-1.5">
                {emptyTitle || "No talents found"}
              </p>
              <p className="text-[13px] text-gray-500">
                {emptyDescription || "Try adjusting your filters or search query"}
              </p>
            </div>
          )}
        </div>

        {/* Pagination Controls - Mobile */}
        <div className="px-4 py-4 border-t border-[#E1E4EA] bg-white">
          <div className="flex flex-col gap-3">
            <span className="text-[13px] font-normal text-gray-600 text-center">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={onPreviousPage}
                disabled={!hasPreviousPage}
                className="flex items-center gap-[6px] px-4 py-2 min-h-[44px] rounded-[8px] border border-[#E1E4EA] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F5F5F5] active:bg-gray-100 active:scale-95 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-[13px] font-normal">Previous</span>
              </button>

              <button
                onClick={onNextPage}
                disabled={!hasNextPage}
                className="flex items-center gap-[6px] px-4 py-2 min-h-[44px] rounded-[8px] border border-[#E1E4EA] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F5F5F5] active:bg-gray-100 active:scale-95 transition-all"
              >
                <span className="text-[13px] font-normal">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
