"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { SessionCard } from "@/components/mentor/sessions/SessionCard";

export default function MentorshipPage() {
  const [activeTab, setActiveTab] = useState("today");
  const [searchQuery, setSearchQuery] = useState("");

  // Sample session data - Replace with actual data from your API
  const sessions = [
    {
      id: "1",
      title: "Becoming The Top Of Your Game",
      description:
        "A Data Scientist at Microsoft, specializing in machine learning and data visualization. With over 8 years of experience.",
      date: "Thu Dec 1, 2:00 PM",
      duration: "50 mins",
      location: "Google Meet",
      mentees: [],
      totalMentees: 1,
    },
    {
      id: "2",
      title: "AI in Healthcare Innovation",
      description:
        "An expert in biomedical engineering discussing AI's role in revolutionizing patient care.",
      date: "Fri Dec 3, 3:30 PM",
      duration: "2 hrs",
      location: "Zoom",
      mentees: [
        {
          id: "1",
          name: "John Doe",
          avatar:
            "https://api.builder.io/api/v1/image/assets/TEMP/77a2d0f5eaf5e0f9f0f0c283d2661d2eaacaca2e?width=80",
        },
        {
          id: "2",
          name: "Jane Smith",
          avatar:
            "https://api.builder.io/api/v1/image/assets/TEMP/77a2d0f5eaf5e0f9f0f0c283d2661d2eaacaca2e?width=80",
        },
        {
          id: "3",
          name: "Mike Johnson",
          avatar:
            "https://api.builder.io/api/v1/image/assets/TEMP/77a2d0f5eaf5e0f9f0f0c283d2661d2eaacaca2e?width=80",
        },
        {
          id: "4",
          name: "Sarah Williams",
          avatar:
            "https://api.builder.io/api/v1/image/assets/TEMP/77a2d0f5eaf5e0f9f0f0c283d2661d2eaacaca2e?width=80",
        },
        {
          id: "5",
          name: "Tom Brown",
          avatar:
            "https://api.builder.io/api/v1/image/assets/TEMP/77a2d0f5eaf5e0f9f0f0c283d2661d2eaacaca2e?width=80",
        },
      ],
      totalMentees: 15,
    },
    {
      id: "3",
      title: "Future of Augmented Reality",
      description:
        "An AR specialist at Meta, exploring the next generation of immersive experiences in digital environments.",
      date: "Tue Dec 6, 4:45 PM",
      duration: "1 hr",
      location: "Discord",
      mentees: [
        {
          id: "1",
          name: "Alice Cooper",
          avatar:
            "https://api.builder.io/api/v1/image/assets/TEMP/77a2d0f5eaf5e0f9f0f0c283d2661d2eaacaca2e?width=80",
        },
        {
          id: "2",
          name: "Bob Dylan",
          avatar:
            "https://api.builder.io/api/v1/image/assets/TEMP/77a2d0f5eaf5e0f9f0f0c283d2661d2eaacaca2e?width=80",
        },
        {
          id: "3",
          name: "Charlie Parker",
          avatar:
            "https://api.builder.io/api/v1/image/assets/TEMP/77a2d0f5eaf5e0f9f0f0c283d2661d2eaacaca2e?width=80",
        },
        {
          id: "4",
          name: "Diana Ross",
          avatar:
            "https://api.builder.io/api/v1/image/assets/TEMP/77a2d0f5eaf5e0f9f0f0c283d2661d2eaacaca2e?width=80",
        },
        {
          id: "5",
          name: "Elvis Presley",
          avatar:
            "https://api.builder.io/api/v1/image/assets/TEMP/77a2d0f5eaf5e0f9f0f0c283d2661d2eaacaca2e?width=80",
        },
      ],
      totalMentees: 15,
    },
  ];

  const tabs = [
    { id: "today", label: "Today" },
    { id: "tomorrow", label: "Tomorrow" },
    { id: "next-week", label: "Next Week" },
    { id: "custom", label: "Custom" },
  ];

  return (
    <div className="h-screen overflow-hidden bg-white">
      <div className="flex h-full flex-col overflow-hidden px-4 py-6 md:px-8 md:py-7">
        {/* Header */}
        <h1 className="mb-8 flex-shrink-0 font-inter-tight text-[20px] font-medium leading-5 text-black">
          Session Management
        </h1>

        {/* Search and Filters */}
        <div className="mb-4 flex flex-shrink-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
          {/* Search Container */}
          <div className="flex flex-1 items-center gap-1.5 rounded-lg border border-[#E1E4EA] px-3 py-2">
            <Search className="h-4 w-4 text-[#B2B2B2]" strokeWidth={1.125} />
            <input
              type="text"
              placeholder="Search Topic, Mentee"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 font-inter-tight text-[13px] font-normal capitalize text-black/30 outline-none placeholder:text-black/30"
            />
          </div>

          {/* Filter and Sort Buttons */}
          <div className="flex items-center gap-2">
            {/* Filter Button */}
            <button className="flex items-center gap-1 rounded-lg bg-[#F5F5F5] px-3.5 py-2">
              <SlidersHorizontal className="h-4 w-4" strokeWidth={1.125} />
              <span className="font-inter-tight text-[13px] font-normal leading-normal text-black">
                Filter
              </span>
            </button>

            {/* Sort Dropdown */}
            <button className="flex items-center gap-1 rounded-lg bg-[#F5F5F5] px-3.5 py-2">
              <span className="font-inter-tight text-[13px] font-normal leading-normal text-black">
                Newest
              </span>
              <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex flex-shrink-0 items-center gap-2 overflow-x-auto scrollbar-hidden">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-3 py-3 font-inter-tight text-[13px] font-medium leading-normal transition-colors ${
                activeTab === tab.id
                  ? "text-black"
                  : "text-black/30 hover:text-black/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Session Cards */}
        <div className="flex flex-1 flex-col gap-5 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300">
          {sessions.map((session) => (
            <SessionCard key={session.id} {...session} />
          ))}
        </div>
      </div>
    </div>
  );
}
