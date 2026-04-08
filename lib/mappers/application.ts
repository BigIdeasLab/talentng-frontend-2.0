import type { Application } from "@/lib/api/applications";

export interface MappedApplicant {
  id: string;
  userId: string;
  name: string;
  role: string;
  avatar: string;
  hires: string;
  earned: string;
  opportunity: {
    title: string;
    type: string;
  };
  location: string;
  dateApplied: string;
  createdAt: string;
  skills: string[];
  status: "invited" | "applied" | "shortlisted" | "rejected" | "hired";
  sourceType?: "applied" | "invited";
  interviewStatus?: "scheduled" | "rescheduled" | "completed" | "cancelled";
}

export function mapApplicationToUI(app: any): MappedApplicant {
  // Default values for missing data
  const defaultProfile = {
    fullName: "Unknown Talent",
    headline: "No headline",
    profileImageUrl: "",
    hiredCount: 0,
    location: "Unknown",
    skills: [],
  };

  const talentProfile =
    app.user?.talentProfile || app.applicantProfile || defaultProfile;
  const opportunity = app.opportunity || {
    title: "Unknown Opportunity",
    type: "",
  };

  // Get the latest interview status if application is shortlisted
  const latestInterview = app.interviews?.[0];
  const interviewStatus = latestInterview?.status;

  return {
    id: app.id,
    userId: app.userId,
    name: talentProfile.fullName || "Unknown Talent",
    role: talentProfile.headline || "No headline",
    avatar: talentProfile.profileImageUrl || "",
    hires: `${talentProfile.hiredCount || 0}x`,
    earned: `₦${Number(talentProfile.earnings || talentProfile.stats?.earnings || "0").toLocaleString()}`,
    opportunity: {
      title: opportunity.title,
      type: opportunity.type,
    },
    location: talentProfile.location || "Unknown",
    dateApplied: app.createdAt
      ? new Date(app.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Unknown Date",
    createdAt: app.createdAt || "",
    skills: talentProfile.skills || [],
    status: app.status || "applied",
    sourceType: app.sourceType,
    interviewStatus,
  };
}

export function mapApplicationsToUI(apps: any): MappedApplicant[] {
  if (!apps) return [];

  const applicantsArray = Array.isArray(apps)
    ? apps
    : apps?.data || apps?.applications || apps?.results || apps?.items || [];

  if (!Array.isArray(applicantsArray)) return [];

  return applicantsArray
    .map((app: any) => {
      try {
        return mapApplicationToUI(app);
      } catch (e) {
        console.error("Mapping error for app:", app, e);
        return null;
      }
    })
    .filter((a): a is MappedApplicant => a !== null);
}
