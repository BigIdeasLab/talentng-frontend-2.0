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
  status: "applied" | "shortlisted" | "rejected" | "hired";
}

export function mapApplicationToUI(app: Application): MappedApplicant {
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
  };
}

export function mapApplicationsToUI(apps: Application[]): MappedApplicant[] {
  return apps.map(mapApplicationToUI);
}
