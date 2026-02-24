"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageLoadingState } from "@/lib/page-utils";

/**
 * Recruiter redirect for /my-applications
 * Recruiters view their applicants at /applicants instead
 */
export function RecruiterMyApplications() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/applicants");
  }, [router]);

  return <PageLoadingState message="Redirecting to Applicants..." />;
}
