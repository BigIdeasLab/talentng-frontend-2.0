"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users, SlidersHorizontal } from "lucide-react";
import { SearchInput } from "@/components/ui/search-input";
import { EmptyState } from "@/components/ui/empty-state";
import { useRequireRole } from "@/hooks/useRequireRole";
import { useProfile } from "@/hooks/useProfile";
import { PageLoadingState } from "@/lib/page-utils";
import { ApplicantsSkeleton } from "@/components/employer/applicants/ApplicantsSkeleton";
import { useRecruiterApplicationsQuery } from "@/hooks/useRecruiterApplications";
import {
  mapApplicationsToUI,
  type MappedApplicant,
} from "@/lib/mappers/application";
import {
  ApplicantFilterModal,
  type ApplicantFilterState,
} from "@/components/employer/applicants/ApplicantFilterModal";

// Map status to UI display - Recruiter View
const statusDisplayMap = {
  applied: { label: "New Application", bg: "#FEF3C7", text: "#D97706" },
  invited: { label: "Invited", bg: "#DBEAFE", text: "#2563EB" },
  shortlisted: { label: "Shortlisted", bg: "#F3E8FF", text: "#7C3AED" },
  hired: { label: "Hired", bg: "#ECFDF3", text: "#059669" },
  rejected: { label: "Rejected", bg: "#FEF2F2", text: "#DC2626" },
};

// Map interview status to UI display
const interviewStatusDisplayMap = {
  scheduled: { label: "Interview Scheduled", bg: "#EFF6FF", text: "#2563EB" },
  rescheduled: {
    label: "Interview Rescheduled",
    bg: "#FEF3C7",
    text: "#D97706",
  },
};

