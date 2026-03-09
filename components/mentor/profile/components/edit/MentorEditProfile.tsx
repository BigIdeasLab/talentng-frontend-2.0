"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUnsavedChangesWarning } from "@/hooks/useUnsavedChangesWarning";
import { fetchProfileByRole } from "@/lib/api/profile-service";
import { Plus, X as XIcon } from "lucide-react";
import { SmoothCollapse } from "@/components/SmoothCollapse";
import { SectionHeader } from "@/components/talent/profile/components/edit/SectionHeader";
import { Button } from "@/components/ui/button";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { Modal } from "@/components/ui/modal";
import { SuccessModal } from "@/components/ui/success-modal";
import { ROLE_COLORS } from "@/lib/theme/role-colors";
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
import categoriesData from "@/lib/data/categories.json";
import statesCities from "@/lib/data/states-cities.json";
import { MentorEditProfileSkeleton } from "@/components/skeletons/EditProfileSkeleton";
import { ResponsiveFormField, ResponsiveFormRow } from "@/components/forms/ResponsiveFormField";
import { ResponsiveFormButtons } from "@/components/forms/ResponsiveFormButtons";

interface MentorFormData {
  personal: {
    firstName: string;
    lastName: string;
    bio: string;
    profileImageUrl: string;
    state: string;
    city: string;
  };
  professional: {
    headline: string;
    expertise: string[];
    industries: string[];
    languages: string[];
    stack: string[];
    category: string;
  };
  social: {
    linkedin: string;
    twitter: string;
    telegram: string;
    instagram: string;
    website: string;
    customLinks?: { name: string; url: string }[];
  };
}

