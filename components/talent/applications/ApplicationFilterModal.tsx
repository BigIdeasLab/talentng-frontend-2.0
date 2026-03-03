"use client";

import { useState, useEffect, useRef } from "react";
import { X, ChevronDown } from "lucide-react";

export type DateRangeType = "all" | "today" | "week" | "month";

export interface ApplicationFilterState {
  dateRange: DateRangeType;
  type?: string[];
}

interface ApplicationFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: ApplicationFilterState) => void;
  initialFilters?: ApplicationFilterState;
  availableTypes?: { label: string; value: string }[];
}

const dateRangeOptions: { value: DateRangeType; label: string }[] = [
  { value: "all", label: "All time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
];

export function ApplicationFilterModal({
  isOpen,
  onClose,
  onApply,
  initialFilters,
  availableTypes = [],
}: ApplicationFilterModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<ApplicationFilterState>(
    initialFilters || {
      dateRange: "all",
      type: [],
    },
  );

  const handleClearFilter = () => {
    const emptyFilters: ApplicationFilterState = {
      dateRange: "all",
      type: [],
    };
    setFilters(emptyFilters);
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
      type: prev.type?.includes(type)
        ? prev.type.filter((t) => t !== type)
        : [...(prev.type || []), type],
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
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, handleApplyFilter]);

  const getFilterCount = () => {
    let count = 0;
    if (filters.dateRange !== "all") count += 1;
    if (filters.type && filters.type.length > 0) count += filters.type.length;
    return count;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/5"
        onClick={handleApplyFilter}
      />

      <div className="absolute top-[100%] right-0 mt-2 z-50" ref={modalRef}>
        <div className="w-[245px] flex flex-col gap-[12px] rounded-[12px] bg-white shadow-[0_0_15px_0_rgba(0,0,0,0.15)] p-[12px_8px] max-h-[80vh]">
          <div className="flex flex-col gap-[12px] overflow-y-auto max-h-[380px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Date Range */}
            <div className="flex flex-col gap-[8px] w-full">
              <span className="text-[11px] font-normal text-black font-inter-tight">
                Date Range
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

            {/* Types (Optional) */}
            {availableTypes.length > 0 && (
              <div className="flex flex-col gap-[8px] w-full">
                <span className="text-[11px] font-normal text-black font-inter-tight">
                  Type
                </span>
                <div className="flex flex-wrap gap-[6px]">
                  {availableTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => toggleType(type.value)}
                      className={`px-[10px] py-[6px] rounded-[20px] text-[10px] font-medium font-inter-tight transition-colors ${
                        filters.type?.includes(type.value)
                          ? "bg-[#5C30FF] text-white"
                          : "bg-[#F5F5F5] text-black hover:bg-gray-200"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
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
              <span className="text-[11px] font-normal text-white text-center font-aeonik-trial">
                Apply
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
