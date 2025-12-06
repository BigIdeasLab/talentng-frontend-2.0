"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OpportunitiesHeader } from "./OpportunitiesHeader";
import { SearchAndFilters } from "./SearchAndFilters";
import { OpportunitiesTabs } from "./OpportunitiesTabs";
import { OpportunityCard } from "./OpportunityCard";

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

const mockOpenOpportunities: Opportunity[] = [
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

const mockClosedOpportunities: Opportunity[] = [
  {
    id: "c1",
    companyName: "Chowdeck",
    companyLogo:
      "https://api.builder.io/api/v1/image/assets/TEMP/9bf353c86041ee07f1b8f00fe2bfefc2c11557c6?width=80",
    date: "Dec 15",
    type: "job-listing",
    title: "UI/UX Designer",
    skills: [
      "User Research",
      "Wireframing",
      "Prototyping",
      "Usability Testing",
    ],
    rate: "$6000 / Year",
    applicantsCount: 1200,
  },
  {
    id: "c2",
    companyName: "Chowdeck",
    companyLogo:
      "https://api.builder.io/api/v1/image/assets/TEMP/9bf353c86041ee07f1b8f00fe2bfefc2c11557c6?width=80",
    date: "Nov 22",
    type: "job-listing",
    title: "Graphic Designer",
    skills: ["Brand Identity", "Typography", "Illustration", "Layout Design"],
    rate: "$400 / Month",
    applicantsCount: 245,
  },
  {
    id: "c3",
    companyName: "Chowdeck",
    companyLogo:
      "https://api.builder.io/api/v1/image/assets/TEMP/9bf353c86041ee07f1b8f00fe2bfefc2c11557c6?width=80",
    date: "Jan 10",
    type: "internship",
    title: "Web Developer",
    skills: ["Frontend Development", "Responsive Design", "SEO Optimization"],
    rate: "$2000 / Month",
    applicantsCount: 350,
  },
  {
    id: "c4",
    companyName: "Chowdeck",
    companyLogo:
      "https://api.builder.io/api/v1/image/assets/TEMP/9bf353c86041ee07f1b8f00fe2bfefc2c11557c6?width=80",
    date: "Feb 5",
    type: "job-listing",
    title: "Content Strategist",
    skills: [
      "Copywriting",
      "SEO Strategy",
      "Social Media",
      "Content Management",
    ],
    rate: "$4500 / Project",
    applicantsCount: 90,
  },
  {
    id: "c5",
    companyName: "Chowdeck",
    companyLogo:
      "https://api.builder.io/api/v1/image/assets/TEMP/9bf353c86041ee07f1b8f00fe2bfefc2c11557c6?width=80",
    date: "Mar 3",
    type: "job-listing",
    title: "Video Editor",
    skills: ["Video Production", "Motion Graphics", "Storyboarding", "Editing"],
    rate: "$300 / Month",
    applicantsCount: 150,
  },
];

const mockDraftOpportunities: Opportunity[] = [
  {
    id: "d1",
    companyName: "Chowdeck",
    companyLogo:
      "https://api.builder.io/api/v1/image/assets/TEMP/9bf353c86041ee07f1b8f00fe2bfefc2c11557c6?width=80",
    date: "Dec 15",
    type: "job-listing",
    title: "UI/UX Designer",
    skills: [
      "User Research",
      "Wireframing",
      "Prototyping",
      "Usability Testing",
    ],
    rate: "$6000 / Year",
    applicantsCount: 0,
  },
  {
    id: "d2",
    companyName: "Chowdeck",
    companyLogo:
      "https://api.builder.io/api/v1/image/assets/TEMP/9bf353c86041ee07f1b8f00fe2bfefc2c11557c6?width=80",
    date: "Nov 22",
    type: "job-listing",
    title: "Graphic Designer",
    skills: ["Brand Identity", "Typography", "Illustration", "Layout Design"],
    rate: "$400 / Month",
    applicantsCount: 0,
  },
];

export function EmployerOpportunities() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("open");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortType>("newest");

  const handlePostClick = () => {
    router.push("/opportunities/post");
  };

  const getOpportunitiesByTab = () => {
    switch (activeTab) {
      case "closed":
        return mockClosedOpportunities;
      case "draft":
        return mockDraftOpportunities;
      case "open":
      default:
        return mockOpenOpportunities;
    }
  };

  const filteredOpportunities = getOpportunitiesByTab().filter((opp) => {
    const matchesSearch =
      searchQuery === "" ||
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.skills.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    return matchesSearch;
  });

  return (
    <div className="h-screen overflow-y-auto overflow-x-hidden bg-white">
      <div className="w-full mx-auto px-3 py-5 md:px-5 md:py-6">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-6">
          <OpportunitiesHeader onPostClick={handlePostClick} />
          <SearchAndFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>

        {/* Tabs */}
        <OpportunitiesTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredOpportunities.map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              activeTab={activeTab}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredOpportunities.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-gray-500 text-xs mb-1.5">
              No opportunities found
            </p>
            <p className="text-gray-400 text-[11px]">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
