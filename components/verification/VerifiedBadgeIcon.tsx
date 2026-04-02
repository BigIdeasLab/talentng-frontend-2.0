/**
 * Reusable verified badge icon component
 * Displays a blue checkmark icon for verified businesses
 */

import type { VerificationStatus } from "@/lib/api/verification/types";

interface VerifiedBadgeIconProps {
  verificationStatus?: VerificationStatus | "pending" | "approved" | "rejected" | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

export function VerifiedBadgeIcon({
  verificationStatus,
  size = "md",
  className = "",
}: VerifiedBadgeIconProps) {
  if (verificationStatus !== "approved") {
    return null;
  }

  return (
    <img
      src="/verify.png"
      alt="Verified"
      className={`${sizeClasses[size]} flex-shrink-0 ${className}`}
    />
  );
}
