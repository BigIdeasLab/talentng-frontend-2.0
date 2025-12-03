/**
 * Server-side data fetching for app layout
 * Fetches all profile data once at layout level (talent, recruiter, mentor)
 * Data is passed to ProfileProvider and available to all app pages
 */

import { getServerCurrentProfile, getServerDashboardStats, getServerTalentRecommendations } from "@/lib/api/talent/server";
import { getServerCurrentRecruiterProfile } from "@/lib/api/recruiter/server";
import { getServerCurrentMentorProfile } from "@/lib/api/mentor/server";
import { mapAPIToUI } from "@/lib/profileMapper";
import { getCurrentUser } from "@/lib/api/users";
import type { TalentProfile } from "@/lib/api/talent/types";
import type { RecruiterProfile } from "@/lib/api/recruiter/types";
import type { MentorProfile } from "@/lib/api/mentor/types";
import type { UIProfileData } from "@/lib/profileMapper";
import type { DashboardStats } from "@/lib/api/talent/types";

const mapRecommendationToUI = (apiRec: any) => ({
  id: apiRec.id,
  name: apiRec.recommendedBy.username || apiRec.recommendedBy.email,
  date: new Date(apiRec.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }),
  avatar: "",
  text: apiRec.comment || `Recommended for: ${apiRec.title}`,
});

export async function getBusinessLayoutData() {
  // Return empty initial state - client will fetch profile data
  // This avoids server-side auth token issues in Next.js
  console.log("[Layout Data] Returning empty initial state - profile will be fetched client-side");
  
  return {
    profiles: {},
    profilesUI: {},
    stats: {},
    activeRole: "talent",
    profileData: null,
    profileRaw: null,
    userId: null,
    userRoles: ["talent"],
    recommendations: [],
    error: null,
  };
}
