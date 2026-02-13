"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { MentorGridSkeleton } from "@/components/talent/mentorship/MentorCardSkeleton";
import { MentorshipHeader } from "@/components/talent/mentorship/MentorshipHeader";
import { MentorGrid } from "@/components/talent/mentorship/MentorGrid";
import {
  MenteeSessionCard,
  MenteeSessionStatus,
} from "@/components/talent/mentorship/MenteeSessionCard";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import {
  listMentors,
  getSessions,
  cancelSession,
  confirmSessionCompletion,
  disputeSession,
  type PublicMentor,
  type MentorshipSession,
} from "@/lib/api/mentorship";
import { toast } from "sonner";
import { useRequireRole } from "@/hooks/useRequireRole";
import { PageLoadingState } from "@/lib/page-utils";

const CATEGORIES = [
  "All",
  "Design",
  "Innovation",
  "Art",
  "Collaboration",
  "Strategy",
  "Creativity",
  "Research",
  "Accessibility",
  "Testing",
  "Implementation",
  "Wireframing",
];

interface MenteeSession {
  id: string;
  mentor: {
    id: string;
    name: string;
    avatar?: string;
    title?: string;
  };
  topic: string;
  message?: string;
  date: string;
  duration: string;
  location: string;
  status: MenteeSessionStatus;
}

interface MentorDisplay {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
  pricePerSession: number;
  sessionsCompleted: number;
  expertise: string[];
}

function formatSessionDate(scheduledAt: string): string {
  const date = new Date(scheduledAt);
  return (
    date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }) +
    ", " +
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  );
}

function mapSessionStatus(
  status: MentorshipSession["status"],
): MenteeSessionStatus {
  if (status === "confirmed" || status === "rescheduled") return "upcoming";
  if (status === "in_progress") return "in_progress";
  if (status === "pending_completion") return "pending_completion";
  if (status === "disputed") return "disputed";
  if (status === "completed") return "completed";
  if (status === "cancelled") return "cancelled";
  return "pending";
}

function mapApiSessionToMenteeSession(
  session: MentorshipSession,
): MenteeSession {
  return {
    id: session.id,
    mentor: {
      id: session.mentor.id,
      name: session.mentor.fullName || session.mentor.name || "Unknown",
      avatar: session.mentor.avatar || undefined,
      title: session.mentor.title || undefined,
    },
    topic: session.topic,
    message: session.notes || undefined,
    date: formatSessionDate(
      session.scheduledAt || session.startTime || session.createdAt,
    ),
    duration: `${session.duration} mins`,
    location: session.meetingLink || "TBD",
    status: mapSessionStatus(session.status),
  };
}

function mapApiMentorToDisplay(mentor: Record<string, unknown>): MentorDisplay {
  return {
    id: (mentor.id as string) || "",
    name: (mentor.fullName as string) || (mentor.name as string) || "",
    title: (mentor.headline as string) || (mentor.title as string) || "",
    imageUrl:
      (mentor.profileImageUrl as string) ||
      (mentor.avatar as string) ||
      "/placeholder-avatar.png",
    pricePerSession: (mentor.sessionRate as number) || 0,
    sessionsCompleted: (mentor.totalSessions as number) || 0,
    expertise: (mentor.expertise as string[]) || [],
  };
}

