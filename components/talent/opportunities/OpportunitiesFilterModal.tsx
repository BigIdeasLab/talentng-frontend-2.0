"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { X, Search, ChevronDown } from "lucide-react";
import categoriesData from "@/lib/data/categories.json";
import skillsData from "@/lib/data/skills.json";
import { useRoleColors } from "@/lib/theme/RoleColorContext";

export interface OpportunitiesFilterState {
  types: string[];
  skills: string[];
  categories?: string[];
  experienceLevels?: string[];
  location?: string;
}

interface OpportunitiesFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: OpportunitiesFilterState) => void;
  initialFilters?: OpportunitiesFilterState;
  availableSkills: string[];
}

const OPPORTUNITY_TYPES = [
  { display: "Job Listing", value: "Job" },
  { display: "Internship", value: "Internship" },
  { display: "Volunteer", value: "Volunteer" },
  { display: "Part-time", value: "PartTime" },
];

export function OpportunitiesFilterModal({
  isOpen,
  onClose,
  onApply,
  initialFilters,
  availableSkills,
}: OpportunitiesFilterModalProps) {
  const { primary } = useRoleColors();
  const modalRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);
  const skillRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const [typeSearch, setTypeSearch] = useState("");
  const [skillSearch, setSkillSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isSkillOpen, setIsSkillOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const [filters, setFilters] = useState<OpportunitiesFilterState>(
    initialFilters || {
      types: [],
      skills: [],
      categories: [],
      experienceLevels: [],
      location: "",
    },
  );

  const filteredTypes = useMemo(() => {
    return OPPORTUNITY_TYPES.filter(
      (type) =>
        type.display.toLowerCase().includes(typeSearch.toLowerCase()) ||
        type.value.toLowerCase().includes(typeSearch.toLowerCase()),
    );
  }, [typeSearch]);

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

  const handleClearFilter = () => {
    const emptyFilters: OpportunitiesFilterState = {
      types: [],
      skills: [],
      categories: [],
      experienceLevels: [],
      location: "",
    };
    setFilters(emptyFilters);
    setTypeSearch("");
    setSkillSearch("");
    onApply(emptyFilters);
    onClose();
  };

  const handleApplyFilter = () => {
    onApply(filters);
    onClose();
  };

  const toggleType = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type],
    }));
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

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }

      if (
        isTypeOpen &&
        typeRef.current &&
        !typeRef.current.contains(event.target as Node)
      ) {
        setIsTypeOpen(false);
      }

      if (
        isSkillOpen &&
        skillRef.current &&
        !skillRef.current.contains(event.target as Node)
      ) {
        setIsSkillOpen(false);
      }

      if (
        isCategoryOpen &&
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node)
      ) {
        setIsCategoryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, isTypeOpen, isSkillOpen, isCategoryOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div
        className="absolute top-[60px] right-[25px] z-50 w-[245px]"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-[12px] rounded-[12px] bg-white shadow-[0_0_15px_0_rgba(0,0,0,0.15)] p-[12px_8px] max-h-[90vh]">
          <div className="flex flex-col gap-[12px] overflow-visible max-h-[420px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Type Dropdown */}
            <div className="flex flex-col gap-[8px] w-full" ref={typeRef}>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-normal text-black font-inter-tight capitalize">
                  Opportunity Type
                </span>
                <button onClick={() => setIsTypeOpen(!isTypeOpen)}>
                  <ChevronDown className="w-3 h-3 text-[#B2B2B2]" />
                </button>
              </div>
              <div className="relative">
                <div className="flex items-center gap-[4px] px-[6px] py-[10px] border border-[#E1E4EA] rounded-[8px] bg-white">
                  <Search className="w-[12px] h-[12px] text-[#B2B2B2]" />
                  <input
                    type="text"
                    placeholder="Search Type"
                    value={typeSearch}
                    onChange={(e) => setTypeSearch(e.target.value)}
                    onFocus={() => setIsTypeOpen(true)}
                    className="flex-1 text-[11px] font-normal font-inter-tight placeholder:text-black/30 placeholder:capitalize border-0 focus:outline-none bg-transparent"
                  />
                </div>
                {isTypeOpen && filteredTypes.length > 0 && (
                  <div className="absolute top-full mt-2 w-full max-h-[160px] overflow-y-auto bg-white rounded-[8px] shadow-[0_2px_20px_2px_rgba(0,0,0,0.15)] p-[8px] flex flex-col gap-[10px] z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {filteredTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => {
                          toggleType(type.value);
                          setIsTypeOpen(false);
                          setTypeSearch("");
                        }}
                        className="text-left px-[2px] py-[2px] text-[11px] font-normal text-black font-inter-tight capitalize hover:bg-gray-50 rounded"
                      >
                        {type.display}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Selected Types */}
              {filters.types.length > 0 && (
                <div className="flex flex-wrap gap-[4px] mt-1">
                  {filters.types.map((type) => {
                    const typeObj = OPPORTUNITY_TYPES.find(
                      (t) => t.value === type,
                    );
                    return (
                      <div
                        key={type}
                        className="flex items-center gap-[5px] px-[7px] py-[8px] bg-[#F5F5F5] rounded-[25px]"
                      >
                        <span className="text-[10px] font-normal text-black font-inter-tight">
                          {typeObj?.display || type}
                        </span>
                        <button onClick={() => toggleType(type)}>
                          <X className="w-[10px] h-[10px] text-[#606060]" />
                        </button>
                      </div>
                    );
                  })}
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
                        className="text-left px-[2px] py-[2px] text-[11px] font-normal rounded hover:opacity-80"
                        style={{
                          color: primary,
                          backgroundColor: `${primary}0D`,
                        }}
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
    </div>
  );
}
