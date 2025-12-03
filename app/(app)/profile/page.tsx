"use client";

import { TalentProfile } from "@/components/talent/profile/TalentProfile";
import { useProfile } from "@/hooks/useProfile";
import { useEffect, useState } from "react";

const DEFAULT_PROFILE_DATA = {
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
    category: "",
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
  const { userRoles } = useProfile();
  const role = userRoles?.[0] || "talent";
  const [profileData, setProfileData] = useState<
    typeof DEFAULT_PROFILE_DATA | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch profile data
    const fetchData = async () => {
      try {
        // TODO: Add actual API call to fetch profile data based on role
        setProfileData(DEFAULT_PROFILE_DATA);
      } catch (error) {
        console.error("Failed to load profile data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  switch (role) {
    case "employer":
      // TODO: Implement employer profile component
      return (
        <TalentProfile
          initialProfileData={profileData || DEFAULT_PROFILE_DATA}
          initialUserId=""
          initialStats={{} as any}
          initialRecommendations={[]}
          initialServices={[]}
          initialError={null}
        />
      );
    case "mentor":
      // TODO: Implement mentor profile component
      return (
        <TalentProfile
          initialProfileData={profileData || DEFAULT_PROFILE_DATA}
          initialUserId=""
          initialStats={{} as any}
          initialRecommendations={[]}
          initialServices={[]}
          initialError={null}
        />
      );
    case "talent":
    default:
      return (
        <TalentProfile
          initialProfileData={profileData || DEFAULT_PROFILE_DATA}
          initialUserId=""
          initialStats={{} as any}
          initialRecommendations={[]}
          initialServices={[]}
          initialError={null}
        />
      );
  }
}
