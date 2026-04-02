import { cn } from "@/lib/utils";
import type { TicketStatus } from "@/lib/api/support/types";

interface StatusBadgeProps {
  status: TicketStatus;
  className?: string;
}

const statusConfig: Record<TicketStatus, { label: string; className: string }> =
  {
    open: {
      label: "Open",
      className: "bg-blue-100 text-blue-700 border-blue-200",
    },
    in_progress: {
      label: "In Progress",
      className: "bg-yellow-100 text-yellow-700 border-yellow-200",
    },
    resolved: {
      label: "Resolved",
      className: "bg-green-100 text-green-700 border-green-200",
    },
    closed: {
      label: "Closed",
      className: "bg-gray-100 text-gray-700 border-gray-200",
    },
  };

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium font-inter-tight border",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
