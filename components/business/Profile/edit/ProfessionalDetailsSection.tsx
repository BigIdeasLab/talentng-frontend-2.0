import { SmoothCollapse } from "@/components/SmoothCollapse";
import { SectionHeader } from "./SectionHeader";
import { SkillTag } from "./SkillTag";
import { StackTag } from "./StackTag";
import { Button } from "@/components/ui/button";

interface StackTool {
  name: string;
  icon: string;
}

interface ProfessionalData {
  role: string;
  company: string;
  preferredRole: string;
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
  skillsDropdownOpen: boolean;
  stackDropdownOpen: boolean;
  skillsSelectRef: React.RefObject<HTMLSelectElement>;
  stackSelectRef: React.RefObject<HTMLSelectElement>;
  onSetSkillsDropdownOpen: (open: boolean) => void;
  onSetStackDropdownOpen: (open: boolean) => void;
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
  skillsSelectRef,
  stackSelectRef,
  onSetSkillsDropdownOpen,
  onSetStackDropdownOpen,
}: ProfessionalDetailsSectionProps) {
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
            {/* Role */}
            <div className="flex flex-col gap-[10px]">
              <label className="text-[13px] font-normal text-black font-inter-tight">
                Current Role
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => onInputChange("role", e.target.value)}
                placeholder="e.g., Senior UI/UX Designer"
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
                value={formData.company}
                onChange={(e) => onInputChange("company", e.target.value)}
                placeholder="e.g., Innovate Design Studio"
                className="px-[12px] py-[18px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
              />
            </div>

            {/* Preferred Role */}
            <div className="flex flex-col gap-[10px]">
              <label className="text-[13px] font-normal text-black font-inter-tight">
                Preferred Role
              </label>
              <input
                type="text"
                value={formData.preferredRole}
                onChange={(e) => onInputChange("preferredRole", e.target.value)}
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

              <select
                ref={skillsSelectRef}
                onFocus={() => onSetSkillsDropdownOpen(true)}
                onBlur={() => onSetSkillsDropdownOpen(false)}
                onChange={(e) => {
                  if (e.target.value) {
                    onAddSkill(e.target.value);
                    e.target.value = "";
                    onSetSkillsDropdownOpen(false);
                    if (skillsSelectRef.current) {
                      skillsSelectRef.current.blur();
                    }
                  }
                }}
                className="px-[12px] py-[12px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
              >
                <option value="">Select a skill</option>
                {availableSkills.map((skill) => (
                  <option
                    key={skill}
                    value={skill}
                    disabled={formData.skills.includes(skill)}
                  >
                    {skill}
                  </option>
                ))}
              </select>

              <div className="flex flex-wrap gap-[4px]">
                {formData.skills.map((skill, index) => (
                  <SkillTag
                    key={`${skill}-${index}`}
                    skill={skill}
                    onRemove={() => onRemoveSkill(index)}
                  />
                ))}
              </div>
            </div>

            {/* Stack */}
            <div className="flex flex-col gap-[10px]">
              <label className="text-[13px] font-normal text-black font-inter-tight">
                Stack
              </label>

              <select
                ref={stackSelectRef}
                onFocus={() => onSetStackDropdownOpen(true)}
                onBlur={() => onSetStackDropdownOpen(false)}
                onChange={(e) => {
                  if (e.target.value) {
                    const selectedTool = availableStack.find(
                      (t) => t.name === e.target.value,
                    );
                    if (selectedTool) {
                      onAddStack(selectedTool);
                    }
                    e.target.value = "";
                    onSetStackDropdownOpen(false);
                    if (stackSelectRef.current) {
                      stackSelectRef.current.blur();
                    }
                  }
                }}
                className="px-[12px] py-[12px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
              >
                <option value="">Select a tool</option>
                {availableStack.map((tool) => (
                  <option
                    key={tool.name}
                    value={tool.name}
                    disabled={formData.stack.some((s) => s.name === tool.name)}
                  >
                    {tool.name}
                  </option>
                ))}
              </select>

              <div className="flex flex-wrap gap-[4px]">
                {formData.stack.map((tool, index) => (
                  <StackTag
                    key={`${tool.name}-${index}`}
                    tool={tool}
                    onRemove={() => onRemoveStack(index)}
                  />
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
                value={formData.availability}
                onChange={(e) => onInputChange("availability", e.target.value)}
                placeholder="e.g., Available - Freelance/Contract"
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
      </SmoothCollapse>
    </div>
  );
}
