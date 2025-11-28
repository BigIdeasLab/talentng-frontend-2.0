"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { ProfileLayout } from "@/components/business/Profile/ProfileLayout";
import { mapAPIToUI } from "@/lib/profileMapper";
import { getCurrentProfile } from "@/lib/api/talent";
import type { UIProfileData } from "@/lib/profileMapper";

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
  const { user } = useAuth();
  const [profileData, setProfileData] =
    useState<UIProfileData>(DEFAULT_PROFILE_DATA);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setIsLoading(true);
        // Fetch user profile from API
        const apiData = await getCurrentProfile();
        const uiData = mapAPIToUI(apiData);
        setProfileData(uiData);
      } catch (error) {
        console.error("Error loading profile:", error);
        // Set default with user's full name if available
        setProfileData({
          ...DEFAULT_PROFILE_DATA,
          personal: {
            ...DEFAULT_PROFILE_DATA.personal,
            firstName: user?.fullName?.split(" ")[0] || "",
            lastName: user?.fullName?.split(" ").slice(1).join(" ") || "",
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadProfileData();
    }
  }, [user]);

  return <ProfileLayout profileData={profileData} isLoading={isLoading} />;
}
