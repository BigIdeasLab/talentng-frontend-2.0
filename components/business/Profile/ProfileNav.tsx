"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ProfileNavProps {
  activeTab?: "works" | "services" | "recommendations" | "opportunities";
  onTabChange?: (tab: string) => void;
  onAddNewWork?: () => void;
}

const tabs = [
  { id: "works", label: "My Works" },
  { id: "services", label: "Services" },
  { id: "recommendations", label: "Recommendation" },
  { id: "opportunities", label: "Saved Opportunities" },
];

export function ProfileNav({
  activeTab = "works",
  onTabChange,
  onAddNewWork,
}: ProfileNavProps) {
  const [active, setActive] = useState(activeTab);

  const handleTabChange = (tabId: string) => {
    setActive(tabId as any);
    onTabChange?.(tabId);
  };

  return (
    <div className="flex items-center justify-between w-full bg-white border-b border-[#E1E4EA] sticky top-0 z-30">
      {/* Navigation Links */}
      <div className="flex items-center gap-0 overflow-x-auto flex-1 scrollbar-hidden">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              "px-[12px] sm:px-[20px] py-[16px] sm:py-[22px] text-[13px] sm:text-[15px] font-medium font-inter-tight whitespace-nowrap transition-colors relative",
              active === tab.id
                ? "text-black"
                : "text-[rgba(0,0,0,0.30)] hover:text-[rgba(0,0,0,0.6)]",
            )}
          >
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
            {active === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black" />
            )}
          </button>
        ))}
      </div>

      {/* CTA Button */}
      <Button
        onClick={onAddNewWork}
        className="hidden sm:flex h-[46px] rounded-full bg-[#5C30FF] text-white hover:bg-[#4a24d6] font-inter-tight text-[15px] font-normal gap-[8px] mr-[20px] flex-shrink-0"
      >
        <Plus className="w-5 h-5" />
        Add New Work
      </Button>

      {/* Mobile CTA Icon Button */}
      <button
        onClick={onAddNewWork}
        className="sm:hidden p-2 text-[#5C30FF] hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
