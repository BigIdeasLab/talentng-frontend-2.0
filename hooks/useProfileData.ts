"use client";

import { useEffect, useCallback, useRef } from "react";
import { getServerCurrentProfile } from "@/lib/api/talent/server";
import { getServerCurrentRecruiterProfile } from "@/lib/api/recruiter/server";
import { getServerCurrentMentorProfile } from "@/lib/api/mentor/server";
import { mapAPIToUI } from "@/lib/profileMapper";
import { useProfile } from "./useProfile";
import { useAuth } from "./useAuth";
import { getAccessToken, decodeToken } from "@/lib/auth";
import type { TalentProfile } from "@/lib/api/talent/types";
import type { RecruiterProfile } from "@/lib/api/recruiter/types";
import type { MentorProfile } from "@/lib/api/mentor/types";

/**
 * Hook to fetch profile data client-side after user is authenticated.
 *
 * Strategy (Unified Identity):
 *   - Use `user` object roles/profiles from /users/me as the authoritative source.
 *   - Only fetch the FULL profile for the currently active role (avoids 403).
 *   - Fall back to JWT claims, then localStorage for role detection.
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

  const { user } = useAuth();

  // Use refs to read current values inside the callback without causing re-renders
  const activeRoleRef = useRef(activeRole);
  activeRoleRef.current = activeRole;

  const userRef = useRef(user);
  userRef.current = user;

  const fetchProfiles = useCallback(async () => {
    // Check if user is authenticated
    const accessToken = getAccessToken();
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    try {
      const currentUser = userRef.current;

      // ── Step 1: Decode JWT ───────────────────────────────────────────────
      const decoded = decodeToken(accessToken);

      const jwtRoles: string[] = (decoded?.roles || []).map((r: string) =>
        r.trim().toLowerCase(),
      );
      const jwtActiveRole: string | null =
        decoded?.act || decoded?.activeRole || decoded?.active_role || null;

      console.log(
        `[useProfileData] JWT → act: ${jwtActiveRole}, roles: [${jwtRoles.join(", ")}]`,
      );

      // ── Step 2: Determine user roles ─────────────────────────────────────
      // PRIORITY:
      // 1. User object roles (freshest after onboarding - queryClient.setQueryData is immediate)
      // 2. JWT roles
      // 3. localStorage fallback
      let userRoles = (
        currentUser?.roles && currentUser.roles.length > 0
          ? currentUser.roles
          : jwtRoles
      ).map((r: string) => r.trim().toLowerCase());

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

      // ── Step 4: Populate basic info from User object (Unified Identity) ──
      // Read from user object directly — avoids stale closure issues.
      // This provides name/avatar for ALL roles in the switcher without 403s.
      const profiles: Record<
        string,
        TalentProfile | RecruiterProfile | MentorProfile | null
      > = {};
      const profilesUI: Record<string, any> = {};

      if (currentUser) {
        if (currentUser.talentProfile) {
          profiles.talent = currentUser.talentProfile;
          profilesUI.talent = mapAPIToUI(currentUser.talentProfile);
        }
        if (currentUser.recruiterProfile) {
          profiles.recruiter = currentUser.recruiterProfile;
          profilesUI.recruiter = mapAPIToUI(currentUser.recruiterProfile);
        }
        if (currentUser.mentorProfile) {
          profiles.mentor = currentUser.mentorProfile;
          profilesUI.mentor = mapAPIToUI(currentUser.mentorProfile);
        }
      }

      // ── Step 5: Fetch FULL profile for the active role ───────────────────
      // This enriches the active profile with data not included in /users/me.
      console.log(
        `[useProfileData] Fetching full profile for active role: ${currentActiveRole}`,
      );

      let activeProfileData = null;
      if (currentActiveRole === "talent") {
        activeProfileData = await getServerCurrentProfile().catch((e) => {
          console.error("[useProfileData] talent fetch failed:", e?.message);
          return null;
        });
      } else if (currentActiveRole === "recruiter") {
        activeProfileData = await getServerCurrentRecruiterProfile().catch(
          (e) => {
            console.error(
              "[useProfileData] recruiter fetch failed:",
              e?.message,
            );
            return null;
          },
        );
      } else if (currentActiveRole === "mentor") {
        activeProfileData = await getServerCurrentMentorProfile().catch((e) => {
          console.error("[useProfileData] mentor fetch failed:", e?.message);
          return null;
        });
      }

      // Override the session-level data with the full profile for the active role
      if (activeProfileData?.isProfileCreated && activeProfileData?.profile) {
        profiles[currentActiveRole] = activeProfileData.profile;
        profilesUI[currentActiveRole] = mapAPIToUI(activeProfileData.profile);
      }

      // ── Step 6: Set final profile state ──────────────────────────────────
      setProfiles(profiles);
      setProfilesUI(profilesUI);

      // Only override activeRole if the current one's profile wasn't found
      const availableRoles = Object.keys(profiles).filter((role) => {
        const p = profiles[role] as any;
        return !!p && typeof p === "object" && ("id" in p || "username" in p);
      });

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
  // NOTE: We intentionally exclude `user` and `activeRole` from deps here.
  // We read them via refs (userRef, activeRoleRef) to avoid infinite re-render loops.
  // Instead, we set up a separate effect below that re-runs fetchProfiles when user changes.

  // Re-run whenever user changes (e.g., after onboarding sets queryClient data)
  const prevUserRef = useRef<string | null>(null);
  useEffect(() => {
    const currentId = user?.id ?? null;
    const currentRoles = user?.roles?.join(",") ?? null;
    const key = `${currentId}:${currentRoles}`;

    if (key !== prevUserRef.current) {
      prevUserRef.current = key;
      fetchProfiles();
    }
  }, [user, fetchProfiles]);

  // Also fetch on mount if user is not yet available
  useEffect(() => {
    if (!user) {
      fetchProfiles();
    }
  }, [fetchProfiles]); // eslint-disable-line react-hooks/exhaustive-deps

  return { fetchProfiles };
}
