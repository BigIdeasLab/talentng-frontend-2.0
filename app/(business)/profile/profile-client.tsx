"use client";

import { useState } from "react";
import { ProfileLayout } from "@/components/business/Profile/ProfileLayout";
import type { UIProfileData } from "@/lib/profileMapper";
import type { DashboardStats } from "@/lib/api/talent/types";

interface ProfilePageClientProps {
  initialProfileData: UIProfileData;
  initialUserId: string | null;
  initialStats: DashboardStats | null;
  initialRecommendations: any[];
  initialServices?: any[];
  initialError: string | null;
}

export function ProfilePageClient({
  initialProfileData,
  initialUserId,
  initialStats,
  initialRecommendations,
  initialServices,
  initialError,
}: ProfilePageClientProps) {
  const [profileData, setProfileData] =
    useState<UIProfileData>(initialProfileData);
  const [stats, setStats] = useState<DashboardStats | null>(initialStats);

  return (
    <ProfileLayout
      profileData={profileData}
      userId={initialUserId}
      initialStats={stats}
      initialRecommendations={initialRecommendations}
      initialServices={initialServices}
      isLoading={false}
    />
  );
}
