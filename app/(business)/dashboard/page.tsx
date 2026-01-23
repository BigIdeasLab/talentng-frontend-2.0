"use client";

import { useSwitchRoleParam } from "@/lib/page-utils";
import { useProfile } from "@/hooks/useProfile";
import { TalentDashboard } from "@/components/talent/dashboard/TalentDashboard";
import { EmployerDashboard } from "@/components/employer/dashboard/EmployerDashboard";
import { MentorDashboard } from "@/components/mentor/dashboard/MentorDashboard";

export default function DashboardPage() {
  // Handle switchRole query parameter (from add-role onboarding)
  useSwitchRoleParam();

  const { activeRole, userRoles } = useProfile();
  const role = activeRole || userRoles?.[0] || "talent";

  switch (role) {
    case "recruiter":
      return <EmployerDashboard />;
    case "mentor":
      return <MentorDashboard />;
    case "talent":
    default:
      return <TalentDashboard />;
  }
}
