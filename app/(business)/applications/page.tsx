"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { Check, X, Clock, Calendar, MapPin, Video } from "lucide-react";
import { SearchInput } from "@/components/ui/SearchInput";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { useToast } from "@/hooks";
import { useRequireRole } from "@/hooks/useRequireRole";
import { PageLoadingState } from "@/lib/page-utils";
import {
  getMentorMentorshipRequests,
  getPendingRequestsCount,
  acceptRequest,
  rejectRequest,
} from "@/lib/api/mentorship";
import type {
  MentorshipRequest as ApiMentorshipRequest,
  RequestStatus,
} from "@/lib/api/mentorship";

import { ROLE_COLORS } from "@/lib/theme/role-colors";
import { ApplicationsSkeleton } from "@/components/mentor/applications/ApplicationsSkeleton";

interface MentorshipRequest {
  id: string;
  mentee: {
    id: string;
    name: string;
    avatar?: string;
    title: string;
    company: string;
  };
  topic: string;
  message: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: string;
  location: string;
  requestedAt: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
}

function mapApiRequest(request: ApiMentorshipRequest): MentorshipRequest {
  const datePart = request.scheduledDate.split("T")[0];
  const scheduledDate = new Date(`${datePart}T${request.scheduledTime}:00`);

  return {
    id: request.id,
    mentee: {
      id: request.mentee.id,
      name:
        request.mentee.fullName ||
        request.mentee.name ||
        request.mentee.username ||
        "Unknown",
      avatar: (() => {
        // Try multiple avatar sources
        const rawAvatar =
          request.mentee.profileImageUrl || request.mentee.avatar;

        // Filter out placeholder/invalid URLs
        if (!rawAvatar) return "/default.png";
        if (rawAvatar.includes("builder.io")) return "/default.png";
        if (rawAvatar.includes("placeholder")) return "/default.png";

        return rawAvatar;
      })(),
      title: request.mentee.headline || "",
      company: "",
    },
    topic: request.topic,
    message: request.message || "",
    scheduledDate: format(scheduledDate, "EEE MMM d, yyyy"),
    scheduledTime: format(scheduledDate, "h:mm a"),
    duration: `${request.duration} mins`,
    location: request.location || "Google Meet",
    requestedAt: request.createdAt,
    status: request.status,
  };
}

