"use client";

import { format } from "date-fns";
import { Calendar, Clock, Video, MapPin, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { MentorshipSession } from "@/lib/api/mentorship/types";
import { ROLE_COLORS } from "@/lib/theme/role-colors";

interface MentorSessionCardProps {
  session: MentorshipSession;
}

const STATUS_CONFIG: Record<
  string,
  { bg: string; dot: string; text: string; label: string }
> = {
  pending: { bg: "#FFF4E5", dot: "#F59E0B", text: "#F59E0B", label: "Pending" },
  confirmed: {
    bg: "#ECFDF5",
    dot: "#047857",
    text: "#047857",
    label: "Confirmed",
  },
  rescheduled: {
    bg: "#FFF4E5",
    dot: "#F59E0B",
    text: "#F59E0B",
    label: "Rescheduled",
  },
  in_progress: {
    bg: "#FEF2F0",
    dot: "#e63c23",
    text: "#e63c23",
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

export function MentorSessionCard({ session }: MentorSessionCardProps) {
  const status = STATUS_CONFIG[session.status] || STATUS_CONFIG.pending;
  const mentee = session.mentee;
  const menteeName = mentee.fullName || mentee.name || "Unknown Mentee";
  const menteeAvatar = mentee.profileImageUrl || mentee.avatar || null;

  const rawDate = session.startTime || session.scheduledAt || session.createdAt;
  const scheduledDate = new Date(rawDate);

  const meetingLink =
    session.meetingLink ||
    (session.location && /^https?:\/\//i.test(session.location)
      ? session.location
      : null) ||
    null;

  const duration =
    session.duration ||
    (session.startTime && session.endTime
      ? Math.round(
          (new Date(session.endTime).getTime() -
            new Date(session.startTime).getTime()) /
            60000,
        )
      : 0);

  return (
    <div className="flex flex-col border border-[#E1E4EA] rounded-[16px] bg-white hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-3.5 px-4 pt-4 pb-3">
        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {menteeAvatar ? (
              <img
                src={menteeAvatar}
                alt={menteeName}
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
                  {menteeName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <span className="text-[13px] font-medium font-inter-tight text-black">
                {menteeName}
              </span>
              <span className="text-[12px] font-light font-inter-tight text-[#525866]">
                {mentee.headline || "Mentee"} • Session
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
          {session.location &&
            (/^https?:\/\//i.test(session.location) ? (
              <a
                href={session.location}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-[24px] bg-[#FEF2F0] hover:bg-[#FDE8E4] transition-colors"
              >
                <Video className="w-3 h-3" style={{ color: ROLE_COLORS.mentor.dark }} />
                <span
                  className="text-[12px] font-medium font-inter-tight leading-[12.6px]"
                  style={{ color: ROLE_COLORS.mentor.dark }}
                >
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
            ))}
          {meetingLink && (
            <a
              href={meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-[24px] bg-[#FEF2F0] hover:bg-[#FDE8E4] transition-colors"
            >
              <Video className="w-3 h-3" style={{ color: ROLE_COLORS.mentor.dark }} />
              <span
                className="text-[12px] font-medium font-inter-tight leading-[12.6px]"
                style={{ color: ROLE_COLORS.mentor.dark }}
              >
                Join Meeting
              </span>
            </a>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end px-4 py-2.5 border-t border-[#E1E4EA]">
        <Link
          href="/sessions"
          className="flex items-center gap-1 text-[12px] font-medium font-inter-tight text-[#525866] hover:text-black transition-colors"
        >
          View Sessions
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
