"use client";

import { createRoleBasedPage } from "@/lib/page-utils";
import { TalentSettings } from "@/components/talent/settings/TalentSettings";
import { EmployerSettings } from "@/components/employer/settings/EmployerSettings";
import { MentorSettings } from "@/components/mentor/settings/MentorSettings";

export default createRoleBasedPage({
  talent: <TalentSettings />,
  employer: <EmployerSettings />,
  mentor: <MentorSettings />,
});
