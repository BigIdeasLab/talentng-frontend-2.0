"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { ProfileLayout } from "@/components/business/Profile/ProfileLayout";
import { EmployerProfile } from "@/components/business/Profile/EmployerProfile";
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
  const { user } = useAuth();
  const [profileData, setProfileData] =
    useState<UIProfileData>(initialProfileData);
  const [stats, setStats] = useState<DashboardStats | null>(initialStats);

  // Render employer profile for employer/recruiter roles
  if (user?.role === "employer" || user?.role === "recruiter") {
    return (
      <EmployerProfile
        companyData={{
          name: user?.fullName || "Company Name",
          location: "—",
          tagline: "Employer",
        }}
        stats={{
          jobsPosted: 0,
          talentsHired: 0,
          responseTime: "—",
        }}
        completionPercentage={0}
      />
    );
  }

  // Default to talent profile for talent roles
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
