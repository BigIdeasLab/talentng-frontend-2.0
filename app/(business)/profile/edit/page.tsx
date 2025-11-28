"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ChangeEvent } from "react";
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
    description: "Senior UI/UX Designer with expertise in designing scalable design systems and leading cross-functional teams. Passionate about accessibility, user research, and creating products that users love. I've led design initiatives from concept to launch, resulting in improved user engagement and retention metrics.",
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
      description: "Led design for multiple SaaS products, managing a team of 3 designers. Implemented comprehensive design system that reduced design-to-development time by 40%. Conducted user research and usability testing to inform product decisions.",
      isCurrently: true,
    },
    {
      id: "2",
      company: "TechFlow Solutions",
      position: "UI/UX Designer",
      startDate: "2020-06-15",
      endDate: "2022-02-28",
      description: "Designed and prototyped mobile and web applications for fintech clients. Collaborated with product managers and developers to deliver user-centric solutions. Improved app onboarding flow, increasing user retention by 25%.",
      isCurrently: false,
    },
    {
      id: "3",
      company: "Creative Agency Partners",
      position: "Junior UI Designer",
      startDate: "2019-01-10",
      endDate: "2020-05-31",
      description: "Created UI designs for various client projects across different industries. Learned design fundamentals, brand identity, and visual communication. Assisted in conducting user interviews and creating wireframes.",
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
      description: "Focused on digital media and user communication. Completed thesis on design thinking and user experience in digital platforms. Graduated with Second Class Upper Honours.",
    },
    {
      id: "2",
      school: "Interaction Design Foundation",
      degree: "Certification",
      field: "UX Design",
      startDate: "2019-03-01",
      endDate: "2019-08-31",
      description: "Completed comprehensive online course covering UX fundamentals, user research methods, interaction design principles, and usability testing. Gained practical skills in design tools and methodologies.",
    },
    {
      id: "3",
      school: "Google Career Certificates",
      degree: "Professional Certificate",
      field: "Google UX Design",
      startDate: "2020-01-01",
      endDate: "2020-04-30",
      description: "Completed Google's UX Design specialization program covering wireframing, prototyping, and usability research. Built portfolio projects demonstrating design thinking process.",
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

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? "" : section);
  };

  const handleInputChange = (
    section: keyof typeof dummyProfileData,
    field: string,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
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

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar Navigation */}
      <div className="w-[250px] flex flex-col items-start gap-[35px] px-5 pt-[20px] border-r border-[#E1E4EA]">
        <h1 className="text-[20px] font-semibold text-black font-inter-tight">
          Edit Profile
        </h1>

        <div className="flex flex-col items-start gap-[22px] w-full">
          <button
            onClick={() => toggleSection("personal")}
            className={cn(
              "text-[14px] font-medium font-inter-tight transition-colors",
              expandedSection === "personal"
                ? "text-[#5C30FF]"
                : "text-[#525866]",
            )}
          >
            Personal Details
          </button>
          <button
            onClick={() => toggleSection("professional")}
            className={cn(
              "text-[14px] font-normal font-inter-tight transition-colors",
              expandedSection === "professional"
                ? "text-[#5C30FF]"
                : "text-[#525866]",
            )}
          >
            Professional Details
          </button>
          <button
            onClick={() => toggleSection("experience")}
            className={cn(
              "text-[14px] font-normal font-inter-tight transition-colors",
              expandedSection === "experience"
                ? "text-[#5C30FF]"
                : "text-[#525866]",
            )}
          >
            Work Experience
          </button>
          <button
            onClick={() => toggleSection("education")}
            className={cn(
              "text-[14px] font-normal font-inter-tight transition-colors",
              expandedSection === "education"
                ? "text-[#5C30FF]"
                : "text-[#525866]",
            )}
          >
            Education
          </button>
          <button
            onClick={() => toggleSection("portfolio")}
            className={cn(
              "text-[14px] font-normal font-inter-tight transition-colors",
              expandedSection === "portfolio"
                ? "text-[#5C30FF]"
                : "text-[#525866]",
            )}
          >
            Portfolio
          </button>
          <button
            onClick={() => toggleSection("social")}
            className={cn(
              "text-[14px] font-normal font-inter-tight transition-colors",
              expandedSection === "social"
                ? "text-[#5C30FF]"
                : "text-[#525866]",
            )}
          >
            Social Links
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Action Bar */}
        <div className="h-[56px] border-b border-[#E1E4EA] flex items-center justify-end px-[80px] gap-2 bg-white">
          <Link href="/profile">
            <Button
              variant="outline"
              className="h-[40px] px-[24px] rounded-full border border-[#F5F5F5] bg-[#F5F5F5] text-black hover:bg-[#e5e5e5] font-inter-tight text-[13px] font-normal"
            >
              Discard
            </Button>
          </Link>
          <Button className="h-[40px] px-[24px] rounded-full bg-[#5C30FF] text-white hover:bg-[#4a26cc] font-inter-tight text-[13px] font-normal">
            Save Changes
          </Button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto scrollbar-styled px-[80px] pt-[25px] pb-6">
          <div className="max-w-[700px] mx-auto flex flex-col gap-[12px]">
            {/* Personal Details Section */}
            <div className="border border-[#E1E4EA] rounded-[16px] bg-white">
              <button
                onClick={() => toggleSection("personal")}
                className="w-full flex items-center justify-between px-[16px] py-[14px]"
              >
                <h2 className="text-[14px] font-medium text-black font-inter-tight">
                  Personal Details
                </h2>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-[#B2B2B2] transition-transform",
                    expandedSection === "personal" && "rotate-180",
                  )}
                />
              </button>

              {expandedSection === "personal" && (
                <>
                  <div className="h-[1px] bg-[#E1E4EA]" />
                  <div className="px-[16px] py-[18px] flex flex-col gap-[16px]">
                    {/* Profile Picture */}
                    <div className="relative w-[90px] h-[90px]">
                      <img
                        src="/lucas-gouvea.jpg"
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full p-2"
                      />
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
                          value={formData.personal.firstName}
                          onChange={(e) =>
                            handleInputChange(
                              "personal",
                              "firstName",
                              e.target.value,
                            )
                          }
                          className="h-[48px] px-[12px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                        />
                      </div>

                      <div className="flex-1 flex flex-col gap-[10px]">
                        <label className="text-[13px] font-normal text-black font-inter-tight">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={formData.personal.lastName}
                          onChange={(e) =>
                            handleInputChange(
                              "personal",
                              "lastName",
                              e.target.value,
                            )
                          }
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
                        value={formData.personal.headline}
                        onChange={(e) =>
                          handleInputChange(
                            "personal",
                            "headline",
                            e.target.value,
                          )
                        }
                        className="px-[12px] py-[18px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                      />
                    </div>

                    {/* Bio */}
                    <div className="flex flex-col gap-[10px]">
                      <label className="text-[13px] font-normal text-black font-inter-tight">
                        Bio
                      </label>
                      <textarea
                        value={formData.personal.bio}
                        onChange={(e) =>
                          handleInputChange("personal", "bio", e.target.value)
                        }
                        className="min-h-[100px] px-[12px] py-[12px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent resize-none"
                        placeholder="Tell us about yourself"
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="flex flex-col gap-[10px]">
                      <label className="text-[13px] font-normal text-black font-inter-tight">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.personal.phoneNumber}
                        onChange={(e) =>
                          handleInputChange(
                            "personal",
                            "phoneNumber",
                            e.target.value,
                          )
                        }
                        className="h-[48px] px-[12px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                        placeholder="+234 (0) 12 345 6789"
                      />
                    </div>

                    {/* Location Fields */}
                    <div className="flex gap-[10px]">
                      <div className="flex-1 flex flex-col gap-[10px]">
                        <label className="text-[13px] font-normal text-black font-inter-tight">
                          State
                        </label>
                        <select
                          value={formData.personal.state}
                          onChange={(e) =>
                            handleInputChange(
                              "personal",
                              "state",
                              e.target.value,
                            )
                          }
                          className="h-[48px] px-[12px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                        >
                          <option value="">Select a state</option>
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
                          value={formData.personal.city}
                          onChange={(e) =>
                            handleInputChange(
                              "personal",
                              "city",
                              e.target.value,
                            )
                          }
                          className="h-[48px] px-[12px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                        >
                          <option value="">
                            {formData.personal.state
                              ? "Select a city"
                              : "Select a state first"}
                          </option>
                          {formData.personal.state &&
                            statesCities[
                              formData.personal.state as keyof typeof statesCities
                            ]?.major_cities.map((city) => (
                              <option key={city} value={city}>
                                {city}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>

                    {/* Next Button */}
                    <div className="flex justify-end">
                      <Button className="h-[44px] px-[32px] rounded-full bg-[#181B25] text-white hover:bg-[#2a2f3a] font-inter-tight text-[13px] font-normal">
                        Next
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Professional Details Section */}
            <div className="border border-[#E1E4EA] rounded-[16px] bg-white">
              <button
                onClick={() => toggleSection("professional")}
                className="w-full flex items-center justify-between px-[16px] py-[14px]"
              >
                <h2 className="text-[14px] font-medium text-black font-inter-tight">
                  Professional Details
                </h2>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-[#B2B2B2] transition-transform",
                    expandedSection === "professional" && "rotate-180",
                  )}
                />
              </button>

              {expandedSection === "professional" && (
                <>
                  <div className="h-[1px] bg-[#E1E4EA]" />
                  <div className="px-[16px] py-[18px] flex flex-col gap-[16px]">
                    {/* Role / Category */}
                    <div className="flex flex-col gap-[10px]">
                      <label className="text-[13px] font-normal text-black font-inter-tight">
                        Role / Category
                      </label>
                      <input
                        type="text"
                        value={formData.professional.role}
                        onChange={(e) =>
                          handleInputChange(
                            "professional",
                            "role",
                            e.target.value,
                          )
                        }
                        className="px-[12px] py-[18px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                      />
                    </div>

                    {/* Company */}
                    <div className="flex flex-col gap-[10px]">
                      <label className="text-[13px] font-normal text-black font-inter-tight">
                        Company
                      </label>
                      <input
                        type="text"
                        value={formData.professional.company}
                        onChange={(e) =>
                          handleInputChange(
                            "professional",
                            "company",
                            e.target.value,
                          )
                        }
                        className="px-[12px] py-[18px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                        placeholder="Current or recent company"
                      />
                    </div>

                    {/* Preferred Role */}
                    <div className="flex flex-col gap-[10px]">
                      <label className="text-[13px] font-normal text-black font-inter-tight">
                        Preferred Role
                      </label>
                      <input
                        type="text"
                        value={formData.professional.preferredRole}
                        onChange={(e) =>
                          handleInputChange(
                            "professional",
                            "preferredRole",
                            e.target.value,
                          )
                        }
                        className="px-[12px] py-[18px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                        placeholder="Desired position"
                      />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-[10px]">
                      <label className="text-[13px] font-normal text-black font-inter-tight">
                        Professional Description
                      </label>
                      <textarea
                        value={formData.professional.description}
                        onChange={(e) =>
                          handleInputChange(
                            "professional",
                            "description",
                            e.target.value,
                          )
                        }
                        className="min-h-[100px] px-[12px] py-[12px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent resize-none"
                        placeholder="Tell clients about your professional expertise"
                      />
                    </div>

                    {/* Skills */}
                    <div className="flex flex-col gap-[10px]">
                      <label className="text-[13px] font-normal text-black font-inter-tight">
                        Skills
                      </label>

                      {/* Skills Dropdown */}
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleAddSkill(e.target.value);
                            e.target.value = "";
                          }
                        }}
                        className="px-[12px] py-[12px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                      >
                        <option value="">Select a skill</option>
                        {availableSkills.map((skill) => (
                          <option
                            key={skill}
                            value={skill}
                            disabled={formData.professional.skills.includes(
                              skill,
                            )}
                          >
                            {skill}
                          </option>
                        ))}
                      </select>

                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-[4px]">
                        {formData.professional.skills.map((skill, index) => (
                          <div
                            key={`${skill}-${index}`}
                            className="flex items-center gap-2 px-[10px] py-[8px] rounded-full bg-[#F5F5F5]"
                          >
                            <span className="text-[11px] font-normal text-black font-inter-tight leading-[105%]">
                              {skill}
                            </span>
                            <button
                              onClick={() => handleRemoveSkill(index)}
                              className="hover:opacity-70 transition-opacity"
                            >
                              <svg
                                width="13"
                                height="13"
                                viewBox="0 0 13 13"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M9.75 3.25L3.25044 9.74957M9.74957 9.75L3.25 3.25046"
                                  stroke="#606060"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stack */}
                    <div className="flex flex-col gap-[10px]">
                      <label className="text-[13px] font-normal text-black font-inter-tight">
                        Stack
                      </label>

                      {/* Stack Dropdown */}
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            const selectedTool = availableStack.find(
                              (t) => t.name === e.target.value,
                            );
                            if (selectedTool) {
                              handleAddStack(selectedTool);
                            }
                            e.target.value = "";
                          }
                        }}
                        className="px-[12px] py-[12px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                      >
                        <option value="">Select a tool</option>
                        {availableStack.map((tool) => (
                          <option
                            key={tool.name}
                            value={tool.name}
                            disabled={formData.professional.stack.some(
                              (s) => s.name === tool.name,
                            )}
                          >
                            {tool.name}
                          </option>
                        ))}
                      </select>

                      {/* Stack Tags */}
                      <div className="flex flex-wrap gap-[4px]">
                        {formData.professional.stack.map((tool, index) => (
                          <div
                            key={`${tool.name}-${index}`}
                            className="flex items-center gap-2 px-[10px] py-[7px] rounded-full bg-[#F5F5F5]"
                          >
                            <div className="flex items-center gap-[5px]">
                              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs">
                                {tool.icon}
                              </div>
                              <span className="text-[11px] font-normal text-black font-inter-tight leading-[105%]">
                                {tool.name}
                              </span>
                            </div>
                            <button
                              onClick={() => handleRemoveStack(index)}
                              className="hover:opacity-70 transition-opacity"
                            >
                              <svg
                                width="13"
                                height="13"
                                viewBox="0 0 13 13"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M9.75 3.25L3.25044 9.74957M9.74957 9.75L3.25 3.25046"
                                  stroke="#606060"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Availability */}
                    <div className="flex flex-col gap-[10px]">
                      <label className="text-[13px] font-normal text-black font-inter-tight">
                        Availability
                      </label>
                      <input
                        type="text"
                        value={formData.professional.availability}
                        onChange={(e) =>
                          handleInputChange(
                            "professional",
                            "availability",
                            e.target.value,
                          )
                        }
                        className="px-[12px] py-[18px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                      />
                    </div>

                    {/* Next Button */}
                    <div className="flex justify-end">
                      <Button className="h-[44px] px-[32px] rounded-full bg-[#181B25] text-white hover:bg-[#2a2f3a] font-inter-tight text-[13px] font-normal">
                        Next
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Work Experience Section */}
            <div className="border border-[#E1E4EA] rounded-[16px] bg-white">
              <button
                onClick={() => toggleSection("experience")}
                className="w-full flex items-center justify-between px-[16px] py-[14px]"
              >
                <h2 className="text-[14px] font-medium text-black font-inter-tight">
                  Work Experience
                </h2>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-[#B2B2B2] transition-transform",
                    expandedSection === "experience" && "rotate-180",
                  )}
                />
              </button>

              {expandedSection === "experience" && (
                <>
                  <div className="h-[1px] bg-[#E1E4EA]" />
                  <div className="px-[16px] py-[18px] flex flex-col gap-[16px]">
                    {formData.experience.map((exp, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-[16px] pb-[16px] border-b border-[#E1E4EA] last:border-0 last:pb-0"
                      >
                        {/* Company */}
                        <div className="flex flex-col gap-[10px]">
                          <label className="text-[13px] font-normal text-black font-inter-tight">
                            Company
                          </label>
                          <input
                            type="text"
                            placeholder="Company name"
                            className="px-[12px] py-[18px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                          />
                        </div>

                        {/* Position */}
                        <div className="flex flex-col gap-[10px]">
                          <label className="text-[13px] font-normal text-black font-inter-tight">
                            Position / Job Title
                          </label>
                          <input
                            type="text"
                            placeholder="Your job title"
                            className="px-[12px] py-[18px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                          />
                        </div>

                        {/* Date Range */}
                        <div className="flex gap-[10px]">
                          <div className="flex-1 flex flex-col gap-[10px]">
                            <label className="text-[13px] font-normal text-black font-inter-tight">
                              Start Date
                            </label>
                            <input
                              type="date"
                              className="h-[48px] px-[12px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                            />
                          </div>
                          <div className="flex-1 flex flex-col gap-[10px]">
                            <label className="text-[13px] font-normal text-black font-inter-tight">
                              End Date
                            </label>
                            <input
                              type="date"
                              className="h-[48px] px-[12px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                            />
                          </div>
                        </div>

                        {/* Description */}
                        <div className="flex flex-col gap-[10px]">
                          <label className="text-[13px] font-normal text-black font-inter-tight">
                            Description
                          </label>
                          <textarea
                            placeholder="Describe your responsibilities and achievements"
                            className="min-h-[80px] px-[12px] py-[12px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent resize-none"
                          />
                        </div>
                      </div>
                    ))}

                    <Button className="h-[40px] px-[24px] rounded-full bg-[#5C30FF] text-white hover:bg-[#4a26cc] font-inter-tight text-[12px] font-normal">
                      + Add Experience
                    </Button>

                    {/* Next Button */}
                    <div className="flex justify-end">
                      <Button className="h-[44px] px-[32px] rounded-full bg-[#181B25] text-white hover:bg-[#2a2f3a] font-inter-tight text-[13px] font-normal">
                        Next
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Education Section */}
            <div className="border border-[#E1E4EA] rounded-[16px] bg-white">
              <button
                onClick={() => toggleSection("education")}
                className="w-full flex items-center justify-between px-[16px] py-[14px]"
              >
                <h2 className="text-[14px] font-medium text-black font-inter-tight">
                  Education
                </h2>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-[#B2B2B2] transition-transform",
                    expandedSection === "education" && "rotate-180",
                  )}
                />
              </button>

              {expandedSection === "education" && (
                <>
                  <div className="h-[1px] bg-[#E1E4EA]" />
                  <div className="px-[16px] py-[18px] flex flex-col gap-[16px]">
                    {formData.education.map((edu, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-[16px] pb-[16px] border-b border-[#E1E4EA] last:border-0 last:pb-0"
                      >
                        {/* School */}
                        <div className="flex flex-col gap-[10px]">
                          <label className="text-[13px] font-normal text-black font-inter-tight">
                            School / University
                          </label>
                          <input
                            type="text"
                            placeholder="School or university name"
                            className="px-[12px] py-[18px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                          />
                        </div>

                        {/* Degree */}
                        <div className="flex flex-col gap-[10px]">
                          <label className="text-[13px] font-normal text-black font-inter-tight">
                            Degree
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., Bachelor, Master"
                            className="px-[12px] py-[18px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                          />
                        </div>

                        {/* Field of Study */}
                        <div className="flex flex-col gap-[10px]">
                          <label className="text-[13px] font-normal text-black font-inter-tight">
                            Field of Study
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., Computer Science"
                            className="px-[12px] py-[18px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                          />
                        </div>

                        {/* Date Range */}
                        <div className="flex gap-[10px]">
                          <div className="flex-1 flex flex-col gap-[10px]">
                            <label className="text-[13px] font-normal text-black font-inter-tight">
                              Start Date
                            </label>
                            <input
                              type="date"
                              className="h-[48px] px-[12px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                            />
                          </div>
                          <div className="flex-1 flex flex-col gap-[10px]">
                            <label className="text-[13px] font-normal text-black font-inter-tight">
                              End Date
                            </label>
                            <input
                              type="date"
                              className="h-[48px] px-[12px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                            />
                          </div>
                        </div>

                        {/* Description */}
                        <div className="flex flex-col gap-[10px]">
                          <label className="text-[13px] font-normal text-black font-inter-tight">
                            Description
                          </label>
                          <textarea
                            placeholder="Additional details about your studies"
                            className="min-h-[80px] px-[12px] py-[12px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent resize-none"
                          />
                        </div>
                      </div>
                    ))}

                    <Button className="h-[40px] px-[24px] rounded-full bg-[#5C30FF] text-white hover:bg-[#4a26cc] font-inter-tight text-[12px] font-normal">
                      + Add Education
                    </Button>

                    {/* Next Button */}
                    <div className="flex justify-end">
                      <Button className="h-[44px] px-[32px] rounded-full bg-[#181B25] text-white hover:bg-[#2a2f3a] font-inter-tight text-[13px] font-normal">
                        Next
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Portfolio Section */}
            <div className="border border-[#E1E4EA] rounded-[16px] bg-white">
              <button
                onClick={() => toggleSection("portfolio")}
                className="w-full flex items-center justify-between px-[16px] py-[14px]"
              >
                <h2 className="text-[14px] font-medium text-black font-inter-tight">
                  Portfolio
                </h2>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-[#B2B2B2] transition-transform",
                    expandedSection === "portfolio" && "rotate-180",
                  )}
                />
              </button>

              {expandedSection === "portfolio" && (
                <>
                  <div className="h-[1px] bg-[#E1E4EA]" />
                  <div className="px-[16px] py-[18px] flex flex-col gap-[16px]">
                    {/* Resume URL */}
                    <div className="flex flex-col gap-[10px]">
                      <label className="text-[13px] font-normal text-black font-inter-tight">
                        Resume / CV URL
                      </label>
                      <input
                        type="url"
                        value={formData.portfolio.resumeUrl}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            portfolio: {
                              ...prev.portfolio,
                              resumeUrl: e.target.value,
                            },
                          }))
                        }
                        placeholder="https://example.com/resume.pdf"
                        className="px-[12px] py-[18px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                      />
                    </div>

                    {/* Portfolio Items Info */}
                    <div className="p-[12px] bg-[#F0F7FF] border border-[#ADD8F7] rounded-[8px]">
                      <p className="text-[12px] font-normal text-black/70 font-inter-tight">
                        Portfolio items can be added from your gallery or
                        external links. You can showcase your best work,
                        projects, and designs here.
                      </p>
                    </div>

                    <Button className="h-[40px] px-[24px] rounded-full bg-[#5C30FF] text-white hover:bg-[#4a26cc] font-inter-tight text-[12px] font-normal">
                      + Add Portfolio Item
                    </Button>

                    {/* Next Button */}
                    <div className="flex justify-end">
                      <Button className="h-[44px] px-[32px] rounded-full bg-[#181B25] text-white hover:bg-[#2a2f3a] font-inter-tight text-[13px] font-normal">
                        Next
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Social Links Section */}
            <div className="border border-[#E1E4EA] rounded-[16px] bg-white">
              <button
                onClick={() => toggleSection("social")}
                className="w-full flex items-center justify-between px-[16px] py-[14px]"
              >
                <h2 className="text-[14px] font-medium text-black font-inter-tight">
                  Social Link
                </h2>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-[#B2B2B2] transition-transform",
                    expandedSection === "social" && "rotate-180",
                  )}
                />
              </button>

              {expandedSection === "social" && (
                <>
                  <div className="h-[1px] bg-[#E1E4EA]" />
                  <div className="px-[16px] py-[18px] flex flex-col gap-[16px]">
                    {/* Dribbble */}
                    <div className="flex flex-col gap-[10px]">
                      <label className="text-[13px] font-normal text-black font-inter-tight">
                        Dribbble
                      </label>
                      <div className="px-[12px] py-[18px] flex items-center gap-[10px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px]">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
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
                        <input
                          type="text"
                          placeholder="Paste Link Here"
                          value={formData.social.dribbble}
                          onChange={(e) =>
                            handleInputChange(
                              "social",
                              "dribbble",
                              e.target.value,
                            )
                          }
                          className="flex-1 text-[13px] font-normal font-inter-tight placeholder:text-black/30 border-0 focus:outline-none bg-transparent"
                        />
                      </div>
                    </div>

                    {/* Telegram */}
                    <div className="flex flex-col gap-[10px]">
                      <label className="text-[13px] font-normal text-black font-inter-tight">
                        Telegram
                      </label>
                      <div className="px-[12px] py-[18px] flex items-center gap-[10px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px]">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7.99092 10.2722L10.1519 12.7291C10.9525 13.6393 11.3528 14.0944 11.7718 13.9836C12.1908 13.8728 12.3345 13.2739 12.6219 12.0759L14.2159 5.4306C14.6585 3.58555 14.8798 2.66303 14.3879 2.208C13.896 1.75298 13.0433 2.0915 11.3381 2.76855L3.42649 5.90966C2.06261 6.45116 1.38066 6.72193 1.33737 7.1872C1.33293 7.2348 1.33286 7.28273 1.33715 7.33033C1.37901 7.7958 2.06013 8.06887 3.42235 8.61487C4.03957 8.86227 4.34819 8.986 4.56945 9.22293C4.59433 9.24953 4.61825 9.27713 4.64117 9.3056C4.84504 9.55893 4.93205 9.8914 5.10604 10.5563L5.43167 11.8007C5.60099 12.4477 5.68565 12.7712 5.90737 12.8153C6.1291 12.8594 6.32215 12.5911 6.70825 12.0546L7.99092 10.2722ZM7.99092 10.2722L7.77905 10.0514C7.53792 9.80006 7.41739 9.67447 7.41739 9.51833C7.41739 9.3622 7.53792 9.23653 7.77905 8.9852L10.1611 6.50273"
                            stroke="#525866"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <input
                          type="text"
                          placeholder="Paste Link Here"
                          value={formData.social.telegram}
                          onChange={(e) =>
                            handleInputChange(
                              "social",
                              "telegram",
                              e.target.value,
                            )
                          }
                          className="flex-1 text-[13px] font-normal font-inter-tight placeholder:text-black/30 border-0 focus:outline-none bg-transparent"
                        />
                      </div>
                    </div>

                    {/* X (Twitter) */}
                    <div className="flex flex-col gap-[10px]">
                      <label className="text-[13px] font-normal text-black font-inter-tight">
                        X
                      </label>
                      <div className="px-[12px] py-[18px] flex items-center gap-[10px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px]">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M2 14L7.03227 8.96773M7.03227 8.96773L2 2H5.33333L8.96773 7.03227M7.03227 8.96773L10.6667 14H14L8.96773 7.03227M14 2L8.96773 7.03227"
                            stroke="#525866"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <input
                          type="text"
                          placeholder="Paste Link Here"
                          value={formData.social.twitter}
                          onChange={(e) =>
                            handleInputChange(
                              "social",
                              "twitter",
                              e.target.value,
                            )
                          }
                          className="flex-1 text-[13px] font-normal font-inter-tight placeholder:text-black/30 border-0 focus:outline-none bg-transparent"
                        />
                      </div>
                    </div>

                    {/* Instagram */}
                    <div className="flex flex-col gap-[10px]">
                      <label className="text-[13px] font-normal text-black font-inter-tight">
                        Instagram
                      </label>
                      <div className="px-[12px] py-[18px] flex items-center gap-[10px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px]">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
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
                        <input
                          type="text"
                          placeholder="Paste Link Here"
                          value={formData.social.instagram}
                          onChange={(e) =>
                            handleInputChange(
                              "social",
                              "instagram",
                              e.target.value,
                            )
                          }
                          className="flex-1 text-[13px] font-normal font-inter-tight placeholder:text-black/30 border-0 focus:outline-none bg-transparent"
                        />
                      </div>
                    </div>

                    {/* LinkedIn */}
                    <div className="flex flex-col gap-[10px]">
                      <label className="text-[13px] font-normal text-black font-inter-tight">
                        LinkendIn
                      </label>
                      <div className="px-[12px] py-[18px] flex items-center gap-[10px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px]">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
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
                        <input
                          type="text"
                          placeholder="Paste Link Here"
                          value={formData.social.linkedin}
                          onChange={(e) =>
                            handleInputChange(
                              "social",
                              "linkedin",
                              e.target.value,
                            )
                          }
                          className="flex-1 text-[13px] font-normal font-inter-tight placeholder:text-black/30 border-0 focus:outline-none bg-transparent"
                        />
                      </div>
                    </div>

                    {/* Next Button */}
                    <div className="flex justify-end">
                      <Button className="h-[44px] px-[32px] rounded-full bg-[#181B25] text-white hover:bg-[#2a2f3a] font-inter-tight text-[13px] font-normal">
                        Next
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
