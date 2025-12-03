"use client";

import { useProfile } from "@/hooks/useProfile";
import { TalentSettings } from "@/components/talent/settings/TalentSettings";
import { EmployerSettings } from "@/components/employer/EmployerSettings";
import { AgencySettings } from "@/components/agency/AgencySettings";

export default function SettingsPage() {
  const { userRoles } = useProfile();
  const role = userRoles?.[0] || "talent";

  switch (role) {
    case "employer":
      return <EmployerSettings />;
    case "agency":
      return <AgencySettings />;
    case "talent":
    default:
      return <TalentSettings />;
  }
}
