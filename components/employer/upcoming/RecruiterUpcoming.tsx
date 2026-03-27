"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Briefcase,
  SlidersHorizontal,
  Clock,
  MapPin,
} from "lucide-react";
import { SearchInput } from "@/components/ui/search-input";
import {
  ApplicationFilterModal,
  type ApplicationFilterState,
} from "@/components/talent/applications";
import { useToast } from "@/hooks";
import { getRecruiterInterviews } from "@/lib/api/applications/index";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";
import type {
  Application,
  ApplicationInterview,
} from "@/lib/api/applications/types";
import { RecruiterInterviewCard } from "./RecruiterInterviewCard";
import { EmptyState } from "@/components/ui/empty-state";

interface UpcomingItem {
  type: "interview";
  date: Date;
  interview: {
    interview: ApplicationInterview;
    application: Application;
  };
}

export function RecruiterUpcoming() {
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] =
    useState<ApplicationFilterState | null>(null);
  const [offset, setOffset] = useState(0);

  const LIMIT = 20;

  const fetchData = useCallback(
    async (showLoading = true) => {
      try {
        // Only show loading skeleton on initial load
        if (showLoading && isInitialLoad) setIsLoading(true);
        const res = await getRecruiterInterviews({
          q: searchQuery || undefined,
          dateRange:
            appliedFilters?.dateRange && appliedFilters.dateRange !== "all"
              ? (appliedFilters.dateRange as any)
              : undefined,
          limit: LIMIT,
          offset: offset,
        });
        const responseData = Array.isArray(res) ? res : res.data || [];
        const responsePagination = Array.isArray(res)
          ? null
          : res.pagination || null;

        setItems(responseData);
        setPagination(responsePagination);

        console.log("Interviews API Response:", {
          dataLength: responseData.length,
          pagination: responsePagination,
        });

        if (isInitialLoad) setIsInitialLoad(false);
      } catch (error) {
        console.error("Failed to load recruiter upcoming data:", error);
        toast({
          title: "Error",
          description: "Failed to load upcoming interviews",
          variant: "destructive",
        });
      } finally {
        if (showLoading && isInitialLoad) setIsLoading(false);
      }
    },
    [searchQuery, appliedFilters, offset, toast, isInitialLoad],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset to page 0 when filters change
  useEffect(() => {
    setOffset(0);
  }, [searchQuery, appliedFilters]);

  // Subscribe to real-time updates for the feed
  useNotificationSocket({
    recipientRole: "recruiter",
    onRecruiterUpdate: () => {
      fetchData(false); // Refresh without full loading state
    },
    enabled: true,
  });

  // Map API items to component-friendly shapes
  const upcomingItems: UpcomingItem[] = items.map((item) => ({
    type: "interview",
    date: new Date(item.scheduledDate),
    interview: {
      interview: {
        id: item.id,
        status: item.status,
        scheduledDate: item.scheduledDate,
        meetingLink: item.meetingLink,
        message: item.message,
      } as any,
      application: {
        id: item.application.id,
        opportunityId: item.application.opportunity.id,
        opportunity: {
          title: item.application.opportunity.title,
          company: item.application.opportunity.company,
        },
        user: {
          id: item.application.user.id,
          username: item.application.user.username,
          talentProfile: {
            fullName: item.application.user.talentProfile.fullName,
            profileImageUrl:
              item.application.user.talentProfile.profileImageUrl,
          },
        },
      } as any,
    },
  }));

  upcomingItems.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Pagination handlers
  const handleNextPage = () => {
    if (pagination?.hasNextPage) {
      setOffset(offset + LIMIT);
    }
  };

  const handlePreviousPage = () => {
    if (pagination?.hasPreviousPage) {
      setOffset(Math.max(0, offset - LIMIT));
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-60px)] md:h-screen overflow-x-hidden bg-white">
      {/* Header */}
      <div className="w-full px-4 md:px-[25px] pt-[19px] pb-[16px] border-b border-[#E1E4EA] flex-shrink-0">
        <h1 className="text-[16px] font-medium font-inter-tight text-black leading-[16px] mb-[19px]">
          Upcoming
        </h1>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-[8px] mb-[19px]">
          <div className="flex-1 w-full md:max-w-[585px]">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={setSearchQuery}
              placeholder="Search interviews by candidate name or position..."
              debounceDelay={500}
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center justify-center gap-1.5 px-3 min-h-[44px] md:h-9 rounded-lg transition-colors flex-shrink-0 w-full md:w-auto ${
                appliedFilters && appliedFilters.dateRange !== "all"
                  ? "bg-[#8463FF0D] border border-[#8463FF] text-[#8463FF]"
                  : "hover:bg-gray-50 border border-transparent"
              }`}
            >
              <SlidersHorizontal className="w-[15px] h-[15px]" />
              <span className="text-xs font-normal font-inter-tight">
                Filter
              </span>
              {appliedFilters && appliedFilters.dateRange !== "all" && (
                <span className="ml-1 bg-[#8463FF] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  1
                </span>
              )}
            </button>
            <ApplicationFilterModal
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              onApply={(filters: ApplicationFilterState) => {
                setAppliedFilters(filters);
                setIsFilterOpen(false);
              }}
              initialFilters={appliedFilters || undefined}
            />
          </div>
        </div>

        {/* Filter Tab */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 md:py-1.5 rounded-full text-[12px] font-inter-tight bg-[#047857] text-white font-medium min-h-[44px] md:min-h-0">
            <Briefcase className="w-3 h-3" />
            Interviews
            {upcomingItems.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-white/20 text-white">
                {upcomingItems.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="p-4 md:p-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[7px]">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-[180px] rounded-[16px] bg-gray-100 animate-pulse"
                  />
                ))}
              </div>
            ) : upcomingItems.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="No upcoming interviews"
                description={
                  searchQuery.trim()
                    ? "Try adjusting your search query"
                    : appliedFilters && appliedFilters.dateRange !== "all"
                      ? "Try adjusting your filters"
                      : "You have no upcoming interviews scheduled with candidates"
                }
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[7px]">
                {upcomingItems.map((item) => (
                  <RecruiterInterviewCard
                    key={`int-${item.interview.interview.id}`}
                    interview={item.interview.interview}
                    application={item.interview.application}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pagination Controls - Desktop */}
          {pagination && (
            <div className="hidden md:flex items-center justify-between px-5 py-4 border-t border-[#E1E4EA]">
              <div className="text-[13px] text-[#525866] font-inter-tight">
                Showing {pagination.offset + 1} to{" "}
                {Math.min(
                  pagination.offset + pagination.limit,
                  pagination.total,
                )}{" "}
                of {pagination.total} interviews
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={!pagination.hasPreviousPage}
                  className="px-4 py-2 border border-[#E1E4EA] rounded-lg text-[13px] font-inter-tight disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 active:bg-gray-100 active:scale-95 transition-all"
                >
                  Previous
                </button>
                <span className="text-[13px] text-[#525866] font-inter-tight">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={!pagination.hasNextPage}
                  className="px-4 py-2 border border-[#E1E4EA] rounded-lg text-[13px] font-inter-tight disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 active:bg-gray-100 active:scale-95 transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Pagination Controls - Mobile */}
          {pagination && (
            <div className="md:hidden px-4 py-4 border-t border-[#E1E4EA] bg-white">
              <div className="flex flex-col gap-3">
                <div className="text-[13px] text-[#525866] font-inter-tight text-center">
                  Showing {pagination.offset + 1} to{" "}
                  {Math.min(
                    pagination.offset + pagination.limit,
                    pagination.total,
                  )}{" "}
                  of {pagination.total} interviews
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      handlePreviousPage();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    disabled={!pagination.hasPreviousPage}
                    className="px-4 py-2 border border-[#E1E4EA] rounded-lg text-[13px] font-inter-tight disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 active:bg-gray-100 active:scale-95 transition-all min-h-[44px]"
                  >
                    Previous
                  </button>
                  <span className="text-[13px] text-[#525866] font-inter-tight">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => {
                      handleNextPage();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    disabled={!pagination.hasNextPage}
                    className="px-4 py-2 border border-[#E1E4EA] rounded-lg text-[13px] font-inter-tight disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 active:bg-gray-100 active:scale-95 transition-all min-h-[44px]"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
