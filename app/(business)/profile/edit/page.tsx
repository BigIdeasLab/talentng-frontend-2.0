"use client";

import { createRoleBasedPage } from "@/lib/page-utils";
import { TalentEditProfile } from "@/components/talent/profile/components/edit/TalentEditProfile";
import { EmployerEditProfile } from "@/components/employer/profile/components/EmployerEditProfile";

export default createRoleBasedPage({
  talent: <TalentEditProfile />,
  employer: <EmployerEditProfile />,
  mentor: <TalentEditProfile />, // TODO: Create MentorEditProfile component
});
