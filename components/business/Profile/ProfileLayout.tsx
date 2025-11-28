"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { ProfilePanel } from "./ProfilePanel";
import { ProfileNav } from "./ProfileNav";
import { WorksGrid } from "./WorksGrid";
import { ServicesGrid } from "./ServicesGrid";
import { RecommendationsGrid } from "./RecommendationsGrid";
import { OpportunitiesGrid } from "./OpportunitiesGrid";
import { LoadingSpinner } from "./LoadingSpinner";
import {
  WorksGridSkeleton,
  ProfilePanelSkeleton,
  GridContentSkeleton,
} from "./SkeletonLoader";
import { getDashboardStats } from "@/lib/api/talent";
import type { DashboardStats } from "@/lib/api/talent/types";
import type { UIProfileData } from "@/lib/profileMapper";

interface ProfileLayoutProps {
  profileData?: UIProfileData;
  isLoading?: boolean;
}

export function ProfileLayout({
  profileData,
  isLoading: initialLoading,
}: ProfileLayoutProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("works");
  const [profileLoading, setProfileLoading] = useState(!profileData);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Load dashboard stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        setStatsLoading(true);
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
        // Keep null if failed to load
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, []);

  useEffect(() => {
    // Update profile loading state when profileData changes
    if (profileData) {
      setProfileLoading(false);
    }
  }, [profileData]);

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
        {profileLoading ? (
          <ProfilePanelSkeleton />
        ) : (
          <ProfilePanel
            user={{
              fullName: profileData
                ? `${profileData.personal.firstName} ${profileData.personal.lastName}`.trim() ||
                  user?.fullName ||
                  "User"
                : user?.fullName || "User",
              headline:
                profileData?.personal.headline ||
                "Product & Interaction Designer",
              profileImageUrl: profileData?.personal.profileImageUrl,
            }}
            stats={{
              earnings: stats ? `${stats.earnings} Earned` : "—",
              hired: stats?.hired ?? 0,
              jobType:
                profileData?.professional.preferredRole || "Ui/Ux Designer",
            }}
            skills={
              profileData?.professional.skills || [
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
            stack={
              profileData?.professional.stack || [
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
              ]
            }
            socialLinks={{
              telegram: profileData?.social.telegram || "#",
              twitter: profileData?.social.twitter || "#",
              instagram: profileData?.social.instagram || "#",
              linkedin: profileData?.social.linkedin || "#",
            }}
            completionPercentage={stats?.profileCompletion ?? 0}
          />
        )}
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
             profileLoading ? (
               <WorksGridSkeleton />
             ) : (
               <WorksGrid
                 items={profileData?.gallery || []}
                 onItemClick={(item) => console.log("Item clicked:", item)}
               />
             )
           )}

           {/* Services Tab */}
            {activeTab === "services" && (
              profileLoading ? (
                <GridContentSkeleton />
              ) : (
                <ServicesGrid
                  onServiceClick={(service) =>
                    console.log("Service clicked:", service)
                  }
                />
              )
            )}

            {/* Recommendations Tab */}
            {activeTab === "recommendations" && (
              profileLoading ? (
                <GridContentSkeleton />
              ) : (
                <RecommendationsGrid
                  onRecommendationClick={(recommendation) =>
                    console.log("Recommendation clicked:", recommendation)
                  }
                />
              )
            )}

            {/* Opportunities Tab */}
            {activeTab === "opportunities" && (
              profileLoading ? (
                <GridContentSkeleton />
              ) : (
                <OpportunitiesGrid
                  onRemove={(opportunity) =>
                    console.log("Remove opportunity:", opportunity)
                  }
                  onApply={(opportunity) =>
                    console.log("Apply to opportunity:", opportunity)
                  }
                />
              )
            )}
         </div>
      </main>
    </div>
  );
}
