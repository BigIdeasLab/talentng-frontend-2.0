"use client";

import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { TalentSidebar } from "@/components/layouts/sidebars/TalentSidebar";
import { EmployerSidebar } from "@/components/layouts/sidebars/EmployerSidebar";
import { AgencySidebar } from "@/components/layouts/sidebars/AgencySidebar";
import { MobileSidebar } from "@/components/talent/profile/components/MobileSidebar";

export function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const [activeNavItem, setActiveNavItem] = useState("dashboard");
  const { userRoles } = useProfile();
  const role = userRoles?.[0] || "talent";

  // Select sidebar based on role
  const renderSidebar = () => {
    switch (role) {
      case "employer":
        return (
          <EmployerSidebar
            activeItem={activeNavItem}
            onItemSelect={setActiveNavItem}
          />
        );
      case "agency":
        return (
          <AgencySidebar
            activeItem={activeNavItem}
            onItemSelect={setActiveNavItem}
          />
        );
      case "talent":
      default:
        return (
          <TalentSidebar
            activeItem={activeNavItem}
            onItemSelect={setActiveNavItem}
          />
        );
    }
  };

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
        {renderSidebar()}
      </div>

      {/* Children Content */}
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
