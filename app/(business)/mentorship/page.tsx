"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { MentorshipHeader } from "@/components/talent/mentorship/MentorshipHeader";
import { CategoryFilter } from "@/components/talent/mentorship/CategoryFilter";
import { MentorGrid } from "@/components/talent/mentorship/MentorGrid";
import {
  MenteeSessionCard,
  MenteeSessionStatus,
} from "@/components/talent/mentorship/MenteeSessionCard";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

// Mock mentor data - Replace with API call
const MOCK_MENTORS = [
  {
    id: "1",
    name: "Johnson Mark",
    title: "UI/UX Designer At Google",
    imageUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/ce48d9d62f90e73233f228176eca980a1f1d6319?width=524",
    pricePerSession: 150,
    sessionsCompleted: 200,
    expertise: ["Design"],
  },
  {
    id: "2",
    name: "Lee Sarah",
    title: "Frontend Developer At Amazon",
    imageUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/6a0463719f677585422c40bf7dae63b8ffcd7043?width=524",
    pricePerSession: 120,
    sessionsCompleted: 100,
    expertise: ["Design"],
  },
  {
    id: "3",
    name: "Brown David",
    title: "Data Scientist At Microsoft",
    imageUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/15e640f5aa424a17f0dfc70f71e49782a71b9b72?width=524",
    pricePerSession: 250,
    sessionsCompleted: 75,
    expertise: ["Strategy"],
  },
  {
    id: "4",
    name: "Garcia Maria",
    title: "Project Coordinator At IBM",
    imageUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/a7ab43958db79848941fce6ac204b45d4aabcaff?width=524",
    pricePerSession: 90,
    sessionsCompleted: 50,
    expertise: ["Collaboration"],
  },
  {
    id: "5",
    name: "Martinez Luis",
    title: "Software Engineer At Apple",
    imageUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/35370d00629a84bfe6c3677d1211a2ad94974c9f?width=524",
    pricePerSession: 180,
    sessionsCompleted: 120,
    expertise: ["Innovation"],
  },
  {
    id: "6",
    name: "Wilson Emily",
    title: "Marketing Specialist At Tesla",
    imageUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/d277db8837d52582f20327cc8cfc02e73417469b?width=524",
    pricePerSession: 110,
    sessionsCompleted: 160,
    expertise: ["Research"],
  },
  {
    id: "7",
    name: "Anderson James",
    title: "Content Strategist At LinkedIn",
    imageUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/0e0d85210d8a4edbb76c58ea4e5d6c0a30ae4e03?width=524",
    pricePerSession: 130,
    sessionsCompleted: 80,
    expertise: ["Strategy"],
  },
  {
    id: "8",
    name: "Thomas Rachel",
    title: "SEO Expert At Adobe",
    imageUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/c2719cc6b2a3af2ab644d78691c53e8251134c5a?width=524",
    pricePerSession: 140,
    sessionsCompleted: 90,
    expertise: ["Accessibility"],
  },
];

const CATEGORIES = [
  "Design",
  "Innovation",
  "Art",
  "Collaboration",
  "Strategy",
  "Creativity",
  "Research",
  "Accessibility",
  "Testing",
  "Implementation",
  "Wireframing",
];

// Mock mentee sessions data
interface MenteeSession {
  id: string;
  mentor: {
    id: string;
    name: string;
    avatar?: string;
    title?: string;
  };
  topic: string;
  message?: string;
  date: string;
  duration: string;
  location: string;
  status: MenteeSessionStatus;
}

