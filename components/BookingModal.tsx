
import React, { useEffect, useState } from "react";
import { Mentor } from "@/lib/types/mentor";
import { getMentorAvailability, bookSession } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  mentor: Mentor;
}

type Availability = {
  date: string; // YYYY-MM-DD
  slots: { startTime: string; endTime: string }[];
};

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function BookingModal({
  open,
  onClose,
  mentor,
}: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [topic, setTopic] = useState("");
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [availableDays, setAvailableDays] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());

  useEffect(() => {
    if (open) {
      const fetchAvailability = async () => {
        try {
          setLoading(true);
          setError(null);
          const availableSlots = await getMentorAvailability(mentor.id);
          if (availableSlots.length === 0) {
            setError("This mentor has no available slots.");
            setAvailability([]);
            setAvailableDays(new Set());
            return;
          }

          const uniqueDates = new Set<string>();
          const groupedByDate = availableSlots.reduce(
            (acc, slot) => {
              const slotDate = new Date(slot.startTime);
              const dateStr = slotDate.toISOString().split("T")[0]; // YYYY-MM-DD
              uniqueDates.add(dateStr);

              if (!acc[dateStr]) {
                acc[dateStr] = [];
              }
              acc[dateStr].push(slot);
              return acc;
            },
            {} as Record<string, { startTime: string; endTime: string }[]>
          );
          
          if (uniqueDates.size > 0) {
            const firstAvailableDate = new Date(uniqueDates.values().next().value + 'T00:00:00');
            setCalendarDate(firstAvailableDate);
          }

          const availabilityData = Object.entries(groupedByDate).map(
            ([date, slots]) => ({ date, slots })
          );
          
          setAvailability(availabilityData);
          setAvailableDays(uniqueDates);

        } catch (err) {
          setError("Failed to fetch availability. Please try again later.");
        } finally {
          setLoading(false);
        }
      };
      fetchAvailability();
    }
  }, [open, mentor.id]);

  useEffect(() => {
    if (!open) {
      setStep(1);
      setSelectedDate(undefined);
      setSelectedTime(null);
      setNotes("");
      setTopic("");
      setAvailability([]);
      setAvailableDays(new Set());
      setBookingConfirmed(false);
      setCalendarDate(new Date());
    }
  }, [open]);

  const handleBooking = async () => {
    if (!selectedTime) return;
    try {
      setLoading(true);
      setError(null);
      await bookSession(mentor.id, selectedTime, topic, notes);
      setBookingConfirmed(true);
      setStep(4);
    } catch (err: any) {
      setError(err.message || "Failed to book session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderCalendar = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const blanks = Array(firstDayOfMonth).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
      <div className="bg-white border rounded-xl p-3">
        <div className="flex justify-between items-center mb-4">
            <button onClick={() => setCalendarDate(new Date(year, month - 1, 1))} className="px-2 py-1">&lt;</button>
            <div className="text-2xl font-bold">{monthNames[month]} {year}</div>
            <button onClick={() => setCalendarDate(new Date(year, month + 1, 1))} className="px-2 py-1">&gt;</button>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div key={`${d}-${i}`} className="font-semibold text-sm text-gray-400">{d}</div>)}
          {blanks.map((_, i) => <div key={`blank-${i}`} />)}
          {days.map(day => {
            const dayDate = new Date(year, month, day);
            const dayStr = dayDate.toISOString().split('T')[0];
            const isAvailable = availableDays.has(dayStr);
            const isSelected = selectedDate?.toISOString().split('T')[0] === dayStr;

            return (
              <button
                key={day}
                disabled={!isAvailable}
                onClick={() => setSelectedDate(dayDate)}
                className={`py-2 px-1 text-sm rounded-md disabled:text-gray-300 disabled:cursor-not-allowed ${
                  isSelected ? "bg-black text-white" : isAvailable ? "bg-transparent text-black" : ""
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (!open) return null;

  const selectedDateStr = selectedDate?.toISOString().split("T")[0];
  const timeSlotsForSelectedDate = availability.find(a => a.date === selectedDateStr)?.slots;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-[90%] max-w-lg mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <div className="text-lg font-semibold">Mentorship Session</div>
            <div className="text-sm text-gray-600">{mentor.fullName} • {mentor.headline}</div>
          </div>
          <button onClick={onClose} aria-label="Close" className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center">✕</button>
        </div>
        <div className="p-4">
          {step < 4 && <div className="text-sm text-gray-500 mb-4">STEP {step} of 3</div>}
          {loading && <div className="min-h-[300px] flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-gray-500" /></div>}
          {error && <div className="min-h-[300px] flex items-center justify-center text-red-500"><p>{error}</p></div>}
          {!loading && !error && (
            <>
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Select date and time</h3>
                  <p className="text-sm text-gray-600">In your local timezone (auto-detected)</p>
                  {renderCalendar()}
                  <div className="mt-4 flex justify-center">
                    <button onClick={() => setStep(2)} disabled={!selectedDate} className={`px-8 py-3 rounded-full ${selectedDate ? "bg-black text-white" : "bg-gray-200 text-gray-400"}`}>Continue</button>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Select time</h3>
                  <p className="text-sm text-gray-600">
                    Date: {selectedDate?.toLocaleDateString() ?? "—"}.{" "}
                    <button className="text-orange-500 underline" onClick={() => setStep(1)}>Change</button>
                  </p>
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {timeSlotsForSelectedDate?.map((slot) => (
                      <button
                        key={slot.startTime}
                        onClick={() => setSelectedTime(slot.startTime)}
                        className={`px-4 py-3 rounded-full border ${selectedTime === slot.startTime ? "bg-black text-white" : "bg-white text-black"}`}
                      >
                        {new Date(slot.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <button onClick={() => setStep(1)} className="px-8 py-3 rounded-full border hover:bg-gray-100">Back</button>
                    <button onClick={() => setStep(3)} disabled={!selectedTime} className={`px-8 py-3 rounded-full ${selectedTime ? "bg-black text-white" : "bg-gray-200 text-gray-400"}`}>Continue</button>
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Confirm Booking</h3>
                  <p className="text-sm text-gray-600">
                    Date: {selectedDate?.toLocaleDateString() ?? "—"} at {selectedTime ? new Date(selectedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : "—"}{" "}
                    <button className="text-orange-500 underline" onClick={() => setStep(1)}>Change</button>
                  </p>
                  <div className="mt-4 space-y-3">
                    <div className="border rounded-2xl p-4">
                      <select value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full bg-transparent outline-none">
                        <option value="" disabled>Select a topic</option>
                        {mentor.expertise.map((item) => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>
                    <div className="border rounded-2xl p-4">
                      <textarea
                        rows={5}
                        className="w-full bg-transparent outline-none text-sm"
                        placeholder="Add your question to this booking."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <button onClick={() => setStep(2)} className="px-8 py-3 rounded-full border hover:bg-gray-100">Back</button>
                    <button onClick={handleBooking} className="px-8 py-3 rounded-full bg-black text-white">Confirm Booking</button>
                  </div>
                </div>
              )}
              {step === 4 && bookingConfirmed && (
                <div className="text-center space-y-4 min-h-[300px] flex flex-col items-center justify-center">
                  <h3 className="text-2xl font-bold text-green-600">Booking Confirmed!</h3>
                  <p>Your session with {mentor.fullName} is confirmed.</p>
                  <p>
                    Date: {selectedDate?.toLocaleDateString() ?? "—"} at{" "}
                    {selectedTime ? new Date(selectedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : "—"}
                  </p>
                  <button onClick={onClose} className="px-8 py-3 rounded-full bg-black text-white">Close</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
