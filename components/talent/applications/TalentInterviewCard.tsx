"use client";

import { format } from "date-fns";
import { Calendar, Clock, Video, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { ApplicationInterview } from "@/lib/api/applications/types";

interface TalentInterviewCardProps {
  interview: ApplicationInterview;
  opportunityTitle: string;
  company: string;
  opportunityId: string;
  companyLogo?: string | null;
}

const STATUS_CONFIG: Record<
  string,
  { bg: string; dot: string; text: string; label: string }
> = {
  scheduled: {
    bg: "#EFF6FF",
    dot: "#2563EB",
    text: "#2563EB",
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

export function TalentInterviewCard({
  interview,
  opportunityTitle,
  company,
  opportunityId,
  companyLogo,
}: TalentInterviewCardProps) {
  const status = STATUS_CONFIG[interview.status] || STATUS_CONFIG.scheduled;
  const scheduledDate = new Date(interview.scheduledDate);

  return (
    <div className="flex flex-col border border-[#E1E4EA] rounded-[16px] bg-white hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-3.5 px-4 pt-4 pb-3">
        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-[#F0F1F3] flex-shrink-0 overflow-hidden flex items-center justify-center">
              {companyLogo ? (
                <img
                  src={companyLogo}
                  alt={company}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <span className="text-[#525866] text-xs font-bold">
                  {company?.charAt(0) || "?"}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <h3 className="text-[14px] font-medium font-inter-tight text-black truncate">
                {opportunityTitle}
              </h3>
              <p className="text-[12px] text-[#525866] font-inter-tight truncate">
                {company} • Interview
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
              className="flex items-center gap-1.5 px-3 py-2 rounded-[24px] bg-[#EFF6FF] hover:bg-[#DBEAFE] transition-colors"
              onClick={(e) => e.stopPropagation()}
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
          href={`/opportunities/${opportunityId}`}
          className="flex items-center gap-1 text-[12px] font-medium font-inter-tight text-[#525866] hover:text-black transition-colors"
        >
          View Opportunity
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
