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
    <div className="flex items-center gap-5 border-b border-transparent mb-6 overflow-x-auto scrollbar-hide">
      <button
        onClick={() => onTabChange("open")}
        className={`pb-2 text-xs font-medium font-inter-tight whitespace-nowrap transition-colors flex-shrink-0 ${
          activeTab === "open"
            ? "text-black border-b-2 border-black"
            : "text-black/30"
        }`}
      >
        Open Opportunities
      </button>
      <button
        onClick={() => onTabChange("closed")}
        className={`pb-2 text-xs font-medium font-inter-tight whitespace-nowrap transition-colors flex-shrink-0 ${
          activeTab === "closed"
            ? "text-black border-b-2 border-black"
            : "text-black/30"
        }`}
      >
        Closed Opportunities
      </button>
      <button
        onClick={() => onTabChange("draft")}
        className={`pb-2 text-xs font-medium font-inter-tight whitespace-nowrap transition-colors flex-shrink-0 ${
          activeTab === "draft"
            ? "text-black border-b-2 border-black"
            : "text-black/30"
        }`}
      >
        Draft
      </button>
    </div>
  );
}
