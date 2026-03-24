"use client";

import { useProfile } from "@/hooks/useProfile";
import { PageLoadingState } from "@/lib/page-utils";
// TODO: Create OpportunityDetails components
// import { OpportunityDetails as EmployerOpportunityDetails } from "@/components/employer/opportunities/OpportunityDetails";
// import { OpportunityDetails as TalentOpportunityDetails } from "@/components/talent/opportunities/OpportunityDetails";
import { useRequireRole } from "@/hooks/useRequireRole";
import { useParams, useSearchParams } from "next/navigation";
import { RoleColorProvider } from "@/lib/theme/RoleColorContext";

// Temporary placeholder component until OpportunityDetails is implemented
function OpportunityDetailsPlaceholder({
  opportunityId,
  applicationId,
  role,
}: {
  opportunityId: string;
  applicationId?: string;
  role: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          Opportunity Details
        </h1>
        <p className="text-gray-600 mb-2">Opportunity ID: {opportunityId}</p>
        {applicationId && (
          <p className="text-gray-600 mb-2">Application ID: {applicationId}</p>
        )}
        <p className="text-gray-600 mb-4">Role: {role}</p>
        <p className="text-sm text-gray-500">
          OpportunityDetails component needs to be implemented
        </p>
      </div>
    </div>
  );
}

export default function OpportunityPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const applicationId = searchParams.get("appId") || undefined;
  const { activeRole, userRoles, isLoading: profileLoading } = useProfile();

  // Block mentors from accessing this page
  const hasAccess = useRequireRole(["talent", "recruiter"]);

  if (profileLoading || !hasAccess) {
    return <PageLoadingState message="Loading opportunity details..." />;
  }

  const role = activeRole || userRoles?.[0] || "talent";

  return (
    <RoleColorProvider role={role}>
      <OpportunityDetailsPlaceholder
        opportunityId={id}
        applicationId={applicationId}
        role={role}
      />
    </RoleColorProvider>
  );
}
