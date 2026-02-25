"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { X, Search, ChevronDown } from "lucide-react";
import skillsData from "@/lib/data/skills.json";
import categoriesData from "@/lib/data/categories.json";
import statesCitiesData from "@/lib/data/states-cities.json";

export interface MentorFilterState {
  expertise: string[];
  industries: string[];
  stack: string[];
  location?: string;
  sortBy?: string;
}

interface MentorFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: MentorFilterState) => void;
  initialFilters?: MentorFilterState;
}

const SORT_OPTIONS = [
  { display: "Newest", value: "createdAt" },
  { display: "Highest Rated", value: "avgRating" },
  { display: "Most Sessions", value: "totalSessions" },
];

const STATES = Object.keys(statesCitiesData);

export function MentorFilterModal({
  isOpen,
  onClose,
  onApply,
  initialFilters,
}: MentorFilterModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const expertiseRef = useRef<HTMLDivElement>(null);
  const industryRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  const [expertiseSearch, setExpertiseSearch] = useState("");
  const [industrySearch, setIndustrySearch] = useState("");
  const [stackSearch, setStackSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");

  const [isExpertiseOpen, setIsExpertiseOpen] = useState(false);
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);
  const [isStackOpen, setIsStackOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const [filters, setFilters] = useState<MentorFilterState>(
    initialFilters || {
      expertise: [],
      industries: [],
      stack: [],
      location: "",
      sortBy: "",
    },
  );

  const filteredExpertise = useMemo(() => {
    return categoriesData.filter(
      (cat) =>
        cat.toLowerCase().includes(expertiseSearch.toLowerCase()) &&
        !filters.expertise.includes(cat),
    );
  }, [expertiseSearch, filters.expertise]);

  const filteredIndustries = useMemo(() => {
    return categoriesData.filter(
      (cat) =>
        cat.toLowerCase().includes(industrySearch.toLowerCase()) &&
        !filters.industries.includes(cat),
    );
  }, [industrySearch, filters.industries]);

  const filteredStack = useMemo(() => {
    return skillsData.filter(
      (skill) =>
        skill.toLowerCase().includes(stackSearch.toLowerCase()) &&
        !filters.stack.includes(skill),
    );
  }, [stackSearch, filters.stack]);

  const filteredLocations = useMemo(() => {
    return STATES.filter((state) =>
      state.toLowerCase().includes(locationSearch.toLowerCase()),
    );
  }, [locationSearch]);

  const handleClearFilter = () => {
    const emptyFilters: MentorFilterState = {
      expertise: [],
      industries: [],
      stack: [],
      location: "",
      sortBy: "",
    };
    setFilters(emptyFilters);
    setExpertiseSearch("");
    setIndustrySearch("");
    setStackSearch("");
    setLocationSearch("");
    onApply(emptyFilters);
    onClose();
  };

  const handleApplyFilter = () => {
    onApply(filters);
    onClose();
  };

  const toggleExpertise = (item: string) => {
    setFilters((prev) => ({
      ...prev,
      expertise: prev.expertise.includes(item)
        ? prev.expertise.filter((e) => e !== item)
        : [...prev.expertise, item],
    }));
  };

  const toggleIndustry = (item: string) => {
    setFilters((prev) => ({
      ...prev,
      industries: prev.industries.includes(item)
        ? prev.industries.filter((i) => i !== item)
        : [...prev.industries, item],
    }));
  };

  const toggleStack = (item: string) => {
    setFilters((prev) => ({
      ...prev,
      stack: prev.stack.includes(item)
        ? prev.stack.filter((s) => s !== item)
        : [...prev.stack, item],
    }));
  };

  const selectLocation = (state: string) => {
    setFilters((prev) => ({
      ...prev,
      location: prev.location === state ? "" : state,
    }));
  };

  const selectSort = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: prev.sortBy === value ? "" : value,
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
        isExpertiseOpen &&
        expertiseRef.current &&
        !expertiseRef.current.contains(event.target as Node)
      ) {
        setIsExpertiseOpen(false);
      }

      if (
        isIndustryOpen &&
        industryRef.current &&
        !industryRef.current.contains(event.target as Node)
      ) {
        setIsIndustryOpen(false);
      }

      if (
        isStackOpen &&
        stackRef.current &&
        !stackRef.current.contains(event.target as Node)
      ) {
        setIsStackOpen(false);
      }

      if (
        isLocationOpen &&
        locationRef.current &&
        !locationRef.current.contains(event.target as Node)
      ) {
        setIsLocationOpen(false);
      }

      if (
        isSortOpen &&
        sortRef.current &&
        !sortRef.current.contains(event.target as Node)
      ) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [
    isOpen,
    onClose,
    isExpertiseOpen,
    isIndustryOpen,
    isStackOpen,
    isLocationOpen,
    isSortOpen,
  ]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/5" onClick={onClose} />

      {/* Modal Content */}
      <div
        className="absolute top-full right-0 z-50 mt-2 w-[245px]"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-[12px] rounded-[12px] bg-white shadow-[0_0_15px_0_rgba(0,0,0,0.15)] p-[12px_8px] max-h-[90vh]">
          <div className="flex flex-col gap-[12px] overflow-y-auto max-h-[420px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Expertise Dropdown */}
            <div className="flex flex-col gap-[8px] w-full" ref={expertiseRef}>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-normal text-black font-inter-tight capitalize">
                  Expertise
                </span>
                <button onClick={() => setIsExpertiseOpen(!isExpertiseOpen)}>
                  <ChevronDown className="w-3 h-3 text-[#B2B2B2]" />
                </button>
              </div>
              <div className="relative">
                <div className="flex items-center gap-[4px] px-[6px] py-[10px] border border-[#E1E4EA] rounded-[8px] bg-white">
                  <Search className="w-[12px] h-[12px] text-[#B2B2B2]" />
                  <input
                    type="text"
                    placeholder="Search Expertise"
                    value={expertiseSearch}
                    onChange={(e) => {
                      setExpertiseSearch(e.target.value);
                      setIsExpertiseOpen(true);
                    }}
                    onFocus={() => setIsExpertiseOpen(true)}
                    className="flex-1 text-[11px] font-normal font-inter-tight placeholder:text-black/30 placeholder:capitalize border-0 focus:outline-none bg-transparent"
                  />
                </div>
                {isExpertiseOpen && expertiseSearch && (
                  <div className="absolute top-full mt-2 w-full max-h-[160px] overflow-y-auto bg-white rounded-[8px] shadow-[0_2px_20px_2px_rgba(0,0,0,0.15)] p-[8px] flex flex-col gap-[10px] z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {filteredExpertise.length > 0 ? (
                      filteredExpertise.map((item) => (
                        <button
                          key={item}
                          onClick={() => {
                            toggleExpertise(item);
                            setIsExpertiseOpen(false);
                            setExpertiseSearch("");
                          }}
                          className="text-left px-[2px] py-[2px] text-[11px] font-normal text-black font-inter-tight capitalize hover:bg-gray-50 rounded"
                        >
                          {item}
                        </button>
                      ))
                    ) : (
                      <span className="text-[11px] text-black/40 px-[2px] py-[2px]">
                        No results
                      </span>
                    )}
                  </div>
                )}
              </div>
              {filters.expertise.length > 0 && (
                <div className="flex flex-wrap gap-[4px] mt-1">
                  {filters.expertise.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-[5px] px-[7px] py-[8px] bg-[#F5F5F5] rounded-[25px]"
                    >
                      <span className="text-[10px] font-normal text-black font-inter-tight">
                        {item}
                      </span>
                      <button onClick={() => toggleExpertise(item)}>
                        <X className="w-[10px] h-[10px] text-[#606060]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Industries Dropdown */}
            <div className="flex flex-col gap-[8px] w-full" ref={industryRef}>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-normal text-black font-inter-tight capitalize">
                  Industries
                </span>
                <button onClick={() => setIsIndustryOpen(!isIndustryOpen)}>
                  <ChevronDown className="w-3 h-3 text-[#B2B2B2]" />
                </button>
              </div>
              <div className="relative">
                <div className="flex items-center gap-[4px] px-[6px] py-[10px] border border-[#E1E4EA] rounded-[8px] bg-white">
                  <Search className="w-[12px] h-[12px] text-[#B2B2B2]" />
                  <input
                    type="text"
                    placeholder="Search Industries"
                    value={industrySearch}
                    onChange={(e) => {
                      setIndustrySearch(e.target.value);
                      setIsIndustryOpen(true);
                    }}
                    onFocus={() => setIsIndustryOpen(true)}
                    className="flex-1 text-[11px] font-normal font-inter-tight placeholder:text-black/30 placeholder:capitalize border-0 focus:outline-none bg-transparent"
                  />
                </div>
                {isIndustryOpen && industrySearch && (
                  <div className="absolute top-full mt-2 w-full max-h-[160px] overflow-y-auto bg-white rounded-[8px] shadow-[0_2px_20px_2px_rgba(0,0,0,0.15)] p-[8px] flex flex-col gap-[10px] z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {filteredIndustries.length > 0 ? (
                      filteredIndustries.map((item) => (
                        <button
                          key={item}
                          onClick={() => {
                            toggleIndustry(item);
                            setIsIndustryOpen(false);
                            setIndustrySearch("");
                          }}
                          className="text-left px-[2px] py-[2px] text-[11px] font-normal text-black font-inter-tight capitalize hover:bg-gray-50 rounded"
                        >
                          {item}
                        </button>
                      ))
                    ) : (
                      <span className="text-[11px] text-black/40 px-[2px] py-[2px]">
                        No results
                      </span>
                    )}
                  </div>
                )}
              </div>
              {filters.industries.length > 0 && (
                <div className="flex flex-wrap gap-[4px] mt-1">
                  {filters.industries.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-[5px] px-[7px] py-[8px] bg-[#F5F5F5] rounded-[25px]"
                    >
                      <span className="text-[10px] font-normal text-black font-inter-tight">
                        {item}
                      </span>
                      <button onClick={() => toggleIndustry(item)}>
                        <X className="w-[10px] h-[10px] text-[#606060]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stack/Tech Dropdown */}
            <div className="flex flex-col gap-[8px] w-full" ref={stackRef}>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-normal text-black font-inter-tight capitalize">
                  Tech Stack
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
                        {filteredStack.map((skill) => (
                          <button
                            key={skill}
                            onClick={() => {
                              toggleStack(skill);
                              setIsStackOpen(false);
                              setStackSearch("");
                            }}
                            className="text-left px-[2px] py-[2px] text-[11px] font-normal text-black font-inter-tight capitalize hover:bg-gray-50 rounded"
                          >
                            {skill}
                          </button>
                        ))}
                        {stackSearch.trim() &&
                          !skillsData.includes(stackSearch) && (
                            <button
                              onClick={() => {
                                toggleStack(stackSearch);
                                setStackSearch("");
                                setIsStackOpen(false);
                              }}
                              className="text-left px-[2px] py-[2px] text-[11px] font-normal rounded border-t border-[#E1E4EA] hover:opacity-80 text-[#8463FF] bg-[#8463FF0D]"
                            >
                              + Add &quot;{stackSearch}&quot;
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
                        className="text-left px-[2px] py-[2px] text-[11px] font-normal rounded hover:opacity-80 text-[#8463FF] bg-[#8463FF0D]"
                      >
                        + Add &quot;{stackSearch}&quot;
                      </button>
                    ) : null}
                  </div>
                )}
              </div>
              {filters.stack.length > 0 && (
                <div className="flex flex-wrap gap-[4px] mt-1">
                  {filters.stack.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-[5px] px-[7px] py-[8px] bg-[#F5F5F5] rounded-[25px]"
                    >
                      <span className="text-[10px] font-normal text-black font-inter-tight">
                        {item}
                      </span>
                      <button onClick={() => toggleStack(item)}>
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
                              ? "font-medium text-[#8463FF]"
                              : "text-black"
                          }`}
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

            {/* Sort By Dropdown */}
            <div className="flex flex-col gap-[8px] w-full" ref={sortRef}>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-normal text-black font-inter-tight capitalize">
                  Sort By
                </span>
                <button onClick={() => setIsSortOpen(!isSortOpen)}>
                  <ChevronDown className="w-3 h-3 text-[#B2B2B2]" />
                </button>
              </div>
              {isSortOpen && (
                <div className="flex flex-col gap-[6px]">
                  {SORT_OPTIONS.map((option) => {
                    const isSelected = filters.sortBy === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => selectSort(option.value)}
                        className={`text-left px-[8px] py-[8px] text-[11px] font-normal font-inter-tight rounded-[6px] transition-colors ${
                          isSelected
                            ? "text-black border border-[#8463FF] bg-[#8463FF0D]"
                            : "text-black/70 border border-[#E1E4EA] hover:bg-gray-50"
                        }`}
                      >
                        {option.display}
                      </button>
                    );
                  })}
                </div>
              )}
              {!isSortOpen && filters.sortBy && (
                <div className="flex flex-wrap gap-[4px]">
                  <div className="flex items-center gap-[5px] px-[7px] py-[8px] bg-[#F5F5F5] rounded-[25px]">
                    <span className="text-[10px] font-normal text-black font-inter-tight">
                      {SORT_OPTIONS.find((o) => o.value === filters.sortBy)
                        ?.display || filters.sortBy}
                    </span>
                    <button onClick={() => selectSort(filters.sortBy!)}>
                      <X className="w-[10px] h-[10px] text-[#606060]" />
                    </button>
                  </div>
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
              className="flex-1 flex items-center justify-center px-4 py-[13px] rounded-[8px] hover:opacity-80 bg-[#8463FF] border border-[#8463FF]"
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
