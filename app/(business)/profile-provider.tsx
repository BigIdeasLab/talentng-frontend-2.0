"use client";

import { createContext, ReactNode, useState, useMemo, useEffect } from "react";
import type { UIProfileData } from "@/lib/profileMapper";
import type { TalentProfile, DashboardStats } from "@/lib/api/talent/types";
import type { RecruiterProfile } from "@/lib/api/recruiter/types";
import type { MentorProfile } from "@/lib/api/mentor/types";

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

  // Loading state
  isLoading: boolean;

  // Legacy fields for backward compatibility
  initialProfileData: UIProfileData | null;
  initialProfileRaw: TalentProfile | RecruiterProfile | MentorProfile | null;
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
  initialProfileRaw: TalentProfile | RecruiterProfile | MentorProfile | null;
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
  // Initialize with default role first to avoid hydration mismatch
  const [activeRole, setActiveRole] = useState(initialActiveRole);
  const [profiles, setProfiles] = useState<Record<string, TalentProfile | RecruiterProfile | MentorProfile | null>>(initialProfiles as any);
  const [profilesUI, setProfilesUI] = useState<Record<string, UIProfileData | null>>(initialProfilesUI as any);
  const [userId, setUserId] = useState(initialUserId);
  const [userRoles, setUserRoles] = useState(initialUserRoles);
  const [error, setError] = useState(initialError);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mark hydration complete and restore active role from localStorage
  useEffect(() => {
    setIsHydrated(true);

    // Restore last active role from localStorage after hydration
    if (userRoles.length > 0) {
      const savedRole = localStorage.getItem("lastActiveRole");
      if (savedRole && userRoles.includes(savedRole)) {
        setActiveRole(savedRole);
      } else if (!activeRole && userRoles.length > 0) {
        // Set to first available role if no saved role exists
        setActiveRole(userRoles[0]);
      }
    }

    // Mark loading as complete - server-side fetching means data is already available
    setIsLoading(false);
  }, [userRoles, activeRole]);

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
    isLoading,
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
