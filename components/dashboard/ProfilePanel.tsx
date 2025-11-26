"use client";

import { MapPin, Briefcase, Users, DollarSign, Mail, Linkedin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProfilePanelProps {
  user?: {
    fullName: string;
    headline?: string;
    location?: string;
    profileImageUrl?: string;
  };
  stats?: {
    earnings?: string;
    hired?: number;
    jobType?: string;
  };
  skills?: string[];
  stack?: Array<{ name: string; logo?: string }>;
  socialLinks?: {
    telegram?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  completionPercentage?: number;
}

const defaultSkills = [
  "Website Design",
  "Mobile App Design",
  "Ui/Ux Design",
  "Interface Design",
];

const defaultStack = [
  { name: "Figma" },
  { name: "Rive" },
  { name: "Webflow" },
  { name: "Lottie" },
  { name: "Framer" },
];

export function ProfilePanel({
  user = { fullName: "Akanbi David", headline: "Product & Interaction Designer" },
  stats = { earnings: "$20,000 Earned", hired: 5, jobType: "Ui/Ux Designer" },
  skills = defaultSkills,
  stack = defaultStack,
  socialLinks = {
    telegram: "#",
    twitter: "#",
    instagram: "#",
    linkedin: "#",
  },
  completionPercentage = 25,
}: ProfilePanelProps) {
  const displayedSkills = skills.slice(0, 4);
  const skillsRemaining = Math.max(0, skills.length - 4);
  const displayedStack = stack.slice(0, 5);
  const stackRemaining = Math.max(0, stack.length - 5);

  return (
    <div className="hidden lg:flex w-[333px] flex-col bg-white border-r border-[#E1E4EA] px-[35px] py-[20px] overflow-y-auto">
      {/* User Profile Section */}
      <div className="flex flex-col items-center gap-[28px]">
        {/* Profile Picture with Completion Badge */}
        <div className="relative w-[118px] h-[110px]">
          <svg
            width="118"
            height="110"
            viewBox="0 0 118 110"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <circle cx="55" cy="55" r="45" fill="#FF563D" opacity="0.2" />
            <circle cx="55" cy="55" r="54" stroke="#E63C23" strokeWidth="2" strokeOpacity="0.2" />
            <path
              d="M55 1C62.0914 1 69.1133 2.39675 75.6649 5.1105C82.2165 7.82426 88.1694 11.8019 93.1838 16.8162C98.1981 21.8306 102.176 27.7835 104.889 34.3351C107.603 40.8867 109 47.9086 109 55"
              stroke="#E63C23"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <rect x="90" y="15" width="28" height="15" rx="7.5" fill="#E63C23" />
            <text
              x="104"
              y="26.2754"
              fill="white"
              fontSize="10"
              fontFamily="Inter Tight"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {completionPercentage}%
            </text>
          </svg>
        </div>

        {/* User Info */}
        <div className="flex flex-col items-center gap-[15px] w-full">
          <div className="text-center">
            <h2 className="text-[19px] font-medium text-black font-inter-tight">
              {user.fullName}
            </h2>
            <p className="text-[17px] font-light text-[rgba(0,0,0,0.30)] font-inter-tight">
              {user.headline}
            </p>
          </div>

          {/* Details Container */}
          <div className="flex flex-col items-start gap-[15px] w-full">
            {/* Location */}
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-[8px]">
                <MapPin className="w-[22px] h-[22px] text-[#525866]" />
                <span className="text-[15px] font-normal text-black font-inter-tight">
                  Lagos, Nigeria
                </span>
              </div>
            </div>

            {/* Job Type */}
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-[8px]">
                <Briefcase className="w-[22px] h-[22px] text-[#525866]" />
                <span className="text-[15px] font-normal text-black font-inter-tight">
                  {stats.jobType}
                </span>
              </div>
            </div>

            {/* Hired Count */}
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-[8px]">
                <Users className="w-[22px] h-[22px] text-[#525866]" />
                <span className="text-[15px] font-normal text-black font-inter-tight">
                  {stats.hired}x Hired
                </span>
              </div>
            </div>

            {/* Earnings */}
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-[8px]">
                <DollarSign className="w-[22px] h-[22px] text-[#525866]" />
                <span className="text-[15px] font-normal text-black font-inter-tight">
                  {stats.earnings}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Button */}
      <Button className="w-full mt-[25px] h-[50px] rounded-full bg-[#181B25] text-white hover:bg-[#2a2f3a] font-aeonik text-[18px] font-normal">
        ✏️ Edit Profile
      </Button>

      {/* Skills Section */}
      <div className="mt-[35px] flex flex-col items-start gap-[20px]">
        <h3 className="text-[15px] font-normal text-[rgba(0,0,0,0.30)] font-inter-tight">
          Skills
        </h3>
        <div className="flex flex-wrap gap-[8px] w-full">
          {displayedSkills.map((skill, idx) => (
            <div
              key={idx}
              className="px-[13px] py-[12px] rounded-full bg-[#F5F5F5]"
            >
              <span className="text-[14px] font-normal text-black font-inter-tight">
                {skill}
              </span>
            </div>
          ))}
          {skillsRemaining > 0 && (
            <div className="px-[13px] py-[12px] rounded-full bg-[#F5F5F5]">
              <span className="text-[14px] font-normal text-black font-inter-tight">
                +{skillsRemaining}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Stack Section */}
      <div className="mt-[35px] flex flex-col items-start gap-[20px]">
        <h3 className="text-[15px] font-normal text-[rgba(0,0,0,0.30)] font-inter-tight">
          Stack
        </h3>
        <div className="flex flex-wrap gap-[8px] w-full">
          {displayedStack.map((tool, idx) => (
            <div
              key={idx}
              className="px-[13px] py-[10px] rounded-full bg-[#F5F5F5] flex items-center gap-[7px]"
            >
              <div className="w-[20px] h-[20px] rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex-shrink-0" />
              <span className="text-[14px] font-normal text-black font-inter-tight">
                {tool.name}
              </span>
            </div>
          ))}
          {stackRemaining > 0 && (
            <div className="px-[13px] py-[10px] rounded-full bg-[#F5F5F5]">
              <span className="text-[14px] font-normal text-black font-inter-tight">
                +{stackRemaining}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Social Links Section */}
      <div className="mt-[35px] flex flex-col items-start gap-[20px]">
        <h3 className="text-[15px] font-normal text-[rgba(0,0,0,0.30)] font-inter-tight">
          Social Links
        </h3>
        <div className="flex flex-col gap-[15px] w-full">
          {[
            { name: "Telegram", icon: "📱", url: socialLinks.telegram },
            { name: "X", icon: "𝕏", url: socialLinks.twitter },
            { name: "Instagram", icon: "📷", url: socialLinks.instagram },
            { name: "LinkendIn", icon: "in", url: socialLinks.linkedin },
          ].map((social, idx) => (
            <div key={idx} className="flex justify-between items-center w-full">
              <div className="flex items-center gap-[8px]">
                <span className="text-[15px] font-normal text-black font-inter-tight">
                  {social.name}
                </span>
              </div>
              <Link
                href={social.url || "#"}
                className="text-[#525866] hover:text-black transition-colors"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[22px] h-[22px]"
                >
                  <path
                    d="M10.1739 2.75C6.82897 2.75602 5.0774 2.83816 3.95801 3.95773C2.75 5.16593 2.75 7.11051 2.75 10.9996C2.75 14.8888 2.75 16.8334 3.95801 18.0415C5.16601 19.2498 7.11028 19.2498 10.9989 19.2498C14.8873 19.2498 16.8316 19.2498 18.0396 18.0415C19.1589 16.922 19.2411 15.1701 19.2471 11.8247"
                    stroke="currentColor"
                    strokeWidth="1.375"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M18.8432 3.20458L10.1282 11.9702M18.8432 3.20458C18.3904 2.75119 15.34 2.79345 14.6951 2.80262M18.8432 3.20458C19.296 3.65798 19.2538 6.71231 19.2446 7.35802"
                    stroke="currentColor"
                    strokeWidth="1.375"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
