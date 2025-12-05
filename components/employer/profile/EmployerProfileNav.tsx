"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface EmployerProfileNavProps {
  activeTab?: "opportunities" | "hires" | "about";
  onTabChange?: (tab: string) => void;
  onCreateOpportunity?: () => void;
}

const tabs = [
  { id: "opportunities", label: "Open Opportunities" },
  { id: "hires", label: "Past Hires" },
  { id: "about", label: "About" },
];

const buttonTexts: Record<string, string> = {
  opportunities: "Create Opportunity",
  hires: "Create Opportunity",
  about: "Create Opportunity",
};

export function EmployerProfileNav({
  activeTab = "opportunities",
  onTabChange,
  onCreateOpportunity,
}: EmployerProfileNavProps) {
  const [active, setActive] = useState(activeTab);

  const handleTabChange = (tabId: string) => {
    setActive(tabId as any);
    onTabChange?.(tabId);
  };

  const handleActionClick = () => {
    onCreateOpportunity?.();
  };

  const buttonText = buttonTexts[active] || "Create Opportunity";

  return (
    <div className="flex items-center justify-between w-full bg-white border-b border-[#E1E4EA] sticky top-0 z-30">
      {/* Navigation Links */}
      <div className="flex items-center gap-0 overflow-x-auto flex-1 scrollbar-hidden">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              "px-[12px] sm:px-[20px] py-[14px] sm:py-[18px] text-[12px] sm:text-[13px] font-medium font-inter-tight whitespace-nowrap transition-colors relative",
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
        onClick={handleActionClick}
        className="hidden sm:flex h-[40px] rounded-full bg-[#5C30FF] text-white hover:bg-[#4a24d6] font-inter-tight text-[13px] font-normal gap-[8px] mr-[20px] flex-shrink-0"
      >
        <Plus className="w-4 h-4" />
        {buttonText}
      </Button>

      {/* Mobile CTA Icon Button */}
      <button
        onClick={handleActionClick}
        className="sm:hidden p-2 text-[#5C30FF] hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
}
