"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { useRequireRole } from "@/hooks/useRequireRole";
import { PageLoadingState } from "@/lib/page-utils";
import { useApplications } from "@/hooks/useApplications";
import {
  mapApplicationsToUI,
  type MappedApplicant,
} from "@/lib/mappers/application";

// Map status to UI display
const statusDisplayMap = {
  applied: { label: "In Review", bg: "#DBE9FE", text: "#5C30FF" },
  shortlisted: { label: "Shortlisted", bg: "#FEF3C7", text: "#92400D" },
  rejected: { label: "Rejected", bg: "#FEE2E1", text: "#991B1B" },
  hired: { label: "Hired", bg: "#D1FAE5", text: "#076046" },
};

// Map interview status to UI display
const interviewStatusDisplayMap = {
  scheduled: { label: "Interview Scheduled", bg: "#EDE9FE", text: "#5C30FF" },
  rescheduled: {
    label: "Interview Rescheduled",
    bg: "#FEF3C7",
    text: "#92400D",
  },
};

export default function ApplicantsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [_sortBy, _setSortBy] = useState("Newest");
  const [applicants, setApplicants] = useState<MappedApplicant[]>([]);
  const { getAll, isLoading, error } = useApplications();
  const hasAccess = useRequireRole(["recruiter"]);

  useEffect(() => {
    if (hasAccess) {
      getAll().then((data) => {
        setApplicants(mapApplicationsToUI(data));
      });
    }
  }, [hasAccess, getAll]);

  if (!hasAccess) {
    return <PageLoadingState message="Checking access..." />;
  }

  if (isLoading) {
    return <PageLoadingState message="Loading applicants..." />;
  }

  if (error) {
    return (
      <div className="h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-medium text-black mb-2">
            Failed to load applicants
          </h2>
          <p className="text-sm text-[#525866] mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#5C30FF] text-white rounded-lg text-sm hover:bg-[#4a24cc] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const hiredCount = applicants.filter(
    (applicant) => applicant.status === "hired",
  ).length;

  return (
    <div className="h-screen bg-white overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {/* Header Section */}
        <div className="flex flex-col gap-[19px] mb-[24px]">
          {/* Title and Hired Talents */}
          <div className="flex items-center justify-between">
            <h1 className="font-inter-tight text-[21px] font-medium text-black leading-[18px]">
              Applicants
            </h1>
            <Link
              href="/applicants/hired-talents"
              className="flex items-center gap-[5px] px-[14px] py-[7px] rounded-[8px] border border-[#E1E4EA] hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.3327 14V12.6667C11.3327 11.9594 11.0517 11.2811 10.5516 10.781C10.0515 10.281 9.37326 10 8.66602 10H3.33268C2.62544 10 1.94716 10.281 1.44706 10.781C0.946967 11.2811 0.666016 11.9594 0.666016 12.6667V14"
                  stroke="#525866"
                  strokeWidth="1.24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.00065 7.33333C7.47341 7.33333 8.66732 6.13943 8.66732 4.66667C8.66732 3.19391 7.47341 2 6.00065 2C4.52789 2 3.33398 3.19391 3.33398 4.66667C3.33398 6.13943 4.52789 7.33333 6.00065 7.33333Z"
                  stroke="#525866"
                  strokeWidth="1.24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.666 2.08691C11.2396 2.23378 11.748 2.56738 12.1111 3.03512C12.4742 3.50286 12.6712 4.07813 12.6712 4.67025C12.6712 5.26236 12.4742 5.83763 12.1111 6.30537C11.748 6.77311 11.2396 7.10671 10.666 7.25358"
                  stroke="#525866"
                  strokeWidth="1.24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-inter-tight text-[13px] font-normal text-[#525866] leading-normal">
                Hired Talents ({hiredCount})
              </span>
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-[8px] mb-[20px]">
          {/* Search Container */}
          <div className="flex-1 max-w-[585px] flex items-center gap-[6px] px-[12px] py-[7px] rounded-[8px] border border-[#E1E4EA]">
            <svg
              width="16"
              height="16"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.75 12.75L15.75 15.75"
                stroke="#B2B2B2"
                strokeWidth="1.125"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25Z"
                stroke="#B2B2B2"
                strokeWidth="1.125"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Search name or username"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 font-inter-tight text-[13px] font-normal text-black placeholder:text-black/30 outline-none bg-transparent capitalize"
            />
          </div>

          {/* Filter Button */}
          <button className="flex items-center gap-[5px] px-[14px] py-[7px] rounded-[8px] bg-[#F5F5F5] hover:bg-[#e8e8e8] transition-colors flex-shrink-0">
            <svg
              width="16"
              height="16"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.25 5.25H4.5"
                stroke="black"
                strokeWidth="1.125"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2.25 12.75H6.75"
                stroke="black"
                strokeWidth="1.125"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.5 12.75H15.75"
                stroke="black"
                strokeWidth="1.125"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.25 5.25H15.75"
                stroke="black"
                strokeWidth="1.125"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4.5 5.25C4.5 4.55109 4.5 4.20164 4.61418 3.92597C4.76642 3.55844 5.05844 3.26642 5.42597 3.11418C5.70164 3 6.05109 3 6.75 3C7.44891 3 7.79835 3 8.07405 3.11418C8.44155 3.26642 8.7336 3.55844 8.88585 3.92597C9 4.20164 9 4.55109 9 5.25C9 5.94891 9 6.29837 8.88585 6.57403C8.7336 6.94157 8.44155 7.23358 8.07405 7.38582C7.79835 7.5 7.44891 7.5 6.75 7.5C6.05109 7.5 5.70164 7.5 5.42597 7.38582C5.05844 7.23358 4.76642 6.94157 4.61418 6.57403C4.5 6.29837 4.5 5.94891 4.5 5.25Z"
                stroke="black"
                strokeWidth="1.125"
              />
              <path
                d="M9 12.75C9 12.0511 9 11.7017 9.11415 11.426C9.2664 11.0585 9.55845 10.7664 9.92595 10.6141C10.2017 10.5 10.5511 10.5 11.25 10.5C11.9489 10.5 12.2983 10.5 12.574 10.6141C12.9415 10.7664 13.2336 11.0585 13.3858 11.426C13.5 11.7017 13.5 12.0511 13.5 12.75C13.5 13.4489 13.5 13.7983 13.3858 14.074C13.2336 14.4415 12.9415 14.7336 12.574 14.8858C12.2983 15 11.9489 15 11.25 15C10.5511 15 10.2017 15 9.92595 14.8858C9.55845 14.7336 9.2664 14.4415 9.11415 14.074C9 13.7983 9 13.4489 9 12.75Z"
                stroke="black"
                strokeWidth="1.125"
              />
            </svg>
            <span className="font-inter-tight text-[13px] font-normal text-black leading-normal">
              Filter
            </span>
          </button>

          {/* Sort Button */}
          <button className="flex items-center gap-[5px] px-[14px] py-[7px] rounded-[8px] bg-[#F5F5F5] hover:bg-[#e8e8e8] transition-colors flex-shrink-0">
            <span className="font-inter-tight text-[13px] font-normal text-black leading-normal">
              {_sortBy}
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.2826 6.2209C11.3525 6.29058 11.4079 6.37338 11.4458 6.46454C11.4837 6.5557 11.5031 6.65344 11.5031 6.75215C11.5031 6.85086 11.4837 6.9486 11.4458 7.03977C11.4079 7.13093 11.3525 7.21373 11.2826 7.2834L8.28255 10.2834C8.21287 10.3533 8.13008 10.4088 8.03892 10.4467C7.94775 10.4845 7.85001 10.504 7.7513 10.504C7.65259 10.504 7.55485 10.4845 7.46369 10.4467C7.37252 10.4088 7.28973 10.3533 7.22005 10.2834L4.22005 7.2834C4.07915 7.14251 4 6.95141 4 6.75215C4 6.5529 4.07915 6.3618 4.22005 6.2209C4.36095 6.08001 4.55204 6.00085 4.7513 6.00085C4.95056 6.00085 5.14165 6.08001 5.28255 6.2209L7.75193 8.68903L10.2213 6.21903C10.2911 6.14942 10.3739 6.09425 10.465 6.05666C10.5561 6.01908 10.6538 5.99983 10.7523 6C10.8509 6.00018 10.9484 6.01977 11.0394 6.05768C11.1304 6.09558 11.213 6.15105 11.2826 6.2209Z"
                fill="black"
              />
            </svg>
          </button>
        </div>

        {/* Table */}
        <div className="rounded-[16px] border border-[#E1E4EA] bg-white overflow-hidden flex flex-col flex-1">
          {applicants.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No applicants yet"
              description="When candidates apply to opportunities, they'll appear here"
            />
          ) : (
            <>
              {/* Table Header */}
              <div className="px-[24px] py-[16px] border-b border-[#E1E4EA]">
                <div className="grid grid-cols-[40px_1fr_80px_1.2fr_140px_120px_110px_1.3fr] gap-4">
                  <span className="font-inter-tight text-[13px] font-medium text-[#525866] text-center">
                    S/N
                  </span>
                  <span className="font-inter-tight text-[13px] font-medium text-[#525866] text-left">
                    Talents
                  </span>
                  <span className="font-inter-tight text-[13px] font-medium text-[#525866]">
                    Hires
                  </span>
                  <span className="font-inter-tight text-[13px] font-medium text-[#525866]">
                    Opportunity
                  </span>
                  <span className="font-inter-tight text-[13px] font-medium text-[#525866]">
                    Location
                  </span>
                  <span className="font-inter-tight text-[13px] font-medium text-[#525866]">
                    Date Applied
                  </span>
                  <span className="font-inter-tight text-[13px] font-medium text-[#525866] text-center">
                    Status
                  </span>
                  <span className="font-inter-tight text-[13px] font-medium text-[#525866] text-right">
                    Actions
                  </span>
                </div>
              </div>

              {/* Table Body */}
              <div className="px-[24px] py-[19px] flex flex-col gap-[19px] overflow-y-auto flex-1">
                {applicants.map((applicant, index) => (
                  <div
                    key={applicant.id}
                    className="grid grid-cols-[40px_1fr_80px_1.2fr_140px_120px_110px_1.3fr] gap-4 items-center py-2 flex-shrink-0"
                  >
                    {/* S/N */}
                    <div className="flex items-center justify-center h-full">
                      <span className="font-inter-tight text-[13px] font-normal text-black">
                        {index + 1}.
                      </span>
                    </div>

                    {/* Talents */}
                    <button
                      onClick={() =>
                        router.push(`/discover-talent/${applicant.userId}`)
                      }
                      className="flex items-center gap-[8px] hover:opacity-80 transition-opacity text-left h-full"
                    >
                      <img
                        src={applicant.avatar}
                        alt={applicant.name}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="font-inter-tight text-[13px] font-medium text-black leading-tight truncate">
                          {applicant.name}
                        </span>
                        <span className="font-inter-tight text-[12px] font-light text-[#525866] leading-tight truncate">
                          {applicant.role}
                        </span>
                      </div>
                    </button>

                    {/* Hires */}
                    <div className="flex items-center justify-start h-full">
                      <span className="font-inter-tight text-[13px] font-normal text-black">
                        {applicant.hires}
                      </span>
                    </div>

                    {/* Opportunity */}
                    <div className="flex flex-col gap-1 h-full justify-center min-w-0">
                      <span className="font-inter-tight text-[12px] font-normal text-black leading-tight truncate">
                        {applicant.opportunity.title}
                      </span>
                      {applicant.opportunity.type && (
                        <span className="font-inter-tight text-[11px] font-normal text-[#606060] leading-tight truncate">
                          {applicant.opportunity.type}
                        </span>
                      )}
                    </div>

                    {/* Location */}
                    <div className="flex items-center justify-start h-full">
                      <span className="font-inter-tight text-[13px] font-normal text-black truncate">
                        {applicant.location}
                      </span>
                    </div>

                    {/* Date Applied */}
                    <div className="flex items-center justify-start h-full">
                      <span className="font-inter-tight text-[13px] font-normal text-black truncate">
                        {applicant.dateApplied}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-center h-full">
                      <div
                        className="flex items-center justify-center px-[20px] py-1 rounded-[50px]"
                        style={{
                          backgroundColor: (() => {
                            if (
                              applicant.status === "shortlisted" &&
                              applicant.interviewStatus === "cancelled"
                            ) {
                              return statusDisplayMap["applied"].bg;
                            }
                            if (
                              applicant.status === "shortlisted" &&
                              applicant.interviewStatus &&
                              (applicant.interviewStatus === "scheduled" ||
                                applicant.interviewStatus === "rescheduled")
                            ) {
                              return interviewStatusDisplayMap[
                                applicant.interviewStatus
                              ].bg;
                            }
                            return statusDisplayMap[applicant.status].bg;
                          })(),
                        }}
                      >
                        <span
                          className="font-inter-tight text-[11px] font-semibold text-center leading-tight"
                          style={{
                            color: (() => {
                              if (
                                applicant.status === "shortlisted" &&
                                applicant.interviewStatus === "cancelled"
                              ) {
                                return statusDisplayMap["applied"].text;
                              }
                              if (
                                applicant.status === "shortlisted" &&
                                applicant.interviewStatus &&
                                (applicant.interviewStatus === "scheduled" ||
                                  applicant.interviewStatus === "rescheduled")
                              ) {
                                return interviewStatusDisplayMap[
                                  applicant.interviewStatus
                                ].text;
                              }
                              return statusDisplayMap[applicant.status].text;
                            })(),
                          }}
                        >
                          {(() => {
                            if (
                              applicant.status === "shortlisted" &&
                              applicant.interviewStatus === "cancelled"
                            ) {
                              return statusDisplayMap["applied"].label;
                            }
                            if (
                              applicant.status === "shortlisted" &&
                              applicant.interviewStatus &&
                              (applicant.interviewStatus === "scheduled" ||
                                applicant.interviewStatus === "rescheduled")
                            ) {
                              return interviewStatusDisplayMap[
                                applicant.interviewStatus
                              ].label;
                            }
                            return statusDisplayMap[applicant.status].label;
                          })()}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-1 h-full flex-shrink-0">
                      <button
                        onClick={() =>
                          router.push(`/applicants/${applicant.id}`)
                        }
                        className="flex items-center justify-center h-8 px-[8px] py-[12px] rounded-[50px] bg-[#181B25] hover:bg-[#2a2d3a] transition-colors flex-shrink-0"
                      >
                        <span className="font-inter-tight text-[12px] font-medium text-white text-center leading-normal">
                          View Proposal
                        </span>
                      </button>
                      {applicant.status !== "rejected" &&
                        applicant.status !== "hired" && (
                          <button
                            onClick={() =>
                              router.push(`/applicants/${applicant.id}`)
                            }
                            style={{
                              backgroundColor: "#5C30FF",
                              borderColor: "#5C30FF",
                            }}
                            className="flex items-center justify-center h-8 px-[20px] py-[12px] rounded-[50px] border hover:opacity-90 transition-colors flex-shrink-0"
                          >
                            <span className="font-inter-tight text-[12px] font-medium text-white text-center leading-normal">
                              Hire
                            </span>
                          </button>
                        )}
                      {applicant.status === "hired" && (
                        <button
                          disabled
                          className="flex items-center justify-center h-8 px-[20px] py-[12px] rounded-[50px] bg-[#008B47] cursor-default opacity-70 flex-shrink-0"
                        >
                          <span className="font-inter-tight text-[12px] font-medium text-white text-center leading-normal">
                            Hired
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
