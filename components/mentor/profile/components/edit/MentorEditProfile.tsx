"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SmoothCollapse } from "@/components/SmoothCollapse";
import { SectionHeader } from "@/components/talent/profile/components/edit/SectionHeader";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import {
  getCurrentMentorProfile,
  updateMentorProfile,
  updateMentorProfileImage,
} from "@/lib/api/mentor";
import type {
  UpdateMentorProfileInput,
  MentorProfile,
} from "@/lib/api/mentor/types";

interface MentorFormData {
  personal: {
    firstName: string;
    lastName: string;
    bio: string;
    profileImageUrl: string;
    location: string;
  };
  professional: {
    headline: string;
    expertise: string[];
    industries: string[];
    languages: string[];
    stack: string[];
  };
  social: {
    linkedin: string;
    twitter: string;
    telegram: string;
    instagram: string;
    website: string;
  };
}

const DEFAULT_MENTOR_DATA: MentorFormData = {
  personal: {
    firstName: "",
    lastName: "",
    bio: "",
    profileImageUrl: "",
    location: "",
  },
  professional: {
    headline: "",
    expertise: [],
    industries: [],
    languages: [],
    stack: [],
  },
  social: {
    linkedin: "",
    twitter: "",
    telegram: "",
    instagram: "",
    website: "",
  },
};

const availableIndustries = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Marketing",
  "Design",
  "Business",
  "Sales",
  "Operations",
  "Product Management",
  "Data Science",
  "Engineering",
  "Other",
];

const availableLanguages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Portuguese",
  "Russian",
  "Yoruba",
  "Igbo",
  "Hausa",
];

const availableExpertise = [
  "Product Design",
  "UI/UX Design",
  "Frontend Development",
  "Backend Development",
  "Data Science",
  "Machine Learning",
  "Product Management",
  "Engineering Leadership",
  "Career Coaching",
  "Startup Advisory",
];

const availableStack = [
  "JavaScript",
  "Python",
  "React",
  "Node.js",
  "Figma",
  "AWS",
  "Docker",
  "Kubernetes",
  "Git",
  "SQL",
  "MongoDB",
  "PostgreSQL",
  "TypeScript",
  "Next.js",
];

const mentorSections = [
  { id: "personal", label: "Personal Details" },
  { id: "professional", label: "Professional Details" },
  { id: "social", label: "Social Links" },
];

