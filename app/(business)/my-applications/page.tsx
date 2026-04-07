"use client";

import { useRequireRole } from "@/hooks/useRequireRole";
import { PageLoadingState } from "@/lib/page-utils";
import { TalentMyApplications } from "@/components/talent/applications";

export default function MyApplicationsPage() {
  const hasAccess = useRequireRole(["talent"]);

  if (!hasAccess) {
    return <PageLoadingState message="Checking access..." />;
  }

  return <TalentMyApplications />;
}
