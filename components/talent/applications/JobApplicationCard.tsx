"use client";

import { format } from "date-fns";
import { MapPin, Calendar } from "lucide-react";
import type { Application } from "@/lib/api/applications/types";

interface JobApplicationCardProps {
  application: Application;
}

const STATUS_CONFIG: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  invited: { bg: "#DBEAFE", text: "#2563EB", label: "Invited" },
  applied: { bg: "#F5F5F5", text: "#606060", label: "Applied" },
  shortlisted: { bg: "#F3E8FF", text: "#7C3AED", label: "Shortlisted" },
  hired: { bg: "#EEFDF0", text: "#008B47", label: "Hired" },
  rejected: { bg: "#FEE2E2", text: "#DC2626", label: "Rejected" },
};

export function JobApplicationCard({ application }: JobApplicationCardProps) {
  const status = STATUS_CONFIG[application.status] || STATUS_CONFIG.applied;
  const opportunity = application.opportunity;

  return (
    <div className="flex flex-col border border-[#E1E4EA] rounded-[16px] bg-white hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-[#002224] flex-shrink-0 overflow-hidden">
              {opportunity.company && (
                <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                  {opportunity.company.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <h3 className="text-[14px] font-medium font-inter-tight text-black truncate">
                {opportunity.title}
              </h3>
              <p className="text-[12px] text-[#525866] font-inter-tight truncate">
                {opportunity.company}
              </p>
            </div>
          </div>
          <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md flex-shrink-0"
            style={{ backgroundColor: status.bg }}
          >
            <span
              className="text-[11px] font-medium font-inter-tight"
              style={{ color: status.text }}
            >
              {status.label}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-[#525866]" />
            <span className="text-[12px] font-normal font-inter-tight text-[#525866]">
              {opportunity.location}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-[#525866]" />
            <span className="text-[12px] font-normal font-inter-tight text-[#525866]">
              {format(new Date(application.createdAt), "MMM d, yyyy")}
            </span>
          </div>
          {opportunity.type && (
            <div className="px-2 py-1 rounded-md bg-[#F5F5F5]">
              <span className="text-[11px] font-normal font-inter-tight text-[#525866]">
                {opportunity.type}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
