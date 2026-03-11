"use client";

import { useState, useEffect } from "react";
import { format, addDays } from "date-fns";
import { Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { getMentorBookingSlots } from "@/lib/api/mentorship";
import { useAvailabilityPrefetch } from "@/hooks/useAvailabilityPrefetch";

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
  accentColor?: string;
}

export function RescheduleModal({
  isOpen,
  onClose,
  onConfirm,
  mentorId,
  isLoading = false,
  accentColor = "#5C30FF",
}: RescheduleModalProps) {
  const [availability, setAvailability] = useState<AvailabilityDay[]>([]);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  const { getCachedAvailability, prefetchAvailability } = useAvailabilityPrefetch();

  useEffect(() => {
    if (!isOpen || !mentorId) return;

    // First, try to get cached data
    const cached = getCachedAvailability(mentorId);
    
    if (cached && !cached.isExpired && cached.data.length > 0) {
      // Use cached data immediately
      setAvailability(cached.data);
      setIsFetching(false);
      setFetchError(null);
      return;
    }

    // If no cache or expired, fetch fresh data
    async function fetchSlots() {
      setIsFetching(true);
      setFetchError(null);
      
      try {
        const data = await prefetchAvailability(mentorId);
        setAvailability(data || []);
      } catch (error) {
        console.error("Error fetching slots:", error);
        setFetchError("Failed to load available slots. Please try again.");
        setAvailability([]);
      } finally {
        setIsFetching(false);
      }
    }

    fetchSlots();
  }, [isOpen, mentorId, getCachedAvailability, prefetchAvailability]);

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

  const retryFetch = () => {
    setFetchError(null);
    setIsFetching(true);
    prefetchAvailability(mentorId)
      .then((data) => {
        setAvailability(data || []);
      })
      .catch((error) => {
        console.error("Error retrying fetch:", error);
        setFetchError("Failed to load available slots. Please try again.");
        setAvailability([]);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="sm">
      <div className="flex flex-col">
        <div
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: `${accentColor}1A` }}
        >
          <Calendar className="h-6 w-6" style={{ color: accentColor }} />
        </div>

        <h3 className="mb-2 font-inter-tight text-[16px] font-semibold text-black">
          Reschedule Session
        </h3>

        <p className="mb-6 font-inter-tight text-[14px] text-[#525866]">
          Select a new date and time from available slots
        </p>

        {isFetching ? (
          <div className="flex flex-col gap-4">
            {/* Date skeleton */}
            <div className="flex flex-col gap-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="grid grid-cols-4 gap-2">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="h-[52px] bg-gray-100 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            </div>
            {/* Time skeleton */}
            <div className="flex flex-col gap-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="flex flex-wrap gap-2">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-9 w-20 bg-gray-100 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>
        ) : fetchError ? (
          <div className="py-10 text-center">
            <p className="font-inter-tight text-[13px] text-red-500 mb-3">
              {fetchError}
            </p>
            <Button
              onClick={retryFetch}
              variant="outline"
              className="rounded-[30px] border-[#E1E4EA] px-4 py-2 font-inter-tight text-[13px]"
            >
              Try Again
            </Button>
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
                        ? "text-white"
                        : "bg-white border-[#E1E4EA] hover:opacity-80"
                    }`}
                    style={
                      selectedDate === index
                        ? {
                            backgroundColor: accentColor,
                            borderColor: accentColor,
                          }
                        : undefined
                    }
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
                          ? "text-white"
                          : "bg-white border-[#E1E4EA] text-black hover:opacity-80"
                      }`}
                      style={
                        selectedTime === index
                          ? {
                              backgroundColor: accentColor,
                              borderColor: accentColor,
                            }
                          : undefined
                      }
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
            className="flex-1 rounded-[30px] px-4 py-2.5 font-inter-tight text-[13px] font-normal text-white hover:opacity-80 disabled:opacity-50"
            style={{ backgroundColor: accentColor }}
          >
            {isLoading ? "Saving..." : "Confirm"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}