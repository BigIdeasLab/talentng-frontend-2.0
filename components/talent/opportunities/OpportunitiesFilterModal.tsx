"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { X, Search, ChevronDown } from "lucide-react";
import categoriesData from "@/lib/data/categories.json";
import skillsData from "@/lib/data/skills.json";
import statesCitiesData from "@/lib/data/states-cities.json";
import { useRoleColors } from "@/lib/theme/RoleColorContext";

export interface OpportunitiesFilterState {
  types: string[];
  skills: string[];
  categories?: string[];
  experienceLevels?: string[];
  location?: string;
  minBudget?: number;
  maxBudget?: number;
}

interface OpportunitiesFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: OpportunitiesFilterState) => void;
  initialFilters?: OpportunitiesFilterState;
  availableSkills: string[];
}

const EXPERIENCE_LEVELS = [
  { display: "Entry Level", value: "Entry" },
  { display: "Intermediate", value: "Intermediate" },
  { display: "Senior", value: "Senior" },
  { display: "Expert", value: "Expert" },
];

const STATES = Object.keys(statesCitiesData);

export function OpportunitiesFilterModal({
  isOpen,
  onClose,
  onApply,
  initialFilters,
  availableSkills,
}: OpportunitiesFilterModalProps) {
  const { primary } = useRoleColors();
  const modalRef = useRef<HTMLDivElement>(null);
  const skillRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const budgetRef = useRef<HTMLDivElement>(null);
  const [skillSearch, setSkillSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [experienceSearch, setExperienceSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [isSkillOpen, setIsSkillOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isExperienceOpen, setIsExperienceOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(true);

  const [filters, setFilters] = useState<OpportunitiesFilterState>(
    initialFilters || {
      types: [],
      skills: [],
      categories: [],
      experienceLevels: [],
      location: "",
      minBudget: 0,
      maxBudget: 0,
    },
  );

  const filteredSkills = useMemo(() => {
    return skillsData.filter(
      (skill) =>
        skill.toLowerCase().includes(skillSearch.toLowerCase()) &&
        !filters.skills.includes(skill),
    );
  }, [skillSearch, filters.skills]);

  const filteredCategories = useMemo(() => {
    return categoriesData.filter(
      (category) =>
        category.toLowerCase().includes(categorySearch.toLowerCase()) &&
        !(filters.categories || []).includes(category),
    );
  }, [categorySearch, filters.categories]);

  const filteredExperienceLevels = useMemo(() => {
    return EXPERIENCE_LEVELS.filter(
      (level) =>
        level.display.toLowerCase().includes(experienceSearch.toLowerCase()) ||
        level.value.toLowerCase().includes(experienceSearch.toLowerCase()),
    );
  }, [experienceSearch]);

  const filteredLocations = useMemo(() => {
    return STATES.filter((state) =>
      state.toLowerCase().includes(locationSearch.toLowerCase()),
    );
  }, [locationSearch]);

  const handleClearFilter = () => {
    const emptyFilters: OpportunitiesFilterState = {
      types: [],
      skills: [],
      categories: [],
      experienceLevels: [],
      location: "",
      minBudget: 0,
      maxBudget: 0,
    };
    setFilters(emptyFilters);
    setSkillSearch("");
    setCategorySearch("");
    setExperienceSearch("");
    setLocationSearch("");
    onApply(emptyFilters);
    onClose();
  };

  const handleApplyFilter = () => {
    onApply(filters);
    onClose();
  };

  const toggleSkill = (skill: string) => {
    setFilters((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const toggleCategory = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: (prev.categories || []).includes(category)
        ? prev.categories!.filter((c) => c !== category)
        : [...(prev.categories || []), category],
    }));
  };

  const toggleExperienceLevel = (level: string) => {
    setFilters((prev) => ({
      ...prev,
      experienceLevels: (prev.experienceLevels || []).includes(level)
        ? prev.experienceLevels!.filter((l) => l !== level)
        : [...(prev.experienceLevels || []), level],
    }));
  };

  const selectLocation = (state: string) => {
    setFilters((prev) => ({
      ...prev,
      location: prev.location === state ? "" : state,
    }));
  };

  const handleBudgetChange = (
    field: "minBudget" | "maxBudget",
    value: string,
  ) => {
    // Strip commas before parsing
    const numValue = parseInt(value.replace(/,/g, "")) || 0;
    setFilters((prev) => ({
      ...prev,
      [field]: numValue,
    }));
  };

  const formatBudget = (value: number | undefined): string => {
    if (!value) return "";
    return value.toLocaleString();
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

      const refs = [
        { open: isSkillOpen, ref: skillRef, set: setIsSkillOpen },
        { open: isCategoryOpen, ref: categoryRef, set: setIsCategoryOpen },
        {
          open: isExperienceOpen,
          ref: experienceRef,
          set: setIsExperienceOpen,
        },
        { open: isLocationOpen, ref: locationRef, set: setIsLocationOpen },
        { open: isBudgetOpen, ref: budgetRef, set: setIsBudgetOpen },
      ];

      refs.forEach(({ open, ref, set }) => {
        if (
          open &&
          ref.current &&
          !ref.current.contains(event.target as Node)
        ) {
          set(false);
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [
    isOpen,
    onClose,
    handleApplyFilter,
    isSkillOpen,
    isCategoryOpen,
    isExperienceOpen,
    isLocationOpen,
    isBudgetOpen,
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

    if (isCategoryOpen) scrollSection(categoryRef);
    if (isSkillOpen) scrollSection(skillRef);
    if (isExperienceOpen) scrollSection(experienceRef);
    if (isLocationOpen) scrollSection(locationRef);
    if (isBudgetOpen) scrollSection(budgetRef);
  }, [
    isCategoryOpen,
    isSkillOpen,
    isExperienceOpen,
    isLocationOpen,
    isBudgetOpen,
  ]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 md:bg-black/5"
        onClick={handleApplyFilter}
      />

      {/* Modal Content */}
      <div
        className={`
          fixed z-50 bg-white
          md:absolute md:top-full md:right-0 md:mt-2 md:w-[245px] md:rounded-[12px] md:shadow-[0_0_15px_0_rgba(0,0,0,0.15)]
          top-16 left-0 right-0 bottom-0 md:top-auto md:left-auto md:right-0 md:bottom-auto
        `}
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-[#E1E4EA] bg-white sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-black font-inter-tight">
            Filter Opportunities
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex flex-col gap-[12px] p-[12px_8px] md:p-[12px_8px] max-h-[calc(100vh-8rem)] md:max-h-[90vh] overflow-y-auto">
          <div className="flex flex-col gap-[12px] md:gap-[12px] md:overflow-y-auto md:max-h-[70vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Category Dropdown */}
            <div className="flex flex-col gap-[8px] w-full" ref={categoryRef}>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-normal text-black font-inter-tight capitalize">
                  Category
                </span>
                <button onClick={() => setIsCategoryOpen(!isCategoryOpen)}>
                  <ChevronDown className="w-3 h-3 text-[#B2B2B2]" />
                </button>
              </div>
              <div className="relative">
                <div className="flex items-center gap-[4px] px-[6px] py-[10px] border border-[#E1E4EA] rounded-[8px] bg-white">
                  <Search className="w-[12px] h-[12px] text-[#B2B2B2]" />
                  <input
                    type="text"
                    placeholder="Search Category"
                    value={categorySearch}
                    onChange={(e) => {
                      setCategorySearch(e.target.value);
                      setIsCategoryOpen(true);
                    }}
                    onFocus={() => setIsCategoryOpen(true)}
                    className="flex-1 text-[11px] font-normal font-inter-tight placeholder:text-black/30 placeholder:capitalize border-0 focus:outline-none bg-transparent"
                  />
                </div>
                {isCategoryOpen && categorySearch && (
                  <div className="absolute top-full mt-2 w-full max-h-[160px] overflow-y-auto bg-white rounded-[8px] shadow-[0_2px_20px_2px_rgba(0,0,0,0.15)] p-[8px] flex flex-col gap-[10px] z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {filteredCategories.length > 0 &&
                      filteredCategories.map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            toggleCategory(category);
                            setIsCategoryOpen(false);
                            setCategorySearch("");
                          }}
                          className="text-left px-[2px] py-[2px] text-[11px] font-normal text-black font-inter-tight capitalize hover:bg-gray-50 rounded"
                        >
                          {category}
                        </button>
                      ))}
                  </div>
                )}
              </div>
              {/* Selected Categories */}
              {filters.categories && filters.categories.length > 0 && (
                <div className="flex flex-wrap gap-[4px] mt-1">
                  {filters.categories.map((category) => (
                    <div
                      key={category}
                      className="flex items-center gap-[5px] px-[7px] py-[8px] bg-[#F5F5F5] rounded-[25px]"
                    >
                      <span className="text-[10px] font-normal text-black font-inter-tight">
                        {category}
                      </span>
                      <button onClick={() => toggleCategory(category)}>
                        <X className="w-[10px] h-[10px] text-[#606060]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Skills Dropdown */}
            <div className="flex flex-col gap-[8px] w-full" ref={skillRef}>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-normal text-black font-inter-tight capitalize">
                  Skills
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
                              className="text-left px-[2px] py-[2px] text-[11px] font-normal rounded border-t border-[#E1E4EA] hover:opacity-80"
                              style={{
                                color: primary,
                                backgroundColor: `${primary}0D`,
                              }}
                            >
                              + Add &quot;{skillSearch}&quot; as custom skill
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
                        className="text-left px-[2px] py-[2px] text-[11px] font-normal rounded hover:opacity-80"
                        style={{
                          color: primary,
                          backgroundColor: `${primary}0D`,
                        }}
                      >
                        + Add &quot;{skillSearch}&quot; as custom skill
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

            {/* Experience Level Dropdown */}
            <div className="flex flex-col gap-[8px] w-full" ref={experienceRef}>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-normal text-black font-inter-tight capitalize">
                  Experience Level
                </span>
                <button onClick={() => setIsExperienceOpen(!isExperienceOpen)}>
                  <ChevronDown className="w-3 h-3 text-[#B2B2B2]" />
                </button>
              </div>
              <div className="relative">
                <div className="flex items-center gap-[4px] px-[6px] py-[10px] border border-[#E1E4EA] rounded-[8px] bg-white">
                  <Search className="w-[12px] h-[12px] text-[#B2B2B2]" />
                  <input
                    type="text"
                    placeholder="Search Experience"
                    value={experienceSearch}
                    onChange={(e) => setExperienceSearch(e.target.value)}
                    onFocus={() => setIsExperienceOpen(true)}
                    className="flex-1 text-[11px] font-normal font-inter-tight placeholder:text-black/30 placeholder:capitalize border-0 focus:outline-none bg-transparent"
                  />
                </div>
                {isExperienceOpen && filteredExperienceLevels.length > 0 && (
                  <div className="absolute top-full mt-2 w-full max-h-[160px] overflow-y-auto bg-white rounded-[8px] shadow-[0_2px_20px_2px_rgba(0,0,0,0.15)] p-[8px] flex flex-col gap-[10px] z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {filteredExperienceLevels.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => {
                          toggleExperienceLevel(level.value);
                          setIsExperienceOpen(false);
                          setExperienceSearch("");
                        }}
                        className="text-left px-[2px] py-[2px] text-[11px] font-normal text-black font-inter-tight capitalize hover:bg-gray-50 rounded"
                      >
                        {level.display}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Selected Experience Levels */}
              {filters.experienceLevels &&
                filters.experienceLevels.length > 0 && (
                  <div className="flex flex-wrap gap-[4px] mt-1">
                    {filters.experienceLevels.map((level) => {
                      const levelObj = EXPERIENCE_LEVELS.find(
                        (l) => l.value === level,
                      );
                      return (
                        <div
                          key={level}
                          className="flex items-center gap-[5px] px-[7px] py-[8px] bg-[#F5F5F5] rounded-[25px]"
                        >
                          <span className="text-[10px] font-normal text-black font-inter-tight">
                            {levelObj?.display || level}
                          </span>
                          <button onClick={() => toggleExperienceLevel(level)}>
                            <X className="w-[10px] h-[10px] text-[#606060]" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
            </div>

            {/* Location (State) Dropdown */}
            <div className="flex flex-col gap-[8px] w-full" ref={locationRef}>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-normal text-black font-inter-tight capitalize">
                  Location
                </span>
                <button onClick={() => setIsLocationOpen(!isLocationOpen)}>
                  <ChevronDown className="w-3 h-3 text-[#B2B2B2]" />
                </button>
              </div>
              <div className="relative">
                <div className="flex items-center gap-[4px] px-[6px] py-[10px] border border-[#E1E4EA] rounded-[8px] bg-white">
                  <Search className="w-[12px] h-[12px] text-[#B2B2B2]" />
                  <input
                    type="text"
                    placeholder="Search State"
                    value={locationSearch}
                    onChange={(e) => {
                      setLocationSearch(e.target.value);
                      setIsLocationOpen(true);
                    }}
                    onFocus={() => setIsLocationOpen(true)}
                    className="flex-1 text-[11px] font-normal font-inter-tight placeholder:text-black/30 placeholder:capitalize border-0 focus:outline-none bg-transparent"
                  />
                </div>
                {isLocationOpen && (
                  <div className="absolute top-full mt-2 w-full max-h-[160px] overflow-y-auto bg-white rounded-[8px] shadow-[0_2px_20px_2px_rgba(0,0,0,0.15)] p-[8px] flex flex-col gap-[6px] z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {filteredLocations.length > 0 ? (
                      filteredLocations.map((state) => (
                        <button
                          key={state}
                          onClick={() => {
                            selectLocation(state);
                            setIsLocationOpen(false);
                            setLocationSearch("");
                          }}
                          className={`text-left px-[2px] py-[2px] text-[11px] font-normal font-inter-tight hover:bg-gray-50 rounded ${
                            filters.location === state
                              ? "font-medium"
                              : "text-black"
                          }`}
                          style={
                            filters.location === state
                              ? { color: primary }
                              : undefined
                          }
                        >
                          {state}
                        </button>
                      ))
                    ) : (
                      <span className="text-[11px] text-black/40 px-[2px] py-[2px]">
                        No states found
                      </span>
                    )}
                  </div>
                )}
              </div>
              {/* Selected Location */}
              {filters.location && (
                <div className="flex flex-wrap gap-[4px]">
                  <div className="flex items-center gap-[5px] px-[7px] py-[8px] bg-[#F5F5F5] rounded-[25px]">
                    <span className="text-[10px] font-normal text-black font-inter-tight">
                      {filters.location}
                    </span>
                    <button onClick={() => selectLocation(filters.location!)}>
                      <X className="w-[10px] h-[10px] text-[#606060]" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Budget Range Section - always open */}
            <div className="flex flex-col gap-[8px] w-full" ref={budgetRef}>
              <span className="text-[11px] font-normal text-black font-inter-tight capitalize">
                Budget Range (NGN)
              </span>
              <div className="grid grid-cols-2 gap-[8px]">
                <div className="flex flex-col gap-[4px]">
                  <span className="text-[9px] text-[#B2B2B2] font-inter-tight">
                    Min Budget
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={formatBudget(filters.minBudget)}
                    onChange={(e) =>
                      handleBudgetChange("minBudget", e.target.value)
                    }
                    className="w-full px-[6px] py-[10px] border border-[#E1E4EA] rounded-[8px] text-[11px] font-normal font-inter-tight focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-[4px]">
                  <span className="text-[9px] text-[#B2B2B2] font-inter-tight">
                    Max Budget
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Any"
                    value={formatBudget(filters.maxBudget)}
                    onChange={(e) =>
                      handleBudgetChange("maxBudget", e.target.value)
                    }
                    className="w-full px-[6px] py-[10px] border border-[#E1E4EA] rounded-[8px] text-[11px] font-normal font-inter-tight focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Footer - Sticky at bottom */}
          <div className="md:hidden sticky bottom-0 left-0 right-0 bg-white border-t border-[#E1E4EA] p-4 flex gap-3">
            <button
              onClick={handleClearFilter}
              className="flex-1 flex items-center justify-center px-4 py-3 rounded-[8px] border border-[#E1E4EA] bg-white hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-medium text-black font-inter-tight">
                Clear All
              </span>
            </button>
            <button
              onClick={handleApplyFilter}
              className="flex-1 flex items-center justify-center px-4 py-3 rounded-[8px] hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: primary,
                borderWidth: 1,
                borderColor: primary,
              }}
            >
              <span className="text-sm font-medium text-white font-inter-tight">
                Apply Filters
              </span>
            </button>
          </div>

          {/* Desktop Buttons - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-[4px]">
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
              className="flex-1 flex items-center justify-center px-4 py-[13px] rounded-[8px] hover:opacity-80"
              style={{
                backgroundColor: primary,
                borderWidth: 1,
                borderColor: primary,
              }}
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
