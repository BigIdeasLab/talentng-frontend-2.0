"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks";
import { useSavedOpportunitiesQuery } from "@/hooks/useTalentOpportunities";
import { updateProfile } from "@/lib/api/talent";
import { ProfilePanel } from "@/components/talent/profile/components/ProfilePanel";
import { ProfileNav } from "@/components/talent/profile/components/ProfileNav";
import { WorksGrid } from "@/components/talent/profile/components/WorksGrid";
import { ServicesGrid } from "@/components/talent/profile/components/ServicesGrid";
import { RecommendationsGrid } from "@/components/talent/profile/components/RecommendationsGrid";
import { OpportunitiesGrid } from "@/components/talent/profile/components/OpportunitiesGrid";
import { CreateServiceModal } from "@/components/talent/profile/components/CreateServiceModal";
import { UploadWorksModal } from "@/components/talent/profile/components/UploadWorksModal";
import { ServiceDetailView } from "./components/ServiceDetailView";
import type {
  DashboardStats,
  Service,
  GalleryItem,
} from "@/lib/api/talent/types";
import type { UIProfileData } from "@/lib/profileMapper";
import type { Opportunity } from "@/lib/api/opportunities/types";

interface TalentProfileProps {
  initialProfileData?: UIProfileData;
  initialUserId?: string | null;
  initialStats?: DashboardStats | null;
  initialRecommendations?: any[];
  initialServices?: any[];
  initialError?: string | null;
  profileCompleteness?: number;
  views?: number;
  visibility?: "public" | "private";
  initialTab?: string;
}

const DEFAULT_PROFILE_DATA: UIProfileData = {
  personal: {
    firstName: "",
    lastName: "",
    bio: "",
    state: "",
    city: "",
    profileImageUrl: "",
  },
  professional: {
    role: "",
    headline: "",
    category: "",
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
    website: "",
  },
};

export function TalentProfile({
  initialProfileData = DEFAULT_PROFILE_DATA,
  initialUserId = null,
  initialStats = null,
  initialRecommendations = [],
  initialServices = [],
  initialError = null,
  profileCompleteness = 0,
  views = 0,
  visibility = "public",
  initialTab = "works",
}: TalentProfileProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [currentVisibility, setCurrentVisibility] = useState(visibility);
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
  const [cachedWorks, setCachedWorks] = useState<GalleryItem[]>([]);
  const [editingWork, setEditingWork] = useState<GalleryItem | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [cachedRecommendations, setCachedRecommendations] = useState<any[]>(
    initialRecommendations || [],
  );
  const [recommendationsLoading, setRecommendationsLoading] = useState(
    !initialRecommendations || initialRecommendations.length === 0,
  );
  const {
    data: savedOppsData,
    isLoading: opportunitiesLoading,
    refetch: refetchSavedOpportunities,
  } = useSavedOpportunitiesQuery(100, 0);

  const cachedOpportunities = savedOppsData?.data || [];

  useEffect(() => {
    setStats(initialStats);
  }, [initialStats]);

  useEffect(() => {
    if (initialProfileData && initialProfileData.personal) {
      setProfileData(initialProfileData);
    }
  }, [initialProfileData]);

  useEffect(() => {
    // Scroll to top when tab changes
    const mainContent = document.querySelector("main");
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "opportunities") {
      refetchSavedOpportunities();
    }
  }, [activeTab]);

  const handleAddNewWork = () => {
    setIsUploadWorksModalOpen(true);
  };

  const handleOpenUploadWorksModal = () => {
    setIsUploadWorksModalOpen(true);
  };

  const handleCloseUploadWorksModal = () => {
    setIsUploadWorksModalOpen(false);
    setEditingWork(null);
  };

  const handleWorksUploaded = () => {
    setWorksRefreshTrigger((prev) => prev + 1);
  };

  const handleWorksDeleted = () => {
    setWorksRefreshTrigger((prev) => prev + 1);
  };

  const handleEditWork = (item: GalleryItem) => {
    setEditingWork(item);
    setIsUploadWorksModalOpen(true);
  };

  const handleOpenCreateServiceModal = () => {
    setIsCreateServiceModalOpen(true);
  };

  const handleCloseCreateServiceModal = () => {
    setIsCreateServiceModalOpen(false);
    setEditingService(null);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setIsCreateServiceModalOpen(true);
  };

  const handleVisibilityChange = useCallback(
    async (newVisibility: "public" | "private") => {
      const previousVisibility = currentVisibility;
      setCurrentVisibility(newVisibility);
      try {
        await updateProfile({ visibility: newVisibility });
      } catch {
        setCurrentVisibility(previousVisibility);
      }
    },
    [currentVisibility],
  );

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
              profileData?.professional?.headline ||
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
            twitter: profileData?.social?.twitter || "",
            instagram: profileData?.social?.instagram || "",
            linkedin: profileData?.social?.linkedin || "",
            website: profileData?.social?.website || "",
          }}
          completionPercentage={profileCompleteness}
          views={views}
          visibility={currentVisibility}
          onVisibilityChange={handleVisibilityChange}
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
              onAddWork={handleOpenUploadWorksModal}
              onItemDeleted={handleWorksDeleted}
              onEditWork={handleEditWork}
              refreshTrigger={worksRefreshTrigger}
              cachedItems={cachedWorks}
              onItemsLoaded={setCachedWorks}
            />
          )}

          {/* Services Tab */}
          {activeTab === "services" && (
            <ServicesGrid
              onAddService={handleOpenCreateServiceModal}
              onServiceClick={setSelectedService}
              onEditService={handleEditService}
              onServiceDeleted={() =>
                setServiceRefreshTrigger((prev) => prev + 1)
              }
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
              onRecommendationClick={() => {}}
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
              onRemove={() => {}}
              onApply={() => {}}
              onApplicationSubmitted={(opportunityId) => {
                refetchSavedOpportunities();
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
        editItem={
          editingWork
            ? {
                id: editingWork.id,
                title: editingWork.title,
                description: editingWork.description || "",
                images:
                  editingWork.images ||
                  [(editingWork as any).url].filter(Boolean),
              }
            : null
        }
      />

      {/* Create Service Modal */}
      <CreateServiceModal
        isOpen={isCreateServiceModalOpen}
        onClose={handleCloseCreateServiceModal}
        onSuccess={handleServiceCreated}
        editService={editingService}
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
