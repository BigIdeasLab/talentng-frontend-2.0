"use client";

import { useState } from "react";

interface Applicant {
  id: string;
  userId: string;
  opportunityId: string;
  status: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string;
    email: string;
    talentProfile: {
      id: string;
      fullName: string;
      headline: string;
      bio?: string;
      skills: string[];
      location: string;
      profileImageUrl: string;
      category: string;
    };
  };
}

interface ApplicantsTableProps {
  searchQuery: string;
  sortBy: string;
  applicants: Applicant[];
}

export function ApplicantsTable({ searchQuery, sortBy, applicants }: ApplicantsTableProps) {
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredApplicants = (applicants || []).filter((applicant) =>
    applicant.user?.talentProfile?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="border border-[#E1E4EA] rounded-[16px] overflow-hidden">
      {/* Table Header - Hidden on mobile */}
      <div className="hidden lg:block px-3 py-4 border-b border-[#E1E4EA]">
        <div className="grid grid-cols-[35px_1fr_100px_115px_115px_100px_160px] gap-3 items-center">
          <div className="font-inter-tight text-[13px] font-medium text-[#525866]">
            S/N
          </div>
          <div className="font-inter-tight text-[13px] font-medium text-[#525866]">
            Talents
          </div>
          <div className="font-inter-tight text-[13px] font-medium text-[#525866]">
            Hires
          </div>
          <div className="font-inter-tight text-[13px] font-medium text-[#525866]">
            Earnings
          </div>
          <div className="font-inter-tight text-[13px] font-medium text-[#525866]">
            Location
          </div>
          <div className="font-inter-tight text-[13px] font-medium text-[#525866]">
            Date Applied
          </div>
          <div className="font-inter-tight text-[13px] font-medium text-[#525866] text-right">
            Actions
          </div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-[#E1E4EA]">
        {filteredApplicants.map((applicant, index) => (
          <div
            key={applicant.id}
            className="px-3 py-4 hover:bg-gray-50/50 transition-colors"
          >
            {/* Desktop Layout */}
            <div className="hidden lg:grid grid-cols-[35px_1fr_100px_115px_115px_100px_160px] gap-3 items-center">
              {/* S/N */}
              <div className="font-inter-tight text-[13px] font-normal text-black">
                {index + 1}.
              </div>

              {/* Talent Info */}
              <div className="flex items-center gap-2">
                <img
                  src={applicant.user?.talentProfile?.profileImageUrl || ""}
                  alt={applicant.user?.talentProfile?.fullName || ""}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex flex-col gap-0.5">
                  <div className="font-inter-tight text-[13px] font-medium text-black">
                    {applicant.user?.talentProfile?.fullName || "Unknown"}
                  </div>
                  <div className="font-inter-tight text-[12px] font-light text-[#525866]">
                    {applicant.user?.talentProfile?.headline || applicant.user?.talentProfile?.category || ""}
                  </div>
                </div>
              </div>

              {/* Hires */}
              <div className="font-inter-tight text-[13px] font-normal text-black">
                -
              </div>

              {/* Earnings */}
              <div className="font-inter-tight text-[13px] font-normal text-black">
                -
              </div>

              {/* Location */}
              <div className="font-inter-tight text-[13px] font-normal text-black">
                {applicant.user?.talentProfile?.location || ""}
              </div>

              {/* Date Applied */}
              <div className="font-inter-tight text-[13px] font-normal text-black">
                {formatDate(applicant.createdAt)}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-1">
                <button className="px-3 py-1.5 bg-[#181B25] text-white rounded-full font-inter-tight text-[12px] font-medium hover:bg-[#2a2d35] transition-colors whitespace-nowrap">
                  View Profile
                </button>
                <button className="px-3 py-1.5 bg-[#5C30FF] text-white rounded-full font-inter-tight text-[12px] font-medium border border-[#5C30FF] hover:bg-[#4a26cc] transition-colors whitespace-nowrap">
                  Hire
                </button>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="font-inter-tight text-[13px] font-normal text-black">
                    {index + 1}.
                  </div>
                  <img
                    src={applicant.user?.talentProfile?.profileImageUrl || ""}
                    alt={applicant.user?.talentProfile?.fullName || ""}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex flex-col gap-0.5">
                    <div className="font-inter-tight text-[13px] font-medium text-black">
                      {applicant.user?.talentProfile?.fullName || "Unknown"}
                    </div>
                    <div className="font-inter-tight text-[12px] font-light text-[#525866]">
                      {applicant.user?.talentProfile?.headline || applicant.user?.talentProfile?.category || ""}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                    <div className="font-inter-tight text-[11px] text-[#525866] mb-0.5">
                      Category
                    </div>
                    <div className="font-inter-tight text-[12px] text-black">
                      {applicant.user?.talentProfile?.category || "-"}
                    </div>
                  </div>
                  <div>
                    <div className="font-inter-tight text-[11px] text-[#525866] mb-0.5">
                      Skills
                    </div>
                    <div className="font-inter-tight text-[12px] text-black">
                      {applicant.user?.talentProfile?.skills?.slice(0, 2).join(", ") || "-"}
                    </div>
                  </div>
                  <div>
                    <div className="font-inter-tight text-[11px] text-[#525866] mb-0.5">
                      Location
                    </div>
                    <div className="font-inter-tight text-[12px] text-black">
                      {applicant.user?.talentProfile?.location || "-"}
                    </div>
                  </div>
                  <div>
                    <div className="font-inter-tight text-[11px] text-[#525866] mb-0.5">
                      Date Applied
                    </div>
                    <div className="font-inter-tight text-[12px] text-black">
                      {formatDate(applicant.createdAt)}
                    </div>
                  </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button className="flex-1 px-3 py-1.5 bg-[#181B25] text-white rounded-full font-inter-tight text-[11px] font-medium hover:bg-[#2a2d35] transition-colors">
                  View Profile
                </button>
                <button className="flex-1 px-3 py-1.5 bg-[#5C30FF] text-white rounded-full font-inter-tight text-[11px] font-medium border border-[#5C30FF] hover:bg-[#4a26cc] transition-colors">
                  Hire
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredApplicants.length === 0 && (
        <div className="px-3 py-9 text-center">
          <p className="font-inter-tight text-[13px] text-gray-500">
            No applicants found
          </p>
        </div>
      )}
    </div>
  );
}
