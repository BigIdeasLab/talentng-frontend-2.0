"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar, Clock, Users } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import type { UpcomingInterview } from "@/lib/api/talent";
import type { MentorshipSession } from "@/lib/api/mentorship/types";
import type {
  Application,
  ApplicationInterview,
} from "@/lib/api/applications/types";
import { getTalentUpcoming } from "@/lib/api/talent";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";
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

function EventCard({
  type,
  title,
  subtitle,
  date,
  time,
  opportunityId,
}: EventCardProps) {
  const isSession = type === "session";
  const href = isSession
    ? "/calendar"
    : opportunityId
      ? `/opportunities/${opportunityId}`
      : "/opportunities";

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
            backgroundColor: isSession ? ROLE_COLORS.mentor.light : "#EFF6FF",
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

export function UpcomingInterviews({
  interviews: legacyInterviews,
}: UpcomingInterviewsProps) {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      const res = await getTalentUpcoming({ limit: 5 });
      setItems(res.data || []);
    } catch (err) {
      console.error("Failed to fetch dashboard upcoming items:", err);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Real-time refresh for dashboard view
  useNotificationSocket({
    recipientRole: "talent",
    onUpcomingUpdate: () => {
      fetchData(false);
    },
    enabled: true,
  });

  // Build unified event list with proper date validation
  type EventItem = EventCardProps & { sortDate: Date };
  const events: EventItem[] = items
    .filter((item) => {
      // Filter out items with invalid dates BEFORE mapping
      const rawDate = item.scheduledAt || item.startTime || item.date;
      const dateObj = new Date(rawDate);
      const isValid = !isNaN(dateObj.getTime());
      
      if (!isValid) {
        console.error('Invalid date in upcoming item, skipping:', rawDate, item);
      }
      
      return isValid;
    })
    .map((item) => {
      const rawDate = item.scheduledAt || item.startTime || item.date;
      const dateObj = new Date(rawDate);
      
      return {
        type: item.type,
        title: item.position || item.topic || item.title,
        subtitle: item.company || item.mentorName || item.subtitle,
        date: format(dateObj, "MMM d, yyyy"),
        time: format(dateObj, "h:mm a"),
        opportunityId: item.opportunityId || item.metadata?.opportunityId,
        sortDate: dateObj,
      };
    });

  // Also include the legacy interviews passed from the dashboard API as fallback/merge if needed,
  // but the new endpoint should ideally cover everything.
  // For now, let's stick to the new endpoint as the primary source.

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
            href="/calendar"
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
