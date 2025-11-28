"use client";

import { useState, useRef } from "react";
import { EditProfileSidebar } from "@/components/profile/edit/Sidebar";
import { EditProfileActionBar } from "@/components/profile/edit/ActionBar";
import { PersonalDetailsSection } from "@/components/profile/edit/PersonalDetailsSection";
import { ProfessionalDetailsSection } from "@/components/profile/edit/ProfessionalDetailsSection";
import { WorkExperienceSection } from "@/components/profile/edit/WorkExperienceSection";
import { EducationSection } from "@/components/profile/edit/EducationSection";
import { PortfolioSection } from "@/components/profile/edit/PortfolioSection";
import { SocialLinksSection } from "@/components/profile/edit/SocialLinksSection";
import statesCities from "@/lib/states-cities.json";
import { mapUIToAPI, type UIProfileData } from "@/lib/profileMapper";
import { dummyUIProfileData } from "@/lib/dummyProfileData";

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

export default function EditProfilePage() {
   const [expandedSection, setExpandedSection] = useState<string>("personal");
   const [formData, setFormData] = useState(dummyUIProfileData);
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

  const handleEducationUpdate = (index: number, field: string, value: string) => {
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

      // Send to API
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

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
        <EditProfileActionBar onSave={handleSaveProfile} />

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
