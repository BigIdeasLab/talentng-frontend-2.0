"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { X, Search, ChevronDown } from "lucide-react";
import categoriesData from "@/lib/data/categories.json";
import skillsData from "@/lib/data/skills.json";
import statesCitiesData from "@/lib/data/states-cities.json";

type AvailabilityType = "All" | "Contract" | "Part Time" | "Full Time";

interface FilterState {
  categories: string[];
  skills: string[];
  location: string;
  availability: AvailabilityType;
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
  const categoryRef = useRef<HTMLDivElement>(null);
  const skillRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
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
    },
  );

  const filteredCategories = useMemo(() => {
    return categoriesData.filter((category) =>
      category.toLowerCase().includes(categorySearch.toLowerCase()),
    );
  }, [categorySearch]);

  const filteredSkills = useMemo(() => {
    return skillsData.filter((skill) =>
      skill.toLowerCase().includes(skillSearch.toLowerCase()),
    );
  }, [skillSearch]);

  const filteredLocations = useMemo(() => {
    const locations: string[] = [];
    const searchLower = locationSearch.toLowerCase();

    Object.entries(statesCitiesData).forEach(([state, data]) => {
      if (state.toLowerCase().includes(searchLower)) {
        locations.push(state);
      }
      (data.major_cities || []).forEach((city) => {
        if (city.toLowerCase().includes(searchLower)) {
          locations.push(`${city}, ${state}`);
        }
      });
    });
    return locations;
  }, [locationSearch]);

  const handleClearFilter = () => {
    const emptyFilters: FilterState = {
      categories: [],
      skills: [],
      location: "",
      availability: "All",
    };
    setFilters(emptyFilters);
    setCategorySearch("");
    setSkillSearch("");
    setLocationSearch("");
    onApply(emptyFilters);
    onClose();
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

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
      
      // Close category dropdown if clicking outside of it
      if (isCategoryOpen && categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
      
      // Close skill dropdown if clicking outside of it
      if (isSkillOpen && skillRef.current && !skillRef.current.contains(event.target as Node)) {
        setIsSkillOpen(false);
      }
      
      // Close location dropdown if clicking outside of it
      if (isLocationOpen && locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setIsLocationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, isCategoryOpen, isSkillOpen, isLocationOpen]);

  if (!isOpen) return null;

  return (
    <div className="absolute top-[100%] right-0 mt-2 z-50" ref={modalRef}>
      <div className="w-[245px] flex flex-col gap-[12px] rounded-[12px] bg-white shadow-[0_0_15px_0_rgba(0,0,0,0.15)] p-[12px_8px] max-h-[90vh]">
        <div className="flex flex-col gap-[12px] overflow-y-auto max-h-[420px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Category Dropdown */}
          <div className="flex flex-col gap-[8px] w-full" ref={categoryRef}>
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-normal text-black font-inter-tight capitalize">
                Select Category
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
                  onChange={(e) => setCategorySearch(e.target.value)}
                  onFocus={() => setIsCategoryOpen(true)}
                  className="flex-1 text-[11px] font-normal font-inter-tight placeholder:text-black/30 placeholder:capitalize border-0 focus:outline-none bg-transparent"
                />
              </div>
              {isCategoryOpen && filteredCategories.length > 0 && (
                <div className="absolute top-full mt-2 w-full max-h-[160px] overflow-y-auto bg-white rounded-[8px] shadow-[0_2px_20px_2px_rgba(0,0,0,0.15)] p-[8px] flex flex-col gap-[10px] z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {filteredCategories.map((category) => (
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
            {filters.categories.length > 0 && (
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
                     if (skillSearch.trim() && !filters.skills.includes(skillSearch)) {
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
                     {skillSearch.trim() && !skillsData.includes(skillSearch) && (
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

          {/* Availability */}
          <div className="flex flex-col gap-[8px] w-full">
            <span className="text-[11px] font-normal text-black font-inter-tight capitalize">
              Availability
            </span>
            <div className="flex flex-col gap-[10px] p-[8px] border border-[#E1E4EA] rounded-[8px] bg-white">
              {(["All", "Contract", "Part Time", "Full Time"] as const).map(
                (option) => (
                  <button
                    key={option}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, availability: option }))
                    }
                    className="flex items-center gap-[4px]"
                  >
                    <div className="w-3 h-3 rounded-full border flex items-center justify-center">
                      {filters.availability === option && (
                        <div className="w-[9px] h-[9px] rounded-full bg-[#5C30FF]" />
                      )}
                    </div>
                    <span className="text-[11px] font-normal text-black font-inter-tight capitalize">
                      {option}
                    </span>
                  </button>
                ),
              )}
            </div>
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
  );
}


export type { FilterState, AvailabilityType };
