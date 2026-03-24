"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks";
import { useProfile } from "@/hooks/useProfile";
import type { TalentProfile, Service } from "@/lib/api/talent/types";
import { useRecruiterOpportunitiesQuery } from "@/hooks/useRecruiterOpportunities";
import { useSendInvitations } from "@/hooks/useRecruiterApplications";
import { TalentProfilePanel } from "./components/TalentProfilePanel";
import { TalentProfileNav } from "./components/TalentProfileNav";
import { TalentWorksGrid } from "./components/TalentWorksGrid";
import { TalentServicesGrid } from "./components/TalentServicesGrid";
import { TalentRecommendationsGrid } from "./components/TalentRecommendationsGrid";
import { HireOpportunitiesModal } from "./HireOpportunitiesModal";
import { ServiceDetailView } from "@/components/talent/profile/components/ServiceDetailView";
import { WorkDetailView } from "@/components/talent/profile/components/WorkDetailView";

interface TalentProfileViewProps {
  profile: TalentProfile;
}

export function TalentProfileView({ profile }: TalentProfileViewProps) {
  const [activeTab, setActiveTab] = useState("works");
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedWork, setSelectedWork] = useState<any>(null);
  const { toast } = useToast();
  const { data: opportunitiesRaw, isLoading: opportunitiesLoading } =
    useRecruiterOpportunitiesQuery({
      status: "active",
      talentId: profile.userId, // Pass the talent ID to check application status
    });

  const sendInvitationMutation = useSendInvitations();
  const opportunities = opportunitiesRaw?.data || [];

  const handleHire = async (opportunityId: string) => {
    try {
      const results = await sendInvitationMutation.mutateAsync({
        opportunityId,
        talentIds: [profile.userId],
      });

      // Check if invitation was successful
      const result = results[0];
      if (result.success) {
        toast?.({
          title: "Success",
          description: `Invitation sent to ${profile.fullName} for the opportunity`,
        });
        setIsHireModalOpen(false);
      } else {
        throw new Error(result.error || "Failed to send invitation");
      }
    } catch (error: any) {
      console.error("Failed to hire talent:", error);
      toast?.({
        title: "Error",
        description: error?.message || "Failed to send invitation to talent",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-white">
      {/* Left Sidebar - Profile Panel - Stacked on mobile, sidebar on desktop */}
      <TalentProfilePanel
        profile={profile}
        onHireClick={() => setIsHireModalOpen(true)}
        completionPercentage={profile.stats?.completionPercentage || 0}
        socialLinks={
          profile.socialLinks
            ? {
                telegram: profile.socialLinks.telegram || undefined,
                twitter: profile.socialLinks.twitter || undefined,
                instagram: profile.socialLinks.instagram || undefined,
                linkedin: profile.socialLinks.linkedin || undefined,
              }
            : undefined
        }
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-white overflow-hidden">
        {/* Top Navigation */}
        <TalentProfileNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto scrollbar-styled">
          {/* Portfolio/Works Tab */}
          {activeTab === "works" && (
            <TalentWorksGrid
              gallery={profile.gallery || []}
              onItemClick={setSelectedWork}
            />
          )}

          {/* Services Tab */}
          {activeTab === "services" && (
            <TalentServicesGrid
              services={profile.services || []}
              onServiceClick={setSelectedService}
            />
          )}

          {/* Recommendations Tab */}
          {activeTab === "recommendations" && (
            <TalentRecommendationsGrid
              recommendations={profile.recommendations || []}
            />
          )}

          {/* About Tab */}
          {activeTab === "about" && (
            <div className="flex flex-col gap-7 p-3 md:p-4 lg:p-5 w-full max-w-[700px]">
              {/* About Section */}
              {profile.bio && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-lg font-semibold text-black font-inter-tight">
                    About {profile.fullName || "User"}
                  </h2>
                  <div className="flex flex-col gap-3 text-[13px] font-normal text-black font-inter-tight leading-[22px]">
                    {profile.bio.split("\n").map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Professional Details */}
              <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-black font-inter-tight">
                  Professional Details
                </h2>
                <div className="flex flex-col gap-2">
                  {/* Headline */}
                  {profile.headline && (
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 px-3 py-2.5 rounded-[8px] border border-[#E1E4EA]">
                      <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
                        Headline
                      </div>
                      <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
                        {profile.headline}
                      </div>
                    </div>
                  )}

                  {/* Category */}
                  {profile.category && (
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 px-3 py-2.5 rounded-[8px] border border-[#E1E4EA]">
                      <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
                        Category
                      </div>
                      <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
                        {profile.category}
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  {profile.location && (
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 px-3 py-2.5 rounded-[8px] border border-[#E1E4EA]">
                      <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
                        Location
                      </div>
                      <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
                        {profile.location}
                      </div>
                    </div>
                  )}

                  {/* Availability */}
                  {profile.availability && profile.availability.length > 0 && (
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-3 px-3 py-2.5 rounded-[8px] border border-[#E1E4EA]">
                      <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
                        Availability
                      </div>
                      <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px] text-right">
                        {profile.availability.join(", ")}
                      </div>
                    </div>
                  )}

                  {/* Member Since */}
                  {profile.createdAt && (
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 px-3 py-2.5 rounded-[8px] border border-[#E1E4EA]">
                      <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
                        Member Since
                      </div>
                      <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
                        {new Date(profile.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            year: "numeric",
                          },
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Work Experience */}
              {profile.workExperience && profile.workExperience.length > 0 && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-lg font-semibold text-black font-inter-tight">
                    Work Experience
                  </h2>
                  <div className="flex flex-col gap-4">
                    {profile.workExperience.map((exp, idx) => (
                      <div
                        key={exp.id || `exp-${idx}`}
                        className="flex flex-col gap-2 px-3 py-3 rounded-[8px] border border-[#E1E4EA]"
                      >
                        <div className="text-[14px] font-semibold text-black font-inter-tight">
                          {exp.role}
                        </div>
                        <div className="text-[13px] font-normal text-black/70 font-inter-tight">
                          {exp.company}
                        </div>
                        <div className="text-[12px] font-normal text-black/50 font-inter-tight">
                          {exp.duration}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {profile.education && profile.education.length > 0 && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-lg font-semibold text-black font-inter-tight">
                    Education
                  </h2>
                  <div className="flex flex-col gap-4">
                    {profile.education.map((edu, idx) => (
                      <div
                        key={edu.id || `edu-${idx}`}
                        className="flex flex-col gap-2 px-3 py-3 rounded-[8px] border border-[#E1E4EA]"
                      >
                        <div className="text-[14px] font-semibold text-black font-inter-tight">
                          {edu.degree}
                        </div>
                        <div className="text-[13px] font-normal text-black/70 font-inter-tight">
                          {edu.institution}
                        </div>
                        <div className="text-[12px] font-normal text-black/50 font-inter-tight">
                          {edu.field}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Hire Opportunities Modal */}
      <HireOpportunitiesModal
        isOpen={isHireModalOpen}
        onClose={() => setIsHireModalOpen(false)}
        talentName={profile.fullName || "Talent"}
        opportunities={opportunities}
        onHire={handleHire}
        companyName={profile.company || undefined}
      />

      {/* Service Detail View */}
      {selectedService && (
        <ServiceDetailView
          service={selectedService}
          onClose={() => setSelectedService(null)}
          talentEmail={profile.user?.email}
          talentName={profile.fullName || undefined}
        />
      )}

      {/* Work Detail View */}
      {selectedWork && (
        <WorkDetailView
          work={{
            id: selectedWork.id,
            title: selectedWork.title,
            description: selectedWork.description || "",
            images:
              selectedWork.images ||
              [(selectedWork as any).url].filter(Boolean),
            createdAt: selectedWork.createdAt,
          }}
          onClose={() => setSelectedWork(null)}
        />
      )}
    </div>
  );
}
