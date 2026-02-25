"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Briefcase,
  Users,
  Search,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { useToast } from "@/hooks";
import { useProfile } from "@/hooks/useProfile";
import { getTalentApplications } from "@/lib/api/applications/index";
import { getSessions } from "@/lib/api/mentorship";
import type {
  Application,
  ApplicationInterview,
} from "@/lib/api/applications/types";
import type { MentorshipSession } from "@/lib/api/mentorship/types";
import { TalentInterviewCard } from "@/components/talent/applications/TalentInterviewCard";
import { TalentSessionCard } from "@/components/talent/applications/TalentSessionCard";
import { EmptyState } from "@/components/ui/empty-state";
import { RecruiterUpcoming } from "@/components/employer/upcoming/RecruiterUpcoming";
import { LoadingScreen } from "@/components/layouts/LoadingScreen";
import { useRouter } from "next/navigation";

interface UpcomingItem {
  type: "interview" | "session";
  date: Date;
  interview?: {
    interview: ApplicationInterview;
    application: Application;
  };
  session?: MentorshipSession;
}

const FILTER_TABS = [
  { id: "all", label: "All", icon: Calendar },
  { id: "interviews", label: "Interviews", icon: Briefcase },
  { id: "sessions", label: "Sessions", icon: Users },
];

export default function UpcomingPage() {
  const { activeRole, isLoading: roleLoading } = useProfile();
  const router = useRouter();

  useEffect(() => {
    if (!roleLoading && activeRole === "mentor") {
      router.replace("/sessions");
    }
  }, [activeRole, roleLoading, router]);

  if (roleLoading || !activeRole || activeRole === "mentor") {
    return <LoadingScreen />;
  }

  if (activeRole === "recruiter") {
    return <RecruiterUpcoming />;
  }

  return <TalentUpcoming />;
}

function TalentUpcoming() {
  const { toast } = useToast();

  const [jobApplications, setJobApplications] = useState<Application[]>([]);
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [appsData, sessionsResponse] = await Promise.all([
        getTalentApplications().catch(() => []),
        getSessions({ role: "mentee" }).catch(() => []),
      ]);
      setJobApplications(appsData || []);
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

  // Build unified list
  const upcomingItems: UpcomingItem[] = [];

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
    if (filter === "interviews" && item.type !== "interview") return false;
    if (filter === "sessions" && item.type !== "session") return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (item.type === "interview" && item.interview) {
        const { application } = item.interview;
        return (
          application.opportunity.title.toLowerCase().includes(q) ||
          application.opportunity.company.toLowerCase().includes(q)
        );
      }
      if (item.type === "session" && item.session) {
        const mentor = item.session.mentor;
        return (
          item.session.topic.toLowerCase().includes(q) ||
          (mentor.fullName || mentor.name || "").toLowerCase().includes(q)
        );
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
              placeholder="Search interviews, sessions..."
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

        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          {FILTER_TABS.map((tab) => {
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
              {filteredItems.map((item) => {
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
      </div>
    </div>
  );
}
