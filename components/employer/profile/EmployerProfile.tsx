"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks";
import { EmployerProfilePanel } from "./EmployerProfilePanel";
import { EmployerProfileNav } from "./EmployerProfileNav";
import { OpportunitiesTab } from "./tabs/OpportunitiesTab";
import { PastHiresTab } from "./tabs/PastHiresTab";
import { AboutTab } from "./tabs/AboutTab";
import { updateRecruiterProfile } from "@/lib/api/recruiter";

interface EmployerProfileProps {
  companyData?: {
    name: string;
    logo?: string;
    location?: string;
    tagline?: string;
  };
  stats?: {
    jobsPosted?: number;
    talentsHired?: number;
    responseTime?: string;
  };
  socialLinks?: {
    telegram?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  completionPercentage?: number;
  aboutData?: {
    bio?: string | null;
    industry?: string;
    companySize?: string;
    companyStage?: string;
    operatingModel?: string;
  };
  views?: number;
  visibility?: "public" | "private";
}

export function EmployerProfile({
  companyData = {
    name: "Company Name",
    location: "—",
    tagline: "Employer",
  },
  stats = {
    jobsPosted: 0,
    talentsHired: 0,
    responseTime: "—",
  },
  socialLinks,
  completionPercentage = 0,
  aboutData,
  views = 0,
  visibility = "public",
}: EmployerProfileProps) {
  const { user: _user } = useAuth();
  const [activeTab, setActiveTab] = useState("opportunities");
  const [currentVisibility, setCurrentVisibility] = useState(visibility);

  const handleVisibilityChange = useCallback(
    async (newVisibility: "public" | "private") => {
      const previousVisibility = currentVisibility;
      setCurrentVisibility(newVisibility);
      try {
        await updateRecruiterProfile({ visibility: newVisibility });
      } catch {
        setCurrentVisibility(previousVisibility);
      }
    },
    [currentVisibility],
  );

  useEffect(() => {
    // Scroll to top when tab changes
    const mainContent = document.querySelector("main");
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
  }, [activeTab]);

  const handleCreateOpportunity = () => {};

  return (
    <div className="flex flex-col h-full bg-white md:flex-row">
      {/* Profile Panel */}
      <div className="hidden lg:flex h-screen overflow-hidden">
        <EmployerProfilePanel
          company={companyData}
          stats={stats}
          socialLinks={socialLinks}
          completionPercentage={completionPercentage}
          views={views}
          visibility={currentVisibility}
          onVisibilityChange={handleVisibilityChange}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-white h-screen md:h-screen overflow-hidden">
        {/* Top Navigation */}
        <EmployerProfileNav
          activeTab={activeTab as any}
          onTabChange={setActiveTab}
          onCreateOpportunity={handleCreateOpportunity}
        />

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto scrollbar-styled">
          {/* Open Opportunities Tab */}
          {activeTab === "opportunities" && <OpportunitiesTab />}

          {/* Past Hires Tab */}
          {activeTab === "hires" && <PastHiresTab />}

          {/* About Tab */}
          {activeTab === "about" && (
            <AboutTab
              companyName={companyData.name}
              bio={aboutData?.bio}
              industry={aboutData?.industry}
              companySize={aboutData?.companySize}
              companyStage={aboutData?.companyStage}
              operatingModel={aboutData?.operatingModel}
            />
          )}
        </div>
      </main>
    </div>
  );
}
