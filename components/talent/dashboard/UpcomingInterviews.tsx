"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar, Clock, Users } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import type { UpcomingInterview } from "@/lib/api/talent";
import type { MentorshipSession } from "@/lib/api/mentorship/types";
import type { Application, ApplicationInterview } from "@/lib/api/applications/types";
import { getSessions } from "@/lib/api/mentorship";
import { getTalentApplications } from "@/lib/api/applications/index";
import { ROLE_COLORS } from "@/lib/theme/role-colors";
import { cardHover } from "@/lib/theme/effects";

interface EventCardProps {
  type: "interview" | "session";
  title: string;
  subtitle: string;
  date: string;
  time: string;
  opportunityId?: string;
}

function EventCard({ type, title, subtitle, date, time, opportunityId }: EventCardProps) {
  const isSession = type === "session";
  const href = isSession ? "/upcoming" : (opportunityId ? `/opportunities/${opportunityId}` : "/opportunities");
  
  return (
    <Link
      href={href}
      className="flex flex-col gap-2 p-4 rounded-lg border border-dashed transition-colors group"
      style={{
        borderColor: isSession
          ? ROLE_COLORS.mentor.dark
          : ROLE_COLORS.talent.dark,
        backgroundColor: isSession ? ROLE_COLORS.mentor.light : "#EFF6FF",
      }}
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-1.5">
            {isSession && <Users className="w-3 h-3 text-[#525866]" />}
            <h3 className="text-[13px] font-medium font-inter-tight text-black group-hover:opacity-70 transition-colors">
              {title}
            </h3>
          </div>
          <p className="text-[11px] text-[#606060] font-inter-tight">
            {subtitle}
          </p>
          <div className="flex items-center gap-1">
            <Clock
              className="w-2.5 h-2.5"
              style={{
                color: isSession
                  ? ROLE_COLORS.mentor.dark
                  : ROLE_COLORS.talent.dark,
              }}
            />
            <span
              className="text-[11px] font-medium font-inter-tight"
              style={{
                color: isSession
                  ? ROLE_COLORS.mentor.dark
                  : ROLE_COLORS.talent.dark,
              }}
            >
              {date}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-center px-2 py-1 rounded-lg border border-[#E4E7EB] bg-white h-[18px]">
          <span className="text-[11px] font-semibold font-inter-tight text-black">
            {time}
          </span>
        </div>
      </div>
      <div className="flex justify-end">
        <span
          className="text-[10px] font-medium font-inter-tight px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: isSession
              ? ROLE_COLORS.mentor.light
              : "#EFF6FF",
            color: isSession
              ? ROLE_COLORS.mentor.dark
              : ROLE_COLORS.talent.dark,
            border: `1px solid ${isSession ? ROLE_COLORS.mentor.dark : ROLE_COLORS.talent.dark}20`,
          }}
        >
          {isSession ? "Mentorship" : "Opportunity"}
        </span>
      </div>
    </Link>
  );
}

interface UpcomingInterviewsProps {
  interviews: UpcomingInterview[];
}

export function UpcomingInterviews({ interviews }: UpcomingInterviewsProps) {
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [appInterviews, setAppInterviews] = useState<
    { interview: ApplicationInterview; app: Application }[]
  >([]);

  const fetchData = useCallback(async () => {
    try {
      const [sessionsRes, appsData] = await Promise.all([
        getSessions({ role: "mentee" }).catch(() => []),
        getTalentApplications().catch(() => []),
      ]);

      // Sessions
      const sessArr = Array.isArray(sessionsRes)
        ? sessionsRes
        : (sessionsRes?.data ?? []);
      setSessions(
        sessArr.filter(
          (s: MentorshipSession) =>
            s.status !== "cancelled" && s.status !== "completed",
        ),
      );

      // Extract interviews from applications
      const extracted: { interview: ApplicationInterview; app: Application }[] =
        [];
      (appsData || []).forEach((app: Application) => {
        if (app.interviews && app.interviews.length > 0) {
          app.interviews.forEach((interview) => {
            if (interview.status !== "cancelled") {
              extracted.push({ interview, app });
            }
          });
        }
      });
      setAppInterviews(extracted);
    } catch {
      setSessions([]);
      setAppInterviews([]);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Build unified event list
  type EventItem = EventCardProps & { sortDate: Date };
  const events: EventItem[] = [];

  // Add job interviews from dashboard API
  interviews.forEach((interview) => {
    const scheduledDate = new Date(interview.scheduledAt);
    events.push({
      type: "interview",
      title: interview.company,
      subtitle: interview.position,
      date: format(scheduledDate, "MMM d, yyyy"),
      time: format(scheduledDate, "h:mm a"),
      opportunityId: interview.opportunityId,
      sortDate: scheduledDate,
    });
  });

  // Add job interviews extracted from applications
  appInterviews.forEach(({ interview, app }) => {
    const scheduledDate = new Date(interview.scheduledDate);
    events.push({
      type: "interview",
      title: app.opportunity.company,
      subtitle: app.opportunity.title,
      date: format(scheduledDate, "MMM d, yyyy"),
      time: format(scheduledDate, "h:mm a"),
      opportunityId: app.opportunityId || app.opportunity?.id,
      sortDate: scheduledDate,
    });
  });

  // Add mentorship sessions
  sessions.forEach((session) => {
    const rawDate =
      session.startTime || session.scheduledAt || session.createdAt;
    const scheduledDate = new Date(rawDate);
    const mentor = session.mentor;
    const mentorName = mentor.fullName || mentor.name || "Mentor";
    events.push({
      type: "session",
      title: mentorName,
      subtitle: session.topic,
      date: format(scheduledDate, "MMM d, yyyy"),
      time: format(scheduledDate, "h:mm a"),
      sortDate: scheduledDate,
    });
  });

  // Sort by date, nearest first
  events.sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime());

  // Show max 3 on dashboard
  const displayEvents = events.slice(0, 3);

  return (
    <div
      className={`flex flex-col gap-4 p-4 rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.11)] bg-white ${cardHover}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Calendar
            className="w-4 h-4"
            style={{ color: ROLE_COLORS.talent.dark }}
          />
          <h2 className="text-[15px] font-bold font-inter-tight">Upcoming</h2>
        </div>
        {events.length > 3 && (
          <Link
            href="/upcoming"
            className="text-[11px] font-medium font-inter-tight text-[#525866] hover:text-black transition-colors"
          >
            View all →
          </Link>
        )}
      </div>
      <div className="flex flex-col gap-3">
        {displayEvents.length === 0 ? (
          <p className="text-[12px] text-[#606060] font-inter-tight text-center py-6">
            No upcoming interviews or sessions
          </p>
        ) : (
          displayEvents.map((event, idx) => (
            <EventCard
              key={`${event.type}-${idx}`}
              type={event.type}
              title={event.title}
              subtitle={event.subtitle}
              date={event.date}
              time={event.time}
              opportunityId={event.opportunityId}
            />
          ))
        )}
      </div>
    </div>
  );
}
