"use client";

import { useRequireRole } from "@/hooks/useRequireRole";
import { PageLoadingState } from "@/lib/page-utils";
import { EditOpportunityForm } from "@/components/employer/opportunities/EditOpportunityForm";
import { useParams } from "next/navigation";

export default function EditOpportunityPage() {
  const params = useParams();
  const id = params.id as string;
  const hasAccess = useRequireRole(["recruiter"]);

  if (!hasAccess) {
    return <PageLoadingState message="Checking access..." />;
  }

  return <EditOpportunityForm opportunityId={id} />;
}
