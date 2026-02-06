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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/useToast";
import {
  getMyAvailability,
  setMyAvailability,
  type AvailabilitySlot,
} from "@/lib/api/mentorship";
import {
  Check,
  Clock,
  Zap,
  Grid3X3,
  List,
  Plus,
  Trash2,
  Copy,
} from "lucide-react";

// ============ Types ============

interface TimeRange {
  id: string;
  startTime: string;
  endTime: string;
}

interface DaySchedule {
  enabled: boolean;
  timeRanges: TimeRange[];
}

type WeekSchedule = Record<number, DaySchedule>;
type ViewMode = "grid" | "list";

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

const TIME_OPTIONS = TIME_SLOTS.map((s) => ({
  value: s.value,
  label: s.label.includes(":") ? s.label : s.label,
}));

// ============ Helpers ============

const generateId = () => Math.random().toString(36).substring(2, 9);

const getTimeLabel = (slot: { value: string; label: string }) => {
  if (slot.value.endsWith(":00")) return slot.label;
  return "";
};

const getTimeLabelFull = (value: string) => {
  const slot = TIME_SLOTS.find((t) => t.value === value);
  if (!slot) return value;
  if (slot.label.includes(":")) {
    const hourSlot = TIME_SLOTS.find(
      (t) => t.value === value.replace(":30", ":00"),
    );
    return hourSlot
      ? `${hourSlot.label.replace(" AM", "").replace(" PM", "")}:30 ${hourSlot.label.includes("AM") ? "AM" : "PM"}`
      : slot.label;
  }
  return slot.label;
};

const getDefaultSchedule = (): WeekSchedule => ({
  0: { enabled: false, timeRanges: [] },
  1: { enabled: false, timeRanges: [] },
  2: { enabled: false, timeRanges: [] },
  3: { enabled: false, timeRanges: [] },
  4: { enabled: false, timeRanges: [] },
  5: { enabled: false, timeRanges: [] },
  6: { enabled: false, timeRanges: [] },
});

