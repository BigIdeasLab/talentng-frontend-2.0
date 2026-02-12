"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import {
  Check,
  X,
  Clock,
  Calendar,
  MapPin,
  Loader2,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { useToast } from "@/hooks";
import {
  getRequests,
  getPendingRequestsCount,
  acceptRequest,
  rejectRequest,
} from "@/lib/api/mentorship";
import type { MentorshipRequest as ApiMentorshipRequest } from "@/lib/api/mentorship";

interface MentorshipRequest {
  id: string;
  mentee: {
    id: string;
    name: string;
    avatar?: string;
    title: string;
    company: string;
  };
  topic: string;
  message: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: string;
  location: string;
  requestedAt: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
}

function mapApiRequest(request: ApiMentorshipRequest): MentorshipRequest {
  const datePart = request.scheduledDate.split("T")[0];
  const scheduledDate = new Date(`${datePart}T${request.scheduledTime}:00`);
  return {
    id: request.id,
    mentee: {
      id: request.mentee.id,
      name:
        request.mentee.fullName ||
        request.mentee.name ||
        request.mentee.username ||
        "Unknown",
      avatar:
        request.mentee.profileImageUrl || request.mentee.avatar || undefined,
      title: request.mentee.headline || "",
      company: "",
    },
    topic: request.topic,
    message: request.message || "",
    scheduledDate: format(scheduledDate, "EEE MMM d, yyyy"),
    scheduledTime: format(scheduledDate, "h:mm a"),
    duration: `${request.duration} mins`,
    location: request.location || "Google Meet",
    requestedAt: request.createdAt,
    status: request.status,
  };
}

