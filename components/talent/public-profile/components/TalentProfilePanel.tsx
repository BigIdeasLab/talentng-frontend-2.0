"use client";

import { MapPin, Briefcase, Users, DollarSign, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TalentProfile } from "@/lib/api/talent/types";

interface TalentProfilePanelProps {
  profile: TalentProfile;
}

export function TalentProfilePanel({ profile }: TalentProfilePanelProps) {
  const displayedSkills = profile.skills?.slice(0, 4) || [];
  const skillsRemaining = Math.max(0, (profile.skills?.length || 0) - 4);
  const displayedStack = profile.stack?.slice(0, 5) || [];
  const stackRemaining = Math.max(0, (profile.stack?.length || 0) - 5);

  return (
    <div className="hidden lg:flex w-[350px] flex-col bg-white border-r border-[#E1E4EA] px-[25px] py-[15px] overflow-y-auto h-screen scrollbar-hide">
      {/* User Profile Section */}
      <div className="flex flex-col items-center gap-[20px]">
        {/* Profile Picture */}
        <div className="w-[110px] h-[110px]">
          <img
            src={profile.profileImageUrl || "/default-avatar.jpg"}
            alt={profile.fullName || "Talent"}
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        {/* Name and Headline */}
        <div className="flex flex-col items-center gap-[8px] text-center">
          <h1 className="text-[18px] font-semibold text-black">
            {profile.fullName || "Talent"}
          </h1>
          <p className="text-[14px] text-gray-600">{profile.headline}</p>
        </div>

        {/* Location */}
        {profile.location && (
          <div className="flex items-center gap-[6px] text-[13px] text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{profile.location}</span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-[16px] w-full border-y border-[#E1E4EA] py-[16px]">
          <div className="flex flex-col items-center gap-[4px]">
            <DollarSign className="w-5 h-5 text-gray-600" />
            <p className="text-[12px] text-gray-600">Earnings</p>
            <p className="text-[14px] font-semibold text-black">
              ₦{profile.earnings || profile.stats?.earnings || "0"}
            </p>
          </div>
          <div className="flex flex-col items-center gap-[4px]">
            <Users className="w-5 h-5 text-gray-600" />
            <p className="text-[12px] text-gray-600">Times Hired</p>
            <p className="text-[14px] font-semibold text-black">
              {profile.hiredCount || profile.stats?.hired || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      {displayedSkills.length > 0 && (
        <div className="flex flex-col gap-[12px] mt-[20px]">
          <h3 className="text-[12px] font-semibold text-black uppercase">
            Skills
          </h3>
          <div className="flex flex-col gap-[8px]">
            {displayedSkills.map((skill) => (
              <div
                key={skill}
                className="px-[12px] py-[8px] bg-[#F5F5F5] rounded-full text-[12px] text-black"
              >
                {skill}
              </div>
            ))}
            {skillsRemaining > 0 && (
              <div className="px-[12px] py-[8px] bg-[#F5F5F5] rounded-full text-[12px] text-gray-600">
                +{skillsRemaining} more
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tech Stack Section */}
      {displayedStack.length > 0 && (
        <div className="flex flex-col gap-[12px] mt-[20px]">
          <h3 className="text-[12px] font-semibold text-black uppercase">
            Tech Stack
          </h3>
          <div className="flex flex-col gap-[8px]">
            {displayedStack.map((tech, idx) => (
              <div
                key={`tech-${idx}`}
                className="px-[12px] py-[8px] bg-[#F5F5F5] rounded-full text-[12px] text-black"
              >
                {typeof tech === "string" ? tech : (tech as any)?.name || "Unknown"}
              </div>
            ))}
            {stackRemaining > 0 && (
              <div className="px-[12px] py-[8px] bg-[#F5F5F5] rounded-full text-[12px] text-gray-600">
                +{stackRemaining} more
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-[8px] mt-auto pt-[20px]">
        <Button
          variant="default"
          size="lg"
          className="w-full bg-[#5C30FF] hover:bg-[#4A1FD9] text-white"
        >
          Hire Talent
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-full border-[#E1E4EA]"
        >
          Message
        </Button>
      </div>
    </div>
  );
}
