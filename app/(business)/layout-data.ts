/**
 * Server-side data fetching for app layout
 * Fetches all profile data once at layout level (talent, recruiter, mentor)
 * Data is passed to ProfileProvider and available to all app pages
 */

import {
  getServerCurrentProfile,
  getServerDashboardStats,
  getServerTalentRecommendations,
} from "@/lib/api/talent/server";
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
  try {
    // console.log("[Layout Data] Fetching profile data on server...");

    // Fetch all profiles in parallel on server
    // Note: Some profiles may not exist (404), which is expected and handled gracefully
    const [talentProfile, recruiterProfile, mentorProfile] = await Promise.all([
      getServerCurrentProfile().catch(() => null),
      getServerCurrentRecruiterProfile().catch(() => null),
      getServerCurrentMentorProfile().catch(() => null),
    ]);

    // If no profiles found, return empty state
    if (!talentProfile && !recruiterProfile && !mentorProfile) {
      // console.log("[Layout Data] No profiles found - returning empty state");
      return {
        profiles: {},
        profilesUI: {},
        stats: {},
        activeRole: "",
        profileData: null,
        profileRaw: null,
        userId: null,
        userRoles: [],
        recommendations: [],
        error: null,
      };
    }

    // Build profiles and UI from responses
    const profiles: AllProfiles = {};
    const profilesUI: AllProfilesUI = {};
    const userRoles: string[] = [];

    if (talentProfile?.profile) {
      profiles.talent = talentProfile.profile;
      profilesUI.talent = mapAPIToUI(talentProfile.profile);
      userRoles.push("talent");
    }

    if (recruiterProfile?.profile) {
      profiles.recruiter = recruiterProfile.profile;
      profilesUI.recruiter = mapAPIToUI(recruiterProfile.profile);
      userRoles.push("recruiter");
    }

    if (mentorProfile?.profile) {
      profiles.mentor = mentorProfile.profile;
      profilesUI.mentor = mapAPIToUI(mentorProfile.profile);
      userRoles.push("mentor");
    }

    // Get user ID from any profile
    const userId =
      talentProfile?.profile?.userId ||
      recruiterProfile?.profile?.userId ||
      mentorProfile?.profile?.userId ||
      null;

    // Set default active role to first available
    const activeRole = userRoles[0] || "";

    // console.log("[Layout Data] Profiles loaded. Available roles:", userRoles.join(", "));

    return {
      profiles,
      profilesUI,
      stats: {},
      activeRole,
      profileData: profilesUI[activeRole] || null,
      profileRaw: profiles[activeRole] || null,
      userId,
      userRoles,
      recommendations: [],
      error: null,
    };
  } catch (error) {
    // console.error("[Layout Data] Error fetching profile data:", error);
    return {
      profiles: {},
      profilesUI: {},
      stats: {},
      activeRole: "",
      profileData: null,
      profileRaw: null,
      userId: null,
      userRoles: [],
      recommendations: [],
      error: "Failed to load profile data",
    };
  }
}

interface AllProfiles {
  [key: string]:
    | TalentProfile
    | RecruiterProfile
    | MentorProfile
    | null
    | undefined;
  talent?: TalentProfile | null;
  recruiter?: RecruiterProfile | null;
  mentor?: MentorProfile | null;
}

interface AllProfilesUI {
  [key: string]: UIProfileData | null | undefined;
  talent?: UIProfileData | null;
  recruiter?: UIProfileData | null;
  mentor?: UIProfileData | null;
}
