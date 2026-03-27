"use client";

import type { TabType } from "@/lib/types";

interface OpportunitiesTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function OpportunitiesTabs({
  activeTab,
  onTabChange,
}: OpportunitiesTabsProps) {
  return (
    <div className="flex items-center gap-[8px] border-b border-transparent overflow-x-auto scrollbar-hide">
      <button
        onClick={() => onTabChange("open")}
        className={`px-[12px] py-[6px] text-[13px] font-medium font-inter-tight whitespace-nowrap transition-colors flex-shrink-0 rounded ${
          activeTab === "open"
            ? "text-black border-b-2 border-black"
            : "text-black/30 hover:text-black/50"
        }`}
      >
        Open Opportunities
      </button>
      <button
        onClick={() => onTabChange("closed")}
        className={`px-[12px] py-[6px] text-[13px] font-medium font-inter-tight whitespace-nowrap transition-colors flex-shrink-0 rounded ${
          activeTab === "closed"
            ? "text-black border-b-2 border-black"
            : "text-black/30 hover:text-black/50"
        }`}
      >
        Closed Opportunities
      </button>
      <button
        onClick={() => onTabChange("draft")}
        className={`px-[12px] py-[6px] text-[13px] font-medium font-inter-tight whitespace-nowrap transition-colors flex-shrink-0 rounded ${
          activeTab === "draft"
            ? "text-black border-b-2 border-black"
            : "text-black/30 hover:text-black/50"
        }`}
      >
        Draft
      </button>
    </div>
  );
}
