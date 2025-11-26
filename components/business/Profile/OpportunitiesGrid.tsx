"use client";

import Image from "next/image";
import { Bookmark, Check } from "lucide-react";
import { EmptyState } from "./EmptyState";

type OpportunityType = "internship" | "job_listing";

interface Opportunity {
  id: string;
  companyName: string;
  companyLogo: string;
  date: string;
  type: OpportunityType;
  title: string;
  skills: string[];
  rate: string;
}

interface OpportunitiesGridProps {
  opportunities?: Opportunity[];
  isLoading?: boolean;
  onRemove?: (opportunity: Opportunity) => void;
  onApply?: (opportunity: Opportunity) => void;
}

const defaultOpportunities: Opportunity[] = [
  {
    id: "1",
    companyName: "Ifeoma Chijioke",
    companyLogo:
      "https://api.builder.io/api/v1/image/assets/TEMP/01cb677bd95bceffde4832706067054e07742b6d?width=80",
    date: "Nov 16",
    type: "internship",
    title: "Art Director / Senior Art Director Intern",
    skills: [
      "Mobile App Design",
      "User Research",
      "Visual Design",
      "Wireframing",
    ],
    rate: "$250 / Month",
  },
  {
    id: "2",
    companyName: "Spotify",
    companyLogo:
      "https://api.builder.io/api/v1/image/assets/TEMP/b0bfb6c564a4b6600d88fa72ebf8eaa9de3ecb0c?width=80",
    date: "Dec 01",
    type: "job_listing",
    title: "Product Designer",
    skills: ["Web Design", "User Testing", "Interaction Design", "Prototyping"],
    rate: "$85/hr",
  },
  {
    id: "3",
    companyName: "Jumia",
    companyLogo:
      "https://api.builder.io/api/v1/image/assets/TEMP/a49ff6e7c4095ef84092ad9c082a315acb23b74f?width=80",
    date: "Nov 16",
    type: "internship",
    title: "Mobile App Designer",
    skills: [
      "Mobile App Design",
      "User Research",
      "Visual Design",
      "Wireframing",
    ],
    rate: "$250 / Month",
  },
  {
    id: "4",
    companyName: "Ifeoma Chijioke",
    companyLogo:
      "https://api.builder.io/api/v1/image/assets/TEMP/01cb677bd95bceffde4832706067054e07742b6d?width=80",
    date: "Nov 16",
    type: "internship",
    title: "Art Director / Senior Art Director Intern",
    skills: [
      "Mobile App Design",
      "User Research",
      "Visual Design",
      "Wireframing",
    ],
    rate: "$250 / Month",
  },
];

export function OpportunitiesGrid({
  opportunities = defaultOpportunities,
  isLoading = false,
  onRemove,
  onApply,
}: OpportunitiesGridProps) {
  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">
          Loading opportunities...
        </div>
      </div>
    );
  }

  if (opportunities.length === 0) {
    return (
      <EmptyState
        title="No saved opportunities yet"
        description="Browse opportunities and save the ones that interest you. Build your wishlist here."
        buttonText="Discover Opportunities"
        onButtonClick={onApply as any}
      />
    );
  }

  return (
    <div className="w-full px-[20px] py-[20px]">
      <div className="flex flex-col items-start gap-[10px] max-w-[560px]">
        {opportunities.map((opportunity) => (
          <div
            key={opportunity.id}
            className="flex flex-col items-center gap-[24px] w-full pt-[15px] rounded-[20px] border border-[#E1E4EA] bg-white"
          >
            {/* Main Container */}
            <div className="flex flex-col items-start gap-[21px] w-full px-[12px]">
              {/* Header Section */}
              <div className="flex flex-col items-start gap-[6px] w-full">
                <div className="flex justify-between items-center w-full">
                  {/* Profile */}
                  <div className="flex items-center gap-[10px]">
                    <div className="relative w-[40px] h-[40px] rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      <Image
                        src={opportunity.companyLogo}
                        alt={opportunity.companyName}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex flex-col items-start gap-[10px]">
                      <h3 className="text-[15px] font-medium leading-normal font-inter-tight text-black">
                        {opportunity.companyName}
                      </h3>
                      <span className="text-[14px] font-light leading-normal font-inter-tight text-[#525866]">
                        {opportunity.date}
                      </span>
                    </div>
                  </div>

                  {/* Type Badge */}
                  <div
                    className={`flex px-[12px] py-[15px] items-center gap-[8px] rounded-[8px] ${
                      opportunity.type === "internship"
                        ? "bg-[rgba(0,139,71,0.09)]"
                        : "bg-[rgba(92,48,255,0.10)]"
                    }`}
                  >
                    <div
                      className={`w-[8px] h-[8px] rounded-full ${
                        opportunity.type === "internship"
                          ? "bg-[#008B47]"
                          : "bg-[#5C30FF]"
                      }`}
                    />
                    <span
                      className={`text-[13px] font-normal leading-normal font-inter-tight ${
                        opportunity.type === "internship"
                          ? "text-[#008B47]"
                          : "text-[#5C30FF]"
                      }`}
                    >
                      {opportunity.type === "internship"
                        ? "Internship"
                        : "Job Listing"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Job Title */}
              <h2 className="text-[18px] font-medium leading-normal font-inter-tight text-black">
                {opportunity.title}
              </h2>

              {/* Skills */}
              <div className="flex flex-col items-start gap-[14px] w-full">
                <div className="flex h-auto items-start content-start gap-x-[5px] gap-y-[8px] w-full flex-wrap">
                  {opportunity.skills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="flex px-[13px] py-[12px] justify-center items-center rounded-[30px] bg-[#F5F5F5]"
                    >
                      <span className="text-[14px] font-normal leading-[105%] font-inter-tight text-black">
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Section - Rate and Actions */}
            <div className="flex flex-col items-start gap-[10px] w-full px-[12px] py-[12px] border-t border-[#E1E4EA]">
              <div className="flex justify-between items-center w-full">
                {/* Rate */}
                <span className="text-[18px] font-medium leading-normal font-inter-tight text-black">
                  {opportunity.rate}
                </span>

                {/* Actions */}
                <div className="flex justify-end items-center gap-[6px]">
                  {/* Remove Button */}
                  <button
                    onClick={() => onRemove?.(opportunity)}
                    className="flex h-[40px] px-[20px] py-[15px] items-center gap-[4px] rounded-[50px] bg-[#181B25] hover:bg-[#2a2d3a] transition-colors"
                  >
                    <Bookmark
                      className="w-[18px] h-[18px]"
                      color="white"
                      strokeWidth={1.125}
                    />
                    <span className="text-[14px] font-medium leading-normal font-inter-tight text-white">
                      Remove
                    </span>
                  </button>

                  {/* Apply Button */}
                  <button
                    onClick={() => onApply?.(opportunity)}
                    className="flex h-[40px] px-[20px] py-[15px] items-center gap-[4px] rounded-[50px] border-[0.822px] border-[#5C30FF] bg-[#5C30FF] hover:bg-[#4a24d6] transition-colors"
                  >
                    <Check
                      className="w-[18px] h-[18px]"
                      color="white"
                      strokeWidth={1.125}
                    />
                    <span className="text-[14px] font-medium leading-normal font-inter-tight text-white">
                      Apply
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
