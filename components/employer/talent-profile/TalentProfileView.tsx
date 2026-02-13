"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks";
import { useProfile } from "@/hooks/useProfile";
import type { TalentProfile } from "@/lib/api/talent/types";
import type { Opportunity } from "@/lib/api/opportunities";
import { getOpportunities } from "@/lib/api/opportunities";
import { sendInvitations } from "@/lib/api/applications";
import { TalentProfilePanel } from "./components/TalentProfilePanel";
import { TalentProfileNav } from "./components/TalentProfileNav";
import { TalentWorksGrid } from "./components/TalentWorksGrid";
import { TalentServicesGrid } from "./components/TalentServicesGrid";
import { TalentRecommendationsGrid } from "./components/TalentRecommendationsGrid";
import { HireOpportunitiesModal } from "./HireOpportunitiesModal";

interface TalentProfileViewProps {
  profile: TalentProfile;
}

export function TalentProfileView({ profile }: TalentProfileViewProps) {
  const [activeTab, setActiveTab] = useState("works");
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const { toast } = useToast();
  const { currentProfile } = useProfile();

  useEffect(() => {
    if (isHireModalOpen) {
      fetchOpportunities();
    }
  }, [isHireModalOpen]);

  const fetchOpportunities = async () => {
    try {
      const userId = currentProfile?.userId;
      if (!userId) {
        return;
      }

      // Fetch only opportunities posted by the current recruiter
      const response = await getOpportunities({
        status: "active",
        postedById: userId,
      });
      setOpportunities(response.data || []);
    } catch (error) {
      console.error("Failed to fetch opportunities:", error);
      toast?.({
        title: "Error",
        description: "Failed to load opportunities",
        variant: "destructive",
      });
    }
  };

  const handleHire = async (opportunityId: string) => {
    try {
      // Send invitation to the talent for this opportunity
      // This creates an application with sourceType="invited"
      const results = await sendInvitations({
        opportunityId,
        talentIds: [profile.userId], // Use userId, not profile id
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
    } catch (error) {
      console.error("Failed to hire talent:", error);
      toast?.({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to send invitation to talent",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar - Profile Panel */}
      <TalentProfilePanel
        profile={profile}
        onHireClick={() => setIsHireModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-white overflow-hidden">
        {/* Top Navigation */}
        <TalentProfileNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto scrollbar-styled">
          {/* Portfolio/Works Tab */}
          {activeTab === "works" && (
            <TalentWorksGrid gallery={profile.gallery || []} />
          )}

          {/* Services Tab */}
          {activeTab === "services" && (
            <TalentServicesGrid services={profile.services || []} />
          )}

          {/* Recommendations Tab */}
          {activeTab === "recommendations" && (
            <TalentRecommendationsGrid
              recommendations={profile.recommendations || []}
            />
          )}

          {/* About Tab */}
          {activeTab === "about" && (
            <div className="p-[25px] max-w-[800px]">
              <div className="flex flex-col gap-[24px]">
                {/* Bio Section */}
                {profile.bio && (
                  <div className="flex flex-col gap-[12px]">
                    <h2 className="text-[16px] font-semibold text-black">
                      About
                    </h2>
                    <p className="text-[14px] text-gray-700 leading-relaxed">
                      {profile.bio}
                    </p>
                  </div>
                )}

                {/* Work Experience */}
                {profile.workExperience &&
                  profile.workExperience.length > 0 && (
                    <div className="flex flex-col gap-[12px]">
                      <h2 className="text-[16px] font-semibold text-black">
                        Experience
                      </h2>
                      <div className="space-y-[16px]">
                        {profile.workExperience.map((exp, idx) => (
                          <div
                            key={exp.id || `exp-${idx}`}
                            className="flex flex-col gap-[6px]"
                          >
                            <p className="text-[14px] font-medium text-black">
                              {exp.role}
                            </p>
                            <p className="text-[13px] text-gray-600">
                              {exp.company}
                            </p>
                            <p className="text-[12px] text-gray-500">
                              {exp.duration}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Education */}
                {profile.education && profile.education.length > 0 && (
                  <div className="flex flex-col gap-[12px]">
                    <h2 className="text-[16px] font-semibold text-black">
                      Education
                    </h2>
                    <div className="space-y-[16px]">
                      {profile.education.map((edu, idx) => (
                        <div
                          key={edu.id || `edu-${idx}`}
                          className="flex flex-col gap-[6px]"
                        >
                          <p className="text-[14px] font-medium text-black">
                            {edu.degree}
                          </p>
                          <p className="text-[13px] text-gray-600">
                            {edu.institution}
                          </p>
                          <p className="text-[12px] text-gray-500">
                            {edu.field}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
    </div>
  );
}
