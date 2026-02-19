"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { SmoothCollapse } from "@/components/SmoothCollapse";
import { SectionHeader } from "@/components/talent/profile/components/edit/SectionHeader";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import {
  getCurrentRecruiterProfile,
  updateRecruiterProfile,
  updateRecruiterProfileImage,
} from "@/lib/api/recruiter";
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
    size: string;
    stage: string;
    operatingModel: string;
  };
  social: {
    website: string;
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
    size: "",
    stage: "",
    operatingModel: "",
  },
  social: {
    website: "",
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
  onNext,
  profileCompleteness,
}: {
  isOpen: boolean;
  onToggle: () => void;
  formData: EmployerFormData["personal"];
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
            {/* Profile Picture with Completeness Ring */}
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
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500"
                />
              </svg>
              <button
                type="button"
                onClick={handleProfileImageClick}
                disabled={isUploading}
                className="absolute rounded-full cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-50"
                style={{
                  top: strokeWidth + 2,
                  left: strokeWidth + 2,
                  width: ringSize - (strokeWidth + 2) * 2,
                  height: ringSize - (strokeWidth + 2) * 2,
                }}
                title="Click to change profile picture"
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

function CompanyDetailsSection({
  isOpen,
  onToggle,
  formData,
  onInputChange,
  sectionRef,
  onNext,
}: {
  isOpen: boolean;
  onToggle: () => void;
  formData: EmployerFormData["professional"];
  onInputChange: (field: string, value: string) => void;
  sectionRef: (el: HTMLDivElement | null) => void;
  onNext: () => void;
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
  formData: EmployerFormData["social"];
  onInputChange: (field: string, value: string) => void;
  sectionRef: (el: HTMLDivElement | null) => void;
  onSave: () => void;
}) {
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

            {/* LinkedIn */}
            <div className="flex flex-col gap-[10px]">
              <label className="text-[13px] font-normal text-black font-inter-tight">
                LinkedIn
              </label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => onInputChange("linkedin", e.target.value)}
                placeholder="https://linkedin.com/company/..."
                className="px-[12px] py-[18px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
              />
            </div>

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

export function EmployerEditProfile() {
  const router = useRouter();
  const [expandedSection, setExpandedSection] = useState<string>("personal");
  const [formData, setFormData] = useState<EmployerFormData>(
    DEFAULT_EMPLOYER_DATA,
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [profileCompleteness, setProfileCompleteness] = useState(0);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();

  // Fetch recruiter profile data with caching
  const {
    data: profileData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["recruiter-profile"],
    queryFn: async () => {
      const response = await getCurrentRecruiterProfile();
      const data = response as any;
      setProfileCompleteness(data.profileCompleteness || 0);
      return data.profile ?? response;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Populate form when profile data loads
  useEffect(() => {
    if (profileData) {
      const links = profileData.links || {};
      setFormData({
        personal: {
          profileImageUrl: profileData.profileImageUrl || "",
          company: profileData.company || "",
          bio: profileData.bio || "",
          state: profileData.location?.split(",")[0]?.trim() || "",
          city: profileData.location?.split(",")[1]?.trim() || "",
        },
        professional: {
          industry: profileData.industry || "",
          size: profileData.companySize || "",
          stage: profileData.companyStage || "",
          operatingModel: profileData.operatingModel || "",
        },
        social: {
          website: links.website || "",
          linkedin: links.linkedin || "",
        },
      });
      setHasUnsavedChanges(false);
    }
  }, [profileData]);

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
      const response = await updateRecruiterProfileImage(file);
      const profile = (response as any).profile ?? response;
      if (profile?.profileImageUrl) {
        setFormData((prev) => ({
          ...prev,
          personal: {
            ...prev.personal,
            profileImageUrl: profile.profileImageUrl,
          },
        }));
        queryClient.invalidateQueries({ queryKey: ["recruiter-profile"] });
        setHasUnsavedChanges(true);
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
      setIsSaving(true);

      const location = [formData.personal.state, formData.personal.city]
        .filter(Boolean)
        .join(", ");

      const links: Record<string, string> = {};
      if (formData.social.website) links.website = formData.social.website;
      if (formData.social.linkedin) links.linkedin = formData.social.linkedin;

      await updateRecruiterProfile({
        company: formData.personal.company,
        bio: formData.personal.bio,
        location: location || undefined,
        industry: formData.professional.industry,
        companySize: formData.professional.size,
        companyStage: formData.professional.stage,
        operatingModel: formData.professional.operatingModel,
        links: Object.keys(links).length > 0 ? links : undefined,
      });

      queryClient.invalidateQueries({ queryKey: ["recruiter-profile"] });
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
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <EditProfileSidebar
        expandedSection={expandedSection}
        onToggleSection={toggleSection}
      />

      <div className="flex-1 flex flex-col">
        <EditProfileActionBar onSave={handleSaveProfile} isLoading={isSaving} />

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
              onNext={() => toggleSection("professional")}
              profileCompleteness={profileCompleteness}
              sectionRef={(el) => {
                if (el) sectionRefs.current["personal"] = el;
              }}
            />

            <CompanyDetailsSection
              isOpen={expandedSection === "professional"}
              onToggle={() => toggleSection("professional")}
              formData={formData.professional}
              onInputChange={handleProfessionalInputChange}
              onNext={() => toggleSection("social")}
              sectionRef={(el) => {
                if (el) sectionRefs.current["professional"] = el;
              }}
            />

            <SocialLinksSection
              isOpen={expandedSection === "social"}
              onToggle={() => toggleSection("social")}
              formData={formData.social}
              onInputChange={handleSocialInputChange}
              onSave={handleSaveProfile}
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
