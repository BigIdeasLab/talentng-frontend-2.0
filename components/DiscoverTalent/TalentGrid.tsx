"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { TalentCard } from "./TalentCard";
import type { TalentData } from "@/app/(business)/discover-talent/server-data";

interface TalentGridProps {
  talents: TalentData[];
  onNextPage?: () => void;
  onPreviousPage?: () => void;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  currentPage?: number;
}

export function TalentGrid({
  talents,
  onNextPage,
  onPreviousPage,
  hasNextPage = false,
  hasPreviousPage = false,
  currentPage = 1,
}: TalentGridProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Result Count */}
      <div className="flex-shrink-0 px-[25px] py-[12px] border-b border-[#E1E4EA]">
        <p className="text-[12px] text-gray-600">
          {talents.length} talent{talents.length !== 1 ? "s" : ""} found
        </p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-styled px-[25px] py-[16px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[7px] pb-8">
          {talents.length > 0 ? (
            talents.map((talent) => (
              <TalentCard key={talent.id} talent={talent} />
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center py-8">
              <p className="text-gray-500">No talents found</p>
            </div>
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
          Page {currentPage}
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
