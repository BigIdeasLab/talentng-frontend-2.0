"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { EditProfileSidebar } from "@/components/talent/profile/components/edit/Sidebar";
import { EditProfileActionBar } from "@/components/talent/profile/components/edit/ActionBar";
import { PersonalDetailsSection } from "@/components/talent/profile/components/edit/PersonalDetailsSection";
import { ProfessionalDetailsSection } from "@/components/talent/profile/components/edit/ProfessionalDetailsSection";
import { WorkExperienceSection } from "@/components/talent/profile/components/edit/WorkExperienceSection";
import { EducationSection } from "@/components/talent/profile/components/edit/EducationSection";
import { PortfolioSection } from "@/components/talent/profile/components/edit/PortfolioSection";
import { SocialLinksSection } from "@/components/talent/profile/components/edit/SocialLinksSection";
import { Modal } from "@/components/ui/modal";
import statesCities from "@/lib/data/states-cities.json";
import {
  mapUIToAPI,
  mapAPIToUI,
  type UIProfileData,
} from "@/lib/profileMapper";
import { useProfile } from "@/hooks/useProfile";
import { updateServerTalentProfile } from "@/lib/api/talent/server";

const availableSkills = [
  "Website Design",
  "Ui/Ux Design",
  "Interface Design",
  "Interaction Design",
  "Presentation Design",
  "Mobile Design",
  "Prototyping",
  "User Research",
  "Wireframing",
  "Design Systems",
];

const availableStack = [
  { name: "Figma", icon: "🎨" },
  { name: "Rive", icon: "⚡" },
  { name: "Webflow", icon: "🌊" },
  { name: "Lottie", icon: "✨" },
  { name: "Framer", icon: "▲" },
  { name: "Adobe XD", icon: "🎯" },
  { name: "Sketch", icon: "✏️" },
  { name: "InVision", icon: "🎬" },
  { name: "Principle", icon: "🎪" },
  { name: "Zeplin", icon: "📐" },
];

const DEFAULT_PROFILE_DATA: UIProfileData = {
  personal: {
    firstName: "",
    lastName: "",
    headline: "",
    bio: "",
    phoneNumber: "",
    state: "",
    city: "",
    profileImageUrl: "",
  },
  professional: {
    role: "",
    company: "",
    category: "",
    description: "",
    skills: [],
    stack: [],
    availability: "",
  },
  gallery: [],
  experience: [],
  education: [],
  portfolio: {
    resumeUrl: "",
    portfolioItems: [],
  },
  social: {
    dribbble: "",
    telegram: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    github: "",
    portfolio: "",
  },
};

