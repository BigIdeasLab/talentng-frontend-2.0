"use client";

import { Suspense } from "react";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";
import { EmployerOpportunities } from "@/components/employer/opportunities/EmployerOpportunities";
import { TalentOpportunities } from "@/components/talent/opportunities/TalentOpportunities";
import { Spinner } from "@/components/ui/spinner";

function OpportunitiesContent() {
  const searchParams = useSearchParams();
  const { userRoles, activeRole, setActiveRole, isLoading } = useProfile();

  // Handle switchRole query parameter
  useEffect(() => {
    const switchRole = searchParams.get("switchRole");
    if (switchRole && userRoles.includes(switchRole)) {
      setActiveRole(switchRole);
    }
  }, [searchParams, userRoles, setActiveRole]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" className="text-blue-600" />
      </div>
    );
  }

  const role = activeRole || userRoles?.[0] || "talent";

  switch (role) {
    case "recruiter":
      return <EmployerOpportunities />;
    case "talent":
      return <TalentOpportunities />;
    case "mentor":
    default:
      return <TalentOpportunities />;
  }
}

export default function OpportunitiesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OpportunitiesContent />
    </Suspense>
  );
}
