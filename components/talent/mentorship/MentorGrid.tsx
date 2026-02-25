import { ChevronLeft, ChevronRight } from "lucide-react";
import { MentorCard } from "./MentorCard";

interface Mentor {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
  rating?: number;
  totalReviews?: number;
  expertise?: string[];
  company?: string;
  location?: string;
}

interface MentorGridProps {
  mentors: Mentor[];
  onNextPage?: () => void;
  onPreviousPage?: () => void;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  currentPage?: number;
  totalPages?: number;
  totalMentors?: number;
}

export function MentorGrid({
  mentors,
  onNextPage,
  onPreviousPage,
  hasNextPage = false,
  hasPreviousPage = false,
  currentPage = 1,
  totalPages = 1,
  totalMentors,
}: MentorGridProps) {
  const displayCount = totalMentors ?? mentors.length;
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Result Count (Fixed Header) */}
      <div className="flex-shrink-0 px-[25px] py-[12px] border-b border-[#E1E4EA]">
        <p className="text-[12px] text-gray-600">
          {displayCount} mentor{displayCount !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Grid Content (Scrollable) */}
      <div className="flex-1 overflow-y-auto scrollbar-styled px-[25px] py-[16px]">
        {mentors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-[#FAFAFA] rounded-xl border border-dashed border-[#E1E4EA]">
            <p className="font-inter-tight text-[13px] text-gray-500">
              No mentors found. Try adjusting your filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4 pb-6">
            {mentors.map((mentor) => (
              <MentorCard key={mentor.id} {...mentor} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination Controls (Fixed Footer) */}
      <div className="flex-shrink-0 flex items-center justify-between px-[25px] py-[16px] border-t border-[#E1E4EA]">
        <button
          onClick={onPreviousPage}
          disabled={!hasPreviousPage}
          className="flex items-center gap-[6px] px-[12px] py-[8px] rounded-[8px] border border-[#E1E4EA] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F5F5F5] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-[13px] font-normal font-inter-tight">
            Previous
          </span>
        </button>

        <span className="text-[13px] font-normal font-inter-tight text-gray-600">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={onNextPage}
          disabled={!hasNextPage}
          className="flex items-center gap-[6px] px-[12px] py-[8px] rounded-[8px] border border-[#E1E4EA] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F5F5F5] transition-colors"
        >
          <span className="text-[13px] font-normal font-inter-tight">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
