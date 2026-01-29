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
  status: "invited" | "applied" | "shortlisted" | "rejected" | "hired";
  interviewStatus?: "scheduled" | "rescheduled" | "completed" | "cancelled";
}

export function mapApplicationToUI(app: Application): MappedApplicant {
  // Get the latest interview status if application is shortlisted
  const latestInterview = app.interviews?.[0];
  const interviewStatus = latestInterview?.status;

  return {
    id: app.id,
    userId: app.userId,
    name: app.user.talentProfile.fullName,
    role: app.user.talentProfile.headline,
    avatar: app.user.talentProfile.profileImageUrl,
    hires: `${app.user.talentProfile.hiredCount}x`,
    earned: `₦${Number(app.user.talentProfile.earnings || "0").toLocaleString()}`,
    opportunity: {
      title: app.opportunity.title,
      type: app.opportunity.type,
    },
    location: app.user.talentProfile.location,
    dateApplied: new Date(app.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    status: app.status,
    interviewStatus,
  };
}

export function mapApplicationsToUI(apps: Application[]): MappedApplicant[] {
  return apps.map(mapApplicationToUI);
}
