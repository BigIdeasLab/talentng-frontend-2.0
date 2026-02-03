"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks";
import { useOpportunitiesManager } from "@/hooks/useOpportunitiesManager";
import { ProfilePanel } from "@/components/talent/profile/components/ProfilePanel";
import { ProfileNav } from "@/components/talent/profile/components/ProfileNav";
import { WorksGrid } from "@/components/talent/profile/components/WorksGrid";
import { ServicesGrid } from "@/components/talent/profile/components/ServicesGrid";
import { RecommendationsGrid } from "@/components/talent/profile/components/RecommendationsGrid";
import { OpportunitiesGrid } from "@/components/talent/profile/components/OpportunitiesGrid";
import { CreateServiceModal } from "@/components/talent/profile/components/CreateServiceModal";
import { UploadWorksModal } from "@/components/talent/profile/components/UploadWorksModal";
import { ServiceDetailView } from "./components/ServiceDetailView";
import type { DashboardStats, Service } from "@/lib/api/talent/types";
import type { UIProfileData } from "@/lib/profileMapper";
import type { Opportunity } from "@/lib/api/opportunities/types";

interface TalentProfileProps {
  initialProfileData?: UIProfileData;
  initialUserId?: string | null;
  initialStats?: DashboardStats | null;
  initialRecommendations?: any[];
  initialServices?: any[];
  initialError?: string | null;
}

const DEFAULT_PROFILE_DATA: UIProfileData = {
  personal: {
    firstName: "",
    lastName: "",
    headline: "",
    bio: "",
    phoneNumber: "",
    state: "",
    city: "",
    profileImageUrl: "",
  },
  professional: {
    role: "",
    company: "",
    category: "",
    description: "",
    skills: [],
    stack: [],
    availability: "",
  },
  gallery: [],
  experience: [],
  education: [],
  portfolio: {
    resumeUrl: "",
    portfolioItems: [],
  },
  social: {
    dribbble: "",
    telegram: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    github: "",
    portfolio: "",
  },
};

