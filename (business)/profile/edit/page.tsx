"use client";

import { useState, useRef, useEffect } from "react";
import { EditProfileSidebar } from "@/components/business/Profile/edit/Sidebar";
import { EditProfileActionBar } from "@/components/business/Profile/edit/ActionBar";
import { PersonalDetailsSection } from "@/components/business/Profile/edit/PersonalDetailsSection";
import { ProfessionalDetailsSection } from "@/components/business/Profile/edit/ProfessionalDetailsSection";
import { WorkExperienceSection } from "@/components/business/Profile/edit/WorkExperienceSection";
import { EducationSection } from "@/components/business/Profile/edit/EducationSection";
import { PortfolioSection } from "@/components/business/Profile/edit/PortfolioSection";
import { SocialLinksSection } from "@/components/business/Profile/edit/SocialLinksSection";
import statesCities from "@/lib/data/states-cities.json";
import {
  mapUIToAPI,
  mapAPIToUI,
  type UIProfileData,
} from "@/lib/profileMapper";
import { useCurrentProfile, useUpdateProfile } from "@/hooks/useProfileData";

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

export default function EditProfilePage() {
  const [expandedSection, setExpandedSection] = useState<string>("personal");
  const [formData, setFormData] = useState<UIProfileData>(DEFAULT_PROFILE_DATA);
  const [editingExperienceIndex, setEditingExperienceIndex] = useState<
    number | null
  >(null);
  const [editingEducationIndex, setEditingEducationIndex] = useState<
    number | null
  >(null);
  const [skillsDropdownOpen, setSkillsDropdownOpen] = useState(false);
  const [stackDropdownOpen, setStackDropdownOpen] = useState(false);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const skillsSelectRef = useRef<HTMLSelectElement | null>(null);
  const stackSelectRef = useRef<HTMLSelectElement | null>(null);

  // Fetch profile data with React Query hook
  const { data: profileData, isLoading } = useCurrentProfile();
  const updateProfileMutation = useUpdateProfile();

  // Load profile data when it becomes available
  useEffect(() => {
    if (profileData) {
      const uiData = mapAPIToUI(profileData);
      setFormData(uiData);
    }
  }, [profileData]);

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

  const handleSaveProfile = async () => {
    try {
      // Convert UI-friendly format to API format
      const apiData = mapUIToAPI(formData as UIProfileData);

      // Send to API using mutation
      await updateProfileMutation.mutateAsync(apiData);

      alert("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <EditProfileSidebar
        expandedSection={expandedSection}
        onToggleSection={toggleSection}
      />

      <div className="flex-1 flex flex-col">
        <EditProfileActionBar onSave={handleSaveProfile} isLoading={updateProfileMutation.isPending} />

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
              skillsDropdownOpen={skillsDropdownOpen}
              stackDropdownOpen={stackDropdownOpen}
              skillsSelectRef={skillsSelectRef}
              stackSelectRef={stackSelectRef}
              onSetSkillsDropdownOpen={setSkillsDropdownOpen}
              onSetStackDropdownOpen={setStackDropdownOpen}
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
            />

            <PortfolioSection
              isOpen={expandedSection === "portfolio"}
              onToggle={() => toggleSection("portfolio")}
              resumeUrl={formData.portfolio.resumeUrl}
              onResumeChange={handlePortfolioChange}
              sectionRef={(el) => {
                if (el) sectionRefs.current["portfolio"] = el;
              }}
            />

            <SocialLinksSection
              isOpen={expandedSection === "social"}
              onToggle={() => toggleSection("social")}
              socialData={formData.social}
              onInputChange={handleSocialInputChange}
              sectionRef={(el) => {
                if (el) sectionRefs.current["social"] = el;
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
