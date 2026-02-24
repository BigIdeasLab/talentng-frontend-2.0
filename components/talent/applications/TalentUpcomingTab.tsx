"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar, Briefcase, Users } from "lucide-react";
import { getSessions } from "@/lib/api/mentorship";
import type { MentorshipSession } from "@/lib/api/mentorship/types";
import type {
  Application,
  ApplicationInterview,
} from "@/lib/api/applications/types";
import { TalentInterviewCard } from "./TalentInterviewCard";
import { TalentSessionCard } from "./TalentSessionCard";
import { EmptyState } from "@/components/ui/empty-state";

interface UpcomingItem {
  type: "interview" | "session";
  date: Date;
  interview?: {
    interview: ApplicationInterview;
    application: Application;
  };
  session?: MentorshipSession;
}

const UPCOMING_TABS = [
  { id: "all", label: "All", icon: Calendar },
  { id: "interviews", label: "Interviews", icon: Briefcase },
  { id: "sessions", label: "Sessions", icon: Users },
];

interface TalentUpcomingTabProps {
  jobApplications: Application[];
}

export function TalentUpcomingTab({ jobApplications }: TalentUpcomingTabProps) {
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchSessions = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getSessions({ role: "mentee" });
      const sessionsArray = Array.isArray(response)
        ? response
        : (response?.data ?? []);
      setSessions(sessionsArray);
    } catch (error) {
      console.error("Failed to load sessions:", error);
      setSessions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Build unified list from interviews + sessions
  const upcomingItems: UpcomingItem[] = [];

  // Extract interviews from job applications
  jobApplications.forEach((app) => {
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

  // Add mentorship sessions
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

  // Sort by date (nearest first)
  upcomingItems.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Apply filter
  const filteredItems = upcomingItems.filter((item) => {
    if (filter === "all") return true;
    if (filter === "interviews") return item.type === "interview";
    if (filter === "sessions") return item.type === "session";
    return true;
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[7px]">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-[180px] rounded-[16px] bg-gray-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Sub-filter tabs */}
      <div className="flex items-center gap-2">
        {UPCOMING_TABS.map((tab) => {
          const Icon = tab.icon;
          const count =
            tab.id === "all"
              ? upcomingItems.length
              : tab.id === "interviews"
                ? upcomingItems.filter((i) => i.type === "interview").length
                : upcomingItems.filter((i) => i.type === "session").length;
          return (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-inter-tight transition-colors ${
                filter === tab.id
                  ? "bg-[#5C30FF] text-white font-medium"
                  : "bg-[#F5F5F5] text-[#525866] hover:bg-gray-200"
              }`}
            >
              <Icon className="w-3 h-3" />
              {tab.label}
              {count > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                    filter === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-white text-[#525866]"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {filteredItems.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No upcoming events"
          description={
            filter === "interviews"
              ? "You have no upcoming interviews"
              : filter === "sessions"
                ? "You have no upcoming mentorship sessions"
                : "You have no upcoming interviews or sessions"
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[7px]">
          {filteredItems.map((item, idx) => {
            if (item.type === "interview" && item.interview) {
              const { interview, application } = item.interview;
              return (
                <TalentInterviewCard
                  key={`int-${interview.id}`}
                  interview={interview}
                  opportunityTitle={application.opportunity.title}
                  company={application.opportunity.company}
                  opportunityId={application.opportunityId}
                  companyLogo={application.opportunity.logo}
                />
              );
            }
            if (item.type === "session" && item.session) {
              return (
                <TalentSessionCard
                  key={`sess-${item.session.id}`}
                  session={item.session}
                />
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
}
