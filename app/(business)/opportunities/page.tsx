"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";
import { EmployerOpportunities } from "@/components/employer/opportunities/EmployerOpportunities";
import { OpportunitiesClient } from "./opportunities-client";
import { getOpportunitiesData } from "./server-data";
import type { OpportunityData } from "./server-data";
import { Spinner } from "@/components/ui/spinner";

interface PaginationData {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

function OpportunitiesContent() {
  const searchParams = useSearchParams();
  const {
    userRoles,
    activeRole,
    setActiveRole,
    isLoading: profileLoading,
  } = useProfile();
  const [opportunities, setOpportunities] = useState<OpportunityData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  // Handle switchRole query parameter
  useEffect(() => {
    const switchRole = searchParams.get("switchRole");
    if (switchRole && userRoles.includes(switchRole)) {
      setActiveRole(switchRole);
    }
  }, [searchParams, userRoles, setActiveRole]);

  // Fetch opportunities data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          opportunities: fetchedOpportunities,
          pagination: fetchedPagination,
          error: fetchError,
        } = await getOpportunitiesData();
        setOpportunities(fetchedOpportunities);
        setPagination(fetchedPagination);
        setError(fetchError);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (profileLoading) {
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
      return (
        <OpportunitiesClient
          initialOpportunities={opportunities}
          initialError={error}
          initialPagination={pagination}
        />
      );
    case "mentor":
    default:
      return (
        <OpportunitiesClient
          initialOpportunities={opportunities}
          initialError={error}
          initialPagination={pagination}
        />
      );
  }
}

export default function OpportunitiesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OpportunitiesContent />
    </Suspense>
  );
}
