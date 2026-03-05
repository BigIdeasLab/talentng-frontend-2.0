"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { X, Search, ChevronDown } from "lucide-react";
import skillsData from "@/lib/data/skills.json";
import toolsData from "@/lib/data/tools.json";
import statesCitiesData from "@/lib/data/states-cities.json";

export type AvailabilityType =
  | "Full Time"
  | "Part Time"
  | "Contract"
  | "Internship"
  | "Volunteer"
  | "Freelance"
  | "Remote"
  | "Hybrid"
  | "On Site";

const AVAILABILITY_OPTIONS: AvailabilityType[] = [
  "Full Time",
  "Part Time",
  "Contract",
  "Internship",
  "Volunteer",
  "Freelance",
  "Remote",
  "Hybrid",
  "On Site",
];

export interface FilterState {
  skills: string[];
  stack: string[];
  location: string;
  availability: string[];
  headline: string;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

export function FilterModal({
  isOpen,
  onClose,
  onApply,
  initialFilters,
}: FilterModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const skillRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const availabilityRef = useRef<HTMLDivElement>(null);
  const [skillSearch, setSkillSearch] = useState("");
  const [stackSearch, setStackSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [availabilitySearch, setAvailabilitySearch] = useState("");
  const [isSkillOpen, setIsSkillOpen] = useState(false);
  const [isStackOpen, setIsStackOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>(
    initialFilters || {
      skills: [],
      stack: [],
      location: "",
      availability: [],
      headline: "",
    },
  );

  const filteredSkills = useMemo(() => {
    return skillsData.filter((skill) =>
      skill.toLowerCase().includes(skillSearch.toLowerCase()),
    );
  }, [skillSearch]);

  const filteredStack = useMemo(() => {
    return toolsData
      .filter((tool) =>
        tool.name.toLowerCase().includes(stackSearch.toLowerCase()),
      )
      .map((tool) => tool.name);
  }, [stackSearch]);

  const filteredAvailability = useMemo(() => {
    return AVAILABILITY_OPTIONS.filter((option) =>
      option.toLowerCase().includes(availabilitySearch.toLowerCase()),
    );
  }, [availabilitySearch]);

  const filteredLocations = useMemo(() => {
    const searchLower = locationSearch.toLowerCase();
    return Object.keys(statesCitiesData).filter((state) =>
      state.toLowerCase().includes(searchLower),
    );
  }, [locationSearch]);

  const handleClearFilter = () => {
    const emptyFilters: FilterState = {
      skills: [],
      stack: [],
      location: "",
      availability: [],
      headline: "",
    };
    setFilters(emptyFilters);
    setSkillSearch("");
    setStackSearch("");
    setLocationSearch("");
    setAvailabilitySearch("");
    onApply(emptyFilters);
    onClose();
  };

  const handleApplyFilter = useCallback(() => {
    onApply(filters);
    onClose();
  }, [filters, onApply, onClose]);

  const toggleSkill = (skill: string) => {
    setFilters((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const toggleStack = (tool: string) => {
    setFilters((prev) => ({
      ...prev,
      stack: prev.stack.includes(tool)
        ? prev.stack.filter((t) => t !== tool)
        : [...prev.stack, tool],
    }));
  };

  const toggleAvailability = (option: string) => {
    setFilters((prev) => ({
      ...prev,
      availability: prev.availability.includes(option)
        ? prev.availability.filter((a) => a !== option)
        : [...prev.availability, option],
    }));
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleApplyFilter();
      }

      // Close skill dropdown if clicking outside of it
      if (
        isSkillOpen &&
        skillRef.current &&
        !skillRef.current.contains(event.target as Node)
      ) {
        setIsSkillOpen(false);
      }

      // Close stack dropdown if clicking outside of it
      if (
        isStackOpen &&
        stackRef.current &&
        !stackRef.current.contains(event.target as Node)
      ) {
        setIsStackOpen(false);
      }

      // Close location dropdown if clicking outside of it
      if (
        isLocationOpen &&
        locationRef.current &&
        !locationRef.current.contains(event.target as Node)
      ) {
        setIsLocationOpen(false);
      }

      // Close availability dropdown if clicking outside of it
      if (
        isAvailabilityOpen &&
        availabilityRef.current &&
        !availabilityRef.current.contains(event.target as Node)
      ) {
        setIsAvailabilityOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [
    isSkillOpen,
    isStackOpen,
    isLocationOpen,
    isAvailabilityOpen,
    handleApplyFilter,
  ]);

  useEffect(() => {
    const scrollSection = (ref: React.RefObject<HTMLDivElement>) => {
      setTimeout(() => {
        ref.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);
    };

    if (isSkillOpen) scrollSection(skillRef);
    if (isStackOpen) scrollSection(stackRef);
    if (isLocationOpen) scrollSection(locationRef);
    if (isAvailabilityOpen) scrollSection(availabilityRef);
  }, [isSkillOpen, isStackOpen, isLocationOpen, isAvailabilityOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/5"
        onClick={handleApplyFilter}
      />

      <div className="absolute top-[100%] right-0 mt-2 z-50" ref={modalRef}>
        <div className="w-[245px] flex flex-col gap-[12px] rounded-[12px] bg-white shadow-[0_0_15px_0_rgba(0,0,0,0.15)] p-[12px_8px] max-h-[90vh]">
          <div className="flex flex-col gap-[12px] overflow-y-auto max-h-[420px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Headline Input */}
            <div className="flex flex-col gap-[8px] w-full">
              <span className="text-[11px] font-normal text-black font-inter-tight capitalize">
                Headline
              </span>
              <div className="flex items-center gap-[4px] px-[6px] py-[10px] h-[33px] border border-[#E1E4EA] rounded-[8px] bg-white">
                <input
                  type="text"
                  placeholder="Enter Headline"
                  value={filters.headline}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      headline: e.target.value,
                    }))
                  }
                  className="flex-1 text-[11px] font-normal font-inter-tight placeholder:text-black/30 placeholder:capitalize border-0 focus:outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Skills Dropdown */}
            <div className="flex flex-col gap-[8px] w-full" ref={skillRef}>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-normal text-black font-inter-tight capitalize">
                  Select Skills
                </span>
                <button onClick={() => setIsSkillOpen(!isSkillOpen)}>
                  <ChevronDown className="w-3 h-3 text-[#B2B2B2]" />
                </button>
              </div>
              <div className="relative">
                <div className="flex items-center gap-[4px] px-[6px] py-[10px] border border-[#E1E4EA] rounded-[8px] bg-white">
                  <Search className="w-[12px] h-[12px] text-[#B2B2B2]" />
                  <input
                    type="text"
                    placeholder="Search Skills"
                    value={skillSearch}
                    onChange={(e) => setSkillSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (
                          skillSearch.trim() &&
                          !filters.skills.includes(skillSearch)
                        ) {
                          toggleSkill(skillSearch);
                          setSkillSearch("");
                          setIsSkillOpen(false);
                        }
                      }
                    }}
                    onFocus={() => setIsSkillOpen(true)}
                    className="flex-1 text-[11px] font-normal font-inter-tight placeholder:text-black/30 placeholder:capitalize border-0 focus:outline-none bg-transparent"
                  />
                </div>
                {isSkillOpen && skillSearch && (
                  <div className="absolute top-full mt-2 w-full max-h-[160px] overflow-y-auto bg-white rounded-[8px] shadow-[0_2px_20px_2px_rgba(0,0,0,0.15)] p-[8px] flex flex-col gap-[10px] z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {filteredSkills.length > 0 ? (
                      <>
                        {filteredSkills.map((skill) => (
                          <button
                            key={skill}
                            onClick={() => {
                              toggleSkill(skill);
                              setIsSkillOpen(false);
                              setSkillSearch("");
                            }}
                            className="text-left px-[2px] py-[2px] text-[11px] font-normal text-black font-inter-tight capitalize hover:bg-gray-50 rounded"
                          >
                            {skill}
                          </button>
                        ))}
                        {skillSearch.trim() &&
                          !skillsData.includes(skillSearch) && (
                            <button
                              onClick={() => {
                                toggleSkill(skillSearch);
                                setSkillSearch("");
                                setIsSkillOpen(false);
                              }}
                              className="text-left px-[2px] py-[2px] text-[11px] font-normal text-[#5C30FF] bg-[#5C30FF]/5 hover:bg-[#5C30FF]/10 rounded border-t border-[#E1E4EA]"
                            >
                              + Add "{skillSearch}" as custom skill
                            </button>
                          )}
                      </>
                    ) : skillSearch.trim() ? (
                      <button
                        onClick={() => {
                          toggleSkill(skillSearch);
                          setSkillSearch("");
                          setIsSkillOpen(false);
                        }}
                        className="text-left px-[2px] py-[2px] text-[11px] font-normal text-[#5C30FF] bg-[#5C30FF]/5 hover:bg-[#5C30FF]/10 rounded"
                      >
                        + Add "{skillSearch}" as custom skill
                      </button>
                    ) : null}
                  </div>
                )}
              </div>
              {/* Selected Skills */}
              {filters.skills.length > 0 && (
                <div className="flex flex-wrap gap-[4px] mt-1">
                  {filters.skills.map((skill) => (
                    <div
                      key={skill}
                      className="flex items-center gap-[5px] px-[7px] py-[8px] bg-[#F5F5F5] rounded-[25px]"
                    >
                      <span className="text-[10px] font-normal text-black font-inter-tight">
                        {skill}
                      </span>
                      <button onClick={() => toggleSkill(skill)}>
                        <X className="w-[10px] h-[10px] text-[#606060]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stack Dropdown */}
            <div className="flex flex-col gap-[8px] w-full" ref={stackRef}>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-normal text-black font-inter-tight capitalize">
                  Select Stack
                </span>
                <button onClick={() => setIsStackOpen(!isStackOpen)}>
                  <ChevronDown className="w-3 h-3 text-[#B2B2B2]" />
                </button>
              </div>
              <div className="relative">
                <div className="flex items-center gap-[4px] px-[6px] py-[10px] border border-[#E1E4EA] rounded-[8px] bg-white">
                  <Search className="w-[12px] h-[12px] text-[#B2B2B2]" />
                  <input
                    type="text"
                    placeholder="Search Stack"
                    value={stackSearch}
                    onChange={(e) => setStackSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (
                          stackSearch.trim() &&
                          !filters.stack.includes(stackSearch)
                        ) {
                          toggleStack(stackSearch);
                          setStackSearch("");
                          setIsStackOpen(false);
                        }
                      }
                    }}
                    onFocus={() => setIsStackOpen(true)}
                    className="flex-1 text-[11px] font-normal font-inter-tight placeholder:text-black/30 placeholder:capitalize border-0 focus:outline-none bg-transparent"
                  />
                </div>
                {isStackOpen && stackSearch && (
                  <div className="absolute top-full mt-2 w-full max-h-[160px] overflow-y-auto bg-white rounded-[8px] shadow-[0_2px_20px_2px_rgba(0,0,0,0.15)] p-[8px] flex flex-col gap-[10px] z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {filteredStack.length > 0 ? (
                      <>
                        {filteredStack.map((tool) => (
                          <button
                            key={tool}
                            onClick={() => {
                              toggleStack(tool);
                              setIsStackOpen(false);
                              setStackSearch("");
                            }}
                            className="text-left px-[2px] py-[2px] text-[11px] font-normal text-black font-inter-tight capitalize hover:bg-gray-50 rounded"
                          >
                            {tool}
                          </button>
                        ))}
                        {stackSearch.trim() &&
                          !filteredStack.includes(stackSearch) && (
                            <button
                              onClick={() => {
                                toggleStack(stackSearch);
                                setStackSearch("");
                                setIsStackOpen(false);
                              }}
                              className="text-left px-[2px] py-[2px] text-[11px] font-normal text-[#5C30FF] bg-[#5C30FF]/5 hover:bg-[#5C30FF]/10 rounded border-t border-[#E1E4EA]"
                            >
                              + Add "{stackSearch}" as custom tool
                            </button>
                          )}
                      </>
                    ) : stackSearch.trim() ? (
                      <button
                        onClick={() => {
                          toggleStack(stackSearch);
                          setStackSearch("");
                          setIsStackOpen(false);
                        }}
                        className="text-left px-[2px] py-[2px] text-[11px] font-normal text-[#5C30FF] bg-[#5C30FF]/5 hover:bg-[#5C30FF]/10 rounded"
                      >
                        + Add "{stackSearch}" as custom tool
                      </button>
                    ) : null}
                  </div>
                )}
              </div>
              {/* Selected Stack */}
              {filters.stack.length > 0 && (
                <div className="flex flex-wrap gap-[4px] mt-1">
                  {filters.stack.map((tool) => (
                    <div
                      key={tool}
                      className="flex items-center gap-[5px] px-[7px] py-[8px] bg-[#F5F5F5] rounded-[25px]"
                    >
                      <span className="text-[10px] font-normal text-black font-inter-tight">
                        {tool}
                      </span>
                      <button onClick={() => toggleStack(tool)}>
                        <X className="w-[10px] h-[10px] text-[#606060]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Location Dropdown */}
            <div className="flex flex-col gap-[8px] w-full" ref={locationRef}>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-normal text-black font-inter-tight capitalize">
                  Select Location
                </span>
                <button onClick={() => setIsLocationOpen(!isLocationOpen)}>
                  <ChevronDown className="w-3 h-3 text-[#B2B2B2]" />
                </button>
              </div>
              <div className="relative">
                <div className="flex items-center gap-[4px] px-[6px] py-[10px] h-[33px] border border-[#E1E4EA] rounded-[8px] bg-white">
                  <input
                    type="text"
                    placeholder="Enter Location"
                    value={filters.location || locationSearch}
                    onChange={(e) => {
                      setLocationSearch(e.target.value);
                      setFilters((prev) => ({ ...prev, location: "" }));
                    }}
                    onFocus={() => setIsLocationOpen(true)}
                    className="flex-1 text-[11px] font-normal font-inter-tight placeholder:text-black/30 placeholder:capitalize border-0 focus:outline-none bg-transparent"
                  />
                </div>
                {isLocationOpen && filteredLocations.length > 0 && (
                  <div className="absolute top-full mt-2 w-full max-h-[160px] overflow-y-auto bg-white rounded-[8px] shadow-[0_2px_20px_2px_rgba(0,0,0,0.15)] p-[8px] flex flex-col gap-[10px] z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {filteredLocations.map((location) => (
                      <button
                        key={location}
                        onClick={() => {
                          setFilters((prev) => ({ ...prev, location }));
                          setIsLocationOpen(false);
                          setLocationSearch("");
                        }}
                        className="text-left px-[2px] py-[2px] text-[11px] font-normal text-black font-inter-tight capitalize hover:bg-gray-50 rounded"
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Availability Dropdown */}
            <div
              className="flex flex-col gap-[8px] w-full"
              ref={availabilityRef}
            >
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-normal text-black font-inter-tight capitalize">
                  Availability
                </span>
                <button
                  onClick={() => setIsAvailabilityOpen(!isAvailabilityOpen)}
                >
                  <ChevronDown className="w-3 h-3 text-[#B2B2B2]" />
                </button>
              </div>
              <div className="relative">
                <div className="flex items-center gap-[4px] px-[6px] py-[10px] border border-[#E1E4EA] rounded-[8px] bg-white">
                  <Search className="w-[12px] h-[12px] text-[#B2B2B2]" />
                  <input
                    type="text"
                    placeholder="Search Availability"
                    value={availabilitySearch}
                    onChange={(e) => setAvailabilitySearch(e.target.value)}
                    onFocus={() => setIsAvailabilityOpen(true)}
                    className="flex-1 text-[11px] font-normal font-inter-tight placeholder:text-black/30 placeholder:capitalize border-0 focus:outline-none bg-transparent"
                  />
                </div>
                {isAvailabilityOpen && (
                  <div className="absolute top-full mt-2 w-full max-h-[160px] overflow-y-auto bg-white rounded-[8px] shadow-[0_2px_20px_2px_rgba(0,0,0,0.15)] p-[8px] flex flex-col gap-[10px] z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {filteredAvailability.length > 0 ? (
                      filteredAvailability.map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            toggleAvailability(option);
                            setAvailabilitySearch("");
                            setIsAvailabilityOpen(false);
                          }}
                          className="text-left px-[2px] py-[2px] text-[11px] font-normal text-black font-inter-tight capitalize hover:bg-gray-50 rounded"
                        >
                          {option}
                        </button>
                      ))
                    ) : (
                      <span className="text-[11px] text-black/40 px-[2px] py-[2px]">
                        No options found
                      </span>
                    )}
                  </div>
                )}
              </div>
              {/* Selected Availability */}
              {filters.availability.length > 0 && (
                <div className="flex flex-wrap gap-[4px] mt-1">
                  {filters.availability.map((option) => (
                    <div
                      key={option}
                      className="flex items-center gap-[5px] px-[7px] py-[8px] bg-[#F5F5F5] rounded-[25px]"
                    >
                      <span className="text-[10px] font-normal text-black font-inter-tight">
                        {option}
                      </span>
                      <button onClick={() => toggleAvailability(option)}>
                        <X className="w-[10px] h-[10px] text-[#606060]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-[4px]">
            <button
              onClick={handleClearFilter}
              className="flex-1 flex items-center justify-center px-4 py-[13px] border border-[#E1E4EA] rounded-[8px] bg-white"
            >
              <span className="text-[11px] font-normal text-black text-center font-aeonik-trial">
                Clear Filter
              </span>
            </button>
            <button
              onClick={handleApplyFilter}
              className="flex-1 flex items-center justify-center px-4 py-[13px] border border-[#5C30FF] rounded-[8px] bg-[#5C30FF]"
            >
              <span className="text-[11px] font-normal text-white text-center font-aeonik-trial">
                Apply Filter
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
