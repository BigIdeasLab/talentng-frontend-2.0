"use client";

import { useState, useEffect, Fragment } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, addDays, startOfWeek } from "date-fns";

const TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function AvailabilityPage() {
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [sessionDuration, setSessionDuration] = useState("60");
  const [bufferTime, setBufferTime] = useState("15");
  const [timezone, setTimezone] = useState("WAT");
  const [weekDates, setWeekDates] = useState<Date[]>([]);

  useEffect(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const dates = Array.from({ length: 7 }, (_, i) => addDays(start, i));
    setWeekDates(dates);
  }, []);

  const toggleSlot = (day: number, time: number) => {
    const key = `${day}-${time}`;
    setSelectedSlots((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const clearAll = () => {
    setSelectedSlots(new Set());
  };

  const selectWeekdays = () => {
    const slots = new Set<string>();
    for (let day = 0; day < 5; day++) {
      for (let time = 0; time < TIME_SLOTS.length; time++) {
        slots.add(`${day}-${time}`);
      }
    }
    setSelectedSlots(slots);
  };

  const selectMornings = () => {
    const slots = new Set<string>();
    for (let day = 0; day < 7; day++) {
      for (let time = 0; time < 4; time++) {
        slots.add(`${day}-${time}`);
      }
    }
    setSelectedSlots(slots);
  };

  const handleSave = () => {
    console.log("Saving availability:", {
      slots: Array.from(selectedSlots),
      sessionDuration,
      bufferTime,
      timezone,
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <header className="border-b border-[#E1E4EA] bg-white px-6 py-5">
        <h1 className="font-inter-tight text-xl font-semibold text-black">
          Availability Schedule
        </h1>
        <p className="mt-1 font-inter-tight text-[13px] text-[#525866]">
          Set your available time slots for mentoring sessions
        </p>
      </header>

      {/* Main Content */}
      <div className="px-6 py-6">
        {/* Quick Actions */}
        <div className="mb-5 flex gap-3">
          <button
            onClick={clearAll}
            className="rounded-lg border border-[#E1E4EA] bg-white px-4 py-2 font-inter-tight text-[13px] font-medium text-[#525866] transition-colors hover:border-[#5C30FF] hover:bg-[#F5F3FF] hover:text-[#5C30FF]"
          >
            Clear All
          </button>
          <button
            onClick={selectWeekdays}
            className="rounded-lg border border-[#E1E4EA] bg-white px-4 py-2 font-inter-tight text-[13px] font-medium text-[#525866] transition-colors hover:border-[#5C30FF] hover:bg-[#F5F3FF] hover:text-[#5C30FF]"
          >
            Weekdays 9-5
          </button>
          <button
            onClick={selectMornings}
            className="rounded-lg border border-[#E1E4EA] bg-white px-4 py-2 font-inter-tight text-[13px] font-medium text-[#525866] transition-colors hover:border-[#5C30FF] hover:bg-[#F5F3FF] hover:text-[#5C30FF]"
          >
            Mornings Only
          </button>
        </div>

        {/* Content Card */}
        <div className="overflow-hidden rounded-xl border border-[#E1E4EA] bg-white">
          {/* Settings Section */}
          <div className="flex gap-6 border-b border-[#E1E4EA] px-6 py-5">
            <div className="flex flex-col gap-2">
              <label className="font-inter-tight text-[13px] font-semibold text-black">
                Session Duration
              </label>
              <Select
                value={sessionDuration}
                onValueChange={setSessionDuration}
              >
                <SelectTrigger className="h-10 w-[180px] border-[#E1E4EA]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                  <SelectItem value="120">120 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-inter-tight text-[13px] font-semibold text-black">
                Buffer Time
              </label>
              <Select value={bufferTime} onValueChange={setBufferTime}>
                <SelectTrigger className="h-10 w-[180px] border-[#E1E4EA]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No buffer</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-inter-tight text-[13px] font-semibold text-black">
                Time Zone
              </label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger className="h-10 w-[180px] border-[#E1E4EA]">
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
          </div>

          {/* Calendar Grid */}
          <div className="p-6">
            <div
              className="grid overflow-hidden rounded-lg border border-[#E1E4EA]"
              style={{ gridTemplateColumns: "80px repeat(7, 1fr)" }}
            >
              {/* Header Row */}
              <div className="border-b-2 border-[#E1E4EA] bg-[#F9F9F9] p-3" />
              {DAYS.map((day, index) => (
                <div
                  key={day}
                  className="border-b-2 border-l border-[#E1E4EA] bg-[#F9F9F9] p-3 text-center"
                >
                  <div className="font-inter-tight text-[13px] font-semibold text-black">
                    {day}
                  </div>
                  {weekDates[index] && (
                    <div className="font-inter-tight text-[11px] text-[#99A0AE]">
                      {format(weekDates[index], "MMM d")}
                    </div>
                  )}
                </div>
              ))}

              {/* Time Rows */}
              {TIME_SLOTS.map((time, timeIndex) => (
                <Fragment key={`row-${timeIndex}`}>
                  {/* Time Label */}
                  <div className="flex items-center justify-end border-t border-[#E1E4EA] bg-[#F9F9F9] px-3 py-3 font-inter-tight text-[12px] font-medium text-[#525866]">
                    {time}
                  </div>

                  {/* Day Slots */}
                  {DAYS.map((_, dayIndex) => {
                    const key = `${dayIndex}-${timeIndex}`;
                    const isSelected = selectedSlots.has(key);

                    return (
                      <div
                        key={`slot-${dayIndex}-${timeIndex}`}
                        onClick={() => toggleSlot(dayIndex, timeIndex)}
                        className={`flex min-h-[48px] cursor-pointer items-center justify-center border-l border-t border-[#E1E4EA] transition-colors ${
                          isSelected
                            ? "bg-[#5C30FF] hover:bg-[#4A26CC]"
                            : "bg-white hover:bg-[#F5F3FF]"
                        }`}
                      >
                        {isSelected && (
                          <div className="h-[calc(100%-8px)] w-[calc(100%-8px)] rounded bg-white/10" />
                        )}
                      </div>
                    );
                  })}
                </Fragment>
              ))}
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between border-t border-[#E1E4EA] px-6 py-4">
            <div className="font-inter-tight text-[14px] text-[#525866]">
              <span className="font-semibold text-[#5C30FF]">
                {selectedSlots.size}
              </span>{" "}
              time slots selected
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={clearAll}
                className="rounded-[30px] border-[#E1E4EA] px-5 py-2.5 font-inter-tight text-[13px] font-normal text-[#525866] hover:bg-[#F5F5F5]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="rounded-[30px] bg-[#5C30FF] px-5 py-2.5 font-inter-tight text-[13px] font-normal text-white hover:bg-[#4A26CC]"
              >
                Save Availability
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