function EditProfileSidebar({
  expandedSection,
  onToggleSection,
}: {
  expandedSection: string;
  onToggleSection: (section: string) => void;
}) {
  return (
    <div className="w-[250px] flex flex-col items-start gap-[35px] px-5 pt-[20px] border-r border-[#E1E4EA]">
      <h1 className="text-[20px] font-semibold text-black font-inter-tight">
        Edit Profile
      </h1>

      <div className="flex flex-col items-start gap-[22px] w-full">
        {mentorSections.map(({ id, label }) => (
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
      <Link href="/mentor/profile">
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
  onNext,
  profileCompleteness,
}: {
  isOpen: boolean;
  onToggle: () => void;
  formData: MentorFormData["personal"];
  onInputChange: (field: string, value: string) => void;
  sectionRef: (el: HTMLDivElement | null) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  isUploading: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onNext: () => void;
  profileCompleteness: number;
}) {
  const completeness = profileCompleteness ?? 0;
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
            <div
              className="relative"
              style={{ width: ringSize, height: ringSize }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onFileChange}
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
                {completeness}%
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

            {/* Location */}
            <div className="flex flex-col gap-[10px]">
              <label className="text-[13px] font-normal text-black font-inter-tight">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => onInputChange("location", e.target.value)}
                placeholder="e.g., Lagos, Nigeria"
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
                placeholder="Tell mentees about yourself, your experience, and what you can help with..."
                className="min-h-[120px] px-[12px] py-[12px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent resize-none"
              />
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

function ProfessionalDetailsSection({
  isOpen,
  onToggle,
  formData,
  onInputChange,
  onAddExpertise,
  onRemoveExpertise,
  onAddIndustry,
  onRemoveIndustry,
  onAddLanguage,
  onRemoveLanguage,
  onAddStack,
  onRemoveStack,
  sectionRef,
  onNext,
}: {
  isOpen: boolean;
  onToggle: () => void;
  formData: MentorFormData["professional"];
  onInputChange: (field: string, value: string) => void;
  onAddExpertise: (expertise: string) => void;
  onRemoveExpertise: (index: number) => void;
  onAddIndustry: (industry: string) => void;
  onRemoveIndustry: (index: number) => void;
  onAddLanguage: (language: string) => void;
  onRemoveLanguage: (index: number) => void;
  onAddStack: (item: string) => void;
  onRemoveStack: (index: number) => void;
  sectionRef: (el: HTMLDivElement | null) => void;
  onNext: () => void;
}) {
  const [expertiseDropdownOpen, setExpertiseDropdownOpen] = useState(false);
  const [industriesDropdownOpen, setIndustriesDropdownOpen] = useState(false);
  const [languagesDropdownOpen, setLanguagesDropdownOpen] = useState(false);
  const [stackDropdownOpen, setStackDropdownOpen] = useState(false);

  return (
    <div
      ref={sectionRef}
      className="border border-[#E1E4EA] rounded-[16px] bg-white"
    >
      <SectionHeader
        title="Professional Details"
        isOpen={isOpen}
        onToggle={onToggle}
      />

      <SmoothCollapse isOpen={isOpen}>
        <>
          <div className="h-[1px] bg-[#E1E4EA]" />
          <div className="px-[16px] py-[18px] flex flex-col gap-[16px]">
            {/* Headline */}
            <div className="flex flex-col gap-[10px]">
              <label className="text-[13px] font-normal text-black font-inter-tight">
                Headline
              </label>
              <input
                type="text"
                value={formData.headline}
                onChange={(e) => onInputChange("headline", e.target.value)}
                placeholder="e.g., Senior Product Designer at Google"
                className="px-[12px] py-[18px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
              />
            </div>

            {/* Expertise */}
            <div className="flex flex-col gap-[10px]">
              <label className="text-[13px] font-normal text-black font-inter-tight">
                Areas of Expertise
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.expertise.map((item, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#F0F7FF] border border-[#ADD8F7] rounded-full text-[12px] font-normal text-black font-inter-tight"
                  >
                    {item}
                    <button
                      onClick={() => onRemoveExpertise(index)}
                      className="ml-1 text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setExpertiseDropdownOpen(!expertiseDropdownOpen)
                  }
                  className="w-full px-[12px] py-[14px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black/50 font-inter-tight text-left focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                >
                  + Add expertise
                </button>
                {expertiseDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E1E4EA] rounded-[8px] shadow-lg z-10 max-h-[200px] overflow-y-auto">
                    {availableExpertise
                      .filter((e) => !formData.expertise.includes(e))
                      .map((expertise) => (
                        <button
                          key={expertise}
                          onClick={() => {
                            onAddExpertise(expertise);
                            setExpertiseDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-[13px] hover:bg-[#F0F7FF] font-inter-tight"
                        >
                          {expertise}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Industries */}
            <div className="flex flex-col gap-[10px]">
              <label className="text-[13px] font-normal text-black font-inter-tight">
                Industries
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.industries.map((item, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#F0F7FF] border border-[#ADD8F7] rounded-full text-[12px] font-normal text-black font-inter-tight"
                  >
                    {item}
                    <button
                      onClick={() => onRemoveIndustry(index)}
                      className="ml-1 text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setIndustriesDropdownOpen(!industriesDropdownOpen)
                  }
                  className="w-full px-[12px] py-[14px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black/50 font-inter-tight text-left focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                >
                  + Add industry
                </button>
                {industriesDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E1E4EA] rounded-[8px] shadow-lg z-10 max-h-[200px] overflow-y-auto">
                    {availableIndustries
                      .filter((i) => !formData.industries.includes(i))
                      .map((industry) => (
                        <button
                          key={industry}
                          onClick={() => {
                            onAddIndustry(industry);
                            setIndustriesDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-[13px] hover:bg-[#F0F7FF] font-inter-tight"
                        >
                          {industry}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Languages */}
            <div className="flex flex-col gap-[10px]">
              <label className="text-[13px] font-normal text-black font-inter-tight">
                Languages
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.languages.map((item, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#F0F7FF] border border-[#ADD8F7] rounded-full text-[12px] font-normal text-black font-inter-tight"
                  >
                    {item}
                    <button
                      onClick={() => onRemoveLanguage(index)}
                      className="ml-1 text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setLanguagesDropdownOpen(!languagesDropdownOpen)
                  }
                  className="w-full px-[12px] py-[14px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black/50 font-inter-tight text-left focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                >
                  + Add language
                </button>
                {languagesDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E1E4EA] rounded-[8px] shadow-lg z-10 max-h-[200px] overflow-y-auto">
                    {availableLanguages
                      .filter((l) => !formData.languages.includes(l))
                      .map((language) => (
                        <button
                          key={language}
                          onClick={() => {
                            onAddLanguage(language);
                            setLanguagesDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-[13px] hover:bg-[#F0F7FF] font-inter-tight"
                        >
                          {language}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Technology Stack */}
            <div className="flex flex-col gap-[10px]">
              <label className="text-[13px] font-normal text-black font-inter-tight">
                Technology Stack
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.stack.map((item, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#F0F7FF] border border-[#ADD8F7] rounded-full text-[12px] font-normal text-black font-inter-tight"
                  >
                    {item}
                    <button
                      onClick={() => onRemoveStack(index)}
                      className="ml-1 text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setStackDropdownOpen(!stackDropdownOpen)}
                  className="w-full px-[12px] py-[14px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black/50 font-inter-tight text-left focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                >
                  + Add technology
                </button>
                {stackDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E1E4EA] rounded-[8px] shadow-lg z-10 max-h-[200px] overflow-y-auto">
                    {availableStack
                      .filter((s) => !formData.stack.includes(s))
                      .map((tech) => (
                        <button
                          key={tech}
                          onClick={() => {
                            onAddStack(tech);
                            setStackDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-[13px] hover:bg-[#F0F7FF] font-inter-tight"
                        >
                          {tech}
                        </button>
                      ))}
                  </div>
                )}
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

function SocialLinksSection({
  isOpen,
  onToggle,
  formData,
  onInputChange,
  sectionRef,
  onSave,
}: {
  isOpen: boolean;
  onToggle: () => void;
  formData: MentorFormData["social"];
  onInputChange: (platform: string, value: string) => void;
  sectionRef: (el: HTMLDivElement | null) => void;
  onSave: () => void;
}) {
  const socialFields = [
    {
      id: "twitter",
      label: "X",
      placeholder: "Paste Link Here",
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
      id: "instagram",
      label: "Instagram",
      placeholder: "Paste Link Here",
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
      id: "linkedin",
      label: "LinkedIn",
      placeholder: "Paste Link Here",
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
      id: "website",
      label: "Website",
      placeholder: "Paste Link Here",
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
            {socialFields.map((field) => (
              <div key={field.id} className="flex flex-col gap-[10px]">
                <label className="text-[13px] font-normal text-black font-inter-tight">
                  {field.label}
                </label>
                <div className="px-[12px] py-[18px] flex items-center gap-[10px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px]">
                  {field.icon}
                  <input
                    type="text"
                    value={formData[field.id as keyof typeof formData]}
                    onChange={(e) => onInputChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className="flex-1 text-[13px] font-normal font-inter-tight placeholder:text-black/30 border-0 focus:outline-none bg-transparent"
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={onSave}
                className="h-[44px] px-[32px] rounded-full bg-[#181B25] text-white hover:bg-[#2a2f3a] font-inter-tight text-[13px] font-normal"
              >
                Save
              </Button>
            </div>
          </div>
        </>
      </SmoothCollapse>
    </div>
  );
}

export function MentorEditProfile() {
  const searchParams = useSearchParams();
  const [expandedSection, setExpandedSection] = useState<string>(searchParams.get("section") || "personal");
  const [formData, setFormData] = useState<MentorFormData>(DEFAULT_MENTOR_DATA);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [profileCompleteness, setProfileCompleteness] = useState(0);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchMentorProfile = async () => {
      setIsFetching(true);
      try {
        const response = await getCurrentMentorProfile();
        // API returns { profile: {...}, isProfileCreated: true } or direct profile
        const profile =
          (response as unknown as { profile?: MentorProfile }).profile ??
          response;
        const completenessValue = (response as any)?.profileCompleteness ?? 0;

        const nameParts = (profile.fullName || "").split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        setFormData({
          personal: {
            firstName,
            lastName,
            bio: profile.bio || "",
            profileImageUrl: profile.profileImageUrl || "",
            location: profile.location || "",
          },
          professional: {
            headline: profile.headline || "",
            expertise: profile.expertise || [],
            industries: profile.industries || [],
            languages: profile.languages || [],
            stack: profile.stack || [],
          },
          social: {
            linkedin: profile.links?.linkedIn || profile.links?.linkedin || "",
            twitter: profile.links?.twitter || "",
            telegram: profile.links?.telegram || "",
            instagram: profile.links?.instagram || "",
            website: profile.links?.website || "",
          },
        });
        setHasUnsavedChanges(false);
        setProfileCompleteness(completenessValue);
      } catch (error) {
        console.error("Failed to fetch mentor profile:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchMentorProfile();
  }, []);

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

  useEffect(() => {
    const section = searchParams.get("section");
    if (section) {
      setTimeout(() => {
        const element = sectionRefs.current[section];
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    }
  }, [searchParams]);

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

  const handleAddExpertise = (expertise: string) => {
    setFormData((prev) => ({
      ...prev,
      professional: {
        ...prev.professional,
        expertise: [...prev.professional.expertise, expertise],
      },
    }));
    setHasUnsavedChanges(true);
  };

  const handleRemoveExpertise = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      professional: {
        ...prev.professional,
        expertise: prev.professional.expertise.filter((_, i) => i !== index),
      },
    }));
    setHasUnsavedChanges(true);
  };

  const handleAddIndustry = (industry: string) => {
    setFormData((prev) => ({
      ...prev,
      professional: {
        ...prev.professional,
        industries: [...prev.professional.industries, industry],
      },
    }));
    setHasUnsavedChanges(true);
  };

  const handleRemoveIndustry = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      professional: {
        ...prev.professional,
        industries: prev.professional.industries.filter((_, i) => i !== index),
      },
    }));
    setHasUnsavedChanges(true);
  };

  const handleAddLanguage = (language: string) => {
    setFormData((prev) => ({
      ...prev,
      professional: {
        ...prev.professional,
        languages: [...prev.professional.languages, language],
      },
    }));
    setHasUnsavedChanges(true);
  };

  const handleRemoveLanguage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      professional: {
        ...prev.professional,
        languages: prev.professional.languages.filter((_, i) => i !== index),
      },
    }));
    setHasUnsavedChanges(true);
  };

  const handleAddStack = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      professional: {
        ...prev.professional,
        stack: [...prev.professional.stack, item],
      },
    }));
    setHasUnsavedChanges(true);
  };

  const handleRemoveStack = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      professional: {
        ...prev.professional,
        stack: prev.professional.stack.filter((_, i) => i !== index),
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

  const handleProfileImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await updateMentorProfileImage(file);
      if (response.profileImageUrl) {
        handlePersonalInputChange("profileImageUrl", response.profileImageUrl);
      }
    } catch (error) {
      console.error("Failed to upload profile image:", error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);

      const apiData: UpdateMentorProfileInput = {
        fullName:
          `${formData.personal.firstName} ${formData.personal.lastName}`.trim(),
        headline: formData.professional.headline,
        bio: formData.personal.bio,
        location: formData.personal.location,
        expertise: formData.professional.expertise,
        links: {
          linkedin: formData.social.linkedin,
          twitter: formData.social.twitter,
          telegram: formData.social.telegram,
          instagram: formData.social.instagram,
          website: formData.social.website,
        },
      };

      await updateMentorProfile(apiData);

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

  if (isFetching) {
    return (
      <div className="flex h-screen bg-white items-center justify-center">
        <div className="text-[14px] text-gray-500 font-inter-tight">
          Loading...
        </div>
      </div>
    );
  }

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
              onNext={() => toggleSection("professional")}
              profileCompleteness={profileCompleteness}
            />

            <ProfessionalDetailsSection
              isOpen={expandedSection === "professional"}
              onToggle={() => toggleSection("professional")}
              formData={formData.professional}
              onInputChange={handleProfessionalInputChange}
              onAddExpertise={handleAddExpertise}
              onRemoveExpertise={handleRemoveExpertise}
              onAddIndustry={handleAddIndustry}
              onRemoveIndustry={handleRemoveIndustry}
              onAddLanguage={handleAddLanguage}
              onRemoveLanguage={handleRemoveLanguage}
              onAddStack={handleAddStack}
              onRemoveStack={handleRemoveStack}
              sectionRef={(el) => {
                if (el) sectionRefs.current["professional"] = el;
              }}
              onNext={() => toggleSection("social")}
            />

            <SocialLinksSection
              isOpen={expandedSection === "social"}
              onToggle={() => toggleSection("social")}
              formData={formData.social}
              onInputChange={handleSocialInputChange}
              sectionRef={(el) => {
                if (el) sectionRefs.current["social"] = el;
              }}
              onSave={handleSaveProfile}
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
