"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Briefcase, Users, Search, X } from "lucide-react";
import { useToast } from "@/hooks";
import { getTalentApplications } from "@/lib/api/applications/index";
import { getTalentMentorshipRequests } from "@/lib/api/mentorship";
import type { Application } from "@/lib/api/applications/types";
import type { MentorshipRequest } from "@/lib/api/mentorship/types";
import {
  JobApplicationCard,
  MentorshipRequestCard,
  MyApplicationsSkeleton,
} from "@/components/talent/applications";
import { EmptyState } from "@/components/ui/empty-state";

type TabType = "jobs" | "mentorship";

const JOB_STATUS_TABS = [
  { id: "all", label: "All" },
  { id: "applied", label: "Applied" },
  { id: "shortlisted", label: "Shortlisted" },
  { id: "interview", label: "Interview" },
  { id: "hired", label: "Hired" },
  { id: "rejected", label: "Rejected" },
];

const MENTORSHIP_STATUS_TABS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "accepted", label: "Accepted" },
  { id: "rejected", label: "Rejected" },
  { id: "cancelled", label: "Cancelled" },
];

const JOB_STATUS_MAP: Record<string, string> = {
  invited: "applied",
  applied: "applied",
  shortlisted: "shortlisted",
  hired: "hired",
  rejected: "rejected",
};

