"use client";

import { useState } from "react";
import type { MentorProfile as MentorProfileType } from "@/lib/api/mentor/types";
import { MentorProfileSidebar } from "./components/MentorProfileSidebar";
import { MentorProfileNav } from "./components/MentorProfileNav";
import { MentorAboutSection } from "./components/MentorAboutSection";
import { MentorBackgroundSection } from "./components/MentorBackgroundSection";
import { MentorSessionSection } from "./components/MentorSessionSection";
import { MentorReviewsSection } from "./components/MentorReviewsSection";

interface MentorProfileProps {
  initialProfileData?: Partial<MentorProfileType>;
  initialUserId?: string | null;
  initialStats?: any;
  initialRecommendations?: any[];
  initialServices?: any[];
  initialError?: string | null;
}

export function MentorProfile({
  initialProfileData = {},
  initialUserId: _initialUserId = null,
  initialStats: _initialStats = null,
  initialRecommendations: _initialRecommendations = [],
  initialServices: _initialServices = [],
  initialError: _initialError = null,
}: MentorProfileProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "session" | "reviews"
  >("overview");

  const profileData = initialProfileData as MentorProfileType;

  // Sample data - replace with actual data from profileData
  const mentorData = {
    name: profileData.fullName || "Brown David",
    title:
      profileData.headline || profileData.company
        ? `${profileData.headline || ""}${profileData.headline && profileData.company ? " At " : ""}${profileData.company || ""}`
        : "Data Scientist At Microsoft",
    profileImage:
      profileData.profileImageUrl ||
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    pricePerSession: 90,
    sessionsCompleted: 50,
    mentoringTime: 510,
  };

  const socialLinks = {
    telegram: profileData.links?.telegram,
    twitter: profileData.links?.twitter,
    instagram: profileData.links?.instagram,
    linkedin: profileData.links?.linkedin,
  };

  const bio =
    profileData.bio ||
    "Hello! I'm a Data Scientist at Microsoft, specializing in machine learning and data visualization. With over 8 years of experience, I've contributed to projects ranging from cloud computing to AI-driven solutions. My expertise includes Python, R, SQL, and tools like TensorFlow and Power BI.\n\nI've led cross-functional teams, mentored junior data scientists, and worked with stakeholders to translate complex data into actionable insights. Whether you're interested in refining your analytical skills, understanding data trends, or need guidance on real-world data applications, I'm here to assist.\n\nPlease note: To provide focused and in-depth consultations, I offer 30–45 minute mentorship sessions at $90 USD. I'm excited to connect, share my knowledge, and help you advance your career in data science.";

  const expertise = profileData.expertise || ["Data Analysis", "Engineering"];
  const discipline = "Data Scientist";
  const industries = (
    profileData as MentorProfileType & { industries?: string[] }
  ).industries || ["AI", "Fintech", "Ecommerce"];
  const languages = ["English", "French"];

  const handleEditProfile = () => {
    // Navigate to edit profile page or open modal
    console.log("Edit profile clicked");
  };

  const handleEditBio = () => {
    // Open bio edit modal or navigate to edit page
    console.log("Edit bio clicked");
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-white overflow-hidden">
      {/* Sidebar - Hidden on mobile by default, shown in separate mobile view */}
      <div className="hidden lg:block flex-shrink-0">
        <MentorProfileSidebar
          mentor={mentorData}
          socialLinks={socialLinks}
          onEditProfile={handleEditProfile}
        />
      </div>

      {/* Vertical Divider - Hidden on mobile */}
      <div className="hidden lg:block w-px bg-[#E1E4EA] h-screen flex-shrink-0" />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-white overflow-hidden w-full">
        {/* Navigation Tabs */}
        <MentorProfileNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content Area with scroll */}
        <div className="flex-1 overflow-y-auto px-4 lg:px-4 py-5 lg:py-12 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className="max-w-full lg:max-w-[560px] flex flex-col gap-6 lg:gap-7">
            {activeTab === "overview" && (
              <>
                {/* About Section */}
                <MentorAboutSection bio={bio} onEditBio={handleEditBio} />

                {/* Background Section */}
                <MentorBackgroundSection
                  expertise={expertise}
                  discipline={discipline}
                  industries={industries}
                  languages={languages}
                />
              </>
            )}

            {activeTab === "session" && <MentorSessionSection />}

            {activeTab === "reviews" && <MentorReviewsSection />}
          </div>
        </div>
      </main>
    </div>
  );
}
