"use client";

import { createRoleBasedPage } from "@/lib/page-utils";
import { TalentNotifications } from "@/components/talent/notification/TalentNotifications";
import { EmployerNotifications } from "@/components/employer/notification/EmployerNotifications";
import { MentorNotifications } from "@/components/mentor/notification/MentorNotifications";

export default createRoleBasedPage({
  talent: <TalentNotifications />,
  employer: <EmployerNotifications />,
  mentor: <MentorNotifications />,
});
