"use client";

import { useProfile } from "@/hooks/useProfile";
import { PageLoadingState } from "@/lib/page-utils";
import { OpportunityDetails as EmployerOpportunityDetails } from "@/components/employer/opportunities/OpportunityDetails";
import { OpportunityDetails as TalentOpportunityDetails } from "@/components/talent/opportunities/OpportunityDetails";
import { useRequireRole } from "@/hooks/useRequireRole";
import { useParams, useSearchParams } from "next/navigation";
import { RoleColorProvider } from "@/lib/theme/RoleColorContext";

export default function OpportunityPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const applicationId = searchParams.get("appId") || undefined;
  const appliedAsParam = searchParams.get("appliedAs");
  const initialAppliedAs = appliedAsParam ? appliedAsParam.split(",") : undefined;
  const initialSaved = searchParams.get("saved") === "1";
  const { activeRole, userRoles, isLoading: profileLoading } = useProfile();

  // Block mentors from accessing this page
  const hasAccess = useRequireRole(["talent", "recruiter"]);

  if (profileLoading || !hasAccess) {
    return <PageLoadingState message="Loading opportunity details..." />;
  }

  const role = activeRole || userRoles?.[0] || "talent";

  return (
    <RoleColorProvider role={role}>
      {role === "recruiter" ? (
        <EmployerOpportunityDetails opportunityId={id} />
      ) : (
        <TalentOpportunityDetails
          opportunityId={id}
          applicationId={applicationId}
          initialAppliedAs={initialAppliedAs}
          initialSaved={initialSaved}
        />
      )}
    </RoleColorProvider>
  );
}
