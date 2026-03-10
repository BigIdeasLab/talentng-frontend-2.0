"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar, Users, SlidersHorizontal } from "lucide-react";
import { SearchInput } from "@/components/ui/search-input";
import { useToast } from "@/hooks";
import { getMentorSessions } from "@/lib/api/mentorship";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";
import type { MentorshipSession } from "@/lib/api/mentorship/types";
import { MentorSessionCard } from "./MentorSessionCard";
import {
  ApplicationFilterModal,
  type ApplicationFilterState,
} from "@/components/talent/applications";
import { EmptyState } from "@/components/ui/empty-state";

interface UpcomingItem {
  type: "session";
  date: Date;
  session: MentorshipSession;
}

export function MentorUpcoming() {
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] =
    useState<ApplicationFilterState | null>(null);

  const fetchData = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) setIsLoading(true);
        const res = await getMentorSessions({
          q: searchQuery || undefined,
          dateRange:
            appliedFilters?.dateRange && appliedFilters.dateRange !== "all"
              ? (appliedFilters.dateRange as any)
              : undefined,
          limit: 100,
        });
        setItems(res.data || []);
      } catch (error) {
        console.error("Failed to load mentor upcoming data:", error);
        toast({
          title: "Error",
          description: "Failed to load upcoming sessions",
          variant: "destructive",
        });
      } finally {
        if (showLoading) setIsLoading(false);
      }
    },
    [searchQuery, appliedFilters, toast],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Subscribe to real-time updates for the feed
  useNotificationSocket({
    recipientRole: "mentor" as any,
    onMentorUpdate: () => {
      fetchData(false); // Refresh without full loading state
    },
    enabled: true,
  });

  // Map API items to component-friendly shapes
  const upcomingItems: UpcomingItem[] = items.map((item) => ({
    type: "session",
    date: new Date(item.startTime || item.date),
    session: {
      id: item.id,
      status: item.status,
      startTime: item.startTime,
      topic: item.title,
      mentee: {
        id: item.metadata?.menteeId,
        fullName: item.subtitle,
        profileImageUrl: item.image,
      },
    } as any,
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
          <div className="flex-1 max-w-[585px]">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={setSearchQuery}
              placeholder="Search sessions by topic or mentee name..."
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`h-[44px] px-[15px] py-[7px] flex items-center gap-[5px] rounded-[8px] flex-shrink-0 transition-colors ${
                appliedFilters && appliedFilters.dateRange !== "all"
                  ? "bg-[#8463FF0D] border border-[#8463FF] text-[#8463FF]"
                  : "bg-[#F5F5F5] hover:bg-gray-100 text-black border border-transparent"
              }`}
            >
              <SlidersHorizontal className="w-[15px] h-[15px]" />
              <span className="text-[13px] font-normal font-inter-tight">
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
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-inter-tight bg-[#e63c23] text-white font-medium">
            <Users className="w-3 h-3" />
            Sessions
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
              title="No upcoming sessions"
              description="You have no upcoming mentorship sessions scheduled"
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[7px]">
              {upcomingItems.map((item) => (
                <MentorSessionCard
                  key={`sess-${item.session.id}`}
                  session={item.session}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
