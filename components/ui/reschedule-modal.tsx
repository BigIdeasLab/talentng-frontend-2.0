"use client";

import { useState, useEffect } from "react";
import { format, addDays } from "date-fns";
import { Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { getMentorBookingSlots } from "@/lib/api/mentorship";

interface AvailabilityDay {
  date: string;
  day: string;
  fullDate: string;
  slots: { startTime: string; endTime: string }[];
}

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: string, startTime: string, endTime: string) => void;
  mentorId: string;
  isLoading?: boolean;
}

export function RescheduleModal({
  isOpen,
  onClose,
  onConfirm,
  mentorId,
  isLoading = false,
}: RescheduleModalProps) {
  const [availability, setAvailability] = useState<AvailabilityDay[]>([]);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (!isOpen || !mentorId) return;

    async function fetchSlots() {
      setIsFetching(true);
      try {
        const startDate = format(new Date(), "yyyy-MM-dd");
        const endDate = format(addDays(new Date(), 14), "yyyy-MM-dd");
        const data = await getMentorBookingSlots(mentorId, {
          startDate,
          endDate,
        });

        const raw = data as unknown as Record<string, unknown>;
        const flatSlots = (
          (raw?.slots ?? raw?.availableSlots ?? []) as {
            date: string;
            startTime: string;
            endTime: string;
          }[]
        ).filter((s) => s.date);

        const now = new Date();
        const todayStr = format(now, "yyyy-MM-dd");

        const futureSlots = flatSlots.filter((s) => {
          if (s.date < todayStr) return false;
          if (s.date === todayStr) {
            const slotTime = new Date(`${s.date}T${s.startTime}`);
            return slotTime > now;
          }
          return true;
        });

        const grouped = new Map<
          string,
          { startTime: string; endTime: string }[]
        >();
        for (const slot of futureSlots) {
          const existing = grouped.get(slot.date) || [];
          existing.push({ startTime: slot.startTime, endTime: slot.endTime });
          grouped.set(slot.date, existing);
        }

        const transformed: AvailabilityDay[] = Array.from(
          grouped.entries(),
        ).map(([dateStr, slots]) => ({
          date: format(new Date(dateStr + "T00:00:00"), "MMM dd"),
          day: format(new Date(dateStr + "T00:00:00"), "EEE"),
          fullDate: dateStr,
          slots,
        }));
        setAvailability(transformed);
      } catch {
        setAvailability([]);
      } finally {
        setIsFetching(false);
      }
    }

    fetchSlots();
  }, [isOpen, mentorId]);

  const handleClose = () => {
    onClose();
    setSelectedDate(null);
    setSelectedTime(null);
    setAvailability([]);
  };

  const timeSlots =
    selectedDate !== null && availability[selectedDate]
      ? availability[selectedDate].slots.map((s) => s.startTime)
      : [];

  const handleConfirm = () => {
    if (
      selectedDate !== null &&
      selectedTime !== null &&
      availability[selectedDate]
    ) {
      const fullDate = availability[selectedDate].fullDate;
      const slot = availability[selectedDate].slots[selectedTime];
      onConfirm(fullDate, slot.startTime, slot.endTime);
      handleClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="sm">
      <div className="flex flex-col">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F3FF]">
          <Calendar className="h-6 w-6 text-[#5C30FF]" />
        </div>

        <h3 className="mb-2 font-inter-tight text-[16px] font-semibold text-black">
          Reschedule Session
        </h3>

        <p className="mb-6 font-inter-tight text-[14px] text-[#525866]">
          Select a new date and time from available slots
        </p>

        {isFetching ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-[#5C30FF]" />
            <p className="mt-2 font-inter-tight text-[13px] text-[#525866]">
              Loading available slots...
            </p>
          </div>
        ) : availability.length === 0 ? (
          <p className="py-10 text-center font-inter-tight text-[13px] text-[#A3A3A3]">
            No available slots at this time
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-inter-tight text-[13px] font-medium text-black">
                Select a date
              </label>
              <div className="grid grid-cols-4 gap-2">
                {availability.slice(0, 8).map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedDate(index);
                      setSelectedTime(null);
                    }}
                    className={`flex flex-col items-center justify-center gap-1 h-[52px] rounded-lg border transition-colors ${
                      selectedDate === index
                        ? "bg-[#5C30FF] border-[#5C30FF]"
                        : "bg-white border-[#E1E4EA] hover:border-[#5C30FF]"
                    }`}
                  >
                    <span
                      className={`font-inter-tight text-[10px] font-normal ${
                        selectedDate === index
                          ? "text-white/70"
                          : "text-[#A3A3A3]"
                      }`}
                    >
                      {slot.day}
                    </span>
                    <span
                      className={`font-inter-tight text-[13px] font-medium ${
                        selectedDate === index ? "text-white" : "text-black"
                      }`}
                    >
                      {slot.date.split(" ")[1]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {timeSlots.length > 0 && (
              <div className="flex flex-col gap-2">
                <label className="font-inter-tight text-[13px] font-medium text-black">
                  Select a time
                </label>
                <div className="flex flex-wrap gap-2">
                  {timeSlots.map((time, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedTime(index)}
                      className={`px-4 py-2 rounded-lg border font-inter-tight text-[13px] font-normal transition-colors ${
                        selectedTime === index
                          ? "bg-[#5C30FF] border-[#5C30FF] text-white"
                          : "bg-white border-[#E1E4EA] text-black hover:border-[#5C30FF]"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex gap-3">
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
            disabled={
              isLoading || selectedDate === null || selectedTime === null
            }
            className="flex-1 rounded-[30px] bg-[#5C30FF] px-4 py-2.5 font-inter-tight text-[13px] font-normal text-white hover:bg-[#4A26CC] disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Confirm"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
