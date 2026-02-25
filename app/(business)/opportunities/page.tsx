"use client";

import { useSwitchRoleParam, PageLoadingState } from "@/lib/page-utils";
import { useProfile } from "@/hooks/useProfile";
import { useRequireRole } from "@/hooks/useRequireRole";
import { EmployerOpportunities } from "@/components/employer/opportunities/EmployerOpportunities";
import { OpportunitiesClient } from "./opportunities-client";

export default function OpportunitiesPage() {
  // Handle switchRole query parameter (from add-role onboarding)
  useSwitchRoleParam();

  // Block mentors from accessing this page
  const hasAccess = useRequireRole(["talent", "recruiter"]);

  const { activeRole, userRoles, isLoading: profileLoading } = useProfile();

  if (profileLoading || !hasAccess) {
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
