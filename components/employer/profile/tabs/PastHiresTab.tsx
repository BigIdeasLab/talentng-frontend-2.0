"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useRecruiterApplicationsQuery } from "@/hooks/useRecruiterApplications";
import { type Application } from "@/lib/api/applications/types";

interface PastHire {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  primarySkill: string;
  location: string;
  dateHired: string;
}

const transformApplicationToHire = (app: Application): PastHire => {
  const hiredDate = app.createdAt
    ? new Date(app.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Date not available";

  return {
    id: app.id,
    userId: app.userId,
    name: app.user?.talentProfile?.fullName || "Unknown",
    avatar: app.user?.talentProfile?.profileImageUrl || "",
    primarySkill: app.user?.talentProfile?.headline || "Not specified",
    location: app.user?.talentProfile?.location || "Location not available",
    dateHired: hiredDate,
  };
};

export function PastHiresTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: applicationsRaw = [], isLoading } =
    useRecruiterApplicationsQuery({ status: "hired" });

  const pastHires: PastHire[] = applicationsRaw.map(transformApplicationToHire);

  const filteredHires =
    searchQuery.trim() === ""
      ? pastHires
      : pastHires.filter(
          (hire) =>
            hire.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            hire.primarySkill
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            hire.location.toLowerCase().includes(searchQuery.toLowerCase()),
        );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-3 md:p-4 lg:p-5 w-full">
        <h1 className="text-base font-medium text-black font-inter-tight leading-5">
          Past Hires
        </h1>
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500">Loading past hires...</p>
        </div>
      </div>
    );
  }

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
                      {hire.avatar ? (
                        <img
                          src={hire.avatar}
                          alt={hire.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                          {hire.name.charAt(0)}
                        </div>
                      )}
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
                  {pastHires.length === 0
                    ? "No hired talents yet"
                    : "No talents found matching your search"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
