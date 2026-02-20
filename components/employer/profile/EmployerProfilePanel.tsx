"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Briefcase,
  Users,
  DollarSign,
  Mail,
  Linkedin,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface EmployerProfilePanelProps {
  company?: {
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
  views?: number;
  visibility?: "public" | "private";
}

export function EmployerProfilePanel({
  company = {
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
  views = 0,
  visibility = "public",
}: EmployerProfilePanelProps) {
  const completeness = completionPercentage ?? 0;
  const ringSize = 110;
  const strokeWidth = 2;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completeness / 100) * circumference;
  const ringColor =
    completeness >= 100
      ? "#22C55E"
      : completeness >= 70
        ? "#F59E0B"
        : completeness >= 40
          ? "#F97316"
          : "#EF4444";

  const [animatedOffset, setAnimatedOffset] = useState(circumference);
  useEffect(() => {
    const timer = requestAnimationFrame(() => setAnimatedOffset(strokeDashoffset));
    return () => cancelAnimationFrame(timer);
  }, [strokeDashoffset]);

  return (
    <div className="hidden lg:flex w-[350px] flex-col bg-white border-r border-[#E1E4EA] px-[25px] py-[15px] overflow-y-auto h-screen scrollbar-hide">
      {/* Company Profile Section */}
      <div className="flex flex-col items-center gap-[20px]">
        {/* Company Logo with Completion Ring */}
        <div className="relative" style={{ width: ringSize, height: ringSize }}>
          <svg
            width={ringSize}
            height={ringSize}
            className="absolute inset-0 -rotate-90"
          >
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={radius}
              fill="none"
              stroke="#E1E4EA"
              strokeWidth={strokeWidth}
            />
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={radius}
              fill="none"
              stroke={ringColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={animatedOffset}
              className="transition-all duration-500"
            />
          </svg>
          <img
            src={company?.logo || "/placeholder.svg"}
            alt={company?.name || "Company"}
            className="absolute rounded-full object-cover"
            style={{
              top: strokeWidth + 4,
              left: strokeWidth + 4,
              width: ringSize - (strokeWidth + 4) * 2,
              height: ringSize - (strokeWidth + 4) * 2,
            }}
          />
          <div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-medium text-white font-inter-tight"
            style={{ backgroundColor: ringColor }}
          >
            {completeness}%
          </div>
        </div>

        {/* Company Info */}
        <div className="flex flex-col items-center gap-[12px] w-full">
          <div className="text-center">
            <h2 className="text-[16px] font-medium text-black font-inter-tight">
              {company?.name || "Company Name"}
            </h2>
            {company?.tagline && (
              <p className="text-[13px] font-light text-[rgba(0,0,0,0.30)] font-inter-tight">
                {company.tagline}
              </p>
            )}
          </div>

          {/* Details Container */}
          <div className="flex flex-col items-start gap-[10px] w-full">
            {/* Location */}
            {company?.location && (
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-[6px]">
                  <MapPin className="w-[18px] h-[18px] text-[#525866]" />
                  <span className="text-[12px] font-normal text-black font-inter-tight">
                    {company.location}
                  </span>
                </div>
              </div>
            )}

            {/* Jobs Posted */}
            {stats?.jobsPosted !== undefined && (
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-[6px]">
                  <Briefcase className="w-[18px] h-[18px] text-[#525866]" />
                  <span className="text-[12px] font-normal text-black font-inter-tight">
                    {stats.jobsPosted} Jobs Posted
                  </span>
                </div>
              </div>
            )}

            {/* Talents Hired */}
            {stats?.talentsHired !== undefined && (
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-[6px]">
                  <Users className="w-[18px] h-[18px] text-[#525866]" />
                  <span className="text-[12px] font-normal text-black font-inter-tight">
                    {stats.talentsHired} Talents Hired
                  </span>
                </div>
              </div>
            )}

            {/* Profile Views */}
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-1.5">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.83 11C1.83 11 4.58 4.58 11 4.58C17.42 4.58 20.17 11 20.17 11C20.17 11 17.42 17.42 11 17.42C4.58 17.42 1.83 11 1.83 11Z"
                    stroke="#525866"
                    strokeWidth="1.375"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="11"
                    cy="11"
                    r="2.75"
                    stroke="#525866"
                    strokeWidth="1.375"
                  />
                </svg>
                <span className="text-[13px] font-normal text-black font-inter-tight">
                  {views} Profile Views
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Button */}
      <Link href="/profile/edit" className="w-full mt-[15px]">
        <Button className="w-full h-[40px] rounded-full bg-[#181B25] text-white hover:bg-[#2a2f3a] font-aeonik text-[14px] font-normal flex-shrink-0">
          ✏️ Edit Profile
        </Button>
      </Link>

      {/* Visibility Toggle */}
      <div className="flex justify-between items-center w-full mt-[10px]">
        <div className="flex flex-col">
          <span className="text-[13px] font-normal text-black font-inter-tight">
            Profile Visibility
          </span>
          <span className="text-[11px] text-[rgba(0,0,0,0.30)] font-inter-tight">
            {visibility === "public"
              ? "Visible to everyone"
              : "Hidden from search"}
          </span>
        </div>
        <Switch
          checked={visibility === "public"}
          // TODO: Add toggle handler
        />
      </div>

      {/* Social Links Section */}
      {socialLinks && (
        <div className="mt-[20px] flex flex-col items-start gap-[12px] flex-shrink-0">
          <h3 className="text-[12px] font-normal text-[rgba(0,0,0,0.30)] font-inter-tight">
            Social Links
          </h3>
          <div className="flex flex-col gap-[10px] w-full">
            {[
              { name: "Telegram", icon: "📱", url: socialLinks?.telegram },
              { name: "X", icon: "𝕏", url: socialLinks?.twitter },
              { name: "Instagram", icon: "📷", url: socialLinks?.instagram },
              { name: "LinkedIn", icon: "in", url: socialLinks?.linkedin },
            ].map((social, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center w-full"
              >
                <div className="flex items-center gap-[6px]">
                  <span className="text-[12px] font-normal text-black font-inter-tight">
                    {social.name}
                  </span>
                </div>
                <Link
                  href={social.url || "#"}
                  className="text-[#525866] hover:text-black transition-colors"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-[18px] h-[18px]"
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
      )}
    </div>
  );
}
