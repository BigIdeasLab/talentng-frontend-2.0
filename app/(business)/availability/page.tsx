"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/useToast";
import {
  getMyAvailability,
  setMyAvailability,
  type AvailabilitySlot,
} from "@/lib/api/mentorship";
import { Check, Clock, Zap } from "lucide-react";

// ============ Constants ============

const DAYS = [
  { index: 0, name: "Monday", short: "Mon" },
  { index: 1, name: "Tuesday", short: "Tue" },
  { index: 2, name: "Wednesday", short: "Wed" },
  { index: 3, name: "Thursday", short: "Thu" },
  { index: 4, name: "Friday", short: "Fri" },
  { index: 5, name: "Saturday", short: "Sat" },
  { index: 6, name: "Sunday", short: "Sun" },
];

const TIME_SLOTS = [
  { value: "06:00", label: "6 AM" },
  { value: "06:30", label: "6:30" },
  { value: "07:00", label: "7 AM" },
  { value: "07:30", label: "7:30" },
  { value: "08:00", label: "8 AM" },
  { value: "08:30", label: "8:30" },
  { value: "09:00", label: "9 AM" },
  { value: "09:30", label: "9:30" },
  { value: "10:00", label: "10 AM" },
  { value: "10:30", label: "10:30" },
  { value: "11:00", label: "11 AM" },
  { value: "11:30", label: "11:30" },
  { value: "12:00", label: "12 PM" },
  { value: "12:30", label: "12:30" },
  { value: "13:00", label: "1 PM" },
  { value: "13:30", label: "1:30" },
  { value: "14:00", label: "2 PM" },
  { value: "14:30", label: "2:30" },
  { value: "15:00", label: "3 PM" },
  { value: "15:30", label: "3:30" },
  { value: "16:00", label: "4 PM" },
  { value: "16:30", label: "4:30" },
  { value: "17:00", label: "5 PM" },
  { value: "17:30", label: "5:30" },
  { value: "18:00", label: "6 PM" },
  { value: "18:30", label: "6:30" },
  { value: "19:00", label: "7 PM" },
  { value: "19:30", label: "7:30" },
  { value: "20:00", label: "8 PM" },
  { value: "20:30", label: "8:30" },
  { value: "21:00", label: "9 PM" },
];

// ============ Helpers ============

const getTimeLabel = (slot: { value: string; label: string }) => {
  if (slot.value.endsWith(":00")) return slot.label;
  return "";
};

// ============ Component ============

