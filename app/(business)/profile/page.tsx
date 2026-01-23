"use client";

import { usePageData, PageLoadingState } from "@/lib/page-utils";
import { useProfile } from "@/hooks/useProfile";
import { mapAPIToUI } from "@/lib/profileMapper";
import { fetchProfileByRole } from "@/lib/api/profile-service";
import { DEFAULT_PROFILE_DATA } from "@/lib/data/default-profile";
import { TalentProfile } from "@/components/talent/profile/TalentProfile";
import { EmployerProfile } from "@/components/employer/profile/EmployerProfile";
import { MentorProfile } from "@/components/mentor/profile/MentorProfile";

export default function ProfilePage() {
  const { activeRole } = useProfile();
  const role = activeRole || "talent";

  const {
    data: profileData,
    isLoading,
    error,
  } = usePageData({
    fetchFn: fetchProfileByRole,
    transform: mapAPIToUI,
    defaultData: DEFAULT_PROFILE_DATA,
  });

  if (isLoading) {
    return <PageLoadingState message="Loading profile..." />;
  }

  const displayProfile = profileData || DEFAULT_PROFILE_DATA;

  switch (role) {
    case "recruiter": {
      const completionFields = [
        profileData?.professional?.company,
        profileData?.personal?.state,
        profileData?.professional?.description,
        profileData?.personal?.profileImageUrl,
        profileData?.professional?.category,
      ].filter(Boolean);
      const completionPercentage = Math.round(
        (completionFields.length / 5) * 100,
      );

      return (
        <EmployerProfile
          companyData={{
            name: profileData?.professional?.company || "Company Name",
            logo: profileData?.personal?.profileImageUrl,
            location: profileData?.personal?.state || "—",
            tagline: profileData?.professional?.description || "Employer",
          }}
          stats={{
            jobsPosted: 0,
            talentsHired: 0,
            responseTime: "—",
          }}
          completionPercentage={completionPercentage}
        />
      );
    }
    case "mentor": {
      return (
        <MentorProfile
          initialProfileData={displayProfile}
          initialUserId=""
          initialStats={null}
          initialRecommendations={[]}
          initialServices={[]}
          initialError={error}
        />
      );
    }
    case "talent":
    default: {
      return (
        <TalentProfile
          initialProfileData={displayProfile}
          initialUserId=""
          initialStats={null}
          initialRecommendations={[]}
          initialServices={[]}
          initialError={error}
        />
      );
    }
  }
}
