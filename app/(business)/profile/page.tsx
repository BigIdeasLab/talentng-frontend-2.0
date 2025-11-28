"use client";

import { useState, useEffect } from "react";
import { mapAPIToUI, type UIProfileData } from "@/lib/profileMapper";
import { ProfileLayout } from "@/components/business/Profile/ProfileLayout";
import { getCurrentProfile, getDashboardStats } from "@/lib/api/talent";
import type { DashboardStats } from "@/lib/api/talent/types";

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
    preferredRole: "",
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

export default function ProfilePage() {
  const [profileData, setProfileData] =
    useState<UIProfileData>(DEFAULT_PROFILE_DATA);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [profileRes, statsRes] = await Promise.all([
          getCurrentProfile(),
          getDashboardStats(),
        ]);
        setProfileData(mapAPIToUI(profileRes));
        setStats(statsRes);
      } catch (error) {
        console.error("Error loading profile data:", error);
        setProfileData(DEFAULT_PROFILE_DATA);
        setStats(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <ProfileLayout
      profileData={profileData}
      initialStats={stats}
      isLoading={isLoading}
    />
  );
}
