"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { X, Search, ChevronDown } from "lucide-react";

export type DateRangeType = "all" | "today" | "week" | "month";

export interface HiredTalentFilterState {
  location: string;
  dateRange: DateRangeType;
}

interface HiredTalentFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: HiredTalentFilterState) => void;
  initialFilters?: HiredTalentFilterState;
  availableLocations: string[];
}

const dateRangeOptions: { value: DateRangeType; label: string }[] = [
  { value: "all", label: "All time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
];

export function HiredTalentFilterModal({
  isOpen,
  onClose,
  onApply,
  initialFilters,
  availableLocations,
}: HiredTalentFilterModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const [locationSearch, setLocationSearch] = useState("");
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const [filters, setFilters] = useState<HiredTalentFilterState>(
    initialFilters || {
      location: "",
      dateRange: "all",
    },
  );

  const filteredLocations = useMemo(() => {
    return availableLocations.filter((location) =>
      location.toLowerCase().includes(locationSearch.toLowerCase()),
    );
  }, [availableLocations, locationSearch]);

  const handleClearFilter = () => {
    const emptyFilters: HiredTalentFilterState = {
      location: "",
      dateRange: "all",
    };
    setFilters(emptyFilters);
    setLocationSearch("");
    onApply(emptyFilters);
    onClose();
  };

  const handleApplyFilter = () => {
    onApply(filters);
    onClose();
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
        isLocationOpen &&
        locationRef.current &&
        !locationRef.current.contains(event.target as Node)
      ) {
        setIsLocationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, handleApplyFilter, isLocationOpen]);

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
          <div className="flex flex-col gap-[12px] overflow-y-auto max-h-[70vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
                    placeholder="Search Location"
                    value={filters.location || locationSearch}
                    onChange={(e) => {
                      setLocationSearch(e.target.value);
                      setFilters((prev) => ({ ...prev, location: "" }));
                      setIsLocationOpen(true);
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
              {filters.location && (
                <div className="flex flex-wrap gap-[4px]">
                  <div className="flex items-center gap-[5px] px-[7px] py-[8px] bg-[#F5F5F5] rounded-[25px]">
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

            {/* Date Range */}
            <div className="flex flex-col gap-[8px] w-full">
              <span className="text-[11px] font-normal text-black font-inter-tight capitalize">
                Hired Date
              </span>
              <div className="flex flex-wrap gap-[6px]">
                {dateRangeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        dateRange: option.value,
                      }))
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
          <div className="flex items-center gap-[4px]">
            <button
              onClick={handleClearFilter}
              className="flex-1 flex items-center justify-center px-4 py-[13px] border border-[#E1E4EA] rounded-[8px] bg-white"
            >
              <span className="text-[11px] font-normal text-black text-center font-inter-tight">
                Clear Filter
              </span>
            </button>
            <button
              onClick={handleApplyFilter}
              className="flex-1 flex items-center justify-center px-4 py-[13px] border border-[#5C30FF] rounded-[8px] bg-[#5C30FF]"
            >
              <span className="text-[11px] font-normal text-white text-center font-inter-tight">
                Apply Filter
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
