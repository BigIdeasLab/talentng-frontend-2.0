"use client";

import { useProfile } from "@/hooks/useProfile";
import { TalentDashboard } from "@/components/talent/dashboard/TalentDashboard";
import { EmployerDashboard } from "@/components/employer/EmployerDashboard";
import { AgencyDashboard } from "@/components/agency/AgencyDashboard";

export default function DashboardPage() {
  const { userRoles } = useProfile();
  const role = userRoles?.[0] || "talent";

  switch (role) {
    case "employer":
      return <EmployerDashboard />;
    case "agency":
      return <AgencyDashboard />;
    case "talent":
    default:
      return <TalentDashboard />;
  }
}
