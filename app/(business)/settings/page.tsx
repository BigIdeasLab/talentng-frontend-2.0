"use client";

import { useProfile } from "@/hooks/useProfile";
import { TalentSettings } from "@/components/talent/settings/TalentSettings";
import { EmployerSettings } from "@/components/employer/settings/EmployerSettings";
import { MentorSettings } from "@/components/mentor/settings/MentorSettings";

export default function SettingsPage() {
  const { userRoles } = useProfile();
  const role = userRoles?.[0] || "talent";

  switch (role) {
    case "employer":
      return <EmployerSettings />;
    case "mentor":
      return <MentorSettings />;
    case "talent":
    default:
      return <TalentSettings />;
  }
}
