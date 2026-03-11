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
import { ProfileSkeleton } from "@/components/skeletons/ProfileSkeleton";

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
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  // Show loading state if we don't have data yet or if we're loading
  if (isLoading || !profileData || !hasAccess) {
    return <ProfileSkeleton role={role as "talent" | "recruiter" | "mentor"} />;
  }

  const displayProfile = profileData.mapped;
  const rawProfile = profileData.raw;

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
            jobsPosted:
              recruiterData?.stats?.jobsPosted ??
              recruiterData?.jobsPosted ??
              0,
            talentsHired:
              recruiterData?.stats?.talentsHired ??
              recruiterData?.talentsHired ??
              0,
            responseTime:
              recruiterData?.stats?.responseTime ??
              recruiterData?.responseTime ??
              "—",
          }}
          socialLinks={{
            twitter: recruiterData?.links?.twitter || "",
            instagram: recruiterData?.links?.instagram || "",
            linkedin:
              recruiterData?.links?.linkedIn ||
              recruiterData?.links?.linkedin ||
              "",
            website: recruiterData?.links?.website || "",
            customLinks: Object.entries(recruiterData?.links || {})
              .filter(
                ([key, value]) =>
                  ![
                    "twitter",
                    "instagram",
                    "linkedin",
                    "linkedIn",
                    "website",
                  ].includes(key) &&
                  value &&
                  typeof value === "string",
              )
              .map(([key, value]) => ({
                name: key
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase()),
                url: value as string,
              })),
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
      const talentViews = talentData?.stats?.views ?? talentData?.views ?? 0;
      const talentVisibility =
        talentData?.visibility === "private" ? "private" : "public";

      // Extract stats from the API response
      const talentStats = {
        earnings: talentData?.stats?.earnings ?? talentData?.earnings ?? "0",
        hired: talentData?.stats?.hired ?? talentData?.hiredCount ?? 0,
        profileViews: talentViews,
        profileCompletion: talentCompleteness,
        applicationsSubmitted: talentData?.stats?.applicationsSubmitted ?? 0,
        interviewsScheduled: talentData?.stats?.interviewsScheduled ?? 0,
      };

      return (
        <TalentProfile
          initialProfileData={displayProfile}
          initialUserId=""
          initialStats={talentStats}
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
