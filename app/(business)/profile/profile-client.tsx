"use client";

import { useState } from "react";
import { ProfileLayout } from "@/components/business/Profile/ProfileLayout";
import type { UIProfileData } from "@/lib/profileMapper";
import type { DashboardStats } from "@/lib/api/talent/types";

interface ProfilePageClientProps {
  initialProfileData: UIProfileData;
  initialStats: DashboardStats | null;
  initialError: string | null;
}

export function ProfilePageClient({
  initialProfileData,
  initialStats,
  initialError,
}: ProfilePageClientProps) {
  const [profileData, setProfileData] = useState<UIProfileData>(initialProfileData);
  const [stats, setStats] = useState<DashboardStats | null>(initialStats);

  return (
    <ProfileLayout
      profileData={profileData}
      initialStats={stats}
      isLoading={false}
    />
  );
}