export function TalentEditProfile() {
  const router = useRouter();
  const [expandedSection, setExpandedSection] = useState<string>("personal");
  const [formData, setFormData] = useState<UIProfileData>(DEFAULT_PROFILE_DATA);
  const [editingExperienceIndex, setEditingExperienceIndex] = useState<
    number | null
  >(null);
  const [editingEducationIndex, setEditingEducationIndex] = useState<
    number | null
  >(null);
  const [editingPortfolioIndex, setEditingPortfolioIndex] = useState<
    number | null
  >(null);
  const [skillsDropdownOpen, setSkillsDropdownOpen] = useState(false);
  const [stackDropdownOpen, setStackDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const skillsSelectRef = useRef<HTMLSelectElement | null>(null);
  const stackSelectRef = useRef<HTMLSelectElement | null>(null);

  // Get current profile from context
  const { currentProfile, isLoading } = useProfile();
  const profileData = currentProfile;

  // Load profile data when it becomes available
  useEffect(() => {
    if (profileData) {
      const uiData = mapAPIToUI(profileData);
      setFormData(uiData);
      setHasUnsavedChanges(false);
    }
  }, [profileData]);

  // Track unsaved changes
  useEffect(() => {
    if (profileData) {
      const currentData = mapAPIToUI(profileData);
      const hasChanges =
        JSON.stringify(formData) !== JSON.stringify(currentData);
      setHasUnsavedChanges(hasChanges);
    }
  }, [formData, profileData]);

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
  };

  const handleProfessionalInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      professional: {
        ...prev.professional,
        [field]: value,
      },
    }));
  };

  const handleRemoveSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      professional: {
        ...prev.professional,
        skills: prev.professional.skills.filter((_, i) => i !== index),
      },
    }));
  };

  const handleRemoveStack = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      professional: {
        ...prev.professional,
        stack: prev.professional.stack.filter((_, i) => i !== index),
      },
    }));
  };

  const handleAddSkill = (skill: string) => {
    if (!formData.professional.skills.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        professional: {
          ...prev.professional,
          skills: [...prev.professional.skills, skill],
        },
      }));
    }
  };

  const handleAddStack = (tool: (typeof availableStack)[0]) => {
    if (!formData.professional.stack.find((s) => s.name === tool.name)) {
      setFormData((prev) => ({
        ...prev,
        professional: {
          ...prev.professional,
          stack: [...prev.professional.stack, tool],
        },
      }));
    }
  };

  const handleExperienceUpdate = (
    index: number,
    field: string,
    value: string | boolean,
  ) => {
    const updated = [...formData.experience];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      experience: updated,
    }));
  };

  const handleAddExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: "",
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
          isCurrently: false,
          location: "",
        },
      ],
    }));
    setEditingExperienceIndex(formData.experience.length);
  };

  const handleEducationUpdate = (
    index: number,
    field: string,
    value: string,
  ) => {
    const updated = [...formData.education];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      education: updated,
    }));
  };

  const handleAddEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: "",
          school: "",
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    }));
    setEditingEducationIndex(formData.education.length);
  };

  const handleSocialInputChange = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      social: {
        ...prev.social,
        [platform]: value,
      },
    }));
  };

  const handlePortfolioChange = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      portfolio: {
        ...prev.portfolio,
        resumeUrl: url,
      },
    }));
  };

  const handleAddPortfolioItem = () => {
    setFormData((prev) => ({
      ...prev,
      portfolio: {
        ...prev.portfolio,
        portfolioItems: [
          ...prev.portfolio.portfolioItems,
          {
            id: Date.now().toString(),
            title: "",
            description: "",
            url: "",
            image: "",
            technologies: [],
          },
        ],
      },
    }));
  };

  const handleUpdatePortfolioItem = (
    index: number,
    field: string,
    value: string,
  ) => {
    const updated = [...formData.portfolio.portfolioItems];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      portfolio: {
        ...prev.portfolio,
        portfolioItems: updated,
      },
    }));
  };

  const handleRemovePortfolioItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      portfolio: {
        ...prev.portfolio,
        portfolioItems: prev.portfolio.portfolioItems.filter(
          (_, i) => i !== index,
        ),
      },
    }));
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      // Convert UI-friendly format to API format
      const apiData = mapUIToAPI(formData as UIProfileData);

      // Send to API
      await updateServerTalentProfile(apiData);

      setModalMessage("Profile saved successfully!");
      setIsSuccess(true);
      setModalOpen(true);
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
        <EditProfileActionBar
          onSave={handleSaveProfile}
          isLoading={isSaving}
        />

        <div className="flex-1 overflow-y-auto scrollbar-styled px-[80px] pt-[25px] pb-6">
          <div className="max-w-[700px] mx-auto flex flex-col gap-[12px]">
            <PersonalDetailsSection
              isOpen={expandedSection === "personal"}
              onToggle={() => toggleSection("personal")}
              formData={formData.personal}
              onInputChange={handlePersonalInputChange}
              sectionRef={(el) => {
                if (el) sectionRefs.current["personal"] = el;
              }}
              statesCities={statesCities}
              onNext={() => toggleSection("professional")}
            />

            <ProfessionalDetailsSection
              isOpen={expandedSection === "professional"}
              onToggle={() => toggleSection("professional")}
              formData={formData.professional}
              onInputChange={handleProfessionalInputChange}
              onAddSkill={handleAddSkill}
              onRemoveSkill={handleRemoveSkill}
              onAddStack={handleAddStack}
              onRemoveStack={handleRemoveStack}
              sectionRef={(el) => {
                if (el) sectionRefs.current["professional"] = el;
              }}
              availableSkills={availableSkills}
              availableStack={availableStack}
              onNext={() => toggleSection("experience")}
            />

            <WorkExperienceSection
              isOpen={expandedSection === "experience"}
              onToggle={() => toggleSection("experience")}
              experiences={formData.experience}
              editingIndex={editingExperienceIndex}
              onEditingChange={setEditingExperienceIndex}
              onUpdate={handleExperienceUpdate}
              onAdd={handleAddExperience}
              sectionRef={(el) => {
                if (el) sectionRefs.current["experience"] = el;
              }}
              onNext={() => toggleSection("education")}
            />

            <EducationSection
              isOpen={expandedSection === "education"}
              onToggle={() => toggleSection("education")}
              education={formData.education}
              editingIndex={editingEducationIndex}
              onEditingChange={setEditingEducationIndex}
              onUpdate={handleEducationUpdate}
              onAdd={handleAddEducation}
              sectionRef={(el) => {
                if (el) sectionRefs.current["education"] = el;
              }}
              onNext={() => toggleSection("portfolio")}
            />

            <PortfolioSection
              isOpen={expandedSection === "portfolio"}
              onToggle={() => toggleSection("portfolio")}
              portfolioItems={formData.portfolio.portfolioItems}
              editingIndex={editingPortfolioIndex}
              onEditingChange={setEditingPortfolioIndex}
              onAddPortfolioItem={handleAddPortfolioItem}
              onUpdatePortfolioItem={handleUpdatePortfolioItem}
              onRemovePortfolioItem={handleRemovePortfolioItem}
              sectionRef={(el) => {
                if (el) sectionRefs.current["portfolio"] = el;
              }}
              onNext={() => toggleSection("social")}
            />

            <SocialLinksSection
              isOpen={expandedSection === "social"}
              onToggle={() => toggleSection("social")}
              socialData={formData.social}
              onInputChange={handleSocialInputChange}
              sectionRef={(el) => {
                if (el) sectionRefs.current["social"] = el;
              }}
              onNext={() => toggleSection("")}
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
