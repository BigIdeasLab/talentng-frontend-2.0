"use client";

import { PageLoadingState } from "@/lib/page-utils";
import { useRequireRole } from "@/hooks/useRequireRole";
import { DiscoverTalentClient } from "./discover-talent-client";

export default function DiscoverTalentPage() {
  const hasAccess = useRequireRole(["recruiter"]);

  if (!hasAccess) return <PageLoadingState message="Checking access..." />;

  return (
    <DiscoverTalentClient
      initialTalents={[]}
      initialError={null}
      initialPagination={null}
    />
  );
}
