"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, SlidersHorizontal, ChevronDown, Loader2 } from "lucide-react";
import { MentorshipHeader } from "@/components/talent/mentorship/MentorshipHeader";
import { CategoryFilter } from "@/components/talent/mentorship/CategoryFilter";
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
  type PublicMentor,
  type MentorshipSession,
} from "@/lib/api/mentorship";
import { toast } from "sonner";

const CATEGORIES = [
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
  if (status === "confirmed") return "upcoming";
  return status;
}

function mapApiSessionToMenteeSession(
  session: MentorshipSession,
): MenteeSession {
  return {
    id: session.id,
    mentor: {
      id: session.mentor.id,
      name: session.mentor.name,
      avatar: session.mentor.avatar || undefined,
      title: session.mentor.title || undefined,
    },
    topic: session.topic,
    message: session.notes || undefined,
    date: formatSessionDate(session.scheduledAt),
    duration: `${session.duration} mins`,
    location: session.meetingLink || "TBD",
    status: mapSessionStatus(session.status),
  };
}

function mapApiMentorToDisplay(mentor: PublicMentor): MentorDisplay {
  return {
    id: mentor.id,
    name: mentor.name,
    title: mentor.title || "",
    imageUrl: mentor.avatar || "/placeholder-avatar.png",
    pricePerSession: 0,
    sessionsCompleted: mentor.totalSessions,
    expertise: mentor.expertise,
  };
}

export default function MentorshipPage() {
  const [activeTab, setActiveTab] = useState<
    "Find Mentors" | "My Session" | "Messages"
  >("Find Mentors");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Design");
  const [sortBy, setSortBy] = useState("Newest");

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

  useEffect(() => {
    async function fetchMentors() {
      try {
        setMentorsLoading(true);
        const data = await listMentors();
        setMentors(data.map(mapApiMentorToDisplay));
      } catch (error) {
        toast.error("Failed to load mentors");
      } finally {
        setMentorsLoading(false);
      }
    }
    fetchMentors();
  }, []);

  useEffect(() => {
    async function fetchSessions() {
      try {
        setSessionsLoading(true);
        const response = await getSessions({ role: "mentee" });
        setSessions(response.data.map(mapApiSessionToMenteeSession));
      } catch (error) {
        toast.error("Failed to load sessions");
      } finally {
        setSessionsLoading(false);
      }
    }
    fetchSessions();
  }, []);

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
    <div className="flex h-screen flex-col gap-3 md:gap-3 p-3 md:p-4 bg-white overflow-hidden">
      {/* Navigation Tabs */}
      <div className="flex flex-shrink-0 items-center gap-6 overflow-x-auto scrollbar-hide">
        {(["Find Mentors", "My Session", "Messages"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center justify-center gap-2 py-3 font-inter-tight text-[13px] font-medium leading-normal whitespace-nowrap ${
              activeTab === tab ? "text-black" : "text-black/30"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search and Filter Row */}
      <div className="flex flex-shrink-0 flex-col md:flex-row gap-2.5 md:gap-3">
        {/* Search Bar */}
        <div className="flex-1 flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-[#F5F5F5]">
          <Search className="w-4 h-4 text-[#B2B2B2]" strokeWidth={1.125} />
          <input
            type="text"
            placeholder="Search by name, role, company"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent font-inter-tight text-[13px] font-normal leading-normal text-black placeholder:text-black/30 outline-none capitalize"
          />
        </div>

        {/* Filter Button */}
        <button className="flex items-center justify-center gap-1 px-3.5 py-2 rounded-lg bg-[#F5F5F5] font-inter-tight text-[13px] font-normal leading-normal text-black h-[38px]">
          <SlidersHorizontal className="w-4 h-4" strokeWidth={1.125} />
          Filter
        </button>

        {/* Sort Dropdown */}
        <button className="flex items-center justify-center gap-1 px-3.5 py-2 rounded-lg bg-[#F5F5F5] font-inter-tight text-[13px] font-normal leading-normal text-black h-[38px]">
          {sortBy}
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Find Mentors Tab Content */}
      {activeTab === "Find Mentors" && (
        <>
          {/* Hero Banner */}
          <div className="flex-shrink-0">
            <MentorshipHeader />
          </div>

          {/* Find Your Mentor Section */}
          <div className="flex flex-col gap-5 overflow-hidden flex-1">
            <h2 className="flex-shrink-0 font-inter-tight text-[15px] font-medium leading-normal text-black">
              Find Your Mentor
            </h2>

            {/* Category Filter */}
            <div className="flex-shrink-0">
              <CategoryFilter
                categories={CATEGORIES}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>

            {/* Mentor Grid */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {mentorsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-[#5C30FF]" />
                </div>
              ) : (
                <MentorGrid mentors={filteredMentors} />
              )}
            </div>
          </div>
        </>
      )}

      {/* My Session Tab Content */}
      {activeTab === "My Session" && (
        <div className="flex flex-col gap-4 overflow-hidden flex-1">
          {/* Session Filter Tabs */}
          <div className="flex flex-shrink-0 items-center gap-1 overflow-x-auto rounded-lg border border-[#E1E4EA] bg-white p-1">
            {sessionTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSessionFilter(tab.id)}
                className={`flex items-center gap-2 rounded-md px-4 py-2 font-inter-tight text-[13px] font-medium transition-colors whitespace-nowrap ${
                  sessionFilter === tab.id
                    ? "bg-[#5C30FF] text-white"
                    : "text-[#525866] hover:bg-[#F5F3FF]"
                }`}
              >
                {tab.label}
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] ${
                    sessionFilter === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-[#F5F5F5] text-[#525866]"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Session Cards */}
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
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
                />
              ))
            )}
          </div>
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