export default function AvailabilityPage() {
  const { toast } = useToast();

  // Shared state
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [savedSlots, setSavedSlots] = useState<Set<string>>(new Set()); // Track what's saved in backend
  const [sessionDuration, setSessionDuration] = useState("60");
  const [bufferTime, setBufferTime] = useState("15");
  const [timezone, setTimezone] = useState("WAT");
  const [defaultMeetingLink, setDefaultMeetingLink] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Grid-specific state
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<"select" | "deselect">("select");
  const gridRef = useRef<HTMLDivElement>(null);

  // ============ Data Fetching ============

  const fetchAvailability = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getMyAvailability();

      if (response.sessionDuration) {
        setSessionDuration(response.sessionDuration.toString());
      }
      if (response.timezone) {
        setTimezone(response.timezone);
      }

      const slots = new Set<string>();

      response.slots?.forEach(
        (slot: { dayOfWeek: number; startTime: string; endTime: string }) => {
          const startIdx = TIME_SLOTS.findIndex(
            (t) => t.value === slot.startTime,
          );
          const endIdx = TIME_SLOTS.findIndex((t) => t.value === slot.endTime);
          if (startIdx !== -1 && endIdx !== -1) {
            for (let i = startIdx; i < endIdx; i++) {
              slots.add(`${slot.dayOfWeek}-${i}`);
            }
          }
        },
      );

      setSelectedSlots(slots);
      setSavedSlots(new Set(slots));
      setIsSaved(true);
    } catch {
      // No existing availability
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  // ============ Grid Handlers ============

  const cellsPerSlot = Math.max(1, parseInt(sessionDuration, 10) / 30);

  const canSelectBlock = (dayIndex: number, startIndex: number) => {
    if (startIndex + cellsPerSlot > TIME_SLOTS.length) return false;
    for (let i = 0; i < cellsPerSlot; i++) {
      if (selectedSlots.has(`${dayIndex}-${startIndex + i}`)) return false;
    }
    return true;
  };

  const getBlockStartFor = (dayIndex: number, timeIndex: number) => {
    let runStart = timeIndex;
    while (runStart > 0 && selectedSlots.has(`${dayIndex}-${runStart - 1}`)) {
      runStart--;
    }
    const offset = (timeIndex - runStart) % cellsPerSlot;
    return timeIndex - offset;
  };

  const selectBlock = (dayIndex: number, startIndex: number) => {
    if (!canSelectBlock(dayIndex, startIndex)) return;
    setSelectedSlots((prev) => {
      const next = new Set(prev);
      for (let i = 0; i < cellsPerSlot; i++) {
        const idx = startIndex + i;
        if (idx >= TIME_SLOTS.length) break;
        next.add(`${dayIndex}-${idx}`);
      }
      return next;
    });
    setIsSaved(false);
    setHasChanges(true);
  };

  const deselectBlock = (dayIndex: number, timeIndex: number) => {
    const blockStart = getBlockStartFor(dayIndex, timeIndex);
    setSelectedSlots((prev) => {
      const next = new Set(prev);
      for (let i = 0; i < cellsPerSlot; i++) {
        next.delete(`${dayIndex}-${blockStart + i}`);
      }
      return next;
    });
    setIsSaved(false);
    setHasChanges(true);
  };

  const lastDragBlock = useRef<string | null>(null);

  const handleMouseDown = (dayIndex: number, timeIndex: number) => {
    const isSelected = selectedSlots.has(`${dayIndex}-${timeIndex}`);
    if (!isSelected && !canSelectBlock(dayIndex, timeIndex)) return;
    setDragMode(isSelected ? "deselect" : "select");
    setIsDragging(true);
    if (isSelected) {
      const blockStart = getBlockStartFor(dayIndex, timeIndex);
      lastDragBlock.current = `${dayIndex}-${blockStart}`;
      deselectBlock(dayIndex, timeIndex);
    } else {
      lastDragBlock.current = `${dayIndex}-${timeIndex}`;
      selectBlock(dayIndex, timeIndex);
    }
  };

  const handleMouseEnter = (dayIndex: number, timeIndex: number) => {
    if (!isDragging) return;
    const isSelected = selectedSlots.has(`${dayIndex}-${timeIndex}`);
    if (dragMode === "deselect" && isSelected) {
      const blockStart = getBlockStartFor(dayIndex, timeIndex);
      const blockKey = `${dayIndex}-${blockStart}`;
      if (blockKey === lastDragBlock.current) return;
      lastDragBlock.current = blockKey;
      deselectBlock(dayIndex, timeIndex);
    } else if (dragMode === "select" && !isSelected) {
      const blockKey = `${dayIndex}-${timeIndex}`;
      if (blockKey === lastDragBlock.current) return;
      lastDragBlock.current = blockKey;
      selectBlock(dayIndex, timeIndex);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    lastDragBlock.current = null;
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      lastDragBlock.current = null;
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  // ============ Shared Handlers ============

  const clearAll = () => {
    setSelectedSlots(new Set());
    setIsSaved(false);
    setHasChanges(true);
  };

  const selectWeekdays9to5 = () => {
    const slots = new Set<string>();
    const startIdx = TIME_SLOTS.findIndex((t) => t.value === "09:00");
    const endIdx = TIME_SLOTS.findIndex((t) => t.value === "17:00");
    for (let day = 0; day < 5; day++) {
      for (let time = startIdx; time < endIdx; time++) {
        slots.add(`${day}-${time}`);
      }
    }
    setSelectedSlots(slots);
    setIsSaved(false);
    setHasChanges(true);
  };

  const selectMornings = () => {
    const slots = new Set<string>();
    const startIdx = TIME_SLOTS.findIndex((t) => t.value === "09:00");
    const endIdx = TIME_SLOTS.findIndex((t) => t.value === "12:00");
    for (let day = 0; day < 7; day++) {
      for (let time = startIdx; time < endIdx; time++) {
        slots.add(`${day}-${time}`);
      }
    }
    setSelectedSlots(slots);
    setIsSaved(false);
    setHasChanges(true);
  };

  const selectAfternoons = () => {
    const slots = new Set<string>();
    const startIdx = TIME_SLOTS.findIndex((t) => t.value === "14:00");
    const endIdx = TIME_SLOTS.findIndex((t) => t.value === "18:00");
    for (let day = 0; day < 7; day++) {
      for (let time = startIdx; time < endIdx; time++) {
        slots.add(`${day}-${time}`);
      }
    }
    setSelectedSlots(slots);
    setIsSaved(false);
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const slotsArray: AvailabilitySlot[] = [];

      for (let day = 0; day < 7; day++) {
        const daySlots = Array.from(selectedSlots)
          .filter((key) => key.startsWith(`${day}-`))
          .map((key) => parseInt(key.split("-")[1], 10))
          .sort((a, b) => a - b);

        if (daySlots.length === 0) continue;

        let rangeStart = daySlots[0];
        let rangeEnd = daySlots[0];

        for (let i = 1; i <= daySlots.length; i++) {
          const current = daySlots[i];
          const isConsecutive = current === rangeEnd + 1;

          if (!isConsecutive || i === daySlots.length) {
            slotsArray.push({
              dayOfWeek: day,
              startTime: TIME_SLOTS[rangeStart].value,
              endTime: TIME_SLOTS[rangeEnd + 1]?.value || "21:30",
            });

            if (i < daySlots.length) {
              rangeStart = current;
              rangeEnd = current;
            }
          } else {
            rangeEnd = current;
          }
        }
      }

      await setMyAvailability({
        sessionDuration: parseInt(sessionDuration, 10),
        bufferTime: parseInt(bufferTime, 10),
        timezone,
        defaultMeetingLink: defaultMeetingLink || undefined,
        slots: slotsArray,
      });

      setSavedSlots(new Set(selectedSlots));
      setIsSaved(true);
      setHasChanges(false);
      toast({
        title: "Availability saved",
        description: "Your weekly schedule has been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to save availability",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ============ Stats ============

  const getTotalHours = () => {
    const totalSlots = selectedSlots.size;
    const hours = Math.floor(totalSlots / 2);
    const hasHalf = totalSlots % 2 === 1;
    return hasHalf ? `${hours}.5h` : `${hours}h`;
  };

  const getEnabledDaysCount = () => {
    const daysWithSlots = new Set<number>();
    selectedSlots.forEach((key) => {
      const day = parseInt(key.split("-")[0], 10);
      daysWithSlots.add(day);
    });
    return daysWithSlots.size;
  };

  // ============ Render ============

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E91E8C] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="h-screen overflow-x-hidden bg-white flex flex-col">
      {/* Header */}
      <div className="w-full px-[25px] pt-[19px] pb-[16px] border-b border-[#E1E4EA] flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-[16px] font-medium font-inter-tight text-black leading-[16px]">
            Availability
          </h1>
          <div className="flex items-center gap-3">
            {isSaved && !hasChanges && (
              <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-green-700">
                <Check className="h-4 w-4" />
                <span className="font-inter-tight text-[13px] font-medium">Saved</span>
              </div>
            )}
            {hasChanges && (
              <div className="flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-amber-700">
                <span className="font-inter-tight text-[13px] font-medium">Unsaved changes</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {/* Stats & Quick Actions */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 shadow-sm">
              <Clock className="h-4 w-4 text-[#E91E8C]" />
              <span className="text-sm font-medium text-black">
                {getTotalHours()}
              </span>
              <span className="text-xs text-[#525866]">/ week</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 shadow-sm">
              <div className="flex h-4 w-4 items-center justify-center rounded bg-[#E91E8C] text-[10px] font-bold text-white">
                {getEnabledDaysCount()}
              </div>
              <span className="text-xs text-[#525866]">days available</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={clearAll}
              className="rounded-lg border border-[#E1E4EA] bg-white px-3 py-2 text-xs font-medium text-[#525866] transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"
            >
              Clear All
            </button>
            <button
              onClick={selectWeekdays9to5}
              className="flex items-center gap-1.5 rounded-lg border border-[#E1E4EA] bg-white px-3 py-2 text-xs font-medium text-[#525866] transition-colors hover:border-[#E91E8C] hover:bg-[#FDF2F8] hover:text-[#E91E8C]"
            >
              <Zap className="h-3 w-3" />
              Weekdays 9-5
            </button>
            <button
              onClick={selectMornings}
              className="rounded-lg border border-[#E1E4EA] bg-white px-3 py-2 text-xs font-medium text-[#525866] transition-colors hover:border-[#E91E8C] hover:bg-[#FDF2F8] hover:text-[#E91E8C]"
            >
              Mornings
            </button>
            <button
              onClick={selectAfternoons}
              className="rounded-lg border border-[#E1E4EA] bg-white px-3 py-2 text-xs font-medium text-[#525866] transition-colors hover:border-[#E91E8C] hover:bg-[#FDF2F8] hover:text-[#E91E8C]"
            >
              Afternoons
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-xl border border-[#E1E4EA] bg-white shadow-sm">
          {/* Settings Bar */}
          <div className="flex flex-wrap gap-4 border-b border-[#E1E4EA] bg-[#FAFAFA] px-5 py-4">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-[#525866]">
                Duration
              </label>
              <Select
                value={sessionDuration}
                onValueChange={(v) => {
                  if (selectedSlots.size > 0) {
                    const confirmed = window.confirm(
                      "Changing the session duration will clear all your current availability slots. Are you sure?",
                    );
                    if (!confirmed) return;
                    setSelectedSlots(new Set());
                  }
                  setSessionDuration(v);
                  setHasChanges(true);
                }}
              >
                <SelectTrigger className="h-8 w-24 border-[#E1E4EA] bg-white text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 min</SelectItem>
                  <SelectItem value="60">60 min</SelectItem>
                  <SelectItem value="90">90 min</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-[#525866]">
                Buffer
              </label>
              <Select
                value={bufferTime}
                onValueChange={(v) => {
                  setBufferTime(v);
                  setHasChanges(true);
                }}
              >
                <SelectTrigger className="h-8 w-20 border-[#E1E4EA] bg-white text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">None</SelectItem>
                  <SelectItem value="15">15 min</SelectItem>
                  <SelectItem value="30">30 min</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-[#525866]">
                Timezone
              </label>
              <Select
                value={timezone}
                onValueChange={(v) => {
                  setTimezone(v);
                  setHasChanges(true);
                }}
              >
                <SelectTrigger className="h-8 w-28 border-[#E1E4EA] bg-white text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WAT">WAT (UTC+1)</SelectItem>
                  <SelectItem value="GMT">GMT (UTC+0)</SelectItem>
                  <SelectItem value="EST">EST (UTC-5)</SelectItem>
                  <SelectItem value="PST">PST (UTC-8)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-[#525866]">
                Meeting Link
              </label>
              <Input
                type="url"
                placeholder="https://meet.google.com/..."
                value={defaultMeetingLink}
                onChange={(e) => {
                  setDefaultMeetingLink(e.target.value);
                  setHasChanges(true);
                }}
                className="h-8 w-48 border-[#E1E4EA] text-xs"
              />
            </div>
          </div>

          {/* Grid View */}
          <div className="overflow-x-auto p-4">
            <div
              ref={gridRef}
              className="grid select-none"
              style={{ gridTemplateColumns: "60px repeat(7, 1fr)" }}
              onMouseLeave={() => setIsDragging(false)}
            >
              {/* Header Row */}
              <div className="sticky left-0 z-10 bg-white" />
              {DAYS.map((day) => {
                const dayHasSlots = Array.from(selectedSlots).some((key) =>
                  key.startsWith(`${day.index}-`),
                );
                return (
                  <div
                    key={day.index}
                    className="border-b border-l border-[#E1E4EA] bg-[#FAFAFA] px-2 py-3 text-center first:border-l-0"
                  >
                    <div
                      className={`text-sm font-semibold ${dayHasSlots ? "text-[#E91E8C]" : "text-black"}`}
                    >
                      {day.short}
                    </div>
                    <div className="mt-0.5 text-[10px] text-[#99A0AE]">
                      {day.name}
                    </div>
                  </div>
                );
              })}

              {/* Time Rows */}
              {TIME_SLOTS.map((slot, timeIndex) => (
                <div key={`row-${timeIndex}`} className="contents">
                  {/* Time Label */}
                  <div
                    className="sticky left-0 z-10 flex items-center justify-end bg-white pr-3"
                    style={{ height: "24px" }}
                  >
                    <span className="text-[11px] font-medium text-[#525866]">
                      {getTimeLabel(slot)}
                    </span>
                  </div>

                  {/* Day Cells */}
                  {DAYS.map((day) => {
                    const key = `${day.index}-${timeIndex}`;
                    const isSelected = selectedSlots.has(key);
                    const wasSaved = savedSlots.has(key);
                    const isTopOfHour = slot.value.endsWith(":00");
                    const prevSelected = selectedSlots.has(
                      `${day.index}-${timeIndex - 1}`,
                    );
                    const nextSelected = selectedSlots.has(
                      `${day.index}-${timeIndex + 1}`,
                    );
                    const prevSaved = savedSlots.has(
                      `${day.index}-${timeIndex - 1}`,
                    );
                    const nextSaved = savedSlots.has(
                      `${day.index}-${timeIndex + 1}`,
                    );

                    // Determine slot state
                    const isSavedSlot = isSelected && wasSaved; // Green - saved in backend
                    const isNewSlot = isSelected && !wasSaved; // Purple - newly added
                    const isRemovedSlot = !isSelected && wasSaved; // Red - will be removed

                    // Determine if this cell is the top of a duration block
                    let isBlockTop = false;
                    if (isSelected) {
                      let runStart = timeIndex;
                      while (
                        runStart > 0 &&
                        selectedSlots.has(`${day.index}-${runStart - 1}`)
                      ) {
                        runStart--;
                      }
                      isBlockTop = (timeIndex - runStart) % cellsPerSlot === 0;
                    }

                    // Determine border radius based on neighbors (for selected slots)
                    let borderRadius = "";
                    if (isSelected) {
                      const isTop = !prevSelected;
                      const isBottom = !nextSelected;
                      if (isTop && isBottom) borderRadius = "rounded";
                      else if (isTop) borderRadius = "rounded-t";
                      else if (isBottom) borderRadius = "rounded-b";
                    }

                    // Border radius for removed slots indicator
                    let removedRadius = "";
                    if (isRemovedSlot) {
                      const isTop = !prevSaved || prevSelected;
                      const isBottom = !nextSaved || nextSelected;
                      if (isTop && isBottom) removedRadius = "rounded";
                      else if (isTop) removedRadius = "rounded-t";
                      else if (isBottom) removedRadius = "rounded-b";
                    }

                    // Slot color
                    const slotColor = isSavedSlot
                      ? "bg-emerald-500" // Green for saved
                      : isNewSlot
                        ? "bg-[#E91E8C]" // Purple for new
                        : "";

                    return (
                      <div
                        key={`cell-${day.index}-${timeIndex}`}
                        className={`relative cursor-pointer border-l transition-colors ${
                          isTopOfHour
                            ? "border-t border-[#E1E4EA]"
                            : "border-t border-[#F0F0F0]"
                        } first:border-l-0 ${
                          isSelected
                            ? ""
                            : isRemovedSlot
                              ? "bg-red-50"
                              : "hover:bg-[#FDF2F8]"
                        }`}
                        style={{ height: "24px" }}
                        onMouseDown={() =>
                          handleMouseDown(day.index, timeIndex)
                        }
                        onMouseEnter={() =>
                          handleMouseEnter(day.index, timeIndex)
                        }
                        onMouseUp={handleMouseUp}
                      >
                        {/* Saved or New slot */}
                        {isSelected && (
                          <div
                            className={`absolute inset-x-1 inset-y-0 ${slotColor} ${borderRadius}`}
                          >
                            {isBlockTop && (
                              <span
                                className="absolute left-0 right-0 top-0 flex items-center justify-center text-[9px] font-medium text-white/90 pointer-events-none select-none z-10"
                                style={{ height: `${cellsPerSlot * 24}px` }}
                              >
                                {sessionDuration}m
                              </span>
                            )}
                          </div>
                        )}
                        {/* Removed slot indicator */}
                        {isRemovedSlot && (
                          <div
                            className={`absolute inset-x-1 inset-y-0 border-2 border-dashed border-red-400 bg-red-100/50 ${removedRadius}`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-[#E1E4EA] bg-[#FAFAFA] px-5 py-4">
            <div className="text-sm text-[#525866]">
              <span className="font-semibold text-[#E91E8C]">
                {selectedSlots.size}
              </span>{" "}
              slots selected ({getTotalHours()} per week)
            </div>
            <Button
              onClick={handleSave}
              disabled={isSaving || !hasChanges}
              className="rounded-lg bg-[#E91E8C] px-6 py-2 text-sm font-medium text-white hover:bg-[#D1187D] disabled:opacity-50"
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving...
                </span>
              ) : (
                "Save Availability"
              )}
            </Button>
          </div>
        </div>

        {/* Legend & Help Text */}
        <div className="mt-4 flex flex-col items-center gap-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded bg-emerald-500" />
              <span className="text-xs text-[#525866]">Saved</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded bg-[#E91E8C]" />
              <span className="text-xs text-[#525866]">New</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded border-2 border-dashed border-red-400 bg-red-100" />
              <span className="text-xs text-[#525866]">Will be removed</span>
            </div>
          </div>
          <p className="text-xs text-[#99A0AE]">
            Click and drag to select time slots. Your availability repeats every
            week.
          </p>
        </div>
      </div>
    </div>
  );
}
