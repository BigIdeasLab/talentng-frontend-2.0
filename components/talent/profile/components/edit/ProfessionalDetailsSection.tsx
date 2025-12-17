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
  company: string;
  category: string;
  description: string;
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
            {/* Company */}
            <div className="flex flex-col gap-[10px]">
              <label className="text-[13px] font-normal text-black font-inter-tight">
                Company
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => onInputChange("company", e.target.value)}
                placeholder="e.g., Innovate Design Studio"
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

            {/* Description */}
            <div className="flex flex-col gap-[10px]">
              <label className="text-[13px] font-normal text-black font-inter-tight">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => onInputChange("description", e.target.value)}
                placeholder="Tell us about your professional background"
                className="min-h-[100px] px-[12px] py-[12px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent resize-none"
              />
            </div>

            {/* Skills */}
            <div className="flex flex-col gap-[10px]">
              <label className="text-[13px] font-normal text-black font-inter-tight">
                Skills
              </label>

              <div className="relative">
                <div className="flex flex-wrap gap-2 p-3 border border-[#E1E4EA] rounded-[8px] min-h-[46px]">
                  {/* Added skills as tags */}
                  {formData.skills.map((skill, index) => (
                    <SkillTag
                      key={`${skill}-${index}`}
                      skill={skill}
                      onRemove={() => onRemoveSkill(index)}
                    />
                  ))}

                  {/* Input field */}
                  <input
                    type="text"
                    placeholder={
                      formData.skills.length === 0
                        ? "Search or add skills..."
                        : ""
                    }
                    value={skillsInput}
                    onChange={(e) => {
                      setSkillsInput(e.target.value);
                      setShowSkillsDropdown(true);
                    }}
                    onKeyDown={handleSkillsKeyDown}
                    onFocus={() => setShowSkillsDropdown(true)}
                    className="flex-1 min-w-[150px] text-[13px] text-black placeholder:text-[#99A0AE] outline-none bg-transparent"
                  />
                </div>

                {/* Dropdown */}
                {showSkillsDropdown && skillsInput && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E1E4EA] rounded-[8px] shadow-lg z-10 max-h-[200px] overflow-y-auto">
                    {filteredSkills.length > 0 ? (
                      <>
                        {filteredSkills.slice(0, 8).map((skill) => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => handleAddSkill(skill)}
                            className="w-full text-left px-3 py-2 text-[13px] text-black hover:bg-gray-100 transition-colors"
                          >
                            {skill}
                          </button>
                        ))}
                        {skillsInput.trim() &&
                          !availableSkills.includes(skillsInput) && (
                            <button
                              type="button"
                              onClick={() => handleAddSkill(skillsInput)}
                              className="w-full text-left px-3 py-2 text-[13px] text-[#5C30FF] bg-[#5C30FF]/5 hover:bg-[#5C30FF]/10 font-medium border-t border-[#E1E4EA]"
                            >
                              + Add "{skillsInput}" as custom skill
                            </button>
                          )}
                      </>
                    ) : skillsInput.trim() ? (
                      <button
                        type="button"
                        onClick={() => handleAddSkill(skillsInput)}
                        className="w-full text-left px-3 py-2 text-[13px] text-[#5C30FF] bg-[#5C30FF]/5 hover:bg-[#5C30FF]/10 font-medium"
                      >
                        + Add "{skillsInput}" as custom skill
                      </button>
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            {/* Stack */}
            <div className="flex flex-col gap-[10px] overflow-visible">
              <label className="text-[13px] font-normal text-black font-inter-tight">
                Stack
              </label>

              <div className="relative overflow-visible">
                <div className="flex flex-wrap gap-2 p-3 border border-[#E1E4EA] rounded-[8px] min-h-[46px]">
                  {/* Added tools as tags */}
                  {formData.stack.map((tool, index) => (
                    <StackTag
                      key={`${tool.name}-${index}`}
                      tool={tool}
                      onRemove={() => onRemoveStack(index)}
                    />
                  ))}

                  {/* Input field */}
                  <input
                    type="text"
                    placeholder={
                      formData.stack.length === 0
                        ? "Search or add tools..."
                        : ""
                    }
                    value={stackInput}
                    onChange={(e) => {
                      setStackInput(e.target.value);
                      setShowStackDropdown(true);
                    }}
                    onKeyDown={handleStackKeyDown}
                    onFocus={() => setShowStackDropdown(true)}
                    className="flex-1 min-w-[150px] text-[13px] text-black placeholder:text-[#99A0AE] outline-none bg-transparent"
                  />
                </div>

                {/* Dropdown */}
                {showStackDropdown && stackInput && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E1E4EA] rounded-[8px] shadow-lg z-10 max-h-[300px] overflow-y-auto">
                    {filteredStack.length > 0 ? (
                      <>
                        {filteredStack.map((tool) => {
                          const toolInfo = getToolInfo(tool.name);
                          return (
                            <button
                              key={tool.name}
                              type="button"
                              onClick={() => handleAddStack(tool.name)}
                              className="w-full flex items-center gap-3 text-left px-3 py-2.5 text-[13px] text-black hover:bg-gray-100 transition-colors border-b border-gray-50 last:border-b-0"
                            >
                              <img
                                src={toolInfo.logo}
                                alt={tool.name}
                                className="w-5 h-5 object-contain flex-shrink-0"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display =
                                    "none";
                                }}
                              />
                              <div className="flex-1">
                                <div className="font-medium">{tool.name}</div>
                                <div className="text-[11px] text-gray-500">
                                  {toolInfo.category}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                        {stackInput.trim() &&
                          !availableStack.some(
                            (t) => t.name === stackInput,
                          ) && (
                            <button
                              type="button"
                              onClick={() => handleAddStack(stackInput)}
                              className="w-full text-left px-3 py-2 text-[13px] text-[#5C30FF] bg-[#5C30FF]/5 hover:bg-[#5C30FF]/10 font-medium border-t border-[#E1E4EA]"
                            >
                              + Add "{stackInput}" as custom tool
                            </button>
                          )}
                      </>
                    ) : stackInput.trim() ? (
                      <button
                        type="button"
                        onClick={() => handleAddStack(stackInput)}
                        className="w-full text-left px-3 py-2 text-[13px] text-[#5C30FF] bg-[#5C30FF]/5 hover:bg-[#5C30FF]/10 font-medium"
                      >
                        + Add "{stackInput}" as custom tool
                      </button>
                    ) : null}
                  </div>
                )}
              </div>
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
