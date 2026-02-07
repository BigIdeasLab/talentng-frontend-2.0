"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { MentorProfile as MentorProfileType } from "@/lib/api/mentor/types";
import { updateMentorProfile } from "@/lib/api/mentor";
import { MentorProfileSidebar } from "./components/MentorProfileSidebar";
import { MentorProfileNav } from "./components/MentorProfileNav";
import { MentorAboutSection } from "./components/MentorAboutSection";
import { MentorBackgroundSection } from "./components/MentorBackgroundSection";

import { MentorSessionSection } from "./components/MentorSessionSection";
import { MentorReviewsSection } from "./components/MentorReviewsSection";

interface MentorProfileProps {
  initialProfileData?: Partial<MentorProfileType>;
  profileCompleteness?: number | null;
  initialUserId?: string | null;
  initialStats?: any;
  initialRecommendations?: any[];
  initialServices?: any[];
  initialError?: string | null;
}

export function MentorProfile({
  initialProfileData = {},
  profileCompleteness = null,
  initialUserId: _initialUserId = null,
  initialStats: _initialStats = null,
  initialRecommendations: _initialRecommendations = [],
  initialServices: _initialServices = [],
  initialError: _initialError = null,
}: MentorProfileProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "overview" | "session" | "reviews"
  >("overview");

  const [profileData, setProfileData] = useState(
    initialProfileData as MentorProfileType,
  );

  const handleToggleVisibility = async () => {
    const newVisibility =
      profileData.visibility === "public" ? "private" : "public";
    try {
      await updateMentorProfile({ visibility: newVisibility });
      setProfileData((prev) => ({ ...prev, visibility: newVisibility }));
    } catch {
      // silently fail
    }
  };

  const mentorData = {
    name: profileData.fullName || "",
    title: profileData.headline || "",
    profileImage: profileData.profileImageUrl || "/default.png",
    sessionsCompleted: profileData.totalSessions ?? 0,
    mentoringTime:
      (profileData.totalSessions ?? 0) * (profileData.sessionDuration ?? 60),
  };

  const socialLinks = {
    telegram: profileData.links?.telegram,
    twitter: profileData.links?.twitter,
    instagram: profileData.links?.instagram,
    linkedin: profileData.links?.linkedIn,
  };

  const bio = profileData.bio || "";

  const expertise = profileData.expertise || [];
  const industries = profileData.industries || [];
  const languages = profileData.languages || [];

  const handleEditProfile = () => {
    router.push("/profile/edit");
  };

  const handleEditBio = () => {
    router.push("/profile/edit");
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-white overflow-hidden">
      {/* Sidebar - Hidden on mobile by default, shown in separate mobile view */}
      <div className="hidden lg:block flex-shrink-0">
        <MentorProfileSidebar
          mentor={mentorData}
          profileCompleteness={profileCompleteness}
          avgRating={profileData.avgRating}
          views={profileData.views ?? 0}
          visibility={profileData.visibility ?? "public"}
          onToggleVisibility={handleToggleVisibility}
          stack={profileData.stack || []}
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
                  headline={profileData.headline || ""}
                  location={profileData.location || ""}
                  expertise={expertise}
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
