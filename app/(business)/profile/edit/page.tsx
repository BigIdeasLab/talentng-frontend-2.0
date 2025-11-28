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

const dummyProfileData = {
  personal: {
    firstName: "Akanbi",
    lastName: "David",
    headline: "Product & Interaction Designer | UI/UX Specialist",
    bio: "Passionate designer with 5+ years of experience creating intuitive and beautiful digital experiences. I specialize in crafting user-centered designs that solve real problems and drive business growth. Proficient in design systems, prototyping, and user research methodologies.",
    phoneNumber: "+234 (0) 703 456 7890",
    state: "Lagos",
    city: "Ikeja",
  },
  professional: {
    role: "Senior UI/UX Designer",
    company: "Innovate Design Studio",
    preferredRole: "Lead Product Designer",
    description:
      "Senior UI/UX Designer with expertise in designing scalable design systems and leading cross-functional teams. Passionate about accessibility, user research, and creating products that users love. I've led design initiatives from concept to launch, resulting in improved user engagement and retention metrics.",
    skills: [
      "Website Design",
      "Ui/Ux Design",
      "Interface Design",
      "Interaction Design",
      "Presentation Design",
      "User Research",
      "Wireframing",
      "Design Systems",
    ],
    stack: [
      { name: "Figma", icon: "🎨" },
      { name: "Rive", icon: "⚡" },
      { name: "Webflow", icon: "🌊" },
      { name: "Lottie", icon: "✨" },
      { name: "Framer", icon: "▲" },
      { name: "Adobe XD", icon: "🎯" },
      { name: "Sketch", icon: "✏️" },
      { name: "InVision", icon: "🎬" },
    ],
    availability: "Available - Freelance/Contract",
  },
  social: {
    dribbble: "https://dribbble.com/akanbi-david",
    telegram: "https://t.me/akanbidavid",
    twitter: "https://twitter.com/akanbidavid",
    instagram: "https://instagram.com/akanbidavid",
    linkedin: "https://linkedin.com/in/akanbi-david",
  },
  experience: [
    {
      id: "1",
      company: "Innovate Design Studio",
      position: "Senior UI/UX Designer",
      startDate: "2022-03-01",
      endDate: "",
      description:
        "Led design for multiple SaaS products, managing a team of 3 designers. Implemented comprehensive design system that reduced design-to-development time by 40%. Conducted user research and usability testing to inform product decisions.",
      isCurrently: true,
    },
    {
      id: "2",
      company: "TechFlow Solutions",
      position: "UI/UX Designer",
      startDate: "2020-06-15",
      endDate: "2022-02-28",
      description:
        "Designed and prototyped mobile and web applications for fintech clients. Collaborated with product managers and developers to deliver user-centric solutions. Improved app onboarding flow, increasing user retention by 25%.",
      isCurrently: false,
    },
    {
      id: "3",
      company: "Creative Agency Partners",
      position: "Junior UI Designer",
      startDate: "2019-01-10",
      endDate: "2020-05-31",
      description:
        "Created UI designs for various client projects across different industries. Learned design fundamentals, brand identity, and visual communication. Assisted in conducting user interviews and creating wireframes.",
      isCurrently: false,
    },
  ],
  education: [
    {
      id: "1",
      school: "University of Lagos",
      degree: "Bachelor of Science",
      field: "Mass Communication",
      startDate: "2015-09-01",
      endDate: "2019-06-30",
      description:
        "Focused on digital media and user communication. Completed thesis on design thinking and user experience in digital platforms. Graduated with Second Class Upper Honours.",
    },
    {
      id: "2",
      school: "Interaction Design Foundation",
      degree: "Certification",
      field: "UX Design",
      startDate: "2019-03-01",
      endDate: "2019-08-31",
      description:
        "Completed comprehensive online course covering UX fundamentals, user research methods, interaction design principles, and usability testing. Gained practical skills in design tools and methodologies.",
    },
    {
      id: "3",
      school: "Google Career Certificates",
      degree: "Professional Certificate",
      field: "Google UX Design",
      startDate: "2020-01-01",
      endDate: "2020-04-30",
      description:
        "Completed Google's UX Design specialization program covering wireframing, prototyping, and usability research. Built portfolio projects demonstrating design thinking process.",
    },
  ],
  portfolio: {
    resumeUrl: "https://example.com/resumes/akanbi-david-resume-2024.pdf",
    portfolioItems: [],
  },
};

export default function EditProfilePage() {
  const [expandedSection, setExpandedSection] = useState<string>("personal");
  const [formData, setFormData] = useState(dummyProfileData);
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

  return (
    <div className="flex h-screen bg-white">
      <EditProfileSidebar
        expandedSection={expandedSection}
        onToggleSection={toggleSection}
      />

      <div className="flex-1 flex flex-col">
        <EditProfileActionBar />

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
