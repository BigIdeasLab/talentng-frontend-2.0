"use client";

import { useEffect } from "react";
import { useSwitchRoleParam } from "@/lib/page-utils";
import { useProfile } from "@/hooks/useProfile";
import { TalentDashboard } from "@/components/talent/dashboard/TalentDashboard";
import { EmployerDashboard } from "@/components/employer/dashboard/EmployerDashboard";
import MentorDashboard from "@/components/mentor/dashboard/MentorDashboard";

import { useRequireRole } from "@/hooks/useRequireRole";
import { LoadingScreen } from "@/components/layouts/LoadingScreen";

export default function DashboardPage() {
  // Handle switchRole query parameter (from add-role onboarding)
  useSwitchRoleParam();

  const { activeRole, isLoading, setActiveRole } = useProfile();
  const hasAccess = useRequireRole(["talent", "recruiter", "mentor"]);

  // Safeguard: Ensure the frontend role matches the token's role
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const { decodeToken } = require("@/lib/auth");
          const decoded = decodeToken(token);
          const jwtActiveRole = decoded?.act || decoded?.activeRole;

          if (jwtActiveRole && jwtActiveRole !== activeRole) {
            console.log(
              `Fixing Dashboard mismatch: context=${activeRole}, token=${jwtActiveRole}`,
            );
            setActiveRole(jwtActiveRole);
          }
        } catch (e) {}
      }
    }
  }, [activeRole, setActiveRole]);

  if (isLoading || !activeRole || !hasAccess) {
    return <LoadingScreen />;
  }

  const role = activeRole;

  switch (role) {
    case "recruiter":
      return <EmployerDashboard />;
    case "mentor":
      return <MentorDashboard />;
    case "talent":
      return <TalentDashboard />;
    default:
      return null;
  }
}