const DEFAULT_MENTOR_DATA: MentorFormData = {
  personal: {
    firstName: "",
    lastName: "",
    bio: "",
    profileImageUrl: "",
    state: "",
    city: "",
  },
  professional: {
    headline: "",
    expertise: [],
    industries: [],
    languages: [],
    stack: [],
    category: "",
  },
  social: {
    linkedin: "",
    twitter: "",
    telegram: "",
    instagram: "",
    website: "",
    customLinks: [],
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
    <div className="hidden lg:flex w-[250px] flex-col items-start gap-[35px] px-5 pt-[20px] border-r border-[#E1E4EA]">
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
  hasUnsavedChanges,
  onDiscard,
}: {
  onSave: () => void;
  isLoading: boolean;
  hasUnsavedChanges: boolean;
  onDiscard: () => void;
}) {
  return (
    <div className="h-[56px] border-b border-[#E1E4EA] flex items-center justify-end px-4 lg:px-[80px] gap-2 bg-white">
      <Button
        variant="outline"
        onClick={onDiscard}
        disabled={isLoading}
        className="h-[40px] min-h-[44px] px-[24px] rounded-full border border-[#F5F5F5] bg-[#F5F5F5] text-black hover:bg-[#e5e5e5] disabled:opacity-50 disabled:cursor-not-allowed font-inter-tight text-[13px] font-normal"
      >
        Discard
      </Button>
      <Button
        onClick={onSave}
        disabled={isLoading || !hasUnsavedChanges}
        className="h-[40px] min-h-[44px] px-[24px] rounded-full bg-[#5C30FF] text-white hover:bg-[#4a26cc] disabled:opacity-50 disabled:cursor-not-allowed font-inter-tight text-[13px] font-normal"
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

            {/* State and City */}
            <div className="flex gap-[10px]">
              <div className="flex-1 flex flex-col gap-[10px]">
                <label className="text-[13px] font-normal text-black font-inter-tight">
                  State
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => {
                    onInputChange("state", e.target.value);
                    onInputChange("city", "");
                  }}
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
                    (
                      statesCities as Record<string, { major_cities: string[] }>
                    )[formData.state]?.major_cities?.map((city: string) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                </select>
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

export function ProfessionalDetailsSection({
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
  availableCategories,
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
  availableCategories: string[];
}) {
  const [expertiseDropdownOpen, setExpertiseDropdownOpen] = useState(false);
  const [industriesDropdownOpen, setIndustriesDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
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

            {/* Category */}
            <div className="flex flex-col gap-[10px]">
              <label className="text-[13px] font-normal text-black font-inter-tight">
                Primary Category
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  className="w-full px-[12px] py-[18px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight text-left focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                >
                  {formData.category || "Select a category"}
                </button>
                {categoryDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E1E4EA] rounded-[8px] shadow-lg z-10 max-h-[200px] overflow-y-auto">
                    {availableCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          onInputChange("category", cat);
                          setCategoryDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-[13px] hover:bg-[#F0F7FF] font-inter-tight"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
  onCustomLinksChange,
  errors,
}: {
  isOpen: boolean;
  onToggle: () => void;
  formData: MentorFormData["social"];
  onInputChange: (field: string, value: string) => void;
  sectionRef: (el: HTMLDivElement | null) => void;
  onSave: () => void;
  onCustomLinksChange?: (links: { name: string; url: string }[]) => void;
  errors?: Record<number, { name?: string; url?: string }>;
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
          <path d="M1.5 8H14.5" stroke="#525866" strokeLinecap="round" />
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
                    value={
                      formData[
                        field.id as keyof Omit<
                          MentorFormData["social"],
                          "customLinks"
                        >
                      ]
                    }
                    onChange={(e) => onInputChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className="flex-1 text-[13px] font-normal font-inter-tight placeholder:text-black/30 border-0 focus:outline-none bg-transparent"
                  />
                </div>
              </div>
            ))}

            {/* Custom Links */}
            {(formData.customLinks || []).map((link, index) => (
              <div key={index} className="flex flex-col gap-[10px]">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    placeholder="Link Name (e.g. Behance)"
                    value={link.name}
                    onChange={(e) => {
                      const updated = [...(formData.customLinks || [])];
                      updated[index] = {
                        ...updated[index],
                        name: e.target.value,
                      };
                      onCustomLinksChange?.(updated);
                    }}
                    className="text-[13px] font-normal text-black font-inter-tight bg-transparent border-none focus:outline-none placeholder:text-black/30 w-full"
                  />
                  {errors?.[index]?.name && (
                    <span className="text-[11px] text-red-500 font-inter-tight mt-[-6px] mb-[2px]">
                      {errors[index].name}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (formData.customLinks || []).filter(
                        (_, i) => i !== index,
                      );
                      onCustomLinksChange?.(updated);
                    }}
                    className="text-[#525866] hover:text-red-500 transition-colors"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-col gap-[4px]">
                  <div className="px-[12px] py-[18px] flex items-center gap-[10px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px]">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M6.66699 8.66699C6.95329 9.04972 7.31856 9.36642 7.73803 9.59559C8.15751 9.82476 8.62133 9.96105 9.09804 9.99512C9.57475 10.0292 10.0533 9.96029 10.501 9.79319C10.9488 9.62609 11.3555 9.36474 11.6937 9.02699L13.6937 7.02699C14.3009 6.3981 14.6369 5.55606 14.6293 4.68099C14.6216 3.80592 14.2709 2.96966 13.6527 2.35148C13.0345 1.73331 12.1983 1.38257 11.3232 1.37492C10.4481 1.36727 9.60607 1.7033 8.97699 2.31033L7.83366 3.44699"
                        stroke="#525866"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9.33347 7.33347C9.04717 6.95074 8.6819 6.63403 8.26243 6.40487C7.84295 6.1757 7.37913 6.0394 6.90242 6.00534C6.42571 5.97127 5.94716 6.04017 5.49943 6.20727C5.05169 6.37437 4.64497 6.63572 4.3068 6.97347L2.3068 8.97347C1.69977 9.60236 1.36374 10.4444 1.37139 11.3195C1.37904 12.1945 1.72977 13.0308 2.34795 13.649C2.96613 14.2671 3.80239 14.6179 4.67746 14.6255C5.55253 14.6332 6.39457 14.2971 7.02347 13.6901L8.16014 12.5535"
                        stroke="#525866"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <input
                      type="text"
                      placeholder="Paste Link Here"
                      value={link.url}
                      onChange={(e) => {
                        const updated = [...(formData.customLinks || [])];
                        updated[index] = {
                          ...updated[index],
                          url: e.target.value,
                        };
                        onCustomLinksChange?.(updated);
                      }}
                      className="flex-1 text-[13px] font-normal font-inter-tight placeholder:text-black/30 border-0 focus:outline-none bg-transparent"
                    />
                  </div>
                  {errors?.[index]?.url && (
                    <span className="text-[11px] text-red-500 font-inter-tight px-1">
                      {errors[index].url}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Add Link Button */}
            <button
              type="button"
              onClick={() => {
                const updated = [
                  ...(formData.customLinks || []),
                  { name: "", url: "" },
                ];
                onCustomLinksChange?.(updated);
              }}
              className="flex items-center gap-2 text-[13px] font-normal text-[#5C30FF] font-inter-tight hover:opacity-80 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Add Link
            </button>

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [expandedSection, setExpandedSection] = useState<string>(
    searchParams.get("section") || "personal",
  );
  const [formData, setFormData] = useState<MentorFormData>(DEFAULT_MENTOR_DATA);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [profileCompleteness, setProfileCompleteness] = useState(0);
  const [linkErrors, setLinkErrors] = useState<
    Record<number, { name?: string; url?: string }>
  >({});
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const queryClient = useQueryClient();

  // Fetch mentor profile data with caching
  const { data: queryData, isLoading: isQueryLoading } = useQuery({
    queryKey: ["profile", "mentor"],
    queryFn: async () => {
      const response = await fetchProfileByRole("mentor");
      const data = response as any;
      return {
        profile: data.profile ?? response,
        profileCompleteness: data.profileCompleteness ?? 0,
      };
    },
    staleTime: 5 * 60 * 1000,
  });

  const profileData = queryData?.profile;

  useEffect(() => {
    if (profileData) {
      const completenessValue = queryData?.profileCompleteness ?? 0;

      const nameParts = (profileData.fullName || "").split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const locationParts = (profileData.location || "").split(", ");
      setFormData({
        personal: {
          firstName,
          lastName,
          bio: profileData.bio || "",
          profileImageUrl: profileData.profileImageUrl || "",
          state: locationParts[1] || locationParts[0] || "",
          city: locationParts.length > 1 ? locationParts[0] : "",
        },
        professional: {
          headline: profileData.headline || "",
          expertise: profileData.expertise || [],
          industries: profileData.industries || [],
          languages: profileData.languages || [],
          stack: profileData.stack || [],
          category: profileData.category || "",
        },
        social: {
          linkedin:
            profileData.links?.linkedIn || profileData.links?.linkedin || "",
          twitter: profileData.links?.twitter || "",
          telegram: profileData.links?.telegram || "",
          instagram: profileData.links?.instagram || "",
          website: profileData.links?.website || "",
          customLinks: (() => {
            const knownKeys = [
              "linkedin",
              "linkedIn",
              "twitter",
              "telegram",
              "instagram",
              "website",
            ];
            return Object.entries(profileData.links || {})
              .filter(([key, value]) => !knownKeys.includes(key) && value)
              .map(([key, value]) => ({
                name: key,
                url: (value as string) || "",
              }));
          })(),
        },
      });
      setHasUnsavedChanges(false);
      setProfileCompleteness(completenessValue);
    }
  }, [profileData]);

  // Warn on page leave (browser and client-side navigation)
  const { navigateWithConfirmation } =
    useUnsavedChangesWarning(hasUnsavedChanges);

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

  const handleCustomLinksChange = (links: { name: string; url: string }[]) => {
    setFormData((prev) => ({
      ...prev,
      social: {
        ...prev.social,
        customLinks: links,
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
        queryClient.invalidateQueries({ queryKey: ["profile", "mentor"] });
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

  const handleDiscard = () => {
    navigateWithConfirmation("/profile");
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      setLinkErrors({});

      // Validate custom links
      const newErrors: Record<number, { name?: string; url?: string }> = {};
      formData.social.customLinks?.forEach((link, index) => {
        const hasName = link.name.trim() !== "";
        const hasUrl = link.url.trim() !== "";

        if (hasUrl && !hasName) {
          newErrors[index] = {
            ...newErrors[index],
            name: "Please provide a name",
          };
        }
        if (hasName && !hasUrl) {
          newErrors[index] = {
            ...newErrors[index],
            url: "Please provide a URL",
          };
        }
      });

      if (Object.keys(newErrors).length > 0) {
        setLinkErrors(newErrors);
        setIsLoading(false);
        return;
      }

      const location =
        formData.personal.city && formData.personal.state
          ? `${formData.personal.city}, ${formData.personal.state}`
          : formData.personal.state || formData.personal.city || "";

      const customLinksObj: Record<string, string> = {};
      formData.social.customLinks?.forEach((link) => {
        if (link.name && link.url) {
          customLinksObj[link.name.toLowerCase().replace(/\s+/g, "_")] =
            link.url;
        }
      });

      const apiData: UpdateMentorProfileInput = {
        fullName:
          `${formData.personal.firstName} ${formData.personal.lastName}`.trim(),
        headline: formData.professional.headline,
        bio: formData.personal.bio,
        location,
        category: formData.professional.category,
        expertise: formData.professional.expertise,
        links: {
          linkedin: formData.social.linkedin,
          twitter: formData.social.twitter,
          telegram: formData.social.telegram,
          instagram: formData.social.instagram,
          website: formData.social.website,
          ...customLinksObj,
        },
      };

      await updateMentorProfile(apiData);

      queryClient.invalidateQueries({ queryKey: ["profile", "mentor"] });

      setModalMessage("Profile saved successfully!");
      setIsSuccess(true);
      setShowSuccessModal(true);
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

  if (isQueryLoading || !profileData) {
    return <MentorEditProfileSkeleton />;
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-white">
      <EditProfileSidebar
        expandedSection={expandedSection}
        onToggleSection={toggleSection}
      />

      <div className="flex-1 flex flex-col">
        <EditProfileActionBar
          onSave={handleSaveProfile}
          isLoading={isLoading}
          hasUnsavedChanges={hasUnsavedChanges}
          onDiscard={handleDiscard}
        />

        <div className="flex-1 overflow-y-auto scrollbar-styled px-4 lg:px-[80px] pt-[25px] pb-6">
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
              availableCategories={categoriesData}
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
              onCustomLinksChange={handleCustomLinksChange}
              errors={linkErrors}
            />
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        onConfirm={() => router.push("/profile")}
        title="Unsaved Changes"
        description="You have unsaved changes. Are you sure you want to leave? Your changes will be lost."
        confirmText="Leave"
        cancelText="Stay"
        type="default"
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Profile Updated!"
        description="Your mentor profile has been saved successfully."
        accentColor={ROLE_COLORS.mentor.primary}
      />

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
