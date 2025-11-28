"use client";

import { useRef, useState } from "react";
import { SmoothCollapse } from "@/components/SmoothCollapse";
import { SectionHeader } from "./SectionHeader";
import { updateProfileImage } from "@/lib/api/talent";

interface PersonalData {
  firstName: string;
  lastName: string;
  headline: string;
  bio: string;
  phoneNumber: string;
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
}

export function PersonalDetailsSection({
  isOpen,
  onToggle,
  formData,
  onInputChange,
  sectionRef,
  statesCities,
}: PersonalDetailsSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

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
      if (response.profileImageUrl !== null && response.profileImageUrl !== undefined) {
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
      <SectionHeader title="Personal Details" isOpen={isOpen} onToggle={onToggle} />

      <SmoothCollapse isOpen={isOpen}>
        <>
          <div className="h-[1px] bg-[#E1E4EA]" />
          <div className="px-[16px] py-[18px] flex flex-col gap-[16px]">
            {/* Profile Picture */}
              <div className="relative w-[90px] h-[90px]">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={handleProfileImageClick}
                  disabled={isUploading}
                  className="absolute inset-0 w-full h-full rounded-full cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-50"
                  title="Click to change profile picture"
                >
                  <img
                    src={formData.profileImageUrl || "/lucas-gouvea.jpg"}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full p-2"
                  />
                </button>
              <svg
                width="110"
                height="110"
                viewBox="0 0 110 110"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 w-full h-full pointer-events-none"
              >
                <circle
                  cx="55"
                  cy="55"
                  r="54"
                  stroke="#E63C23"
                  strokeWidth="2"
                  strokeOpacity="0.2"
                />
                <path
                  d="M55 1C62.0914 1 69.1133 2.39675 75.6649 5.1105C82.2165 7.82426 88.1694 11.8019 93.1838 16.8162C98.1981 21.8306 102.176 27.7835 104.889 34.3351C107.603 40.8867 109 47.9086 109 55"
                  stroke="#E63C23"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
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

            {/* Headline */}
            <div className="flex flex-col gap-[10px]">
              <label className="text-[13px] font-normal text-black font-inter-tight">
                Headline
              </label>
              <input
                type="text"
                value={formData.headline}
                onChange={(e) => onInputChange("headline", e.target.value)}
                className="px-[12px] py-[18px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
              />
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

            {/* Phone Number */}
             <div className="flex flex-col gap-[10px]">
               <label className="text-[13px] font-normal text-black font-inter-tight">
                 Phone Number
               </label>
               <input
                 type="tel"
                 value={formData.phoneNumber}
                 onChange={(e) => onInputChange("phoneNumber", e.target.value)}
                 placeholder="+234 (0) 703 456 7890"
                 className="px-[12px] py-[18px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
               />
             </div>

            {/* Profile Image URL */}
             <div className="flex flex-col gap-[10px]">
               <label className="text-[13px] font-normal text-black font-inter-tight">
                 Profile Image URL
               </label>
               <input
                 type="url"
                 value={formData.profileImageUrl}
                 onChange={(e) => onInputChange("profileImageUrl", e.target.value)}
                 placeholder="https://images.example.com/avatars/your-profile.jpg"
                 className="px-[12px] py-[18px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
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
              <button className="h-[44px] px-[32px] rounded-full bg-[#181B25] text-white hover:bg-[#2a2f3a] font-inter-tight text-[13px] font-normal">
                Next
              </button>
            </div>
          </div>
        </>
      </SmoothCollapse>
    </div>
  );
}
