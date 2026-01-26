"use client";

import { useEffect, useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { PageLoadingState } from "@/lib/page-utils";
import { useRequireRole } from "@/hooks/useRequireRole";
import { DiscoverTalentClient } from "./discover-talent-client";
import { getDiscoverTalentData } from "./server-data";
import type { TalentData } from "./server-data";

export default function DiscoverTalentPage() {
  const { userRoles } = useProfile();
  const role = userRoles?.[0] || "talent";
  const hasAccess = useRequireRole(["recruiter"]);
  const [talents, setTalents] = useState<TalentData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          talents: fetchedTalents,
          error: fetchError,
          pagination: fetchPagination,
        } = await getDiscoverTalentData();
        setTalents(fetchedTalents);
        setError(fetchError);
        setPagination(fetchPagination);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading || !hasAccess)
    return <PageLoadingState message="Loading talents..." />;

  return (
    <DiscoverTalentClient
      initialTalents={talents}
      initialError={error}
      initialPagination={pagination}
    />
  );
}
