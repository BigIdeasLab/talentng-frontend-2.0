"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { Search, SlidersHorizontal, ChevronDown, Loader2 } from "lucide-react";
import {
  SessionCard,
  type SessionStatus as CardSessionStatus,
} from "@/components/mentor/sessions/SessionCard";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { RescheduleModal } from "@/components/ui/reschedule-modal";
import { useToast } from "@/hooks";
import {
  getSessions,
  completeSession,
  cancelSession,
  rescheduleSession,
} from "@/lib/api/mentorship";
import type {
  MentorshipSession,
  SessionsMetaResponse,
} from "@/lib/api/mentorship";

interface SessionView {
  id: string;
  mentorId: string;
  mentee: {
    id: string;
    name: string;
    avatar?: string;
    title?: string;
    company?: string;
  };
  topic: string;
  message?: string;
  date: string;
  duration: string;
  location: string;
  endTime?: string;
  status: CardSessionStatus;
}

function mapStatusToCard(
  status: MentorshipSession["status"],
): CardSessionStatus {
  if (
    status === "pending" ||
    status === "confirmed" ||
    status === "rescheduled"
  )
    return "upcoming";
  if (status === "in_progress") return "in_progress";
  if (status === "pending_completion") return "pending_completion";
  if (status === "disputed") return "disputed";
  if (status === "completed") return "completed";
  if (status === "cancelled") return "cancelled";
  return "upcoming";
}

function mapSession(session: any): SessionView {
  const rawDate = session.startTime || session.scheduledAt || session.createdAt;
  const scheduledDate = new Date(rawDate);

  const mentee = session.mentee || {};
  const mentor = session.mentor || {};

  const menteeName =
    mentee.fullName || mentee.name || mentee.username || "Unknown";
  const menteeAvatar = mentee.profileImageUrl || mentee.avatar || undefined;
  const menteeHeadline = mentee.headline || mentor.headline || undefined;

  const duration =
    session.duration ||
    (session.startTime && session.endTime
      ? Math.round(
          (new Date(session.endTime).getTime() -
            new Date(session.startTime).getTime()) /
            60000,
        )
      : mentor.sessionDuration || 0);

  return {
    id: session.id,
    mentorId: mentor.id || session.mentorId,
    mentee: {
      id: mentee.id || session.menteeId,
      name: menteeName,
      avatar: menteeAvatar,
      title: menteeHeadline,
    },
    topic: session.topic,
    message: session.note || session.message || session.notes || undefined,
    date: format(scheduledDate, "EEE MMM d, h:mm a"),
    duration: `${duration} mins`,
    location:
      session.location ||
      session.meetingLink ||
      mentor.defaultMeetingLink ||
      "Google Meet",
    endTime: session.endTime || undefined,
    status: mapStatusToCard(session.status),
  };
}

