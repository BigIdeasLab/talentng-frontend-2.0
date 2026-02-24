"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Briefcase,
  Search,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { getRecruiterApplications } from "@/lib/api/applications/index";
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
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const appsData = await getRecruiterApplications({}).catch(() => []);
      setApplications(appsData || []);
    } catch (error) {
      console.error("Failed to load upcoming data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Build unified list of upcoming interviews
  const upcomingItems: UpcomingItem[] = [];

  applications.forEach((app) => {
    if (app.interviews && app.interviews.length > 0) {
      app.interviews.forEach((interview) => {
        if (interview.status !== "cancelled") {
          upcomingItems.push({
            type: "interview",
            date: new Date(interview.scheduledDate),
            interview: { interview, application: app },
          });
        }
      });
    }
  });

  upcomingItems.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Apply search filter
  const filteredItems = upcomingItems.filter((item) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const { application } = item.interview;
      const talent = application.user?.talentProfile;
      const candidateName = talent?.fullName || application.user?.username || "";
      return (
        application.opportunity.title.toLowerCase().includes(q) ||
        candidateName.toLowerCase().includes(q)
      );
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
              placeholder="Search interviews by candidate or position..."
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
          ) : filteredItems.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No upcoming interviews"
              description="You have no upcoming interviews scheduled with candidates"
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[7px]">
              {filteredItems.map((item) => (
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
