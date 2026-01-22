"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Applicant {
  id: number;
  name: string;
  role: string;
  avatar: string;
  hires: string;
  opportunity: {
    title: string;
    type: string;
  };
  location: string;
  dateApplied: string;
  status: "In Review" | "Pending" | "Rejected" | "Hired";
}

const mockApplicants: Applicant[] = [
  {
    id: 1,
    name: "Elias Johnson",
    role: "Product Designer",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/77a2d0f5eaf5e0f9f0f0c283d2661d2eaacaca2e?width=80",
    hires: "5x Hired",
    opportunity: {
      title: "UI/UX Intern",
      type: "Internship",
    },
    location: "California, US",
    dateApplied: "Dec 25 2025",
    status: "In Review",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "UI/UX Designer",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/52cd7411e700d6427cb4097ede0436c16b0e4b3a?width=80",
    hires: "3x Hired",
    opportunity: {
      title: "Mobile App Designer",
      type: "Internship",
    },
    location: "Texas, US",
    dateApplied: "Jan 10 2026",
    status: "Pending",
  },
  {
    id: 3,
    name: "Oluwatobi Adeyemi",
    role: "Interaction Designer",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/a227b791b8d836bd9c83846d5c563de1bf8e9070?width=80",
    hires: "8x Hired",
    opportunity: {
      title: "Mobile App Designer",
      type: "Internship",
    },
    location: "New York, US",
    dateApplied: "Feb 20 2026",
    status: "Rejected",
  },
  {
    id: 4,
    name: "Sophia Taylor",
    role: "Interaction Designer",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/f25e66bac38da7360668fa7a0c3be5e28bf26714?width=80",
    hires: "2x Hired",
    opportunity: {
      title: "$8,000 Earned",
      type: "",
    },
    location: "Florida, US",
    dateApplied: "Mar 05 2026",
    status: "Hired",
  },
  {
    id: 5,
    name: "Olivia Brown",
    role: "Motion Designer",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/d2d5c07ec3c8a76d67b41bc18c688b38f8aa3e9c?width=80",
    hires: "4x Hired",
    opportunity: {
      title: "$12,000 Earned",
      type: "",
    },
    location: "Illinois, US",
    dateApplied: "Apr 12 2026",
    status: "Pending",
  },
  {
    id: 6,
    name: "Ethan Garcia",
    role: "Design Researcher",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/1461b9e5fcd47d64b053df42baf38ee3fcbdae04?width=80",
    hires: "6x Hired",
    opportunity: {
      title: "$28,000 Earned",
      type: "",
    },
    location: "Washington, US",
    dateApplied: "May 30 2026",
    status: "Rejected",
  },
  {
    id: 7,
    name: "Isabella Martinez",
    role: "Prototype Specialist",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/bbf2e154aac73c36beae6c0e53a329fb237a4bf3?width=80",
    hires: "1x Hired",
    opportunity: {
      title: "$5,000 Earned",
      type: "",
    },
    location: "Oregon, US",
    dateApplied: "Jun 15 2026",
    status: "Pending",
  },
  {
    id: 8,
    name: "Noah White",
    role: "Design Systems Architect",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/87ce74c19b2f896eb0af92f5338b866048bfa1eb?width=80",
    hires: "7x Hired",
    opportunity: {
      title: "$22,500 Earned",
      type: "",
    },
    location: "Ohio, US",
    dateApplied: "Jul 22 2026",
    status: "In Review",
  },
  {
    id: 9,
    name: "Liam Johnson",
    role: "Graphic Designer",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/17e0f8649d5b2acbdf3b84f9659212f2c54c411f?width=80",
    hires: "9x Hired",
    opportunity: {
      title: "$40,000 Earned",
      type: "",
    },
    location: "Nevada, US",
    dateApplied: "Aug 18 2026",
    status: "Pending",
  },
  {
    id: 10,
    name: "Ava Patel",
    role: "Product Designer",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/01cb677bd95bceffde4832706067054e07742b6d?width=80",
    hires: "10x Hired",
    opportunity: {
      title: "$50,000 Earned",
      type: "",
    },
    location: "Ohio, US",
    dateApplied: "Sep 12 2026",
    status: "Hired",
  },
];

const statusStyles = {
  "In Review": {
    bg: "#DBE9FE",
    text: "#5C30FF",
  },
  Pending: {
    bg: "#FEF3C7",
    text: "#92400D",
  },
  Rejected: {
    bg: "#FEE2E1",
    text: "#991B1B",
  },
  Hired: {
    bg: "#D1FAE5",
    text: "#076046",
  },
};

