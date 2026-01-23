"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SmoothCollapse } from "@/components/SmoothCollapse";
import { SectionHeader } from "@/components/talent/profile/components/edit/SectionHeader";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import { getCurrentRecruiterProfile } from "@/lib/api/recruiter";
import statesCities from "@/lib/data/states-cities.json";

interface EmployerFormData {
  personal: {
    profileImageUrl: string;
    company: string;
    bio: string;
    state: string;
    city: string;
  };
  professional: {
    industry: string;
    website: string;
    size: string;
    stage: string;
    operatingModel: string;
  };
  social: {
    linkedin: string;
  };
}

const DEFAULT_EMPLOYER_DATA: EmployerFormData = {
  personal: {
    profileImageUrl: "",
    company: "",
    bio: "",
    state: "",
    city: "",
  },
  professional: {
    industry: "",
    website: "",
    size: "",
    stage: "",
    operatingModel: "",
  },
  social: {
    linkedin: "",
  },
};

interface EditProfileSidebarProps {
  expandedSection: string;
  onToggleSection: (section: string) => void;
}

const employerSections = [
  { id: "personal", label: "Personal Details" },
  { id: "professional", label: "Company Details" },
  { id: "social", label: "Social Links" },
];

function EditProfileSidebar({
  expandedSection,
  onToggleSection,
}: EditProfileSidebarProps) {
  return (
    <div className="w-[250px] flex flex-col items-start gap-[35px] px-5 pt-[20px] border-r border-[#E1E4EA]">
      <h1 className="text-[20px] font-semibold text-black font-inter-tight">
        Edit Profile
      </h1>

      <div className="flex flex-col items-start gap-[22px] w-full">
        {employerSections.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => onToggleSection(id)}
            className={cn(
              "text-[14px] font-normal font-inter-tight transition-colors",
              expandedSection === id ? "text-[#5C30FF]" : "text-[#525866]",
              id === "personal" && "font-medium",
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function EditProfileActionBar({
  onSave,
  isLoading,
}: {
  onSave: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="h-[56px] border-b border-[#E1E4EA] flex items-center justify-end px-[80px] gap-2 bg-white">
      <Link href="/profile">
        <Button
          variant="outline"
          disabled={isLoading}
          className="h-[40px] px-[24px] rounded-full border border-[#F5F5F5] bg-[#F5F5F5] text-black hover:bg-[#e5e5e5] disabled:opacity-50 disabled:cursor-not-allowed font-inter-tight text-[13px] font-normal"
        >
          Discard
        </Button>
      </Link>
      <Button
        onClick={onSave}
        disabled={isLoading}
        className="h-[40px] px-[24px] rounded-full bg-[#5C30FF] text-white hover:bg-[#4a26cc] disabled:opacity-50 disabled:cursor-not-allowed font-inter-tight text-[13px] font-normal"
      >
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}

function PersonalDetailsSection({
  isOpen,
  onToggle,
  formData,
  onInputChange,
  sectionRef,
  fileInputRef,
  isUploading,
  onFileChange,
}: {
  isOpen: boolean;
  onToggle: () => void;
  formData: EmployerFormData["personal"];
  onInputChange: (field: string, value: string) => void;
  sectionRef: (el: HTMLDivElement | null) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  isUploading: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}) {
  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
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
            <div className="relative w-[90px] h-[90px]">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onFileChange}
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
                  src={formData.profileImageUrl || "/logo.png"}
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

            {/* Company Name */}
            <div className="flex flex-col gap-[10px]">
              <label className="text-[13px] font-normal text-black font-inter-tight">
                Company Name
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => onInputChange("company", e.target.value)}
                placeholder="e.g., Tech Talents Inc"
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
                placeholder="Tell us about your company"
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
                    statesCities[
                      formData.state as keyof typeof statesCities
                    ]?.major_cities?.map((city) => (
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
                onClick={() => {}}
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

function CompanyDetailsSection({
  isOpen,
  onToggle,
  formData,
  onInputChange,
  sectionRef,
}: {
  isOpen: boolean;
  onToggle: () => void;
  formData: EmployerFormData["professional"];
  onInputChange: (field: string, value: string) => void;
  sectionRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div
      ref={sectionRef}
      className="border border-[#E1E4EA] rounded-[16px] bg-white"
    >
      <SectionHeader
        title="Company Details"
        isOpen={isOpen}
        onToggle={onToggle}
      />

      <SmoothCollapse isOpen={isOpen}>
        <>
          <div className="h-[1px] bg-[#E1E4EA]" />
          <div className="px-[16px] py-[18px] flex flex-col gap-[16px]">
            {/* Industry */}
            <div className="flex flex-col gap-[10px]">
              <label className="text-[13px] font-normal text-black font-inter-tight">
                Industry
              </label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => onInputChange("industry", e.target.value)}
                placeholder="e.g., Technology, Legal Services, etc."
                className="px-[12px] py-[18px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
              />
            </div>

            {/* Company Size and Stage */}
            <div className="flex gap-[10px]">
              <div className="flex-1 flex flex-col gap-[10px]">
                <label className="text-[13px] font-normal text-black font-inter-tight">
                  Company Size
                </label>
                <select
                  value={formData.size}
                  onChange={(e) => onInputChange("size", e.target.value)}
                  className="h-[48px] px-[12px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                >
                  <option value="">Select size</option>
                  <option value="1-10 employees">1-10 employees</option>
                  <option value="11-50 employees">11-50 employees</option>
                  <option value="51-200 employees">51-200 employees</option>
                  <option value="201-500 employees">201-500 employees</option>
                  <option value="500+ employees">500+ employees</option>
                </select>
              </div>

              <div className="flex-1 flex flex-col gap-[10px]">
                <label className="text-[13px] font-normal text-black font-inter-tight">
                  Company Stage
                </label>
                <select
                  value={formData.stage}
                  onChange={(e) => onInputChange("stage", e.target.value)}
                  className="h-[48px] px-[12px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                >
                  <option value="">Select stage</option>
                  <option value="Seed">Seed</option>
                  <option value="Series A">Series A</option>
                  <option value="Series B">Series B</option>
                  <option value="Series C">Series C</option>
                  <option value="Established">Established</option>
                </select>
              </div>
            </div>

            {/* Website */}
            <div className="flex flex-col gap-[10px]">
              <label className="text-[13px] font-normal text-black font-inter-tight">
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => onInputChange("website", e.target.value)}
                placeholder="https://example.com"
                className="px-[12px] py-[18px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
              />
            </div>

            {/* Operating Model */}
            <div className="flex flex-col gap-[10px]">
              <label className="text-[13px] font-normal text-black font-inter-tight">
                Operating Model
              </label>
              <select
                value={formData.operatingModel}
                onChange={(e) =>
                  onInputChange("operatingModel", e.target.value)
                }
                className="px-[12px] py-[18px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
              >
                <option value="">Select operating model</option>
                <option value="Fully Remote">Fully Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            {/* Next Button */}
            <div className="flex justify-end">
              <button
                onClick={() => {}}
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

function SocialLinksSection({
  isOpen,
  onToggle,
  formData,
  onInputChange,
  sectionRef,
}: {
  isOpen: boolean;
  onToggle: () => void;
  formData: EmployerFormData["social"];
  onInputChange: (field: string, value: string) => void;
  sectionRef: (el: HTMLDivElement | null) => void;
}) {
  const socialPlatforms = [
    {
      name: "Dribbble",
      key: "dribbble",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8.00065 14.6663C11.6825 14.6663 14.6673 11.6816 14.6673 7.99967C14.6673 4.31778 11.6825 1.33301 8.00065 1.33301C4.31875 1.33301 1.33398 4.31778 1.33398 7.99967C1.33398 11.6816 4.31875 14.6663 8.00065 14.6663Z"
            stroke="black"
            strokeOpacity="0.3"
          />
          <path
            d="M14.6667 8.84277C14.0488 8.7269 13.4133 8.6665 12.7648 8.6665C9.19653 8.6665 6.0229 10.4948 4 13.3332"
            stroke="black"
            strokeOpacity="0.3"
            strokeLinejoin="round"
          />
          <path
            d="M12.6673 3.33301C10.581 5.77795 7.44592 7.33301 3.9404 7.33301C3.04356 7.33301 2.17097 7.23121 1.33398 7.03881"
            stroke="black"
            strokeOpacity="0.3"
            strokeLinejoin="round"
          />
          <path
            d="M9.74455 14.6667C9.91162 13.8573 9.99935 13.0191 9.99935 12.1605C9.99935 7.9498 7.88888 4.23097 4.66602 2"
            stroke="black"
            strokeOpacity="0.3"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      name: "Telegram",
      key: "telegram",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M7.99092 10.2722L10.1519 12.7291C10.9525 13.6393 11.3528 14.0944 11.7718 13.9836C12.1908 13.8728 12.3345 13.2739 12.6219 12.0759L14.2159 5.4306C14.6585 3.58555 14.8798 2.66303 14.3879 2.208C13.896 1.75298 13.0433 2.0915 11.3381 2.76855L3.42649 5.90966C2.06261 6.45116 1.38066 6.72193 1.33737 7.1872C1.33293 7.2348 1.33286 7.28273 1.33715 7.33033C1.37901 7.7958 2.06013 8.06887 3.42235 8.61487C4.03957 8.86227 4.34819 8.986 4.56945 9.22293C4.59433 9.24953 4.61825 9.27713 4.64117 9.3056C4.84504 9.55893 4.93205 9.8914 5.10604 10.5563L5.43167 11.8007C5.60099 12.4477 5.68565 12.7712 5.90737 12.8153C6.1291 12.8594 6.32215 12.5911 6.70825 12.0546L7.99092 10.2722ZM7.99092 10.2722L7.77905 10.0514C7.53792 9.80006 7.41739 9.67447 7.41739 9.51833C7.41739 9.3622 7.53792 9.23653 7.77905 8.9852L10.1611 6.50273"
            stroke="#525866"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      name: "X",
      key: "twitter",
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
      key: "instagram",
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
      key: "linkedin",
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
  ];

  return (
    <div
      ref={sectionRef}
      className="border border-[#E1E4EA] rounded-[16px] bg-white"
    >
      <SectionHeader title="Social Links" isOpen={isOpen} onToggle={onToggle} />

      <SmoothCollapse isOpen={isOpen}>
        <>
          <div className="h-[1px] bg-[#E1E4EA]" />
          <div className="px-[16px] py-[18px] flex flex-col gap-[16px]">
            {socialPlatforms.map((platform) => (
              <div key={platform.key} className="flex flex-col gap-[10px]">
                <label className="text-[13px] font-normal text-black font-inter-tight">
                  {platform.name}
                </label>
                <div className="px-[12px] py-[18px] flex items-center gap-[10px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px]">
                  {platform.icon}
                  <input
                    type="text"
                    placeholder="Paste Link Here"
                    value={
                      formData[platform.key as keyof typeof formData] || ""
                    }
                    onChange={(e) =>
                      onInputChange(platform.key, e.target.value)
                    }
                    className="flex-1 text-[13px] font-normal font-inter-tight placeholder:text-black/30 border-0 focus:outline-none bg-transparent"
                  />
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() => {}}
                className="h-[44px] px-[32px] rounded-full bg-[#181B25] text-white hover:bg-[#2a2f3a] font-inter-tight text-[13px] font-normal"
              >
                Next
              </Button>
            </div>
          </div>
        </>
      </SmoothCollapse>
    </div>
  );
}

export function EmployerEditProfile() {
  const router = useRouter();
  const [expandedSection, setExpandedSection] = useState<string>("personal");
  const [formData, setFormData] = useState<EmployerFormData>(
    DEFAULT_EMPLOYER_DATA,
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch recruiter profile data
  useEffect(() => {
    const fetchRecruiterProfile = async () => {
      setIsLoading(true);
      try {
        const profile = await getCurrentRecruiterProfile();
        console.log("Fetched recruiter profile:", profile);

        // Map API response to form data
        setFormData({
          personal: {
            profileImageUrl: profile.profileImageUrl || "",
            company: profile.companyName || "",
            bio: profile.bio || "",
            state: profile.location?.split(",")[0]?.trim() || "",
            city: profile.location?.split(",")[1]?.trim() || "",
          },
          professional: {
            industry: profile.industry || "",
            website: profile.companyWebsite || "",
            size: profile.companySize || "",
            stage: profile.companyStage || "",
            operatingModel: profile.operatingModel || "",
          },
          social: {
            linkedin: "",
          },
        });
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error("Failed to fetch recruiter profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecruiterProfile();
  }, []);

  // Warn on page leave
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? "" : section);

    setTimeout(() => {
      const element = sectionRefs.current[section];
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 0);
  };

  const handlePersonalInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value,
      },
    }));
    setHasUnsavedChanges(true);
  };

  const handleProfileImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // TODO: Replace with actual API call to upload image
      // const response = await updateRecruiterProfileImage(file);
      // if (response.profileImageUrl) {
      //   onInputChange("profileImageUrl", response.profileImageUrl);
      // }
    } catch (error) {
      console.error("Failed to upload profile image:", error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleProfessionalInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      professional: {
        ...prev.professional,
        [field]: value,
      },
    }));
    setHasUnsavedChanges(true);
  };

  const handleSocialInputChange = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      social: {
        ...prev.social,
        [platform]: value,
      },
    }));
    setHasUnsavedChanges(true);
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // await updateRecruiterProfile(formData);

      setModalMessage("Profile saved successfully!");
      setIsSuccess(true);
      setModalOpen(true);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      setModalMessage("Failed to save profile. Please try again.");
      setIsSuccess(false);
      setModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <EditProfileSidebar
        expandedSection={expandedSection}
        onToggleSection={toggleSection}
      />

      <div className="flex-1 flex flex-col">
        <EditProfileActionBar
          onSave={handleSaveProfile}
          isLoading={isLoading}
        />

        <div className="flex-1 overflow-y-auto scrollbar-styled px-[80px] pt-[25px] pb-6">
          <div className="max-w-[700px] mx-auto flex flex-col gap-[12px]">
            <PersonalDetailsSection
              isOpen={expandedSection === "personal"}
              onToggle={() => toggleSection("personal")}
              formData={formData.personal}
              onInputChange={handlePersonalInputChange}
              fileInputRef={fileInputRef}
              isUploading={isUploading}
              onFileChange={handleProfileImageUpload}
              sectionRef={(el) => {
                if (el) sectionRefs.current["personal"] = el;
              }}
            />

            <CompanyDetailsSection
              isOpen={expandedSection === "professional"}
              onToggle={() => toggleSection("professional")}
              formData={formData.professional}
              onInputChange={handleProfessionalInputChange}
              sectionRef={(el) => {
                if (el) sectionRefs.current["professional"] = el;
              }}
            />

            <SocialLinksSection
              isOpen={expandedSection === "social"}
              onToggle={() => toggleSection("social")}
              formData={formData.social}
              onInputChange={handleSocialInputChange}
              sectionRef={(el) => {
                if (el) sectionRefs.current["social"] = el;
              }}
            />
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isSuccess ? "Success" : "Error"}
        description={modalMessage}
        size="sm"
        footer={
          <button
            onClick={() => setModalOpen(false)}
            className={`px-4 py-2 rounded-lg font-medium text-white transition-colors ${
              isSuccess
                ? "bg-[#5C30FF] hover:bg-[#4a26cc]"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {isSuccess ? "Okay" : "Try Again"}
          </button>
        }
      />
    </div>
  );
}
