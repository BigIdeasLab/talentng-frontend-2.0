"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  ExternalLink,
  Copy,
  Check,
  X,
  CheckCircle,
  Star,
} from "lucide-react";
import Link from "next/link";
import type { MentorshipSession } from "@/lib/api/mentorship/types";
import { ROLE_COLORS } from "@/lib/theme/role-colors";

interface TalentSessionCardProps {
  session: MentorshipSession;
  onCancel?: (id: string) => void;
  onReschedule?: (id: string) => void;
  onConfirmCompletion?: (id: string) => void;
  onLeaveReview?: (id: string) => void;
}

const STATUS_CONFIG: Record<
  string,
  { bg: string; dot: string; text: string; label: string }
> = {
  // Needs immediate attention - Urgent (Amber/Orange tones)
  pending: {
    bg: "#FEF3C7",
    dot: "#F59E0B",
    text: "#D97706",
    label: "Pending Confirmation",
  },
  pending_completion: {
    bg: "#FEF2F2",
    dot: "#EF4444",
    text: "#DC2626",
    label: "Action Required",
  },

  // Rescheduled - Needs attention (Amber)
  rescheduled: {
    bg: "#FEF3C7",
    dot: "#F59E0B",
    text: "#D97706",
    label: "Rescheduled",
  },

  // Active/In Progress - Blue (attention but not urgent)
  in_progress: {
    bg: "#DBEAFE",
    dot: "#3B82F6",
    text: "#2563EB",
    label: "In Progress",
  },

  // Confirmed - Neutral Blue
  confirmed: {
    bg: "#EFF6FF",
    dot: "#60A5FA",
    text: "#3B82F6",
    label: "Confirmed",
  },

  // Completed - Green
  completed: {
    bg: "#ECFDF3",
    dot: "#10B981",
    text: "#059669",
    label: "Completed",
  },

  // Problem states - Red
  disputed: {
    bg: "#FEF2F2",
    dot: "#DC2626",
    text: "#B91C1C",
    label: "Disputed",
  },
  cancelled: {
    bg: "#FEF2F2",
    dot: "#EF4444",
    text: "#DC2626",
    label: "Cancelled",
  },
};

