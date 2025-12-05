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
    <div className="flex-shrink-0 border-b border-[#E1E4EA] px-[25px] bg-white">
      <div className="flex items-center gap-[24px]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "py-[16px] px-[8px] text-[14px] font-medium border-b-2 transition-colors",
              activeTab === tab.id
                ? "border-[#5C30FF] text-[#5C30FF]"
                : "border-transparent text-gray-600 hover:text-black",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