export function TalentMyApplications() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>("jobs");
  const [jobStatusFilter, setJobStatusFilter] = useState("all");
  const [mentorshipStatusFilter, setMentorshipStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<{ dateRange: string }>({
    dateRange: "all",
  });

  const [jobApplications, setJobApplications] = useState<Application[]>([]);
  const [displayedJobApplications, setDisplayedJobApplications] = useState<
    Application[]
  >([]);
  const [jobPagination, setJobPagination] = useState<any>(null);
  const [jobCurrentPage, setJobCurrentPage] = useState(0);

  const [mentorshipRequests, setMentorshipRequests] = useState<
    MentorshipRequest[]
  >([]);
  const [displayedMentorshipRequests, setDisplayedMentorshipRequests] =
    useState<MentorshipRequest[]>([]);
  const [mentorshipPagination, setMentorshipPagination] = useState<any>(null);
  const [mentorshipCurrentPage, setMentorshipCurrentPage] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const isInitialLoadRef = useRef(true);
  const fetchIdRef = useRef(0);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset to page 1 when filters change (must happen before fetch)
  useEffect(() => {
    setJobCurrentPage(0);
    setMentorshipCurrentPage(0);
  }, [
    debouncedSearchQuery,
    appliedFilters.dateRange,
    jobStatusFilter,
    mentorshipStatusFilter,
  ]);

  const fetchJobApplications = useCallback(async () => {
    const currentFetchId = ++fetchIdRef.current;

    try {
      // Only show loading skeleton on initial load
      if (isInitialLoadRef.current) {
        setIsLoading(true);
      }

      const data = await getTalentApplications({
        q: debouncedSearchQuery || undefined,
        status: jobStatusFilter !== "all" ? jobStatusFilter : undefined,
        dateRange:
          appliedFilters.dateRange && appliedFilters.dateRange !== "all"
            ? (appliedFilters.dateRange as "today" | "week" | "month")
            : undefined,
        limit: 20,
        offset: jobCurrentPage * 20,
      });

      // Discard stale responses
      if (currentFetchId !== fetchIdRef.current) return;

      const dataArray = Array.isArray(data)
        ? data
        : ((data as any)?.data ?? []);
      const paginationData = Array.isArray(data)
        ? null
        : ((data as any)?.pagination ?? null);

      setJobApplications(dataArray);
      setDisplayedJobApplications(dataArray);
      setJobPagination(paginationData);
      isInitialLoadRef.current = false;
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to load job applications:", error);
      setJobApplications([]);
      setDisplayedJobApplications([]);
      toast({
        title: "Error",
        description: "Failed to load job applications",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }, [
    toast,
    debouncedSearchQuery,
    jobStatusFilter,
    appliedFilters.dateRange,
    jobCurrentPage,
  ]);

  const fetchMentorshipRequests = useCallback(async () => {
    const currentFetchId = ++fetchIdRef.current;

    try {
      // Only show loading skeleton on initial load
      if (isInitialLoadRef.current) {
        setIsLoading(true);
      }

      const response = await getTalentMentorshipRequests({
        status:
          mentorshipStatusFilter !== "all"
            ? (mentorshipStatusFilter as any)
            : undefined,
        q: debouncedSearchQuery || undefined,
        dateRange:
          appliedFilters.dateRange && appliedFilters.dateRange !== "all"
            ? (appliedFilters.dateRange as "today" | "week" | "month")
            : undefined,
        limit: 20,
        offset: mentorshipCurrentPage * 20,
      });

      // Discard stale responses
      if (currentFetchId !== fetchIdRef.current) return;

      const data = Array.isArray(response) ? response : response?.data || [];
      const paginationData = Array.isArray(response)
        ? null
        : response?.meta || null;

      setMentorshipRequests(data);
      setDisplayedMentorshipRequests(data);
      setMentorshipPagination(paginationData);
      isInitialLoadRef.current = false;
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to load mentorship requests:", error);
      setMentorshipRequests([]);
      setDisplayedMentorshipRequests([]);
      toast({
        title: "Error",
        description: "Failed to load mentorship requests",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }, [
    toast,
    mentorshipStatusFilter,
    debouncedSearchQuery,
    appliedFilters.dateRange,
    mentorshipCurrentPage,
  ]);

  useEffect(() => {
    if (activeTab === "jobs") {
      fetchJobApplications();
    } else {
      fetchMentorshipRequests();
    }
  }, [activeTab, fetchJobApplications, fetchMentorshipRequests]);

  // Server handles all filtering — render results directly
  const filteredJobApplications = displayedJobApplications;
  const filteredMentorshipRequests = displayedMentorshipRequests;

  const statusTabs =
    activeTab === "jobs" ? JOB_STATUS_TABS : MENTORSHIP_STATUS_TABS;
  const currentStatusFilter =
    activeTab === "jobs" ? jobStatusFilter : mentorshipStatusFilter;
  const setStatusFilter =
    activeTab === "jobs" ? setJobStatusFilter : setMentorshipStatusFilter;
  const currentPagination =
    activeTab === "jobs" ? jobPagination : mentorshipPagination;
  const currentPage =
    activeTab === "jobs" ? jobCurrentPage : mentorshipCurrentPage;
  const setCurrentPage =
    activeTab === "jobs" ? setJobCurrentPage : setMentorshipCurrentPage;

  return (
    <div className="h-screen overflow-x-hidden bg-white flex flex-col">
      {/* Header */}
      <div className="w-full px-[25px] pt-[19px] pb-[16px] border-b border-[#E1E4EA] flex-shrink-0">
        <h1 className="text-[16px] font-medium font-inter-tight text-black leading-[16px] mb-[19px]">
          My Applications
        </h1>

        {/* Top Tab Switch */}
        <div className="flex items-center gap-1 mb-[19px]">
          <button
            onClick={() => setActiveTab("jobs")}
            className={`flex items-center gap-2 px-4 py-2 h-10 rounded-[8px] transition-colors ${
              activeTab === "jobs"
                ? "bg-[#5C30FF] text-white font-medium"
                : "text-[#525866] font-normal hover:text-black hover:bg-gray-50"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span className="text-[13px] font-inter-tight">
              Job Applications
            </span>
          </button>
          <button
            onClick={() => setActiveTab("mentorship")}
            className={`flex items-center gap-2 px-4 py-2 h-10 rounded-[8px] transition-colors ${
              activeTab === "mentorship"
                ? "bg-[#5C30FF] text-white font-medium"
                : "text-[#525866] font-normal hover:text-black hover:bg-gray-50"
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="text-[13px] font-inter-tight">
              Mentorship Requests
            </span>
          </button>
        </div>

        {/* Search Bar and Date Range Filters */}
        <div className="flex items-center gap-[8px] mb-[19px]">
          <div className="flex-1 max-w-[585px] h-[38px] px-[12px] py-[7px] flex items-center gap-[6px] border border-[#E1E4EA] rounded-[8px]">
            <Search className="w-[15px] h-[15px] text-[#B2B2B2] flex-shrink-0" />
            <input
              type="text"
              placeholder={`Search ${activeTab === "jobs" ? "jobs" : "mentorship requests"}...`}
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

          {/* Date Range Filter Buttons */}
          <div className="flex items-center gap-[6px]">
            {[
              { value: "all", label: "All Time" },
              { value: "today", label: "Today" },
              { value: "week", label: "This Week" },
              { value: "month", label: "This Month" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setAppliedFilters({ dateRange: option.value });
                }}
                className={`h-[38px] px-[15px] py-[7px] flex items-center gap-[5px] rounded-[8px] flex-shrink-0 transition-colors text-[13px] font-normal font-inter-tight border ${
                  appliedFilters?.dateRange === option.value
                    ? "bg-[#8463FF0D] border-[#8463FF] text-[#8463FF]"
                    : "bg-[#F5F5F5] hover:bg-gray-100 text-black border-transparent"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-[8px] overflow-x-auto scrollbar-hide">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-[12px] py-[6px] flex justify-center items-center whitespace-nowrap flex-shrink-0 rounded transition-colors ${
                currentStatusFilter === tab.id
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
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {isLoading ? (
            <MyApplicationsSkeleton type={activeTab} />
          ) : activeTab === "jobs" ? (
            filteredJobApplications.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                title={
                  debouncedSearchQuery ||
                  jobStatusFilter !== "all" ||
                  appliedFilters.dateRange !== "all"
                    ? "No applications found"
                    : "No job applications yet"
                }
                description={
                  debouncedSearchQuery ||
                  jobStatusFilter !== "all" ||
                  appliedFilters.dateRange !== "all"
                    ? "Try adjusting your filters or search query"
                    : "Start applying to jobs to see your applications here"
                }
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[7px]">
                {filteredJobApplications.map((application) => (
                  <JobApplicationCard
                    key={application.id}
                    application={application}
                  />
                ))}
              </div>
            )
          ) : filteredMentorshipRequests.length === 0 ? (
            <EmptyState
              icon={Users}
              title={
                debouncedSearchQuery ||
                mentorshipStatusFilter !== "all" ||
                appliedFilters.dateRange !== "all"
                  ? "No requests found"
                  : "No mentorship requests yet"
              }
              description={
                debouncedSearchQuery ||
                mentorshipStatusFilter !== "all" ||
                appliedFilters.dateRange !== "all"
                  ? "Try adjusting your filters or search query"
                  : "Find mentors and send request to see them here"
              }
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[7px]">
              {filteredMentorshipRequests.map((request) => (
                <MentorshipRequestCard key={request.id} request={request} />
              ))}
            </div>
          )}
        </div>

        {/* Pagination - Fixed at bottom */}
        {!isLoading && currentPagination && currentPagination.total > 0 && (
          <div className="flex-shrink-0 px-4 md:px-6 py-4 border-t border-[#E1E4EA] bg-white">
            <div className="flex items-center justify-between">
              <div className="text-[13px] text-[#525866] font-inter-tight">
                Showing {currentPagination.offset + 1} to{" "}
                {Math.min(
                  currentPagination.offset + currentPagination.limit,
                  currentPagination.total,
                )}{" "}
                of {currentPagination.total}{" "}
                {activeTab === "jobs" ? "applications" : "requests"}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!currentPagination.hasPreviousPage}
                  className="px-4 py-2 border border-[#E1E4EA] rounded-lg text-[13px] font-inter-tight disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                <span className="text-[13px] text-[#525866] font-inter-tight">
                  Page {currentPagination.currentPage} of{" "}
                  {currentPagination.totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!currentPagination.hasNextPage}
                  className="px-4 py-2 border border-[#E1E4EA] rounded-lg text-[13px] font-inter-tight disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
