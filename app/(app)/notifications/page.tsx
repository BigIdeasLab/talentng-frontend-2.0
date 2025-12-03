"use client";

import { useProfile } from "@/hooks/useProfile";
import { TalentNotifications } from "@/components/talent/TalentNotifications";
import { EmployerNotifications } from "@/components/employer/EmployerNotifications";
import { AgencyNotifications } from "@/components/agency/AgencyNotifications";

export default function NotificationsPage() {
  const { userRoles } = useProfile();
  const role = userRoles?.[0] || "talent";

  switch (role) {
    case "employer":
      return <EmployerNotifications />;
    case "agency":
      return <AgencyNotifications />;
    case "talent":
    default:
      return <TalentNotifications />;
  }
}
