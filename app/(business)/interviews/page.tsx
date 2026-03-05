"use client";

import { RecruiterUpcoming } from "@/components/employer/upcoming/RecruiterUpcoming";
import { LoadingScreen } from "@/components/layouts/LoadingScreen";
import { useRequireRole } from "@/hooks/useRequireRole";

export default function InterviewsPage() {
  const hasAccess = useRequireRole(["recruiter"]);

  if (!hasAccess) {
    return <LoadingScreen />;
  }

  return <RecruiterUpcoming />;
}
