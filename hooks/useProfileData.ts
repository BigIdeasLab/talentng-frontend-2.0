"use client";

import { useEffect, useCallback, useRef } from "react";
import { getServerCurrentProfile } from "@/lib/api/talent/server";
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
    activeRole,
    setProfiles,
    setProfilesUI,
    setActiveRole,
    setIsLoading,
    setUserRoles,
  } = useProfile();

  const activeRoleRef = useRef(activeRole);
  activeRoleRef.current = activeRole;

  const fetchProfiles = useCallback(async () => {
    // Check if user is authenticated
    const accessToken = getAccessToken();
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    try {
      // isLoading is already initialized correctly by the provider

      // Get user roles from localStorage (set by OAuth redirect or login)
      const userRolesStr = localStorage.getItem("userRoles");
      const userRoles = userRolesStr
        ? userRolesStr.split(",").map((r) => r.trim().toLowerCase())
        : [];

      // Update context with user roles
      setUserRoles(userRoles);

      // Fetch profiles only for roles the user actually has
      const fetchPromises: Promise<any>[] = [];

      if (userRoles.includes("talent")) {
        fetchPromises.push(getServerCurrentProfile().catch(() => null));
      } else {
        fetchPromises.push(Promise.resolve(null));
      }

      if (userRoles.includes("recruiter")) {
        fetchPromises.push(
          getServerCurrentRecruiterProfile().catch(() => null),
        );
      } else {
        fetchPromises.push(Promise.resolve(null));
      }

      if (userRoles.includes("mentor")) {
        fetchPromises.push(getServerCurrentMentorProfile().catch(() => null));
      } else {
        fetchPromises.push(Promise.resolve(null));
      }

      const [talentProfile, recruiterProfile, mentorProfile] =
        await Promise.all(fetchPromises);

      // Build profiles and UI from responses
      const profiles: Record<
        string,
        TalentProfile | RecruiterProfile | MentorProfile | null
      > = {};
      const profilesUI: Record<string, any> = {};
      const availableRoles: string[] = [];

      if (talentProfile?.isProfileCreated && talentProfile?.profile) {
        profiles.talent = talentProfile.profile;
        profilesUI.talent = mapAPIToUI(talentProfile.profile);
        availableRoles.push("talent");
      }

      if (recruiterProfile?.isProfileCreated && recruiterProfile?.profile) {
        profiles.recruiter = recruiterProfile.profile;
        profilesUI.recruiter = mapAPIToUI(recruiterProfile.profile);
        availableRoles.push("recruiter");
      }

      if (mentorProfile?.isProfileCreated && mentorProfile?.profile) {
        profiles.mentor = mentorProfile.profile;
        profilesUI.mentor = mapAPIToUI(mentorProfile.profile);
        availableRoles.push("mentor");
      }

      // Set profiles in context
      setProfiles(profiles);
      setProfilesUI(profilesUI);

      // Only set active role if not already set by the server cookie
      if (availableRoles.length > 0) {
        if (
          !activeRoleRef.current ||
          !availableRoles.includes(activeRoleRef.current)
        ) {
          setActiveRole(availableRoles[0]);
        }
      } else {
        // User has roles but no profiles yet (new account that hasn't completed onboarding)
        // This is OK - just leave activeRole unset, layout will show appropriate UI
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
