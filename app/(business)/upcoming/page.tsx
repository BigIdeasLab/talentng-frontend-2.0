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
import { getTalentUpcoming } from "@/lib/api/talent";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";
import type {
  Application,
  ApplicationInterview,
} from "@/lib/api/applications/types";
import type { MentorshipSession } from "@/lib/api/mentorship/types";
import { TalentInterviewCard } from "@/components/talent/applications/TalentInterviewCard";
import { TalentSessionCard } from "@/components/talent/applications/TalentSessionCard";
import {
  ApplicationFilterModal,
  type ApplicationFilterState,
} from "@/components/talent/applications";
import { EmptyState } from "@/components/ui/empty-state";
import { RecruiterUpcoming } from "@/components/employer/upcoming/RecruiterUpcoming";
import { LoadingScreen } from "@/components/layouts/LoadingScreen";
import { useRouter } from "next/navigation";
import { useRequireRole } from "@/hooks/useRequireRole";

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
  const hasAccess = useRequireRole(["talent", "recruiter", "mentor"]);

  useEffect(() => {
    if (!roleLoading && activeRole === "mentor") {
      router.replace("/sessions");
    }
  }, [activeRole, roleLoading, router]);

  if (roleLoading || !activeRole || !hasAccess || activeRole === "mentor") {
    return <LoadingScreen />;
  }

  if (activeRole === "recruiter") {
    return <RecruiterUpcoming />;
  }

  return <TalentUpcoming />;
}

function TalentUpcoming() {
  const { toast } = useToast();

  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] =
    useState<ApplicationFilterState | null>(null);

  const fetchData = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) setIsLoading(true);
        const res = await getTalentUpcoming({
          q: searchQuery,
          dateRange:
            appliedFilters?.dateRange && appliedFilters.dateRange !== "all"
              ? (appliedFilters.dateRange as any)
              : undefined,
          limit: 100,
        });

        setItems(res.data || []);
      } catch (error) {
        console.error("Failed to load upcoming data:", error);
        toast({
          title: "Error",
          description: "Failed to refresh upcoming events",
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
    recipientRole: "talent",
    onUpcomingUpdate: () => {
      fetchData(false);
    },
    enabled: true,
  });

  // Build unified list compatible with local filtering
  const upcomingItems: UpcomingItem[] = items.map((item) => ({
    type: item.type,
    date: new Date(item.startTime || item.date),
    ...(item.type === "interview"
      ? {
          interview: {
            interview: {
              id: item.id,
              status: item.status,
              scheduledDate: item.startTime,
              meetingLink: item.meetingLink,
              message: item.message,
            } as any,
            application: {
              opportunityId: item.metadata?.opportunityId,
              opportunity: {
                title: item.title,
                company: item.subtitle,
                logo: item.image,
              },
            } as any,
          },
        }
      : {
          session: {
            id: item.id,
            status: item.status,
            startTime: item.startTime,
            topic: item.title,
            mentor: {
              id: item.metadata?.mentorId,
              fullName: item.subtitle,
              profileImageUrl: item.image,
            },
          } as any,
        }),
  }));

  upcomingItems.sort((a, b) => a.date.getTime() - b.date.getTime());

  const filteredItems = upcomingItems.filter((item) => {
    if (filter === "interviews" && item.type !== "interview") return false;
    if (filter === "sessions" && item.type !== "session") return false;
    return true;
  });

  return (
    <div className="h-screen overflow-x-hidden bg-white flex flex-col">
      <div className="w-full px-[25px] pt-[19px] pb-[16px] border-b border-[#E1E4EA] flex-shrink-0">
        <h1 className="text-[16px] font-medium font-inter-tight text-black leading-[16px] mb-[19px]">
          Upcoming
        </h1>

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

          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`h-[38px] px-[15px] py-[7px] flex items-center gap-[5px] rounded-[8px] flex-shrink-0 transition-colors ${
                appliedFilters &&
                (appliedFilters.dateRange !== "all" ||
                  (appliedFilters.type && appliedFilters.type.length > 0))
                  ? "bg-[#8463FF0D] border border-[#8463FF] text-[#8463FF]"
                  : "bg-[#F5F5F5] hover:bg-gray-100 text-black border border-transparent"
              }`}
            >
              <SlidersHorizontal className="w-[15px] h-[15px]" />
              <span className="text-[13px] font-normal font-inter-tight">
                Filter
              </span>
              {appliedFilters &&
                (appliedFilters.dateRange !== "all" ||
                  (appliedFilters.type && appliedFilters.type.length > 0)) && (
                  <span className="ml-1 bg-[#8463FF] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {(appliedFilters.dateRange !== "all" ? 1 : 0) +
                      (appliedFilters.type?.length || 0)}
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
              availableTypes={
                filter !== "sessions"
                  ? [
                      { label: "Job Listing", value: "Job" },
                      { label: "Internship", value: "Internship" },
                      { label: "Volunteer", value: "Volunteer" },
                      { label: "Part-time", value: "PartTime" },
                    ]
                  : []
              }
            />
          </div>
        </div>

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
