"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { ProfilePanel } from "./ProfilePanel";
import { ProfileNav } from "./ProfileNav";
import { WorksGrid } from "./WorksGrid";
import { ServicesGrid } from "./ServicesGrid";
import { RecommendationsGrid } from "./RecommendationsGrid";
import { OpportunitiesGrid } from "./OpportunitiesGrid";
import type { TalentProfile } from "@/lib/types/profile";

interface ProfileLayoutProps {
  profileData?: TalentProfile;
}

export function ProfileLayout({ profileData }: ProfileLayoutProps) {
  const { user } = useAuth();
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
    <div className="flex flex-col h-full bg-white md:flex-row">

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
            <ServicesGrid
              isLoading={isLoading}
              onServiceClick={(service) =>
                console.log("Service clicked:", service)
              }
            />
          )}

          {/* Recommendations Tab */}
          {activeTab === "recommendations" && (
            <RecommendationsGrid
              isLoading={isLoading}
              onRecommendationClick={(recommendation) =>
                console.log("Recommendation clicked:", recommendation)
              }
            />
          )}

          {/* Opportunities Tab */}
          {activeTab === "opportunities" && (
            <OpportunitiesGrid
              isLoading={isLoading}
              onRemove={(opportunity) =>
                console.log("Remove opportunity:", opportunity)
              }
              onApply={(opportunity) =>
                console.log("Apply to opportunity:", opportunity)
              }
            />
          )}
        </div>
      </main>
    </div>
  );
}
