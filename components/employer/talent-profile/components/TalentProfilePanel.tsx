"use client";

import { MapPin, Briefcase, Users, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { TalentProfile } from "@/lib/api/talent/types";

interface TalentProfilePanelProps {
  profile: TalentProfile;
  completionPercentage?: number;
  socialLinks?: {
    telegram?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  onHireClick?: () => void;
}

export function TalentProfilePanel({
  profile,
  completionPercentage = 0,
  socialLinks,
  onHireClick,
}: TalentProfilePanelProps) {
  const displayedSkills = profile.skills?.slice(0, 4) || [];
  const skillsRemaining = Math.max(0, (profile.skills?.length || 0) - 4);
  const displayedStack = profile.stack?.slice(0, 5) || [];
  const stackRemaining = Math.max(0, (profile.stack?.length || 0) - 5);

  return (
    <div className="w-full lg:w-[350px] flex-shrink-0 lg:border-r border-[#E1E4EA] bg-white flex flex-col lg:overflow-hidden">
      <div className="flex-1 lg:overflow-y-auto scrollbar-hidden px-[25px] py-[15px]">
        {/* User Profile Section */}
        <div className="flex flex-col items-center gap-[20px]">
          {/* Profile Picture */}
          <div className="relative w-[110px] h-[110px]">
            <img
              src={(() => {
                const rawUrl = profile.profileImageUrl || "";
                return rawUrl && !rawUrl.includes("builder.io")
                  ? rawUrl
                  : "/default.png";
              })()}
              alt={profile.fullName || "Profile"}
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          {/* User Info */}
          <div className="flex flex-col items-center gap-[12px] w-full">
            <div className="text-center">
              <h2 className="text-[16px] font-medium text-black font-inter-tight">
                {profile.fullName || "User"}
              </h2>
              {profile.headline && (
                <p className="text-[13px] font-light text-[rgba(0,0,0,0.30)] font-inter-tight">
                  {profile.headline}
                </p>
              )}
            </div>

            {/* Details Container */}
            <div className="flex flex-col items-start gap-[10px] w-full">
              {/* Location */}
              {profile.location && (
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-[6px]">
                    <MapPin className="w-[18px] h-[18px] text-[#525866]" />
                    <span className="text-[12px] font-normal text-black font-inter-tight">
                      {profile.location}
                    </span>
                  </div>
                </div>
              )}

              {/* Job Type */}
              {profile.category && (
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-[6px]">
                    <Briefcase className="w-[18px] h-[18px] text-[#525866]" />
                    <span className="text-[12px] font-normal text-black font-inter-tight">
                      {profile.category}
                    </span>
                  </div>
                </div>
              )}

              {/* Hired Count */}
              {(profile.hiredCount !== undefined ||
                profile.stats?.hired !== undefined) && (
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-[6px]">
                    <Users className="w-[18px] h-[18px] text-[#525866]" />
                    <span className="text-[12px] font-normal text-black font-inter-tight">
                      {profile.hiredCount || profile.stats?.hired || 0}x Hired
                    </span>
                  </div>
                </div>
              )}

              {/* Profile Views */}
              {(profile.views !== undefined ||
                profile.stats?.views !== undefined) && (
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-[6px]">
                    <Eye className="w-[18px] h-[18px] text-[#525866]" />
                    <span className="text-[12px] font-normal text-black font-inter-tight">
                      {profile.views || profile.stats?.views || 0} Views
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hire Button - Touch-friendly with 44px minimum height */}
        <button
          onClick={onHireClick}
          className="w-full mt-[20px] px-6 py-3 min-h-[44px] rounded-full bg-[#181B25] hover:bg-[#2a2f3a] transition-colors text-white text-[14px] font-medium font-inter-tight flex items-center justify-center gap-2"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.5 3.75C2.5 2.92157 3.17157 2.25 4 2.25H12C12.8284 2.25 13.5 2.92157 13.5 3.75V10C13.5 10.8284 12.8284 11.5 12 11.5H5L2.5 13.5V3.75Z"
              fill="white"
            />
            <path
              d="M7.5 15.75C7.5 14.9116 8.17157 14.25 9 14.25H17C17.8284 14.25 18.5 14.9116 18.5 15.75V22C18.5 22.8284 17.8284 23.5 17 23.5H10L7.5 25.5V15.75Z"
              fill="white"
              opacity="0.5"
            />
          </svg>
          Hire {profile.fullName?.split(" ")[0] || "Talent"}
        </button>

        {/* Skills Section */}
        {displayedSkills.length > 0 && (
          <div className="mt-[20px] flex flex-col items-start gap-[12px] flex-shrink-0">
            <h3 className="text-[12px] font-normal text-[rgba(0,0,0,0.30)] font-inter-tight">
              Skills
            </h3>
            <div className="flex flex-wrap gap-[6px] w-full">
              {displayedSkills.map((skill, idx) => (
                <div
                  key={idx}
                  className="px-[10px] py-[6px] rounded-full bg-[#F5F5F5]"
                >
                  <span className="text-[11px] font-normal text-black font-inter-tight">
                    {skill}
                  </span>
                </div>
              ))}
              {skillsRemaining > 0 && (
                <div className="px-[10px] py-[6px] rounded-full bg-[#F5F5F5]">
                  <span className="text-[11px] font-normal text-black font-inter-tight">
                    +{skillsRemaining}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stack Section */}
        {displayedStack.length > 0 && (
          <div className="mt-[20px] flex flex-col items-start gap-[12px] flex-shrink-0">
            <h3 className="text-[12px] font-normal text-[rgba(0,0,0,0.30)] font-inter-tight">
              Stack
            </h3>
            <div className="flex flex-wrap gap-[6px] w-full">
              {displayedStack.map((tool, idx) => (
                <div
                  key={idx}
                  className="px-[10px] py-[7px] rounded-full bg-[#F5F5F5] flex items-center gap-[5px]"
                >
                  <div className="w-[16px] h-[16px] rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex-shrink-0" />
                  <span className="text-[11px] font-normal text-black font-inter-tight">
                    {typeof tool === "string"
                      ? tool
                      : (tool as any)?.name || "Unknown"}
                  </span>
                </div>
              ))}
              {stackRemaining > 0 && (
                <div className="px-[10px] py-[7px] rounded-full bg-[#F5F5F5]">
                  <span className="text-[11px] font-normal text-black font-inter-tight">
                    +{stackRemaining}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Social Links Section */}
        {socialLinks && Object.values(socialLinks).some(Boolean) && (
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
              ]
                .filter(
                  (
                    social,
                  ): social is { name: string; icon: string; url: string } =>
                    !!social.url,
                )
                .map((social, idx) => (
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
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
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
    </div>
  );
}
