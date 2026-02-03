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
    <div className="min-h-screen bg-white px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1149px]">
        {/* Header */}
        <h1 className="mb-[45px] font-inter-tight text-[25px] font-medium leading-5 text-black">
          Session Management
        </h1>

        {/* Search and Filters */}
        <div className="mb-[20px] flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-2.5">
          {/* Search Container */}
          <div className="flex flex-1 items-center gap-[7px] rounded-[10px] border border-[#E1E4EA] px-[15px] py-[9px]">
            <Search className="h-[18px] w-[18px] text-[#B2B2B2]" strokeWidth={1.125} />
            <input
              type="text"
              placeholder="Search Topic, Mentee"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 font-inter-tight text-[15px] font-normal capitalize text-black/30 outline-none placeholder:text-black/30"
            />
          </div>

          {/* Filter and Sort Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Filter Button */}
            <button className="flex items-center gap-1.5 rounded-[10px] bg-[#F5F5F5] px-[18px] py-[9px]">
              <SlidersHorizontal className="h-[18px] w-[18px]" strokeWidth={1.125} />
              <span className="font-inter-tight text-[15px] font-normal leading-normal text-black">
                Filter
              </span>
            </button>

            {/* Sort Dropdown */}
            <button className="flex items-center gap-1.5 rounded-[10px] bg-[#F5F5F5] px-[18px] py-[9px]">
              <span className="font-inter-tight text-[15px] font-normal leading-normal text-black">
                Newest
              </span>
              <ChevronDown className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-[41px] flex items-center gap-2.5 overflow-x-auto scrollbar-hidden">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-[15px] py-[15px] font-inter-tight text-[15px] font-medium leading-normal transition-colors ${
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
        <div className="flex flex-col gap-[25px]">
          {sessions.map((session) => (
            <SessionCard key={session.id} {...session} />
          ))}
        </div>
      </div>
    </div>
  );
}
