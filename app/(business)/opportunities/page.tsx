"use client";

import { useSwitchRoleParam, PageLoadingState } from "@/lib/page-utils";
import { useProfile } from "@/hooks/useProfile";
import { EmployerOpportunities } from "@/components/employer/opportunities/EmployerOpportunities";
import { OpportunitiesClient } from "./opportunities-client";

export default function OpportunitiesPage() {
  // Handle switchRole query parameter (from add-role onboarding)
  useSwitchRoleParam();

  const { activeRole, userRoles, isLoading: profileLoading } = useProfile();

  if (profileLoading) {
    return <PageLoadingState message="Loading opportunities..." />;
  }

  const role = activeRole || userRoles?.[0] || "talent";

  switch (role) {
    case "recruiter":
      return <EmployerOpportunities />;
    case "talent":
    default:
      return (
        <OpportunitiesClient
          initialOpportunities={[]}
          initialError={null}
          initialPagination={null}
        />
      );
  }
}