export default function ApplicantsPage() {
  const router = useRouter();
  const { activeRole, isLoading: isProfileLoading } = useProfile();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<ApplicantFilterState>({
    status: [],
    location: "",
    dateRange: "all",
  });
  const [displayedApplicants, setDisplayedApplicants] = useState<
    MappedApplicant[]
  >([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const lastProcessedDataRef = useRef<any>(null);

  // Only fetch when the active role is confirmed as recruiter
  const isRoleReady = !isProfileLoading && activeRole === "recruiter";

  // Reset to page 1 when filters change (but not on every keystroke)
  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery, activeTab, filters, sortBy]);

  // Build server-side params from all active filters
  const queryParams = useMemo(
    () => ({
      ...(searchQuery ? { q: searchQuery } : {}),
      ...(activeTab !== "all" ? { status: activeTab } : {}),
      ...(filters.status.length === 1 ? { status: filters.status[0] } : {}),
      ...(filters.location ? { location: filters.location } : {}),
      ...(filters.dateRange !== "all"
        ? { dateRange: filters.dateRange as "today" | "week" | "month" }
        : {}),
      ...(sortBy !== "newest"
        ? { sortBy: sortBy as "newest" | "oldest" | "name-asc" | "name-desc" }
        : {}),
      limit: 20,
      offset: currentPage * 20,
    }),
    [searchQuery, activeTab, filters, sortBy, currentPage],
  );

  const {
    data: response,
    isLoading,
    isPending,
    error: queryError,
  } = useRecruiterApplicationsQuery(queryParams, { enabled: isRoleReady });
  const hasAccess = useRequireRole(["recruiter"]);
  const error =
    queryError instanceof Error
      ? queryError.message
      : queryError
        ? "Failed to load"
        : null;

  // Extract data and pagination from response
  const rawApplicants = response?.data || [];
  const pagination = response?.pagination;

  // Map raw API data to UI format and update displayed applicants
  useEffect(() => {
    // Only update if response has actually changed
    if (response && response !== lastProcessedDataRef.current) {
      lastProcessedDataRef.current = response;
      const mapped = mapApplicationsToUI(response.data || []);
      setDisplayedApplicants(mapped);
      if (isInitialLoad && !isLoading && !isPending) {
        setIsInitialLoad(false);
      }
    }
  }, [response, isLoading, isPending, isInitialLoad]);

  const getFilterCount = () => {
    let count = 0;
    if (filters.status.length > 0) count += filters.status.length;
    if (filters.location) count += 1;
    if (filters.dateRange !== "all") count += 1;
    return count;
  };

  // Hired count — only available if tab is "all" or "hired"
  const hiredCount = useMemo(
    () => displayedApplicants.filter((a) => a.status === "hired").length,
    [displayedApplicants],
  );

  // Option lists for filter modal dropdowns (derived from current result set)
  const availableStatuses = useMemo(
    () => [...new Set(displayedApplicants.map((a) => a.status))],
    [displayedApplicants],
  );
  const availableLocations = useMemo(
    () => [
      ...new Set(displayedApplicants.map((a) => a.location).filter(Boolean)),
    ],
    [displayedApplicants],
  );

  const TABS = [
    { id: "all", label: "All" },
    { id: "applied", label: "In Review" },
    { id: "shortlisted", label: "Shortlisted" },
    { id: "hired", label: "Hired" },
    { id: "rejected", label: "Rejected" },
  ];

  // Server already handles all filtering — use results directly
  const filteredApplicants = displayedApplicants;

  if (!hasAccess) {
    return <PageLoadingState message="Checking access..." />;
  }

  // Only show skeleton on initial load
  if (isInitialLoad && (isLoading || isPending || !response)) {
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
      <div className="w-full px-3 md:px-5 pt-5 md:pt-6 border-b border-[#E1E4EA] flex-shrink-0">
        {/* Title Row */}
        <div className="flex items-center justify-between mb-4">
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
        <div className="flex items-center gap-[8px] mb-4">
          <div className="flex-1 max-w-[585px]">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={setSearchQuery}
              placeholder="Search name, role..."
              debounceDelay={500}
            />
          </div>

          <div className="relative flex-shrink-0">
            <button
              onClick={() => setIsFilterOpen(true)}
              className={`flex items-center gap-1.5 px-3 h-9 rounded-lg transition-colors flex-shrink-0 ${
                getFilterCount() > 0
                  ? "bg-[#8463FF0D] border border-[#8463FF] text-[#8463FF]"
                  : "hover:bg-gray-50 border border-transparent"
              }`}
            >
              <SlidersHorizontal className="w-[15px] h-[15px]" />
              <span className="text-xs font-normal font-inter-tight">
                Filter
              </span>
              {getFilterCount() > 0 && (
                <span className="ml-1 bg-[#8463FF] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {getFilterCount()}
                </span>
              )}
            </button>
            <ApplicantFilterModal
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              onApply={(newFilters) => setFilters(newFilters)}
              initialFilters={filters}
              availableStatuses={availableStatuses}
              availableLocations={availableLocations}
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
        <div className="flex items-center gap-5 border-b border-transparent mb-6 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-sm md:text-xs font-medium font-inter-tight whitespace-nowrap transition-colors flex-shrink-0 rounded ${
                activeTab === tab.id
                  ? "text-black border-b-2 border-black"
                  : "text-black/30"
              }`}
            >
              {tab.label}
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
                title="No applicants found"
                description={
                  searchQuery.trim()
                    ? "Try adjusting your search query"
                    : filters.status.length > 0 ||
                        filters.location ||
                        filters.dateRange !== "all"
                      ? "Try adjusting your filters"
                      : activeTab === "hired"
                        ? "You haven't hired any talents yet"
                        : activeTab === "rejected"
                          ? "You haven't rejected any applicants"
                          : activeTab === "shortlisted"
                            ? "You haven't shortlisted any applicants yet"
                            : activeTab === "applied"
                              ? "No applicants are currently in review"
                              : "When candidates apply to opportunities, they'll appear here"
                }
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

            {/* Pagination */}
            {pagination && pagination.total > 0 && (
              <div className="flex items-center justify-between px-[24px] py-[16px] border-t border-[#E1E4EA] flex-shrink-0">
                <div className="text-[13px] text-[#525866] font-inter-tight">
                  Showing {pagination.offset + 1} to{" "}
                  {Math.min(
                    pagination.offset + pagination.limit,
                    pagination.total,
                  )}{" "}
                  of {pagination.total} results
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={!pagination.hasPreviousPage}
                    className="px-4 py-2 border border-[#E1E4EA] rounded-lg text-[13px] font-inter-tight disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-[13px] text-[#525866] font-inter-tight">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="px-4 py-2 border border-[#E1E4EA] rounded-lg text-[13px] font-inter-tight disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
