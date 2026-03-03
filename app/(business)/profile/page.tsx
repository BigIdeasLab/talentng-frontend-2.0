"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";
import { mapAPIToUI } from "@/lib/profileMapper";
import { fetchProfileByRole } from "@/lib/api/profile-service";
import { DEFAULT_PROFILE_DATA } from "@/lib/data/default-profile";
import { TalentProfile } from "@/components/talent/profile/TalentProfile";
import { EmployerProfile } from "@/components/employer/profile/EmployerProfile";
import { MentorProfile } from "@/components/mentor/profile/MentorProfile";
import { useRequireRole } from "@/hooks/useRequireRole";
import { PageLoadingState } from "@/lib/page-utils";

export default function ProfilePage() {
  const { activeRole } = useProfile();
  const hasAccess = useRequireRole(["talent", "recruiter", "mentor"]);
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "works";
  const role = activeRole || "talent";

  const {
    data: profileData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile", role],
    queryFn: () => fetchProfileByRole(role),
    select: (result: any) => ({
      raw: result?.profile ?? result,
      mapped: mapAPIToUI(result),
      profileCompleteness: result?.profileCompleteness ?? null,
    }),
    enabled: !!role,
  });

  if (isLoading || !hasAccess) {
    return <PageLoadingState message="Loading profile..." />;
  }

  const displayProfile = profileData?.mapped || DEFAULT_PROFILE_DATA;
  const rawProfile = profileData?.raw || {};

  switch (role) {
    case "recruiter": {
      const completionPercentage = profileData?.profileCompleteness ?? 0;
      const recruiterData = rawProfile as any;
      const views = recruiterData?.views ?? 0;
      const visibility =
        recruiterData?.visibility === "private" ? "private" : "public";

      return (
        <EmployerProfile
          companyData={{
            name: displayProfile?.company || "Company Name",
            logo: displayProfile?.personal?.profileImageUrl,
            location:
              (displayProfile?.personal?.city && displayProfile?.personal?.state
                ? `${displayProfile.personal.city}, ${displayProfile.personal.state}`
                : displayProfile?.personal?.city ||
                  displayProfile?.personal?.state) || "—",
            tagline: displayProfile?.professional?.headline || "Employer",
          }}
          stats={{
            jobsPosted: 0,
            talentsHired: 0,
            responseTime: "—",
          }}
          socialLinks={{
            twitter: recruiterData?.links?.twitter || "",
            instagram: recruiterData?.links?.instagram || "",
            linkedin:
              recruiterData?.links?.linkedIn ||
              recruiterData?.links?.linkedin ||
              "",
            website: recruiterData?.links?.website || "",
          }}
          completionPercentage={completionPercentage}
          aboutData={{
            bio: displayProfile?.personal?.bio,
            industry: displayProfile?.professional?.industry,
            companySize: displayProfile?.professional?.companySize,
            companyStage: displayProfile?.professional?.companyStage,
            operatingModel: displayProfile?.professional?.operatingModel,
          }}
          views={views}
          visibility={visibility}
        />
      );
    }
    case "mentor": {
      return (
        <MentorProfile
          initialProfileData={rawProfile}
          profileCompleteness={profileData?.profileCompleteness ?? null}
          initialUserId=""
          initialStats={null}
          initialRecommendations={[]}
          initialServices={[]}
          initialError={error ? (error as Error).message : null}
        />
      );
    }
    case "talent":
    default: {
      const talentData = rawProfile as any;
      const talentCompleteness = profileData?.profileCompleteness ?? 0;
      const talentViews = talentData?.stats?.views ?? 0;
      const talentVisibility =
        talentData?.visibility === "private" ? "private" : "public";

      return (
        <TalentProfile
          initialProfileData={displayProfile}
          initialUserId=""
          initialStats={null}
          initialRecommendations={[]}
          initialServices={[]}
          initialError={error ? (error as Error).message : null}
          profileCompleteness={talentCompleteness}
          views={talentViews}
          visibility={talentVisibility}
          initialTab={initialTab}
        />
      );
    }
  }
}
