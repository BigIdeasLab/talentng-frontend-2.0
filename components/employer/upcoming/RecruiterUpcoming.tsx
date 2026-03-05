"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Briefcase,
  Search,
  X,
  SlidersHorizontal,
  Clock,
  MapPin,
} from "lucide-react";
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
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] =
    useState<ApplicationFilterState | null>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchData = useCallback(
    async (showLoading = true) => {
      try {
        // Only show loading skeleton on initial load
        if (showLoading && isInitialLoad) setIsLoading(true);
        const res = await getRecruiterInterviews({
          q: debouncedSearchQuery || undefined,
          dateRange:
            appliedFilters?.dateRange && appliedFilters.dateRange !== "all"
              ? (appliedFilters.dateRange as any)
              : undefined,
          limit: 100,
        });
        setItems(Array.isArray(res) ? res : res.data || []);
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
    [debouncedSearchQuery, appliedFilters, toast, isInitialLoad],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  return (
    <div className="h-screen overflow-x-hidden bg-white flex flex-col">
      {/* Header */}
      <div className="w-full px-[25px] pt-[19px] pb-[16px] border-b border-[#E1E4EA] flex-shrink-0">
        <h1 className="text-[16px] font-medium font-inter-tight text-black leading-[16px] mb-[19px]">
          Upcoming
        </h1>

        {/* Search Bar */}
        <div className="flex items-center gap-[8px] mb-[19px]">
          <div className="flex-1 max-w-[585px] h-[38px] px-[12px] py-[7px] flex items-center gap-[6px] border border-[#E1E4EA] rounded-[8px]">
            <Search className="w-[15px] h-[15px] text-[#B2B2B2] flex-shrink-0" />
            <input
              type="text"
              placeholder="Search interviews by candidate name or position..."
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

          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-1.5 px-3 h-9 rounded-lg transition-colors flex-shrink-0 ${
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
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-inter-tight bg-[#047857] text-white font-medium">
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
        <div className="h-full overflow-y-auto p-4 md:p-6">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[7px]">
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
                debouncedSearchQuery.trim()
                  ? "Try adjusting your search query"
                  : appliedFilters && appliedFilters.dateRange !== "all"
                    ? "Try adjusting your filters"
                    : "You have no upcoming interviews scheduled with candidates"
              }
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[7px]">
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
      </div>
    </div>
  );
}
