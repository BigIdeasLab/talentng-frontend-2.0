"use client";

import { useRequireRole } from "@/hooks/useRequireRole";
import { PageLoadingState } from "@/lib/page-utils";
import { ApplicantsView } from "@/components/employer/opportunities/ApplicantsView";
import { useParams } from "next/navigation";

export default function ApplicantsPage() {
  const params = useParams();
  const opportunityId = params.id as string;
  const hasAccess = useRequireRole(["recruiter"]);

  if (!hasAccess) {
    return <PageLoadingState message="Checking access..." />;
  }

  return <ApplicantsView opportunityId={opportunityId} />;
}