export function TalentSessionCard({
  session,
  onCancel,
  onReschedule,
  onConfirmCompletion,
  onLeaveReview,
}: TalentSessionCardProps) {
  const [copied, setCopied] = useState(false);
  const status = STATUS_CONFIG[session.status] || STATUS_CONFIG.pending;
  const mentor = session.mentor;
  const mentorName = mentor.fullName || mentor.name || "Unknown Mentor";

  // Filter out builder.io URLs and use local fallback
  const rawMentorAvatar = mentor.profileImageUrl || mentor.avatar || "";
  const mentorAvatar =
    rawMentorAvatar && !rawMentorAvatar.includes("builder.io")
      ? rawMentorAvatar
      : "/default.png";

  const rawDate = session.startTime || session.scheduledAt || session.createdAt;
  const scheduledDate = new Date(rawDate);

  // Handle invalid dates
  const isValidDate = !isNaN(scheduledDate.getTime());
  if (!isValidDate) {
    console.error("Invalid session date:", rawDate);
    return null;
  }

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

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (meetingLink) {
      try {
        await navigator.clipboard.writeText(meetingLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy link:", err);
      }
    }
  };

  return (
    <div className="flex flex-col border border-[#E1E4EA] rounded-[16px] bg-white hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-3.5 px-4 pt-4 pb-3">
        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <img
              src={mentorAvatar}
              alt={mentorName}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
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
          {session.location && !/^https?:\/\//i.test(session.location) && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-[24px] bg-[#F5F5F5]">
              <MapPin className="w-3 h-3 text-[#525866]" />
              <span className="text-[12px] font-normal font-inter-tight text-black leading-[12.6px]">
                {session.location}
              </span>
            </div>
          )}
          {meetingLink && (
            <div className="flex items-center gap-1">
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
              <button
                onClick={handleCopyLink}
                className="flex items-center justify-center w-8 h-8 rounded-[24px] bg-[#EFF6FF] hover:bg-[#DBEAFE] transition-colors"
                title="Copy meeting link"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-[#10B981]" />
                ) : (
                  <Copy className="w-3 h-3 text-[#2563EB]" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#E1E4EA]">
        <div className="flex items-center gap-1">
          {/* Pending - Show Cancel button */}
          {session.status === "pending" && (
            <>
              <span className="text-[12px] font-inter-tight text-[#D97706]">
                Waiting for mentor confirmation
              </span>
              <button
                onClick={() => onCancel?.(session.id)}
                className="flex items-center gap-1 px-4 py-2 h-8 border border-[#E1E4EA] rounded-[40px] hover:border-[#EF4444] hover:bg-[#FEF2F2] hover:text-[#EF4444] transition-colors"
              >
                <X className="w-4 h-4" />
                <span className="text-[12px] font-medium font-inter-tight">
                  Cancel
                </span>
              </button>
            </>
          )}

          {/* Confirmed/Rescheduled - Show Reschedule + Cancel buttons */}
          {(session.status === "confirmed" ||
            session.status === "rescheduled") && (
            <>
              <button
                onClick={() => onReschedule?.(session.id)}
                className="flex items-center gap-1 px-4 py-2 h-8 bg-[#181B25] hover:bg-[#2a2d39] rounded-[40px] transition-colors"
              >
                <Clock className="w-4 h-4 text-white" />
                <span className="text-[12px] font-medium font-inter-tight text-white">
                  Reschedule
                </span>
              </button>
              <button
                onClick={() => onCancel?.(session.id)}
                className="flex items-center gap-1 px-4 py-2 h-8 border border-[#E1E4EA] rounded-[40px] hover:border-[#EF4444] hover:bg-[#FEF2F2] hover:text-[#EF4444] transition-colors"
              >
                <X className="w-4 h-4" />
                <span className="text-[12px] font-medium font-inter-tight">
                  Cancel
                </span>
              </button>
            </>
          )}

          {/* In Progress - No action buttons */}
          {session.status === "in_progress" && (
            <span className="text-[12px] font-inter-tight text-[#2563EB]">
              Session in progress
            </span>
          )}

          {/* Pending Completion - Show Confirm Completion button */}
          {session.status === "pending_completion" && (
            <button
              onClick={() => onConfirmCompletion?.(session.id)}
              className="flex items-center gap-1 px-4 py-2 h-8 hover:opacity-80 rounded-[40px] transition-colors"
              style={{ backgroundColor: ROLE_COLORS.talent.dark }}
            >
              <CheckCircle className="w-4 h-4 text-white" />
              <span className="text-[12px] font-medium font-inter-tight text-white">
                Confirm Completion
              </span>
            </button>
          )}

          {/* Completed - Show Leave Review button if not reviewed */}
          {session.status === "completed" && (
            <>
              {!session.hasReview ? (
                <button
                  onClick={() => onLeaveReview?.(session.id)}
                  className="flex items-center gap-1 px-4 py-2 h-8 hover:opacity-80 rounded-[40px] transition-colors"
                  style={{ backgroundColor: ROLE_COLORS.talent.dark }}
                >
                  <Star className="w-4 h-4 text-white" />
                  <span className="text-[12px] font-medium font-inter-tight text-white">
                    Leave Review
                  </span>
                </button>
              ) : (
                <span className="text-[12px] font-inter-tight text-[#059669]">
                  Review submitted
                </span>
              )}
            </>
          )}

          {/* Cancelled */}
          {session.status === "cancelled" && (
            <span className="text-[12px] font-inter-tight text-[#EF4444]">
              Session cancelled
            </span>
          )}

          {/* Disputed */}
          {session.status === "disputed" && (
            <span className="text-[12px] font-inter-tight text-[#B91C1C]">
              Session disputed - Contact support
            </span>
          )}
        </div>

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
