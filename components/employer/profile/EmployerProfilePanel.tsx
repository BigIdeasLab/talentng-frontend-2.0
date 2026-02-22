"use client";

import { useState, useEffect } from "react";
import { MapPin, Briefcase, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

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
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    website?: string;
  };
  completionPercentage?: number;
  views?: number;
  visibility?: "public" | "private";
  onVisibilityChange?: (visibility: "public" | "private") => void;
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
  onVisibilityChange,
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
    const timer = requestAnimationFrame(() =>
      setAnimatedOffset(strokeDashoffset),
    );
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
          onCheckedChange={(checked) =>
            onVisibilityChange?.(checked ? "public" : "private")
          }
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
              {
                name: "X",
                url: socialLinks?.twitter,
                icon: (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M2 14L7.03227 8.96773M7.03227 8.96773L2 2H5.33333L8.96773 7.03227M7.03227 8.96773L10.6667 14H14L8.96773 7.03227M14 2L8.96773 7.03227"
                      stroke="#525866"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
              },
              {
                name: "Instagram",
                url: socialLinks?.instagram,
                icon: (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M1.66602 8.00033C1.66602 5.01477 1.66602 3.52199 2.59351 2.59449C3.52101 1.66699 5.01379 1.66699 7.99935 1.66699C10.9849 1.66699 12.4777 1.66699 13.4052 2.59449C14.3327 3.52199 14.3327 5.01477 14.3327 8.00033C14.3327 10.9859 14.3327 12.4787 13.4052 13.4062C12.4777 14.3337 10.9849 14.3337 7.99935 14.3337C5.01379 14.3337 3.52101 14.3337 2.59351 13.4062C1.66602 12.4787 1.66602 10.9859 1.66602 8.00033Z"
                      stroke="#525866"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11 8C11 9.65687 9.65687 11 8 11C6.34315 11 5 9.65687 5 8C5 6.34315 6.34315 5 8 5C9.65687 5 11 6.34315 11 8Z"
                      stroke="#525866"
                    />
                    <path
                      d="M11.672 4.33301H11.666"
                      stroke="#525866"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
              },
              {
                name: "LinkedIn",
                url: socialLinks?.linkedin,
                icon: (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3.00065 6.33301H2.66732C2.03878 6.33301 1.72451 6.33301 1.52924 6.52827C1.33398 6.72354 1.33398 7.03781 1.33398 7.66634V13.333C1.33398 13.9615 1.33398 14.2758 1.52924 14.4711C1.72451 14.6663 2.03878 14.6663 2.66732 14.6663H3.00065C3.62919 14.6663 3.94346 14.6663 4.13872 14.4711C4.33398 14.2758 4.33398 13.9615 4.33398 13.333V7.66634C4.33398 7.03781 4.33398 6.72354 4.13872 6.52827C3.94346 6.33301 3.62919 6.33301 3.00065 6.33301Z"
                      stroke="#525866"
                    />
                    <path
                      d="M4.33398 2.83301C4.33398 3.66143 3.66241 4.33301 2.83398 4.33301C2.00556 4.33301 1.33398 3.66143 1.33398 2.83301C1.33398 2.00458 2.00556 1.33301 2.83398 1.33301C3.66241 1.33301 4.33398 2.00458 4.33398 2.83301Z"
                      stroke="#525866"
                    />
                    <path
                      d="M8.21798 6.33301H7.66732C7.03878 6.33301 6.72452 6.33301 6.52924 6.52827C6.33398 6.72354 6.33398 7.03781 6.33398 7.66634V13.333C6.33398 13.9615 6.33398 14.2758 6.52924 14.4711C6.72452 14.6663 7.03878 14.6663 7.66732 14.6663H8.00065C8.62918 14.6663 8.94345 14.6663 9.13872 14.4711C9.33398 14.2758 9.33398 13.9615 9.33398 13.333L9.33405 10.9997C9.33405 9.89521 9.68605 8.99974 10.7259 8.99974C11.2458 8.99974 11.6673 9.44747 11.6673 9.99974V12.9997C11.6673 13.6283 11.6673 13.9425 11.8626 14.1378C12.0578 14.3331 12.3721 14.3331 13.0007 14.3331H13.3331C13.9615 14.3331 14.2757 14.3331 14.471 14.1379C14.6663 13.9427 14.6663 13.6285 14.6665 13.0001L14.6674 9.33314C14.6674 7.67634 13.0916 6.33317 11.5319 6.33317C10.6439 6.33317 9.85178 6.76841 9.33405 7.44901C9.33398 7.02894 9.33398 6.81894 9.24278 6.66301C9.18498 6.56425 9.10272 6.48203 9.00398 6.42425C8.84805 6.33301 8.63805 6.33301 8.21798 6.33301Z"
                      stroke="#525866"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
              },
              {
                name: "Website",
                url: socialLinks?.website,
                icon: (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6.5" stroke="#525866" />
                    <path
                      d="M1.5 8H14.5"
                      stroke="#525866"
                      strokeLinecap="round"
                    />
                    <path
                      d="M8 1.5C9.65685 3.15685 10.6569 5.48568 10.6569 8C10.6569 10.5143 9.65685 12.8432 8 14.5C6.34315 12.8432 5.34315 10.5143 5.34315 8C5.34315 5.48568 6.34315 3.15685 8 1.5Z"
                      stroke="#525866"
                    />
                  </svg>
                ),
              },
            ].map((social, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center w-full"
              >
                <div className="flex items-center gap-[6px]">
                  {social.icon}
                  <span className="text-[12px] font-normal text-black font-inter-tight">
                    {social.name}
                  </span>
                </div>
                {social.url ? (
                  <Link
                    href={social.url}
                    target="_blank"
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
                ) : (
                  <Link
                    href="/profile/edit?section=social"
                    className="text-[10px] font-normal text-[#5C30FF] font-inter-tight hover:underline"
                  >
                    Add
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
