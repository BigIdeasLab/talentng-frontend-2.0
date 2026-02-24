"use client";

import { format } from "date-fns";
import { Calendar, Clock, Video, MapPin, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { MentorshipSession } from "@/lib/api/mentorship/types";
import { ROLE_COLORS } from "@/lib/theme/role-colors";

interface TalentSessionCardProps {
  session: MentorshipSession;
}

const STATUS_CONFIG: Record<
  string,
  { bg: string; dot: string; text: string; label: string }
> = {
  pending: { bg: "#FFF4E5", dot: "#F59E0B", text: "#F59E0B", label: "Pending" },
  confirmed: {
    bg: "#EFF6FF",
    dot: "#2563EB",
    text: "#2563EB",
    label: "Confirmed",
  },
  rescheduled: {
    bg: "#FFF4E5",
    dot: "#F59E0B",
    text: "#F59E0B",
    label: "Rescheduled",
  },
  in_progress: {
    bg: "#EFF6FF",
    dot: "#2563EB",
    text: "#2563EB",
    label: "In Progress",
  },
  pending_completion: {
    bg: "#F3E8FF",
    dot: "#7C3AED",
    text: "#7C3AED",
    label: "Pending Review",
  },
  disputed: {
    bg: "#FEF2F2",
    dot: "#EF4444",
    text: "#EF4444",
    label: "Disputed",
  },
  completed: {
    bg: "#ECFDF3",
    dot: "#10B981",
    text: "#10B981",
    label: "Completed",
  },
  cancelled: {
    bg: "#FEF2F2",
    dot: "#EF4444",
    text: "#EF4444",
    label: "Cancelled",
  },
};

export function TalentSessionCard({ session }: TalentSessionCardProps) {
  const status = STATUS_CONFIG[session.status] || STATUS_CONFIG.pending;
  const mentor = session.mentor;
  const mentorName = mentor.fullName || mentor.name || "Unknown Mentor";
  const mentorAvatar = mentor.profileImageUrl || mentor.avatar || null;

  const rawDate =
    session.startTime || session.scheduledAt || session.createdAt;
  const scheduledDate = new Date(rawDate);

  // Resolve meeting link: try meetingLink, then location, then mentor's default
  const meetingLink =
    session.meetingLink ||
    (session.location && /^https?:\/\//i.test(session.location)
      ? session.location
      : null) ||
    (session.mentor as any).defaultMeetingLink ||
    null;

  // Resolve duration with fallback
  const duration =
    session.duration ||
    (session.startTime && session.endTime
      ? Math.round(
          (new Date(session.endTime).getTime() -
            new Date(session.startTime).getTime()) /
            60000,
        )
      : (session.mentor as any).sessionDuration || 0);

  return (
    <div className="flex flex-col border border-[#E1E4EA] rounded-[16px] bg-white hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-3.5 px-4 pt-4 pb-3">
        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {mentorAvatar ? (
              <img
                src={mentorAvatar}
                alt={mentorName}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: ROLE_COLORS.mentor.light }}
              >
                <span
                  className="text-[12px] font-semibold font-inter-tight"
                  style={{ color: ROLE_COLORS.mentor.dark }}
                >
                  {mentorName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <span className="text-[13px] font-medium font-inter-tight text-black">
                {mentorName}
              </span>
              <span className="text-[12px] font-light font-inter-tight text-[#525866]">
                {mentor.headline || mentor.title || "Mentor"} • Session
              </span>
            </div>
          </div>

          <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md flex-shrink-0"
            style={{ backgroundColor: status.bg }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: status.dot }}
            />
            <span
              className="text-[11px] font-normal font-inter-tight"
              style={{ color: status.text }}
            >
              {status.label}
            </span>
          </div>
        </div>

        {/* Topic */}
        <div className="text-[15px] font-medium font-inter-tight text-black">
          {session.topic}
        </div>

        {/* Message */}
        {(session.message || session.notes) && (
          <p className="text-[13px] font-normal font-inter-tight text-[#525866] leading-relaxed line-clamp-2">
            {session.message || session.notes}
          </p>
        )}

        {/* Details as pills */}
        <div className="flex items-start content-start gap-x-1 gap-y-1.5 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-[24px] bg-[#F5F5F5]">
            <Calendar className="w-3 h-3 text-[#525866]" />
            <span className="text-[12px] font-normal font-inter-tight text-black leading-[12.6px]">
              {format(scheduledDate, "EEE MMM d, yyyy")}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-[24px] bg-[#F5F5F5]">
            <Clock className="w-3 h-3 text-[#525866]" />
            <span className="text-[12px] font-normal font-inter-tight text-black leading-[12.6px]">
              {format(scheduledDate, "h:mm a")}
            </span>
          </div>
          {duration > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-[24px] bg-[#F5F5F5]">
              <span className="text-[12px] font-normal font-inter-tight text-black leading-[12.6px]">
                {duration} mins
              </span>
            </div>
          )}
          {session.location && (
            /^https?:\/\//i.test(session.location) ? (
              <a
                href={session.location}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-[24px] bg-[#EFF6FF] hover:bg-[#DBEAFE] transition-colors"
              >
                <Video className="w-3 h-3 text-[#2563EB]" />
                <span className="text-[12px] font-medium font-inter-tight text-[#2563EB] leading-[12.6px]">
                  Join Meeting
                </span>
              </a>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-[24px] bg-[#F5F5F5]">
                <MapPin className="w-3 h-3 text-[#525866]" />
                <span className="text-[12px] font-normal font-inter-tight text-black leading-[12.6px]">
                  {session.location}
                </span>
              </div>
            )
          )}
          {meetingLink && (
            <a
              href={meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-[24px] bg-[#EFF6FF] hover:bg-[#DBEAFE] transition-colors"
            >
              <Video className="w-3 h-3 text-[#2563EB]" />
              <span className="text-[12px] font-medium font-inter-tight text-[#2563EB] leading-[12.6px]">
                Join Meeting
              </span>
            </a>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end px-4 py-2.5 border-t border-[#E1E4EA]">
        <Link
          href={`/mentorship/${mentor.id}`}
          className="flex items-center gap-1 text-[12px] font-medium font-inter-tight text-[#525866] hover:text-black transition-colors"
        >
          View Mentor
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
