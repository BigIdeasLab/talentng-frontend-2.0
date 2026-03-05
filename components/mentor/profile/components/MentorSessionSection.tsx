"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
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
import type { MentorshipSession } from "@/lib/api/mentorship";
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

export function MentorSessionSection() {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<SessionView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

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
      const response = await getSessions({
        role: "mentor",
        limit: 10,
      });
      const sessionsArray = Array.isArray(response)
        ? response
        : (response?.data ?? []);
      setSessions(sessionsArray.map(mapSession));
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

  return (
    <>
      <div className="flex flex-col w-full gap-3">
        {isLoading ? (
          <SessionsSkeleton />
        ) : sessions.length === 0 ? (
          <div className="rounded-xl border border-[#E1E4EA] bg-white px-6 py-12 text-center">
            <p className="font-inter-tight text-[14px] text-[#525866]">
              No upcoming sessions
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                {...session}
                onReschedule={handleReschedule}
                onCancel={handleCancel}
                onComplete={handleComplete}
              />
            ))}
          </div>
        )}
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
    </>
  );
}

