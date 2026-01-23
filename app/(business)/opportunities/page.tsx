"use client";

import { useEffect, useState } from "react";
import { useSwitchRoleParam, PageLoadingState } from "@/lib/page-utils";
import { useProfile } from "@/hooks/useProfile";
import { EmployerOpportunities } from "@/components/employer/opportunities/EmployerOpportunities";
import { OpportunitiesClient } from "./opportunities-client";
import { getOpportunitiesData } from "./server-data";
import type { OpportunityData } from "./server-data";

interface PaginationData {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface OpportunitiesState {
  opportunities: OpportunityData[];
  pagination: PaginationData | null;
  error: string | null;
}

export default function OpportunitiesPage() {
  // Handle switchRole query parameter (from add-role onboarding)
  useSwitchRoleParam();

  const { activeRole, userRoles, isLoading: profileLoading } = useProfile();
  const [data, setData] = useState<OpportunitiesState>({
    opportunities: [],
    pagination: null,
    error: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch opportunities data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          opportunities: fetchedOpportunities,
          pagination: fetchedPagination,
          error: fetchError,
        } = await getOpportunitiesData();

        setData({
          opportunities: fetchedOpportunities,
          pagination: fetchedPagination,
          error: fetchError,
        });
      } catch (err: any) {
        setData({
          opportunities: [],
          pagination: null,
          error: err.message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (profileLoading || isLoading) {
    return <PageLoadingState message="Loading opportunities..." />;
  }

  const role = activeRole || userRoles?.[0] || "talent";

  switch (role) {
    case "recruiter":
      return <EmployerOpportunities />;
    case "talent":
    case "mentor":
    default:
      return (
        <OpportunitiesClient
          initialOpportunities={data.opportunities}
          initialError={data.error}
          initialPagination={data.pagination}
        />
      );
  }
}
