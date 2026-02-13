"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { Search, SlidersHorizontal, X } from "lucide-react";
import {
  SessionCard,
  type SessionStatus as CardSessionStatus,
} from "@/components/mentor/sessions/SessionCard";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { RescheduleModal } from "@/components/ui/reschedule-modal";
import { useToast } from "@/hooks";
import { useRequireRole } from "@/hooks/useRequireRole";
import { PageLoadingState } from "@/lib/page-utils";
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
import { ROLE_COLORS } from "@/lib/theme/role-colors";
import { SessionsSkeleton } from "@/components/mentor/sessions/SessionsSkeleton";

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
  const [_meta, setMeta] = useState<SessionsMetaResponse>({
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

  const hasAccess = useRequireRole(["mentor"]);

  const fetchSessions = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getSessions({ role: "mentor" });
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
    if (hasAccess) {
      fetchSessions();
    }
  }, [hasAccess, fetchSessions]);

  const filteredSessions = sessions.filter((session) => {
    const matchesTab = activeTab === "all" || session.status === activeTab;
    const matchesSearch =
      session.mentee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (session.message?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false);
    return matchesTab && matchesSearch;
  });

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

  const TABS = [
    { id: "all", label: "All" },
    { id: "upcoming", label: "Upcoming" },
    { id: "completed", label: "Completed" },
    { id: "cancelled", label: "Cancelled" },
  ];

  if (!hasAccess) {
    return <PageLoadingState message="Checking access..." />;
  }

  return (
    <div className="h-screen overflow-x-hidden bg-white flex flex-col">
      {/* Header */}
      <div className="w-full px-[25px] pt-[19px] pb-[16px] border-b border-[#E1E4EA] flex-shrink-0">
        {/* Title */}
        <h1 className="text-[16px] font-medium font-inter-tight text-black leading-[16px] mb-[19px]">
          Sessions
        </h1>

        {/* Search Bar and Filter */}
        <div className="flex items-center gap-[8px] mb-[19px]">
          <div className="flex-1 max-w-[585px] h-[38px] px-[12px] py-[7px] flex items-center gap-[6px] border border-[#E1E4EA] rounded-[8px]">
            <Search className="w-[15px] h-[15px] text-[#B2B2B2] flex-shrink-0" />
            <input
              type="text"
              placeholder="Search mentee, topic..."
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
        <div className="flex items-center gap-[8px] overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-[12px] py-[6px] flex justify-center items-center whitespace-nowrap flex-shrink-0 rounded transition-colors ${
                activeTab === tab.id
                  ? "text-black font-medium border-b-2 border-black"
                  : "text-black/30 font-medium hover:text-black/50"
              }`}
            >
              <span className="text-[13px] font-inter-tight">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-4 md:p-6">
          {isLoading ? (
            <SessionsSkeleton />
          ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[7px]">
            {filteredSessions.length === 0 ? (
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
          )}
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
        confirmColor={ROLE_COLORS.mentor.dark}
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
        confirmColor={ROLE_COLORS.mentor.dark}
      />

      <RescheduleModal
        isOpen={rescheduleModalOpen}
        onClose={() => setRescheduleModalOpen(false)}
        onConfirm={confirmReschedule}
        mentorId={selectedMentorId}
        accentColor={ROLE_COLORS.mentor.dark}
      />
    </div>
  );
}
