"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Briefcase, Share } from "lucide-react";
import { getOpportunityById } from "@/lib/api";
import { Opportunity } from "@/lib/types/opportunity";
import ApplicationModal from "@/components/ApplicationModal";

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const [jobData, setJobData] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applicationModalOpen, setApplicationModalOpen] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getOpportunityById(id);
        setJobData(data);
      } catch (err) {
        setError("Failed to fetch job details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return `Posted ${date.toLocaleDateString("en-US", options)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-4">Loading job details...</div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-4 text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!jobData) {
    return <div className="min-h-screen bg-white p-4">Job not found.</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col px-4 sm:px-8 lg:px-10 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Job Card */}
          <div className="flex-none">
            <div className="p-8 border border-gray-200 rounded-[44px] bg-white max-w-md">
              <div className="space-y-4">
                {/* Company Info */}
                <div className="flex items-center gap-4.5">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <img
                        src={jobData.logo}
                        alt={jobData.company}
                        className="w-8 h-8 rounded object-cover"
                      />
                      <span className="text-base font-medium text-black font-geist">
                        {jobData.company}
                      </span>
                    </div>
                    <div className="w-px h-6 bg-gray-300"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-500 font-geist">
                    {formatDate(jobData.createdAt)}
                  </span>
                </div>

                {/* Job Title */}
                <h1 className="text-[32px] font-semibold text-black font-geist leading-[44.8px]">
                  {jobData.title}
                </h1>

                {/* Location */}
                <p className="text-base text-black font-geist">
                  {jobData.type}, {jobData.employmentType}, {jobData.location},
                </p>

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 px-3.5 py-3.5 border border-gray-200 bg-white rounded-full">
                    <span className="text-sm font-medium text-black font-geist">
                      Share with friends
                    </span>
                    <Share className="w-4 h-4 text-gray-900" />
                  </button>
                  <button
                    onClick={() => setApplicationModalOpen(true)}
                    className="flex items-center gap-1 px-3.5 py-3.5 bg-black rounded-full hover:bg-gray-900 transition-colors"
                  >
                    <span className="text-sm font-medium text-white font-geist">
                      Apply
                    </span>
                    <Briefcase className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* Budget */}
                <div className="pt-6">
                  <div className="mb-3">
                    <span className="text-sm text-black font-geist">
                      Budget
                    </span>
                  </div>
                  <div className="text-xl font-bold text-black font-geist">
                    {jobData.compensation}
                  </div>
                </div>

                {/* Tags */}
                <div className="pt-6">
                  <div className="mb-3">
                    <span className="text-sm text-black font-geist">Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {jobData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-2 bg-gray-100 rounded-2xl text-sm text-black font-geist"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="flex-1 max-w-[649px] space-y-10">
            <h2 className="text-2xl font-semibold text-black font-geist">
              Description
            </h2>

            {/* Job Description */}
            <div className="space-y-4">
              <h3 className="text-xl text-black font-geist">
                Job Description:
              </h3>
              <div className="text-base text-black font-geist leading-[25.6px] whitespace-pre-line">
                {jobData.description}
              </div>
            </div>

            {/* Key Responsibilities */}
            <div className="space-y-4">
              <h3 className="text-xl text-black font-geist">
                Key Responsibilities:
              </h3>
              <ul className="list-disc pl-5 text-base text-black font-geist leading-[25.6px] whitespace-pre-line">
                {jobData.keyResponsibilities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Job Qualifications */}
            <div className="space-y-4">
              <h3 className="text-xl text-black font-geist">
                Job Qualifications:
              </h3>
              <ul className="list-disc pl-5 text-base text-black font-geist leading-[25.6px] whitespace-pre-line">
                {jobData.requirements.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {jobData && (
        <ApplicationModal
          open={applicationModalOpen}
          onClose={() => setApplicationModalOpen(false)}
          opportunity={jobData}
        />
      )}
    </div>
  );
}
