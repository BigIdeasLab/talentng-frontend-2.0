"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format, addDays } from "date-fns";
import {
  getMentorProfile,
  getMentorReviews,
  getMentorBookingSlots,
  createRequest,
  getMyRequestsForMentor,
} from "@/lib/api/mentorship";
import type { BookedSlot } from "@/lib/api/mentorship/types";
import type {
  PublicMentorDetail,
  SessionReview,
} from "@/lib/api/mentorship/types";
import { useRequireRole } from "@/hooks/useRequireRole";
import { PageLoadingState } from "@/lib/page-utils";

interface AvailabilitySlot {
  date: string;
  day: string;
  fullDate: string;
  slots: { startTime: string; endTime: string }[];
}

type TabType = "Overview" | "Reviews" | "Session";

export default function MentorDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const mentorId = params.id as string;
  const [activeTab, setActiveTab] = useState<TabType>("Overview");
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState<"availability" | "details">(
    "availability",
  );
  const [hasSelectedSlot, setHasSelectedSlot] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [mentor, setMentor] = useState<PublicMentorDetail | null>(null);
  const [reviews, setReviews] = useState<SessionReview[]>([]);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasAccess = useRequireRole(["talent", "mentor"]);

  useEffect(() => {
    if (!hasAccess) return;
    async function fetchMentorData() {
      setIsLoading(true);
      setError(null);

      try {
        const startDate = format(new Date(), "yyyy-MM-dd");
        const endDate = format(addDays(new Date(), 14), "yyyy-MM-dd");

        const [profileData, reviewsData, availabilityData, myRequestsData] =
          await Promise.all([
            getMentorProfile(mentorId),
            getMentorReviews(mentorId, { limit: 10 }),
            getMentorBookingSlots(mentorId, { startDate, endDate }),
            getMyRequestsForMentor(mentorId).catch(() => ({
              mentorId,
              bookedSlots: [],
            })),
          ]);

        // Map API fields to our type
        const raw = profileData as unknown as Record<string, unknown>;
        const mappedMentor: PublicMentorDetail = {
          ...profileData,
          name: (raw.fullName as string) || (raw.name as string) || "",
          avatar:
            (raw.profileImageUrl as string) || (raw.avatar as string) || null,
          title: (raw.headline as string) || (raw.title as string) || null,
          bio: (raw.bio as string) || (raw.description as string) || null,
          location: (raw.location as string) || null,
          languages: (raw.languages as string[]) || [],
          rating: (raw.avgRating as number) || 0,
          totalReviews: (raw.totalReviews as number) || 0,
          totalSessions: (raw.totalSessions as number) || 0,
          expertise: (raw.expertise as string[]) || [],
          industries: (raw.industries as string[]) || [],
          stack: (raw.stack as string[]) || [],
          links: (raw.links as Record<string, string>) || null,
          company: (raw.company as string) || null,
          category: (raw.category as string) || null,
          sessionDuration: (raw.sessionDuration as number) || 60,
          bufferTime: (raw.bufferTime as number) || 15,
          timezone: (raw.timezone as string) || "WAT",
          defaultMeetingLink: (raw.defaultMeetingLink as string) || null,
          id: (raw.id as string) || "",
          userId: (raw.userId as string) || "",
        };
        setMentor(mappedMentor);

        const reviewsArray = Array.isArray(reviewsData)
          ? reviewsData
          : (reviewsData?.data ?? []);
        setReviews(reviewsArray);

        const rawAvail = availabilityData as unknown as Record<string, unknown>;
        const flatSlots = (
          (rawAvail?.slots ?? rawAvail?.availableSlots ?? []) as {
            date: string;
            startTime: string;
            endTime: string;
          }[]
        ).filter((s) => s.date);

        const grouped = new Map<
          string,
          { startTime: string; endTime: string }[]
        >();
        for (const slot of flatSlots) {
          const existing = grouped.get(slot.date) || [];
          existing.push({ startTime: slot.startTime, endTime: slot.endTime });
          grouped.set(slot.date, existing);
        }

        const transformedAvailability: AvailabilitySlot[] = Array.from(
          grouped.entries(),
        ).map(([dateStr, slots]) => ({
          date: format(new Date(dateStr + "T00:00:00"), "MMM dd"),
          day: format(new Date(dateStr + "T00:00:00"), "EEE"),
          fullDate: dateStr,
          slots,
        }));
        setAvailability(transformedAvailability);
        setBookedSlots(myRequestsData.bookedSlots || []);
      } catch (err) {
        if (err instanceof Error && err.message.includes("404")) {
          setError("not_found");
        } else {
          setError("failed");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchMentorData();
  }, [mentorId, hasAccess]);

  useEffect(() => {
    if (searchParams.get("book") === "true" && !isLoading && mentor) {
      setBookingStep("availability");
      setIsBookingModalOpen(true);
    }
  }, [searchParams, isLoading, mentor]);

  if (!hasAccess) {
    return <PageLoadingState message="Checking access..." />;
  }

  if (isLoading) {
    return (
      <div className="h-screen bg-white flex flex-col overflow-hidden">
        <div className="flex-shrink-0 px-5 py-3 border-b border-[#E1E4EA]">
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex-1 flex overflow-hidden">
          <div className="w-[350px] flex-shrink-0 border-r border-[#E1E4EA] bg-white p-5">
            <div className="flex flex-col items-center gap-3">
              <div className="w-[113px] h-[113px] rounded-full bg-gray-200 animate-pulse" />
              <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="mt-6 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-4 w-full bg-gray-200 rounded animate-pulse"
                />
              ))}
            </div>
          </div>
          <div className="flex-1 p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-4 w-full bg-gray-200 rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error === "not_found" || !mentor) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-gray-500 mb-3 text-[13px]">Mentor not found</p>
          <Link
            href="/mentorship"
            className="px-3 py-1.5 bg-[#181B25] text-white rounded-md hover:bg-[#252831] text-[11px]"
          >
            Back to Mentorship
          </Link>
        </div>
      </div>
    );
  }

  if (error === "failed") {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-gray-500 mb-3 text-[13px]">
            Failed to load mentor details
          </p>
          <Link
            href="/mentorship"
            className="px-3 py-1.5 bg-[#181B25] text-white rounded-md hover:bg-[#252831] text-[11px]"
          >
            Back to Mentorship
          </Link>
        </div>
      </div>
    );
  }

  const isSlotBooked = (fullDate: string, time: string): boolean => {
    const datePart = fullDate.split("T")[0];
    return bookedSlots.some((slot) => {
      const slotDate = slot.scheduledDate.split("T")[0];
      return slotDate === datePart && slot.scheduledTime === time;
    });
  };

  const timeSlots = (() => {
    if (selectedDate === null) return [];
    const slots = availability[selectedDate]?.slots || [];
    const duration = mentor?.sessionDuration || 60;
    const times: string[] = [];
    for (const slot of slots) {
      const [startH, startM] = slot.startTime.split(":").map(Number);
      const [endH, endM] = slot.endTime.split(":").map(Number);
      let current = startH * 60 + startM;
      const end = endH * 60 + endM;
      while (current + duration <= end) {
        const h = Math.floor(current / 60);
        const m = current % 60;
        times.push(
          `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
        );
        current += duration;
      }
    }
    return times;
  })();

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Back Button */}
      <div className="flex-shrink-0 px-5 py-3 border-b border-[#E1E4EA]">
        <Link
          href="/mentorship"
          className="flex items-center gap-1.5 text-[#A3A3A3] hover:text-black transition-colors w-fit"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.783 11.7826C9.71332 11.8525 9.63053 11.9079 9.53937 11.9458C9.4482 11.9837 9.35046 12.0031 9.25175 12.0031C9.15304 12.0031 9.0553 11.9837 8.96414 11.9458C8.87297 11.9079 8.79018 11.8525 8.7205 11.7826L5.7205 8.78255C5.65058 8.71287 5.5951 8.63008 5.55725 8.53891C5.5194 8.44775 5.49991 8.35001 5.49991 8.2513C5.49991 8.15259 5.5194 8.05485 5.55725 7.96369C5.5951 7.87252 5.65058 7.78973 5.7205 7.72005L8.7205 4.72005C8.8614 4.57915 9.0525 4.5 9.25175 4.5C9.45101 4.5 9.64211 4.57915 9.783 4.72005C9.9239 4.86095 10.0031 5.05204 10.0031 5.2513C10.0031 5.45056 9.9239 5.64165 9.783 5.78255L7.31488 8.25193L9.78488 10.7213C9.85449 10.7911 9.90966 10.8739 9.94724 10.965C9.98482 11.0561 10.0041 11.1538 10.0039 11.2523C10.0037 11.3509 9.98413 11.4484 9.94623 11.5394C9.90832 11.6304 9.85286 11.713 9.783 11.7826Z"
              fill="currentColor"
            />
          </svg>
          <span className="font-inter-tight text-[11px] font-normal">
            Back to Mentorship
          </span>
        </Link>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-[350px] flex-shrink-0 border-r border-[#E1E4EA] bg-white flex flex-col">
          <div className="flex-1 overflow-y-auto scrollbar-hidden px-4 py-7">
            <div className="flex flex-col gap-5">
              {/* Profile Section */}
              <div className="flex flex-col items-center gap-5">
                {/* Profile Picture */}
                <div className="relative w-[90px] h-[90px] flex-shrink-0">
                  <div
                    className="w-full h-full rounded-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${mentor.avatar || "/default.png"})`,
                    }}
                  />
                </div>

                {/* Info Container */}
                <div className="flex flex-col items-center gap-3 w-[200px]">
                  <h2 className="text-[16px] font-medium text-black font-inter-tight text-center">
                    {mentor.name}
                  </h2>
                  <p className="text-[14px] font-light text-[rgba(0,0,0,0.30)] font-inter-tight text-center">
                    {mentor.title}
                  </p>
                </div>

                {/* Details Container */}
                <div className="flex flex-col items-start gap-3 w-full">
                  {/* Average Rating */}
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-1.5">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11 1.83L13.09 8.26H19.92L14.42 12.24L16.51 18.67L11 14.69L5.49 18.67L7.58 12.24L2.08 8.26H8.91L11 1.83Z"
                          fill="#FFD700"
                          stroke="#FFD700"
                          strokeWidth="1"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-[13px] font-normal text-black font-inter-tight">
                        {mentor.rating > 0 ? mentor.rating.toFixed(1) : "N/A"}{" "}
                        Rating
                      </span>
                    </div>
                  </div>

                  {/* Sessions completed */}
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-1.5">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.29166 12.6807L5.49999 16.0418L6.43867 15.0584M15.125 5.9585L9.56724 11.7809"
                          stroke="#525866"
                          strokeWidth="1.375"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M6.875 12.6807L10.0833 16.0418L19.7083 5.9585"
                          stroke="#525866"
                          strokeWidth="1.375"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-[13px] font-normal text-black font-inter-tight">
                        {mentor.totalSessions} Session Completed
                      </span>
                    </div>
                  </div>

                  {/* Session Duration */}
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-1.5">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11 7.33301V10.9997L13.2917 13.2913"
                          stroke="#525866"
                          strokeWidth="1.375"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M20.1667 11.0002C20.1667 16.0627 16.0626 20.1668 11 20.1668C5.9374 20.1668 1.83334 16.0627 1.83334 11.0002C1.83334 5.93755 5.9374 1.8335 11 1.8335C16.0626 1.8335 20.1667 5.93755 20.1667 11.0002Z"
                          stroke="#525866"
                          strokeWidth="1.375"
                        />
                      </svg>
                      <span className="text-[13px] font-normal text-black font-inter-tight">
                        {mentor.sessionDuration} min / session
                      </span>
                    </div>
                  </div>

                  {/* Mentoring time */}
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-1.5">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.67767 2.75C7.48159 2.82327 7.28875 2.90319 7.09942 2.98949M18.9911 14.9427C19.0848 14.7399 19.1712 14.533 19.2499 14.3225M16.9571 17.751C17.1145 17.604 17.2667 17.4516 17.4132 17.2938M13.9964 19.5913C14.1743 19.5242 14.3495 19.4517 14.5218 19.3738M11.1429 20.1611C10.9313 20.1684 10.7181 20.1684 10.5064 20.1611M7.13828 19.3787C7.30401 19.4532 7.47242 19.523 7.6433 19.5876M4.28308 17.3441C4.40838 17.4769 4.53767 17.6059 4.67078 17.7309M2.41322 14.3591C2.48186 14.5404 2.55619 14.7188 2.63599 14.8943M1.8378 11.4632C1.83185 11.2724 1.83187 11.0805 1.8378 10.8895M2.40657 8.00904C2.474 7.82985 2.547 7.65337 2.62533 7.47982M4.26793 5.02263C4.40053 4.88138 4.53764 4.74442 4.67903 4.61197"
                          stroke="#525866"
                          strokeWidth="1.375"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12.375 11C12.375 11.7594 11.7594 12.375 11 12.375C10.2406 12.375 9.625 11.7594 9.625 11C9.625 10.2406 10.2406 9.625 11 9.625M12.375 11C12.375 10.2406 11.7594 9.625 11 9.625M12.375 11H14.6667M11 9.625V5.5"
                          stroke="#525866"
                          strokeWidth="1.375"
                          strokeLinecap="round"
                        />
                        <path
                          d="M20.1667 11.0002C20.1667 5.93755 16.0626 1.8335 11 1.8335"
                          stroke="#525866"
                          strokeWidth="1.375"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="text-[13px] font-normal text-black font-inter-tight">
                        {Math.round(
                          (mentor.totalSessions * mentor.sessionDuration) / 60,
                        )}
                        h mentoring time
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Book Session Button */}
              <button
                onClick={() => {
                  setBookingStep(hasSelectedSlot ? "details" : "availability");
                  setIsBookingModalOpen(true);
                }}
                className="w-full h-auto rounded-[40px] bg-[#181B25] hover:bg-[#2a2f3a] text-white px-16 py-4 font-normal text-[15px] font-inter-tight transition-colors"
              >
                Book Session
              </button>

              {/* Availability Section */}
              {availability.length > 0 ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-inter-tight text-[13px] font-medium text-black">
                      Availability
                    </h3>
                    <button className="font-inter-tight text-[12px] font-normal text-[#5C30FF] hover:underline">
                      View All
                    </button>
                  </div>

                  {/* Calendar Grid */}
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

                  {/* Time Slots for Selected Date */}
                  {selectedDate !== null && timeSlots.length > 0 && (
                    <div className="flex flex-col gap-2 mt-1">
                      <span className="font-inter-tight text-[11px] font-normal text-[#A3A3A3]">
                        Available times for {availability[selectedDate]?.date}
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        {timeSlots.map((time, index) => {
                          const booked = isSlotBooked(
                            availability[selectedDate!]?.fullDate,
                            time,
                          );
                          return (
                            <button
                              key={index}
                              disabled={booked}
                              onClick={() => {
                                if (!booked) {
                                  setSelectedTime(index);
                                  setHasSelectedSlot(true);
                                }
                              }}
                              className={`flex items-center justify-center px-4 py-2 rounded-lg border font-inter-tight text-[13px] font-normal transition-colors ${
                                booked
                                  ? "bg-[#F5F5F5] border-[#E1E4EA] text-[#A3A3A3] cursor-not-allowed line-through"
                                  : selectedTime === index
                                    ? "bg-[#5C30FF] border-[#5C30FF] text-white"
                                    : "bg-white border-[#E1E4EA] text-black hover:border-[#5C30FF]"
                              }`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <h3 className="font-inter-tight text-[13px] font-medium text-black">
                    Availability
                  </h3>
                  <p className="font-inter-tight text-[13px] text-[#A3A3A3]">
                    No available slots at this time
                  </p>
                </div>
              )}

              {/* Stack Section */}
              {mentor.stack && mentor.stack.length > 0 && (
                <div className="flex flex-col items-start gap-[12px]">
                  <h3 className="text-[12px] font-normal text-[rgba(0,0,0,0.30)] font-inter-tight">
                    Stack
                  </h3>
                  <div className="flex flex-wrap gap-[6px] w-full">
                    {mentor.stack.slice(0, 5).map((tool, idx) => (
                      <div
                        key={idx}
                        className="px-[10px] py-[7px] rounded-full bg-[#F5F5F5] flex items-center gap-[5px]"
                      >
                        <div className="w-[16px] h-[16px] rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex-shrink-0" />
                        <span className="text-[11px] font-normal text-black font-inter-tight">
                          {tool}
                        </span>
                      </div>
                    ))}
                    {mentor.stack.length > 5 && (
                      <div className="px-[10px] py-[7px] rounded-full bg-[#F5F5F5]">
                        <span className="text-[11px] font-normal text-black font-inter-tight">
                          +{mentor.stack.length - 5}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Social Links */}
              {mentor.links && Object.values(mentor.links).some(Boolean) && (
                <div className="flex flex-col items-start gap-4 w-full">
                  <h3 className="text-[11px] font-normal text-[rgba(0,0,0,0.30)] font-inter-tight">
                    Social Links
                  </h3>
                  <div className="flex flex-col gap-2 w-full">
                    {[
                      {
                        key: "telegram",
                        label: "Telegram",
                        icon: "M10.9866 14.1243L13.9579 17.5025C15.0587 18.754 15.6092 19.3798 16.1853 19.2274C16.7614 19.0751 16.9591 18.2516 17.3542 16.6043L19.546 7.46707C20.1546 4.93012 20.4588 3.66166 19.7824 3.036C19.1061 2.41035 17.9337 2.87581 15.5889 3.80675L4.71054 8.12578C2.8352 8.87034 1.89752 9.24266 1.83799 9.8824C1.8319 9.94785 1.8318 10.0138 1.83769 10.0792C1.89526 10.7192 2.83179 11.0947 4.70485 11.8454C5.55353 12.1856 5.97787 12.3557 6.28211 12.6815C6.31632 12.7181 6.34921 12.7561 6.38073 12.7952C6.66104 13.1435 6.78068 13.6007 7.01992 14.5149L7.46766 16.2259C7.70047 17.1155 7.81688 17.5604 8.12175 17.6211C8.42663 17.6817 8.69207 17.3128 9.22296 16.5751L10.9866 14.1243ZM10.9866 14.1243L10.6953 13.8207C10.3638 13.4751 10.198 13.3024 10.198 13.0877C10.198 12.873 10.3638 12.7002 10.6953 12.3546L13.9706 8.94125",
                      },
                      {
                        key: "twitter",
                        label: "X",
                        icon: "M2.75 19.25L9.66937 12.3306M9.66937 12.3306L2.75 2.75H7.33333L12.3306 9.66937M9.66937 12.3306L14.6667 19.25H19.25L12.3306 9.66937M19.25 2.75L12.3306 9.66937",
                      },
                      {
                        key: "instagram",
                        label: "Instagram",
                        icon: "M2.29166 10.9998C2.29166 6.89469 2.29166 4.84212 3.56696 3.56681C4.84227 2.2915 6.89484 2.2915 11 2.2915C15.1051 2.2915 17.1577 2.2915 18.4331 3.56681C19.7083 4.84212 19.7083 6.89469 19.7083 10.9998C19.7083 15.1049 19.7083 17.1575 18.4331 18.4329C17.1577 19.7082 15.1051 19.7082 11 19.7082C6.89484 19.7082 4.84227 19.7082 3.56696 18.4329C2.29166 17.1575 2.29166 15.1049 2.29166 10.9998Z",
                      },
                      {
                        key: "linkedIn",
                        label: "LinkedIn",
                        icon: "M4.12501 8.7085H3.66668C2.80243 8.7085 2.37032 8.7085 2.10183 8.97698C1.83334 9.24548 1.83334 9.6776 1.83334 10.5418V18.3335C1.83334 19.1977 1.83334 19.6298 2.10183 19.8983C2.37032 20.1668 2.80243 20.1668 3.66668 20.1668H4.12501C4.98925 20.1668 5.42137 20.1668 5.68986 19.8983C5.95834 19.6298 5.95834 19.1977 5.95834 18.3335V10.5418C5.95834 9.6776 5.95834 9.24548 5.68986 8.97698C5.42137 8.7085 4.98925 8.7085 4.12501 8.7085Z",
                      },
                    ].map((social) => {
                      const url =
                        mentor.links?.[social.key] ||
                        mentor.links?.[social.key.toLowerCase()];
                      return (
                        <div
                          key={social.key}
                          className="flex justify-between items-center w-full"
                        >
                          <div className="flex items-center gap-1.5">
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 22 22"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d={social.icon}
                                stroke="#525866"
                                strokeWidth="1.375"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <span className="text-[13px] font-normal text-black font-inter-tight">
                              {social.label}
                            </span>
                          </div>
                          {url && (
                            <Link
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 22 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10.1739 2.75C6.82897 2.75602 5.0774 2.83816 3.95801 3.95773C2.75 5.16593 2.75 7.11051 2.75 10.9996C2.75 14.8888 2.75 16.8334 3.95801 18.0415C5.16601 19.2498 7.11028 19.2498 10.9989 19.2498C14.8873 19.2498 16.8316 19.2498 18.0396 18.0415C19.1589 16.922 19.2411 15.1701 19.2471 11.8247"
                                  stroke="#525866"
                                  strokeWidth="1.375"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M18.8431 3.20458L10.1281 11.9702M18.8431 3.20458C18.3903 2.75119 15.3399 2.79345 14.695 2.80262M18.8431 3.20458C19.296 3.65798 19.2537 6.71231 19.2445 7.35802"
                                  stroke="#525866"
                                  strokeWidth="1.375"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex-shrink-0 border-b border-[#E1E4EA] bg-white px-6 pt-4">
            <div className="flex items-center gap-6">
              {(["Overview", "Reviews", "Session"] as TabType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 font-inter-tight text-[13px] font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? "border-black text-black"
                      : "border-transparent text-[#A3A3A3] hover:text-black"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto scrollbar-hide px-6 py-5">
            {activeTab === "Overview" && (
              <div className="max-w-[560px] flex flex-col gap-6 lg:gap-7">
                {/* About Section */}
                <div className="flex flex-col items-start gap-4 w-full">
                  <h2 className="text-[17px] lg:text-[20px] font-semibold text-black font-inter-tight">
                    About {mentor.name.split(" ")[0]}
                  </h2>
                  <div className="text-[12px] lg:text-[13px] font-normal text-black font-inter-tight leading-[20px] lg:leading-[22px] w-full whitespace-pre-line">
                    {mentor.bio || "No bio added yet."}
                  </div>
                </div>

                {/* Background Section */}
                <div className="flex flex-col items-start gap-4 w-full">
                  <h2 className="text-[17px] lg:text-[20px] font-semibold text-black font-inter-tight">
                    Background
                  </h2>
                  <div className="flex flex-col items-start gap-2 w-full">
                    {[
                      {
                        label: "Headline",
                        values: mentor.title ? [mentor.title] : [],
                      },
                      {
                        label: "Location",
                        values: mentor.location ? [mentor.location] : [],
                      },
                      {
                        label: "Category",
                        values: mentor.category ? [mentor.category] : [],
                      },
                      { label: "Expertise", values: mentor.expertise || [] },
                      { label: "Industries", values: mentor.industries || [] },
                      { label: "Languages", values: mentor.languages || [] },
                    ]
                      .filter((field) => field.values.length > 0)
                      .map((field, index) => (
                        <div
                          key={index}
                          className="flex flex-col lg:flex-row w-full px-2.5 py-2 gap-2 lg:justify-between lg:items-center rounded-lg border border-[#E1E4EA] bg-white overflow-hidden"
                        >
                          <span className="text-[13px] font-normal text-black font-inter-tight leading-[22px] flex-shrink-0">
                            {field.label}
                          </span>
                          <div className="flex justify-start lg:justify-end items-center gap-1.5 flex-wrap">
                            {field.values.map((value, idx) => (
                              <div
                                key={idx}
                                className="px-2.5 py-0.5 rounded bg-[#F5F5F5]"
                              >
                                <span className="text-[11px] lg:text-[12px] font-normal text-black font-inter-tight leading-[22px]">
                                  {value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Reviews" && (
              <div className="max-w-[850px] flex flex-col gap-8">
                {/* Rating Summary */}
                {mentor.totalReviews > 0 && (
                  <div className="flex flex-col gap-4">
                    <h2 className="font-inter-tight text-[15px] font-bold text-black">
                      Rating Overview
                    </h2>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="font-inter-tight text-[32px] font-bold text-black">
                          {mentor.rating.toFixed(1)}
                        </span>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={
                                  star <= Math.round(mentor.rating)
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="font-inter-tight text-[12px] text-[#A3A3A3]">
                            {mentor.totalReviews} reviews
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reviews Section */}
                <div className="flex flex-col gap-4">
                  <h2 className="font-inter-tight text-[15px] font-bold text-black">
                    Reviews
                  </h2>

                  {reviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {reviews.map((review) => (
                        <div
                          key={review.id}
                          className="flex flex-col gap-3 p-4 rounded-xl border border-[#E1E4EA] bg-white hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-b from-purple-400 to-purple-600">
                              {review.mentee.avatar ? (
                                <Image
                                  src={review.mentee.avatar}
                                  alt={review.mentee.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-white text-sm font-semibold">
                                  {review.mentee.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <h3 className="font-inter-tight text-[13px] font-semibold text-black">
                                {review.mentee.name}
                              </h3>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <span
                                    key={star}
                                    className={`text-[10px] ${
                                      star <= review.rating
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          {review.comment && (
                            <p className="font-inter-tight text-[12px] font-normal text-[#525866] leading-[18px]">
                              {review.comment}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="font-inter-tight text-[13px] text-[#A3A3A3]">
                      No reviews yet
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "Session" && (
              <div className="max-w-[680px] flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <h2 className="font-inter-tight text-[15px] font-bold text-black">
                    Session Details
                  </h2>

                  <div className="flex flex-col gap-4 p-4 rounded-xl border border-[#E1E4EA] bg-white">
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center gap-2">
                        <Clock
                          className="w-[15px] h-[15px] text-black flex-shrink-0"
                          strokeWidth={1.2}
                        />
                        <span className="font-inter-tight text-[12px] font-normal text-black">
                          Duration: {mentor.sessionDuration} mins
                        </span>
                      </div>

                      {mentor.defaultMeetingLink && (
                        <div className="flex items-center gap-2">
                          <LocationIcon className="w-[15px] h-[15px] text-black flex-shrink-0" />
                          <span className="font-inter-tight text-[12px] font-normal text-black">
                            Location:{" "}
                            {mentor.defaultMeetingLink.includes("meet.google")
                              ? "Google Meet"
                              : mentor.defaultMeetingLink.includes("zoom")
                                ? "Zoom"
                                : "Online Meeting"}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <span className="font-inter-tight text-[12px] font-normal text-black">
                          Timezone: {mentor.timezone}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#E1E4EA]">
                      <button
                        onClick={() => {
                          setBookingStep(
                            hasSelectedSlot ? "details" : "availability",
                          );
                          setIsBookingModalOpen(true);
                        }}
                        className="w-full h-[44px] rounded-full bg-[#5C30FF] text-white font-inter-tight text-[13px] font-medium hover:bg-[#4a26cc] transition-colors"
                      >
                        Book a Session
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Book Session Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsBookingModalOpen(false)}
          />

          {/* Modal */}
          <div
            className="relative bg-white rounded-2xl w-full max-w-[480px] mx-4 shadow-xl flex flex-col"
            style={{ height: 480 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#E1E4EA]">
              <div className="flex items-center gap-2">
                {bookingStep === "details" && (
                  <button
                    onClick={() => setBookingStep("availability")}
                    className="p-1 hover:bg-[#F5F5F5] rounded-lg transition-colors"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.5 15L7.5 10L12.5 5"
                        stroke="#525866"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
                <h2 className="font-inter-tight text-[17px] font-semibold text-black">
                  {bookingStep === "availability"
                    ? "Select Date & Time"
                    : "Book a Session"}
                </h2>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="p-1 hover:bg-[#F5F5F5] rounded-lg transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 5L5 15M5 5L15 15"
                    stroke="#525866"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Step 1: Availability Selection */}
            {bookingStep === "availability" && (
              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="p-5 flex flex-col gap-5 flex-1 overflow-y-auto scrollbar-styled">
                  {/* Mentor Summary */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full bg-cover bg-center flex-shrink-0"
                      style={{
                        backgroundImage: `url(${mentor.avatar || "/default.png"})`,
                      }}
                    />
                    <div>
                      <h3 className="font-inter-tight text-[14px] font-semibold text-black">
                        {mentor.name}
                      </h3>
                      <p className="font-inter-tight text-[12px] text-[#525866]">
                        {mentor.sessionDuration} min session
                      </p>
                    </div>
                  </div>

                  {availability.length > 0 ? (
                    <>
                      {/* Date Grid */}
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
                                className={`font-inter-tight text-[10px] font-normal ${selectedDate === index ? "text-white/70" : "text-[#A3A3A3]"}`}
                              >
                                {slot.day}
                              </span>
                              <span
                                className={`font-inter-tight text-[13px] font-medium ${selectedDate === index ? "text-white" : "text-black"}`}
                              >
                                {slot.date.split(" ")[1]}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Time Slots */}
                      {timeSlots.length > 0 && (
                        <div className="flex flex-col gap-2">
                          <label className="font-inter-tight text-[13px] font-medium text-black">
                            Select a time
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {timeSlots.map((time, index) => {
                              const booked = isSlotBooked(
                                availability[selectedDate!]?.fullDate,
                                time,
                              );
                              return (
                                <button
                                  key={index}
                                  disabled={booked}
                                  onClick={() => {
                                    if (!booked) {
                                      setSelectedTime(index);
                                      setHasSelectedSlot(true);
                                    }
                                  }}
                                  className={`px-4 py-2 rounded-lg border font-inter-tight text-[13px] font-normal transition-colors ${
                                    booked
                                      ? "bg-[#F5F5F5] border-[#E1E4EA] text-[#A3A3A3] cursor-not-allowed line-through"
                                      : selectedTime === index
                                        ? "bg-[#5C30FF] border-[#5C30FF] text-white"
                                        : "bg-white border-[#E1E4EA] text-black hover:border-[#5C30FF]"
                                  }`}
                                >
                                  {time}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="font-inter-tight text-[13px] text-[#A3A3A3] text-center py-6">
                      No available slots at this time
                    </p>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center gap-3 p-5 border-t border-[#E1E4EA]">
                  <button
                    onClick={() => setIsBookingModalOpen(false)}
                    className="flex-1 h-[44px] rounded-full border border-[#E1E4EA] bg-white text-black font-inter-tight text-[13px] font-medium hover:bg-[#F5F5F5] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setHasSelectedSlot(true);
                      setBookingStep("details");
                    }}
                    disabled={selectedDate === null || selectedTime === null}
                    className="flex-1 h-[44px] rounded-full bg-[#5C30FF] text-white font-inter-tight text-[13px] font-medium hover:bg-[#4a26cc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Booking Details */}
            {bookingStep === "details" && (
              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="p-5 flex flex-col gap-5 flex-1 overflow-y-auto scrollbar-styled">
                  {/* Selected Slot Summary */}
                  <div className="flex items-center gap-4 p-4 bg-[#F8F8F8] rounded-xl">
                    <div
                      className="w-12 h-12 rounded-full bg-cover bg-center flex-shrink-0"
                      style={{
                        backgroundImage: `url(${mentor.avatar || "/default.png"})`,
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-inter-tight text-[14px] font-semibold text-black">
                        {mentor.name}
                      </h3>
                      <p className="font-inter-tight text-[12px] text-[#525866]">
                        {selectedDate !== null
                          ? availability[selectedDate]?.date
                          : ""}
                        , {selectedTime !== null ? timeSlots[selectedTime] : ""}{" "}
                        • {mentor.sessionDuration} mins
                      </p>
                    </div>
                  </div>

                  {/* Topic Selection */}
                  <div className="flex flex-col gap-2">
                    <label className="font-inter-tight text-[13px] font-medium text-black">
                      Topic
                    </label>
                    <select
                      value={selectedTopic}
                      onChange={(e) => setSelectedTopic(e.target.value)}
                      className="w-full h-[44px] px-4 rounded-lg border border-[#E1E4EA] bg-white font-inter-tight text-[13px] text-black focus:outline-none focus:border-[#5C30FF] transition-colors"
                    >
                      <option value="">Select a topic...</option>
                      {mentor.expertise.map((topic, index) => (
                        <option key={index} value={topic}>
                          {topic}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-2">
                    <label className="font-inter-tight text-[13px] font-medium text-black">
                      Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell the mentor about your goals and what you'd like to discuss..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-[#E1E4EA] bg-white font-inter-tight text-[13px] text-black placeholder:text-[#A3A3A3] focus:outline-none focus:border-[#5C30FF] transition-colors resize-none"
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center gap-3 p-5 border-t border-[#E1E4EA]">
                  <button
                    onClick={() => setIsBookingModalOpen(false)}
                    disabled={isSubmitting}
                    className="flex-1 h-[44px] rounded-full border border-[#E1E4EA] bg-white text-black font-inter-tight text-[13px] font-medium hover:bg-[#F5F5F5] transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      setIsSubmitting(true);
                      try {
                        if (selectedDate === null || selectedTime === null)
                          throw new Error("Please select a date and time");
                        const selectedSlot = availability[selectedDate];
                        const selectedTimeValue = timeSlots[selectedTime];
                        if (!selectedSlot || !selectedTimeValue) {
                          throw new Error("Please select a date and time");
                        }
                        await createRequest({
                          mentorId: mentor.id,
                          topic: selectedTopic,
                          message: message,
                          scheduledDate: selectedSlot.fullDate,
                          scheduledTime: selectedTimeValue,
                        });
                        setIsBookingModalOpen(false);
                        setSelectedTopic("");
                        setMessage("");
                        setShowSuccess(true);
                        setTimeout(() => setShowSuccess(false), 3000);
                        getMyRequestsForMentor(mentorId)
                          .then((data) =>
                            setBookedSlots(data.bookedSlots || []),
                          )
                          .catch(() => {});
                      } catch (err) {
                        console.error("Failed to create request:", err);
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                    disabled={!selectedTopic || !message || isSubmitting}
                    className="flex-1 h-[44px] rounded-full bg-[#5C30FF] text-white font-inter-tight text-[13px] font-medium hover:bg-[#4a26cc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Sending..." : "Send Request"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 bg-[#00A859] text-white rounded-xl shadow-lg animate-in slide-in-from-bottom-5">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.6667 5L7.50001 14.1667L3.33334 10"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-inter-tight text-[14px] font-medium">
            Request sent successfully!
          </span>
        </div>
      )}
    </div>
  );
}

// Icon Components
function _DollarCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.5 9C16.5 13.1421 13.1421 16.5 9 16.5C4.85786 16.5 1.5 13.1421 1.5 9C1.5 4.85786 4.85786 1.5 9 1.5C13.1421 1.5 16.5 4.85786 16.5 9Z"
        stroke="currentColor"
        strokeWidth="1.125"
      />
      <path
        d="M11.0326 7.54533C10.9583 6.97334 10.3015 6.04917 9.1206 6.04915C7.7484 6.04913 7.17102 6.8091 7.05386 7.18909C6.87108 7.69736 6.90764 8.74233 8.51602 8.85626C10.5265 8.99876 11.332 9.23606 11.2295 10.4665C11.127 11.6969 10.0063 11.9628 9.1206 11.9342C8.23485 11.9058 6.78573 11.4989 6.72949 10.4045M8.98005 5.24805V6.05187M8.98005 11.9268V12.748"
        stroke="currentColor"
        strokeWidth="1.125"
        strokeLinecap="round"
      />
    </svg>
  );
}

function _CheckDoubleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.875 10.375L4.5 13.125L5.26802 12.3204M12.375 4.875L7.82775 9.63877"
        stroke="currentColor"
        strokeWidth="1.125"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.625 10.375L8.25 13.125L16.125 4.875"
        stroke="currentColor"
        strokeWidth="1.125"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function _TelegramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.5 1.5L7 9M14.5 1.5L10 14.5L7 9M14.5 1.5L1.5 6L7 9"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function _XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.5 1.5H14.5L9.5 7.5L15.5 14.5H11L7.5 10L3.5 14.5H1.5L6.5 8L1 1.5H5.5L8.5 5.5L12.5 1.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function _InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1.5"
        y="1.5"
        width="13"
        height="13"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="12" cy="4" r="0.5" fill="currentColor" />
    </svg>
  );
}

function _LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1.5"
        y="1.5"
        width="13"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M4.5 6.5V11.5M4.5 4.5V4.51M7.5 11.5V6.5M7.5 6.5V8.5C7.5 9.5 8.5 10.5 10 10.5C11 10.5 11.5 10 11.5 9V6.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function _ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 8.66667V12.6667C12 13.0203 11.8595 13.3594 11.6095 13.6095C11.3594 13.8595 11.0203 14 10.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V5.33333C2 4.97971 2.14048 4.64057 2.39052 4.39052C2.64057 4.14048 2.97971 4 3.33333 4H7.33333M10 2H14M14 2V6M14 2L6.66667 9.33333"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 6.66667C14 11.3333 8 15.3333 8 15.3333C8 15.3333 2 11.3333 2 6.66667C2 5.07537 2.63214 3.54925 3.75736 2.42403C4.88258 1.29881 6.4087 0.666672 8 0.666672C9.5913 0.666672 11.1174 1.29881 12.2426 2.42403C13.3679 3.54925 14 5.07537 14 6.66667Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 8.66667C9.10457 8.66667 10 7.77124 10 6.66667C10 5.5621 9.10457 4.66667 8 4.66667C6.89543 4.66667 6 5.5621 6 6.66667C6 7.77124 6.89543 8.66667 8 8.66667Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
