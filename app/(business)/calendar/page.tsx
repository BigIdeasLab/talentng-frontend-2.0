"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Calendar, Briefcase, Users } from "lucide-react";
import { SearchInput } from "@/components/ui/search-input";
import { useToast } from "@/hooks";
import { useProfile } from "@/hooks/useProfile";
import { getTalentUpcoming } from "@/lib/api/talent";
import {
  cancelSession,
  rescheduleSession,
  confirmSessionCompletion,
  createSessionReview,
} from "@/lib/api/mentorship";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";
import type {
  Application,
  ApplicationInterview,
} from "@/lib/api/applications/types";
import type { MentorshipSession } from "@/lib/api/mentorship/types";
import { TalentInterviewCard } from "@/components/talent/applications/TalentInterviewCard";
import { TalentSessionCard } from "@/components/talent/applications/TalentSessionCard";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { RescheduleModal } from "@/components/ui/reschedule-modal";
import { ReviewModal } from "@/components/ui/review-modal";
import { SuccessModal } from "@/components/ui/success-modal";
import { RecruiterUpcoming } from "@/components/employer/upcoming/RecruiterUpcoming";
import { LoadingScreen } from "@/components/layouts/LoadingScreen";
import { useRouter } from "next/navigation";
import { useRequireRole } from "@/hooks/useRequireRole";
import { ROLE_COLORS } from "@/lib/theme/role-colors";

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
  const [displayedItems, setDisplayedItems] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [dateRange, setDateRange] = useState<string>("all");
  const [needsReviewCount, setNeedsReviewCount] = useState(0);
  const [totalCounts, setTotalCounts] = useState({
    all: 0,
    interviews: 0,
    sessions: 0,
  });
  const isInitialLoadRef = useRef(true);
  const fetchIdRef = useRef(0);

  // Session action states
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  );
  const [selectedMentorId, setSelectedMentorId] = useState<string>("");
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [confirmCompletionModalOpen, setConfirmCompletionModalOpen] =
    useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  
  // Success modal states
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successModalConfig, setSuccessModalConfig] = useState({
    title: "",
    description: "",
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery, dateRange, filter]);

  const fetchData = useCallback(
    async (showLoading = true) => {
      const currentFetchId = ++fetchIdRef.current;

      try {
        // Only show loading skeleton on initial load, not on filter changes
        if (showLoading && isInitialLoadRef.current) {
          setIsLoading(true);
        }

        const apiParams = {
          q: searchQuery || undefined,
          dateRange:
            dateRange && dateRange !== "all" && dateRange !== "needs-review"
              ? (dateRange as "today" | "week" | "month" | "past")
              : dateRange === "needs-review"
                ? ("past" as const)
                : undefined,
          type: (filter === "interviews"
            ? "interview"
            : filter === "sessions"
              ? "session"
              : undefined) as "interview" | "session" | undefined,
          limit: 20,
          offset: currentPage * 20,
        };

        console.log("📅 Calendar API Request:", {
          dateRange,
          filter,
          searchQuery,
          apiParams,
        });

        const res = await getTalentUpcoming(apiParams);

        console.log("📅 Calendar API Response:", {
          dateRange,
          totalItems: res.items?.length || res.data?.length || 0,
          pagination: res.pagination,
          firstItem: (res.items || res.data)?.[0],
        });

        // Discard stale responses
        if (currentFetchId !== fetchIdRef.current) return;

        // Debug: Log the response when fetching past events
        if (dateRange === "past" || dateRange === "needs-review") {
          console.log("🕐 PAST EVENTS DETAILS:", {
            totalPastEvents: res.items?.length || res.data?.length || 0,
            sessions: (res.items || res.data || []).filter((item: any) => item.type === "session"),
            completedSessions: (res.items || res.data || []).filter(
              (item: any) => item.type === "session" && item.status === "completed"
            ),
            fullResponse: res,
          });
        }

        // Backend returns 'items' not 'data'
        let items = res.items || res.data || [];

        // Filter for "needs-review": only show completed sessions without reviews
        if (dateRange === "needs-review") {
          items = items.filter(
            (item: any) =>
              item.type === "session" &&
              item.status === "completed" &&
              !item.hasReview
          );
          console.log("🔍 NEEDS REVIEW FILTER:", {
            totalFiltered: items.length,
            filteredSessions: items,
          });
        }

        // Always calculate needs review count (fetch from past events if not already fetched)
        if (dateRange !== "needs-review" && dateRange !== "past") {
          // Fetch past events to get the count
          try {
            const pastRes = await getTalentUpcoming({
              dateRange: "past",
              type: "session",
              limit: 100, // Get enough to count
            });
            const pastItems = pastRes.items || pastRes.data || [];
            const needsReview = pastItems.filter(
              (item: any) =>
                item.type === "session" &&
                item.status === "completed" &&
                !item.hasReview
            ).length;
            setNeedsReviewCount(needsReview);
          } catch (error) {
            console.error("Failed to fetch needs review count:", error);
          }
        } else {
          // Calculate from current items if we're already viewing past/needs-review
          const allItems = res.items || res.data || [];
          const needsReview = allItems.filter(
            (item: any) =>
              item.type === "session" &&
              item.status === "completed" &&
              !item.hasReview
          ).length;
          setNeedsReviewCount(needsReview);
        }
        setItems(items);
        setDisplayedItems(items);
        setPagination(res.pagination || null);

        // Update counts based on current filter
        if (filter === "all") {
          const interviews = items.filter(
            (item: any) => item.type === "interview",
          ).length;
          const sessions = items.filter(
            (item: any) => item.type === "session",
          ).length;
          setTotalCounts({
            all: res.pagination?.total || 0,
            interviews,
            sessions,
          });
        } else if (filter === "interviews") {
          setTotalCounts((prev) => ({
            ...prev,
            interviews: res.pagination?.total || 0,
          }));
        } else if (filter === "sessions") {
          setTotalCounts((prev) => ({
            ...prev,
            sessions: res.pagination?.total || 0,
          }));
        }

        isInitialLoadRef.current = false;
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load upcoming data:", error);
        toast({
          title: "Error",
          description: "Failed to refresh upcoming events",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    },
    [searchQuery, dateRange, filter, currentPage, toast],
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

  // Session action handlers
  const handleCancelSession = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setCancelModalOpen(true);
  };

  const confirmCancelSession = async () => {
    if (!selectedSessionId) return;
    try {
      setIsActionLoading(true);
      await cancelSession(selectedSessionId);
      setCancelModalOpen(false);
      setSelectedSessionId(null);
      await fetchData(false);
      setSuccessModalConfig({
        title: "Session Cancelled",
        description: "The session has been cancelled successfully",
      });
      setSuccessModalOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel session",
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRescheduleSession = (sessionId: string) => {
    const session = items.find((item) => item.id === sessionId);
    setSelectedSessionId(sessionId);
    setSelectedMentorId(session?.mentorId || "");
    setRescheduleModalOpen(true);
  };

  const confirmRescheduleSession = async (
    date: string,
    startTime: string,
    endTime: string,
  ) => {
    if (!selectedSessionId) return;
    try {
      setIsActionLoading(true);
      await rescheduleSession(selectedSessionId, {
        newStartTime: `${date}T${startTime}`,
        newEndTime: `${date}T${endTime}`,
      });
      setRescheduleModalOpen(false);
      setSelectedSessionId(null);
      await fetchData(false);
      setSuccessModalConfig({
        title: "Session Rescheduled",
        description: "The session has been rescheduled successfully",
      });
      setSuccessModalOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reschedule session",
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleConfirmCompletion = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setConfirmCompletionModalOpen(true);
  };

  const confirmSessionCompletionAction = async () => {
    if (!selectedSessionId) return;
    try {
      setIsActionLoading(true);
      await confirmSessionCompletion(selectedSessionId);
      setConfirmCompletionModalOpen(false);
      setSelectedSessionId(null);
      await fetchData(false);
      setSuccessModalConfig({
        title: "Session Completed",
        description: "Thank you for confirming the session completion",
      });
      setSuccessModalOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to confirm session completion",
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleLeaveReview = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setReviewModalOpen(true);
  };

  const confirmLeaveReview = async (rating: number, comment: string) => {
    if (!selectedSessionId) return;
    try {
      setIsActionLoading(true);
      await createSessionReview(selectedSessionId, { rating, comment });
      setReviewModalOpen(false);
      setSelectedSessionId(null);
      await fetchData(false);
      setSuccessModalConfig({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
      });
      setSuccessModalOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  // Build unified list compatible with local filtering
  const upcomingItems: UpcomingItem[] = displayedItems.map((item) => ({
    type: item.type,
    date: new Date(item.scheduledAt || item.startTime || item.date),
    ...(item.type === "interview"
      ? {
          interview: {
            interview: {
              id: item.id,
              status: item.status,
              scheduledDate: item.scheduledAt || item.startTime,
              meetingLink: item.meetingLink,
              message: item.message,
            } as any,
            application: {
              opportunityId: item.opportunityId || item.metadata?.opportunityId,
              opportunity: {
                title: item.position || item.title,
                company: item.company || item.subtitle,
                logo: item.logo || item.image,
                // The API doesn't include opportunity type in the Interview object
                // This would need to be added to the backend API response
                type: null,
              },
            } as any,
          },
        }
      : {
          session: {
            id: item.id,
            status: item.status,
            startTime: item.scheduledAt || item.startTime,
            topic: item.topic || item.title,
            meetingLink: item.meetingLink,
            hasReview: item.hasReview, // Include hasReview field from backend
            mentor: {
              // Backend now returns mentor profile ID in mentorId field
              id: item.mentorId,
              fullName: item.mentorName || item.subtitle,
              profileImageUrl: item.mentorImage || item.image,
            },
          } as any,
        }),
  }));

  // Log session mapping for debugging
  if (dateRange === "past" || dateRange === "needs-review") {
    console.log("🎯 MAPPED SESSIONS:", {
      dateRangeFilter: dateRange,
      totalMapped: upcomingItems.length,
      sessions: upcomingItems.filter(item => item.type === "session"),
      sessionsWithReviewStatus: upcomingItems
        .filter(item => item.type === "session")
        .map(item => ({
          id: item.session?.id,
          status: item.session?.status,
          hasReview: item.session?.hasReview,
          topic: item.session?.topic,
        })),
    });
  }

  upcomingItems.sort((a, b) => {
    // For past events, sort newest first (descending)
    if (dateRange === "past") {
      return b.date.getTime() - a.date.getTime();
    }
    // For upcoming events, sort oldest first (ascending)
    return a.date.getTime() - b.date.getTime();
  });

  // Server already handles filtering by type, so we just display all items
  const filteredItems = upcomingItems;

  // Use stored counts that don't change when switching tabs
  const totalCount = totalCounts.all;
  const interviewCount = totalCounts.interviews;
  const sessionCount = totalCounts.sessions;

  return (
    <div className="h-screen overflow-x-hidden bg-white flex flex-col">
      <div className="w-full px-[25px] pt-[19px] pb-[16px] border-b border-[#E1E4EA] flex-shrink-0">
        <h1 className="text-[16px] font-medium font-inter-tight text-black leading-[16px] mb-[19px]">
          Calendar
        </h1>

        <div className="flex items-center gap-[8px] mb-[19px]">
          <div className="flex-1 max-w-[585px]">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={setSearchQuery}
              placeholder="Search interviews, sessions..."
              debounceDelay={500}
            />
          </div>

          {/* Date Range Filter Buttons */}
          <div className="flex items-center gap-[6px]">
            {[
              { value: "all", label: "Upcoming" },
              { value: "today", label: "Today" },
              { value: "week", label: "This Week" },
              { value: "month", label: "This Month" },
              { value: "needs-review", label: "Needs Review" },
              { value: "past", label: "Past" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setDateRange(option.value)}
                className={`h-[38px] px-[15px] py-[7px] flex items-center gap-[5px] rounded-[8px] flex-shrink-0 transition-colors text-[13px] font-normal font-inter-tight border relative ${
                  dateRange === option.value
                    ? "bg-[#8463FF0D] border-[#8463FF] text-[#8463FF]"
                    : "bg-[#F5F5F5] hover:bg-gray-100 text-black border-transparent"
                }`}
              >
                {option.label}
                {option.value === "needs-review" && needsReviewCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#EF4444] text-white text-[10px] min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full font-medium">
                    {needsReviewCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {FILTER_TABS.map((tab) => {
            const Icon = tab.icon;
            const count =
              tab.id === "all"
                ? totalCount
                : tab.id === "interviews"
                  ? interviewCount
                  : sessionCount;
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

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
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
              title={
                searchQuery
                  ? "No events match your search"
                  : dateRange !== "all"
                    ? "No events match your filters"
                    : "No upcoming events"
              }
              description={
                searchQuery
                  ? "Try adjusting your search query"
                  : dateRange !== "all"
                    ? dateRange === "past"
                      ? "Try adjusting your filters"
                      : dateRange === "needs-review"
                        ? "No completed sessions need review. All sessions have been reviewed!"
                        : "Try adjusting your filters"
                    : filter === "interviews"
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
                      opportunityType={application.opportunity.type}
                    />
                  );
                }
                if (item.type === "session" && item.session) {
                  return (
                    <TalentSessionCard
                      key={`sess-${item.session.id}`}
                      session={item.session}
                      onCancel={handleCancelSession}
                      onReschedule={handleRescheduleSession}
                      onConfirmCompletion={handleConfirmCompletion}
                      onLeaveReview={handleLeaveReview}
                    />
                  );
                }
                return null;
              })}
            </div>
          )}
        </div>

        {/* Pagination - Fixed at bottom */}
        {!isLoading && pagination && pagination.total > 0 && (
          <div className="flex-shrink-0 px-4 md:px-6 py-4 border-t border-[#E1E4EA] bg-white">
            <div className="flex items-center justify-between">
              <div className="text-[13px] text-[#525866] font-inter-tight">
                Showing {pagination.offset + 1} to{" "}
                {Math.min(
                  pagination.offset + pagination.limit,
                  pagination.total,
                )}{" "}
                of {pagination.total} events
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!pagination.hasPreviousPage}
                  className="px-4 py-2 border border-[#E1E4EA] rounded-lg text-[13px] font-inter-tight disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                <span className="text-[13px] text-[#525866] font-inter-tight">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-4 py-2 border border-[#E1E4EA] rounded-lg text-[13px] font-inter-tight disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cancel Session Modal */}
      <ConfirmationModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={confirmCancelSession}
        title="Cancel Session"
        description="Are you sure you want to cancel this session? This action cannot be undone."
        confirmText="Yes, Cancel"
        type="danger"
        isLoading={isActionLoading}
        confirmColor={ROLE_COLORS.talent.dark}
      />

      {/* Reschedule Session Modal */}
      <RescheduleModal
        isOpen={rescheduleModalOpen}
        onClose={() => setRescheduleModalOpen(false)}
        isLoading={isActionLoading}
        onConfirm={confirmRescheduleSession}
        mentorId={selectedMentorId}
        accentColor={ROLE_COLORS.talent.dark}
      />

      {/* Confirm Completion Modal */}
      <ConfirmationModal
        isOpen={confirmCompletionModalOpen}
        onClose={() => setConfirmCompletionModalOpen(false)}
        onConfirm={confirmSessionCompletionAction}
        title="Confirm Session Completion"
        description="Please confirm that this session was completed successfully."
        confirmText="Confirm"
        type="success"
        isLoading={isActionLoading}
        confirmColor={ROLE_COLORS.talent.dark}
      />

      {/* Leave Review Modal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onConfirm={confirmLeaveReview}
        isLoading={isActionLoading}
        accentColor={ROLE_COLORS.talent.dark}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        title={successModalConfig.title}
        description={successModalConfig.description}
        accentColor={ROLE_COLORS.talent.dark}
      />
    </div>
  );
}
