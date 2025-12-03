"use client";

import { createContext, ReactNode, useState, useMemo, useEffect } from "react";
import type { UIProfileData } from "@/lib/profileMapper";
import type { TalentProfile, DashboardStats } from "@/lib/api/talent/types";
import type { RecruiterProfile } from "@/lib/api/recruiter/types";
import type { MentorProfile } from "@/lib/api/mentor/types";
import { getCurrentUser } from "@/lib/api/users";

export interface ProfileContextType {
  // User info
  userId: string | null;
  userRoles: string[];

  // Current active role
  activeRole: string;
  setActiveRole: (role: string) => void;

  // All profiles by role
  profiles: Record<string, TalentProfile | RecruiterProfile | MentorProfile | null>;

  // Mapped UI data by role
  profilesUI: Record<string, UIProfileData | null>;

  // Stats by role
  stats: Record<string, DashboardStats | any>;

  // Computed getters for current role
  currentProfile: TalentProfile | RecruiterProfile | MentorProfile | null;
  currentProfileUI: UIProfileData | null;
  currentStats: DashboardStats | any | null;

  // Legacy fields for backward compatibility
  initialProfileData: UIProfileData | null;
  initialProfileRaw: TalentProfile | null;
  recommendations: any[];
  error: string | null;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface AllProfiles {
  [key: string]: TalentProfile | RecruiterProfile | MentorProfile | null | undefined;
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

interface ProfileProviderProps {
  children: ReactNode;
  // New multi-role fields
  profiles: AllProfiles;
  profilesUI: AllProfilesUI;
  stats: AllStats;
  activeRole: string;
  // Legacy fields
  initialProfileData: UIProfileData | null;
  initialProfileRaw: TalentProfile | null;
  userId: string | null;
  userRoles: string[];
  recommendations: any[];
  error: string | null;
}

export function ProfileProvider({
  children,
  profiles: initialProfiles,
  profilesUI: initialProfilesUI,
  stats: initialStats,
  activeRole: initialActiveRole,
  initialProfileData,
  initialProfileRaw,
  userId: initialUserId,
  userRoles: initialUserRoles,
  recommendations: initialRecommendations,
  error: initialError,
}: ProfileProviderProps) {
  const [activeRole, setActiveRole] = useState(initialActiveRole);
  const [profiles, setProfiles] = useState<Record<string, TalentProfile | RecruiterProfile | MentorProfile | null>>(initialProfiles as any);
  const [profilesUI, setProfilesUI] = useState<Record<string, UIProfileData | null>>(initialProfilesUI as any);
  const [userId, setUserId] = useState(initialUserId);
  const [userRoles, setUserRoles] = useState(initialUserRoles);
  const [error, setError] = useState(initialError);

  // Fetch user data on client side where we have access to auth token
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await (getCurrentUser as any)();
        
        if (!user || user.message === "Unauthorized") {
          console.warn("[ProfileProvider] Unauthorized - user data not available");
          return;
        }

        setUserId(user.id);
        setUserRoles(user.roles || ["talent"]);

        // Build profiles from user response
        const newProfiles: Record<string, any> = {};
        const newProfilesUI: Record<string, UIProfileData | null> = {};

        if (user.talentProfile) {
          newProfiles.talent = user.talentProfile;
          newProfilesUI.talent = user.talentProfile; // mapAPIToUI can be added later
        }

        if (user.recruiterProfile) {
          newProfiles.recruiter = user.recruiterProfile;
          newProfilesUI.recruiter = user.recruiterProfile;
        }

        if (user.mentorProfile) {
          newProfiles.mentor = user.mentorProfile;
          newProfilesUI.mentor = user.mentorProfile;
        }

        setProfiles(newProfiles);
        setProfilesUI(newProfilesUI);

        // Set to first role with a profile, or first role
        const defaultRole = Object.keys(newProfiles).find(role => newProfiles[role]) || user.roles?.[0] || "talent";
        setActiveRole(defaultRole);

        console.log("[ProfileProvider] Loaded user data:", {
          userId: user.id,
          roles: user.roles,
          hasProfiles: {
            talent: !!user.talentProfile,
            recruiter: !!user.recruiterProfile,
            mentor: !!user.mentorProfile,
          },
        });
      } catch (err) {
        console.error("[ProfileProvider] Failed to fetch user data:", err);
        setError(err instanceof Error ? err.message : "Failed to load profile data");
      }
    };

    fetchUserData();
  }, []);

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
    activeRole,
    setActiveRole,
    profiles: profiles as Record<string, TalentProfile | RecruiterProfile | MentorProfile | null>,
    profilesUI,
    stats: initialStats as Record<string, DashboardStats | any>,
    currentProfile,
    currentProfileUI,
    currentStats: null,
    initialProfileData,
    initialProfileRaw,
    recommendations: initialRecommendations,
    error,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}
