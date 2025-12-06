"use client";

import { useState } from "react";

interface Applicant {
  id: number;
  name: string;
  role: string;
  avatar: string;
  hires: string;
  earnings: string;
  location: string;
  dateApplied: string;
}

const mockApplicants: Applicant[] = [
  {
    id: 1,
    name: "Elias Johnson",
    role: "Product Designer",
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/77a2d0f5eaf5e0f9f0f0c283d2661d2eaacaca2e?width=80",
    hires: "5x Hired",
    earnings: "$20,000 Earned",
    location: "California, US",
    dateApplied: "Dec 25 2025",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "UI/UX Designer",
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/52cd7411e700d6427cb4097ede0436c16b0e4b3a?width=80",
    hires: "3x Hired",
    earnings: "$15,500 Earned",
    location: "Texas, US",
    dateApplied: "Jan 10 2026",
  },
  {
    id: 3,
    name: "Oluwatobi Adeyemi",
    role: "Interaction Designer",
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/a227b791b8d836bd9c83846d5c563de1bf8e9070?width=80",
    hires: "8x Hired",
    earnings: "$35,000 Earned",
    location: "New York, US",
    dateApplied: "Feb 20 2026",
  },
  {
    id: 4,
    name: "Sophia Taylor",
    role: "Interaction Designer",
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/f25e66bac38da7360668fa7a0c3be5e28bf26714?width=80",
    hires: "2x Hired",
    earnings: "$8,000 Earned",
    location: "Florida, US",
    dateApplied: "Mar 05 2026",
  },
  {
    id: 5,
    name: "Olivia Brown",
    role: "Motion Designer",
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/d2d5c07ec3c8a76d67b41bc18c688b38f8aa3e9c?width=80",
    hires: "4x Hired",
    earnings: "$12,000 Earned",
    location: "Illinois, US",
    dateApplied: "Apr 12 2026",
  },
  {
    id: 6,
    name: "Ethan Garcia",
    role: "Design Researcher",
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/1461b9e5fcd47d64b053df42baf38ee3fcbdae04?width=80",
    hires: "6x Hired",
    earnings: "$28,000 Earned",
    location: "Washington, US",
    dateApplied: "May 30 2026",
  },
  {
    id: 7,
    name: "Isabella Martinez",
    role: "Prototype Specialist",
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/bbf2e154aac73c36beae6c0e53a329fb237a4bf3?width=80",
    hires: "1x Hired",
    earnings: "$5,000 Earned",
    location: "Oregon, US",
    dateApplied: "Jun 15 2026",
  },
  {
    id: 8,
    name: "Noah White",
    role: "Design Systems Architect",
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/87ce74c19b2f896eb0af92f5338b866048bfa1eb?width=80",
    hires: "7x Hired",
    earnings: "$22,500 Earned",
    location: "Ohio, US",
    dateApplied: "Jul 22 2026",
  },
  {
    id: 9,
    name: "Liam Johnson",
    role: "Graphic Designer",
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/17e0f8649d5b2acbdf3b84f9659212f2c54c411f?width=80",
    hires: "9x Hired",
    earnings: "$40,000 Earned",
    location: "Nevada, US",
    dateApplied: "Aug 18 2026",
  },
  {
    id: 10,
    name: "Ava Patel",
    role: "Product Designer",
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/01cb677bd95bceffde4832706067054e07742b6d?width=80",
    hires: "10x Hired",
    earnings: "$50,000 Earned",
    location: "Massachusetts, US",
    dateApplied: "Sep 12 2026",
  },
];

interface ApplicantsTableProps {
  searchQuery: string;
  sortBy: string;
}

export function ApplicantsTable({ searchQuery, sortBy }: ApplicantsTableProps) {
  const filteredApplicants = mockApplicants.filter((applicant) =>
    applicant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="border border-[#E1E4EA] rounded-[20px] overflow-hidden">
      {/* Table Header */}
      <div className="px-4 py-5 border-b border-[#E1E4EA]">
        <div className="grid grid-cols-[40px_1fr_120px_140px_140px_120px_200px] gap-4 items-center">
          <div className="font-inter-tight text-[15px] font-medium text-[#525866]">
            S/N
          </div>
          <div className="font-inter-tight text-[15px] font-medium text-[#525866]">
            Talents
          </div>
          <div className="font-inter-tight text-[15px] font-medium text-[#525866]">
            Hires
          </div>
          <div className="font-inter-tight text-[15px] font-medium text-[#525866]">
            Earnings
          </div>
          <div className="font-inter-tight text-[15px] font-medium text-[#525866]">
            Location
          </div>
          <div className="font-inter-tight text-[15px] font-medium text-[#525866]">
            Date Applied
          </div>
          <div className="font-inter-tight text-[15px] font-medium text-[#525866] text-right">
            Actions
          </div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-[#E1E4EA]">
        {filteredApplicants.map((applicant, index) => (
          <div
            key={applicant.id}
            className="px-4 py-6 hover:bg-gray-50/50 transition-colors"
          >
            <div className="grid grid-cols-[40px_1fr_120px_140px_140px_120px_200px] gap-4 items-center">
              {/* S/N */}
              <div className="font-inter-tight text-[15px] font-normal text-black">
                {index + 1}.
              </div>

              {/* Talent Info */}
              <div className="flex items-center gap-2.5">
                <img
                  src={applicant.avatar}
                  alt={applicant.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex flex-col gap-1">
                  <div className="font-inter-tight text-[15px] font-medium text-black">
                    {applicant.name}
                  </div>
                  <div className="font-inter-tight text-[14px] font-light text-[#525866]">
                    {applicant.role}
                  </div>
                </div>
              </div>

              {/* Hires */}
              <div className="font-inter-tight text-[15px] font-normal text-black">
                {applicant.hires}
              </div>

              {/* Earnings */}
              <div className="font-inter-tight text-[15px] font-normal text-black">
                {applicant.earnings}
              </div>

              {/* Location */}
              <div className="font-inter-tight text-[15px] font-normal text-black">
                {applicant.location}
              </div>

              {/* Date Applied */}
              <div className="font-inter-tight text-[15px] font-normal text-black">
                {applicant.dateApplied}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-1.5">
                <button className="px-4 py-2.5 bg-[#181B25] text-white rounded-full font-inter-tight text-[14px] font-medium hover:bg-[#2a2d35] transition-colors">
                  View Profile
                </button>
                <button className="px-4 py-2.5 bg-[#5C30FF] text-white rounded-full font-inter-tight text-[14px] font-medium border border-[#5C30FF] hover:bg-[#4a26cc] transition-colors">
                  Hire
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredApplicants.length === 0 && (
        <div className="px-4 py-12 text-center">
          <p className="font-inter-tight text-[15px] text-gray-500">
            No applicants found
          </p>
        </div>
      )}
    </div>
  );
}
