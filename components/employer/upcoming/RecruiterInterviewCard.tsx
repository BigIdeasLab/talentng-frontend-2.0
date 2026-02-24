"use client";

import { format } from "date-fns";
import { Calendar, Clock, Video, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { ApplicationInterview, Application } from "@/lib/api/applications/types";
import { ROLE_COLORS } from "@/lib/theme/role-colors";

interface RecruiterInterviewCardProps {
  interview: ApplicationInterview;
  application: Application;
}

const STATUS_CONFIG: Record<
  string,
  { bg: string; dot: string; text: string; label: string }
> = {
  scheduled: {
    bg: "#ECFDF5",
    dot: "#047857",
    text: "#047857",
    label: "Scheduled",
  },
  rescheduled: {
    bg: "#FFF4E5",
    dot: "#F59E0B",
    text: "#F59E0B",
    label: "Rescheduled",
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

export function RecruiterInterviewCard({
  interview,
  application,
}: RecruiterInterviewCardProps) {
  const status = STATUS_CONFIG[interview.status] || STATUS_CONFIG.scheduled;
  const scheduledDate = new Date(interview.scheduledDate);
  const talent = application.user?.talentProfile;
  const candidateName = talent?.fullName || application.user?.username || "Candidate";
  const candidateAvatar = talent?.profileImageUrl || null;

  return (
    <div className="flex flex-col border border-[#E1E4EA] rounded-[16px] bg-white hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-3.5 px-4 pt-4 pb-3">
        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[#ECFDF5] flex-shrink-0 overflow-hidden flex items-center justify-center">
              {candidateAvatar ? (
                <img
                  src={candidateAvatar}
                  alt={candidateName}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <span
                  className="text-xs font-bold"
                  style={{ color: ROLE_COLORS.recruiter.dark }}
                >
                  {candidateName.charAt(0)}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <h3 className="text-[14px] font-medium font-inter-tight text-black truncate">
                {candidateName}
              </h3>
              <p className="text-[12px] text-[#525866] font-inter-tight truncate">
                {application.opportunity.title} • Interview
              </p>
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

        {/* Message */}
        {interview.message && (
          <p className="text-[13px] font-normal font-inter-tight text-[#525866] leading-relaxed line-clamp-2">
            {interview.message}
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
          {interview.meetingLink && (
            <a
              href={interview.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-[24px] bg-[#ECFDF5] hover:bg-[#D1FAE5] transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Video className="w-3 h-3" style={{ color: ROLE_COLORS.recruiter.dark }} />
              <span
                className="text-[12px] font-medium font-inter-tight leading-[12.6px]"
                style={{ color: ROLE_COLORS.recruiter.dark }}
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
          href={`/applicants?opportunityId=${application.opportunityId}`}
          className="flex items-center gap-1 text-[12px] font-medium font-inter-tight text-[#525866] hover:text-black transition-colors"
        >
          View Applicants
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
