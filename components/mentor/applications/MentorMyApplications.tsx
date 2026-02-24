"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageLoadingState } from "@/lib/page-utils";

/**
 * Mentor redirect for /my-applications
 * Mentors view received mentorship requests at /applications instead
 */
export function MentorMyApplications() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/applications");
  }, [router]);

  return <PageLoadingState message="Redirecting to Mentorship Requests..." />;
}
