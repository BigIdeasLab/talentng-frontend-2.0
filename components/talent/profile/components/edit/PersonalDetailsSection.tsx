"use client";

import { useRef, useState, useEffect } from "react";
import { SmoothCollapse } from "@/components/SmoothCollapse";
import { SectionHeader } from "./SectionHeader";
import { updateProfileImage } from "@/lib/api/talent";

interface PersonalData {
  firstName: string;
  lastName: string;
  bio: string;
  state: string;
  city: string;
  profileImageUrl: string;
}

interface PersonalDetailsSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  formData: PersonalData;
  onInputChange: (field: string, value: string) => void;
  sectionRef: (el: HTMLDivElement | null) => void;
  statesCities: Record<string, { major_cities: string[] }>;
  onNext: () => void;
  completionPercentage?: number;
}

export function PersonalDetailsSection({
  isOpen,
  onToggle,
  formData,
  onInputChange,
  sectionRef,
  statesCities,
  onNext,
  completionPercentage = 0,
}: PersonalDetailsSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const ringSize = 110;
  const strokeWidth = 2;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (completionPercentage / 100) * circumference;
  const ringColor =
    completionPercentage >= 100
      ? "#22C55E"
      : completionPercentage >= 70
        ? "#F59E0B"
        : completionPercentage >= 40
          ? "#F97316"
          : "#EF4444";

  const [animatedOffset, setAnimatedOffset] = useState(circumference);
  useEffect(() => {
    const timer = requestAnimationFrame(() =>
      setAnimatedOffset(strokeDashoffset),
    );
    return () => cancelAnimationFrame(timer);
  }, [strokeDashoffset]);

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await updateProfileImage(file);
      if (
        response.profileImageUrl !== null &&
        response.profileImageUrl !== undefined
      ) {
        onInputChange("profileImageUrl", response.profileImageUrl);
      }
    } catch (error) {
      console.error("Failed to upload profile image:", error);
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div
      ref={sectionRef}
      className="border border-[#E1E4EA] rounded-[16px] bg-white"
    >
      <SectionHeader
        title="Personal Details"
        isOpen={isOpen}
        onToggle={onToggle}
      />

      <SmoothCollapse isOpen={isOpen}>
        <>
          <div className="h-[1px] bg-[#E1E4EA]" />
          <div className="px-[16px] py-[18px] flex flex-col gap-[16px]">
            {/* Profile Picture */}
            <div
              className="relative"
              style={{ width: ringSize, height: ringSize }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
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
              <button
                type="button"
                onClick={handleProfileImageClick}
                disabled={isUploading}
                className="absolute rounded-full cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-50"
                title="Click to change profile picture"
                style={{
                  top: strokeWidth + 4,
                  left: strokeWidth + 4,
                  width: ringSize - (strokeWidth + 4) * 2,
                  height: ringSize - (strokeWidth + 4) * 2,
                }}
              >
                <img
                  src={formData.profileImageUrl || "/logo.png"}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              </button>
              <div
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-medium text-white font-inter-tight"
                style={{ backgroundColor: ringColor }}
              >
                {completionPercentage}%
              </div>
            </div>

            {/* Name Fields */}
            <div className="flex gap-[10px]">
              <div className="flex-1 flex flex-col gap-[10px]">
                <label className="text-[13px] font-normal text-black font-inter-tight">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => onInputChange("firstName", e.target.value)}
                  className="h-[48px] px-[12px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                />
              </div>

              <div className="flex-1 flex flex-col gap-[10px]">
                <label className="text-[13px] font-normal text-black font-inter-tight">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => onInputChange("lastName", e.target.value)}
                  className="h-[48px] px-[12px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-[10px]">
              <label className="text-[13px] font-normal text-black font-inter-tight">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => onInputChange("bio", e.target.value)}
                placeholder="Tell us about yourself"
                className="min-h-[100px] px-[12px] py-[12px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent resize-none"
              />
            </div>

            {/* State and City */}
            <div className="flex gap-[10px]">
              <div className="flex-1 flex flex-col gap-[10px]">
                <label className="text-[13px] font-normal text-black font-inter-tight">
                  State
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => onInputChange("state", e.target.value)}
                  className="h-[48px] px-[12px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                >
                  <option value="">Select State</option>
                  {Object.keys(statesCities).map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 flex flex-col gap-[10px]">
                <label className="text-[13px] font-normal text-black font-inter-tight">
                  City
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => onInputChange("city", e.target.value)}
                  className="h-[48px] px-[12px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                >
                  <option value="">Select City</option>
                  {formData.state &&
                    statesCities[formData.state]?.major_cities?.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Next Button */}
            <div className="flex justify-end">
              <button
                onClick={onNext}
                className="h-[44px] px-[32px] rounded-full bg-[#181B25] text-white hover:bg-[#2a2f3a] font-inter-tight text-[13px] font-normal"
              >
                Next
              </button>
            </div>
          </div>
        </>
      </SmoothCollapse>
    </div>
  );
}
