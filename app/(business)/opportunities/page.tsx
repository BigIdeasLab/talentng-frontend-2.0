"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProfile } from "@/hooks/useProfile";
import Link from "next/link";

type TabType = "open" | "closed" | "draft";
type SortType = "newest" | "oldest" | "rate-high" | "rate-low";

interface Opportunity {
  id: string;
  companyName: string;
  companyLogo: string;
  date: string;
  type: "job-listing" | "internship";
  title: string;
  skills: string[];
  rate: string;
  applicantsCount: number;
}

const mockOpportunities: Opportunity[] = [
  {
    id: "1",
    companyName: "Chowdeck",
    companyLogo:
      "https://api.builder.io/api/v1/image/assets/TEMP/9bf353c86041ee07f1b8f00fe2bfefc2c11557c6?width=80",
    date: "Nov 20",
    type: "job-listing",
    title: "UX/UI Designer",
    skills: ["Web Design", "User Testing", "Interaction Design", "Prototyping"],
    rate: "$300 / Month",
    applicantsCount: 254,
  },
  {
    id: "2",
    companyName: "Chowdeck",
    companyLogo:
      "https://api.builder.io/api/v1/image/assets/TEMP/9bf353c86041ee07f1b8f00fe2bfefc2c11557c6?width=80",
    date: "Nov 22",
    type: "internship",
    title: "Graphic Designer",
    skills: ["Brand Identity", "Typography", "Illustration", "Layout Design"],
    rate: "$400 / Month",
    applicantsCount: 254,
  },
  {
    id: "3",
    companyName: "Chowdeck",
    companyLogo:
      "https://api.builder.io/api/v1/image/assets/TEMP/9bf353c86041ee07f1b8f00fe2bfefc2c11557c6?width=80",
    date: "Nov 25",
    type: "job-listing",
    title: "Product Designer",
    skills: [
      "E-commerce",
      "Market Research",
      "User Interface Design",
      "A/B Testing",
    ],
    rate: "$350 / Month",
    applicantsCount: 254,
  },
];

