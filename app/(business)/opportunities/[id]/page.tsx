"use client";

import { useProfile } from "@/hooks/useProfile";
import { PageLoadingState } from "@/lib/page-utils";
import { OpportunityDetails as EmployerOpportunityDetails } from "@/components/employer/opportunities/OpportunityDetails";
import { OpportunityDetails as TalentOpportunityDetails } from "@/components/talent/opportunities/OpportunityDetails";
import { useParams, useSearchParams } from "next/navigation";

export default function OpportunityPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const applicationId = searchParams.get("appId") || undefined;
  const { activeRole, userRoles, isLoading: profileLoading } = useProfile();

  if (profileLoading) {
    return <PageLoadingState message="Loading opportunity details..." />;
  }

  const role = activeRole || userRoles?.[0] || "talent";

  switch (role) {
    case "recruiter":
      return <EmployerOpportunityDetails opportunityId={id} />;
    case "talent":
    case "mentor":
    default:
      return <TalentOpportunityDetails opportunityId={id} applicationId={applicationId} />;
  }
}
