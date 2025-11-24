"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Share2, Briefcase } from "lucide-react";
import { getOpportunityById, getOpportunities } from "@/lib/api";
import { Opportunity } from "@/lib/types/opportunity";
import { JobCard } from "@/components/opportunities/JobCard";
import { CallToAction } from "@/components/landing-page";
import Link from "next/link";
import LandingPageLayout from "@/components/layouts/LandingPageLayout";
import OpportunityDetailSkeleton from "@/components/opportunities/OpportunityDetailSkeleton";

export default function OpportunityDetail() {
  const params = useParams();
  const router = useRouter();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [similarOpportunities, setSimilarOpportunities] = useState<
    Opportunity[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = params.id as string;
        const [opportunityData, allOpportunities] = await Promise.all([
          getOpportunityById(id),
          getOpportunities({}),
        ]);
        setOpportunity(opportunityData);

        // Get similar opportunities (exclude current one, limit to 3)
        const similar = allOpportunities
          .filter((opp) => opp.id !== id)
          .slice(0, 3);
        setSimilarOpportunities(similar);
      } catch (error) {
        console.error("Error fetching opportunity:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleShare = () => {
    console.log("Sharing opportunity:", opportunity?.id);
  };

  const handleApply = (jobId: string) => {
    router.push(`/talent/opportunities/${jobId}`);
  };

  if (loading) {
    return (
      <LandingPageLayout>
        <OpportunityDetailSkeleton />
      </LandingPageLayout>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Opportunity not found</div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <LandingPageLayout>
      <div className="max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-12">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-black hover:text-gray-700 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
          <span className="font-geist text-base font-medium">Back</span>
        </button>

        {/* Job Details Section */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          {/* Left Column - Job Info */}
          <div className="flex-shrink-0 lg:w-[400px] space-y-6">
            <div className="p-8 border border-gray-200 rounded-[44px] space-y-6">
              {/* Company Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <img
                        src={opportunity.logo}
                        alt={opportunity.company}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="font-geist text-base text-black">
                        {opportunity.company}
                      </span>
                    </div>
                    <div className="w-px h-6 bg-gray-300" />
                  </div>
                  <span className="font-geist text-sm text-gray-500">
                    Posted {formatDate(opportunity.createdAt)}
                  </span>
                </div>

                <h1 className="font-geist text-[32px] font-bold text-black leading-[140%]">
                  {opportunity.title}
                </h1>
                <p className="font-geist text-base text-black">
                  {opportunity.type}, {opportunity.employmentType},{" "}
                  {opportunity.location}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1 px-3.5 py-3.5 border border-gray-200 rounded-3xl bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="font-geist text-sm font-medium text-black">
                    Share with friends
                  </span>
                  <Share2 className="w-4 h-4 text-black" />
                </button>
                <Link
                  href={`/talent/opportunities/${params.id}`}
                  className="flex items-center gap-1 px-3.5 py-3.5 rounded-3xl bg-black hover:bg-gray-900 transition-colors"
                >
                  <span className="font-geist text-sm font-medium text-white">
                    Apply
                  </span>
                  <Briefcase className="w-4 h-4 text-white" />
                </Link>
              </div>

              {/* Budget */}
              {opportunity.compensation && (
                <div className="space-y-3">
                  <div className="font-geist text-sm text-black">Budget</div>
                  <div className="font-geist text-xl font-bold text-black">
                    {opportunity.compensation}
                  </div>
                </div>
              )}

              {/* Tags */}
              {opportunity.tags && opportunity.tags.length > 0 && (
                <div className="space-y-3">
                  <div className="font-geist text-sm text-black">Tags</div>
                  <div className="flex flex-wrap gap-2.5">
                    {opportunity.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-2 bg-gray-100 rounded-2xl font-geist text-sm text-black"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Description */}
          <div className="flex-1 space-y-10">
            <h2 className="font-geist text-2xl font-bold text-black">
              Description
            </h2>

            {/* Job Description */}
            {opportunity.description && (
              <div className="space-y-4">
                <h3 className="font-geist text-xl text-black">
                  Job Description:
                </h3>
                <p className="font-geist text-base text-black leading-[160%]">
                  {opportunity.description}
                </p>
              </div>
            )}

            {/* Key Responsibilities */}
            {opportunity.keyResponsibilities &&
              opportunity.keyResponsibilities.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-geist text-xl text-black">
                    Key Responsibilities:
                  </h3>
                  <div className="font-geist text-base text-black leading-[160%]">
                    {opportunity.keyResponsibilities.map(
                      (responsibility, index) => (
                        <div key={index}>• {responsibility}</div>
                      ),
                    )}
                  </div>
                </div>
              )}

            {/* Job Qualifications */}
            {opportunity.requirements &&
              opportunity.requirements.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-geist text-xl text-black">
                    Job Qualifications:
                  </h3>
                  <div className="font-geist text-base text-black leading-[160%]">
                    {opportunity.requirements.map((requirement, index) => (
                      <div key={index}>• {requirement}</div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* Similar Opportunities */}
        {similarOpportunities.length > 0 && (
          <div className="space-y-6">
            <div className="space-y-2.5">
              <h2 className="font-geist text-2xl font-medium text-[#14171F]">
                Similar Opportunities
              </h2>
              <div className="flex items-center justify-between">
                <p className="font-geist text-base text-gray-500">
                  Standout talents making waves around the web
                </p>
                <button
                  onClick={() => router.push("/talent/opportunities")}
                  className="font-geist text-base font-medium text-[#373F51] underline hover:text-gray-800 transition-colors"
                >
                  View more
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarOpportunities.map((job) => (
                <JobCard
                  key={job.id}
                  id={job.id}
                  company={job.company}
                  logo={job.logo}
                  title={job.title}
                  location={job.location}
                  type={job.type}
                  employmentType={job.employmentType}
                  talent={job.talent}
                  onShare={handleShare}
                  onApply={handleApply}
                  basePath="/opportunities"
                />
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <CallToAction />
      </div>
    </LandingPageLayout>
  );
}
