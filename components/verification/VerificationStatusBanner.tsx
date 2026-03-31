"use client";

import { AlertCircle, CheckCircle, Clock, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import type { VerificationStatus } from "@/lib/api/verification";

interface VerificationStatusBannerProps {
  status: VerificationStatus;
  rejectionReason?: string;
  onActionClick: () => void;
  className?: string;
}

export function VerificationStatusBanner({
  status,
  rejectionReason,
  onActionClick,
  className = "",
}: VerificationStatusBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed && status === "approved") {
    return null;
  }

  const config = {
    not_started: {
      bgColor: "bg-gradient-to-r from-amber-50 to-yellow-50",
      borderColor: "border-amber-200",
      icon: <ShieldCheck className="h-6 w-6 text-amber-600" />,
      title: "Verify Your Business",
      message:
        "Get a verified badge and build trust with talent. Verification takes 2-3 business days.",
      actionText: "Start Verification",
      actionColor: "bg-amber-600 hover:bg-amber-700 text-white",
      showDismiss: false,
    },
    pending: {
      bgColor: "bg-gradient-to-r from-blue-50 to-indigo-50",
      borderColor: "border-blue-200",
      icon: <Clock className="h-6 w-6 text-blue-600" />,
      title: "Verification In Progress",
      message:
        "Your application is being reviewed. We'll notify you once the review is complete.",
      actionText: "View Status",
      actionColor: "bg-blue-600 hover:bg-blue-700 text-white",
      showDismiss: false,
    },
    approved: {
      bgColor: "bg-gradient-to-r from-green-50 to-emerald-50",
      borderColor: "border-green-200",
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      title: "Verified ✓",
      message:
        "Your business is verified! Your verified badge is now displayed on your profile.",
      actionText: "View Profile",
      actionColor: "bg-green-600 hover:bg-green-700 text-white",
      showDismiss: true,
    },
    rejected: {
      bgColor: "bg-gradient-to-r from-red-50 to-rose-50",
      borderColor: "border-red-200",
      icon: <AlertCircle className="h-6 w-6 text-red-600" />,
      title: "Verification Rejected",
      message:
        rejectionReason ||
        "Your verification was not approved. Please review the feedback and resubmit.",
      actionText: "Resubmit Application",
      actionColor: "bg-red-600 hover:bg-red-700 text-white",
      showDismiss: false,
    },
  };

  const currentConfig = config[status];

  return (
    <div
      className={`relative rounded-lg border ${currentConfig.borderColor} ${currentConfig.bgColor} p-4 md:p-6 ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-0.5">{currentConfig.icon}</div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {currentConfig.title}
          </h3>
          <p className="text-sm text-gray-700 mb-4">{currentConfig.message}</p>

          <button
            onClick={onActionClick}
            className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${currentConfig.actionColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white`}
            aria-label={currentConfig.actionText}
          >
            {currentConfig.actionText}
          </button>
        </div>

        {currentConfig.showDismiss && (
          <button
            onClick={() => setIsDismissed(true)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
