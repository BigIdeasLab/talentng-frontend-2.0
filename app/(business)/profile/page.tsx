import { ProfileLayout } from "@/components/business/Profile/ProfileLayout";
import { getProfilePageData } from "./server-data";
import { ProfilePageClient } from "./profile-client";

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

export default async function ProfilePage() {
  const { profileData, userId, stats, recommendations, services, error } = await getProfilePageData();

  return (
    <ProfilePageClient
      initialProfileData={profileData || DEFAULT_PROFILE_DATA}
      initialUserId={userId}
      initialStats={stats}
      initialRecommendations={recommendations || []}
      initialServices={services || []}
      initialError={error}
    />
  );
}
