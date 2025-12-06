"use client";

import { ApplicantsView } from "@/components/employer/opportunities/ApplicantsView";
import { useParams } from "next/navigation";

export default function ApplicantsPage() {
  const params = useParams();
  const opportunityId = params.id as string;

  return <ApplicantsView opportunityId={opportunityId} />;
}
