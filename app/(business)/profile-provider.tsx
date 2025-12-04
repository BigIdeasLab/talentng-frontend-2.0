"use client";

import { createContext, ReactNode, useState, useMemo, useEffect } from "react";
import type { UIProfileData } from "@/lib/profileMapper";
import { mapAPIToUI } from "@/lib/profileMapper";
import type { TalentProfile, DashboardStats } from "@/lib/api/talent/types";
import type { RecruiterProfile } from "@/lib/api/recruiter/types";
import type { MentorProfile } from "@/lib/api/mentor/types";
import { getCurrentProfile as getTalentProfile, getDashboardStats } from "@/lib/api/talent";
import { getCurrentRecruiterProfile } from "@/lib/api/recruiter";
import { getCurrentMentorProfile } from "@/lib/api/mentor";

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
  // Initialize with default role first to avoid hydration mismatch
  const [activeRole, setActiveRole] = useState(initialActiveRole);
  const [profiles, setProfiles] = useState<Record<string, TalentProfile | RecruiterProfile | MentorProfile | null>>(initialProfiles as any);
  const [profilesUI, setProfilesUI] = useState<Record<string, UIProfileData | null>>(initialProfilesUI as any);
  const [userId, setUserId] = useState(initialUserId);
  const [userRoles, setUserRoles] = useState(initialUserRoles);
  const [error, setError] = useState(initialError);
  const [isHydrated, setIsHydrated] = useState(false);

  // Mark hydration complete and restore saved role from localStorage
  useEffect(() => {
    setIsHydrated(true);
    
    // Restore last active role from localStorage after hydration
    const savedRole = localStorage.getItem("lastActiveRole");
    if (savedRole && userRoles.includes(savedRole)) {
      setActiveRole(savedRole);
    }
  }, [userRoles]);

  // Fetch user data on client side where we have access to auth token
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch all profiles in parallel from dedicated endpoints
        const [talentProfile, recruiterProfile, mentorProfile] = await Promise.all([
          getTalentProfile().catch(() => null),
          getCurrentRecruiterProfile().catch(() => null),
          getCurrentMentorProfile().catch(() => null),
        ]);

        if (!talentProfile && !recruiterProfile && !mentorProfile) {
          return;
        }

        // Build profiles and UI from responses
        const newProfiles: Record<string, any> = {};
        const newProfilesUI: Record<string, UIProfileData | null> = {};
        const availableRoles: string[] = [];

        if (talentProfile) {
          newProfiles.talent = talentProfile;
          newProfilesUI.talent = mapAPIToUI(talentProfile);
          availableRoles.push("talent");
        }

        if (recruiterProfile) {
          newProfiles.recruiter = recruiterProfile;
          newProfilesUI.recruiter = mapAPIToUI(recruiterProfile);
          availableRoles.push("recruiter");
        }

        if (mentorProfile) {
          newProfiles.mentor = mentorProfile;
          newProfilesUI.mentor = mapAPIToUI(mentorProfile);
          availableRoles.push("mentor");
        }

        const userId = talentProfile?.userId || recruiterProfile?.userId || mentorProfile?.userId;
        setUserId(userId || null);
        setUserRoles(availableRoles);
        setProfiles(newProfiles);
        setProfilesUI(newProfilesUI);

        // Fallback to first available role if no saved role
        const defaultRole = availableRoles[0] || "talent";
        setActiveRole(defaultRole);
      } catch (err) {
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
