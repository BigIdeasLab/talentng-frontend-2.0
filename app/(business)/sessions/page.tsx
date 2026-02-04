"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { SessionCard, SessionStatus } from "@/components/mentor/sessions/SessionCard";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { RescheduleModal } from "@/components/ui/reschedule-modal";

interface Mentee {
  id: string;
  name: string;
  avatar?: string;
  title?: string;
  company?: string;
}

interface Session {
  id: string;
  mentee: Mentee;
  topic: string;
  message?: string;
  date: string;
  duration: string;
  location: string;
  status: SessionStatus;
}

const INITIAL_SESSIONS: Session[] = [
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
      "I'm looking for guidance on transitioning from frontend to fullstack development. I've been working with React for 2 years and want to learn Node.js.",
    date: "Thu Dec 1, 2:00 PM",
    duration: "60 mins",
    location: "Google Meet",
    status: "upcoming",
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
      "I want to improve my design-to-development handoff skills and learn more about design systems.",
    date: "Fri Dec 3, 3:30 PM",
    duration: "60 mins",
    location: "Zoom",
    status: "upcoming",
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
    date: "Mon Nov 28, 4:45 PM",
    duration: "60 mins",
    location: "Google Meet",
    status: "completed",
  },
  {
    id: "4",
    mentee: {
      id: "m4",
      name: "Emeka Nwosu",
      title: "Data Analyst",
      company: "Paystack",
    },
    topic: "Career Growth",
    message:
      "Looking for advice on transitioning from data analytics to data science.",
    date: "Wed Nov 23, 10:00 AM",
    duration: "60 mins",
    location: "Google Meet",
    status: "cancelled",
  },
];

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed" | "cancelled" | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  const filteredSessions = sessions.filter((session) => {
    const matchesTab = activeTab === "all" || session.status === activeTab;
    const matchesSearch =
      session.mentee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (session.message?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    return matchesTab && matchesSearch;
  });

  const counts = {
    all: sessions.length,
    upcoming: sessions.filter((s) => s.status === "upcoming").length,
    completed: sessions.filter((s) => s.status === "completed").length,
    cancelled: sessions.filter((s) => s.status === "cancelled").length,
  };

  const handleReschedule = (id: string) => {
    setSelectedSessionId(id);
    setRescheduleModalOpen(true);
  };

  const handleCancel = (id: string) => {
    setSelectedSessionId(id);
    setCancelModalOpen(true);
  };

  const handleComplete = (id: string) => {
    setSelectedSessionId(id);
    setCompleteModalOpen(true);
  };

  const confirmComplete = () => {
    if (selectedSessionId) {
      setSessions((prev) =>
        prev.map((session) =>
          session.id === selectedSessionId
            ? { ...session, status: "completed" as SessionStatus }
            : session
        )
      );
    }
  };

  const confirmCancel = () => {
    if (selectedSessionId) {
      setSessions((prev) =>
        prev.map((session) =>
          session.id === selectedSessionId
            ? { ...session, status: "cancelled" as SessionStatus }
            : session
        )
      );
    }
  };

  const confirmReschedule = (date: string, time: string) => {
    if (selectedSessionId) {
      const formattedDate = new Date(date).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      setSessions((prev) =>
        prev.map((session) =>
          session.id === selectedSessionId
            ? { ...session, date: `${formattedDate}, ${time}` }
            : session
        )
      );
    }
  };

  const tabs = [
    { id: "all" as const, label: "All Sessions", count: counts.all },
    { id: "upcoming" as const, label: "Upcoming", count: counts.upcoming },
    { id: "completed" as const, label: "Completed", count: counts.completed },
    { id: "cancelled" as const, label: "Cancelled", count: counts.cancelled },
  ];

  return (
    <div className="h-screen overflow-hidden bg-[#FAFAFA]">
      <div className="flex h-full flex-col overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 border-b border-[#E1E4EA] bg-white px-6 py-5">
          <h1 className="font-inter-tight text-xl font-semibold text-black">
            Sessions
          </h1>
          <p className="mt-1 font-inter-tight text-[13px] text-[#525866]">
            Manage your mentorship sessions
          </p>
        </header>

        <div className="flex flex-1 flex-col overflow-hidden px-6 py-6">
          {/* Search and Filters */}
          <div className="mb-4 flex flex-shrink-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
            {/* Search Container */}
            <div className="flex flex-1 items-center gap-1.5 rounded-lg border border-[#E1E4EA] bg-white px-3 py-2">
              <Search className="h-4 w-4 text-[#B2B2B2]" strokeWidth={1.125} />
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent font-inter-tight text-[13px] font-normal text-black outline-none placeholder:text-black/30"
              />
            </div>

            {/* Filter and Sort Buttons */}
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 rounded-lg border border-[#E1E4EA] bg-white px-3.5 py-2">
                <SlidersHorizontal className="h-4 w-4" strokeWidth={1.125} />
                <span className="font-inter-tight text-[13px] font-normal leading-normal text-black">
                  Filter
                </span>
              </button>

              <button className="flex items-center gap-1 rounded-lg border border-[#E1E4EA] bg-white px-3.5 py-2">
                <span className="font-inter-tight text-[13px] font-normal leading-normal text-black">
                  Newest
                </span>
                <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6 flex flex-shrink-0 items-center gap-1 overflow-x-auto rounded-lg border border-[#E1E4EA] bg-white p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-md px-4 py-2 font-inter-tight text-[13px] font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-[#5C30FF] text-white"
                    : "text-[#525866] hover:bg-[#F5F3FF]"
                }`}
              >
                {tab.label}
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] ${
                    activeTab === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-[#F5F5F5] text-[#525866]"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Session Cards */}
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
            {filteredSessions.length === 0 ? (
              <div className="rounded-xl border border-[#E1E4EA] bg-white px-6 py-12 text-center">
                <p className="font-inter-tight text-[14px] text-[#525866]">
                  No sessions found
                </p>
              </div>
            ) : (
              filteredSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  {...session}
                  onReschedule={handleReschedule}
                  onCancel={handleCancel}
                  onComplete={handleComplete}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Complete Confirmation Modal */}
      <ConfirmationModal
        isOpen={completeModalOpen}
        onClose={() => setCompleteModalOpen(false)}
        onConfirm={confirmComplete}
        title="Complete Session"
        description="Are you sure you want to mark this session as completed?"
        confirmText="Yes, Complete"
        type="success"
      />

      {/* Cancel Confirmation Modal */}
      <ConfirmationModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={confirmCancel}
        title="Cancel Session"
        description="Are you sure you want to cancel this session? This action cannot be undone."
        confirmText="Yes, Cancel"
        type="danger"
      />

      {/* Reschedule Modal */}
      <RescheduleModal
        isOpen={rescheduleModalOpen}
        onClose={() => setRescheduleModalOpen(false)}
        onConfirm={confirmReschedule}
      />
    </div>
  );
}