export function TalentProfile({
  initialProfileData = DEFAULT_PROFILE_DATA,
  initialUserId = null,
  initialStats = null,
  initialRecommendations = [],
  initialServices = [],
  initialError = null,
}: TalentProfileProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("works");
  const [profileData, setProfileData] = useState<UIProfileData>(
    initialProfileData || DEFAULT_PROFILE_DATA,
  );
  const [stats, setStats] = useState<DashboardStats | null>(initialStats);
  const [isCreateServiceModalOpen, setIsCreateServiceModalOpen] =
    useState(false);
  const [isUploadWorksModalOpen, setIsUploadWorksModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [serviceRefreshTrigger, setServiceRefreshTrigger] = useState(0);
  const [worksRefreshTrigger, setWorksRefreshTrigger] = useState(0);
  const [cachedServices, setCachedServices] = useState<any[]>(
    initialServices || [],
  );
  const [servicesLoading, setServicesLoading] = useState(
    !initialServices || initialServices.length === 0,
  );
  const [cachedWorks, setCachedWorks] = useState<any[]>([]);
  const [worksLoading, setWorksLoading] = useState(true);
  const [cachedRecommendations, setCachedRecommendations] = useState<any[]>(
    initialRecommendations || [],
  );
  const [recommendationsLoading, setRecommendationsLoading] = useState(
    !initialRecommendations || initialRecommendations.length === 0,
  );
  const [cachedOpportunities, setCachedOpportunities] = useState<Opportunity[]>(
    [],
  );
  const [opportunitiesLoading, setOpportunitiesLoading] = useState(true);
  const { getSaved } = useOpportunitiesManager();

  useEffect(() => {
    setStats(initialStats);
  }, [initialStats]);

  useEffect(() => {
    if (initialProfileData && initialProfileData.personal) {
      setProfileData(initialProfileData);
    }
  }, [initialProfileData]);

  useEffect(() => {
    // Initialize cached works from profileData.gallery
    if (profileData?.gallery && profileData.gallery.length > 0) {
      setCachedWorks(profileData.gallery);
    }
    setWorksLoading(false);
  }, [profileData?.gallery]);

  useEffect(() => {
    // Scroll to top when tab changes
    const mainContent = document.querySelector("main");
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
  }, [activeTab]);

  useEffect(() => {
    // Fetch saved opportunities
    const fetchSavedOpportunities = async () => {
      setOpportunitiesLoading(true);
      try {
        const response = await getSaved(100, 0);
        setCachedOpportunities(response.data || []);
      } catch (error) {
        console.error("Failed to fetch saved opportunities:", error);
        setCachedOpportunities([]);
      } finally {
        setOpportunitiesLoading(false);
      }
    };

    if (activeTab === "opportunities") {
      fetchSavedOpportunities();
    }
  }, [activeTab, getSaved]);

  const handleAddNewWork = () => {
    setIsUploadWorksModalOpen(true);
  };

  const handleOpenUploadWorksModal = () => {
    setIsUploadWorksModalOpen(true);
  };

  const handleCloseUploadWorksModal = () => {
    setIsUploadWorksModalOpen(false);
  };

  const handleWorksUploaded = (message?: string, gallery?: any[]) => {
    if (gallery && gallery.length > 0) {
      setCachedWorks(gallery);
    }
  };

  const handleWorksDeleted = () => {
    setWorksRefreshTrigger((prev) => prev + 1);
  };

  const handleOpenCreateServiceModal = () => {
    setIsCreateServiceModalOpen(true);
  };

  const handleCloseCreateServiceModal = () => {
    setIsCreateServiceModalOpen(false);
  };

  const handleServiceCreated = (message?: string, services?: any[]) => {
    // Only cache services with valid IDs
    const validServices = services?.filter((s) => s.id && s.id !== "0") || [];
    if (validServices.length > 0) {
      setCachedServices(validServices);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white md:flex-row">
      {/* Profile Panel */}
      <div className="hidden lg:flex h-screen overflow-hidden">
        <ProfilePanel
          user={{
            fullName:
              (profileData?.personal?.firstName || "") &&
              (profileData?.personal?.lastName || "")
                ? `${profileData.personal.firstName} ${profileData.personal.lastName}`.trim()
                : user?.fullName || "User",
            headline:
              profileData?.personal?.headline ||
              "Product & Interaction Designer",
            profileImageUrl: profileData?.personal?.profileImageUrl,
            location:
              (profileData?.personal?.city && profileData?.personal?.state
                ? `${profileData.personal.city}, ${profileData.personal.state}`
                : profileData?.personal?.city ||
                  profileData?.personal?.state) || "—",
          }}
          stats={{
            earnings: stats ? `${stats.earnings} Earned` : "—",
            hired: stats?.hired ?? 0,
            jobType: profileData?.professional?.category || "—",
          }}
          skills={
            profileData?.professional?.skills || [
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
            profileData?.professional?.stack || [
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
            telegram: profileData?.social?.telegram || "#",
            twitter: profileData?.social?.twitter || "#",
            instagram: profileData?.social?.instagram || "#",
            linkedin: profileData?.social?.linkedin || "#",
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
              items={
                cachedWorks.length > 0 ? cachedWorks : profileData.gallery || []
              }
              onAddWork={handleOpenUploadWorksModal}
              onItemClick={(item) => console.log("Item clicked:", item)}
              onItemDeleted={handleWorksDeleted}
              isLoading={worksLoading && cachedWorks.length === 0}
            />
          )}

          {/* Services Tab */}
          {activeTab === "services" && (
            <ServicesGrid
              onAddService={handleOpenCreateServiceModal}
              onServiceClick={setSelectedService}
              refreshTrigger={serviceRefreshTrigger}
              cachedServices={cachedServices}
              onServicesLoaded={setCachedServices}
              isLoading={servicesLoading}
              onLoadingChange={setServicesLoading}
            />
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

          {/* Opportunities Tab */}
          {activeTab === "opportunities" && (
            <OpportunitiesGrid
              opportunities={cachedOpportunities.map((opp) => ({
                id: opp.id,
                companyName:
                  opp.postedBy?.recruiterProfile?.company || opp.company,
                companyLogo:
                  opp.postedBy?.recruiterProfile?.profileImageUrl || opp.logo,
                date: new Date(opp.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                }),
                type: (opp.type === "Job"
                  ? "job_listing"
                  : opp.type === "Internship"
                    ? "internship"
                    : "job_listing") as "internship" | "job_listing",
                title: opp.title,
                skills: opp.tools || opp.tags || [],
                rate: (() => {
                  const getPaymentTypeAbbr = (paymentType?: string): string => {
                    switch (paymentType?.toLowerCase()) {
                      case "hourly":
                        return "hr";
                      case "weekly":
                        return "wk";
                      case "yearly":
                      case "annual":
                        return "yr";
                      default:
                        return "mo";
                    }
                  };
                  return `₦${Math.round(Number(opp.minBudget) || 0).toLocaleString()} - ₦${Math.round(Number(opp.maxBudget) || 0).toLocaleString()} / ${getPaymentTypeAbbr(opp.paymentType)}`;
                })(),
                isSaved: true,
                appliedAs: opp.appliedAs || [],
              }))}
              isLoading={opportunitiesLoading}
              onRemove={(opportunity) =>
                console.log("Remove opportunity:", opportunity)
              }
              onApply={(opportunity) =>
                console.log("Apply to opportunity:", opportunity)
              }
              onApplicationSubmitted={(opportunityId) => {
                // Refetch opportunities to get updated applied status
                const fetchSavedOpportunities = async () => {
                  try {
                    const response = await getSaved(100, 0);
                    setCachedOpportunities(response.data || []);
                  } catch (error) {
                    console.error(
                      "Failed to fetch saved opportunities:",
                      error,
                    );
                  }
                };
                fetchSavedOpportunities();
              }}
            />
          )}
        </div>
      </main>

      {/* Upload Works Modal */}
      <UploadWorksModal
        isOpen={isUploadWorksModalOpen}
        onClose={handleCloseUploadWorksModal}
        onSuccess={handleWorksUploaded}
      />

      {/* Create Service Modal */}
      <CreateServiceModal
        isOpen={isCreateServiceModalOpen}
        onClose={handleCloseCreateServiceModal}
        onSuccess={handleServiceCreated}
      />

      {/* Service Detail View */}
      {selectedService && (
        <ServiceDetailView
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </div>
  );
}
