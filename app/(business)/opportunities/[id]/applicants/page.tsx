"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { Users } from "lucide-react";
import { useRequireRole } from "@/hooks/useRequireRole";
import { PageLoadingState } from "@/lib/page-utils";
import { EmptyState } from "@/components/ui/empty-state";
import { useApplications } from "@/hooks/useApplications";
import type { Application } from "@/lib/api/applications";
import {
  ApplicantFilterModal,
  type ApplicantFilterState,
} from "@/components/employer/applicants/ApplicantFilterModal";

const statusDisplayMap: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  invited: { label: "Invited", bg: "#E0E7FF", text: "#4F46E5" },
  applied: { label: "In Review", bg: "#DBE9FE", text: "#5C30FF" },
  shortlisted: { label: "Shortlisted", bg: "#FEF3C7", text: "#92400D" },
  rejected: { label: "Rejected", bg: "#FEE2E1", text: "#991B1B" },
  hired: { label: "Hired", bg: "#D1FAE5", text: "#076046" },
};

interface MappedApplicant {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  role: string;
  hires: number;
  skills: string[];
  opportunity: {
    title: string;
    type?: string;
  };
  location: string;
  dateApplied: string;
  createdAt: string;
  status: string;
}

export default function OpportunityApplicantsPage() {
  const router = useRouter();
  const params = useParams();
  const opportunityId = params.id as string;
  const hasAccess = useRequireRole(["recruiter"]);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<ApplicantFilterState>({
    status: [],
    location: "",
    skills: [],
    dateRange: "all",
  });
  const [applicants, setApplicants] = useState<MappedApplicant[]>([]);
  const [opportunityTitle, setOpportunityTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { getAll, isLoading } = useApplications();

  useEffect(() => {
    if (hasAccess) {
      fetchOpportunityAndApplicants();
    }
  }, [hasAccess, opportunityId]);

  const fetchOpportunityAndApplicants = async () => {
    try {
      setError(null);

      // Fetch opportunity details
      const { getOpportunityById } = await import("@/lib/api/opportunities");
      const opportunity = await getOpportunityById(opportunityId);
      setOpportunityTitle(opportunity?.title || "");

      // Fetch applicants for this opportunity
      const data = await getAll(opportunityId);
      const mapped = mapApplicationsToUI(data || []);
      setApplicants(mapped);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load applicants";
      setError(message);
      console.error("Error fetching opportunity and applicants:", err);
    }
  };

  const mapApplicationsToUI = (
    applications: Application[],
  ): MappedApplicant[] => {
    return applications.map((app) => ({
      id: app.id,
      userId: app.userId,
      name: app.user.talentProfile.fullName,
      avatar: app.user.talentProfile.profileImageUrl,
      role: app.user.talentProfile.headline,
      hires: app.user.talentProfile.hiredCount,
      skills: app.user.talentProfile.skills || [],
      opportunity: {
        title: app.opportunity.title,
        type: app.opportunity.type,
      },
      location: app.user.talentProfile.location,
      dateApplied: new Date(app.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      createdAt: app.createdAt,
      status: app.status,
    }));
  };

  // Extract available filter options from applicants data
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

  const filteredApplicants = useMemo(() => {
    let result = applicants;

    // Search filter
    if (searchQuery) {
      result = result.filter((applicant) =>
        applicant.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Status filter
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
  }, [applicants, searchQuery, filters, sortBy]);

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

  return (
    <div className="h-screen bg-white overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {/* Header Section */}
        <div className="flex flex-col gap-[19px] mb-[24px]">
          {/* Back Button */}
          <Link
            href="/opportunities"
            className="flex items-center gap-[8px] text-black/30 hover:text-black/50 transition-colors w-fit"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.783 11.7826C9.71332 11.8525 9.63053 11.9079 9.53937 11.9458C9.4482 11.9837 9.35046 12.0031 9.25175 12.0031C9.15304 12.0031 9.0553 11.9837 8.96414 11.9458C8.87297 11.9079 8.79018 11.8525 8.7205 11.7826L5.7205 8.78255C5.65058 8.71287 5.5951 8.63008 5.55725 8.53891C5.5194 8.44775 5.49991 8.35001 5.49991 8.2513C5.49991 8.15259 5.5194 8.05485 5.55725 7.96369C5.5951 7.87252 5.65058 7.78973 5.7205 7.72005L8.7205 4.72005C8.8614 4.57915 9.0525 4.5 9.25175 4.5C9.45101 4.5 9.64211 4.57915 9.783 4.72005C9.9239 4.86095 10.0031 5.05204 10.0031 5.2513C10.0031 5.45056 9.9239 5.64165 9.783 5.78255L7.31488 8.25193L9.78488 10.7213C9.85449 10.7911 9.90966 10.8739 9.94724 10.965C9.98482 11.0561 10.0041 11.1538 10.0039 11.2523C10.0037 11.3509 9.98413 11.4484 9.94623 11.5394C9.90832 11.6304 9.85286 11.713 9.783 11.7826Z"
                fill="#B2B2B2"
              />
            </svg>
            <span className="font-inter-tight text-[13px] font-normal leading-normal">
              Back to Opportunities
            </span>
          </Link>

          {/* Title and Stats */}
          <div className="flex items-center justify-between">
            <h1 className="font-inter-tight text-[21px] font-medium text-black leading-[18px]">
              {opportunityTitle && `${opportunityTitle} > `}Applicants
            </h1>
            <div className="text-right">
              <p className="font-inter-tight text-[13px] font-medium text-black">
                {applicants.length}{" "}
                {applicants.length === 1 ? "applicant" : "applicants"}
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-[8px] mb-[20px] relative overflow-visible">
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
          <div className="relative flex-shrink-0">
            <button
              onClick={() => {
                setIsFilterOpen(true);
              }}
              className="flex items-center gap-[5px] px-[14px] py-[7px] rounded-[8px] bg-[#F5F5F5] hover:bg-[#e8e8e8] transition-colors relative"
            >
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
              {getFilterCount() > 0 && (
                <div className="absolute -top-2 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
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
          <div className="relative group">
            <button className="flex items-center gap-[5px] px-[14px] py-[7px] rounded-[8px] bg-[#F5F5F5] hover:bg-[#e8e8e8] transition-colors flex-shrink-0">
              <span className="font-inter-tight text-[13px] font-normal text-black leading-normal">
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
            {/* Sort Dropdown */}
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

        {/* Table */}
        <div className="rounded-[16px] border border-[#E1E4EA] bg-white overflow-hidden flex flex-col flex-1">
          {filteredApplicants.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No applicants yet"
              description="When candidates apply to this opportunity, they'll appear here"
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
                          backgroundColor:
                            statusDisplayMap[applicant.status].bg,
                        }}
                      >
                        <span
                          className="font-inter-tight text-[11px] font-semibold text-center leading-tight"
                          style={{
                            color: statusDisplayMap[applicant.status].text,
                          }}
                        >
                          {statusDisplayMap[applicant.status].label}
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
