"use client";

import { useEffect, useCallback } from "react";
import { getServerCurrentProfile, getServerDashboardStats, getServerTalentRecommendations } from "@/lib/api/talent/server";
import { getServerCurrentRecruiterProfile } from "@/lib/api/recruiter/server";
import { getServerCurrentMentorProfile } from "@/lib/api/mentor/server";
import { mapAPIToUI } from "@/lib/profileMapper";
import { useProfile } from "./useProfile";
import { getAccessToken } from "@/lib/auth";
import type { TalentProfile } from "@/lib/api/talent/types";
import type { RecruiterProfile } from "@/lib/api/recruiter/types";
import type { MentorProfile } from "@/lib/api/mentor/types";

/**
 * Hook to fetch profile data client-side after user is authenticated
 * Calls the API client which sends Authorization header with localStorage token
 */
export function useProfileData() {
  const {
    setProfiles,
    setProfilesUI,
    setActiveRole,
    setIsLoading,
    setUserRoles,
  } = useProfile();

  const fetchProfiles = useCallback(async () => {
    // Check if user is authenticated
    const accessToken = getAccessToken();
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Get user roles from localStorage (set by OAuth redirect or login)
      const userRolesStr = localStorage.getItem("userRoles");
      const userRoles = userRolesStr ? userRolesStr.split(",").map(r => r.trim().toLowerCase()) : [];

      // Update context with user roles
      setUserRoles(userRoles);

      // Fetch profiles only for roles the user actually has
      const fetchPromises: Promise<any>[] = [];
      const roleMap: Record<string, string> = {};

      if (userRoles.includes("talent")) {
        roleMap["talent"] = "talent";
        fetchPromises.push(getServerCurrentProfile().catch(() => null));
      } else {
        fetchPromises.push(Promise.resolve(null));
      }

      if (userRoles.includes("recruiter")) {
        roleMap["recruiter"] = "recruiter";
        fetchPromises.push(getServerCurrentRecruiterProfile().catch(() => null));
      } else {
        fetchPromises.push(Promise.resolve(null));
      }

      if (userRoles.includes("mentor")) {
        roleMap["mentor"] = "mentor";
        fetchPromises.push(getServerCurrentMentorProfile().catch(() => null));
      } else {
        fetchPromises.push(Promise.resolve(null));
      }

      const [talentProfile, recruiterProfile, mentorProfile] = await Promise.all(fetchPromises);

      // Build profiles and UI from responses
      const profiles: Record<string, TalentProfile | RecruiterProfile | MentorProfile | null> = {};
      const profilesUI: Record<string, any> = {};
      const availableRoles: string[] = [];

      if (talentProfile) {
        profiles.talent = talentProfile;
        profilesUI.talent = mapAPIToUI(talentProfile);
        availableRoles.push("talent");
      }

      if (recruiterProfile) {
        profiles.recruiter = recruiterProfile;
        profilesUI.recruiter = mapAPIToUI(recruiterProfile);
        availableRoles.push("recruiter");
      }

      if (mentorProfile) {
        profiles.mentor = mentorProfile;
        profilesUI.mentor = mapAPIToUI(mentorProfile);
        availableRoles.push("mentor");
      }

      // Set profiles in context
      setProfiles(profiles);
      setProfilesUI(profilesUI);

      // Set default active role
      if (availableRoles.length > 0) {
        const savedRole = localStorage.getItem("lastActiveRole");
        if (savedRole && availableRoles.includes(savedRole)) {
          setActiveRole(savedRole);
        } else {
          setActiveRole(availableRoles[0]);
        }
      } else {
        // User has roles but no profiles yet (new account that hasn't completed onboarding)
        // This is OK - just leave activeRole unset, layout will show appropriate UI
        console.log("No profiles found for user with roles:", userRoles);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [setProfiles, setProfilesUI, setActiveRole, setIsLoading, setUserRoles]);

  // Fetch profiles on mount
  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  return { fetchProfiles };
}
