import { cn } from "@/lib/utils";
import type { TicketPriority } from "@/lib/api/support/types";
import { AlertCircle } from "lucide-react";

interface PriorityBadgeProps {
  priority: TicketPriority;
  className?: string;
}

const priorityConfig: Record<
  TicketPriority,
  { label: string; className: string; showIcon?: boolean }
> = {
  low: {
    label: "Low",
    className: "bg-gray-100 text-gray-600",
  },
  medium: {
    label: "Medium",
    className: "bg-blue-100 text-blue-600",
  },
  high: {
    label: "High",
    className: "bg-orange-100 text-orange-600",
    showIcon: true,
  },
  urgent: {
    label: "Urgent",
    className: "bg-red-100 text-red-600",
    showIcon: true,
  },
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium font-inter-tight",
        config.className,
        className,
      )}
    >
      {config.showIcon && <AlertCircle className="w-3 h-3" />}
      {config.label}
    </span>
  );
}
