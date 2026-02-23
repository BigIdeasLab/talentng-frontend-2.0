"use client";

import { format } from "date-fns";
import { Calendar, Clock, MapPin } from "lucide-react";
import type { MentorshipRequest } from "@/lib/api/mentorship/types";
import { ROLE_COLORS } from "@/lib/theme/role-colors";

interface MentorshipRequestCardProps {
  request: MentorshipRequest;
}

const STATUS_CONFIG: Record<
  string,
  { bg: string; dot: string; text: string; label: string }
> = {
  pending: {
    bg: "#FFF4E5",
    dot: "#F59E0B",
    text: "#F59E0B",
    label: "Pending",
  },
  accepted: {
    bg: "#ECFDF3",
    dot: "#10B981",
    text: "#10B981",
    label: "Accepted",
  },
  rejected: {
    bg: "#FEF2F2",
    dot: "#EF4444",
    text: "#EF4444",
    label: "Rejected",
  },
  cancelled: {
    bg: "#FEF2F2",
    dot: "#EF4444",
    text: "#EF4444",
    label: "Cancelled",
  },
};

export function MentorshipRequestCard({ request }: MentorshipRequestCardProps) {
  const status = STATUS_CONFIG[request.status] || STATUS_CONFIG.pending;
  const mentor = request.mentor;

  const datePart = request.scheduledDate.split("T")[0];
  const scheduledDate = new Date(`${datePart}T${request.scheduledTime}:00`);

  return (
    <div className="flex flex-col border border-[#E1E4EA] rounded-[16px] bg-white hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-3.5 px-4 pt-4 pb-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {mentor.avatar || mentor.profileImageUrl ? (
              <img
                src={mentor.profileImageUrl || mentor.avatar || ""}
                alt={mentor.fullName || mentor.name || "Mentor"}
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
                  {(mentor.fullName || mentor.name || "M")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <span className="text-[13px] font-medium font-inter-tight text-black">
                {mentor.fullName || mentor.name || "Unknown Mentor"}
              </span>
              <span className="text-[12px] font-light font-inter-tight text-[#525866]">
                {mentor.headline || mentor.title || ""}
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

        <div className="text-[15px] font-medium font-inter-tight text-black">
          {request.topic}
        </div>

        {request.message && (
          <p className="text-[13px] font-normal font-inter-tight text-[#525866] leading-relaxed line-clamp-2">
            {request.message}
          </p>
        )}

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
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-[24px] bg-[#F5F5F5]">
            <span className="text-[12px] font-normal font-inter-tight text-black leading-[12.6px]">
              {request.duration} mins
            </span>
          </div>
          {request.location && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-[24px] bg-[#F5F5F5]">
              <MapPin className="w-3 h-3 text-[#525866]" />
              <span className="text-[12px] font-normal font-inter-tight text-black leading-[12.6px]">
                {request.location}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
