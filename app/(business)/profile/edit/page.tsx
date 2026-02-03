"use client";

import { createRoleBasedPage } from "@/lib/page-utils";
import { TalentEditProfile } from "@/components/talent/profile/components/edit/TalentEditProfile";
import { EmployerEditProfile } from "@/components/employer/profile/components/EmployerEditProfile";
import { MentorEditProfile } from "@/components/mentor/profile/components/edit/MentorEditProfile";

export default createRoleBasedPage({
  talent: <TalentEditProfile />,
  employer: <EmployerEditProfile />,
  mentor: <MentorEditProfile />,
});
