"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { EmployerProfilePanel } from "./EmployerProfilePanel";
import { EmployerProfileNav } from "./EmployerProfileNav";
import { Search, SlidersHorizontal, Check, MoreVertical } from "lucide-react";

interface EmployerProfileProps {
  companyData?: {
    name: string;
    logo?: string;
    location?: string;
    tagline?: string;
  };
  stats?: {
    jobsPosted?: number;
    talentsHired?: number;
    responseTime?: string;
  };
  socialLinks?: {
    telegram?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  completionPercentage?: number;
}

export function EmployerProfile({
  companyData = {
    name: "Company Name",
    location: "—",
    tagline: "Employer",
  },
  stats = {
    jobsPosted: 0,
    talentsHired: 0,
    responseTime: "—",
  },
  socialLinks,
  completionPercentage = 0,
}: EmployerProfileProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("opportunities");

  useEffect(() => {
    // Scroll to top when tab changes
    const mainContent = document.querySelector("main");
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
  }, [activeTab]);

  const handleCreateOpportunity = () => {
    console.log("Create Opportunity clicked");
  };

  return (
    <div className="flex flex-col h-full bg-white md:flex-row">
      {/* Profile Panel */}
      <div className="hidden lg:flex h-screen overflow-hidden">
        <EmployerProfilePanel
          company={companyData}
          stats={stats}
          socialLinks={socialLinks}
          completionPercentage={completionPercentage}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-white h-screen md:h-screen overflow-hidden">
        {/* Top Navigation */}
        <EmployerProfileNav
          activeTab={activeTab as any}
          onTabChange={setActiveTab}
          onCreateOpportunity={handleCreateOpportunity}
        />

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto scrollbar-styled">
          {/* Open Opportunities Tab */}
          {activeTab === "opportunities" && <OpportunitiesTab />}

          {/* Past Hires Tab */}
          {activeTab === "hires" && <PastHiresTab />}

          {/* About Tab */}
          {activeTab === "about" && <AboutTab />}
        </div>
      </main>
    </div>
  );
}

interface Opportunity {
  id: number;
  companyName: string;
  companyLogo: string;
  datePosted: string;
  type: "Job Listing" | "Internship";
  title: string;
  skills: string[];
  rate: string;
  applicantCount: number;
  applicantAvatars: string[];
}

const mockOpportunities: Opportunity[] = [
  {
    id: 1,
    companyName: "Chowdeck",
    companyLogo: "https://api.builder.io/api/v1/image/assets/TEMP/9bf353c86041ee07f1b8f00fe2bfefc2c11557c6",
    datePosted: "Nov 25",
    type: "Job Listing",
    title: "Product Designer",
    skills: ["E-commerce", "Market Research", "User Interface Design", "A/B Testing"],
    rate: "$350 / Month",
    applicantCount: 254,
    applicantAvatars: [
      "https://api.builder.io/api/v1/image/assets/TEMP/4489b61f18d60d40a2b95b65f27d3dc37af77141",
      "https://api.builder.io/api/v1/image/assets/TEMP/212208d7b867ab37dca0e63ad5b3246d2fad53a6",
      "https://api.builder.io/api/v1/image/assets/TEMP/98e3bf6d1fcfd7f32c737ff00aaa0c0e6b9c1c25",
    ],
  },
  {
    id: 2,
    companyName: "Chowdeck",
    companyLogo: "https://api.builder.io/api/v1/image/assets/TEMP/9bf353c86041ee07f1b8f00fe2bfefc2c11557c6",
    datePosted: "Nov 22",
    type: "Internship",
    title: "Graphic Designer",
    skills: ["Brand Identity", "Typography", "Illustration", "Layout Design"],
    rate: "$400 / Month",
    applicantCount: 254,
    applicantAvatars: [
      "https://api.builder.io/api/v1/image/assets/TEMP/4489b61f18d60d40a2b95b65f27d3dc37af77141",
      "https://api.builder.io/api/v1/image/assets/TEMP/212208d7b867ab37dca0e63ad5b3246d2fad53a6",
      "https://api.builder.io/api/v1/image/assets/TEMP/98e3bf6d1fcfd7f32c737ff00aaa0c0e6b9c1c25",
    ],
  },
  {
    id: 3,
    companyName: "Chowdeck",
    companyLogo: "https://api.builder.io/api/v1/image/assets/TEMP/9bf353c86041ee07f1b8f00fe2bfefc2c11557c6",
    datePosted: "Nov 20",
    type: "Job Listing",
    title: "UX/UI Designer",
    skills: ["Web Design", "User Testing", "Interaction Design", "Prototyping"],
    rate: "$300 / Month",
    applicantCount: 254,
    applicantAvatars: [
      "https://api.builder.io/api/v1/image/assets/TEMP/4489b61f18d60d40a2b95b65f27d3dc37af77141",
      "https://api.builder.io/api/v1/image/assets/TEMP/212208d7b867ab37dca0e63ad5b3246d2fad53a6",
      "https://api.builder.io/api/v1/image/assets/TEMP/98e3bf6d1fcfd7f32c737ff00aaa0c0e6b9c1c25",
    ],
  },
];

function OpportunitiesTab() {
  return (
    <div className="flex flex-col gap-2.5 p-4 md:p-6 w-full max-w-[560px]">
      {mockOpportunities.map((opportunity) => (
        <div key={opportunity.id} className="flex flex-col">
          {/* Job Card */}
          <div className="flex flex-col gap-6 p-3 md:p-6 rounded-t-[20px] border border-[#E1E4EA]">
            {/* Header */}
            <div className="flex flex-col gap-5">
              {/* Company Info and Type Badge */}
              <div className="flex justify-between items-start gap-2">
                {/* Company Profile */}
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                    <img
                      src={opportunity.companyLogo}
                      alt={opportunity.companyName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <div className="text-[15px] font-medium text-black font-inter-tight">
                      {opportunity.companyName}
                    </div>
                    <div className="text-[14px] font-light text-[#525866] font-inter-tight">
                      {opportunity.datePosted}
                    </div>
                  </div>
                </div>

                {/* Type Badge */}
                <div
                  className={`flex items-center gap-2 px-3 py-[15px] rounded-lg ${
                    opportunity.type === "Job Listing"
                      ? "bg-[rgba(92,48,255,0.10)]"
                      : "bg-[rgba(0,139,71,0.09)]"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      opportunity.type === "Job Listing"
                        ? "bg-[#5C30FF]"
                        : "bg-[#008B47]"
                    }`}
                  />
                  <span
                    className={`text-[13px] font-normal font-inter-tight whitespace-nowrap ${
                      opportunity.type === "Job Listing"
                        ? "text-[#5C30FF]"
                        : "text-[#008B47]"
                    }`}
                  >
                    {opportunity.type}
                  </span>
                </div>
              </div>

              {/* Job Title */}
              <h3 className="text-lg font-medium text-black font-inter-tight">
                {opportunity.title}
              </h3>

              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {opportunity.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="text-[14px] font-normal text-black font-inter-tight"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Rate and Actions */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-2.5 border-t border-[#E1E4EA]">
              <div className="text-lg font-medium text-black font-inter-tight">
                {opportunity.rate}
              </div>
              <div className="flex items-center gap-1.5">
                <button className="flex items-center gap-1 h-10 px-4 rounded-full bg-[#5C30FF] text-white hover:bg-[#4a26cc] transition-colors">
                  <Check className="w-[18px] h-[18px]" strokeWidth={1.5} />
                  <span className="text-[14px] font-medium font-inter-tight">
                    Mark As Filled
                  </span>
                </button>
                <button className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded transition-colors">
                  <MoreVertical className="w-6 h-6 text-black" />
                </button>
              </div>
            </div>
          </div>

          {/* Applicants Section */}
          <div className="flex items-center gap-2.5 px-3 py-4 rounded-b-[20px] border border-t-0 border-[#E1E4EA] bg-[#FFFBF0]">
            {/* Avatars */}
            <div className="flex -space-x-2">
              {opportunity.applicantAvatars.map((avatar, index) => (
                <div
                  key={index}
                  className="w-[30px] h-[30px] rounded-full overflow-hidden border-2 border-white bg-gray-100"
                >
                  <img
                    src={avatar}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            {/* Text */}
            <div className="text-[16px] font-medium font-inter-tight">
              <span className="text-black">{opportunity.applicantCount} talents already applied to this opportunity. </span>
              <button className="text-[#E39B00] underline hover:text-[#c58600] transition-colors">
                View
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface PastHire {
  id: number;
  name: string;
  avatar: string;
  primarySkill: string;
  location: string;
  dateHired: string;
}

const mockPastHires: PastHire[] = [
  {
    id: 1,
    name: "Elias Johnson",
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/4489b61f18d60d40a2b95b65f27d3dc37af77141",
    primarySkill: "Product Designer",
    location: "California, US",
    dateHired: "Dec 25 2025",
  },
  {
    id: 2,
    name: "Sophie Lee",
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/ac599d21a164f89cc53bcd2c3803d8c7e443bb16",
    primarySkill: "UX Designer",
    location: "New York, US",
    dateHired: "Jan 15 2024",
  },
  {
    id: 3,
    name: "Michael Brown",
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/212208d7b867ab37dca0e63ad5b3246d2fad53a6",
    primarySkill: "UI Designer",
    location: "Texas, US",
    dateHired: "Feb 10 2023",
  },
  {
    id: 4,
    name: "Emily Davis",
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/98e3bf6d1fcfd7f32c737ff00aaa0c0e6b9c1c25",
    primarySkill: "Graphic Designer",
    location: "Florida, US",
    dateHired: "Mar 5 2024",
  },
  {
    id: 5,
    name: "Daniel Garcia",
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/455fcd9600095c754eeaffb8827fd5e890ac94cf",
    primarySkill: "Interaction Designer",
    location: "Washington, US",
    dateHired: "Apr 20 2023",
  },
  {
    id: 6,
    name: "Olivia Martinez",
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/17e0f8649d5b2acbdf3b84f9659212f2c54c411f",
    primarySkill: "Visual Designer",
    location: "Oregon, US",
    dateHired: "May 30 2024",
  },
  {
    id: 7,
    name: "James Wilson",
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/e00a7d8c459efb178454a164267b6b5d418308a4",
    primarySkill: "Product Manager",
    location: "Illinois, US",
    dateHired: "Jun 15 2023",
  },
  {
    id: 8,
    name: "Ava Anderson",
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/1461b9e5fcd47d64b053df42baf38ee3fcbdae04",
    primarySkill: "Web Designer",
    location: "Nevada, US",
    dateHired: "Jul 10 2024",
  },
  {
    id: 9,
    name: "Lucas Thomas",
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/f25e66bac38da7360668fa7a0c3be5e28bf26714",
    primarySkill: "Motion Designer",
    location: "Colorado, US",
    dateHired: "Aug 25 2023",
  },
  {
    id: 10,
    name: "Mia Jackson",
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/52cd7411e700d6427cb4097ede0436c16b0e4b3a",
    primarySkill: "Industrial Designer",
    location: "Massachusetts, US",
    dateHired: "Sep 30 2024",
  },
  {
    id: 11,
    name: "Ethan White",
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/a227b791b8d836bd9c83846d5c563de1bf8e9070",
    primarySkill: "Service Designer",
    location: "Virginia, US",
    dateHired: "Oct 20 2023",
  },
  {
    id: 12,
    name: "Isabella Harris",
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/77a2d0f5eaf5e0f9f0f0c283d2661d2eaacaca2e",
    primarySkill: "Game Designer",
    location: "Georgia, US",
    dateHired: "Nov 14 2024",
  },
];

function PastHiresTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredHires, setFilteredHires] = useState(mockPastHires);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredHires(mockPastHires);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = mockPastHires.filter(
        (hire) =>
          hire.name.toLowerCase().includes(query) ||
          hire.primarySkill.toLowerCase().includes(query) ||
          hire.location.toLowerCase().includes(query)
      );
      setFilteredHires(filtered);
    }
  }, [searchQuery]);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-[25px] w-full max-w-[795px]">
      {/* Title */}
      <h1 className="text-lg font-medium text-black font-inter-tight leading-5">
        Past Hires
      </h1>

      {/* Search and Filter Container */}
      <div className="flex flex-col gap-3.5">
        {/* Search and Filters */}
        <div className="flex items-center gap-2.5 w-full">
          {/* Search Container */}
          <div className="flex-1 min-w-0 h-[46px] px-3 flex items-center gap-[7px] rounded-[10px] border border-[#E1E4EA]">
            <Search className="w-[18px] h-[18px] text-[#B2B2B2] flex-shrink-0" />
            <input
              type="text"
              placeholder="Search Talent, Role"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-0 text-[15px] font-normal font-inter-tight placeholder:text-[rgba(0,0,0,0.30)] placeholder:capitalize border-0 focus:outline-none bg-transparent"
            />
          </div>

          {/* Filter Button */}
          <button className="h-[46px] px-3 flex items-center gap-1.5 rounded-[10px] flex-shrink-0 hover:bg-gray-50 transition-colors">
            <SlidersHorizontal className="w-[18px] h-[18px] text-black" />
            <span className="text-[15px] font-normal text-black font-inter-tight hidden sm:inline">
              Filter
            </span>
          </button>
        </div>

        {/* Talent List Table */}
        <div className="w-full rounded-[20px] border border-[#E1E4EA] overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid md:grid-cols-[40px_1fr_180px_150px_130px] gap-4 px-4.5 py-5 border-b border-[#E1E4EA]">
            <div className="text-[15px] font-medium text-[#525866] font-inter-tight text-center">
              S/N
            </div>
            <div className="text-[15px] font-medium text-[#525866] font-inter-tight">
              Talents
            </div>
            <div className="text-[15px] font-medium text-[#525866] font-inter-tight">
              Primary Skill
            </div>
            <div className="text-[15px] font-medium text-[#525866] font-inter-tight">
              Location
            </div>
            <div className="text-[15px] font-medium text-[#525866] font-inter-tight">
              Date Hired
            </div>
          </div>

          {/* Table Body */}
          <div className="flex flex-col divide-y divide-[#E1E4EA]/30">
            {filteredHires.length > 0 ? (
              filteredHires.map((hire, index) => (
                <div
                  key={hire.id}
                  className="grid grid-cols-1 md:grid-cols-[40px_1fr_180px_150px_130px] gap-2 md:gap-4 px-4.5 py-4 md:py-5 hover:bg-gray-50/50 transition-colors"
                >
                  {/* Serial Number - Hidden on mobile, shown on desktop */}
                  <div className="hidden md:flex items-center justify-center text-[15px] font-normal text-black font-inter-tight">
                    {index + 1}.
                  </div>

                  {/* Profile - Full width on mobile, normal on desktop */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                      <img
                        src={hire.avatar}
                        alt={hire.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <div className="text-[15px] font-normal text-black font-inter-tight truncate">
                        {hire.name}
                      </div>
                      {/* Show skill on mobile under name */}
                      <div className="md:hidden text-[13px] font-light text-[#525866] font-inter-tight truncate">
                        {hire.primarySkill}
                      </div>
                    </div>
                  </div>

                  {/* Primary Skill - Hidden on mobile, shown on desktop */}
                  <div className="hidden md:flex items-center text-[15px] font-normal text-black font-inter-tight">
                    {hire.primarySkill}
                  </div>

                  {/* Location - Shown as row on mobile */}
                  <div className="flex md:items-center">
                    <span className="md:hidden text-[13px] font-medium text-[#525866] mr-2">
                      Location:
                    </span>
                    <span className="text-[15px] font-normal text-black font-inter-tight">
                      {hire.location}
                    </span>
                  </div>

                  {/* Date Hired - Shown as row on mobile */}
                  <div className="flex md:items-center">
                    <span className="md:hidden text-[13px] font-medium text-[#525866] mr-2">
                      Hired:
                    </span>
                    <span className="text-[15px] font-normal text-black font-inter-tight">
                      {hire.dateHired}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <p className="text-[15px] text-[rgba(0,0,0,0.30)] font-inter-tight">
                  No talents found matching your search
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AboutTab() {
  return (
    <div className="flex flex-col gap-10 p-4 md:p-6 lg:p-[25px] w-full max-w-[667px]">
      {/* About Section */}
      <div className="flex flex-col gap-5">
        <h2 className="text-2xl font-semibold text-black font-inter-tight">
          About Chowdeck Nigeria
        </h2>
        <div className="flex flex-col gap-4 text-[15px] font-normal text-black font-inter-tight leading-[26px]">
          <p>
            Chowdeck is Nigeria's premier on-demand delivery service, connecting
            customers with a wide array of restaurants and stores. Since our
            founding in 2021, we've been dedicated to providing fast, reliable,
            and convenient delivery solutions across Lagos, Abuja, and Port
            Harcourt.
          </p>
          <p>
            We partner with over 500 restaurants and retailers, offering
            everything from local cuisine to everyday essentials. Our mission is
            to simplify life for our customers, empower local businesses, and
            create job opportunities for riders. Whether you're craving a meal or
            need groceries delivered, Chowdeck is here to serve you.
          </p>
          <p>
            At Chowdeck, we are committed to innovation, customer satisfaction,
            and community development. Join us as we continue to revolutionize
            the delivery landscape in Nigeria.
          </p>
        </div>
      </div>

      {/* Company Details Section */}
      <div className="flex flex-col gap-5">
        <h2 className="text-2xl font-semibold text-black font-inter-tight">
          Company Details
        </h2>
        <div className="flex flex-col gap-2.5">
          {/* Industry */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 px-4 py-3 rounded-[10px] border border-[#E1E4EA]">
            <div className="text-base font-normal text-black font-inter-tight leading-[26px]">
              Industry
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[15px] font-normal text-black font-inter-tight leading-[26px]">
                Logistics & Delivery
              </span>
              <span className="text-[15px] font-normal text-black font-inter-tight leading-[26px]">
                SaaS
              </span>
              <span className="text-[15px] font-normal text-black font-inter-tight leading-[26px]">
                Food
              </span>
            </div>
          </div>

          {/* Company Size */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 px-4 py-3 rounded-[10px] border border-[#E1E4EA]">
            <div className="text-base font-normal text-black font-inter-tight leading-[26px]">
              Company Size
            </div>
            <div className="text-[15px] font-normal text-black font-inter-tight leading-[26px]">
              1 - 10
            </div>
          </div>

          {/* Company Stage */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 px-4 py-3 rounded-[10px] border border-[#E1E4EA]">
            <div className="text-base font-normal text-black font-inter-tight leading-[26px]">
              Company Stage
            </div>
            <div className="text-[15px] font-normal text-black font-inter-tight leading-[26px]">
              Early Startup
            </div>
          </div>

          {/* Operating Model */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 px-4 py-3 rounded-[10px] border border-[#E1E4EA]">
            <div className="text-base font-normal text-black font-inter-tight leading-[26px]">
              Operating Model
            </div>
            <div className="text-[15px] font-normal text-black font-inter-tight leading-[26px]">
              Remote
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
