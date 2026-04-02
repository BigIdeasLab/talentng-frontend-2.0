"use client";

import { CheckCircle, Clock, XCircle, FileText } from "lucide-react";
import { format } from "date-fns";
import type { VerificationStatus } from "@/lib/api/verification";
import { cn } from "@/lib/utils";

interface StatusTimelineProps {
  status: VerificationStatus;
  submittedAt?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export function StatusTimeline({
  status,
  submittedAt,
  reviewedAt,
  rejectionReason,
}: StatusTimelineProps) {
  const steps = [
    {
      id: "submitted",
      label: "Application Submitted",
      isComplete: status !== "not_started",
      timestamp: submittedAt,
      icon: FileText,
    },
    {
      id: "review",
      label: "Under Review",
      isComplete: status === "approved" || status === "rejected",
      isCurrent: status === "pending",
      timestamp: status === "pending" ? submittedAt : reviewedAt,
      icon: Clock,
    },
    {
      id: "result",
      label: status === "rejected" ? "Rejected" : "Approved",
      isComplete: status === "approved" || status === "rejected",
      timestamp: reviewedAt,
      icon: status === "rejected" ? XCircle : CheckCircle,
      isRejected: status === "rejected",
    },
  ];

  if (status === "not_started") {
    return (
      <div className="text-center py-8 text-black/60">
        <p className="font-inter-tight text-[13px]">
          No verification application submitted yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className="relative">
            {!isLast && (
              <div
                className={cn(
                  "absolute left-4 top-10 h-full w-0.5",
                  step.isComplete ? "bg-blue-600" : "bg-gray-300",
                )}
                aria-hidden="true"
              />
            )}

            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0",
                  step.isComplete &&
                    !step.isRejected &&
                    "bg-blue-600 text-white",
                  step.isRejected && "bg-red-600 text-white",
                  step.isCurrent && "bg-blue-100 text-blue-600 animate-pulse",
                  !step.isComplete &&
                    !step.isCurrent &&
                    "bg-gray-200 text-gray-500",
                )}
                aria-label={`${step.label} ${step.isComplete ? "completed" : step.isCurrent ? "in progress" : "pending"}`}
              >
                <Icon className="h-4 w-4" />
              </div>

              <div className="flex-1 min-w-0 pt-0.5">
                <p
                  className={cn(
                    "font-inter-tight text-[13px] font-medium",
                    step.isComplete || step.isCurrent
                      ? "text-black"
                      : "text-black/50",
                  )}
                >
                  {step.label}
                </p>

                {step.timestamp && (
                  <p className="font-inter-tight text-[11px] text-black/60 mt-1">
                    {format(new Date(step.timestamp), "MMM d, yyyy h:mm a")}
                  </p>
                )}

                {step.isRejected && rejectionReason && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="font-inter-tight text-[13px] text-red-800">
                      <span className="font-medium">Reason: </span>
                      {rejectionReason}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
