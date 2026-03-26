"use client";

import { Check, Clock, Mail, AlertTriangle } from "lucide-react";
import type { StatusIndicatorProps } from "./types";

export function StatusIndicator({
  status,
  nextUpdateTime,
}: StatusIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "verified":
        return {
          icon: Check,
          text: "Verified",
          className: "text-green-600 bg-green-50 border-green-200",
          iconClassName: "text-green-600",
        };
      case "pending":
        return {
          icon: Clock,
          text: "Pending Verification",
          className: "text-amber-600 bg-amber-50 border-amber-200",
          iconClassName: "text-amber-600",
        };
      case "main-email":
        return {
          icon: Mail,
          text: "Using Main Email",
          className: "text-blue-600 bg-blue-50 border-blue-200",
          iconClassName: "text-blue-600",
        };
      case "rate-limited":
        return {
          icon: AlertTriangle,
          text: "Rate Limited",
          className: "text-orange-600 bg-orange-50 border-orange-200",
          iconClassName: "text-orange-600",
        };
      default:
        return {
          icon: Mail,
          text: "Unknown",
          className: "text-gray-600 bg-gray-50 border-gray-200",
          iconClassName: "text-gray-600",
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const formatNextUpdateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return "Available now";
    } else if (diffDays === 1) {
      return "Available tomorrow";
    } else {
      return `Available in ${diffDays} days`;
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <div
        className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium
        ${config.className}
      `}
      >
        <Icon className={`w-3 h-3 ${config.iconClassName}`} />
        {config.text}
      </div>

      {status === "rate-limited" && nextUpdateTime && (
        <p className="text-[10px] text-[#525866] text-right">
          {formatNextUpdateTime(nextUpdateTime)}
        </p>
      )}
    </div>
  );
}
