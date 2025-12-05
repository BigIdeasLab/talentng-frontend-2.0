"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { EmployerProfilePanel } from "./EmployerProfilePanel";
import { EmployerProfileNav } from "./EmployerProfileNav";
import { Search, SlidersHorizontal } from "lucide-react";

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
}: EmployerProfileProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("opportunities");

  useEffect(() => {
    // Scroll to top when tab changes
    const mainContent = document.querySelector("main");
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
  }, [activeTab]);

  const handleCreateOpportunity = () => {
    console.log("Create Opportunity clicked");
  };

  return (
    <div className="flex flex-col h-full bg-white md:flex-row">
      {/* Profile Panel */}
      <div className="hidden lg:flex h-screen overflow-hidden">
        <EmployerProfilePanel
          company={companyData}
          stats={stats}
          socialLinks={socialLinks}
          completionPercentage={completionPercentage}
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
          {activeTab === "opportunities" && (
            <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
              <h2 className="text-xl font-semibold text-black">
                Open Opportunities
              </h2>
              <p className="text-sm text-[rgba(0,0,0,0.30)]">
                No opportunities posted yet
              </p>
            </div>
          )}

          {/* Past Hires Tab */}
          {activeTab === "hires" && <PastHiresTab />}

          {/* About Tab */}
          {activeTab === "about" && (
            <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
              <h2 className="text-xl font-semibold text-black">About</h2>
              <p className="text-sm text-[rgba(0,0,0,0.30)]">
                Company information will be displayed here
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
