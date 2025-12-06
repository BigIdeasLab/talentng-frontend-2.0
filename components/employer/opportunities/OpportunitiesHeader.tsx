"use client";

interface OpportunitiesHeaderProps {
  onPostClick: () => void;
}

export function OpportunitiesHeader({ onPostClick }: OpportunitiesHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <h1 className="text-lg font-medium font-inter-tight text-black">
        Opportunities
      </h1>
      <button
        onClick={onPostClick}
        className="flex items-center gap-1.5 px-3 py-2 bg-[#181B25] text-white rounded-[25px] border border-[#181B25] hover:bg-[#2a2d35] transition-colors flex-shrink-0"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 3.3335V16.6668M16.6667 10.0002H3.33337"
            stroke="white"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-xs font-normal font-inter-tight whitespace-nowrap">
          Post Opportunity
        </span>
      </button>
    </div>
  );
}
