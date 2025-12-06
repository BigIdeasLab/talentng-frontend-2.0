"use client";

import { useState } from "react";
import type { TalentProfile } from "@/lib/api/talent/types";
import { TalentProfilePanel } from "./components/TalentProfilePanel";
import { TalentProfileNav } from "./components/TalentProfileNav";
import { TalentWorksGrid } from "./components/TalentWorksGrid";
import { TalentServicesGrid } from "./components/TalentServicesGrid";
import { TalentRecommendationsGrid } from "./components/TalentRecommendationsGrid";

interface TalentProfileViewProps {
  profile: TalentProfile;
}

export function TalentProfileView({ profile }: TalentProfileViewProps) {
  const [activeTab, setActiveTab] = useState("works");

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar - Profile Panel */}
      <TalentProfilePanel profile={profile} />

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
            <TalentRecommendationsGrid recommendations={profile.recommendations || []} />
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
                {profile.workExperience && profile.workExperience.length > 0 && (
                  <div className="flex flex-col gap-[12px]">
                    <h2 className="text-[16px] font-semibold text-black">
                      Experience
                    </h2>
                    <div className="space-y-[16px]">
                       {profile.workExperience.map((exp, idx) => (
                         <div key={exp.id || `exp-${idx}`} className="flex flex-col gap-[6px]">
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
                         <div key={edu.id || `edu-${idx}`} className="flex flex-col gap-[6px]">
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
    </div>
  );
}
