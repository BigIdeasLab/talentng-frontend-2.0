"use client";

import { Check, MoreVertical } from "lucide-react";

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
    companyLogo:
      "https://api.builder.io/api/v1/image/assets/TEMP/9bf353c86041ee07f1b8f00fe2bfefc2c11557c6",
    datePosted: "Nov 25",
    type: "Job Listing",
    title: "Product Designer",
    skills: [
      "E-commerce",
      "Market Research",
      "User Interface Design",
      "A/B Testing",
    ],
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
    companyLogo:
      "https://api.builder.io/api/v1/image/assets/TEMP/9bf353c86041ee07f1b8f00fe2bfefc2c11557c6",
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
    companyLogo:
      "https://api.builder.io/api/v1/image/assets/TEMP/9bf353c86041ee07f1b8f00fe2bfefc2c11557c6",
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

export function OpportunitiesTab() {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="flex flex-col gap-2 p-3 md:p-4 w-full max-w-[700px]">
        {mockOpportunities.map((opportunity) => (
          <div key={opportunity.id} className="flex flex-col">
            {/* Job Card */}
            <div className="flex flex-col gap-4 p-2 md:p-4 rounded-t-[16px] border border-[#E1E4EA]">
              {/* Header */}
              <div className="flex flex-col gap-3.5">
                {/* Company Info and Type Badge */}
                <div className="flex justify-between items-start gap-1.5">
                  {/* Company Profile */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                      <img
                        src={opportunity.companyLogo}
                        alt={opportunity.companyName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <div className="text-[13px] font-medium text-black font-inter-tight">
                        {opportunity.companyName}
                      </div>
                      <div className="text-[12px] font-light text-[#525866] font-inter-tight">
                        {opportunity.datePosted}
                      </div>
                    </div>
                  </div>

                  {/* Type Badge */}
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-2 rounded-md text-[11px] font-normal font-inter-tight whitespace-nowrap ${
                      opportunity.type === "Job Listing"
                        ? "bg-[rgba(92,48,255,0.10)] text-[#5C30FF]"
                        : "bg-[rgba(0,139,71,0.09)] text-[#008B47]"
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        opportunity.type === "Job Listing"
                          ? "bg-[#5C30FF]"
                          : "bg-[#008B47]"
                      }`}
                    />
                    {opportunity.type}
                  </div>
                </div>

                {/* Job Title */}
                <h3 className="text-base font-medium text-black font-inter-tight">
                  {opportunity.title}
                </h3>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5">
                  {opportunity.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="text-[12px] font-normal text-black font-inter-tight"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Rate and Actions */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pt-2 border-t border-[#E1E4EA]">
                <div className="text-base font-medium text-black font-inter-tight">
                  {opportunity.rate}
                </div>
                <div className="flex items-center gap-1">
                  <button className="flex items-center gap-0.5 h-8 px-3 rounded-full bg-[#5C30FF] text-white text-[12px] font-medium hover:bg-[#4a26cc] transition-colors">
                    <Check className="w-4 h-4" strokeWidth={1.5} />
                    <span className="font-inter-tight">Mark As Filled</span>
                  </button>
                  <button className="w-5 h-5 flex items-center justify-center hover:bg-gray-100 rounded transition-colors">
                    <MoreVertical className="w-5 h-5 text-black" />
                  </button>
                </div>
              </div>
            </div>

            {/* Applicants Section */}
            <div className="flex items-center gap-2 px-2.5 py-3 rounded-b-[16px] border border-t-0 border-[#E1E4EA] bg-[#FFFBF0]">
              {/* Avatars */}
              <div className="flex -space-x-1.5">
                {opportunity.applicantAvatars.map((avatar, index) => (
                  <div
                    key={index}
                    className="w-[24px] h-[24px] rounded-full overflow-hidden border-1.5 border-white bg-gray-100"
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
              <div className="text-[13px] font-medium font-inter-tight">
                <span className="text-black">
                  {opportunity.applicantCount} talents applied.{" "}
                </span>
                <button className="text-[#E39B00] underline hover:text-[#c58600] transition-colors">
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