export default function OpportunitiesPage() {
  const { activeRole, isLoading } = useProfile();
  const [activeTab, setActiveTab] = useState<TabType>("open");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortType>("newest");

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (activeRole !== "recruiter") {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            This page is only available for recruiters/employers.
          </p>
          <Link href="/dashboard" className="text-brand-primary hover:underline">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const filteredOpportunities = mockOpportunities.filter((opp) => {
    const matchesSearch =
      searchQuery === "" ||
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.skills.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    return matchesSearch;
  });

  const renderOpportunityActions = (opportunity: Opportunity) => {
    if (activeTab === "closed") {
      return (
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3">
            <div className="w-[30px] h-[30px] rounded-full bg-gray-300 border-2 border-white" />
            <div className="w-[30px] h-[30px] rounded-full bg-gray-400 border-2 border-white" />
            <div className="w-[30px] h-[30px] rounded-full bg-gray-500 border-2 border-white" />
          </div>
          <div className="text-[18px] font-medium font-inter-tight text-black">
            {opportunity.applicantsCount} Talent Applied
          </div>
        </div>
      );
    }

    if (activeTab === "draft") {
      return (
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 h-10 px-4 bg-[#181B25] text-white rounded-full hover:bg-[#2a2d35] transition-colors">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.4106 4.48679L12.4619 3.43547C13.0425 2.85484 13.9839 2.85484 14.5645 3.43547C15.1451 4.0161 15.1451 4.95748 14.5645 5.53811L13.5132 6.58943M11.4106 4.48679L5.23517 10.6622C4.4512 11.4462 4.05919 11.8381 3.79228 12.3158C3.52535 12.7935 3.2568 13.9214 3 15C4.07857 14.7432 5.20649 14.4746 5.68417 14.2077C6.16184 13.9408 6.55383 13.5488 7.33781 12.7648L13.5132 6.58943M11.4106 4.48679L13.5132 6.58943"
                stroke="white"
                strokeWidth="1.125"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.25 15H12.75"
                stroke="white"
                strokeWidth="1.125"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-[14px] font-medium font-inter-tight">
              Edit
            </span>
          </button>

          <button className="flex items-center gap-1 h-10 px-4 bg-[#5C30FF] text-white rounded-full border border-[#5C30FF] hover:bg-[#4a26cc] transition-colors">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.75 10.5L6.375 13.125L14.25 4.875"
                stroke="white"
                strokeWidth="1.125"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[14px] font-medium font-inter-tight">
              Post
            </span>
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1 h-10 px-4 bg-[#5C30FF] text-white rounded-full border border-[#5C30FF] hover:bg-[#4a26cc] transition-colors">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.75 10.5L6.375 13.125L14.25 4.875"
              stroke="white"
              strokeWidth="1.125"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[14px] font-medium font-inter-tight">
            Mark As Filled
          </span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.992 12H11.9995"
                  stroke="black"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.9842 18H11.9917"
                  stroke="black"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.9998 6H12.0073"
                  stroke="black"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>View Applications</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };

  return (
    <div className="h-screen overflow-y-auto bg-white">
      <div className="max-w-[1149px] mx-auto px-4 py-6 md:px-6 md:py-8">
        {/* Header */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-medium font-inter-tight text-black">
              Opportunities
            </h1>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-[#181B25] text-white rounded-[30px] border border-[#181B25] hover:bg-[#2a2d35] transition-colors">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 3.3335V16.6668M16.6667 10.0002H3.33337"
                  stroke="white"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[15px] font-normal font-inter-tight">
                Post A Opportunity
              </span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="flex-1 relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.75 12.75L15.75 15.75"
                  stroke="#B2B2B2"
                  strokeWidth="1.125"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25Z"
                  stroke="#B2B2B2"
                  strokeWidth="1.125"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <Input
                type="text"
                placeholder="Search role, Level or jobs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-[46px] rounded-[10px] border-[#E1E4EA] font-inter-tight text-[15px] placeholder:text-black/30 placeholder:capitalize"
              />
            </div>

            <button className="flex items-center gap-2 px-4 h-[46px] hover:bg-gray-50 rounded-[10px] transition-colors">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.25 5.25H4.5"
                  stroke="black"
                  strokeWidth="1.125"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.25 12.75H6.75"
                  stroke="black"
                  strokeWidth="1.125"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.5 12.75H15.75"
                  stroke="black"
                  strokeWidth="1.125"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.25 5.25H15.75"
                  stroke="black"
                  strokeWidth="1.125"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4.5 5.25C4.5 4.55109 4.5 4.20164 4.61418 3.92597C4.76642 3.55844 5.05844 3.26642 5.42597 3.11418C5.70164 3 6.05109 3 6.75 3C7.44891 3 7.79835 3 8.07405 3.11418C8.44155 3.26642 8.7336 3.55844 8.88585 3.92597C9 4.20164 9 4.55109 9 5.25C9 5.94891 9 6.29837 8.88585 6.57403C8.7336 6.94157 8.44155 7.23358 8.07405 7.38582C7.79835 7.5 7.44891 7.5 6.75 7.5C6.05109 7.5 5.70164 7.5 5.42597 7.38582C5.05844 7.23358 4.76642 6.94157 4.61418 6.57403C4.5 6.29837 4.5 5.94891 4.5 5.25Z"
                  stroke="black"
                  strokeWidth="1.125"
                />
                <path
                  d="M9 12.75C9 12.0511 9 11.7017 9.11415 11.426C9.2664 11.0585 9.55845 10.7664 9.92595 10.6141C10.2017 10.5 10.5511 10.5 11.25 10.5C11.9489 10.5 12.2983 10.5 12.574 10.6141C12.9415 10.7664 13.2336 11.0585 13.3858 11.426C13.5 11.7017 13.5 12.0511 13.5 12.75C13.5 13.4489 13.5 13.7983 13.3858 14.074C13.2336 14.4415 12.9415 14.7336 12.574 14.8858C12.2983 15 11.9489 15 11.25 15C10.5511 15 10.2017 15 9.92595 14.8858C9.55845 14.7336 9.2664 14.4415 9.11415 14.074C9 13.7983 9 13.4489 9 12.75Z"
                  stroke="black"
                  strokeWidth="1.125"
                />
              </svg>
              <span className="text-[15px] font-normal font-inter-tight text-black">
                Filter
              </span>
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-4 h-[46px] hover:bg-gray-50 rounded-[10px] transition-colors">
                  <span className="text-[15px] font-normal font-inter-tight text-black">
                    {sortBy === "newest"
                      ? "Newest"
                      : sortBy === "oldest"
                        ? "Oldest"
                        : sortBy === "rate-high"
                          ? "Rate: High to Low"
                          : "Rate: Low to High"}
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.2826 6.2209C11.3525 6.29058 11.4079 6.37338 11.4458 6.46454C11.4837 6.5557 11.5031 6.65344 11.5031 6.75215C11.5031 6.85086 11.4837 6.9486 11.4458 7.03977C11.4079 7.13093 11.3525 7.21373 11.2826 7.2834L8.28255 10.2834C8.21287 10.3533 8.13008 10.4088 8.03892 10.4467C7.94775 10.4845 7.85001 10.504 7.7513 10.504C7.65259 10.504 7.55485 10.4845 7.46369 10.4467C7.37252 10.4088 7.28973 10.3533 7.22005 10.2834L4.22005 7.2834C4.07915 7.14251 4 6.95141 4 6.75215C4 6.5529 4.07915 6.3618 4.22005 6.2209C4.36095 6.08001 4.55204 6.00085 4.7513 6.00085C4.95056 6.00085 5.14165 6.08001 5.28255 6.2209L7.75193 8.68903L10.2213 6.21903C10.2911 6.14942 10.3739 6.09425 10.465 6.05666C10.5561 6.01908 10.6538 5.99983 10.7523 6C10.8509 6.00018 10.9484 6.01977 11.0394 6.05768C11.1304 6.09558 11.213 6.15105 11.2826 6.2209Z"
                      fill="black"
                    />
                  </svg>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy("newest")}>
                  Newest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                  Oldest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("rate-high")}>
                  Rate: High to Low
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("rate-low")}>
                  Rate: Low to High
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-transparent mb-8 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab("open")}
            className={`pb-3 text-[15px] font-medium font-inter-tight whitespace-nowrap transition-colors ${
              activeTab === "open"
                ? "text-black border-b-2 border-black"
                : "text-black/30"
            }`}
          >
            Open Opportunities
          </button>
          <button
            onClick={() => setActiveTab("closed")}
            className={`pb-3 text-[15px] font-medium font-inter-tight whitespace-nowrap transition-colors ${
              activeTab === "closed"
                ? "text-black border-b-2 border-black"
                : "text-black/30"
            }`}
          >
            Closed Opportunities
          </button>
          <button
            onClick={() => setActiveTab("draft")}
            className={`pb-3 text-[15px] font-medium font-inter-tight whitespace-nowrap transition-colors ${
              activeTab === "draft"
                ? "text-black border-b-2 border-black"
                : "text-black/30"
            }`}
          >
            Draft
          </button>
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOpportunities.map((opportunity) => (
            <div key={opportunity.id} className="flex flex-col">
              {/* Opportunity Card */}
              <div className="flex flex-col gap-6 p-6 border border-[#E1E4EA] rounded-t-[20px]">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={opportunity.companyLogo}
                      alt={opportunity.companyName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col gap-1">
                      <div className="text-[15px] font-medium font-inter-tight text-black">
                        {opportunity.companyName}
                      </div>
                      <div className="text-[14px] font-light font-inter-tight text-[#525866]">
                        {opportunity.date}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                      opportunity.type === "job-listing"
                        ? "bg-[#5C30FF]/10"
                        : "bg-[#008B47]/9"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        opportunity.type === "job-listing"
                          ? "bg-[#5C30FF]"
                          : "bg-[#008B47]"
                      }`}
                    />
                    <span
                      className={`text-[13px] font-normal font-inter-tight ${
                        opportunity.type === "job-listing"
                          ? "text-[#5C30FF]"
                          : "text-[#008B47]"
                      }`}
                    >
                      {opportunity.type === "job-listing"
                        ? "Job Listing"
                        : "Internship"}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-[18px] font-medium font-inter-tight text-black">
                  {opportunity.title}
                </h3>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {opportunity.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="text-[14px] font-normal font-inter-tight text-black"
                    >
                      {skill}
                      {index < opportunity.skills.length - 1 && (
                        <span className="ml-2 text-gray-300">•</span>
                      )}
                    </span>
                  ))}
                </div>

                {/* Rate and Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-[#E1E4EA]">
                  <div className="text-[18px] font-medium font-inter-tight text-black">
                    {opportunity.rate}
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 h-10 px-4 bg-[#5C30FF] text-white rounded-full border border-[#5C30FF] hover:bg-[#4a26cc] transition-colors">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.75 10.5L6.375 13.125L14.25 4.875"
                          stroke="white"
                          strokeWidth="1.125"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-[14px] font-medium font-inter-tight">
                        Mark As Filled
                      </span>
                    </button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11.992 12H11.9995"
                              stroke="black"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M11.9842 18H11.9917"
                              stroke="black"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M11.9998 6H12.0073"
                              stroke="black"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View Applications</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              {/* Applicants Section */}
              <div className="flex items-center gap-3 p-4 border border-t-0 border-[#E1E4EA] rounded-b-[20px]">
                <div className="flex -space-x-3">
                  <div className="w-[30px] h-[30px] rounded-full bg-gray-300 border-2 border-white" />
                  <div className="w-[30px] h-[30px] rounded-full bg-gray-400 border-2 border-white" />
                  <div className="w-[30px] h-[30px] rounded-full bg-gray-500 border-2 border-white" />
                </div>
                <p className="text-[16px] font-medium font-inter-tight">
                  <span className="text-black">
                    {opportunity.applicantsCount} talents already applied to
                    this opportunity.{" "}
                  </span>
                  <button className="text-[#E39B00] underline hover:no-underline">
                    View
                  </button>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredOpportunities.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-gray-500 text-lg mb-2">No opportunities found</p>
            <p className="text-gray-400 text-sm">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
