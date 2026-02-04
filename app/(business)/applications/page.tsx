"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, X, Clock, Calendar, MessageSquare, MapPin } from "lucide-react";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

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
  status: "pending" | "accepted" | "rejected";
}

const MOCK_REQUESTS: MentorshipRequest[] = [
  {
    id: "1",
    mentee: {
      id: "m1",
      name: "Adaeze Okonkwo",
      title: "Junior Developer",
      company: "TechStart Lagos",
    },
    topic: "Backend Development",
    message:
      "Hi! I'm looking for guidance on transitioning from frontend to fullstack development. I've been working with React for 2 years and want to learn Node.js and system design.",
    scheduledDate: "Mon Feb 5, 2024",
    scheduledTime: "2:00 PM",
    duration: "60 mins",
    location: "Google Meet",
    requestedAt: "2024-02-03",
    status: "pending",
  },
  {
    id: "2",
    mentee: {
      id: "m2",
      name: "Chukwudi Eze",
      title: "Product Designer",
      company: "Fintech Hub",
    },
    topic: "Design Systems",
    message:
      "I want to improve my design-to-development handoff skills and learn more about design systems. Would love your mentorship!",
    scheduledDate: "Wed Feb 7, 2024",
    scheduledTime: "10:00 AM",
    duration: "60 mins",
    location: "Zoom",
    requestedAt: "2024-02-02",
    status: "pending",
  },
  {
    id: "3",
    mentee: {
      id: "m3",
      name: "Ngozi Abubakar",
      title: "CS Student",
      company: "University of Lagos",
    },
    topic: "Interview Prep",
    message:
      "I'm a final year student preparing for tech interviews. I need help with DSA and mock interviews.",
    scheduledDate: "Fri Feb 9, 2024",
    scheduledTime: "3:00 PM",
    duration: "60 mins",
    location: "Google Meet",
    requestedAt: "2024-02-01",
    status: "pending",
  },
];