// Convert selected slots (grid) to schedule (list)
const slotsToSchedule = (selectedSlots: Set<string>): WeekSchedule => {
  const schedule = getDefaultSchedule();

  for (let day = 0; day < 7; day++) {
    const daySlots = Array.from(selectedSlots)
      .filter((key) => key.startsWith(`${day}-`))
      .map((key) => parseInt(key.split("-")[1], 10))
      .sort((a, b) => a - b);

    if (daySlots.length === 0) continue;

    schedule[day].enabled = true;

    // Merge consecutive slots into ranges
    let rangeStart = daySlots[0];
    let rangeEnd = daySlots[0];

    for (let i = 1; i <= daySlots.length; i++) {
      const current = daySlots[i];
      const isConsecutive = current === rangeEnd + 1;

      if (!isConsecutive || i === daySlots.length) {
        schedule[day].timeRanges.push({
          id: generateId(),
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

  return schedule;
};

// Convert schedule (list) to selected slots (grid)
const scheduleToSlots = (schedule: WeekSchedule): Set<string> => {
  const slots = new Set<string>();

  Object.entries(schedule).forEach(([dayStr, day]) => {
    if (!day.enabled) return;
    const dayIndex = parseInt(dayStr, 10);

    day.timeRanges.forEach((range) => {
      const startIdx = TIME_SLOTS.findIndex((t) => t.value === range.startTime);
      const endIdx = TIME_SLOTS.findIndex((t) => t.value === range.endTime);
      if (startIdx !== -1 && endIdx !== -1) {
        for (let i = startIdx; i < endIdx; i++) {
          slots.add(`${dayIndex}-${i}`);
        }
      }
    });
  });

  return slots;
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
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Grid-specific state
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<"select" | "deselect">("select");
  const gridRef = useRef<HTMLDivElement>(null);

  // ============ Data Fetching ============

  const fetchAvailability = useCallback(async () => {
    console.log("fetchAvailability: Starting fetch...");
    try {
      setIsLoading(true);
      const response = await getMyAvailability();
      console.log("fetchAvailability: API response:", response);

      if (response.sessionDuration) {
        setSessionDuration(response.sessionDuration.toString());
      }
      if (response.timezone) {
        setTimezone(response.timezone);
      }

      const slots = new Set<string>();
      console.log("fetchAvailability: slots from API:", response.slots);

      // API returns `slots` array directly, not nested in `availableSlots`
      response.slots?.forEach(
        (slot: { dayOfWeek: number; startTime: string; endTime: string }) => {
          console.log("fetchAvailability: Processing slot:", slot);
          const startIdx = TIME_SLOTS.findIndex(
            (t) => t.value === slot.startTime,
          );
          const endIdx = TIME_SLOTS.findIndex((t) => t.value === slot.endTime);
          console.log(
            `fetchAvailability: slot ${slot.startTime}-${slot.endTime}, startIdx=${startIdx}, endIdx=${endIdx}`,
          );
          if (startIdx !== -1 && endIdx !== -1) {
            for (let i = startIdx; i < endIdx; i++) {
              slots.add(`${slot.dayOfWeek}-${i}`);
            }
          }
        },
      );

      console.log("fetchAvailability: Parsed slots:", Array.from(slots));
      setSelectedSlots(slots);
      setSavedSlots(new Set(slots)); // Track what's saved
      setIsSaved(true);
    } catch (error) {
      console.error("fetchAvailability: Error:", error);
      // No existing availability
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  // ============ Grid Handlers ============

  const handleMouseDown = (dayIndex: number, timeIndex: number) => {
    const key = `${dayIndex}-${timeIndex}`;
    const isSelected = selectedSlots.has(key);
    setDragMode(isSelected ? "deselect" : "select");
    setIsDragging(true);
    toggleSlot(dayIndex, timeIndex, !isSelected);
  };

  const handleMouseEnter = (dayIndex: number, timeIndex: number) => {
    if (!isDragging) return;
    toggleSlot(dayIndex, timeIndex, dragMode === "select");
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  const toggleSlot = (dayIndex: number, timeIndex: number, select: boolean) => {
    const key = `${dayIndex}-${timeIndex}`;
    setSelectedSlots((prev) => {
      const next = new Set(prev);
      if (select) next.add(key);
      else next.delete(key);
      return next;
    });
    setIsSaved(false);
    setHasChanges(true);
  };

  // ============ List Handlers ============

  const getSchedule = () => slotsToSchedule(selectedSlots);

  const updateFromSchedule = (schedule: WeekSchedule) => {
    setSelectedSlots(scheduleToSlots(schedule));
    setIsSaved(false);
    setHasChanges(true);
  };

  const toggleDay = (dayIndex: number) => {
    const schedule = getSchedule();
    const day = schedule[dayIndex];
    const newEnabled = !day.enabled;
    schedule[dayIndex] = {
      enabled: newEnabled,
      timeRanges:
        newEnabled && day.timeRanges.length === 0
          ? [{ id: generateId(), startTime: "09:00", endTime: "17:00" }]
          : day.timeRanges,
    };
    updateFromSchedule(schedule);
  };

  const addTimeRange = (dayIndex: number) => {
    const schedule = getSchedule();
    const day = schedule[dayIndex];
    const lastRange = day.timeRanges[day.timeRanges.length - 1];
    const newStart = lastRange ? lastRange.endTime : "09:00";
    const startIndex = TIME_SLOTS.findIndex((t) => t.value === newStart);
    const endIndex = Math.min(startIndex + 4, TIME_SLOTS.length - 1);
    const newEnd = TIME_SLOTS[endIndex]?.value || "17:00";

    schedule[dayIndex].timeRanges.push({
      id: generateId(),
      startTime: newStart,
      endTime: newEnd,
    });
    updateFromSchedule(schedule);
  };

  const removeTimeRange = (dayIndex: number, rangeId: string) => {
    const schedule = getSchedule();
    const day = schedule[dayIndex];
    const newRanges = day.timeRanges.filter((r) => r.id !== rangeId);
    schedule[dayIndex] = {
      ...day,
      enabled: newRanges.length > 0,
      timeRanges: newRanges,
    };
    updateFromSchedule(schedule);
  };

  const updateTimeRange = (
    dayIndex: number,
    rangeId: string,
    field: "startTime" | "endTime",
    value: string,
  ) => {
    const schedule = getSchedule();
    schedule[dayIndex].timeRanges = schedule[dayIndex].timeRanges.map((r) =>
      r.id === rangeId ? { ...r, [field]: value } : r,
    );
    updateFromSchedule(schedule);
  };

  const copyToAll = (dayIndex: number) => {
    const schedule = getSchedule();
    const sourceDay = schedule[dayIndex];
    if (!sourceDay.enabled || sourceDay.timeRanges.length === 0) return;

    DAYS.forEach((day) => {
      if (day.index !== dayIndex) {
        schedule[day.index] = {
          enabled: true,
          timeRanges: sourceDay.timeRanges.map((r) => ({
            ...r,
            id: generateId(),
          })),
        };
      }
    });
    updateFromSchedule(schedule);
    toast({
      title: "Copied",
      description: `${DAYS[dayIndex].name}'s schedule copied to all days`,
    });
  };

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
      const schedule = getSchedule();

      Object.entries(schedule).forEach(([dayStr, day]) => {
        if (day.enabled) {
          day.timeRanges.forEach((range) => {
            slotsArray.push({
              dayOfWeek: parseInt(dayStr, 10),
              startTime: range.startTime,
              endTime: range.endTime,
            });
          });
        }
      });

      await setMyAvailability({
        sessionDuration: parseInt(sessionDuration, 10),
        bufferTime: parseInt(bufferTime, 10),
        timezone,
        defaultMeetingLink: defaultMeetingLink || undefined,
        slots: slotsArray,
      });

      setSavedSlots(new Set(selectedSlots)); // Update saved slots after successful save
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
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#5C30FF] border-t-transparent" />
      </div>
    );
  }

  const schedule = getSchedule();

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <header className="border-b border-[#E1E4EA] bg-white px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-inter-tight text-xl font-semibold text-black">
              Availability
            </h1>
            <p className="mt-1 font-inter-tight text-[13px] text-[#525866]">
              {viewMode === "grid"
                ? "Click and drag to set your recurring weekly availability"
                : "Toggle days and set time ranges for your availability"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex rounded-lg border border-[#E1E4EA] bg-white p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  viewMode === "grid"
                    ? "bg-[#5C30FF] text-white"
                    : "text-[#525866] hover:bg-[#F5F3FF]"
                }`}
              >
                <Grid3X3 className="h-3.5 w-3.5" />
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  viewMode === "list"
                    ? "bg-[#5C30FF] text-white"
                    : "text-[#525866] hover:bg-[#F5F3FF]"
                }`}
              >
                <List className="h-3.5 w-3.5" />
                List
              </button>
            </div>

            {isSaved && !hasChanges && (
              <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-green-700">
                <Check className="h-4 w-4" />
                <span className="text-sm font-medium">Saved</span>
              </div>
            )}
            {hasChanges && (
              <div className="flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-amber-700">
                <span className="text-sm font-medium">Unsaved changes</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="px-6 py-6">
        {/* Stats & Quick Actions */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 shadow-sm">
              <Clock className="h-4 w-4 text-[#5C30FF]" />
              <span className="text-sm font-medium text-black">
                {getTotalHours()}
              </span>
              <span className="text-xs text-[#525866]">/ week</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 shadow-sm">
              <div className="flex h-4 w-4 items-center justify-center rounded bg-[#5C30FF] text-[10px] font-bold text-white">
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
              className="flex items-center gap-1.5 rounded-lg border border-[#E1E4EA] bg-white px-3 py-2 text-xs font-medium text-[#525866] transition-colors hover:border-[#5C30FF] hover:bg-[#F5F3FF] hover:text-[#5C30FF]"
            >
              <Zap className="h-3 w-3" />
              Weekdays 9-5
            </button>
            <button
              onClick={selectMornings}
              className="rounded-lg border border-[#E1E4EA] bg-white px-3 py-2 text-xs font-medium text-[#525866] transition-colors hover:border-[#5C30FF] hover:bg-[#F5F3FF] hover:text-[#5C30FF]"
            >
              Mornings
            </button>
            <button
              onClick={selectAfternoons}
              className="rounded-lg border border-[#E1E4EA] bg-white px-3 py-2 text-xs font-medium text-[#525866] transition-colors hover:border-[#5C30FF] hover:bg-[#F5F3FF] hover:text-[#5C30FF]"
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
                  setSessionDuration(v);
                  setHasChanges(true);
                }}
              >
                <SelectTrigger className="h-8 w-24 border-[#E1E4EA] bg-white text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 min</SelectItem>
                  <SelectItem value="45">45 min</SelectItem>
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
          {viewMode === "grid" && (
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
                        className={`text-sm font-semibold ${dayHasSlots ? "text-[#5C30FF]" : "text-black"}`}
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
                          ? "bg-[#5C30FF]" // Purple for new
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
                                : "hover:bg-[#F5F3FF]"
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
                            />
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
          )}

          {/* List View */}
          {viewMode === "list" && (
            <div className="divide-y divide-[#E1E4EA]">
              {DAYS.map((day) => {
                const daySchedule = schedule[day.index];
                return (
                  <div
                    key={day.index}
                    className={`px-5 py-4 transition-colors ${daySchedule.enabled ? "bg-white" : "bg-[#FAFAFA]"}`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Day Toggle */}
                      <div className="flex w-28 items-center gap-3 pt-1.5">
                        <Switch
                          checked={daySchedule.enabled}
                          onCheckedChange={() => toggleDay(day.index)}
                        />
                        <span
                          className={`text-sm font-medium ${daySchedule.enabled ? "text-black" : "text-[#99A0AE]"}`}
                        >
                          {day.short}
                        </span>
                      </div>

                      {/* Time Ranges */}
                      <div className="flex-1">
                        {daySchedule.enabled ? (
                          <div className="space-y-2">
                            {daySchedule.timeRanges.map((range, idx) => (
                              <div
                                key={range.id}
                                className="flex items-center gap-2"
                              >
                                <Select
                                  value={range.startTime}
                                  onValueChange={(v) =>
                                    updateTimeRange(
                                      day.index,
                                      range.id,
                                      "startTime",
                                      v,
                                    )
                                  }
                                >
                                  <SelectTrigger className="h-9 w-[120px] border-[#E1E4EA] text-sm">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {TIME_OPTIONS.map((t) => (
                                      <SelectItem key={t.value} value={t.value}>
                                        {getTimeLabelFull(t.value)}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>

                                <span className="text-[#99A0AE]">–</span>

                                <Select
                                  value={range.endTime}
                                  onValueChange={(v) =>
                                    updateTimeRange(
                                      day.index,
                                      range.id,
                                      "endTime",
                                      v,
                                    )
                                  }
                                >
                                  <SelectTrigger className="h-9 w-[120px] border-[#E1E4EA] text-sm">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {TIME_OPTIONS.filter(
                                      (t) => t.value > range.startTime,
                                    ).map((t) => (
                                      <SelectItem key={t.value} value={t.value}>
                                        {getTimeLabelFull(t.value)}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>

                                <button
                                  onClick={() =>
                                    removeTimeRange(day.index, range.id)
                                  }
                                  className="rounded p-1.5 text-[#99A0AE] hover:bg-red-50 hover:text-red-500"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>

                                {idx === 0 &&
                                  daySchedule.timeRanges.length === 1 && (
                                    <button
                                      onClick={() => copyToAll(day.index)}
                                      className="ml-2 flex items-center gap-1 rounded px-2 py-1 text-xs text-[#5C30FF] hover:bg-[#F5F3FF]"
                                    >
                                      <Copy className="h-3 w-3" />
                                      Copy to all
                                    </button>
                                  )}
                              </div>
                            ))}

                            <button
                              onClick={() => addTimeRange(day.index)}
                              className="flex items-center gap-1 rounded px-2 py-1 text-xs text-[#5C30FF] hover:bg-[#F5F3FF]"
                            >
                              <Plus className="h-3 w-3" />
                              Add time slot
                            </button>
                          </div>
                        ) : (
                          <p className="pt-1.5 text-sm text-[#99A0AE]">
                            Unavailable
                          </p>
                        )}
                      </div>

                      {/* Summary */}
                      {daySchedule.enabled &&
                        daySchedule.timeRanges.length > 0 && (
                          <div className="hidden pt-1.5 text-right text-xs text-[#525866] lg:block">
                            {daySchedule.timeRanges.map((r) => (
                              <div key={r.id}>
                                {getTimeLabelFull(r.startTime)} -{" "}
                                {getTimeLabelFull(r.endTime)}
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-[#E1E4EA] bg-[#FAFAFA] px-5 py-4">
            <div className="text-sm text-[#525866]">
              <span className="font-semibold text-[#5C30FF]">
                {selectedSlots.size}
              </span>{" "}
              slots selected ({getTotalHours()} per week)
            </div>
            <Button
              onClick={handleSave}
              disabled={isSaving || !hasChanges}
              className="rounded-lg bg-[#5C30FF] px-6 py-2 text-sm font-medium text-white hover:bg-[#4A26CC] disabled:opacity-50"
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
          {viewMode === "grid" && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded bg-emerald-500" />
                <span className="text-xs text-[#525866]">Saved</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded bg-[#5C30FF]" />
                <span className="text-xs text-[#525866]">New</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded border-2 border-dashed border-red-400 bg-red-100" />
                <span className="text-xs text-[#525866]">Will be removed</span>
              </div>
            </div>
          )}
          <p className="text-xs text-[#99A0AE]">
            {viewMode === "grid"
              ? "Click and drag to select time slots. Your availability repeats every week."
              : "Toggle days on/off and set specific time ranges. Your availability repeats every week."}
          </p>
        </div>
      </div>
    </div>
  );
}