export default function ApplicationsPage() {
  const { toast } = useToast();
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null,
  );

  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const [requestsResponse, countResponse] = await Promise.all([
        getRequests({ role: "received" }),
        getPendingRequestsCount(),
      ]);
      console.log("requestsResponse:", requestsResponse);
      console.log("countResponse:", countResponse);
      // Handle both { data: [...] } and direct array responses
      const requestsArray = Array.isArray(requestsResponse)
        ? requestsResponse
        : (requestsResponse?.data ?? []);
      setRequests(requestsArray.map(mapApiRequest));
      setPendingCount(countResponse?.count ?? 0);
    } catch (error) {
      console.error("Failed to load mentorship requests:", error);
      setRequests([]);
      setPendingCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const TABS = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "accepted", label: "Accepted" },
    { id: "rejected", label: "Rejected" },
  ];

  const filteredRequests = requests.filter((req) => {
    const matchesFilter = filter === "all" || req.status === filter;
    const matchesSearch =
      searchQuery === "" ||
      req.mentee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAccept = (id: string) => {
    setSelectedRequestId(id);
    setAcceptModalOpen(true);
  };

  const handleReject = (id: string) => {
    setSelectedRequestId(id);
    setDeclineModalOpen(true);
  };

  const confirmAccept = async () => {
    if (!selectedRequestId) return;
    try {
      setIsActionLoading(true);
      await acceptRequest(selectedRequestId);
      toast({
        title: "Request accepted",
        description: "The mentorship session has been created",
      });
      await fetchRequests();
    } catch {
      toast({
        title: "Error",
        description: "Failed to accept request",
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const confirmDecline = async () => {
    if (!selectedRequestId) return;
    try {
      setIsActionLoading(true);
      await rejectRequest(selectedRequestId);
      toast({
        title: "Request declined",
        description: "The request has been declined",
      });
      await fetchRequests();
    } catch {
      toast({
        title: "Error",
        description: "Failed to decline request",
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-x-hidden bg-white flex flex-col">
      {/* Header */}
      <div className="w-full px-[25px] pt-[19px] pb-[16px] border-b border-[#E1E4EA] flex-shrink-0">
        {/* Title Row */}
        <div className="flex items-center justify-between mb-[19px]">
          <h1 className="text-[16px] font-medium font-inter-tight text-black leading-[16px]">
            Mentorship Requests
          </h1>
          {pendingCount > 0 && (
            <div className="flex items-center gap-2 rounded-full bg-[#FFF4E5] px-3 py-1.5">
              <Clock className="h-4 w-4 text-[#F59E0B]" />
              <span className="font-inter-tight text-[13px] font-medium text-[#F59E0B]">
                {pendingCount} pending
              </span>
            </div>
          )}
        </div>

        {/* Search Bar and Filter */}
        <div className="flex items-center gap-[8px] mb-[19px]">
          <div className="flex-1 max-w-[585px] h-[38px] px-[12px] py-[7px] flex items-center gap-[6px] border border-[#E1E4EA] rounded-[8px]">
            <Search className="w-[15px] h-[15px] text-[#B2B2B2] flex-shrink-0" />
            <input
              type="text"
              placeholder="Search mentee, topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-[13px] font-normal font-inter-tight placeholder:text-black/30 border-0 focus:outline-none bg-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="flex-shrink-0 text-[#B2B2B2] hover:text-black transition-colors"
              >
                <X className="w-[15px] h-[15px]" />
              </button>
            )}
          </div>

          <button className="h-[38px] px-[15px] py-[7px] flex items-center gap-[5px] bg-[#F5F5F5] rounded-[8px] flex-shrink-0 hover:bg-gray-100 transition-colors">
            <SlidersHorizontal className="w-[15px] h-[15px] text-black" />
            <span className="text-[13px] font-normal text-black font-inter-tight">
              Filter
            </span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-[8px] overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-[12px] py-[6px] flex justify-center items-center whitespace-nowrap flex-shrink-0 rounded transition-colors ${
                filter === tab.id
                  ? "text-black font-medium border-b-2 border-black"
                  : "text-black/30 font-medium hover:text-black/50"
              }`}
            >
              <span className="text-[13px] font-inter-tight">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-4 md:p-6">
        {/* Request Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[7px]">
          {isLoading ? (
            <div className="rounded-xl border border-[#E1E4EA] bg-white px-6 py-12 text-center">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#E91E8C]" />
              <p className="mt-2 font-inter-tight text-[14px] text-[#525866]">
                Loading requests...
              </p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="rounded-xl border border-[#E1E4EA] bg-white px-6 py-12 text-center">
              <p className="font-inter-tight text-[14px] text-[#525866]">
                No requests found
              </p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div
                key={request.id}
                className="flex flex-col border border-[#E1E4EA] rounded-[16px] bg-white hover:shadow-md transition-shadow"
              >
                {/* Card Content */}
                <div className="flex flex-col gap-3.5 px-4 pt-4 pb-3">
                  {/* Header - Avatar + Info + Status Badge */}
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      {request.mentee.avatar ? (
                        <img
                          src={request.mentee.avatar}
                          alt={request.mentee.name}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#FDF2F8] flex items-center justify-center flex-shrink-0">
                          <span className="text-[12px] font-semibold font-inter-tight text-[#E91E8C]">
                            {request.mentee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                      )}
                      <div className="flex flex-col gap-1">
                        <span className="text-[13px] font-medium font-inter-tight text-black">
                          {request.mentee.name}
                        </span>
                        <span className="text-[12px] font-light font-inter-tight text-[#525866]">
                          {request.mentee.title} at {request.mentee.company}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md flex-shrink-0 ${
                        request.status === "pending"
                          ? "bg-[#FFF4E5]"
                          : request.status === "accepted"
                            ? "bg-[#ECFDF3]"
                            : "bg-[#FEF2F2]"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          request.status === "pending"
                            ? "bg-[#F59E0B]"
                            : request.status === "accepted"
                              ? "bg-[#10B981]"
                              : "bg-[#EF4444]"
                        }`}
                      />
                      <span
                        className={`text-[11px] font-normal font-inter-tight ${
                          request.status === "pending"
                            ? "text-[#F59E0B]"
                            : request.status === "accepted"
                              ? "text-[#10B981]"
                              : "text-[#EF4444]"
                        }`}
                      >
                        {request.status.charAt(0).toUpperCase() +
                          request.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Topic */}
                  <div className="text-[15px] font-medium font-inter-tight text-black">
                    {request.topic}
                  </div>

                  {/* Message */}
                  <p className="text-[13px] font-normal font-inter-tight text-[#525866] leading-relaxed line-clamp-2">
                    {request.message}
                  </p>

                  {/* Details as pills */}
                  <div className="flex items-start content-start gap-x-1 gap-y-1.5 flex-wrap">
                    <div className="flex items-center gap-1.5 px-3 py-2 rounded-[24px] bg-[#F5F5F5]">
                      <Calendar className="w-3 h-3 text-[#525866]" />
                      <span className="text-[12px] font-normal font-inter-tight text-black leading-[12.6px]">
                        {request.scheduledDate}, {request.scheduledTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-2 rounded-[24px] bg-[#F5F5F5]">
                      <Clock className="w-3 h-3 text-[#525866]" />
                      <span className="text-[12px] font-normal font-inter-tight text-black leading-[12.6px]">
                        {request.duration}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-2 rounded-[24px] bg-[#F5F5F5]">
                      <MapPin className="w-3 h-3 text-[#525866]" />
                      <span className="text-[12px] font-normal font-inter-tight text-black leading-[12.6px]">
                        {request.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer - Actions */}
                <div className="flex items-center justify-end px-4 py-2.5 border-t border-[#E1E4EA]">
                  <div className="flex items-center gap-1">
                    {request.status === "pending" ? (
                      <>
                        <button
                          onClick={() => handleAccept(request.id)}
                          className="flex items-center gap-1 px-4 py-2 h-8 bg-[#E91E8C] hover:bg-[#D1187D] rounded-[40px] transition-colors"
                        >
                          <Check className="w-4 h-4 text-white" />
                          <span className="text-[12px] font-medium font-inter-tight text-white">
                            Accept
                          </span>
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          className="flex items-center gap-1 px-4 py-2 h-8 border border-[#E1E4EA] rounded-[40px] hover:border-[#EF4444] hover:bg-[#FEF2F2] hover:text-[#EF4444] transition-colors"
                        >
                          <X className="w-4 h-4" />
                          <span className="text-[12px] font-medium font-inter-tight">
                            Decline
                          </span>
                        </button>
                      </>
                    ) : request.status === "accepted" ? (
                      <span className="text-[12px] font-inter-tight text-[#10B981]">
                        Request accepted
                      </span>
                    ) : (
                      <span className="text-[12px] font-inter-tight text-[#EF4444]">
                        Request declined
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        </div>
      </div>

      {/* Accept Confirmation Modal */}
      <ConfirmationModal
        isOpen={acceptModalOpen}
        onClose={() => setAcceptModalOpen(false)}
        onConfirm={confirmAccept}
        title="Accept Request"
        description="Are you sure you want to accept this mentorship request? A session will be created."
        confirmText="Yes, Accept"
        type="success"
        isLoading={isActionLoading}
      />

      {/* Decline Confirmation Modal */}
      <ConfirmationModal
        isOpen={declineModalOpen}
        onClose={() => setDeclineModalOpen(false)}
        onConfirm={confirmDecline}
        title="Decline Request"
        description="Are you sure you want to decline this mentorship request?"
        confirmText="Yes, Decline"
        type="danger"
        isLoading={isActionLoading}
      />
    </div>
  );
}
