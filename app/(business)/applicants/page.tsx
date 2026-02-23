"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users, Search, SlidersHorizontal, X } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { useRequireRole } from "@/hooks/useRequireRole";
import { PageLoadingState } from "@/lib/page-utils";
import { ApplicantsSkeleton } from "@/components/employer/applicants/ApplicantsSkeleton";
import { useApplications } from "@/hooks/useApplications";
import {
  mapApplicationsToUI,
  type MappedApplicant,
} from "@/lib/mappers/application";
import {
  ApplicantFilterModal,
  type ApplicantFilterState,
} from "@/components/employer/applicants/ApplicantFilterModal";

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
  const [sortBy, setSortBy] = useState("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<ApplicantFilterState>({
    status: [],
    location: "",
    skills: [],
    dateRange: "all",
  });
  const { getAll, isLoading, error } = useApplications();
  const hasAccess = useRequireRole(["recruiter"]);

  useEffect(() => {
    if (hasAccess) {
      getAll().then((data) => {
        setApplicants(mapApplicationsToUI(data));
      });
    }
  }, [hasAccess, getAll]);

  const availableStatuses = useMemo(() => {
    return [...new Set(applicants.map((a) => a.status))];
  }, [applicants]);

  const availableLocations = useMemo(() => {
    return [...new Set(applicants.map((a) => a.location).filter(Boolean))];
  }, [applicants]);

  const availableSkills = useMemo(() => {
    return [...new Set(applicants.flatMap((a) => a.skills || []))];
  }, [applicants]);

  const getFilterCount = () => {
    let count = 0;
    if (filters.status.length > 0) count += filters.status.length;
    if (filters.location) count += 1;
    if (filters.skills.length > 0) count += filters.skills.length;
    if (filters.dateRange !== "all") count += 1;
    return count;
  };

  const hiredCount = useMemo(
    () => applicants.filter((a) => a.status === "hired").length,
    [applicants],
  );

  const TABS = [
    { id: "all", label: "All" },
    { id: "applied", label: "In Review" },
    { id: "shortlisted", label: "Shortlisted" },
    { id: "hired", label: "Hired" },
    { id: "rejected", label: "Rejected" },
  ];

  const filteredApplicants = useMemo(() => {
    let result = applicants;

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (applicant) =>
          applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          applicant.role.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Tab filter
    if (activeTab !== "all") {
      result = result.filter((applicant) => applicant.status === activeTab);
    }

    // Modal status filter
    if (filters.status.length > 0) {
      result = result.filter((applicant) =>
        filters.status.includes(applicant.status),
      );
    }

    // Location filter
    if (filters.location) {
      result = result.filter(
        (applicant) =>
          applicant.location.toLowerCase() === filters.location.toLowerCase(),
      );
    }

    // Skills filter
    if (filters.skills.length > 0) {
      result = result.filter((applicant) =>
        filters.skills.some((skill) =>
          applicant.skills?.some(
            (s) => s.toLowerCase() === skill.toLowerCase(),
          ),
        ),
      );
    }

    // Date filter
    if (filters.dateRange !== "all") {
      const now = new Date();
      result = result.filter((applicant) => {
        const created = new Date(applicant.createdAt);
        if (filters.dateRange === "today") {
          return created.toDateString() === now.toDateString();
        }
        if (filters.dateRange === "week") {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return created >= weekAgo;
        }
        if (filters.dateRange === "month") {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return created >= monthAgo;
        }
        return true;
      });
    }

    // Sort
    if (sortBy === "newest") {
      result = [...result].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else if (sortBy === "oldest") {
      result = [...result].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    } else if (sortBy === "name-asc") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name-desc") {
      result = [...result].sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [applicants, searchQuery, activeTab, filters, sortBy]);

  if (!hasAccess) {
    return <PageLoadingState message="Checking access..." />;
  }

  if (isLoading) {
    return <ApplicantsSkeleton />;
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

          <div className="relative flex-shrink-0">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="h-[38px] px-[15px] py-[7px] flex items-center gap-[5px] bg-[#F5F5F5] rounded-[8px] hover:bg-gray-100 transition-colors relative"
            >
              <SlidersHorizontal className="w-[15px] h-[15px] text-black" />
              <span className="text-[13px] font-normal text-black font-inter-tight">
                Filter
              </span>
              {getFilterCount() > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                  {getFilterCount()}
                </div>
              )}
            </button>
            <ApplicantFilterModal
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              onApply={(newFilters) => setFilters(newFilters)}
              initialFilters={filters}
              availableStatuses={availableStatuses}
              availableLocations={availableLocations}
              availableSkills={availableSkills}
            />
          </div>

          {/* Sort Button */}
          <div className="relative group flex-shrink-0">
            <button className="h-[38px] px-[15px] py-[7px] flex items-center gap-[5px] bg-[#F5F5F5] rounded-[8px] hover:bg-gray-100 transition-colors">
              <span className="text-[13px] font-normal text-black font-inter-tight">
                {sortBy === "newest"
                  ? "Newest"
                  : sortBy === "oldest"
                    ? "Oldest"
                    : sortBy === "name-asc"
                      ? "A-Z"
                      : "Z-A"}
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
            <div className="absolute top-full right-0 mt-1 w-[120px] bg-white rounded-[8px] shadow-lg border border-[#E1E4EA] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              {[
                { value: "newest", label: "Newest" },
                { value: "oldest", label: "Oldest" },
                { value: "name-asc", label: "A-Z" },
                { value: "name-desc", label: "Z-A" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={`w-full text-left px-3 py-2 text-[12px] hover:bg-gray-50 first:rounded-t-[8px] last:rounded-b-[8px] ${
                    sortBy === option.value
                      ? "bg-[#5C30FF]/10 text-[#5C30FF]"
                      : "text-black"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
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
