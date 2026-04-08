"use client";

import { useRouter } from "next/navigation";
import type { MappedApplicant } from "@/lib/mappers/application";

const statusDisplayMap = {
  applied: { label: "New Application", bg: "#FEF3C7", text: "#D97706" },
  invitedApplication: { label: "Invited Application", bg: "#E0F2FE", text: "#0369A1" },
  invited: { label: "Invited", bg: "#DBEAFE", text: "#2563EB" },
  shortlisted: { label: "Shortlisted", bg: "#F3E8FF", text: "#7C3AED" },
  hired: { label: "Hired", bg: "#ECFDF3", text: "#059669" },
  rejected: { label: "Rejected", bg: "#FEF2F2", text: "#DC2626" },
};

const interviewStatusDisplayMap = {
  scheduled: { label: "Interview Scheduled", bg: "#EFF6FF", text: "#2563EB" },
  rescheduled: {
    label: "Interview Rescheduled",
    bg: "#FEF3C7",
    text: "#D97706",
  },
};

interface ApplicantCardProps {
  applicant: MappedApplicant;
  onHireClick: (applicant: MappedApplicant) => void;
}

export function ApplicantCard({ applicant, onHireClick }: ApplicantCardProps) {
  const router = useRouter();

  const getStatusDisplay = () => {
    // Check for invited application (accepted invitation)
    if (
      applicant.status === "applied" &&
      applicant.sourceType === "invited"
    ) {
      return statusDisplayMap["invitedApplication"];
    }
    if (
      applicant.status === "shortlisted" &&
      applicant.interviewStatus === "cancelled"
    ) {
      return statusDisplayMap["applied"];
    }
    if (
      applicant.status === "shortlisted" &&
      applicant.interviewStatus &&
      (applicant.interviewStatus === "scheduled" ||
        applicant.interviewStatus === "rescheduled")
    ) {
      return interviewStatusDisplayMap[applicant.interviewStatus];
    }
    return statusDisplayMap[applicant.status];
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className="border border-[#E1E4EA] rounded-[12px] p-4 bg-white">
      {/* Header: Avatar + Name + Status */}
      <div className="flex items-start gap-3 mb-3">
        <button
          onClick={() => router.push(`/discover-talent/${applicant.userId}`)}
          className="flex-shrink-0"
        >
          <img
            src={applicant.avatar || "/default.png"}
            alt={applicant.name}
            className="w-12 h-12 rounded-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/default.png";
            }}
          />
        </button>
        <div className="flex-1 min-w-0">
          <button
            onClick={() => router.push(`/discover-talent/${applicant.userId}`)}
            className="text-left w-full"
          >
            <h3 className="font-inter-tight text-[15px] font-medium text-black truncate">
              {applicant.name}
            </h3>
            <p className="font-inter-tight text-[13px] text-[#525866] truncate">
              {applicant.role}
            </p>
          </button>
        </div>
        <div
          className="flex items-center justify-center px-3 py-1 rounded-full flex-shrink-0"
          style={{ backgroundColor: statusDisplay.bg }}
        >
          <span
            className="font-inter-tight text-[11px] font-semibold whitespace-nowrap"
            style={{ color: statusDisplay.text }}
          >
            {statusDisplay.label}
          </span>
        </div>
      </div>

      {/* Opportunity */}
      <div className="mb-3">
        <p className="font-inter-tight text-[13px] font-medium text-black mb-1">
          {applicant.opportunity.title}
        </p>
        {applicant.opportunity.type && (
          <p className="font-inter-tight text-[12px] text-[#606060]">
            {applicant.opportunity.type}
          </p>
        )}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <p className="font-inter-tight text-[11px] text-[#525866] mb-1">
            Location
          </p>
          <p className="font-inter-tight text-[13px] text-black truncate">
            {applicant.location}
          </p>
        </div>
        <div>
          <p className="font-inter-tight text-[11px] text-[#525866] mb-1">
            Date Applied
          </p>
          <p className="font-inter-tight text-[13px] text-black">
            {applicant.dateApplied}
          </p>
        </div>
        <div>
          <p className="font-inter-tight text-[11px] text-[#525866] mb-1">
            Hires
          </p>
          <p className="font-inter-tight text-[13px] text-black">
            {applicant.hires}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {applicant.status !== "invited" && (
          <button
            onClick={() => router.push(`/applicants/${applicant.id}`)}
            className="flex-1 min-h-[44px] px-4 py-3 rounded-full bg-[#181B25] hover:bg-[#2a2d3a] transition-colors"
          >
            <span className="font-inter-tight text-[13px] font-medium text-white">
              View Proposal
            </span>
          </button>
        )}
        {applicant.status !== "rejected" &&
          applicant.status !== "hired" &&
          applicant.status !== "invited" && (
            <button
              onClick={() => onHireClick(applicant)}
              style={{
                backgroundColor: "#0D9F5C",
                borderColor: "#0D9F5C",
              }}
              className="flex-1 min-h-[44px] px-4 py-3 rounded-full border hover:opacity-90 transition-colors"
            >
              <span className="font-inter-tight text-[13px] font-medium text-white">
                Hire
              </span>
            </button>
          )}
        {applicant.status === "hired" && (
          <button
            disabled
            className="flex-1 min-h-[44px] px-4 py-3 rounded-full bg-[#008B47] cursor-default opacity-70"
          >
            <span className="font-inter-tight text-[13px] font-medium text-white">
              Hired
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
