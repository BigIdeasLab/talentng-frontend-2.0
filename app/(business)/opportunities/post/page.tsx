"use client";

import { useRequireRole } from "@/hooks/useRequireRole";
import { PageLoadingState } from "@/lib/page-utils";
import { PostOpportunityForm } from "@/components/employer/opportunities/PostOpportunityForm";

export default function PostOpportunityPage() {
  const hasAccess = useRequireRole(["recruiter"]);

  if (!hasAccess) {
    return <PageLoadingState message="Checking access..." />;
  }

  return <PostOpportunityForm />;
}