export default function SessionsPage() {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<SessionView[]>([]);
  const [meta, setMeta] = useState<SessionsMetaResponse>({
    total: 0,
    pending: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "upcoming" | "completed" | "cancelled" | "all"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  );
  const [selectedMentorId, setSelectedMentorId] = useState<string>("");

  const fetchSessions = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getSessions({ role: "mentor" });
      console.log("Sessions API response:", response);
      const sessionsArray = Array.isArray(response)
        ? response
        : (response?.data ?? []);
      setSessions(sessionsArray.map(mapSession));
      if (response?.meta) {
        setMeta(response.meta);
      }
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

  const filteredSessions = sessions.filter((session) => {
    const matchesTab = activeTab === "all" || session.status === activeTab;
    const matchesSearch =
      session.mentee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (session.message?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false);
    return matchesTab && matchesSearch;
  });

  const counts = {
    all: meta.total || sessions.length,
    upcoming:
      meta.pending + meta.upcoming ||
      sessions.filter((s) => s.status === "upcoming").length,
    completed:
      meta.completed || sessions.filter((s) => s.status === "completed").length,
    cancelled:
      meta.cancelled || sessions.filter((s) => s.status === "cancelled").length,
  };

  const handleReschedule = (id: string) => {
    const session = sessions.find((s) => s.id === id);
    setSelectedSessionId(id);
    setSelectedMentorId(session?.mentorId || "");
    setRescheduleModalOpen(true);
  };

  const handleCancel = (id: string) => {
    setSelectedSessionId(id);
    setCancelModalOpen(true);
  };

  const handleComplete = (id: string) => {
    setSelectedSessionId(id);
    setCompleteModalOpen(true);
  };

  const confirmComplete = async () => {
    if (!selectedSessionId) return;
    try {
      setIsActionLoading(true);
      await completeSession(selectedSessionId);
      toast({
        title: "Session completed",
        description: "The session has been marked as completed",
      });
      await fetchSessions();
    } catch {
      toast({
        title: "Error",
        description: "Failed to complete session",
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const confirmCancel = async () => {
    if (!selectedSessionId) return;
    try {
      setIsActionLoading(true);
      await cancelSession(selectedSessionId);
      toast({
        title: "Session cancelled",
        description: "The session has been cancelled",
      });
      await fetchSessions();
    } catch {
      toast({
        title: "Error",
        description: "Failed to cancel session",
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const confirmReschedule = async (
    date: string,
    startTime: string,
    endTime: string,
  ) => {
    if (!selectedSessionId) return;
    try {
      setIsActionLoading(true);
      const newStartTime = new Date(`${date}T${startTime}`).toISOString();
      const newEndTime = new Date(`${date}T${endTime}`).toISOString();
      await rescheduleSession(selectedSessionId, { newStartTime, newEndTime });
      toast({
        title: "Session rescheduled",
        description: "The session has been rescheduled",
      });
      await fetchSessions();
    } catch {
      toast({
        title: "Error",
        description: "Failed to reschedule session",
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const tabs = [
    { id: "all" as const, label: "All Sessions", count: counts.all },
    { id: "upcoming" as const, label: "Upcoming", count: counts.upcoming },
    { id: "completed" as const, label: "Completed", count: counts.completed },
    { id: "cancelled" as const, label: "Cancelled", count: counts.cancelled },
  ];

  return (
    <div className="h-screen overflow-hidden bg-[#FAFAFA]">
      <div className="flex h-full flex-col overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 border-b border-[#E1E4EA] bg-white px-6 py-5">
          <h1 className="font-inter-tight text-xl font-semibold text-black">
            Sessions
          </h1>
          <p className="mt-1 font-inter-tight text-[13px] text-[#525866]">
            Manage your mentorship sessions
          </p>
        </header>

        <div className="flex flex-1 flex-col overflow-hidden px-6 py-6">
          {/* Search and Filters */}
          <div className="mb-4 flex flex-shrink-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
            <div className="flex flex-1 items-center gap-1.5 rounded-lg border border-[#E1E4EA] bg-white px-3 py-2">
              <Search className="h-4 w-4 text-[#B2B2B2]" strokeWidth={1.125} />
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent font-inter-tight text-[13px] font-normal text-black outline-none placeholder:text-black/30"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 rounded-lg border border-[#E1E4EA] bg-white px-3.5 py-2">
                <SlidersHorizontal className="h-4 w-4" strokeWidth={1.125} />
                <span className="font-inter-tight text-[13px] font-normal leading-normal text-black">
                  Filter
                </span>
              </button>
              <button className="flex items-center gap-1 rounded-lg border border-[#E1E4EA] bg-white px-3.5 py-2">
                <span className="font-inter-tight text-[13px] font-normal leading-normal text-black">
                  Newest
                </span>
                <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6 flex flex-shrink-0 items-center gap-1 overflow-x-auto rounded-lg border border-[#E1E4EA] bg-white p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-md px-4 py-2 font-inter-tight text-[13px] font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-[#5C30FF] text-white"
                    : "text-[#525866] hover:bg-[#F5F3FF]"
                }`}
              >
                {tab.label}
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] ${
                    activeTab === tab.id
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
            {isLoading ? (
              <div className="rounded-xl border border-[#E1E4EA] bg-white px-6 py-12 text-center">
                <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#5C30FF]" />
                <p className="mt-2 font-inter-tight text-[14px] text-[#525866]">
                  Loading sessions...
                </p>
              </div>
            ) : filteredSessions.length === 0 ? (
              <div className="rounded-xl border border-[#E1E4EA] bg-white px-6 py-12 text-center">
                <p className="font-inter-tight text-[14px] text-[#525866]">
                  No sessions found
                </p>
              </div>
            ) : (
              filteredSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  {...session}
                  onReschedule={handleReschedule}
                  onCancel={handleCancel}
                  onComplete={handleComplete}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={completeModalOpen}
        onClose={() => setCompleteModalOpen(false)}
        onConfirm={confirmComplete}
        title="Complete Session"
        description="Are you sure you want to mark this session as completed?"
        confirmText="Yes, Complete"
        type="success"
        isLoading={isActionLoading}
      />

      <ConfirmationModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={confirmCancel}
        title="Cancel Session"
        description="Are you sure you want to cancel this session? This action cannot be undone."
        confirmText="Yes, Cancel"
        type="danger"
        isLoading={isActionLoading}
      />

      <RescheduleModal
        isOpen={rescheduleModalOpen}
        onClose={() => setRescheduleModalOpen(false)}
        onConfirm={confirmReschedule}
        mentorId={selectedMentorId}
      />
    </div>
  );
}
