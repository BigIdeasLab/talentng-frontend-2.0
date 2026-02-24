"use client";

import { createRoleBasedPage } from "@/lib/page-utils";
import { TalentMyApplications } from "@/components/talent/applications";
import { RecruiterMyApplications } from "@/components/employer/applications/RecruiterMyApplications";
import { MentorMyApplications } from "@/components/mentor/applications/MentorMyApplications";

export default createRoleBasedPage({
  talent: <TalentMyApplications />,
  employer: <RecruiterMyApplications />,
  mentor: <MentorMyApplications />,
});