const MOCK_MENTEE_SESSIONS: MenteeSession[] = [
  {
    id: "1",
    mentor: {
      id: "1",
      name: "Johnson Mark",
      avatar:
        "https://api.builder.io/api/v1/image/assets/TEMP/ce48d9d62f90e73233f228176eca980a1f1d6319?width=524",
      title: "UI/UX Designer At Google",
    },
    topic: "Data Analysis",
    message:
      "I want to learn more about data visualization and how to present insights effectively to stakeholders.",
    date: "Mon Feb 10, 2:00 PM",
    duration: "60 mins",
    location: "Google Meet",
    status: "pending",
  },
  {
    id: "2",
    mentor: {
      id: "2",
      name: "Lee Sarah",
      avatar:
        "https://api.builder.io/api/v1/image/assets/TEMP/6a0463719f677585422c40bf7dae63b8ffcd7043?width=524",
      title: "Frontend Developer At Amazon",
    },
    topic: "Frontend Development",
    message:
      "Looking to improve my React skills and learn about performance optimization.",
    date: "Wed Feb 12, 10:00 AM",
    duration: "45 mins",
    location: "Zoom",
    status: "upcoming",
  },
  {
    id: "3",
    mentor: {
      id: "3",
      name: "Brown David",
      avatar:
        "https://api.builder.io/api/v1/image/assets/TEMP/15e640f5aa424a17f0dfc70f71e49782a71b9b72?width=524",
      title: "Data Scientist At Microsoft",
    },
    topic: "Machine Learning",
    message:
      "Discussed career transition into data science and ML fundamentals.",
    date: "Fri Feb 7, 3:00 PM",
    duration: "30 mins",
    location: "Google Meet",
    status: "completed",
  },
  {
    id: "4",
    mentor: {
      id: "1",
      name: "Johnson Mark",
      avatar:
        "https://api.builder.io/api/v1/image/assets/TEMP/ce48d9d62f90e73233f228176eca980a1f1d6319?width=524",
      title: "UI/UX Designer At Google",
    },
    topic: "Engineering",
    message: "Session was cancelled due to scheduling conflict.",
    date: "Mon Feb 3, 11:00 AM",
    duration: "60 mins",
    location: "Google Meet",
    status: "cancelled",
  },
];

