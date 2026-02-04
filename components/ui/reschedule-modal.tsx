"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock } from "lucide-react";

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: string, time: string) => void;
  currentDate?: string;
  isLoading?: boolean;
}

const TIME_OPTIONS = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
];

export function RescheduleModal({
  isOpen,
  onClose,
  onConfirm,
  currentDate,
  isLoading = false,
}: RescheduleModalProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      onConfirm(selectedDate, selectedTime);
      onClose();
      setSelectedDate("");
      setSelectedTime("");
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedDate("");
    setSelectedTime("");
  };

  // Generate next 14 days
  const dateOptions = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return {
      value: date.toISOString().split("T")[0],
      label: date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
    };
  });

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="sm">
      <div className="flex flex-col">
        {/* Icon */}
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F3FF]">
          <Calendar className="h-6 w-6 text-[#5C30FF]" />
        </div>

        {/* Title */}
        <h3 className="mb-2 font-inter-tight text-[16px] font-semibold text-black">
          Reschedule Session
        </h3>

        {/* Description */}
        <p className="mb-6 font-inter-tight text-[14px] text-[#525866]">
          Select a new date and time for this session
        </p>

        {/* Date Selection */}
        <div className="mb-4">
          <label className="mb-2 block font-inter-tight text-[13px] font-medium text-black">
            New Date
          </label>
          <Select value={selectedDate} onValueChange={setSelectedDate}>
            <SelectTrigger className="h-11 w-full border-[#E1E4EA]">
              <SelectValue placeholder="Select a date" />
            </SelectTrigger>
            <SelectContent>
              {dateOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Time Selection */}
        <div className="mb-6">
          <label className="mb-2 block font-inter-tight text-[13px] font-medium text-black">
            New Time
          </label>
          <Select value={selectedTime} onValueChange={setSelectedTime}>
            <SelectTrigger className="h-11 w-full border-[#E1E4EA]">
              <SelectValue placeholder="Select a time" />
            </SelectTrigger>
            <SelectContent>
              {TIME_OPTIONS.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 rounded-[30px] border-[#E1E4EA] px-4 py-2.5 font-inter-tight text-[13px] font-normal text-[#525866] hover:bg-[#F5F5F5]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading || !selectedDate || !selectedTime}
            className="flex-1 rounded-[30px] bg-[#5C30FF] px-4 py-2.5 font-inter-tight text-[13px] font-normal text-white hover:bg-[#4A26CC] disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Confirm"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
