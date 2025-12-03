"use client";

import { useProfile } from "@/hooks/useProfile";
import { TalentDashboard } from "@/components/talent/dashboard/TalentDashboard";
import { EmployerDashboard } from "@/components/employer/dashboard/EmployerDashboard";
import { MentorDashboard } from "@/components/mentor/dashboard/MentorDashboard";

export default function DashboardPage() {
  const { userRoles } = useProfile();
  const role = userRoles?.[0] || "talent";

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
