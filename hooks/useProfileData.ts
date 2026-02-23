"use client";

import { useEffect, useCallback, useRef } from "react";
import { getServerCurrentProfile } from "@/lib/api/talent/server";
import { getServerCurrentRecruiterProfile } from "@/lib/api/recruiter/server";
import { getServerCurrentMentorProfile } from "@/lib/api/mentor/server";
import { mapAPIToUI } from "@/lib/profileMapper";
import { useProfile } from "./useProfile";
import { getAccessToken, decodeToken } from "@/lib/auth";
import type { TalentProfile } from "@/lib/api/talent/types";
import type { RecruiterProfile } from "@/lib/api/recruiter/types";
import type { MentorProfile } from "@/lib/api/mentor/types";

/**
 * Hook to fetch profile data client-side after user is authenticated.
 *
 * The JWT is the SINGLE source of truth for:
 *   - `roles`  → all roles the user possesses  (JWT claim `roles`)
 *   - `act`    → the currently active role       (JWT claim `act`)
 *
 * localStorage / cookies are kept in sync as a cache for SSR & middleware,
 * but they are never trusted over the JWT.
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
      // ── Step 1: Decode JWT — the SINGLE source of truth ─────────────────
      const decoded = decodeToken(accessToken);

      // All roles the user has (from the JWT `roles` array)
      const jwtRoles: string[] = (decoded?.roles || []).map((r: string) =>
        r.trim().toLowerCase(),
      );

      // The currently active role (from the JWT `act` claim)
      const jwtActiveRole: string | null =
        decoded?.act || decoded?.activeRole || decoded?.active_role || null;

      console.log(
        `[useProfileData] JWT → act: ${jwtActiveRole}, roles: [${jwtRoles.join(", ")}]`,
      );

      // ── Step 2: Sync roles to context + localStorage cache ──────────────
      // If we have roles from the JWT, always use those (authoritative).
      // Fall back to localStorage only if the JWT didn't include a roles array.
      let userRoles = jwtRoles;

      if (userRoles.length === 0) {
        const stored = localStorage.getItem("userRoles");
        userRoles = stored
          ? stored.split(",").map((r) => r.trim().toLowerCase())
          : [];
      }

      if (userRoles.length > 0) {
        setUserRoles(userRoles);
        localStorage.setItem("userRoles", userRoles.join(","));
      }

      // ── Step 3: Determine the active role ───────────────────────────────
      let currentActiveRole: string | null = jwtActiveRole;

      // If JWT has no `act` claim, fall back to context → localStorage → cookie → first role
      if (!currentActiveRole) {
        currentActiveRole =
          activeRoleRef.current || localStorage.getItem("activeRole") || null;

        if (!currentActiveRole) {
          const cookies = document.cookie.split(";").reduce(
            (acc, cookie) => {
              const [key, value] = cookie.split("=").map((c) => c.trim());
              acc[key] = value;
              return acc;
            },
            {} as Record<string, string>,
          );
          currentActiveRole = cookies.activeRole || null;
        }

        if (!currentActiveRole && userRoles.length > 0) {
          currentActiveRole = userRoles[0];
        }
      }

      // Sync active role to context, localStorage and cookie if it changed
      if (currentActiveRole && currentActiveRole !== activeRoleRef.current) {
        console.log(
          `[useProfileData] Syncing activeRole: context=${activeRoleRef.current} → ${currentActiveRole}`,
        );
        setActiveRole(currentActiveRole);
        localStorage.setItem("activeRole", currentActiveRole);
        document.cookie = `activeRole=${currentActiveRole}; path=/; max-age=31536000; SameSite=Lax`;
      }

      if (!currentActiveRole) {
        console.warn("[useProfileData] No active role found — skipping fetch.");
        return;
      }

      // ── Step 4: Fetch the profile for the active role ───────────────────
      console.log(
        `[useProfileData] Fetching profile for role: ${currentActiveRole}`,
      );

      let talentProfile = null;
      let recruiterProfile = null;
      let mentorProfile = null;

      // Guard with the roles we derived above (JWT first, then localStorage)
      const rolesGuard = userRoles.length > 0 ? userRoles : [currentActiveRole];

      if (currentActiveRole === "talent" && rolesGuard.includes("talent")) {
        talentProfile = await getServerCurrentProfile().catch((e) => {
          console.error(
            "[useProfileData] talent profile fetch failed:",
            e?.message,
          );
          return null;
        });
      } else if (
        currentActiveRole === "recruiter" &&
        rolesGuard.includes("recruiter")
      ) {
        recruiterProfile = await getServerCurrentRecruiterProfile().catch(
          (e) => {
            console.error(
              "[useProfileData] recruiter profile fetch failed:",
              e?.message,
            );
            return null;
          },
        );
      } else if (
        currentActiveRole === "mentor" &&
        rolesGuard.includes("mentor")
      ) {
        mentorProfile = await getServerCurrentMentorProfile().catch((e) => {
          console.error(
            "[useProfileData] mentor profile fetch failed:",
            e?.message,
          );
          return null;
        });
      }

      // ── Step 5: Build and set profile state ─────────────────────────────
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

      setProfiles(profiles);
      setProfilesUI(profilesUI);

      // Only override activeRole if the current one's profile wasn't found
      if (
        availableRoles.length > 0 &&
        !availableRoles.includes(currentActiveRole)
      ) {
        setActiveRole(availableRoles[0]);
      }
    } catch (error) {
      console.error("[useProfileData] Unexpected error:", error);
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
