
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { JobCard, JobCardSkeleton } from "@/components/opportunities";
import { Opportunity } from "@/lib/types/opportunity";

interface OpportunitiesListProps {
  limit?: number;
  initialOpportunities: Opportunity[];
  isLoading?: boolean;
}

export function OpportunitiesList({ limit, initialOpportunities, isLoading }: OpportunitiesListProps) {
  const opportunities = limit ? initialOpportunities.slice(0, limit) : initialOpportunities;
  const router = useRouter();

  const handleShare = (jobId: string) => {
    // TODO: Implement share functionality
    console.log("Sharing job:", jobId);
  };

  const handleApply = (jobId: string) => {
    router.push(`/talent/opportunities/${jobId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9">
      {isLoading ? (
        Array.from({ length: limit || 6 }).map((_, index) => (
          <JobCardSkeleton key={index} />
        ))
      ) : (
        opportunities.map((job) => (
          <JobCard
            key={job.id}
            id={job.id}
            company={job.company}
            logo={job.logo}
            title={job.title}
            location={job.location}
            type={job.type}
            talent={job.talent}
            employmentType={job.employmentType}
            onShare={handleShare}
            onApply={handleApply}
            hasApplied={false} // On landing page, we assume user has not applied
            basePath="/opportunities"
          />
        ))
      )}
    </div>
  );
}
