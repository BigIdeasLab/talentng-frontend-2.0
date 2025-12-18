"use client";

import { Spinner } from "@/components/ui/spinner";
import { useProfile } from "@/hooks/useProfile";
import { TalentEditProfile } from "@/components/talent/profile/components/edit/TalentEditProfile";
import { EmployerEditProfile } from "@/components/employer/profile/components/EmployerEditProfile";

export default function EditProfilePage() {
  const { activeRole } = useProfile();
  const role = activeRole || "talent";

  switch (role) {
    case "recruiter":
      return <EmployerEditProfile />;
    case "mentor":
      // TODO: Create MentorEditProfile component
      return <TalentEditProfile />;
    case "talent":
    default:
      return <TalentEditProfile />;
  }
}
