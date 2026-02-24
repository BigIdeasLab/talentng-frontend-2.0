"use client";

import { useState } from "react";
import { SmoothCollapse } from "@/components/SmoothCollapse";
import { SectionHeader } from "./SectionHeader";
import { SkillTag } from "./SkillTag";
import { StackTag } from "./StackTag";
import { Button } from "@/components/ui/button";
import { getToolInfo } from "@/lib/utils/tools";

interface StackTool {
  name: string;
  icon: string;
}

interface ProfessionalData {
  role: string;
  headline: string;
  category: string;
  skills: string[];
  stack: StackTool[];
  availability: string;
}

interface ProfessionalDetailsSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  formData: ProfessionalData;
  onInputChange: (field: string, value: string) => void;
  onAddSkill: (skill: string) => void;
  onRemoveSkill: (index: number) => void;
  onAddStack: (tool: StackTool) => void;
  onRemoveStack: (index: number) => void;
  sectionRef: (el: HTMLDivElement | null) => void;
  availableSkills: string[];
  availableStack: StackTool[];
  onNext: () => void;
}

export function ProfessionalDetailsSection({
  isOpen,
  onToggle,
  formData,
  onInputChange,
  onAddSkill,
  onRemoveSkill,
  onAddStack,
  onRemoveStack,
  sectionRef,
  availableSkills,
  availableStack,
  onNext,
}: ProfessionalDetailsSectionProps) {
  const [skillsInput, setSkillsInput] = useState("");
  const [stackInput, setStackInput] = useState("");
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);
  const [showStackDropdown, setShowStackDropdown] = useState(false);

  const handleAddSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !formData.skills.includes(trimmedSkill)) {
      onAddSkill(trimmedSkill);
      setSkillsInput("");
      setShowSkillsDropdown(false);
    }
  };

  const handleAddStack = (tool: string) => {
    const trimmedTool = tool.trim();
    if (trimmedTool && !formData.stack.some((s) => s.name === trimmedTool)) {
      const selectedTool = availableStack.find((t) => t.name === trimmedTool);
      if (selectedTool) {
        onAddStack(selectedTool);
      }
      setStackInput("");
      setShowStackDropdown(false);
    }
  };

  const handleSkillsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill(skillsInput);
    }
  };

  const handleStackKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddStack(stackInput);
    }
  };

  const filteredSkills = availableSkills.filter(
    (skill) =>
      skill.toLowerCase().includes(skillsInput.toLowerCase()) &&
      !formData.skills.includes(skill),
  );

  const filteredStack = availableStack.filter(
    (tool) =>
      tool.name.toLowerCase().includes(stackInput.toLowerCase()) &&
      !formData.stack.some((s) => s.name === tool.name),
  );
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
                placeholder="e.g., Senior Product Designer at Tech Co"
                className="px-[12px] py-[18px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
              />
            </div>

            {/* Category */}
            <div className="flex flex-col gap-[10px]">
              <label className="text-[13px] font-normal text-black font-inter-tight">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => onInputChange("category", e.target.value)}
                placeholder="e.g., Lead Product Designer"
                className="px-[12px] py-[18px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
              />
            </div>

            {/* Availability */}
            <div className="flex flex-col gap-[10px]">
              <label className="text-[13px] font-normal text-black font-inter-tight">
                Availability
              </label>
              <input
                type="text"
                value={formData.availability}
                onChange={(e) => onInputChange("availability", e.target.value)}
                placeholder="e.g., Available - Freelance/Contract"
                className="px-[12px] py-[18px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
              />
            </div>

            {/* Skills */}
            <div className="flex flex-col gap-[10px]">
              <label className="text-[13px] font-normal text-black font-inter-tight">
                Skills
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => {
                    setSkillsInput(e.target.value);
                    setShowSkillsDropdown(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowSkillsDropdown(skillsInput.length > 0)}
                  onBlur={() => setTimeout(() => setShowSkillsDropdown(false), 200)}
                  onKeyDown={handleSkillsKeyDown}
                  placeholder="Type a skill and press Enter..."
                  className="w-full px-[12px] py-[18px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                />
                {showSkillsDropdown && filteredSkills.length > 0 && (
                  <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-[#E1E4EA] rounded-[8px] shadow-lg max-h-[200px] overflow-y-auto">
                    {filteredSkills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleAddSkill(skill)}
                        className="w-full text-left px-3 py-2 text-[13px] font-inter-tight text-black hover:bg-[#F5F5F5] transition-colors"
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <SkillTag
                      key={skill}
                      skill={skill}
                      onRemove={() => onRemoveSkill(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Stack / Tools */}
            <div className="flex flex-col gap-[10px]">
              <label className="text-[13px] font-normal text-black font-inter-tight">
                Stack / Tools
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={stackInput}
                  onChange={(e) => {
                    setStackInput(e.target.value);
                    setShowStackDropdown(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowStackDropdown(stackInput.length > 0)}
                  onBlur={() => setTimeout(() => setShowStackDropdown(false), 200)}
                  onKeyDown={handleStackKeyDown}
                  placeholder="Type a tool name..."
                  className="w-full px-[12px] py-[18px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                />
                {showStackDropdown && filteredStack.length > 0 && (
                  <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-[#E1E4EA] rounded-[8px] shadow-lg max-h-[200px] overflow-y-auto">
                    {filteredStack.map((tool) => (
                      <button
                        key={tool.name}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleAddStack(tool.name)}
                        className="w-full text-left px-3 py-2 text-[13px] font-inter-tight text-black hover:bg-[#F5F5F5] transition-colors flex items-center gap-2"
                      >
                        <span>{tool.icon}</span>
                        <span>{tool.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {formData.stack.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.stack.map((tool, index) => (
                    <StackTag
                      key={tool.name}
                      tool={tool}
                      onRemove={() => onRemoveStack(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Next Button */}
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={onNext}
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
