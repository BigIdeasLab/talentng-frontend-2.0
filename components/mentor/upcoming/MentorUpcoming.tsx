"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar, Users, Search, X, SlidersHorizontal } from "lucide-react";
import { getSessions } from "@/lib/api/mentorship";
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
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] =
    useState<ApplicationFilterState | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const sessionsResponse = await getSessions({ role: "mentor" }).catch(
        () => [],
      );
      const sessionsArray = Array.isArray(sessionsResponse)
        ? sessionsResponse
        : (sessionsResponse?.data ?? []);
      setSessions(sessionsArray);
    } catch (error) {
      console.error("Failed to load upcoming data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Build list of upcoming sessions
  const upcomingItems: UpcomingItem[] = [];

  sessions.forEach((session) => {
    if (session.status !== "cancelled" && session.status !== "completed") {
      const rawDate =
        session.startTime || session.scheduledAt || session.createdAt;
      upcomingItems.push({
        type: "session",
        date: new Date(rawDate),
        session,
      });
    }
  });

  upcomingItems.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Apply filters
  const filteredItems = upcomingItems.filter((item) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const mentee = item.session.mentee;
      if (
        !item.session.topic.toLowerCase().includes(q) &&
        !(mentee.fullName || mentee.name || "").toLowerCase().includes(q)
      )
        return false;
    }

    if (appliedFilters) {
      // Date Range Filter
      if (appliedFilters.dateRange !== "all") {
        const now = new Date();
        const diffDays = Math.floor(
          (item.date.getTime() - now.getTime()) / (1000 * 3600 * 24),
        );
        if (appliedFilters.dateRange === "today") {
          const isToday = item.date.toDateString() === now.toDateString();
          if (!isToday) return false;
        } else if (appliedFilters.dateRange === "week" && diffDays > 7) {
          return false;
        } else if (appliedFilters.dateRange === "month" && diffDays > 30) {
          return false;
        }
      }
    }

    return true;
  });

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
              placeholder="Search sessions by topic or mentee..."
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
              className={`h-[38px] px-[15px] py-[7px] flex items-center gap-[5px] rounded-[8px] flex-shrink-0 transition-colors ${
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
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-inter-tight bg-[#e63c23] text-white font-medium">
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
          ) : filteredItems.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No upcoming sessions"
              description="You have no upcoming mentorship sessions scheduled"
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[7px]">
              {filteredItems.map((item) => (
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
