"use client";

import { useState } from "react";
import skills from "@/lib/data/skills.json";
import toolsData from "@/lib/data/tools.json";
import { getToolInfo } from "@/lib/utils/tools";

const tools = toolsData.map((tool) => tool.name);

interface DescriptionStepProps {
  formData: {
    description: string;
    keyResponsibilities: string[];
    requirements: string[];
    tags: string[];
    tools: string[];
  };
  updateFormData: (data: Partial<DescriptionStepProps["formData"]>) => void;
  onNext: () => void;
}

export function DescriptionStep({
  formData,
  updateFormData,
  onNext,
}: DescriptionStepProps) {
  const [responsibilityInput, setResponsibilityInput] = useState("");
  const [requirementInput, setRequirementInput] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [toolsInput, setToolsInput] = useState("");
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);

  const handleAddResponsibility = () => {
    if (responsibilityInput.trim()) {
      updateFormData({
        keyResponsibilities: [
          ...formData.keyResponsibilities,
          responsibilityInput.trim(),
        ],
      });
      setResponsibilityInput("");
    }
  };

  const handleRemoveResponsibility = (index: number) => {
    updateFormData({
      keyResponsibilities: formData.keyResponsibilities.filter(
        (_, i) => i !== index,
      ),
    });
  };

  const handleAddRequirement = () => {
    if (requirementInput.trim()) {
      updateFormData({
        requirements: [...formData.requirements, requirementInput.trim()],
      });
      setRequirementInput("");
    }
  };

  const handleRemoveRequirement = (index: number) => {
    updateFormData({
      requirements: formData.requirements.filter((_, i) => i !== index),
    });
  };

  const handleResponsibilityKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddResponsibility();
    }
  };

  const handleRequirementKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddRequirement();
    }
  };

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      updateFormData({
        tags: [...formData.tags, trimmedTag],
      });
      setTagsInput("");
      setShowTagsDropdown(false);
    }
  };

  const handleRemoveTag = (index: number) => {
    updateFormData({
      tags: formData.tags.filter((_, i) => i !== index),
    });
  };

  const handleAddTool = (tool: string) => {
    const trimmedTool = tool.trim();
    if (trimmedTool && !formData.tools.includes(trimmedTool)) {
      updateFormData({
        tools: [...formData.tools, trimmedTool],
      });
      setToolsInput("");
      setShowToolsDropdown(false);
    }
  };

  const handleRemoveTool = (index: number) => {
    updateFormData({
      tools: formData.tools.filter((_, i) => i !== index),
    });
  };

  const handleTagsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag(tagsInput);
    }
  };

  const handleToolsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTool(toolsInput);
    }
  };

  const filteredSkills = skills.filter(
    (skill) =>
      skill.toLowerCase().includes(tagsInput.toLowerCase()) &&
      !formData.tags.includes(skill),
  );

  const filteredTools = tools.filter(
    (tool) =>
      tool.toLowerCase().includes(toolsInput.toLowerCase()) &&
      !formData.tools.includes(tool),
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Section Title */}
      <h2 className="font-inter-tight text-[17px] font-medium text-black">
        Describe Your Opportunity
      </h2>

      {/* Form Fields */}
      <div className="flex flex-col gap-4">
        {/* Description */}
        <div className="flex flex-col gap-2.5">
          <label className="font-inter-tight text-[13px] font-normal text-black">
            Description
          </label>
          <textarea
            placeholder="Describe the opportunity in detail"
            value={formData.description}
            onChange={(e) => updateFormData({ description: e.target.value })}
            rows={5}
            className="w-full px-3 py-3 border border-[#E1E4EA] rounded-[8px] font-inter-tight text-[13px] text-black placeholder:text-[#99A0AE] outline-none focus:border-[#5C30FF] transition-colors resize-none"
          />
        </div>

        {/* Key Responsibilities */}
        <div className="flex flex-col gap-2.5">
          <label className="font-inter-tight text-[13px] font-normal text-black">
            Key Responsibilities
          </label>
          <div className="flex flex-col gap-2 border border-[#E1E4EA] rounded-[8px] p-3">
            {/* List of added responsibilities */}
            {formData.keyResponsibilities.map((item, index) => (
              <div key={index} className="flex items-center gap-2 group">
                <span className="text-[#5C30FF] text-[14px]">•</span>
                <span className="text-[13px] text-black flex-1">{item}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveResponsibility(index)}
                  className="text-[#99A0AE] hover:text-[#E63C23] transition-colors opacity-0 group-hover:opacity-100"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 4L4 12M4 4L12 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            ))}
            {/* Input for new responsibility */}
            <div className="flex items-center gap-2">
              <span className="text-[#5C30FF] text-[14px]">•</span>
              <input
                type="text"
                placeholder="Add responsibility (press Enter)"
                value={responsibilityInput}
                onChange={(e) => setResponsibilityInput(e.target.value)}
                onKeyDown={handleResponsibilityKeyDown}
                className="text-[13px] text-black placeholder:text-[#99A0AE] outline-none flex-1 bg-transparent"
              />
              <button
                type="button"
                onClick={handleAddResponsibility}
                className="px-3 py-1 text-[12px] bg-[#5C30FF]/10 text-[#5C30FF] rounded hover:bg-[#5C30FF]/20 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="flex flex-col gap-2.5">
          <label className="font-inter-tight text-[13px] font-normal text-black">
            Requirements
          </label>
          <div className="flex flex-col gap-2 border border-[#E1E4EA] rounded-[8px] p-3">
            {/* List of added requirements */}
            {formData.requirements.map((item, index) => (
              <div key={index} className="flex items-center gap-2 group">
                <span className="text-[#5C30FF] text-[14px]">•</span>
                <span className="text-[13px] text-black flex-1">{item}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveRequirement(index)}
                  className="text-[#99A0AE] hover:text-[#E63C23] transition-colors opacity-0 group-hover:opacity-100"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 4L4 12M4 4L12 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            ))}
            {/* Input for new requirement */}
            <div className="flex items-center gap-2">
              <span className="text-[#5C30FF] text-[14px]">•</span>
              <input
                type="text"
                placeholder="Add requirement (press Enter)"
                value={requirementInput}
                onChange={(e) => setRequirementInput(e.target.value)}
                onKeyDown={handleRequirementKeyDown}
                className="text-[13px] text-black placeholder:text-[#99A0AE] outline-none flex-1 bg-transparent"
              />
              <button
                type="button"
                onClick={handleAddRequirement}
                className="px-3 py-1 text-[12px] bg-[#5C30FF]/10 text-[#5C30FF] rounded hover:bg-[#5C30FF]/20 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Tags (Skills) */}
        <div className="flex flex-col gap-2.5">
          <label className="font-inter-tight text-[13px] font-normal text-black">
            Tags (Skills)
          </label>
          <div className="relative">
            <div className="flex flex-wrap gap-2 p-3 border border-[#E1E4EA] rounded-[8px] min-h-[46px]">
              {/* Added tags as pills */}
              {formData.tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1 bg-[#5C30FF]/10 border border-[#5C30FF] rounded-full"
                >
                  <span className="text-[12px] text-[#5C30FF] font-medium">
                    {tag}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(index)}
                    className="text-[#5C30FF] hover:text-[#E63C23] transition-colors"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 4L4 12M4 4L12 12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              ))}

              {/* Input field */}
              <input
                type="text"
                placeholder={
                  formData.tags.length === 0 ? "Search or add skills..." : ""
                }
                value={tagsInput}
                onChange={(e) => {
                  setTagsInput(e.target.value);
                  setShowTagsDropdown(true);
                }}
                onKeyDown={handleTagsKeyDown}
                onFocus={() => setShowTagsDropdown(true)}
                className="flex-1 min-w-[150px] text-[13px] text-black placeholder:text-[#99A0AE] outline-none bg-transparent"
              />
            </div>

            {/* Dropdown */}
            {showTagsDropdown && tagsInput && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E1E4EA] rounded-[8px] shadow-lg z-10 max-h-[200px] overflow-y-auto">
                {filteredSkills.length > 0 ? (
                  <>
                    {filteredSkills.slice(0, 8).map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleAddTag(skill)}
                        className="w-full text-left px-3 py-2 text-[13px] text-black hover:bg-gray-100 transition-colors"
                      >
                        {skill}
                      </button>
                    ))}
                    {tagsInput.trim() && !skills.includes(tagsInput) && (
                      <button
                        type="button"
                        onClick={() => handleAddTag(tagsInput)}
                        className="w-full text-left px-3 py-2 text-[13px] text-[#5C30FF] bg-[#5C30FF]/5 hover:bg-[#5C30FF]/10 font-medium border-t border-[#E1E4EA]"
                      >
                        + Add "{tagsInput}" as custom tag
                      </button>
                    )}
                  </>
                ) : tagsInput.trim() ? (
                  <button
                    type="button"
                    onClick={() => handleAddTag(tagsInput)}
                    className="w-full text-left px-3 py-2 text-[13px] text-[#5C30FF] bg-[#5C30FF]/5 hover:bg-[#5C30FF]/10 font-medium"
                  >
                    + Add "{tagsInput}" as custom tag
                  </button>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {/* Tools */}
        <div className="flex flex-col gap-2.5">
          <label className="font-inter-tight text-[13px] font-normal text-black">
            Tools
          </label>
          <div className="relative">
            <div className="flex flex-wrap gap-2 p-3 border border-[#E1E4EA] rounded-[8px] min-h-[46px]">
              {/* Added tools as pills */}
              {formData.tools.map((tool, index) => {
                const toolInfo = getToolInfo(tool);
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-2.5 py-1.5 bg-[#5C30FF]/10 border border-[#5C30FF] rounded-full"
                  >
                    <img
                      src={toolInfo.logo}
                      alt={tool}
                      className="w-4 h-4 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <span className="text-[12px] text-[#5C30FF] font-medium">
                      {tool}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTool(index)}
                      className="text-[#5C30FF] hover:text-[#E63C23] transition-colors"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 4L4 12M4 4L12 12"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                );
              })}

              {/* Input field */}
              <input
                type="text"
                placeholder={
                  formData.tools.length === 0 ? "Search or add tools..." : ""
                }
                value={toolsInput}
                onChange={(e) => {
                  setToolsInput(e.target.value);
                  setShowToolsDropdown(true);
                }}
                onKeyDown={handleToolsKeyDown}
                onFocus={() => setShowToolsDropdown(true)}
                className="flex-1 min-w-[150px] text-[13px] text-black placeholder:text-[#99A0AE] outline-none bg-transparent"
              />
            </div>

            {/* Dropdown */}
            {showToolsDropdown && toolsInput && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E1E4EA] rounded-[8px] shadow-lg z-10 max-h-[300px] overflow-y-auto">
                {filteredTools.length > 0 ? (
                  <>
                    {filteredTools.map((tool) => {
                      const toolInfo = getToolInfo(tool);
                      return (
                        <button
                          key={tool}
                          type="button"
                          onClick={() => handleAddTool(tool)}
                          className="w-full flex items-center gap-3 text-left px-3 py-2.5 text-[13px] text-black hover:bg-gray-100 transition-colors border-b border-gray-50 last:border-b-0"
                        >
                          <img
                            src={toolInfo.logo}
                            alt={tool}
                            className="w-5 h-5 object-contain flex-shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                          <div className="flex-1">
                            <div className="font-medium">{tool}</div>
                            <div className="text-[11px] text-gray-500">
                              {toolInfo.category}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                    {toolsInput.trim() && !tools.includes(toolsInput) && (
                      <button
                        type="button"
                        onClick={() => handleAddTool(toolsInput)}
                        className="w-full text-left px-3 py-2 text-[13px] text-[#5C30FF] bg-[#5C30FF]/5 hover:bg-[#5C30FF]/10 font-medium border-t border-[#E1E4EA]"
                      >
                        + Add "{toolsInput}" as custom tool
                      </button>
                    )}
                  </>
                ) : toolsInput.trim() ? (
                  <button
                    type="button"
                    onClick={() => handleAddTool(toolsInput)}
                    className="w-full text-left px-3 py-2 text-[13px] text-[#5C30FF] bg-[#5C30FF]/5 hover:bg-[#5C30FF]/10 font-medium"
                  >
                    + Add "{toolsInput}" as custom tool
                  </button>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        className="w-full h-[44px] bg-[#181B25] border border-[#181B25] rounded-full font-inter-tight text-[14px] font-normal text-white hover:bg-[#2a2d35] transition-colors"
      >
        Next
      </button>
    </div>
  );
}
