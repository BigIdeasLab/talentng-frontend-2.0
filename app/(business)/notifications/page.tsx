"use client";

import { useProfile } from "@/hooks/useProfile";
import { TalentNotifications } from "@/components/talent/notification/TalentNotifications";
import { EmployerNotifications } from "@/components/employer/notification/EmployerNotifications";
import { MentorNotifications } from "@/components/mentor/notification/MentorNotifications";

export default function NotificationsPage() {
  const { userRoles } = useProfile();
  const role = userRoles?.[0] || "talent";

  switch (role) {
    case "employer":
      return <EmployerNotifications />;
    case "mentor":
      return <MentorNotifications />;
    case "talent":
    default:
      return <TalentNotifications />;
  }
}