export default function ApplicantsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Newest");

  return (
    <div className="h-screen bg-white overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {/* Header Section */}
        <div className="flex flex-col gap-[19px] mb-[24px]">
          {/* Back Button */}
          <Link
            href="/opportunities"
            className="flex items-center gap-[8px] text-black/30 hover:text-black/50 transition-colors w-fit"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.783 11.7826C9.71332 11.8525 9.63053 11.9079 9.53937 11.9458C9.4482 11.9837 9.35046 12.0031 9.25175 12.0031C9.15304 12.0031 9.0553 11.9837 8.96414 11.9458C8.87297 11.9079 8.79018 11.8525 8.7205 11.7826L5.7205 8.78255C5.65058 8.71287 5.5951 8.63008 5.55725 8.53891C5.5194 8.44775 5.49991 8.35001 5.49991 8.2513C5.49991 8.15259 5.5194 8.05485 5.55725 7.96369C5.5951 7.87252 5.65058 7.78973 5.7205 7.72005L8.7205 4.72005C8.8614 4.57915 9.0525 4.5 9.25175 4.5C9.45101 4.5 9.64211 4.57915 9.783 4.72005C9.9239 4.86095 10.0031 5.05204 10.0031 5.2513C10.0031 5.45056 9.9239 5.64165 9.783 5.78255L7.31488 8.25193L9.78488 10.7213C9.85449 10.7911 9.90966 10.8739 9.94724 10.965C9.98482 11.0561 10.0041 11.1538 10.0039 11.2523C10.0037 11.3509 9.98413 11.4484 9.94623 11.5394C9.90832 11.6304 9.85286 11.713 9.783 11.7826Z"
                fill="#B2B2B2"
              />
            </svg>
            <span className="font-inter-tight text-[13px] font-normal leading-normal">
              Back to opportunities
            </span>
          </Link>

          {/* Title and Hired Talents */}
          <div className="flex items-center justify-between">
            <h1 className="font-inter-tight text-[21px] font-medium text-black leading-[18px]">
              Applicants &gt; UI Designer
            </h1>
            <Link
              href="/hired-talents"
              className="flex items-center gap-[5px] px-[14px] py-[7px] rounded-[8px] border border-[#E1E4EA] hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.3327 14V12.6667C11.3327 11.9594 11.0517 11.2811 10.5516 10.781C10.0515 10.281 9.37326 10 8.66602 10H3.33268C2.62544 10 1.94716 10.281 1.44706 10.781C0.946967 11.2811 0.666016 11.9594 0.666016 12.6667V14"
                  stroke="#525866"
                  strokeWidth="1.24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.00065 7.33333C7.47341 7.33333 8.66732 6.13943 8.66732 4.66667C8.66732 3.19391 7.47341 2 6.00065 2C4.52789 2 3.33398 3.19391 3.33398 4.66667C3.33398 6.13943 4.52789 7.33333 6.00065 7.33333Z"
                  stroke="#525866"
                  strokeWidth="1.24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.666 2.08691C11.2396 2.23378 11.748 2.56738 12.1111 3.03512C12.4742 3.50286 12.6712 4.07813 12.6712 4.67025C12.6712 5.26236 12.4742 5.83763 12.1111 6.30537C11.748 6.77311 11.2396 7.10671 10.666 7.25358"
                  stroke="#525866"
                  strokeWidth="1.24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-inter-tight text-[13px] font-normal text-[#525866] leading-normal">
                Hired Talents (1)
              </span>
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-[8px] mb-[20px]">
          {/* Search Container */}
          <div className="flex-1 max-w-[585px] flex items-center gap-[6px] px-[12px] py-[7px] rounded-[8px] border border-[#E1E4EA]">
            <svg
              width="16"
              height="16"
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
            <input
              type="text"
              placeholder="Search name or username"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 font-inter-tight text-[13px] font-normal text-black placeholder:text-black/30 outline-none bg-transparent capitalize"
            />
          </div>

          {/* Filter Button */}
          <button className="flex items-center gap-[5px] px-[14px] py-[7px] rounded-[8px] bg-[#F5F5F5] hover:bg-[#e8e8e8] transition-colors flex-shrink-0">
            <svg
              width="16"
              height="16"
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
            <span className="font-inter-tight text-[13px] font-normal text-black leading-normal">
              Filter
            </span>
          </button>

          {/* Sort Button */}
          <button className="flex items-center gap-[5px] px-[14px] py-[7px] rounded-[8px] bg-[#F5F5F5] hover:bg-[#e8e8e8] transition-colors flex-shrink-0">
            <span className="font-inter-tight text-[13px] font-normal text-black leading-normal">
              {sortBy}
            </span>
            <svg
              width="14"
              height="14"
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
        </div>

        {/* Table */}
        <div className="rounded-[16px] border border-[#E1E4EA] bg-white overflow-hidden flex flex-col flex-1">
          {/* Table Header */}
          <div className="px-[14px] py-[16px] border-b border-[#E1E4EA]">
            <div className="grid grid-cols-[22px_153px_68px_102px_93px_85px_68px_170px] gap-3">
              <span className="font-inter-tight text-[13px] font-medium text-[#525866] text-center">
                S/N
              </span>
              <span className="font-inter-tight text-[13px] font-medium text-[#525866] text-center">
                Talents
              </span>
              <span className="font-inter-tight text-[13px] font-medium text-[#525866]">
                Hires
              </span>
              <span className="font-inter-tight text-[13px] font-medium text-[#525866]">
                Opportunity
              </span>
              <span className="font-inter-tight text-[13px] font-medium text-[#525866]">
                Location
              </span>
              <span className="font-inter-tight text-[13px] font-medium text-[#525866]">
                Date Applied
              </span>
              <span className="font-inter-tight text-[13px] font-medium text-[#525866]">
                Status
              </span>
              <span className="font-inter-tight text-[13px] font-medium text-[#525866] text-center">
                Actions
              </span>
            </div>
          </div>

          {/* Table Body */}
          <div className="px-[24px] py-[19px] flex flex-col gap-[19px] overflow-y-auto flex-1">
            {mockApplicants.map((applicant, index) => (
              <div
                key={applicant.id}
                className="grid grid-cols-[22px_153px_68px_102px_93px_85px_68px_170px] gap-3 items-center flex-shrink-0"
              >
                {/* S/N */}
                <span className="font-inter-tight text-[13px] font-normal text-black text-center">
                  {index + 1}.
                </span>

                {/* Talents */}
                <div className="flex items-center gap-[8px]">
                  <img
                    src={applicant.avatar}
                    alt={applicant.name}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex flex-col gap-[8px]">
                    <span className="font-inter-tight text-[13px] font-medium text-black text-center leading-normal">
                      {applicant.name}
                    </span>
                    <span className="font-inter-tight text-[12px] font-light text-[#525866] leading-normal">
                      {applicant.role}
                    </span>
                  </div>
                </div>

                {/* Hires */}
                <span className="font-inter-tight text-[13px] font-normal text-black leading-normal">
                  {applicant.hires}
                </span>

                {/* Opportunity */}
                <div className="flex flex-col gap-[8px]">
                  <span className="font-inter-tight text-[12px] font-normal text-black leading-normal">
                    {applicant.opportunity.title}
                  </span>
                  {applicant.opportunity.type && (
                    <span className="font-inter-tight text-[11px] font-normal text-[#606060] leading-normal">
                      {applicant.opportunity.type}
                    </span>
                  )}
                </div>

                {/* Location */}
                <span className="font-inter-tight text-[13px] font-normal text-black leading-normal">
                  {applicant.location}
                </span>

                {/* Date Applied */}
                <span className="font-inter-tight text-[13px] font-normal text-black leading-normal">
                  {applicant.dateApplied}
                </span>

                {/* Status */}
                <div
                  className="flex items-center justify-center px-[20px] py-0 h-[18px] rounded-[50px]"
                  style={{
                    backgroundColor: statusStyles[applicant.status].bg,
                  }}
                >
                  <span
                    className="font-inter-tight text-[11px] font-semibold text-center leading-normal"
                    style={{ color: statusStyles[applicant.status].text }}
                  >
                    {applicant.status}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1 flex-shrink-0">
                  <button 
                    onClick={() => router.push(`/applicants/${applicant.id}`)}
                    className="flex items-center justify-center h-8 px-[8px] py-[12px] rounded-[50px] bg-[#181B25] hover:bg-[#2a2d3a] transition-colors flex-shrink-0"
                  >
                    <span className="font-inter-tight text-[12px] font-medium text-white text-center leading-normal">
                      View Proposal
                    </span>
                  </button>
                  {applicant.status !== "Rejected" &&
                    applicant.status !== "Hired" && (
                      <button className="flex items-center justify-center h-8 px-[20px] py-[12px] rounded-[50px] border border-[#5C30FF] bg-[#5C30FF] hover:bg-[#4a26cc] transition-colors flex-shrink-0">
                        <span className="font-inter-tight text-[12px] font-medium text-white text-center leading-normal">
                          Hire
                        </span>
                      </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
