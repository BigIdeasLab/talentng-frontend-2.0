"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useRequireRole } from "@/hooks/useRequireRole";
import { useTicket, useAddReply } from "@/hooks/useSupport";
import { PageLoadingState } from "@/lib/page-utils";
import { StatusBadge } from "@/components/support/StatusBadge";
import { PriorityBadge } from "@/components/support/PriorityBadge";
import { ConversationThread } from "@/components/support/ConversationThread";
import { ReplyForm } from "@/components/support/ReplyForm";
import { TicketDetailSkeleton } from "@/components/support/TicketDetailSkeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle, User } from "lucide-react";

const categoryLabels: Record<string, string> = {
  account: "Account",
  payment: "Payment",
  technical: "Technical",
  other: "Other",
};

export default function TicketDetailPage() {
  const hasAccess = useRequireRole(["talent", "recruiter", "mentor"]);
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;

  const { data: ticket, isLoading, error } = useTicket(ticketId);
  const addReplyMutation = useAddReply(ticketId);

  const handleReply = async (message: string) => {
    await addReplyMutation.mutateAsync(message);
  };

  if (!hasAccess) {
    return <PageLoadingState message="Checking access..." />;
  }

  if (isLoading || !ticket) {
    return <TicketDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-[16px] font-medium font-inter-tight text-black mb-2">
            Failed to load ticket
          </h2>
          <p className="text-[13px] font-inter-tight text-[#525866] mb-6">
            {error instanceof Error
              ? error.message
              : "This ticket could not be found or you don't have access to it"}
          </p>
          <Link href="/support/tickets">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tickets
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const canReply = ticket.status !== "closed";

  return (
    <div className="h-[calc(100vh-60px)] md:h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="w-full px-4 md:px-[25px] pt-[19px] pb-[16px] border-b border-[#E1E4EA] flex-shrink-0">
        <div className="flex items-center justify-between mb-[19px]">
          <div className="flex items-center gap-3">
            <Link href="/support/tickets">
              <Button
                variant="ghost"
                className="text-[13px] font-inter-tight h-[38px] px-[15px] gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Tickets
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
          </div>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[12px] font-medium font-inter-tight text-[#525866]">
                {ticket.ticketId}
              </span>
              <span className="text-[12px] font-inter-tight text-[#525866]">
                •
              </span>
              <span className="text-[12px] font-inter-tight text-[#525866]">
                {categoryLabels[ticket.category]}
              </span>
            </div>
            <h1 className="text-[16px] font-medium font-inter-tight text-black leading-[16px]">
              {ticket.subject}
            </h1>
            <p className="text-[13px] font-inter-tight text-[#525866] mt-2">
              Created{" "}
              {formatDistanceToNow(new Date(ticket.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto scrollbar-styled">
          <div className="max-w-4xl mx-auto p-4 md:p-[25px] space-y-6">
            {/* Original Message */}
            <div className="border border-[#E1E4EA] rounded-[12px] p-5 bg-[#F5F5F5]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[12px] font-medium font-inter-tight text-black">
                    Original Request
                  </p>
                  <p className="text-[11px] font-inter-tight text-[#525866]">
                    {formatDistanceToNow(new Date(ticket.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
              <p className="text-[13px] font-inter-tight text-black leading-relaxed whitespace-pre-wrap">
                {ticket.description}
              </p>
            </div>

            {/* Assigned Admin Info */}
            {ticket.assignedTo && (
              <div className="border border-[#E1E4EA] rounded-[12px] p-4 bg-purple-50">
                <p className="text-[12px] font-medium font-inter-tight text-purple-900 mb-1">
                  Assigned to Support Team
                </p>
                <p className="text-[11px] font-inter-tight text-purple-700">
                  {ticket.assignedTo.username} is handling your request
                </p>
              </div>
            )}

            {/* Conversation Thread */}
            {ticket.conversation.length > 0 && (
              <div>
                <h2 className="text-[14px] font-medium font-inter-tight text-black mb-4">
                  Conversation
                </h2>
                <ConversationThread messages={ticket.conversation} />
              </div>
            )}

            {/* Reply Form */}
            {canReply ? (
              <div className="border border-[#E1E4EA] rounded-[12px] p-5">
                <h2 className="text-[14px] font-medium font-inter-tight text-black mb-4">
                  Add Reply
                </h2>
                <ReplyForm
                  onSubmit={handleReply}
                  isSubmitting={addReplyMutation.isPending}
                />
              </div>
            ) : (
              <div className="border border-[#E1E4EA] rounded-[12px] p-5 bg-[#F5F5F5] text-center">
                <p className="text-[13px] font-inter-tight text-[#525866]">
                  This ticket is closed. You cannot add new replies.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
