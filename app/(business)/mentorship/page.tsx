"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { MentorshipHeader } from "@/components/talent/mentorship/MentorshipHeader";
import { CategoryFilter } from "@/components/talent/mentorship/CategoryFilter";
import { MentorGrid } from "@/components/talent/mentorship/MentorGrid";

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

export default function MentorshipPage() {
  const [activeTab, setActiveTab] = useState<
    "Find Mentors" | "My Session" | "Messages"
  >("Find Mentors");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Design");
  const [sortBy, setSortBy] = useState("Newest");

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

  return (
    <div className="flex flex-col gap-4 md:gap-[15px] p-4 md:p-6 bg-white min-h-screen">
      {/* Navigation Tabs */}
      <div className="flex items-center gap-[30px] overflow-x-auto scrollbar-hide">
        {(["Find Mentors", "My Session", "Messages"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center justify-center gap-2.5 py-[15px] font-inter-tight text-[15px] font-medium leading-normal whitespace-nowrap ${
              activeTab === tab ? "text-black" : "text-black/30"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search and Filter Row */}
      <div className="flex flex-col md:flex-row gap-3 md:gap-4">
        {/* Search Bar */}
        <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-[10px] bg-[#F5F5F5]">
          <Search className="w-[18px] h-[18px] text-[#B2B2B2]" strokeWidth={1.125} />
          <input
            type="text"
            placeholder="Search by name, role, company"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent font-inter-tight text-[15px] font-normal leading-normal text-black placeholder:text-black/30 outline-none capitalize"
          />
        </div>

        {/* Filter Button */}
        <button className="flex items-center justify-center gap-1.5 px-[18px] py-[9px] rounded-[10px] bg-[#F5F5F5] font-inter-tight text-[15px] font-normal leading-normal text-black h-[46.489px]">
          <SlidersHorizontal className="w-[18px] h-[18px]" strokeWidth={1.125} />
          Filter
        </button>

        {/* Sort Dropdown */}
        <button className="flex items-center justify-center gap-1.5 px-[18px] py-[9px] rounded-[10px] bg-[#F5F5F5] font-inter-tight text-[15px] font-normal leading-normal text-black h-[46.489px]">
          {sortBy}
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Hero Banner */}
      <MentorshipHeader />

      {/* Find Your Mentor Section */}
      <div className="flex flex-col gap-8">
        <h2 className="font-inter-tight text-lg font-medium leading-normal text-black">
          Find Your Mentor
        </h2>

        {/* Category Filter */}
        <CategoryFilter
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Mentor Grid */}
        <MentorGrid mentors={filteredMentors} />
      </div>
    </div>
  );
}
