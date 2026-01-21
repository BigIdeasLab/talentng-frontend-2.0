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
  setUserRoles: (roles: string[]) => void;

  // Current active role
  activeRole: string;
  setActiveRole: (role: string) => void;

  // All profiles by role
  profiles: Record<string, TalentProfile | RecruiterProfile | MentorProfile | null>;
  setProfiles: (profiles: Record<string, TalentProfile | RecruiterProfile | MentorProfile | null>) => void;

  // Mapped UI data by role
  profilesUI: Record<string, UIProfileData | null>;
  setProfilesUI: (profilesUI: Record<string, UIProfileData | null>) => void;

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
}

export function ProfileProvider({
  children,
}: ProfileProviderProps) {
  // Client-side state for profiles fetched after auth
  const [activeRole, setActiveRole] = useState<string>("");
  const [profiles, setProfiles] = useState<Record<string, TalentProfile | RecruiterProfile | MentorProfile | null>>({});
  const [profilesUI, setProfilesUI] = useState<Record<string, UIProfileData | null>>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Empty - client-side loading is handled in AppLayoutClient



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
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}