export default function ApplicationsPage() {
  const [requests, setRequests] = useState<MentorshipRequest[]>(MOCK_REQUESTS);
  const [filter, setFilter] = useState<
    "all" | "pending" | "accepted" | "rejected"
  >("all");

  // Modal states
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null,
  );

  const filteredRequests = requests.filter((req) => {
    if (filter === "all") return true;
    return req.status === filter;
  });

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  const handleAccept = (id: string) => {
    setSelectedRequestId(id);
    setAcceptModalOpen(true);
  };

  const handleReject = (id: string) => {
    setSelectedRequestId(id);
    setDeclineModalOpen(true);
  };

  const confirmAccept = () => {
    if (selectedRequestId) {
      setRequests((prev) =>
        prev.map((req) =>
          req.id === selectedRequestId
            ? { ...req, status: "accepted" as const }
            : req,
        ),
      );
    }
  };

  const confirmDecline = () => {
    if (selectedRequestId) {
      setRequests((prev) =>
        prev.map((req) =>
          req.id === selectedRequestId
            ? { ...req, status: "rejected" as const }
            : req,
        ),
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <header className="border-b border-[#E1E4EA] bg-white px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-inter-tight text-xl font-semibold text-black">
              Mentorship Requests
            </h1>
            <p className="mt-1 font-inter-tight text-[13px] text-[#525866]">
              Review and respond to incoming mentorship requests
            </p>
          </div>
          {pendingCount > 0 && (
            <div className="flex items-center gap-2 rounded-full bg-[#FFF4E5] px-3 py-1.5">
              <Clock className="h-4 w-4 text-[#F59E0B]" />
              <span className="font-inter-tight text-[13px] font-medium text-[#F59E0B]">
                {pendingCount} pending
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="px-6 py-6">
        {/* Filter */}
        <div className="mb-5 flex items-center gap-4">
          <span className="font-inter-tight text-[13px] font-medium text-[#525866]">
            Filter:
          </span>
          <Select
            value={filter}
            onValueChange={(v: typeof filter) => setFilter(v)}
          >
            <SelectTrigger className="h-9 w-[150px] border-[#E1E4EA] bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Requests</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Request Cards */}
        <div className="flex flex-col gap-4">
          {filteredRequests.length === 0 ? (
            <div className="rounded-xl border border-[#E1E4EA] bg-white px-6 py-12 text-center">
              <p className="font-inter-tight text-[14px] text-[#525866]">
                No requests found
              </p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div
                key={request.id}
                className="overflow-hidden rounded-xl border border-[#E1E4EA] bg-white"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between border-b border-[#E1E4EA] px-6 py-4">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F3FF]">
                      <span className="font-inter-tight text-[16px] font-semibold text-[#5C30FF]">
                        {request.mentee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    {/* Info */}
                    <div>
                      <h3 className="font-inter-tight text-[15px] font-semibold text-black">
                        {request.mentee.name}
                      </h3>
                      <p className="font-inter-tight text-[13px] text-[#525866]">
                        {request.mentee.title} at {request.mentee.company}
                      </p>
                    </div>
                  </div>
                  {/* Status Badge */}
                  <div
                    className={`rounded-full px-3 py-1 font-inter-tight text-[12px] font-medium ${
                      request.status === "pending"
                        ? "bg-[#FFF4E5] text-[#F59E0B]"
                        : request.status === "accepted"
                          ? "bg-[#ECFDF3] text-[#10B981]"
                          : "bg-[#FEF2F2] text-[#EF4444]"
                    }`}
                  >
                    {request.status.charAt(0).toUpperCase() +
                      request.status.slice(1)}
                  </div>
                </div>

                {/* Card Body */}
                <div className="px-6 py-4">
                  {/* Message */}
                  <div className="mb-4">
                    <div className="mb-2 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-[#99A0AE]" />
                      <span className="font-inter-tight text-[12px] font-medium text-[#99A0AE]">
                        Message
                      </span>
                    </div>
                    <p className="font-inter-tight text-[14px] leading-relaxed text-[#525866]">
                      {request.message}
                    </p>
                  </div>

                  {/* Topic */}
                  <div className="mb-4">
                    <span className="mb-2 block font-inter-tight text-[12px] font-medium text-[#99A0AE]">
                      Topic
                    </span>
                    <span className="rounded-full bg-[#F5F3FF] px-3 py-1 font-inter-tight text-[12px] font-medium text-[#5C30FF]">
                      {request.topic}
                    </span>
                  </div>

                  {/* Session Details */}
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#99A0AE]" />
                      <span className="font-inter-tight text-[13px] text-[#525866]">
                        {request.scheduledDate}, {request.scheduledTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#99A0AE]" />
                      <span className="font-inter-tight text-[13px] text-[#525866]">
                        {request.duration}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#99A0AE]" />
                      <span className="font-inter-tight text-[13px] text-[#525866]">
                        {request.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                {request.status === "pending" && (
                  <div className="flex items-center justify-end gap-3 border-t border-[#E1E4EA] bg-[#FAFAFA] px-6 py-3">
                    <Button
                      variant="outline"
                      onClick={() => handleReject(request.id)}
                      className="flex items-center gap-2 rounded-[30px] border-[#E1E4EA] px-4 py-2 font-inter-tight text-[13px] font-normal text-[#525866] hover:border-[#EF4444] hover:bg-[#FEF2F2] hover:text-[#EF4444]"
                    >
                      <X className="h-4 w-4" />
                      Decline
                    </Button>
                    <Button
                      onClick={() => handleAccept(request.id)}
                      className="flex items-center gap-2 rounded-[30px] bg-[#5C30FF] px-4 py-2 font-inter-tight text-[13px] font-normal text-white hover:bg-[#4A26CC]"
                    >
                      <Check className="h-4 w-4" />
                      Accept
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
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
      />
    </div>
  );
}
