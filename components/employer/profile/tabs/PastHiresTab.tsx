"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

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
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/4489b61f18d60d40a2b95b65f27d3dc37af77141",
    primarySkill: "Product Designer",
    location: "California, US",
    dateHired: "Dec 25 2025",
  },
  {
    id: 2,
    name: "Sophie Lee",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/ac599d21a164f89cc53bcd2c3803d8c7e443bb16",
    primarySkill: "UX Designer",
    location: "New York, US",
    dateHired: "Jan 15 2024",
  },
  {
    id: 3,
    name: "Michael Brown",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/212208d7b867ab37dca0e63ad5b3246d2fad53a6",
    primarySkill: "UI Designer",
    location: "Texas, US",
    dateHired: "Feb 10 2023",
  },
  {
    id: 4,
    name: "Emily Davis",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/98e3bf6d1fcfd7f32c737ff00aaa0c0e6b9c1c25",
    primarySkill: "Graphic Designer",
    location: "Florida, US",
    dateHired: "Mar 5 2024",
  },
  {
    id: 5,
    name: "Daniel Garcia",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/455fcd9600095c754eeaffb8827fd5e890ac94cf",
    primarySkill: "Interaction Designer",
    location: "Washington, US",
    dateHired: "Apr 20 2023",
  },
  {
    id: 6,
    name: "Olivia Martinez",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/17e0f8649d5b2acbdf3b84f9659212f2c54c411f",
    primarySkill: "Visual Designer",
    location: "Oregon, US",
    dateHired: "May 30 2024",
  },
  {
    id: 7,
    name: "James Wilson",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/e00a7d8c459efb178454a164267b6b5d418308a4",
    primarySkill: "Product Manager",
    location: "Illinois, US",
    dateHired: "Jun 15 2023",
  },
  {
    id: 8,
    name: "Ava Anderson",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/1461b9e5fcd47d64b053df42baf38ee3fcbdae04",
    primarySkill: "Web Designer",
    location: "Nevada, US",
    dateHired: "Jul 10 2024",
  },
  {
    id: 9,
    name: "Lucas Thomas",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/f25e66bac38da7360668fa7a0c3be5e28bf26714",
    primarySkill: "Motion Designer",
    location: "Colorado, US",
    dateHired: "Aug 25 2023",
  },
  {
    id: 10,
    name: "Mia Jackson",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/52cd7411e700d6427cb4097ede0436c16b0e4b3a",
    primarySkill: "Industrial Designer",
    location: "Massachusetts, US",
    dateHired: "Sep 30 2024",
  },
  {
    id: 11,
    name: "Ethan White",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/a227b791b8d836bd9c83846d5c563de1bf8e9070",
    primarySkill: "Service Designer",
    location: "Virginia, US",
    dateHired: "Oct 20 2023",
  },
  {
    id: 12,
    name: "Isabella Harris",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/77a2d0f5eaf5e0f9f0f0c283d2661d2eaacaca2e",
    primarySkill: "Game Designer",
    location: "Georgia, US",
    dateHired: "Nov 14 2024",
  },
];

export function PastHiresTab() {
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
          hire.location.toLowerCase().includes(query),
      );
      setFilteredHires(filtered);
    }
  }, [searchQuery]);

  return (
    <div className="flex flex-col gap-4 p-3 md:p-4 lg:p-5 w-full">
      {/* Title */}
      <h1 className="text-base font-medium text-black font-inter-tight leading-5">
        Past Hires
      </h1>

      {/* Search and Filter Container */}
      <div className="flex flex-col gap-2.5">
        {/* Search and Filters */}
        <div className="flex items-center gap-2 w-full">
          {/* Search Container */}
          <div className="flex-1 min-w-0 h-[38px] px-2.5 flex items-center gap-1.5 rounded-[8px] border border-[#E1E4EA]">
            <Search className="w-4 h-4 text-[#B2B2B2] flex-shrink-0" />
            <input
              type="text"
              placeholder="Search Talent, Role"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-0 text-[13px] font-normal font-inter-tight placeholder:text-[rgba(0,0,0,0.30)] placeholder:capitalize border-0 focus:outline-none bg-transparent"
            />
          </div>

          {/* Filter Button */}
          <button className="h-[38px] px-2.5 flex items-center gap-1 rounded-[8px] flex-shrink-0 hover:bg-gray-50 transition-colors">
            <SlidersHorizontal className="w-4 h-4 text-black" />
            <span className="text-[13px] font-normal text-black font-inter-tight hidden sm:inline">
              Filter
            </span>
          </button>
        </div>

        {/* Talent List Table */}
        <div className="w-full rounded-[16px] border border-[#E1E4EA] overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid md:grid-cols-[35px_1fr_150px_120px_110px] gap-3 px-3.5 py-4 border-b border-[#E1E4EA]">
            <div className="text-[12px] font-medium text-[#525866] font-inter-tight text-center">
              S/N
            </div>
            <div className="text-[12px] font-medium text-[#525866] font-inter-tight">
              Talents
            </div>
            <div className="text-[12px] font-medium text-[#525866] font-inter-tight">
              Primary Skill
            </div>
            <div className="text-[12px] font-medium text-[#525866] font-inter-tight">
              Location
            </div>
            <div className="text-[12px] font-medium text-[#525866] font-inter-tight">
              Date Hired
            </div>
          </div>

          {/* Table Body */}
          <div className="flex flex-col divide-y divide-[#E1E4EA]/30">
            {filteredHires.length > 0 ? (
              filteredHires.map((hire, index) => (
                <div
                  key={hire.id}
                  className="grid grid-cols-1 md:grid-cols-[35px_1fr_150px_120px_110px] gap-1.5 md:gap-3 px-3.5 py-3 md:py-4 hover:bg-gray-50/50 transition-colors"
                >
                  {/* Serial Number - Hidden on mobile, shown on desktop */}
                  <div className="hidden md:flex items-center justify-center text-[12px] font-normal text-black font-inter-tight">
                    {index + 1}.
                  </div>

                  {/* Profile - Full width on mobile, normal on desktop */}
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                      <img
                        src={hire.avatar}
                        alt={hire.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <div className="text-[13px] font-normal text-black font-inter-tight truncate">
                        {hire.name}
                      </div>
                      {/* Show skill on mobile under name */}
                      <div className="md:hidden text-[11px] font-light text-[#525866] font-inter-tight truncate">
                        {hire.primarySkill}
                      </div>
                    </div>
                  </div>

                  {/* Primary Skill - Hidden on mobile, shown on desktop */}
                  <div className="hidden md:flex items-center text-[12px] font-normal text-black font-inter-tight">
                    {hire.primarySkill}
                  </div>

                  {/* Location - Shown as row on mobile */}
                  <div className="flex md:items-center">
                    <span className="md:hidden text-[11px] font-medium text-[#525866] mr-1.5">
                      Location:
                    </span>
                    <span className="text-[13px] font-normal text-black font-inter-tight">
                      {hire.location}
                    </span>
                  </div>

                  {/* Date Hired - Shown as row on mobile */}
                  <div className="flex md:items-center">
                    <span className="md:hidden text-[11px] font-medium text-[#525866] mr-1.5">
                      Hired:
                    </span>
                    <span className="text-[13px] font-normal text-black font-inter-tight">
                      {hire.dateHired}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 px-4">
                <p className="text-[13px] text-[rgba(0,0,0,0.30)] font-inter-tight">
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
