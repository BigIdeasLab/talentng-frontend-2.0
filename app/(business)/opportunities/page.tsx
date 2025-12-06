"use client";

import { useProfile } from "@/hooks/useProfile";
import { EmployerOpportunities } from "@/components/employer/opportunities/EmployerOpportunities";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";

export default function OpportunitiesPage() {
  const { activeRole, isLoading } = useProfile();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" className="text-blue-600" />
      </div>
    );
  }

  // // Only recruiters/employers can access this page
  // if (activeRole !== "recruiter") {
  //   return (
  //     <div className="flex h-screen items-center justify-center bg-gray-50">
  //       <div className="text-center">
  //         <h1 className="text-2xl font-semibold mb-2">Access Denied</h1>
  //         <p className="text-gray-600 mb-4">
  //           This page is only available for recruiters/employers.
  //         </p>
  //         <Link
  //           href="/dashboard"
  //           className="text-brand-primary hover:underline"
  //         >
  //           Go to Dashboard
  //         </Link>
  //       </div>
  //     </div>
  //   );
  // }

  return <EmployerOpportunities />;
}
