"use client";

import { useState } from "react";
import Link from "next/link";
import { useRequireRole } from "@/hooks/useRequireRole";
import { useTickets } from "@/hooks/useSupport";
import { PageLoadingState } from "@/lib/page-utils";
import { TicketCard } from "@/components/support/TicketCard";
import { TicketListSkeleton } from "@/components/support/TicketListSkeleton";
import { CreateTicketModal } from "@/components/support/CreateTicketModal";
import { Button } from "@/components/ui/button";
import { Plus, Ticket } from "lucide-react";
import type { TicketStatus } from "@/lib/api/support/types";

const statusFilters: { value: TicketStatus | "all"; label: string }[] = [
  { value: "all", label: "All Tickets" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

export default function TicketsPage() {
  const hasAccess = useRequireRole(["talent", "recruiter", "mentor"]);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const limit = 20;

  const { data, isLoading, error } = useTickets({
    status: statusFilter === "all" ? undefined : statusFilter,
    limit,
    offset: (currentPage - 1) * limit,
  });

  if (!hasAccess) {
    return <PageLoadingState message="Checking access..." />;
  }

  return (
    <div className="h-[calc(100vh-60px)] md:h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="w-full px-4 md:px-[25px] pt-[19px] pb-[16px] border-b border-[#E1E4EA] flex-shrink-0">
        <div className="flex items-center justify-between mb-[19px]">
          <div>
            <h1 className="text-[16px] font-medium font-inter-tight text-black leading-[16px]">
              My Support Tickets
            </h1>
            <p className="text-[13px] font-inter-tight text-[#525866] mt-2">
              View and manage your support requests
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#5C30FF] hover:bg-[#4a24d6] text-white text-[13px] font-inter-tight h-[44px] md:h-[38px] px-[15px]"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Ticket
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-[8px] overflow-x-auto scrollbar-hide">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => {
                setStatusFilter(filter.value);
                setCurrentPage(1);
              }}
              className={`px-[12px] py-[6px] flex justify-center items-center whitespace-nowrap flex-shrink-0 rounded transition-colors ${
                statusFilter === filter.value
                  ? "text-black font-medium border-b-2 border-black"
                  : "text-black/30 font-medium hover:text-black/50"
              }`}
            >
              <span className="text-[13px] font-inter-tight">
                {filter.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto scrollbar-styled p-4 md:p-[25px]">
          {isLoading || !data ? (
            <TicketListSkeleton />
          ) : error ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
                <Ticket className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-[15px] font-medium font-inter-tight text-black mb-2">
                Failed to load tickets
              </h3>
              <p className="text-[13px] font-inter-tight text-[#525866]">
                {error instanceof Error
                  ? error.message
                  : "An error occurred while loading your tickets"}
              </p>
            </div>
          ) : data.data.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#F5F5F5] mb-4">
                <Ticket className="w-6 h-6 text-[#525866]" />
              </div>
              <h3 className="text-[15px] font-medium font-inter-tight text-black mb-2">
                No tickets found
              </h3>
              <p className="text-[13px] font-inter-tight text-[#525866] mb-4">
                {statusFilter === "all"
                  ? "You haven't created any support tickets yet"
                  : `No ${statusFilter.replace("_", " ")} tickets found`}
              </p>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-[#5C30FF] hover:bg-[#4a24d6] text-white text-[13px] font-inter-tight h-[38px] px-[15px]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Ticket
              </Button>
            </div>
          ) : (
            <>
              {/* Tickets List */}
              <div className="space-y-3 mb-6">
                {data.data.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>

              {/* Pagination */}
              {data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-[#E1E4EA] pt-4">
                  <div className="text-[13px] font-inter-tight text-[#525866]">
                    Showing {(currentPage - 1) * limit + 1} to{" "}
                    {Math.min(currentPage * limit, data.pagination.total)} of{" "}
                    {data.pagination.total} tickets
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={!data.pagination.hasPreviousPage}
                      className="text-[13px] font-inter-tight h-[38px] px-[15px]"
                    >
                      Previous
                    </Button>
                    <span className="text-[13px] font-inter-tight text-[#525866]">
                      Page {currentPage} of {data.pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => p + 1)}
                      disabled={!data.pagination.hasNextPage}
                      className="text-[13px] font-inter-tight h-[38px] px-[15px]"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
