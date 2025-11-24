'use client';
import React, { useState, useEffect } from "react";
import { JobCard } from "@/components/opportunities/JobCard";
import { getOpportunities, getApplications } from "@/lib/api";
import { Opportunity } from "@/lib/types/opportunity";
import ApplicationModal from "@/components/ApplicationModal";
import { JobCardSkeleton } from "./JobCardSkeleton";

interface OpportunitiesListProps {
  limit?: number;
}

export function OpportunitiesList({ limit }: OpportunitiesListProps) {
  const [jobListings, setJobListings] = useState<Opportunity[]>([]);
  const [appliedOpportunityIds, setAppliedOpportunityIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applicationModalOpen, setApplicationModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

  useEffect(() => {
    const fetchOpportunitiesAndApplications = async () => {
      setLoading(true);
      setError(null);
      try {
        const [opportunities, applications] = await Promise.all([
          getOpportunities({}),
          getApplications(),
        ]);
        setJobListings(limit ? opportunities.slice(0, limit) : opportunities);
        setAppliedOpportunityIds(new Set(applications.map(app => app.opportunityId)));
      } catch (err) {
        setError("Failed to fetch opportunities.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunitiesAndApplications();
  }, [limit]);

  const handleShare = (jobId: string) => {
    // TODO: Implement share functionality
    console.log("Sharing job:", jobId);
  };

  const handleApply = (jobId: string) => {
    const opportunity = jobListings.find(job => job.id === jobId);
    if (opportunity) {
      setSelectedOpportunity(opportunity);
      setApplicationModalOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9">
        {[...Array(limit || 3)].map((_, i) => (
          <JobCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9">
        {jobListings.map((job) => (
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
            hasApplied={appliedOpportunityIds.has(job.id)}
          />
        ))}
      </div>

      {selectedOpportunity && (
        <ApplicationModal
          open={applicationModalOpen}
          onClose={() => {
            setApplicationModalOpen(false);
            setSelectedOpportunity(null);
          }}
          opportunity={selectedOpportunity}
        />
      )}
    </>
  );
}