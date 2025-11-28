"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { ProfilePanel } from "./ProfilePanel";
import { ProfileNav } from "./ProfileNav";
import { WorksGrid } from "./WorksGrid";
import { ServicesGrid } from "./ServicesGrid";
import { RecommendationsGrid } from "./RecommendationsGrid";
import { OpportunitiesGrid } from "./OpportunitiesGrid";
import { CreateServiceModal } from "./CreateServiceModal";
import type { DashboardStats } from "@/lib/api/talent/types";
import type { UIProfileData } from "@/lib/profileMapper";

interface ProfileLayoutProps {
  profileData: UIProfileData;
  initialStats: DashboardStats | null;
  isLoading?: boolean;
}

export function ProfileLayout({
  profileData,
  initialStats,
}: ProfileLayoutProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("works");
  const [stats, setStats] = useState<DashboardStats | null>(initialStats);
  const [isCreateServiceModalOpen, setIsCreateServiceModalOpen] = useState(false);
  const [serviceRefreshTrigger, setServiceRefreshTrigger] = useState(0);
  const [cachedServices, setCachedServices] = useState<any[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [cachedRecommendations, setCachedRecommendations] = useState<any[]>([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);

  useEffect(() => {
    setStats(initialStats);
  }, [initialStats]);

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

  const handleOpenCreateServiceModal = () => {
    setIsCreateServiceModalOpen(true);
  };

  const handleCloseCreateServiceModal = () => {
    setIsCreateServiceModalOpen(false);
  };

  const handleServiceCreated = () => {
    setServiceRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col h-full bg-white md:flex-row">
      {/* Profile Panel */}
      <div className="hidden lg:flex h-screen overflow-hidden">
        <ProfilePanel
          user={{
            fullName:
              `${profileData.personal.firstName} ${profileData.personal.lastName}`.trim() ||
              user?.fullName ||
              "User",
            headline:
              profileData.personal.headline || "Product & Interaction Designer",
            profileImageUrl: profileData.personal.profileImageUrl,
            location:
              (profileData.personal.city && profileData.personal.state
                ? `${profileData.personal.city}, ${profileData.personal.state}`
                : profileData.personal.city || profileData.personal.state) ||
              "—",
          }}
          stats={{
            earnings: stats ? `${stats.earnings} Earned` : "—",
            hired: stats?.hired ?? 0,
            jobType: profileData.professional.preferredRole || "—",
          }}
          skills={
            profileData.professional.skills || [
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
            profileData.professional.stack || [
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
            telegram: profileData.social.telegram || "#",
            twitter: profileData.social.twitter || "#",
            instagram: profileData.social.instagram || "#",
            linkedin: profileData.social.linkedin || "#",
          }}
          completionPercentage={stats?.profileCompletion ?? 0}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-white h-screen md:h-screen overflow-hidden">
        {/* Top Navigation */}
        <ProfileNav
          activeTab={activeTab as any}
          onTabChange={setActiveTab}
          onAddNewWork={handleAddNewWork}
          onAddService={handleOpenCreateServiceModal}
        />

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto scrollbar-styled">
          {/* My Works Tab */}
          {activeTab === "works" && (
            <WorksGrid
              items={profileData.gallery || []}
              onItemClick={(item) => console.log("Item clicked:", item)}
            />
          )}

          {/* Services Tab */}
          {activeTab === "services" && (
            <ServicesGrid
              onAddService={handleOpenCreateServiceModal}
              onServiceClick={(service) =>
                console.log("Service clicked:", service)
              }
              refreshTrigger={serviceRefreshTrigger}
              cachedServices={cachedServices}
              onServicesLoaded={setCachedServices}
              isLoading={servicesLoading}
              onLoadingChange={setServicesLoading}
            />
          )}
          
          {/* Keep services cached even when tab is not active */}
          {activeTab !== "services" && (
            <div className="hidden">
              <ServicesGrid
                onAddService={handleOpenCreateServiceModal}
                onServiceClick={(service) =>
                  console.log("Service clicked:", service)
                }
                refreshTrigger={serviceRefreshTrigger}
                cachedServices={cachedServices}
                onServicesLoaded={setCachedServices}
                isLoading={servicesLoading}
                onLoadingChange={setServicesLoading}
              />
            </div>
          )}

          {/* Recommendations Tab */}
          {activeTab === "recommendations" && (
            <RecommendationsGrid
              onRecommendationClick={(recommendation) =>
                console.log("Recommendation clicked:", recommendation)
              }
              cachedRecommendations={cachedRecommendations}
              onRecommendationsLoaded={setCachedRecommendations}
              isLoading={recommendationsLoading}
              onLoadingChange={setRecommendationsLoading}
            />
          )}
          
          {/* Keep recommendations cached even when tab is not active */}
          {activeTab !== "recommendations" && (
            <div className="hidden">
              <RecommendationsGrid
                onRecommendationClick={(recommendation) =>
                  console.log("Recommendation clicked:", recommendation)
                }
                cachedRecommendations={cachedRecommendations}
                onRecommendationsLoaded={setCachedRecommendations}
                isLoading={recommendationsLoading}
                onLoadingChange={setRecommendationsLoading}
              />
            </div>
          )}

          {/* Opportunities Tab */}
          {activeTab === "opportunities" && (
            <OpportunitiesGrid
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

      {/* Create Service Modal */}
      <CreateServiceModal
        isOpen={isCreateServiceModalOpen}
        onClose={handleCloseCreateServiceModal}
        onSuccess={handleServiceCreated}
      />
    </div>
  );
}
