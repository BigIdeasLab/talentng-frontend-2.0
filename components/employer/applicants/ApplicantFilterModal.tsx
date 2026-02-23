"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { X, Search, ChevronDown } from "lucide-react";

export type DateRangeType = "all" | "today" | "week" | "month";

export interface ApplicantFilterState {
  status: string[];
  location: string;
  skills: string[];
  dateRange: DateRangeType;
}

interface ApplicantFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: ApplicantFilterState) => void;
  initialFilters?: ApplicantFilterState;
  availableStatuses: string[];
  availableLocations: string[];
  availableSkills: string[];
}

const statusLabels: Record<string, string> = {
  invited: "Invited",
  applied: "In Review",
  shortlisted: "Shortlisted",
  rejected: "Rejected",
  hired: "Hired",
};

const dateRangeOptions: { value: DateRangeType; label: string }[] = [
  { value: "all", label: "All time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
];

export function ApplicantFilterModal({
  isOpen,
  onClose,
  onApply,
  initialFilters,
  availableStatuses,
  availableLocations,
  availableSkills,
}: ApplicantFilterModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const skillRef = useRef<HTMLDivElement>(null);
  const [locationSearch, setLocationSearch] = useState("");
  const [skillSearch, setSkillSearch] = useState("");
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isSkillOpen, setIsSkillOpen] = useState(false);

  const [filters, setFilters] = useState<ApplicantFilterState>(
    initialFilters || {
      status: [],
      location: "",
      skills: [],
      dateRange: "all",
    },
  );

  const filteredLocations = useMemo(() => {
    return availableLocations.filter((location) =>
      location.toLowerCase().includes(locationSearch.toLowerCase()),
    );
  }, [availableLocations, locationSearch]);

  const filteredSkills = useMemo(() => {
    return availableSkills.filter((skill) =>
      skill.toLowerCase().includes(skillSearch.toLowerCase()),
    );
  }, [availableSkills, skillSearch]);

  const handleClearFilter = () => {
    const emptyFilters: ApplicantFilterState = {
      status: [],
      location: "",
      skills: [],
      dateRange: "all",
    };
    setFilters(emptyFilters);
    setLocationSearch("");
    setSkillSearch("");
    onApply(emptyFilters);
    onClose();
  };

  const handleApplyFilter = () => {
    onApply(filters);
    onClose();
  };

  const toggleStatus = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter((s) => s !== status)
        : [...prev.status, status],
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
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }

      if (
        isLocationOpen &&
        locationRef.current &&
        !locationRef.current.contains(event.target as Node)
      ) {
        setIsLocationOpen(false);
      }

      if (
        isSkillOpen &&
        skillRef.current &&
        !skillRef.current.contains(event.target as Node)
      ) {
        setIsSkillOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, isLocationOpen, isSkillOpen]);

  const getFilterCount = () => {
    let count = 0;
    if (filters.status.length > 0) count += filters.status.length;
    if (filters.location) count += 1;
    if (filters.skills.length > 0) count += filters.skills.length;
    if (filters.dateRange !== "all") count += 1;
    return count;
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-[100%] right-0 mt-2 z-[100]" ref={modalRef}>
      <div className="w-[280px] flex flex-col gap-[12px] rounded-[12px] bg-white shadow-[0_0_15px_0_rgba(0,0,0,0.15)] p-[12px_8px] max-h-[80vh]">
        <div className="flex flex-col gap-[12px] overflow-y-auto max-h-[380px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Status Filter */}
          <div className="flex flex-col gap-[8px] w-full">
            <span className="text-[11px] font-normal text-black font-inter-tight">
              Status
            </span>
            <div className="flex flex-wrap gap-[6px]">
              {availableStatuses.map((status) => (
                <button
                  key={status}
                  onClick={() => toggleStatus(status)}
                  className={`px-[10px] py-[6px] rounded-[20px] text-[10px] font-medium font-inter-tight transition-colors ${
                    filters.status.includes(status)
                      ? "bg-[#5C30FF] text-white"
                      : "bg-[#F5F5F5] text-black hover:bg-gray-200"
                  }`}
                >
                  {statusLabels[status] || status}
                </button>
              ))}
            </div>
          </div>

          {/* Location Dropdown */}
          <div className="flex flex-col gap-[8px] w-full" ref={locationRef}>
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-normal text-black font-inter-tight">
                Location
              </span>
              <button onClick={() => setIsLocationOpen(!isLocationOpen)}>
                <ChevronDown className="w-3 h-3 text-[#B2B2B2]" />
              </button>
            </div>
            <div className="relative">
              <div className="flex items-center gap-[4px] px-[6px] py-[8px] border border-[#E1E4EA] rounded-[8px] bg-white">
                <input
                  type="text"
                  placeholder="Search location"
                  value={filters.location || locationSearch}
                  onChange={(e) => {
                    setLocationSearch(e.target.value);
                    setFilters((prev) => ({ ...prev, location: "" }));
                  }}
                  onFocus={() => setIsLocationOpen(true)}
                  className="flex-1 text-[11px] font-normal font-inter-tight placeholder:text-black/30 border-0 focus:outline-none bg-transparent"
                />
              </div>
              {isLocationOpen && filteredLocations.length > 0 && (
                <div className="absolute top-full mt-2 w-full max-h-[120px] overflow-y-auto bg-white rounded-[8px] shadow-[0_2px_20px_2px_rgba(0,0,0,0.15)] p-[8px] flex flex-col gap-[6px] z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {filteredLocations.slice(0, 8).map((location) => (
                    <button
                      key={location}
                      onClick={() => {
                        setFilters((prev) => ({ ...prev, location }));
                        setIsLocationOpen(false);
                        setLocationSearch("");
                      }}
                      className="text-left px-[2px] py-[4px] text-[11px] font-normal text-black hover:bg-gray-50 rounded"
                    >
                      {location}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {filters.location && (
              <div className="flex items-center gap-[4px] mt-1">
                <div className="flex items-center gap-[5px] px-[7px] py-[4px] bg-[#F5F5F5] rounded-[25px]">
                  <span className="text-[10px] font-normal text-black font-inter-tight">
                    {filters.location}
                  </span>
                  <button
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, location: "" }))
                    }
                  >
                    <X className="w-[10px] h-[10px] text-[#606060]" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Skills Dropdown */}
          <div className="flex flex-col gap-[8px] w-full" ref={skillRef}>
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-normal text-black font-inter-tight">
                Skills
              </span>
              <button onClick={() => setIsSkillOpen(!isSkillOpen)}>
                <ChevronDown className="w-3 h-3 text-[#B2B2B2]" />
              </button>
            </div>
            <div className="relative">
              <div className="flex items-center gap-[4px] px-[6px] py-[8px] border border-[#E1E4EA] rounded-[8px] bg-white">
                <Search className="w-[12px] h-[12px] text-[#B2B2B2]" />
                <input
                  type="text"
                  placeholder="Search skills"
                  value={skillSearch}
                  onChange={(e) => setSkillSearch(e.target.value)}
                  onFocus={() => setIsSkillOpen(true)}
                  className="flex-1 text-[11px] font-normal font-inter-tight placeholder:text-black/30 border-0 focus:outline-none bg-transparent"
                />
              </div>
              {isSkillOpen && filteredSkills.length > 0 && (
                <div className="absolute top-full mt-2 w-full max-h-[120px] overflow-y-auto bg-white rounded-[8px] shadow-[0_2px_20px_2px_rgba(0,0,0,0.15)] p-[8px] flex flex-col gap-[6px] z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {filteredSkills.slice(0, 8).map((skill) => (
                    <button
                      key={skill}
                      onClick={() => {
                        toggleSkill(skill);
                        setIsSkillOpen(false);
                        setSkillSearch("");
                      }}
                      className="text-left px-[2px] py-[4px] text-[11px] font-normal text-black hover:bg-gray-50 rounded"
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
                    className="flex items-center gap-[5px] px-[7px] py-[4px] bg-[#F5F5F5] rounded-[25px]"
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

          {/* Date Range */}
          <div className="flex flex-col gap-[8px] w-full">
            <span className="text-[11px] font-normal text-black font-inter-tight">
              Date
            </span>
            <div className="flex flex-wrap gap-[6px]">
              {dateRangeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, dateRange: option.value }))
                  }
                  className={`px-[10px] py-[6px] rounded-[20px] text-[10px] font-medium font-inter-tight transition-colors ${
                    filters.dateRange === option.value
                      ? "bg-[#5C30FF] text-white"
                      : "bg-[#F5F5F5] text-black hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
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
              Clear{getFilterCount() > 0 ? ` (${getFilterCount()})` : ""}
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
  );
}
