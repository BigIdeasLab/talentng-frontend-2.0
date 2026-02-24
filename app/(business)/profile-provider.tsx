"use client";

import {
  createContext,
  ReactNode,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import type { UIProfileData } from "@/lib/profileMapper";
import type { TalentProfile, DashboardStats } from "@/lib/api/talent/types";
import type { RecruiterProfile } from "@/lib/api/recruiter/types";
import type { MentorProfile } from "@/lib/api/mentor/types";
import { switchRole as switchRoleApi } from "@/lib/api/auth-service";

export interface ProfileContextType {
  // User info
  userId: string | null;
  userRoles: string[];
  setUserRoles: (roles: string[]) => void;

  // Current active role
  activeRole: string;
  setActiveRole: (role: string) => void;
  /** Switch the active role via POST /auth/switch-role, updates token + context */
  switchRole: (role: string) => Promise<void>;

  // Role mismatch handling (Phase 6)
  triggerRoleSwitch: (role: string) => void;
  roleSwitchRequired: string | null;

  // All profiles by role
  profiles: Record<
    string,
    TalentProfile | RecruiterProfile | MentorProfile | null
  >;
  setProfiles: (
    profiles:
      | Record<string, TalentProfile | RecruiterProfile | MentorProfile | null>
      | ((
          prev: Record<
            string,
            TalentProfile | RecruiterProfile | MentorProfile | null
          >,
        ) => Record<
          string,
          TalentProfile | RecruiterProfile | MentorProfile | null
        >),
  ) => void;

  // Mapped UI data by role
  profilesUI: Record<string, UIProfileData | null>;
  setProfilesUI: (
    profilesUI:
      | Record<string, UIProfileData | null>
      | ((
          prev: Record<string, UIProfileData | null>,
        ) => Record<string, UIProfileData | null>),
  ) => void;

  // Stats by role
  stats: Record<string, DashboardStats | any>;

  // Computed getters for current role
  currentProfile: TalentProfile | RecruiterProfile | MentorProfile | null;
  currentProfileUI: UIProfileData | null;
  currentStats: DashboardStats | any | null;

  // Loading state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Error state
  error: string | null;

  // Server-provided initial profile display info
  initialProfileName: string;
  initialProfileAvatar: string;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(
  undefined,
);

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

interface AllStats {
  [key: string]: DashboardStats | any | undefined;
  talent?: DashboardStats;
  recruiter?: any;
  mentor?: any;
}

function getProfileDisplayName(role: string, profile: any): string {
  if (role === "recruiter") {
    return (
      profile?.company ||
      profile?.companyName ||
      profile?.professional?.company ||
      profile?.fullName ||
      "Company"
    );
  }
  if (role === "mentor") {
    return (
      profile?.fullName ||
      `${profile?.personal?.firstName || ""} ${profile?.personal?.lastName || ""}`.trim() ||
      profile?.companyName ||
      "Mentor"
    );
  }
  if (profile?.fullName) return profile.fullName;
  const firstName = profile?.personal?.firstName || profile?.firstName || "";
  const lastName = profile?.personal?.lastName || profile?.lastName || "";
  return `${firstName} ${lastName}`.trim() || "User";
}

function getProfileAvatarUrl(profile: any): string {
  return (
    profile?.personal?.profileImageUrl ||
    profile?.profileImageUrl ||
    profile?.profile_image_url ||
    "/default.png"
  );
}

interface ProfileProviderProps {
  children: ReactNode;
  initialRole: string;
  initialProfileName: string;
  initialProfileAvatar: string;
}

export function ProfileProvider({
  children,
  initialRole,
  initialProfileName,
  initialProfileAvatar,
}: ProfileProviderProps) {
  const [activeRole, setActiveRole] = useState<string>(initialRole);
  const [profiles, setProfiles] = useState<
    Record<string, TalentProfile | RecruiterProfile | MentorProfile | null>
  >({});
  const [profilesUI, setProfilesUI] = useState<
    Record<string, UIProfileData | null>
  >({});
  const [userId, setUserId] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!initialRole);
  const [roleSwitchRequired, setRoleSwitchRequired] = useState<string | null>(
    null,
  );

  const triggerRoleSwitch = useCallback((role: string) => {
    setRoleSwitchRequired(role);
  }, []);

  const closeRoleSwitch = useCallback(() => {
    setRoleSwitchRequired(null);
  }, []);

  const switchRole = useCallback(async (role: string) => {
    // Only call the API — don't update React state here.
    // The caller (ProfileSwitcher) reloads the page after this resolves,
    // so any state updates would just cause a redundant re-render.
    // switchRoleApi stores the new token + updates localStorage/cookies.
    await switchRoleApi(role);
  }, []);

  // Persist all SSR cookies in one place
  useEffect(() => {
    if (!activeRole) return;
    document.cookie = `activeRole=${activeRole}; path=/; max-age=31536000; SameSite=Lax`;

    const profile = profilesUI[activeRole] || profiles[activeRole];
    if (!profile) return;

    const name = getProfileDisplayName(activeRole, profile);
    const avatar = getProfileAvatarUrl(profile);
    if (name && name !== "User" && name !== "Company" && name !== "Mentor") {
      document.cookie = `profileName=${encodeURIComponent(name)}; path=/; max-age=31536000; SameSite=Lax`;
      document.cookie = `profileAvatar=${encodeURIComponent(avatar)}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }, [activeRole, profiles, profilesUI]);

  // Compute current profile based on active role
  const currentProfile = useMemo(() => {
    return profiles[activeRole] || null;
  }, [activeRole, profiles]);

  // Compute current profile UI based on active role
  const currentProfileUI = useMemo(() => {
    return profilesUI[activeRole] || null;
  }, [activeRole, profilesUI]);

  const value: ProfileContextType = {
    userId,
    userRoles,
    setUserRoles,
    activeRole,
    setActiveRole,
    switchRole,
    profiles,
    setProfiles,
    profilesUI,
    setProfilesUI,
    stats: {},
    currentProfile,
    currentProfileUI,
    currentStats: null,
    isLoading,
    setIsLoading,
    error,
    roleSwitchRequired,
    triggerRoleSwitch,
    initialProfileName,
    initialProfileAvatar,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}
