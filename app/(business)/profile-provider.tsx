"use client";

import { createContext, ReactNode } from "react";
import type { UIProfileData } from "@/lib/profileMapper";
import type { TalentProfile, DashboardStats } from "@/lib/api/talent/types";

export interface ProfileContextType {
  initialProfileData: UIProfileData | null;
  initialProfileRaw: TalentProfile | null;
  userId: string | null;
  userRoles: string[];
  stats: DashboardStats | null;
  recommendations: any[];
  error: string | null;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
  initialProfileData: UIProfileData | null;
  initialProfileRaw: TalentProfile | null;
  userId: string | null;
  userRoles: string[];
  stats: DashboardStats | null;
  recommendations: any[];
  error: string | null;
}

export function ProfileProvider({
  children,
  initialProfileData,
  initialProfileRaw,
  userId,
  userRoles,
  stats,
  recommendations,
  error,
}: ProfileProviderProps) {
  const value: ProfileContextType = {
    initialProfileData,
    initialProfileRaw,
    userId,
    userRoles,
    stats,
    recommendations,
    error,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}
