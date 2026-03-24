"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { X, Search, ChevronDown } from "lucide-react";
import skillsData from "@/lib/data/skills.json";
import categoriesData from "@/lib/data/categories.json";
import statesCitiesData from "@/lib/data/states-cities.json";

export interface MentorFilterState {
  headlines: string[];
  expertise: string[];
  languages: string[];
  location?: string;
}

interface MentorFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: MentorFilterState) => void;
  initialFilters?: MentorFilterState;
}

const STATES = Object.keys(statesCitiesData);

export function MentorFilterModal({
  isOpen,
  onClose,
  onApply,
  initialFilters,
}: MentorFilterModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const expertiseRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);

  const [headlineSearch, setHeadlineSearch] = useState("");
  const [expertiseSearch, setExpertiseSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [languageSearch, setLanguageSearch] = useState("");

  const [isHeadlineOpen, setIsHeadlineOpen] = useState(false);
  const [isExpertiseOpen, setIsExpertiseOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const [filters, setFilters] = useState<MentorFilterState>(
    initialFilters || {
      headlines: [],
      expertise: [],
      languages: [],
      location: "",
    },
  );

  const filteredExpertise = useMemo(() => {
    return categoriesData.filter(
      (cat) =>
        cat.toLowerCase().includes(expertiseSearch.toLowerCase()) &&
        !filters.expertise.includes(cat),
    );
  }, [expertiseSearch, filters.expertise]);

  const filteredLocations = useMemo(() => {
    return STATES.filter((state) =>
      state.toLowerCase().includes(locationSearch.toLowerCase()),
    );
  }, [locationSearch]);

  const handleClearFilter = () => {
    const emptyFilters: MentorFilterState = {
      headlines: [],
      expertise: [],
      languages: [],
      location: "",
    };
    setFilters(emptyFilters);
    setHeadlineSearch("");
    setExpertiseSearch("");
    setLocationSearch("");
    setLanguageSearch("");
    onApply(emptyFilters);
    onClose();
  };

  const handleApplyFilter = () => {
    onApply(filters);
    onClose();
  };

  const toggleHeadline = (item: string) => {
    setFilters((prev) => ({
      ...prev,
      headlines: prev.headlines.includes(item)
        ? prev.headlines.filter((h) => h !== item)
        : [...prev.headlines, item],
    }));
  };

  const toggleExpertise = (item: string) => {
    setFilters((prev) => ({
      ...prev,
      expertise: prev.expertise.includes(item)
        ? prev.expertise.filter((e) => e !== item)
        : [...prev.expertise, item],
    }));
  };

  const toggleLanguage = (item: string) => {
    setFilters((prev) => ({
      ...prev,
      languages: prev.languages.includes(item)
        ? prev.languages.filter((l) => l !== item)
        : [...prev.languages, item],
    }));
  };

  const selectLocation = (state: string) => {
    setFilters((prev) => ({
      ...prev,
      location: prev.location === state ? "" : state,
    }));
  };

  useEffect(() => {
    if (isLocationOpen && locationRef.current) {
      locationRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [isLocationOpen]);

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
        isHeadlineOpen &&
        headlineRef.current &&
        !headlineRef.current.contains(event.target as Node)
      ) {
        setIsHeadlineOpen(false);
      }

      if (
        isExpertiseOpen &&
        expertiseRef.current &&
        !expertiseRef.current.contains(event.target as Node)
      ) {
        setIsExpertiseOpen(false);
      }

      if (
        isLocationOpen &&
        locationRef.current &&
        !locationRef.current.contains(event.target as Node)
      ) {
        setIsLocationOpen(false);
      }

      if (
        isLanguageOpen &&
        languageRef.current &&
        !languageRef.current.contains(event.target as Node)
      ) {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [
    isOpen,
    onClose,
    handleApplyFilter,
    isHeadlineOpen,
    isExpertiseOpen,
    isLocationOpen,
    isLanguageOpen,
  ]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/5"
        onClick={handleApplyFilter}
      />

      {/* Modal Content */}
      <div
        className="absolute top-full right-0 z-50 mt-2 w-[245px]"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-[12px] rounded-[12px] bg-white shadow-[0_0_15px_0_rgba(0,0,0,0.15)] p-[12px_8px] max-h-[90vh]">
          <div className="flex flex-col gap-[12px] overflow-y-auto max-h-[420px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Headlines Dropdown */}
            <div className="flex flex-col gap-[8px] w-full" ref={headlineRef}>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-normal text-black font-inter-tight capitalize">
                  Headline
                </span>
                <button onClick={() => setIsHeadlineOpen(!isHeadlineOpen)}>
                  <ChevronDown className="w-3 h-3 text-[#B2B2B2]" />
                </button>
              </div>
              <div className="relative">
                <div className="flex items-center gap-[4px] px-[6px] py-[10px] border border-[#E1E4EA] rounded-[8px] bg-white">
                  <Search className="w-[12px] h-[12px] text-[#B2B2B2]" />
                  <input
                    type="text"
                    placeholder="Search/Add Headlines"
                    value={headlineSearch}
                    onChange={(e) => {
                      setHeadlineSearch(e.target.value);
                      setIsHeadlineOpen(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (
                          headlineSearch.trim() &&
                          !filters.headlines.includes(headlineSearch)
                        ) {
                          toggleHeadline(headlineSearch);
                          setHeadlineSearch("");
                          setIsHeadlineOpen(false);
                        }
                      }
                    }}
                    onBlur={() => {
                      if (
                        headlineSearch.trim() &&
                        !filters.headlines.includes(headlineSearch.trim())
                      ) {
                        toggleHeadline(headlineSearch.trim());
                        setHeadlineSearch("");
                      }
                    }}
                    onFocus={() => setIsHeadlineOpen(true)}
                    className="flex-1 text-[11px] font-normal font-inter-tight placeholder:text-black/30 placeholder:capitalize border-0 focus:outline-none bg-transparent"
                  />
                </div>
                {isHeadlineOpen && headlineSearch && (
                  <div className="absolute top-full mt-2 w-full max-h-[160px] overflow-y-auto bg-white rounded-[8px] shadow-[0_2px_20px_2px_rgba(0,0,0,0.15)] p-[8px] flex flex-col gap-[10px] z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <button
                      onClick={() => {
                        toggleHeadline(headlineSearch);
                        setHeadlineSearch("");
                        setIsHeadlineOpen(false);
                      }}
                      className="text-left px-[2px] py-[2px] text-[11px] font-normal rounded hover:opacity-80 text-[#8463FF] bg-[#8463FF0D]"
                    >
                      + Add &quot;{headlineSearch}&quot;
                    </button>
                  </div>
                )}
              </div>
              {filters.headlines.length > 0 && (
                <div className="flex flex-wrap gap-[4px] mt-1">
                  {filters.headlines.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-[5px] px-[7px] py-[4px] bg-[#F5F5F5] rounded-[25px]"
                    >
                      <span className="text-[10px] font-normal text-black font-inter-tight">
                        {item}
                      </span>
                      <button onClick={() => toggleHeadline(item)}>
                        <X className="w-[10px] h-[10px] text-[#606060]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

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
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (
                          expertiseSearch.trim() &&
                          !filters.expertise.includes(expertiseSearch)
                        ) {
                          toggleExpertise(expertiseSearch);
                          setExpertiseSearch("");
                          setIsExpertiseOpen(false);
                        }
                      }
                    }}
                    onBlur={() => {
                      if (
                        expertiseSearch.trim() &&
                        !filters.expertise.includes(expertiseSearch.trim())
                      ) {
                        toggleExpertise(expertiseSearch.trim());
                        setExpertiseSearch("");
                      }
                    }}
                    onFocus={() => setIsExpertiseOpen(true)}
                    className="flex-1 text-[11px] font-normal font-inter-tight placeholder:text-black/30 placeholder:capitalize border-0 focus:outline-none bg-transparent"
                  />
                </div>
                {isExpertiseOpen && expertiseSearch && (
                  <div className="absolute top-full mt-2 w-full max-h-[160px] overflow-y-auto bg-white rounded-[8px] shadow-[0_2px_20px_2px_rgba(0,0,0,0.15)] p-[8px] flex flex-col gap-[10px] z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {filteredExpertise.length > 0 ? (
                      <>
                        {filteredExpertise.map((item) => (
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
                        ))}
                        {expertiseSearch.trim() &&
                          !categoriesData.includes(expertiseSearch) && (
                            <button
                              onClick={() => {
                                toggleExpertise(expertiseSearch);
                                setExpertiseSearch("");
                                setIsExpertiseOpen(false);
                              }}
                              className="text-left px-[2px] py-[2px] text-[11px] font-normal rounded border-t border-[#E1E4EA] hover:opacity-80 text-[#8463FF] bg-[#8463FF0D]"
                            >
                              + Add &quot;{expertiseSearch}&quot;
                            </button>
                          )}
                      </>
                    ) : expertiseSearch.trim() ? (
                      <button
                        onClick={() => {
                          toggleExpertise(expertiseSearch);
                          setExpertiseSearch("");
                          setIsExpertiseOpen(false);
                        }}
                        className="text-left px-[2px] py-[2px] text-[11px] font-normal rounded hover:opacity-80 text-[#8463FF] bg-[#8463FF0D]"
                      >
                        + Add &quot;{expertiseSearch}&quot;
                      </button>
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
                      className="flex items-center gap-[5px] px-[7px] py-[4px] bg-[#F5F5F5] rounded-[25px]"
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

            {/* Language Dropdown */}
            <div className="flex flex-col gap-[8px] w-full" ref={languageRef}>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-normal text-black font-inter-tight capitalize">
                  Language
                </span>
                <button onClick={() => setIsLanguageOpen(!isLanguageOpen)}>
                  <ChevronDown className="w-3 h-3 text-[#B2B2B2]" />
                </button>
              </div>
              <div className="relative">
                <div className="flex items-center gap-[4px] px-[6px] py-[10px] border border-[#E1E4EA] rounded-[8px] bg-white">
                  <Search className="w-[12px] h-[12px] text-[#B2B2B2]" />
                  <input
                    type="text"
                    placeholder="Search/Add Languages"
                    value={languageSearch}
                    onChange={(e) => {
                      setLanguageSearch(e.target.value);
                      setIsLanguageOpen(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (
                          languageSearch.trim() &&
                          !filters.languages.includes(languageSearch)
                        ) {
                          toggleLanguage(languageSearch);
                          setLanguageSearch("");
                          setIsLanguageOpen(false);
                        }
                      }
                    }}
                    onBlur={() => {
                      if (
                        languageSearch.trim() &&
                        !filters.languages.includes(languageSearch.trim())
                      ) {
                        toggleLanguage(languageSearch.trim());
                        setLanguageSearch("");
                      }
                    }}
                    onFocus={() => setIsLanguageOpen(true)}
                    className="flex-1 text-[11px] font-normal font-inter-tight placeholder:text-black/30 placeholder:capitalize border-0 focus:outline-none bg-transparent"
                  />
                </div>
                {isLanguageOpen && languageSearch && (
                  <div className="absolute top-full mt-2 w-full max-h-[160px] overflow-y-auto bg-white rounded-[8px] shadow-[0_2px_20px_2px_rgba(0,0,0,0.15)] p-[8px] flex flex-col gap-[10px] z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <button
                      onClick={() => {
                        toggleLanguage(languageSearch);
                        setLanguageSearch("");
                        setIsLanguageOpen(false);
                      }}
                      className="text-left px-[2px] py-[2px] text-[11px] font-normal rounded hover:opacity-80 text-[#8463FF] bg-[#8463FF0D]"
                    >
                      + Add &quot;{languageSearch}&quot;
                    </button>
                  </div>
                )}
              </div>
              {filters.languages.length > 0 && (
                <div className="flex flex-wrap gap-[4px] mt-1">
                  {filters.languages.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-[5px] px-[7px] py-[4px] bg-[#F5F5F5] rounded-[25px]"
                    >
                      <span className="text-[10px] font-normal text-black font-inter-tight">
                        {item}
                      </span>
                      <button onClick={() => toggleLanguage(item)}>
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
                  <div className="flex items-center gap-[5px] px-[7px] py-[4px] bg-[#F5F5F5] rounded-[25px]">
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
