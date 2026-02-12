"use client";

import { useRequireRole } from "@/hooks/useRequireRole";
import { PageLoadingState } from "@/lib/page-utils";

export default function DebugPage() {
  const hasAccess = useRequireRole(["talent", "recruiter", "mentor"]);

  if (!hasAccess) {
    return <PageLoadingState message="Checking access..." />;
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold">Debug Page</h1>
      <p className="mt-4 text-gray-600">This is a placeholder debug page.</p>
    </div>
  );
}
