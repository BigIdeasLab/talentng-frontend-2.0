"use client";

import { useRequireRole } from "@/hooks/useRequireRole";
import { PageLoadingState } from "@/lib/page-utils";
import { OpportunityPreview } from "@/components/employer/opportunities/OpportunityPreview";

export default function OpportunityPreviewPage() {
  const hasAccess = useRequireRole(["recruiter"]);

  if (!hasAccess) {
    return <PageLoadingState message="Checking access..." />;
  }

  return <OpportunityPreview />;
}
