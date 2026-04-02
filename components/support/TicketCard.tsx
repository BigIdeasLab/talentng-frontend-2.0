import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Clock } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import type { TicketListItem } from "@/lib/api/support/types";

interface TicketCardProps {
  ticket: TicketListItem;
}

const categoryLabels: Record<string, string> = {
  account: "Account",
  payment: "Payment",
  technical: "Technical",
  other: "Other",
};

export function TicketCard({ ticket }: TicketCardProps) {
  return (
    <Link
      href={`/support/tickets/${ticket.id}`}
      className="block border border-[#E1E4EA] rounded-[12px] p-4 hover:bg-[#F5F5F5] transition-colors"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-medium font-inter-tight text-[#525866]">
              {ticket.ticketId}
            </span>
            <span className="text-[11px] font-inter-tight text-[#525866]">
              •
            </span>
            <span className="text-[11px] font-inter-tight text-[#525866]">
              {categoryLabels[ticket.category]}
            </span>
          </div>
          <h3 className="text-[13px] font-medium font-inter-tight text-black truncate">
            {ticket.subject}
          </h3>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <StatusBadge status={ticket.status} />
          {ticket.priority !== "medium" && (
            <PriorityBadge priority={ticket.priority} />
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 text-[11px] font-inter-tight text-[#525866]">
        <div className="flex items-center gap-1">
          <MessageCircle className="w-3.5 h-3.5" />
          <span>
            {ticket.replyCount} {ticket.replyCount === 1 ? "reply" : "replies"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span>
            {ticket.lastReplyAt
              ? `Updated ${formatDistanceToNow(new Date(ticket.lastReplyAt), { addSuffix: true })}`
              : `Created ${formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}`}
          </span>
        </div>
      </div>
    </Link>
  );
}