export default function MentorshipPage() {
  const [activeTab, setActiveTab] = useState<
    "Find Mentors" | "My Session" | "Messages"
  >("Find Mentors");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  const [mentors, setMentors] = useState<MentorDisplay[]>([]);
  const [mentorsLoading, setMentorsLoading] = useState(true);
  const [sessions, setSessions] = useState<MenteeSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionFilter, setSessionFilter] = useState<
    "all" | "pending" | "upcoming" | "completed" | "cancelled"
  >("all");
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  );
  const [cancellingSession, setCancellingSession] = useState(false);

  const hasAccess = useRequireRole(["talent"]);

  useEffect(() => {
    if (!hasAccess) return;
    async function fetchMentors() {
      try {
        setMentorsLoading(true);
        const data = await listMentors();
        const raw = data as unknown;
        const mentorsArray = (Array.isArray(raw) ? raw : []) as Record<
          string,
          unknown
        >[];
        setMentors(mentorsArray.map(mapApiMentorToDisplay));
      } catch (error) {
        console.error("Failed to load mentors:", error);
      } finally {
        setMentorsLoading(false);
      }
    }
    fetchMentors();
  }, [hasAccess]);

  useEffect(() => {
    if (!hasAccess) return;
    async function fetchSessions() {
      try {
        setSessionsLoading(true);
        const response = await getSessions({ role: "mentee" });
        const sessionsArray = Array.isArray(response)
          ? response
          : (response?.data ?? []);
        setSessions(sessionsArray.map(mapApiSessionToMenteeSession));
      } catch (error) {
        console.error("Failed to load sessions:", error);
      } finally {
        setSessionsLoading(false);
      }
    }
    fetchSessions();
  }, [hasAccess]);

  const filteredMentors = useMemo(() => {
    let filtered = mentors;

    if (activeCategory) {
      filtered = filtered.filter((mentor) =>
        mentor.expertise.includes(activeCategory),
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (mentor) =>
          mentor.name.toLowerCase().includes(query) ||
          mentor.title.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [mentors, searchQuery, activeCategory]);

  const filteredSessions = useMemo(() => {
    let filtered = sessions;

    if (sessionFilter !== "all") {
      filtered = filtered.filter((session) => session.status === sessionFilter);
    }

    if (searchQuery && activeTab === "My Session") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (session) =>
          session.mentor.name.toLowerCase().includes(query) ||
          session.topic.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [sessions, sessionFilter, searchQuery, activeTab]);

  if (!hasAccess) {
    return <PageLoadingState message="Checking access..." />;
  }

  const sessionCounts = {
    all: sessions.length,
    pending: sessions.filter((s) => s.status === "pending").length,
    upcoming: sessions.filter((s) => s.status === "upcoming").length,
    completed: sessions.filter((s) => s.status === "completed").length,
    cancelled: sessions.filter((s) => s.status === "cancelled").length,
  };

  const handleCancelSession = (id: string) => {
    setSelectedSessionId(id);
    setCancelModalOpen(true);
  };

  const confirmCancelSession = async () => {
    if (!selectedSessionId) return;

    try {
      setCancellingSession(true);
      await cancelSession(selectedSessionId);
      setSessions((prev) =>
        prev.map((session) =>
          session.id === selectedSessionId
            ? { ...session, status: "cancelled" as MenteeSessionStatus }
            : session,
        ),
      );
      toast.success("Session cancelled successfully");
    } catch (error) {
      toast.error("Failed to cancel session");
    } finally {
      setCancellingSession(false);
      setCancelModalOpen(false);
      setSelectedSessionId(null);
    }
  };

  const handleJoinSession = (id: string) => {
    const session = sessions.find((s) => s.id === id);
    if (session?.location && session.location !== "TBD") {
      window.open(session.location, "_blank");
    }
  };

  const handleConfirmCompletion = async (id: string) => {
    try {
      await confirmSessionCompletion(id);
      setSessions((prev) =>
        prev.map((session) =>
          session.id === id
            ? { ...session, status: "completed" as MenteeSessionStatus }
            : session,
        ),
      );
      toast.success("Session completion confirmed");
    } catch {
      toast.error("Failed to confirm completion");
    }
  };

  const handleDisputeSession = async (id: string) => {
    try {
      await disputeSession(id);
      setSessions((prev) =>
        prev.map((session) =>
          session.id === id
            ? { ...session, status: "disputed" as MenteeSessionStatus }
            : session,
        ),
      );
      toast.success("Session disputed");
    } catch {
      toast.error("Failed to dispute session");
    }
  };

  const sessionTabs = [
    { id: "all" as const, label: "All", count: sessionCounts.all },
    { id: "pending" as const, label: "Pending", count: sessionCounts.pending },
    {
      id: "upcoming" as const,
      label: "Upcoming",
      count: sessionCounts.upcoming,
    },
    {
      id: "completed" as const,
      label: "Completed",
      count: sessionCounts.completed,
    },
    {
      id: "cancelled" as const,
      label: "Cancelled",
      count: sessionCounts.cancelled,
    },
  ];

  return (
    <div className="h-screen overflow-x-hidden bg-white flex flex-col">
      {/* Sticky Header */}
      <div className="w-full px-[25px] pt-[19px] pb-[16px] border-b border-[#E1E4EA] flex-shrink-0">
        {/* Navigation Tabs as Title */}
        <div className="flex items-center gap-[8px] mb-[19px]">
          {(["Find Mentors", "My Session", "Messages"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-[12px] py-[6px] flex justify-center items-center whitespace-nowrap flex-shrink-0 rounded transition-colors font-inter-tight text-[13px] ${
                activeTab === tab
                  ? "text-black font-medium border-b-2 border-[#8463FF]"
                  : "text-black/30 font-medium hover:text-black/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Bar and Filter */}
        <div className="flex items-center gap-[8px] mb-[19px]">
          <div className="flex-1 max-w-[585px] h-[38px] px-[12px] py-[7px] flex items-center gap-[6px] border border-[#E1E4EA] rounded-[8px]">
            <Search className="w-[15px] h-[15px] text-[#B2B2B2] flex-shrink-0" />
            <input
              type="text"
              placeholder="Search mentors, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-[13px] font-normal font-inter-tight placeholder:text-black/30 border-0 focus:outline-none bg-transparent"
            />
          </div>

          <button className="h-[38px] px-[15px] py-[7px] flex items-center gap-[5px] bg-[#F5F5F5] rounded-[8px] flex-shrink-0 hover:bg-gray-100 transition-colors">
            <SlidersHorizontal className="w-[15px] h-[15px] text-black" />
            <span className="text-[13px] font-normal text-black font-inter-tight">
              Filter
            </span>
          </button>
        </div>

        {/* Category Tabs (Find Mentors) / Session Filter Tabs (My Session) */}
        {activeTab === "Find Mentors" && (
          <div className="flex items-center gap-[8px] overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat === "All" ? "" : cat)}
                className={`px-[12px] py-[6px] flex justify-center items-center whitespace-nowrap flex-shrink-0 rounded transition-colors font-inter-tight text-[13px] ${
                  (activeCategory === "" && cat === "All") ||
                  activeCategory === cat
                    ? "text-black font-medium border-b-2 border-black"
                    : "text-black/30 font-medium hover:text-black/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {activeTab === "My Session" && (
          <div className="flex items-center gap-[8px] overflow-x-auto scrollbar-hide">
            {sessionTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSessionFilter(tab.id)}
                className={`px-[12px] py-[6px] flex justify-center items-center whitespace-nowrap flex-shrink-0 rounded transition-colors font-inter-tight text-[13px] ${
                  sessionFilter === tab.id
                    ? "text-black font-medium border-b-2 border-black"
                    : "text-black/30 font-medium hover:text-black/50"
                }`}
              >
                {tab.label}
                <span
                  className={`ml-1 rounded-full px-2 py-0.5 text-[11px] ${
                    sessionFilter === tab.id
                      ? "bg-black text-white"
                      : "bg-[#F5F5F5] text-[#525866]"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-styled px-[25px] py-[16px]">
        {/* Find Mentors Tab Content */}
        {activeTab === "Find Mentors" && (
          <div className="flex flex-col gap-5">
            <MentorshipHeader />

            {mentorsLoading ? (
              <MentorGridSkeleton />
            ) : (
              <MentorGrid mentors={filteredMentors} />
            )}
          </div>
        )}

        {/* My Session Tab Content */}
        {activeTab === "My Session" && (
          <div className="flex flex-col gap-4">
            {sessionsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#5C30FF]" />
              </div>
            ) : filteredSessions.length === 0 ? (
              <div className="rounded-xl border border-[#E1E4EA] bg-[#FAFAFA] px-6 py-12 text-center">
                <p className="font-inter-tight text-[14px] text-[#525866]">
                  No sessions found
                </p>
              </div>
            ) : (
              filteredSessions.map((session) => (
                <MenteeSessionCard
                  key={session.id}
                  {...session}
                  onCancel={handleCancelSession}
                  onJoin={handleJoinSession}
                  onConfirmCompletion={handleConfirmCompletion}
                  onDispute={handleDisputeSession}
                />
              ))
            )}
          </div>
        )}

        {/* Messages Tab Content */}
        {activeTab === "Messages" && (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <p className="font-inter-tight text-[14px] text-[#525866]">
                Messages coming soon
              </p>
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
      />
    </div>
  );
}
