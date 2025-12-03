"use client";

import { useProfile } from "@/hooks/useProfile";
import { TalentProfile } from "@/components/talent/TalentProfile";
import { EmployerProfile } from "@/components/employer/EmployerProfile";
import { AgencyProfile } from "@/components/agency/AgencyProfile";

export default function ProfilePage() {
  const { userRoles } = useProfile();
  const role = userRoles?.[0] || "talent";

  switch (role) {
    case "employer":
      return <EmployerProfile />;
    case "agency":
      return <AgencyProfile />;
    case "talent":
    default:
      return <TalentProfile />;
  }
}
