"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "../Layout/Sidebar";
import { MobileSidebar } from "./MobileSidebar";
import { ProfilePanel } from "./ProfilePanel";
import { ProfileNav } from "./ProfileNav";
import { WorksGrid } from "./WorksGrid";
import { ServicesGrid } from "./ServicesGrid";
import type { TalentProfile } from "@/lib/types/profile";

interface ProfileLayoutProps {
  profileData?: TalentProfile;
}

export function ProfileLayout({ profileData }: ProfileLayoutProps) {
  const { user } = useAuth();
  const [activeNavItem, setActiveNavItem] = useState("dashboard");
  const [activeTab, setActiveTab] = useState("works");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Scroll to top when tab changes
    const mainContent = document.querySelector("main");
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
  }, [activeTab]);

  const handleAddNewWork = () => {
    // TODO: Open modal or navigate to work upload page
    console.log("Add new work clicked");
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
        <Sidebar activeItem={activeNavItem} onItemSelect={setActiveNavItem} />
      </div>

      {/* Profile Panel */}
      <div className="hidden lg:flex h-screen overflow-hidden">
        <ProfilePanel
          user={{
            fullName: user?.fullName || "User",
            headline: "Product & Interaction Designer",
          }}
          stats={{
            earnings: "$20,000 Earned",
            hired: 5,
            jobType: "Ui/Ux Designer",
          }}
          skills={
            profileData?.skills || [
              "Website Design",
              "Mobile App Design",
              "Ui/Ux Design",
              "Interface Design",
              "Prototyping",
              "User Research",
              "Wireframing",
              "Interaction Design",
              "Design Systems",
              "Motion Design",
            ]
          }
          stack={[
            { name: "Figma" },
            { name: "Rive" },
            { name: "Webflow" },
            { name: "Lottie" },
            { name: "Framer" },
            { name: "Adobe XD" },
            { name: "Sketch" },
            { name: "Protopie" },
            { name: "Principle" },
            { name: "Zeplin" },
            { name: "Slack" },
          ]}
          socialLinks={{
            telegram: "#",
            twitter: "#",
            instagram: "#",
            linkedin: "#",
          }}
          completionPercentage={25}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-white h-screen md:h-screen overflow-hidden">
        {/* Top Navigation */}
        <ProfileNav
          activeTab={activeTab as any}
          onTabChange={setActiveTab}
          onAddNewWork={handleAddNewWork}
        />

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto scrollbar-styled">
          {/* My Works Tab */}
          {activeTab === "works" && (
            <WorksGrid
              items={profileData?.portfolioItems || profileData?.gallery || []}
              isLoading={isLoading}
              onItemClick={(item) => console.log("Item clicked:", item)}
            />
          )}

          {/* Services Tab */}
          {activeTab === "services" && (
            <div className="p-[20px] text-center text-gray-400">
              <p className="text-lg">Services section coming soon</p>
            </div>
          )}

          {/* Recommendations Tab */}
          {activeTab === "recommendations" && (
            <div className="p-[20px] text-center text-gray-400">
              <p className="text-lg">Recommendations section coming soon</p>
            </div>
          )}

          {/* Opportunities Tab */}
          {activeTab === "opportunities" && (
            <div className="p-[20px] text-center text-gray-400">
              <p className="text-lg">Saved opportunities section coming soon</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
