"use client";

import { useState, useMemo } from "react";
import { X, Search, ChevronDown } from "lucide-react";
import categoriesData from "@/data/categories.json";
import skillsData from "@/data/skills.json";
import statesCitiesData from "@/data/states-cities.json";

type AvailabilityType = "All" | "Contract" | "Part Time" | "Full Time";
type ExperienceLevelType = "Entry" | "Intermediate" | "Senior";

interface FilterState {
  categories: string[];
  skills: string[];
  location: string;
  availability: AvailabilityType;
  experienceLevel: ExperienceLevelType | null;
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
  const [categorySearch, setCategorySearch] = useState("");
  const [skillSearch, setSkillSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSkillOpen, setIsSkillOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>(
    initialFilters || {
      categories: [],
      skills: [],
      location: "",
      availability: "All",
      experienceLevel: null,
    }
  );

  const filteredCategories = useMemo(() => {
    return categoriesData.filter((category) =>
      category.toLowerCase().includes(categorySearch.toLowerCase())
    );
  }, [categorySearch]);

  const filteredSkills = useMemo(() => {
    return skillsData.filter((skill) =>
      skill.toLowerCase().includes(skillSearch.toLowerCase())
    );
  }, [skillSearch]);

  const filteredLocations = useMemo(() => {
    const locations: string[] = [];
    statesCitiesData.forEach((state) => {
      if (state.state.toLowerCase().includes(locationSearch.toLowerCase())) {
        locations.push(state.state);
      }
      state.cities.forEach((city) => {
        if (city.toLowerCase().includes(locationSearch.toLowerCase())) {
          locations.push(`${city}, ${state.state}`);
        }
      });
    });
    return locations;
  }, [locationSearch]);

  const handleClearFilter = () => {
    setFilters({
      categories: [],
      skills: [],
      location: "",
      availability: "All",
      experienceLevel: null,
    });
    setCategorySearch("");
    setSkillSearch("");
    setLocationSearch("");
  };

  const handleApplyFilter = () => {
    onApply(filters);
    onClose();
  };

  const toggleCategory = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="w-[290px] flex flex-col gap-[15px] rounded-[15px] bg-white shadow-[0_0_15px_0_rgba(0,0,0,0.15)] p-[15px_10px] max-h-[90vh]">
        <div className="flex flex-col gap-[15px] overflow-y-auto max-h-[510px] scrollbar-styled pr-1">
          {/* Category Dropdown */}
          <div className="flex flex-col gap-[10px] w-[250px]">
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-normal text-black font-inter-tight capitalize">
                Select Category
              </span>
              <button onClick={() => setIsCategoryOpen(!isCategoryOpen)}>
                <ChevronDown className="w-4 h-4 text-[#B2B2B2]" />
              </button>
            </div>
            <div className="relative">
              <div className="flex items-center gap-[5px] px-[8px] py-[12px] border border-[#E1E4EA] rounded-[10px] bg-white">
                <Search className="w-[15px] h-[15px] text-[#B2B2B2]" />
                <input
                  type="text"
                  placeholder="Search Category"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  onFocus={() => setIsCategoryOpen(true)}
                  className="flex-1 text-[12px] font-normal font-inter-tight placeholder:text-black/30 placeholder:capitalize border-0 focus:outline-none bg-transparent"
                />
              </div>
              {isCategoryOpen && filteredCategories.length > 0 && (
                <div className="absolute top-full mt-2 w-full max-h-[200px] overflow-y-auto bg-white rounded-[10px] shadow-[0_2px_20px_2px_rgba(0,0,0,0.15)] p-[10px] flex flex-col gap-[13px] z-10">
                  {filteredCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        toggleCategory(category);
                        setIsCategoryOpen(false);
                        setCategorySearch("");
                      }}
                      className="text-left px-[3px] py-[3px] text-[12px] font-normal text-black font-inter-tight capitalize hover:bg-gray-50 rounded"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Selected Categories */}
            {filters.categories.length > 0 && (
              <div className="flex flex-wrap gap-[5px] mt-1">
                {filters.categories.map((category) => (
                  <div
                    key={category}
                    className="flex items-center gap-[7px] px-[9px] py-[10px] bg-[#F5F5F5] rounded-[30px]"
                  >
                    <span className="text-[11px] font-normal text-black font-inter-tight">
                      {category}
                    </span>
                    <button onClick={() => toggleCategory(category)}>
                      <X className="w-[12px] h-[12px] text-[#606060]" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Skills Dropdown */}
          <div className="flex flex-col gap-[10px] w-[250px]">
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-normal text-black font-inter-tight capitalize">
                Select Skills
              </span>
              <button onClick={() => setIsSkillOpen(!isSkillOpen)}>
                <ChevronDown className="w-4 h-4 text-[#B2B2B2]" />
              </button>
            </div>
            <div className="relative">
              <div className="flex items-center gap-[5px] px-[8px] py-[12px] border border-[#E1E4EA] rounded-[10px] bg-white">
                <Search className="w-[15px] h-[15px] text-[#B2B2B2]" />
                <input
                  type="text"
                  placeholder="Search Skills"
                  value={skillSearch}
                  onChange={(e) => setSkillSearch(e.target.value)}
                  onFocus={() => setIsSkillOpen(true)}
                  className="flex-1 text-[12px] font-normal font-inter-tight placeholder:text-black/30 placeholder:capitalize border-0 focus:outline-none bg-transparent"
                />
              </div>
              {isSkillOpen && filteredSkills.length > 0 && (
                <div className="absolute top-full mt-2 w-full max-h-[200px] overflow-y-auto bg-white rounded-[10px] shadow-[0_2px_20px_2px_rgba(0,0,0,0.15)] p-[10px] flex flex-col gap-[13px] z-10">
                  {filteredSkills.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => {
                        toggleSkill(skill);
                        setIsSkillOpen(false);
                        setSkillSearch("");
                      }}
                      className="text-left px-[3px] py-[3px] text-[12px] font-normal text-black font-inter-tight capitalize hover:bg-gray-50 rounded"
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Selected Skills */}
            {filters.skills.length > 0 && (
              <div className="flex flex-wrap gap-[5px] mt-1">
                {filters.skills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-[7px] px-[9px] py-[10px] bg-[#F5F5F5] rounded-[30px]"
                  >
                    <span className="text-[11px] font-normal text-black font-inter-tight">
                      {skill}
                    </span>
                    <button onClick={() => toggleSkill(skill)}>
                      <X className="w-[12px] h-[12px] text-[#606060]" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Location Dropdown */}
          <div className="flex flex-col gap-[10px] w-[250px]">
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-normal text-black font-inter-tight capitalize">
                Select Location
              </span>
              <button onClick={() => setIsLocationOpen(!isLocationOpen)}>
                <ChevronDown className="w-4 h-4 text-[#B2B2B2]" />
              </button>
            </div>
            <div className="relative">
              <div className="flex items-center gap-[5px] px-[8px] py-[12px] h-[39px] border border-[#E1E4EA] rounded-[10px] bg-white">
                <input
                  type="text"
                  placeholder="Enter Location"
                  value={filters.location || locationSearch}
                  onChange={(e) => {
                    setLocationSearch(e.target.value);
                    setFilters((prev) => ({ ...prev, location: "" }));
                  }}
                  onFocus={() => setIsLocationOpen(true)}
                  className="flex-1 text-[12px] font-normal font-inter-tight placeholder:text-black/30 placeholder:capitalize border-0 focus:outline-none bg-transparent"
                />
              </div>
              {isLocationOpen && filteredLocations.length > 0 && (
                <div className="absolute top-full mt-2 w-full max-h-[200px] overflow-y-auto bg-white rounded-[10px] shadow-[0_2px_20px_2px_rgba(0,0,0,0.15)] p-[10px] flex flex-col gap-[13px] z-10">
                  {filteredLocations.map((location) => (
                    <button
                      key={location}
                      onClick={() => {
                        setFilters((prev) => ({ ...prev, location }));
                        setIsLocationOpen(false);
                        setLocationSearch("");
                      }}
                      className="text-left px-[3px] py-[3px] text-[12px] font-normal text-black font-inter-tight capitalize hover:bg-gray-50 rounded"
                    >
                      {location}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Availability */}
          <div className="flex flex-col gap-[10px] w-[250px]">
            <span className="text-[12px] font-normal text-black font-inter-tight capitalize">
              Availability
            </span>
            <div className="flex flex-col gap-[13px] p-[10px] border border-[#E1E4EA] rounded-[10px] bg-white">
              {(["All", "Contract", "Part Time", "Full Time"] as const).map(
                (option) => (
                  <button
                    key={option}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, availability: option }))
                    }
                    className="flex items-center gap-[5px]"
                  >
                    <div className="w-4 h-4 rounded-full border flex items-center justify-center">
                      {filters.availability === option && (
                        <div className="w-[11px] h-[11px] rounded-full bg-[#5C30FF]" />
                      )}
                    </div>
                    <span className="text-[12px] font-normal text-black font-inter-tight capitalize">
                      {option}
                    </span>
                  </button>
                )
              )}
            </div>
          </div>

          {/* Experience Level */}
          <div className="flex flex-col gap-[10px] w-[250px]">
            <span className="text-[12px] font-normal text-black font-inter-tight capitalize">
              Experience Level
            </span>
            <div className="flex flex-col gap-[13px] p-[10px] border border-[#E1E4EA] rounded-[10px] bg-white">
              {(["Entry", "Intermediate", "Senior"] as const).map((option) => (
                <button
                  key={option}
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, experienceLevel: option }))
                  }
                  className="flex items-center gap-[5px]"
                >
                  <div className="w-4 h-4 rounded-full border border-[#B2B2B2] flex items-center justify-center">
                    {filters.experienceLevel === option && (
                      <div className="w-[11px] h-[11px] rounded-full bg-[#5C30FF]" />
                    )}
                  </div>
                  <span className="text-[12px] font-normal text-black font-inter-tight capitalize">
                    {option}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-[5px]">
          <button
            onClick={handleClearFilter}
            className="flex-1 flex items-center justify-center px-[79px] py-[16px] border border-[#E1E4EA] rounded-[10px] bg-white"
          >
            <span className="text-[13px] font-normal text-black text-center font-aeonik-trial">
              Clear Filter
            </span>
          </button>
          <button
            onClick={handleApplyFilter}
            className="flex-1 flex items-center justify-center px-[79px] py-[16px] border border-[#5C30FF] rounded-[10px] bg-[#5C30FF]"
          >
            <span className="text-[13px] font-normal text-white text-center font-aeonik-trial">
              Apply Filter
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export type { FilterState, AvailabilityType, ExperienceLevelType };
