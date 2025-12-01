"use client";

import { useState } from "react";
import { Sidebar } from "@/components/business/Layout/Sidebar";
import { MobileSidebar } from "@/components/business/Profile/MobileSidebar";

export function BusinessLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeNavItem, setActiveNavItem] = useState("dashboard");

  return (
    <div className="flex h-screen bg-white flex-col md:flex-row">
      {/* Mobile Sidebar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-[#E1E4EA]">
        <div className="font-medium text-[18px] text-black font-inter-tight">
          TalentNG
        </div>
        <MobileSidebar
          activeItem={activeNavItem}
          onItemSelect={setActiveNavItem}
        />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-screen overflow-hidden">
        <Sidebar activeItem={activeNavItem} onItemSelect={setActiveNavItem} />
      </div>

      {/* Children Content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
