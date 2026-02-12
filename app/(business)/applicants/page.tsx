"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users, Search, SlidersHorizontal, X } from "lucide-react";
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
  invited: { label: "Invited", bg: "#E0E7FF", text: "#4F46E5" },
  applied: { label: "In Review", bg: "#DBE9FE", text: "#2463EB" },
  shortlisted: { label: "Shortlisted", bg: "#FEF3C7", text: "#92400D" },
  rejected: { label: "Rejected", bg: "#FEE2E1", text: "#991B1B" },
  hired: { label: "Hired", bg: "#D1FAE5", text: "#076046" },
};

// Map interview status to UI display
const interviewStatusDisplayMap = {
  scheduled: { label: "Interview Scheduled", bg: "#EDE9FE", text: "#4F46E5" },
  rescheduled: {
    label: "Interview Rescheduled",
    bg: "#FEF3C7",
    text: "#92400D",
  },
};

export default function ApplicantsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
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

  const TABS = [
    { id: "all", label: "All" },
    { id: "applied", label: "In Review" },
    { id: "shortlisted", label: "Shortlisted" },
    { id: "hired", label: "Hired" },
    { id: "rejected", label: "Rejected" },
  ];

  const filteredApplicants = applicants.filter((applicant) => {
    const matchesSearch =
      searchQuery === "" ||
      applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      applicant.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || applicant.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="h-screen overflow-x-hidden bg-white flex flex-col">
      {/* Header */}
      <div className="w-full px-[25px] pt-[19px] pb-[16px] border-b border-[#E1E4EA] flex-shrink-0">
        {/* Title Row */}
        <div className="flex items-center justify-between mb-[19px]">
          <h1 className="text-[16px] font-medium font-inter-tight text-black leading-[16px]">
            Applicants
          </h1>
          <Link
            href="/applicants/hired-talents"
            className="flex items-center gap-[5px] px-[14px] py-[7px] rounded-[8px] border border-[#E1E4EA] hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Users className="w-[14px] h-[14px] text-[#525866]" />
            <span className="font-inter-tight text-[13px] font-normal text-[#525866] leading-normal">
              Hired Talents ({hiredCount})
            </span>
          </Link>
        </div>

        {/* Search Bar and Filter */}
        <div className="flex items-center gap-[8px] mb-[19px]">
          <div className="flex-1 max-w-[585px] h-[38px] px-[12px] py-[7px] flex items-center gap-[6px] border border-[#E1E4EA] rounded-[8px]">
            <Search className="w-[15px] h-[15px] text-[#B2B2B2] flex-shrink-0" />
            <input
              type="text"
              placeholder="Search name, role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-[13px] font-normal font-inter-tight placeholder:text-black/30 border-0 focus:outline-none bg-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="flex-shrink-0 text-[#B2B2B2] hover:text-black transition-colors"
              >
                <X className="w-[15px] h-[15px]" />
              </button>
            )}
          </div>

          <button className="h-[38px] px-[15px] py-[7px] flex items-center gap-[5px] bg-[#F5F5F5] rounded-[8px] flex-shrink-0 hover:bg-gray-100 transition-colors">
            <SlidersHorizontal className="w-[15px] h-[15px] text-black" />
            <span className="text-[13px] font-normal text-black font-inter-tight">
              Filter
            </span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-[8px] overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-[12px] py-[6px] flex justify-center items-center whitespace-nowrap flex-shrink-0 rounded transition-colors ${
                activeTab === tab.id
                  ? "text-black font-medium border-b-2 border-black"
                  : "text-black/30 font-medium hover:text-black/50"
              }`}
            >
              <span className="text-[13px] font-inter-tight">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-4 md:p-6">
          {/* Table */}
          <div className="rounded-[16px] border border-[#E1E4EA] bg-white overflow-hidden flex flex-col flex-1">
            {filteredApplicants.length === 0 ? (
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
                  {filteredApplicants.map((applicant, index) => (
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
                        {applicant.status !== "invited" && (
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
                        )}
                        {applicant.status !== "rejected" &&
                          applicant.status !== "hired" &&
                          applicant.status !== "invited" && (
                            <button
                              onClick={() =>
                                router.push(`/applicants/${applicant.id}`)
                              }
                              style={{
                                backgroundColor: "#0D9F5C",
                                borderColor: "#0D9F5C",
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
    </div>
  );
}
