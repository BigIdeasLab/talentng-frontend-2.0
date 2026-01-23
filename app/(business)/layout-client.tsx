"use client";

import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useProfileData } from "@/hooks/useProfileData";
import { COLORS } from "@/lib/constants";
import { TalentSidebar } from "@/components/layouts/sidebars/TalentSidebar";
import { RecruiterSidebar } from "@/components/layouts/sidebars/RecruiterSidebar";
import { MentorSidebar } from "@/components/layouts/sidebars/MentorSidebar";
import { MobileSidebar } from "@/components/talent/profile/components/MobileSidebar";
import { LoadingScreen } from "@/components/layouts/LoadingScreen";

export function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const [activeNavItem, setActiveNavItem] = useState("dashboard");
  const { activeRole, isLoading } = useProfile();

  // Fetch profile data client-side
  useProfileData();

  // Show loading screen while profile data is being fetched
  if (isLoading) {
    return <LoadingScreen />;
  }

  // If no active role after loading, user hasn't completed onboarding
  if (!activeRole) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-black mb-4">Welcome!</h2>
          <p className="text-gray-600 mb-6">
            Please complete your profile to get started.
          </p>
          <button
            onClick={() => (window.location.href = "/onboarding")}
            style={{
              backgroundColor: COLORS.primary,
            }}
            className="px-6 py-2 text-white rounded-lg transition-colors hover:opacity-90"
          >
            Go to Onboarding
          </button>
        </div>
      </div>
    );
  }

  // Select sidebar based on active role
  const renderSidebar = () => {
    // Don't render sidebar until we know the actual activeRole
    if (!activeRole) {
      return null;
    }

    switch (activeRole) {
      case "recruiter":
        return (
          <RecruiterSidebar
            activeItem={activeNavItem}
            onItemSelect={setActiveNavItem}
          />
        );
      case "mentor":
        return (
          <MentorSidebar
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
