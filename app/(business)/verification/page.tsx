"use client";

import { VerificationDashboard } from "@/components/verification/VerificationDashboard";
import { useRequireRole } from "@/hooks/useRequireRole";
import { PageLoadingState } from "@/lib/page-utils";

export default function VerificationPage() {
  // Restrict access to recruiters/employers only
  const hasAccess = useRequireRole(["recruiter", "employer"]);

  if (!hasAccess) {
    return <PageLoadingState message="Checking access..." />;
  }

  return (
    <div className="h-screen bg-white overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto px-3 md:px-8 py-5 md:py-6">
        {/* Header Section */}
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="font-inter-tight text-[21px] font-medium text-black leading-5">
            Business Verification
          </h1>
          <p className="font-inter-tight text-[13px] font-normal text-black/30">
            Verify your business to build trust with talent and get a verified
            badge
          </p>
        </div>

        <VerificationDashboard />
      </div>
    </div>
  );
}
