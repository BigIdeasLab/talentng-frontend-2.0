"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { X, Search, ChevronDown } from "lucide-react";
import skillsData from "@/lib/data/skills.json";
import statesCitiesData from "@/lib/data/states-cities.json";

export interface HireFilterState {
  skills: string[];
  location: string;
}

interface HireFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: HireFilterState) => void;
  initialFilters?: HireFilterState;
  availableLocations?: string[];
  availableSkills?: string[];
}

export function HireFilterModal({
  isOpen,
  onClose,
  onApply,
  initialFilters,
  availableLocations = [],
  availableSkills = [],
}: HireFilterModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const skillRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const [skillSearch, setSkillSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [isSkillOpen, setIsSkillOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const [filters, setFilters] = useState<HireFilterState>(
    initialFilters || {
      skills: [],
      location: "",
    },
  );

  const filteredSkills = useMemo(() => {
    const data = availableSkills.length > 0 ? availableSkills : skillsData;
    return data.filter((skill) =>
      skill.toLowerCase().includes(skillSearch.toLowerCase()),
    );
  }, [skillSearch, availableSkills]);

  const filteredLocations = useMemo(() => {
    if (availableLocations.length > 0) {
      return availableLocations.filter((loc) =>
        loc.toLowerCase().includes(locationSearch.toLowerCase()),
      );
    }

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
  }, [locationSearch, availableLocations]);

  const handleClearFilter = () => {
    const emptyFilters: HireFilterState = {
      skills: [],
      location: "",
    };
    setFilters(emptyFilters);
    setSkillSearch("");
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

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleApplyFilter();
      }

      if (
        isSkillOpen &&
        skillRef.current &&
        !skillRef.current.contains(event.target as Node)
      ) {
        setIsSkillOpen(false);
      }

      if (
        isLocationOpen &&
        locationRef.current &&
        !locationRef.current.contains(event.target as Node)
      ) {
        setIsLocationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, handleApplyFilter, isSkillOpen, isLocationOpen]);

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
                    onFocus={() => setIsSkillOpen(true)}
                    className="flex-1 text-[11px] font-normal font-inter-tight placeholder:text-black/30 placeholder:capitalize border-0 focus:outline-none bg-transparent"
                  />
                </div>
                {isSkillOpen && filteredSkills.length > 0 && (
                  <div className="absolute top-full mt-2 w-full max-h-[160px] overflow-y-auto bg-white rounded-[8px] shadow-[0_2px_20px_2px_rgba(0,0,0,0.15)] p-[8px] flex flex-col gap-[10px] z-20 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
                  </div>
                )}
              </div>
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
                  <div className="absolute top-full mt-2 w-full max-h-[160px] overflow-y-auto bg-white rounded-[8px] shadow-[0_2px_20px_2px_rgba(0,0,0,0.15)] p-[8px] flex flex-col gap-[10px] z-20 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-[4px] pt-2 border-t border-[#E1E4EA]">
            <button
              onClick={handleClearFilter}
              className="flex-1 flex items-center justify-center px-4 py-[10px] border border-[#E1E4EA] rounded-[8px] bg-white"
            >
              <span className="text-[11px] font-normal text-black text-center font-inter-tight">
                Clear
              </span>
            </button>
            <button
              onClick={handleApplyFilter}
              className="flex-1 flex items-center justify-center px-4 py-[10px] border border-[#5C30FF] rounded-[8px] bg-[#5C30FF]"
            >
              <span className="text-[11px] font-normal text-white text-center font-inter-tight">
                Apply
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