export default function ApplicationsPage() {
  const { toast } = useToast();
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<string>("all");
  const [displayedRequests, setDisplayedRequests] = useState<
    MentorshipRequest[]
  >([]);
  const [pagination, setPagination] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0);

  // Modal states
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null,
  );

  const hasAccess = useRequireRole(["mentor"]);

  const fetchRequests = useCallback(async () => {
    try {
      // Only show loading skeleton on initial load, not on filter changes
      if (isInitialLoad) {
        setIsLoading(true);
      }
      const [requestsResponse, countResponse] = await Promise.all([
        getMentorMentorshipRequests({
          ...(filter !== "all" ? { status: filter as RequestStatus } : {}),
          ...(searchQuery ? { q: searchQuery } : {}),
          ...(dateRange && dateRange !== "all"
            ? {
                dateRange: dateRange as "today" | "week" | "month",
              }
            : {}),
          limit: 20,
          page: currentPage + 1, // API uses 1-based page numbers
        }),
        getPendingRequestsCount(),
      ]);
      // Handle both { data: [...] } and direct array responses
      const requestsArray = Array.isArray(requestsResponse)
        ? requestsResponse
        : (requestsResponse?.data ?? []);

      // Map and update requests
      const currentData = requestsArray.map(mapApiRequest);
      setDisplayedRequests(currentData);
      setRequests(currentData);

      // Extract and transform pagination data from meta
      const meta = !Array.isArray(requestsResponse)
        ? requestsResponse?.meta
        : null;

      // Always create pagination data if we have items, even if API doesn't return meta
      const paginationData = meta
        ? {
            total: meta.total,
            limit: meta.limit,
            offset: (meta.page - 1) * meta.limit,
            currentPage: meta.page,
            totalPages: meta.totalPages,
            hasNextPage: meta.page < meta.totalPages,
            hasPreviousPage: meta.page > 1,
          }
        : currentData.length > 0
          ? {
              total: currentData.length,
              limit: 20,
              offset: 0,
              currentPage: 1,
              totalPages: 1,
              hasNextPage: false,
              hasPreviousPage: false,
            }
          : null;
      setPagination(paginationData);

      setPendingCount(countResponse?.count ?? 0);

      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    } catch (error) {
      console.error("Failed to load mentorship requests:", error);
      setRequests([]);
      setDisplayedRequests([]);
      setPendingCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [filter, searchQuery, dateRange, isInitialLoad, currentPage]);

  useEffect(() => {
    if (hasAccess) {
      fetchRequests();
    }
  }, [hasAccess, fetchRequests]);

  // Reset to page 0 when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [filter, searchQuery, dateRange]);

  const TABS = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "accepted", label: "Accepted" },
    { id: "rejected", label: "Rejected" },
  ];

  // Server handles filtering — show all returned results directly
  const filteredRequests = displayedRequests;

  const renderRequestCard = (request: MentorshipRequest) => (
    <div
      key={request.id}
      className="flex flex-col border border-[#E1E4EA] rounded-[16px] bg-white hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col gap-3.5 px-4 pt-4 pb-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <img
              src={request.mentee.avatar}
              alt={request.mentee.name}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              onError={(e) => {
                // If image fails to load, show initials instead
                const target = e.currentTarget;
                target.style.display = "none";
                const initialsDiv = target.nextElementSibling as HTMLElement;
                if (initialsDiv) initialsDiv.style.display = "flex";
              }}
            />
            <div className="w-8 h-8 rounded-full bg-[#FDF2F8] items-center justify-center flex-shrink-0 hidden">
              <span
                className="text-[12px] font-semibold font-inter-tight"
                style={{ color: ROLE_COLORS.mentor.dark }}
              >
                {request.mentee.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[13px] font-medium font-inter-tight text-black">
                {request.mentee.name}
              </span>
              <span className="text-[12px] font-light font-inter-tight text-[#525866]">
                {request.mentee.title} at {request.mentee.company}
              </span>
            </div>
          </div>
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md flex-shrink-0 ${
              request.status === "pending"
                ? "bg-[#FFF4E5]"
                : request.status === "accepted"
                  ? "bg-[#ECFDF3]"
                  : "bg-[#FEF2F2]"
            }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                request.status === "pending"
                  ? "bg-[#F59E0B]"
                  : request.status === "accepted"
                    ? "bg-[#10B981]"
                    : "bg-[#EF4444]"
              }`}
            />
            <span
              className={`text-[11px] font-normal font-inter-tight ${
                request.status === "pending"
                  ? "text-[#F59E0B]"
                  : request.status === "accepted"
                    ? "text-[#10B981]"
                    : "text-[#EF4444]"
              }`}
            >
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </span>
          </div>
        </div>
        <div className="text-[15px] font-medium font-inter-tight text-black">
          {request.topic}
        </div>
        <p className="text-[13px] font-normal font-inter-tight text-[#525866] leading-relaxed line-clamp-2">
          {request.message}
        </p>
        <div className="flex items-start content-start gap-x-1 gap-y-1.5 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-[24px] bg-[#F5F5F5]">
            <Calendar className="w-3 h-3 text-[#525866]" />
            <span className="text-[12px] font-normal font-inter-tight text-black leading-[12.6px]">
              {request.scheduledDate}, {request.scheduledTime}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-[24px] bg-[#F5F5F5]">
            <Clock className="w-3 h-3 text-[#525866]" />
            <span className="text-[12px] font-normal font-inter-tight text-black leading-[12.6px]">
              {request.duration}
            </span>
          </div>
          {request.location && /^https?:\/\//i.test(request.location) ? (
            <a
              href={request.location}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-[24px] bg-[#EFF6FF] hover:bg-[#DBEAFE] transition-colors"
            >
              <Video className="w-3 h-3 text-[#2563EB]" />
              <span className="text-[12px] font-medium font-inter-tight text-[#2563EB] leading-[12.6px]">
                Join Meeting
              </span>
            </a>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-[24px] bg-[#F5F5F5]">
              <MapPin className="w-3 h-3 text-[#525866]" />
              <span className="text-[12px] font-normal font-inter-tight text-black leading-[12.6px]">
                {request.location}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-end px-4 py-2.5 border-t border-[#E1E4EA]">
        <div className="flex items-center gap-1">
          {request.status === "pending" ? (
            <>
              <button
                onClick={() => handleAccept(request.id)}
                className="flex items-center gap-1 px-4 py-2 h-8 hover:opacity-80 rounded-[40px] transition-colors"
                style={{ backgroundColor: ROLE_COLORS.mentor.dark }}
              >
                <Check className="w-4 h-4 text-white" />
                <span className="text-[12px] font-medium font-inter-tight text-white">
                  Accept
                </span>
              </button>
              <button
                onClick={() => handleReject(request.id)}
                className="flex items-center gap-1 px-4 py-2 h-8 border border-[#E1E4EA] rounded-[40px] hover:border-[#EF4444] hover:bg-[#FEF2F2] hover:text-[#EF4444] transition-colors"
              >
                <X className="w-4 h-4" />
                <span className="text-[12px] font-medium font-inter-tight">
                  Decline
                </span>
              </button>
            </>
          ) : request.status === "accepted" ? (
            <span className="text-[12px] font-inter-tight text-[#10B981]">
              Request accepted
            </span>
          ) : (
            <span className="text-[12px] font-inter-tight text-[#EF4444]">
              Request declined
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <EmptyState
      title={
        searchQuery.trim()
          ? "No requests match your search"
          : dateRange && dateRange !== "all"
            ? "No requests match your filters"
            : filter === "pending"
              ? "No pending requests"
              : filter === "accepted"
                ? "No accepted requests"
                : filter === "rejected"
                  ? "No rejected requests"
                  : "No requests match your filters"
      }
      description={
        searchQuery.trim()
          ? "Try adjusting your search query"
          : dateRange && dateRange !== "all"
            ? "Try adjusting your date range"
            : filter === "pending"
              ? "New mentorship requests will appear here"
              : filter === "accepted"
                ? "Accepted requests will appear here"
                : filter === "rejected"
                  ? "Rejected requests will appear here"
                  : "Mentorship requests will appear here as they come in"
      }
    />
  );

  const renderContent = (gridCols: string) => (
    <>
      {isLoading && !isInitialLoad ? (
        <div
          className={`grid ${gridCols} gap-[7px] transition-opacity duration-200 opacity-50`}
        >
          {filteredRequests.length === 0 ? (
            <ApplicationsSkeleton />
          ) : (
            filteredRequests.map(renderRequestCard)
          )}
        </div>
      ) : (
        <div className={`grid ${gridCols} gap-[7px]`}>
          {filteredRequests.length === 0 ? (
            <div
              className={
                gridCols.includes("lg:grid-cols-2")
                  ? "col-span-1 lg:col-span-2"
                  : ""
              }
            >
              {renderEmptyState()}
            </div>
          ) : (
            filteredRequests.map(renderRequestCard)
          )}
        </div>
      )}
    </>
  );

  const handleAccept = (id: string) => {
    setSelectedRequestId(id);
    setAcceptModalOpen(true);
  };

  const handleReject = (id: string) => {
    setSelectedRequestId(id);
    setDeclineModalOpen(true);
  };

  const confirmAccept = async () => {
    if (!selectedRequestId) return;
    try {
      setIsActionLoading(true);
      await acceptRequest(selectedRequestId);
      toast({
        title: "Request accepted",
        description: "The mentorship session has been created",
      });
      await fetchRequests();
    } catch {
      toast({
        title: "Error",
        description: "Failed to accept request",
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const confirmDecline = async () => {
    if (!selectedRequestId) return;
    try {
      setIsActionLoading(true);
      await rejectRequest(selectedRequestId);
      toast({
        title: "Request declined",
        description: "The request has been declined",
      });
      await fetchRequests();
    } catch {
      toast({
        title: "Error",
        description: "Failed to decline request",
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  if (!hasAccess) {
    return <PageLoadingState message="Checking access..." />;
  }

  // Only show skeleton on initial load
  if (isInitialLoad && isLoading) {
    return (
      <div className="flex flex-col h-[calc(100vh-60px)] md:h-screen overflow-x-hidden bg-white">
        {/* Desktop Header */}
        <div className="hidden md:block w-full px-[25px] pt-[19px] pb-[16px] border-b border-[#E1E4EA] flex-shrink-0">
          <div className="flex items-center justify-between mb-[19px]">
            <h1 className="text-[16px] font-medium font-inter-tight text-black leading-[16px]">
              Mentorship Requests
            </h1>
          </div>

          {/* Search Bar and Date Range Filters */}
          <div className="flex items-center gap-[8px] mb-[19px]">
            <div className="flex-1 max-w-[585px]">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={setSearchQuery}
                placeholder="Search mentee, topic..."
                isLoading={false}
                debounceDelay={500}
              />
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
                  onClick={() => setDateRange(option.value)}
                  className={`h-[38px] px-[15px] py-[7px] flex items-center gap-[5px] rounded-[8px] flex-shrink-0 transition-colors text-[13px] font-normal font-inter-tight border ${
                    dateRange === option.value
                      ? "bg-[#8463FF0D] border-[#8463FF] text-[#8463FF]"
                      : "bg-[#F5F5F5] hover:bg-gray-100 text-black border-transparent"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Tabs - Desktop */}
          <div className="flex items-center gap-[8px] overflow-x-auto scrollbar-hide pb-[12px]">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-[12px] py-[6px] flex justify-center items-center whitespace-nowrap flex-shrink-0 rounded transition-colors ${
                  filter === tab.id
                    ? "text-black font-medium border-b-2 border-black"
                    : "text-black/30 font-medium hover:text-black/50"
                }`}
              >
                <span className="text-[13px] font-inter-tight">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex-1 overflow-y-auto">
          <div className="w-full px-4 pt-[19px] pb-4 border-b border-[#E1E4EA]">
            <div className="flex items-center justify-between mb-[19px]">
              <h1 className="text-[16px] font-medium font-inter-tight text-black leading-[16px]">
                Mentorship Requests
              </h1>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={setSearchQuery}
                placeholder="Search mentee, topic..."
                isLoading={false}
                debounceDelay={500}
              />
            </div>

            {/* Date Range Filter Buttons */}
            <div className="flex items-center gap-[6px] overflow-x-auto scrollbar-hide pb-1">
              {[
                { value: "all", label: "All Time" },
                { value: "today", label: "Today" },
                { value: "week", label: "This Week" },
                { value: "month", label: "This Month" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDateRange(option.value)}
                  className={`h-[44px] px-[15px] py-[7px] flex items-center gap-[5px] rounded-[8px] flex-shrink-0 transition-colors text-[13px] font-normal font-inter-tight border ${
                    dateRange === option.value
                      ? "bg-[#8463FF0D] border-[#8463FF] text-[#8463FF]"
                      : "bg-[#F5F5F5] hover:bg-gray-100 text-black border-transparent"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter Tabs - Sticky */}
          <div className="sticky top-0 z-10 bg-white px-4 py-2">
            <div className="flex items-center gap-[8px] overflow-x-auto scrollbar-hide">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-[12px] py-[6px] flex justify-center items-center whitespace-nowrap flex-shrink-0 rounded transition-colors ${
                    filter === tab.id
                      ? "text-black font-medium border-b-2 border-black"
                      : "text-black/30 font-medium hover:text-black/50"
                  }`}
                >
                  <span className="text-[13px] font-inter-tight">
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Content Loading */}
          <div className="p-4">
            <ApplicationsSkeleton />
          </div>
        </div>

        {/* Desktop Content Loading */}
        <div className="hidden md:block flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-6">
            <ApplicationsSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-60px)] md:h-screen overflow-x-hidden bg-white">
      {/* Desktop Header */}
      <div className="hidden md:block w-full px-[25px] pt-[19px] pb-[16px] border-b border-[#E1E4EA] flex-shrink-0">
        {/* Title Row */}
        <div className="flex items-center justify-between mb-[19px]">
          <h1 className="text-[16px] font-medium font-inter-tight text-black leading-[16px]">
            Mentorship Requests
          </h1>
          {pendingCount > 0 && (
            <div className="flex items-center gap-2 rounded-full bg-[#FFF4E5] px-3 py-1.5">
              <Clock className="h-4 w-4 text-[#F59E0B]" />
              <span className="font-inter-tight text-[13px] font-medium text-[#F59E0B]">
                {pendingCount} pending
              </span>
            </div>
          )}
        </div>

        {/* Search Bar and Date Range Filters */}
        <div className="flex items-center gap-[8px] mb-[19px]">
          <div className="flex-1 max-w-[585px]">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={setSearchQuery}
              placeholder="Search mentee, topic..."
              isLoading={isLoading && !isInitialLoad}
              debounceDelay={500}
            />
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
                onClick={() => setDateRange(option.value)}
                className={`h-[38px] px-[15px] py-[7px] flex items-center gap-[5px] rounded-[8px] flex-shrink-0 transition-colors text-[13px] font-normal font-inter-tight border ${
                  dateRange === option.value
                    ? "bg-[#8463FF0D] border-[#8463FF] text-[#8463FF]"
                    : "bg-[#F5F5F5] hover:bg-gray-100 text-black border-transparent"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Tabs - Desktop */}
        <div className="flex items-center gap-[8px] overflow-x-auto scrollbar-hide pb-[12px]">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-[12px] py-[6px] flex justify-center items-center whitespace-nowrap flex-shrink-0 rounded transition-colors ${
                filter === tab.id
                  ? "text-black font-medium border-b-2 border-black"
                  : "text-black/30 font-medium hover:text-black/50"
              }`}
            >
              <span className="text-[13px] font-inter-tight">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile: Single scroll container with sticky tabs */}
      <div className="md:hidden flex-1 overflow-y-auto">
        {/* Header - scrolls with content */}
        <div className="w-full px-4 pt-[19px] pb-4 border-b border-[#E1E4EA]">
          {/* Title Row */}
          <div className="flex items-center justify-between mb-[19px]">
            <h1 className="text-[16px] font-medium font-inter-tight text-black leading-[16px]">
              Mentorship Requests
            </h1>
            {pendingCount > 0 && (
              <div className="flex items-center gap-2 rounded-full bg-[#FFF4E5] px-3 py-1.5">
                <Clock className="h-4 w-4 text-[#F59E0B]" />
                <span className="font-inter-tight text-[13px] font-medium text-[#F59E0B]">
                  {pendingCount} pending
                </span>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="mb-4">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={setSearchQuery}
              placeholder="Search mentee, topic..."
              isLoading={isLoading && !isInitialLoad}
              debounceDelay={500}
            />
          </div>

          {/* Date Range Filter Buttons */}
          <div className="flex items-center gap-[6px] overflow-x-auto scrollbar-hide pb-1">
            {[
              { value: "all", label: "All Time" },
              { value: "today", label: "Today" },
              { value: "week", label: "This Week" },
              { value: "month", label: "This Month" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setDateRange(option.value)}
                className={`h-[44px] px-[15px] py-[7px] flex items-center gap-[5px] rounded-[8px] flex-shrink-0 transition-colors text-[13px] font-normal font-inter-tight border ${
                  dateRange === option.value
                    ? "bg-[#8463FF0D] border-[#8463FF] text-[#8463FF]"
                    : "bg-[#F5F5F5] hover:bg-gray-100 text-black border-transparent"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter Tabs - Sticky */}
        <div className="sticky top-0 z-10 bg-white px-4 py-2">
          <div className="flex items-center gap-[8px] overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-[12px] py-[6px] flex justify-center items-center whitespace-nowrap flex-shrink-0 rounded transition-colors ${
                  filter === tab.id
                    ? "text-black font-medium border-b-2 border-black"
                    : "text-black/30 font-medium hover:text-black/50"
                }`}
              >
                <span className="text-[13px] font-inter-tight">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Content */}
        <div className="p-4">{renderContent("grid-cols-1")}</div>

        {/* Pagination - Mobile */}
        {pagination && (
          <div className="px-4 py-4 border-t border-[#E1E4EA] bg-white">
            <div className="flex flex-col gap-3">
              <div className="text-[13px] text-[#525866] font-inter-tight text-center">
                Showing {pagination.offset + 1} to{" "}
                {Math.min(
                  pagination.offset + pagination.limit,
                  pagination.total,
                )}{" "}
                of {pagination.total} requests
              </div>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => {
                    setCurrentPage(currentPage - 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={!pagination.hasPreviousPage}
                  className="px-4 py-2 border border-[#E1E4EA] rounded-lg text-[13px] font-inter-tight disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 active:bg-gray-100 active:scale-95 transition-all"
                >
                  Previous
                </button>
                <span className="text-[13px] text-[#525866] font-inter-tight">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => {
                    setCurrentPage(currentPage + 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={!pagination.hasNextPage}
                  className="px-4 py-2 border border-[#E1E4EA] rounded-lg text-[13px] font-inter-tight disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 active:bg-gray-100 active:scale-95 transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Content */}
      <div className="hidden md:flex flex-1 overflow-hidden flex-col">
        <div className="flex-1 overflow-y-auto p-6">
          {renderContent("grid-cols-1 lg:grid-cols-2")}
        </div>

        {/* Pagination - Desktop */}
        {pagination && (
          <div className="flex-shrink-0 px-6 py-4 border-t border-[#E1E4EA] bg-white">
            <div className="flex items-center justify-between">
              <div className="text-[13px] text-[#525866] font-inter-tight">
                Showing {pagination.offset + 1} to{" "}
                {Math.min(
                  pagination.offset + pagination.limit,
                  pagination.total,
                )}{" "}
                of {pagination.total} requests
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!pagination.hasPreviousPage}
                  className="px-4 py-2 border border-[#E1E4EA] rounded-lg text-[13px] font-inter-tight disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 active:bg-gray-100 active:scale-95 transition-all"
                >
                  Previous
                </button>
                <span className="text-[13px] text-[#525866] font-inter-tight">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-4 py-2 border border-[#E1E4EA] rounded-lg text-[13px] font-inter-tight disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 active:bg-gray-100 active:scale-95 transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Accept Confirmation Modal */}
      <ConfirmationModal
        isOpen={acceptModalOpen}
        onClose={() => setAcceptModalOpen(false)}
        onConfirm={confirmAccept}
        title="Accept Request"
        description="Are you sure you want to accept this mentorship request? A session will be created."
        confirmText="Yes, Accept"
        type="success"
        isLoading={isActionLoading}
        confirmColor={ROLE_COLORS.mentor.dark}
      />

      {/* Decline Confirmation Modal */}
      <ConfirmationModal
        isOpen={declineModalOpen}
        onClose={() => setDeclineModalOpen(false)}
        onConfirm={confirmDecline}
        title="Decline Request"
        description="Are you sure you want to decline this mentorship request?"
        confirmText="Yes, Decline"
        type="danger"
        isLoading={isActionLoading}
        confirmColor={ROLE_COLORS.mentor.dark}
      />
    </div>
  );
}