export default function MentorshipPage() {
  const [activeTab, setActiveTab] = useState<
    "Find Mentors" | "My Session" | "Messages"
  >("Find Mentors");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Design");
  const [sortBy, setSortBy] = useState("Newest");

  // Session states
  const [sessions, setSessions] =
    useState<MenteeSession[]>(MOCK_MENTEE_SESSIONS);
  const [sessionFilter, setSessionFilter] = useState<
    "all" | "pending" | "upcoming" | "completed" | "cancelled"
  >("all");
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  );

  // Filter mentors based on search and category
  const filteredMentors = useMemo(() => {
    let filtered = MOCK_MENTORS;

    // Filter by category
    if (activeCategory) {
      filtered = filtered.filter((mentor) =>
        mentor.expertise.includes(activeCategory),
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (mentor) =>
          mentor.name.toLowerCase().includes(query) ||
          mentor.title.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [searchQuery, activeCategory]);

  // Filter sessions
  const filteredSessions = useMemo(() => {
    let filtered = sessions;

    if (sessionFilter !== "all") {
      filtered = filtered.filter((session) => session.status === sessionFilter);
    }

    if (searchQuery && activeTab === "My Session") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (session) =>
          session.mentor.name.toLowerCase().includes(query) ||
          session.topic.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [sessions, sessionFilter, searchQuery, activeTab]);

  // Session counts
  const sessionCounts = {
    all: sessions.length,
    pending: sessions.filter((s) => s.status === "pending").length,
    upcoming: sessions.filter((s) => s.status === "upcoming").length,
    completed: sessions.filter((s) => s.status === "completed").length,
    cancelled: sessions.filter((s) => s.status === "cancelled").length,
  };

  const handleCancelSession = (id: string) => {
    setSelectedSessionId(id);
    setCancelModalOpen(true);
  };

  const confirmCancelSession = () => {
    if (selectedSessionId) {
      setSessions((prev) =>
        prev.map((session) =>
          session.id === selectedSessionId
            ? { ...session, status: "cancelled" as MenteeSessionStatus }
            : session,
        ),
      );
    }
  };

  const handleJoinSession = (id: string) => {
    // TODO: Implement join session logic (open meeting link)
    console.log("Joining session:", id);
  };

  const sessionTabs = [
    { id: "all" as const, label: "All", count: sessionCounts.all },
    { id: "pending" as const, label: "Pending", count: sessionCounts.pending },
    {
      id: "upcoming" as const,
      label: "Upcoming",
      count: sessionCounts.upcoming,
    },
    {
      id: "completed" as const,
      label: "Completed",
      count: sessionCounts.completed,
    },
    {
      id: "cancelled" as const,
      label: "Cancelled",
      count: sessionCounts.cancelled,
    },
  ];

  return (
    <div className="flex h-screen flex-col gap-3 md:gap-3 p-3 md:p-4 bg-white overflow-hidden">
      {/* Navigation Tabs */}
      <div className="flex flex-shrink-0 items-center gap-6 overflow-x-auto scrollbar-hide">
        {(["Find Mentors", "My Session", "Messages"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center justify-center gap-2 py-3 font-inter-tight text-[13px] font-medium leading-normal whitespace-nowrap ${
              activeTab === tab ? "text-black" : "text-black/30"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search and Filter Row */}
      <div className="flex flex-shrink-0 flex-col md:flex-row gap-2.5 md:gap-3">
        {/* Search Bar */}
        <div className="flex-1 flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-[#F5F5F5]">
          <Search className="w-4 h-4 text-[#B2B2B2]" strokeWidth={1.125} />
          <input
            type="text"
            placeholder="Search by name, role, company"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent font-inter-tight text-[13px] font-normal leading-normal text-black placeholder:text-black/30 outline-none capitalize"
          />
        </div>

        {/* Filter Button */}
        <button className="flex items-center justify-center gap-1 px-3.5 py-2 rounded-lg bg-[#F5F5F5] font-inter-tight text-[13px] font-normal leading-normal text-black h-[38px]">
          <SlidersHorizontal className="w-4 h-4" strokeWidth={1.125} />
          Filter
        </button>

        {/* Sort Dropdown */}
        <button className="flex items-center justify-center gap-1 px-3.5 py-2 rounded-lg bg-[#F5F5F5] font-inter-tight text-[13px] font-normal leading-normal text-black h-[38px]">
          {sortBy}
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Find Mentors Tab Content */}
      {activeTab === "Find Mentors" && (
        <>
          {/* Hero Banner */}
          <div className="flex-shrink-0">
            <MentorshipHeader />
          </div>

          {/* Find Your Mentor Section */}
          <div className="flex flex-col gap-5 overflow-hidden flex-1">
            <h2 className="flex-shrink-0 font-inter-tight text-[15px] font-medium leading-normal text-black">
              Find Your Mentor
            </h2>

            {/* Category Filter */}
            <div className="flex-shrink-0">
              <CategoryFilter
                categories={CATEGORIES}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>

            {/* Mentor Grid */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <MentorGrid mentors={filteredMentors} />
            </div>
          </div>
        </>
      )}

      {/* My Session Tab Content */}
      {activeTab === "My Session" && (
        <div className="flex flex-col gap-4 overflow-hidden flex-1">
          {/* Session Filter Tabs */}
          <div className="flex flex-shrink-0 items-center gap-1 overflow-x-auto rounded-lg border border-[#E1E4EA] bg-white p-1">
            {sessionTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSessionFilter(tab.id)}
                className={`flex items-center gap-2 rounded-md px-4 py-2 font-inter-tight text-[13px] font-medium transition-colors whitespace-nowrap ${
                  sessionFilter === tab.id
                    ? "bg-[#5C30FF] text-white"
                    : "text-[#525866] hover:bg-[#F5F3FF]"
                }`}
              >
                {tab.label}
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] ${
                    sessionFilter === tab.id
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
              <div className="rounded-xl border border-[#E1E4EA] bg-[#FAFAFA] px-6 py-12 text-center">
                <p className="font-inter-tight text-[14px] text-[#525866]">
                  No sessions found
                </p>
              </div>
            ) : (
              filteredSessions.map((session) => (
                <MenteeSessionCard
                  key={session.id}
                  {...session}
                  onCancel={handleCancelSession}
                  onJoin={handleJoinSession}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* Messages Tab Content */}
      {activeTab === "Messages" && (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <p className="font-inter-tight text-[14px] text-[#525866]">
              Messages coming soon
            </p>
          </div>
        </div>
      )}

      {/* Cancel Session Modal */}
      <ConfirmationModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={confirmCancelSession}
        title="Cancel Session"
        description="Are you sure you want to cancel this session? This action cannot be undone."
        confirmText="Yes, Cancel"
        type="danger"
      />
    </div>
  );
}
