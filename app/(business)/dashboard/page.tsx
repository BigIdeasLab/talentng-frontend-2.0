"use client";

import { Suspense } from "react";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";
import { TalentDashboard } from "@/components/talent/dashboard/TalentDashboard";
import { EmployerDashboard } from "@/components/employer/dashboard/EmployerDashboard";
import { MentorDashboard } from "@/components/mentor/dashboard/MentorDashboard";

function DashboardContent() {
  const searchParams = useSearchParams();
  const { userRoles, activeRole, setActiveRole } = useProfile();
  
  // Handle switchRole query parameter (from add-role onboarding)
  useEffect(() => {
    const switchRole = searchParams.get("switchRole");
    if (switchRole && userRoles.includes(switchRole)) {
      setActiveRole(switchRole);
    }
  }, [searchParams, userRoles, setActiveRole]);
  
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

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
