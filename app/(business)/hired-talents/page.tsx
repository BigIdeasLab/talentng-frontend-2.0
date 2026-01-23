"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface HiredTalent {
  id: number;
  name: string;
  role: string;
  avatar: string;
  opportunity: string;
  hiredDate: string;
  location: string;
  previousHires: string;
  statusMessage: string;
}

const mockHiredTalents: HiredTalent[] = [
  {
    id: 1,
    name: "Elias Johnson",
    role: "Product Designer",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/b0919034a0c003e89a9b8eec7e38617e20342656?width=100",
    opportunity: "Mobile App Designer",
    hiredDate: "Feb 20 2026",
    location: "Port Harcourt, NG",
    previousHires: "8x Previously Hired",
    statusMessage:
      "Congratulations! You have been hired for the Mobile App Designer position. Welcome to the team!",
  },
  {
    id: 2,
    name: "Elias Johnson",
    role: "Product Designer",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/b0919034a0c003e89a9b8eec7e38617e20342656?width=100",
    opportunity: "Mobile App Designer",
    hiredDate: "Feb 20 2026",
    location: "Port Harcourt, NG",
    previousHires: "8x Previously Hired",
    statusMessage:
      "Congratulations! You have been hired for the Mobile App Designer position. Welcome to the team!",
  },
];

export default function HiredTalentsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Newest");

  return (
    <div className="h-screen bg-white overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto px-3 md:px-8 py-5 md:py-6">
        {/* Header Section */}
        <div className="flex flex-col gap-5 md:gap-6 mb-6">
          {/* Back Button */}
          <Link
            href="/opportunities"
            className="flex items-center gap-2 text-black/30 hover:text-black/50 transition-colors w-fit"
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
            <span className="font-inter-tight text-[13px] font-normal">
              Back to opportunities
            </span>
          </Link>

          {/* Title and Description */}
          <div className="flex flex-col gap-2">
            <h1 className="font-inter-tight text-[21px] font-medium text-black leading-5">
              Hired Talents
            </h1>
            <p className="font-inter-tight text-[13px] font-normal text-black/30">
              View all talents you&apos;ve hired across opportunities
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-6">
          {/* Search Container */}
          <div className="flex-1 max-w-full sm:max-w-[550px] flex items-center gap-[6px] px-[12px] py-[7px] rounded-[8px] border border-[#E1E4EA]">
            <svg
              width="15"
              height="15"
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
              placeholder="Search name or Role Or Opportunity"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 font-inter-tight text-[13px] font-normal text-black placeholder:text-black/30 outline-none bg-transparent capitalize"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Button */}
            <button className="flex items-center gap-1 px-[14px] py-[7px] rounded-[8px] bg-[#F5F5F5] hover:bg-[#e8e8e8] transition-colors">
              <svg
                width="15"
                height="15"
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
              <span className="font-inter-tight text-[13px] font-normal text-black">
                Filter
              </span>
            </button>

            {/* Sort Button */}
            <button className="flex items-center gap-1 px-[14px] py-[7px] rounded-[8px] bg-[#F5F5F5] hover:bg-[#e8e8e8] transition-colors">
              <span className="font-inter-tight text-[13px] font-normal text-black">
                {sortBy}
              </span>
              <svg
                width="13"
                height="13"
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
        </div>

        {/* Talents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockHiredTalents.map((talent) => (
            <div
              key={talent.id}
              className="flex flex-col gap-4 p-4 rounded-[10px] border border-[#E5E7EB] bg-white flex-shrink-0"
            >
              {/* Profile Section */}
              <div className="flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-start gap-3">
                  <img
                    src={talent.avatar}
                    alt={talent.name}
                    className="w-[42px] h-[42px] rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-center gap-2">
                    <div className="flex flex-col gap-1">
                      <h3 className="font-inter-tight text-[13px] font-bold text-black">
                        {talent.name}
                      </h3>
                      <p className="font-inter-tight text-[11px] font-normal text-[#525866]">
                        {talent.role}
                      </p>
                    </div>
                    <div className="flex items-center justify-center w-fit px-5 h-[18px] rounded-full bg-[#D1FAE5]">
                      <span className="font-inter-tight text-[10px] font-semibold text-[#076046]">
                        Hired
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-2">
                  <p className="font-inter-tight text-[11px] text-[#525866]">
                    <span className="text-[12px]">Opportunity</span>
                    <span className="text-[11px]">: </span>
                    <span className="text-black">{talent.opportunity}</span>
                  </p>
                  <div className="flex items-center gap-1">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14.25 3H3.75C2.92157 3 2.25 3.67157 2.25 4.5V15C2.25 15.8284 2.92157 16.5 3.75 16.5H14.25C15.0784 16.5 15.75 15.8284 15.75 15V4.5C15.75 3.67157 15.0784 3 14.25 3Z"
                        stroke="#525866"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 1.5V4.5"
                        stroke="#525866"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6 1.5V4.5"
                        stroke="#525866"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2.25 7.5H15.75"
                        stroke="#525866"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="font-inter-tight text-[11px] text-[#181B25]">
                      <span className="text-[12px] text-[#525866]">
                        Hired on:
                      </span>{" "}
                      {talent.hiredDate}
                    </p>
                  </div>
                  <p className="font-inter-tight text-[11px] text-[#525866]">
                    {talent.location} • {talent.previousHires}
                  </p>
                </div>
              </div>

              {/* Status Message and Action */}
              <div className="flex flex-col gap-3">
                {/* Status Message */}
                <div className="flex flex-col gap-1.5 p-2.5 rounded-[8px] bg-[#ECFDF5]">
                  <div className="flex items-center gap-1.5">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 2H10C10.55 2 11 2.45 11 3V9C11 9.55 10.55 10 10 10H2C1.45 10 1 9.55 1 9V3C1 2.45 1.45 2 2 2Z"
                        stroke="#008B47"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M11 3L6 6.5L1 3"
                        stroke="#008B47"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="font-inter-tight text-[10px] font-medium text-[#008B47]">
                      Status Message Sent
                    </span>
                  </div>
                  <p className="font-inter-tight text-[10px] font-normal text-[#008B47]">
                    {talent.statusMessage}
                  </p>
                </div>

                {/* View Profile Button */}
                <button className="flex items-center justify-center h-7 px-4 rounded-[8px] border border-[#E6E7EA] hover:bg-gray-50 transition-colors">
                  <span className="font-inter-tight text-[11px] font-medium text-black">
                    View Profile
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
