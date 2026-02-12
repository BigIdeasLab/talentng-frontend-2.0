"use client";

import Link from "next/link";
import { useRequireRole } from "@/hooks/useRequireRole";
import { PageLoadingState } from "@/lib/page-utils";

export default function SupportPage() {
  const hasAccess = useRequireRole(["talent", "recruiter", "mentor"]);

  if (!hasAccess) {
    return <PageLoadingState message="Checking access..." />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Coming Soon</h1>
        <p className="text-xl text-gray-600 mb-6">Support & help center</p>
        <Link
          href="/profile"
          className="text-blue-500 hover:text-blue-700 underline"
        >
          Back to Profile
        </Link>
      </div>
    </div>
  );
}
