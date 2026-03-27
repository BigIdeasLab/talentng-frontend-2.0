"use client";

import { cn } from "@/lib/utils";

interface TalentProfileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "works", label: "Works" },
  { id: "services", label: "Services" },
  { id: "recommendations", label: "Recommendations" },
  { id: "about", label: "About" },
];

export function TalentProfileNav({
  activeTab,
  onTabChange,
}: TalentProfileNavProps) {
  return (
    <div className="flex items-center justify-between w-full bg-white border-b border-[#E1E4EA] sticky top-0 z-30">
      <div className="flex items-center gap-0 overflow-x-auto flex-1 scrollbar-hidden">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "px-[12px] sm:px-[20px] py-[14px] sm:py-[18px] text-[12px] sm:text-[13px] font-medium font-inter-tight whitespace-nowrap transition-colors relative",
              activeTab === tab.id
                ? "text-black"
                : "text-[rgba(0,0,0,0.30)] hover:text-[rgba(0,0,0,0.6)]",
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
