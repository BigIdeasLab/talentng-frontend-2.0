"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format, addMonths, subMonths } from "date-fns";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/style.css";

export default function CreateSessionPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 state
  const [sessionType, setSessionType] = useState("");
  const [sessionTitle, setSessionTitle] = useState("");
  const [description, setDescription] = useState("");

  // Step 2 state
  const [duration, setDuration] = useState("30");
  const [pricingType, setPricingType] = useState("paid");
  const [amount, setAmount] = useState("80");
  const [meetingMethod, setMeetingMethod] = useState("google-meet");

  // Step 3 state
  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  const steps = [
    { number: 1, title: "Session Basics", active: currentStep === 1 },
    { number: 2, title: "Time & Pricing", active: currentStep === 2 },
    { number: 3, title: "Availability", active: currentStep === 3 },
  ];

  const handleCancel = () => {
    router.push("/mentorship");
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleContinue = () => {
    // Handle form submission
    console.log({
      sessionType,
      sessionTitle,
      description,
      duration,
      pricingType,
      amount,
      meetingMethod,
      selectedDateRange,
      timeSlots,
    });
  };

  const handleAddTimeSlot = () => {
    if (selectedTimeSlot && !timeSlots.includes(selectedTimeSlot)) {
      setTimeSlots([...timeSlots, selectedTimeSlot]);
      setSelectedTimeSlot("");
    }
  };

  const handleRemoveTimeSlot = (slot: string) => {
    setTimeSlots(timeSlots.filter((s) => s !== slot));
  };

  const formatDateRange = () => {
    if (selectedDateRange?.from && selectedDateRange?.to) {
      return `${format(selectedDateRange.from, "MMMM d")} - ${format(selectedDateRange.to, "MMMM d")}`;
    }
    return "";
  };

  return (
    <div className="h-screen overflow-hidden bg-white">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-gray-100 bg-white px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="font-inter-tight text-base font-medium leading-5 text-black">
            Create A New Session
          </h1>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="rounded-[30px] border border-[#F5F5F5] bg-[#F5F5F5] px-6 py-3 text-sm font-normal text-black hover:bg-[#E5E5E5]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleContinue}
              className="rounded-[30px] bg-[#5C30FF] px-6 py-3 text-sm font-normal text-white hover:bg-[#4A26CC]"
            >
              Continue
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto flex h-[calc(100vh-57px)] max-w-[1200px] gap-6 overflow-hidden px-5 py-6 lg:px-10">
        {/* Left Sidebar - Steps */}
        <aside className="w-full max-w-[280px] flex-shrink-0">
          <div className="flex flex-col gap-2">
            {steps.map((step) => (
              <button
                key={step.number}
                onClick={() => setCurrentStep(step.number)}
                className={`flex items-center justify-between rounded-md px-2.5 py-4 transition-colors ${
                  step.active
                    ? "bg-[#F5F5F5] text-black"
                    : "bg-[#F5F5F5] text-[#525866]"
                }`}
              >
                <span className="font-inter-tight text-[13px] font-normal">
                  {step.number}. {step.title}
                </span>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0"
                >
                  <path
                    d="M13.875 9H3.75"
                    stroke={step.active ? "#141B34" : "#525866"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.75 13.5C9.75 13.5 14.25 10.1858 14.25 9C14.25 7.8141 9.75 4.5 9.75 4.5"
                    stroke={step.active ? "#141B34" : "#525866"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Form Area */}
        <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300">
          <div className="rounded-md bg-white px-3 pb-4 pt-2">
            {/* Step 1: Session Basics */}
            {currentStep === 1 && (
              <div className="flex flex-col gap-7">
                <h2 className="font-inter-tight text-base font-medium leading-5 text-black">
                  Session Basics
                </h2>

                <div className="flex flex-col gap-4">
                  {/* Session Type */}
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="session-type"
                      className="font-inter-tight text-[13px] font-normal text-black"
                    >
                      Session Type
                    </Label>
                    <Select value={sessionType} onValueChange={setSessionType}>
                      <SelectTrigger id="session-type" className="h-11">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-on-1">1-on-1 Mentoring</SelectItem>
                        <SelectItem value="portfolio-review">
                          Portfolio Review
                        </SelectItem>
                        <SelectItem value="career-advice">
                          Career Advice
                        </SelectItem>
                        <SelectItem value="skill-development">
                          Skill Development
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Session Title */}
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="session-title"
                      className="font-inter-tight text-[13px] font-normal text-black"
                    >
                      Session Title
                    </Label>
                    <Input
                      id="session-title"
                      value={sessionTitle}
                      onChange={(e) => setSessionTitle(e.target.value)}
                      placeholder="e.g., Mobile Design Portfolio Review"
                      className="h-11 rounded-md border border-[#E1E4EA] px-3 py-4 font-inter-tight text-[13px] font-normal placeholder:text-[#99A0AE]"
                    />
                  </div>

                  {/* Short Description */}
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="description"
                      className="font-inter-tight text-[13px] font-normal text-black"
                    >
                      Short Description
                    </Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Briefly describe what this session covers"
                      className="min-h-[160px] resize-none text-[13px]"
                    />
                  </div>
                </div>

                {/* Next Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={handleNext}
                    className="rounded-[30px] bg-[#181B25] px-8 py-2.5 font-inter-tight text-sm font-normal text-white hover:bg-[#0F1117]"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Time & Pricing */}
            {currentStep === 2 && (
              <div className="flex flex-col gap-7">
                <h2 className="font-inter-tight text-base font-medium leading-5 text-black">
                  Time & Pricing
                </h2>

                <div className="flex flex-col gap-4">
                  {/* Duration */}
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="duration"
                      className="font-inter-tight text-[13px] font-normal text-black"
                    >
                      Duration
                    </Label>
                    <Select value={duration} onValueChange={setDuration}>
                      <SelectTrigger id="duration" className="h-11">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Pricing Type */}
                  <div className="flex flex-col gap-2">
                    <Label className="font-inter-tight text-[13px] font-normal text-black">
                      Pricing Type
                    </Label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setPricingType("paid")}
                        className={`flex-1 rounded-md border px-4 py-3 text-[13px] font-normal transition-colors ${
                          pricingType === "paid"
                            ? "border-[#5C30FF] bg-[#F5F3FF] text-[#5C30FF]"
                            : "border-[#E1E4EA] bg-white text-black"
                        }`}
                      >
                        Paid
                      </button>
                      <button
                        onClick={() => setPricingType("free")}
                        className={`flex-1 rounded-md border px-4 py-3 text-[13px] font-normal transition-colors ${
                          pricingType === "free"
                            ? "border-[#5C30FF] bg-[#F5F3FF] text-[#5C30FF]"
                            : "border-[#E1E4EA] bg-white text-black"
                        }`}
                      >
                        Free
                      </button>
                    </div>
                  </div>

                  {/* Amount */}
                  {pricingType === "paid" && (
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="amount"
                        className="font-inter-tight text-[13px] font-normal text-black"
                      >
                        Amount (USD)
                      </Label>
                      <Input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="h-11 rounded-md border border-[#E1E4EA] px-3 py-4 font-inter-tight text-[13px] font-normal"
                      />
                    </div>
                  )}

                  {/* Meeting Method */}
                  <div className="flex flex-col gap-2">
                    <Label className="font-inter-tight text-[13px] font-normal text-black">
                      Meeting Method
                    </Label>
                    <div className="flex items-center gap-2 rounded-md border border-[#E1E4EA] px-3 py-3">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.6 7.2C3.6 5.88 4.68 4.8 6 4.8H14.4C15.72 4.8 16.8 5.88 16.8 7.2V16.8C16.8 18.12 15.72 19.2 14.4 19.2H6C4.68 19.2 3.6 18.12 3.6 16.8V7.2Z"
                          fill="#00832D"
                        />
                        <path
                          d="M20.4 8.4L16.8 11.4V12.6L20.4 15.6C20.88 15.96 21.6 15.6 21.6 15V9C21.6 8.4 20.88 8.04 20.4 8.4Z"
                          fill="#0066DA"
                        />
                        <path
                          d="M3.6 7.2C3.6 5.88 4.68 4.8 6 4.8H14.4C15.72 4.8 16.8 5.88 16.8 7.2V9.6H3.6V7.2Z"
                          fill="#E94235"
                        />
                        <path
                          d="M3.6 14.4V16.8C3.6 18.12 4.68 19.2 6 19.2H14.4C15.72 19.2 16.8 18.12 16.8 16.8V14.4H3.6Z"
                          fill="#2684FC"
                        />
                        <path
                          d="M14.4 4.8H6C4.68 4.8 3.6 5.88 3.6 7.2V9.6H16.8V7.2C16.8 5.88 15.72 4.8 14.4 4.8Z"
                          fill="#00AC47"
                        />
                        <path
                          d="M16.8 14.4H3.6V16.8C3.6 18.12 4.68 19.2 6 19.2H14.4C15.72 19.2 16.8 18.12 16.8 16.8V14.4Z"
                          fill="#FFBA00"
                        />
                      </svg>
                      <span className="font-inter-tight text-[13px] font-normal text-black">
                        Google Meet
                      </span>
                    </div>
                  </div>
                </div>

                {/* Next Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={handleNext}
                    className="rounded-[30px] bg-[#181B25] px-8 py-2.5 font-inter-tight text-sm font-normal text-white hover:bg-[#0F1117]"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Availability */}
            {currentStep === 3 && (
              <div className="flex flex-col gap-7">
                <h2 className="font-inter-tight text-base font-medium leading-5 text-black">
                  Availability
                </h2>

                <div className="flex flex-col gap-4">
                  {/* Pick Available Dates */}
                  <div className="flex flex-col gap-3">
                    <Label className="font-inter-tight text-[13px] font-normal text-black">
                      Pick Available Dates
                    </Label>

                    {/* Date Range Display */}
                    {formatDateRange() && (
                      <div className="flex h-11 items-center justify-center rounded-md bg-[#DED7F7] px-3">
                        <span className="font-inter-tight text-[13px] font-normal text-[#5C30FF]">
                          {formatDateRange()}
                        </span>
                      </div>
                    )}

                    {/* Calendar */}
                    <div className="rounded-md bg-[#F5F5F5] p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-inter-tight text-base font-medium text-black">
                          {format(currentMonth, "MMMM yyyy")}
                        </h3>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() =>
                              setCurrentMonth(subMonths(currentMonth, 1))
                            }
                            className="flex h-6 w-6 items-center justify-center rounded hover:bg-gray-200"
                          >
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 30 30"
                              fill="none"
                            >
                              <path
                                d="M10.625 16L17.75 23C18.25 23.5 19 23.5 19.5 23C20 22.5 20 21.75 19.5 21.25L13.375 15L19.5 8.75C20 8.25 20 7.5 19.5 7C19.25 6.75 19 6.625 18.625 6.625C18.25 6.625 18 6.75 17.75 7L10.625 14C10.125 14.625 10.125 15.375 10.625 16C10.625 15.875 10.625 15.875 10.625 16Z"
                                fill="#121212"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() =>
                              setCurrentMonth(addMonths(currentMonth, 1))
                            }
                            className="flex h-6 w-6 items-center justify-center rounded hover:bg-gray-200"
                          >
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 30 30"
                              fill="none"
                            >
                              <path
                                d="M19.4249 14.1129L12.3499 7.05041C12.2337 6.93325 12.0955 6.84026 11.9431 6.7768C11.7908 6.71334 11.6274 6.68066 11.4624 6.68066C11.2974 6.68066 11.134 6.71334 10.9817 6.7768C10.8294 6.84026 10.6911 6.93325 10.5749 7.05041C10.3421 7.28461 10.2114 7.60143 10.2114 7.93166C10.2114 8.26189 10.3421 8.57871 10.5749 8.81291L16.7624 15.0629L10.5749 21.2504C10.3421 21.4846 10.2114 21.8014 10.2114 22.1317C10.2114 22.4619 10.3421 22.7787 10.5749 23.0129C10.6907 23.131 10.8287 23.225 10.9811 23.2894C11.1334 23.3537 11.297 23.3872 11.4624 23.3879C11.6278 23.3872 11.7914 23.3537 11.9437 23.2894C12.0961 23.225 12.2341 23.131 12.3499 23.0129L19.4249 15.9504C19.5518 15.8334 19.6531 15.6913 19.7223 15.5332C19.7916 15.375 19.8273 15.2043 19.8273 15.0317C19.8273 14.859 19.7916 14.6883 19.7223 14.5302C19.6531 14.372 19.5518 14.23 19.4249 14.1129Z"
                                fill="#121212"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <DayPicker
                        mode="range"
                        selected={selectedDateRange}
                        onSelect={setSelectedDateRange}
                        month={currentMonth}
                        onMonthChange={setCurrentMonth}
                        classNames={{
                          months: "flex flex-col",
                          month: "space-y-3",
                          caption: "hidden",
                          caption_label: "text-xs font-medium",
                          nav: "space-x-1 flex items-center",
                          table: "w-full border-collapse",
                          head_row: "flex w-full",
                          head_cell:
                            "text-[#222730] rounded-md w-full font-inter text-xs font-normal flex-1 text-center",
                          row: "flex w-full mt-1.5",
                          cell: "flex-1 text-center text-xs p-0 relative focus-within:relative focus-within:z-20",
                          day: "h-9 w-full p-0 font-inter text-xs font-normal hover:bg-gray-200 rounded-md transition-colors",
                          day_range_start:
                            "bg-[#C4B5FD] text-[#5C30FF] rounded-l-full hover:bg-[#C4B5FD]",
                          day_range_middle:
                            "bg-[#C4B5FD] text-[#5C30FF] rounded-none hover:bg-[#C4B5FD]",
                          day_range_end:
                            "bg-[#C4B5FD] text-[#5C30FF] rounded-r-full hover:bg-[#C4B5FD]",
                          day_selected:
                            "bg-[#C4B5FD] text-[#5C30FF] hover:bg-[#C4B5FD]",
                          day_today: "bg-accent text-accent-foreground",
                          day_outside: "text-gray-400 opacity-50",
                          day_disabled: "text-gray-400 opacity-50",
                          day_hidden: "invisible",
                        }}
                      />
                    </div>
                  </div>

                  {/* Select Available Time */}
                  <div className="flex flex-col gap-3">
                    <Label
                      htmlFor="time-slot"
                      className="font-inter-tight text-[13px] font-normal text-black"
                    >
                      Select Available Time
                    </Label>
                    <div className="flex gap-1.5">
                      <Select
                        value={selectedTimeSlot}
                        onValueChange={setSelectedTimeSlot}
                      >
                        <SelectTrigger id="time-slot" className="h-11 flex-1">
                          <SelectValue placeholder="09:30 AM" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="09:00 AM">09:00 AM</SelectItem>
                          <SelectItem value="09:30 AM">09:30 AM</SelectItem>
                          <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                          <SelectItem value="10:30 AM">10:30 AM</SelectItem>
                          <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                          <SelectItem value="11:30 AM">11:30 AM</SelectItem>
                          <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                          <SelectItem value="12:30 PM">12:30 PM</SelectItem>
                          <SelectItem value="01:00 PM">01:00 PM</SelectItem>
                          <SelectItem value="01:30 PM">01:30 PM</SelectItem>
                          <SelectItem value="02:00 PM">02:00 PM</SelectItem>
                          <SelectItem value="02:30 PM">02:30 PM</SelectItem>
                          <SelectItem value="03:00 PM">03:00 PM</SelectItem>
                          <SelectItem value="03:30 PM">03:30 PM</SelectItem>
                          <SelectItem value="04:00 PM">04:00 PM</SelectItem>
                          <SelectItem value="04:30 PM">04:30 PM</SelectItem>
                          <SelectItem value="05:00 PM">05:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={handleAddTimeSlot}
                        disabled={!selectedTimeSlot}
                        className="h-11 rounded-md bg-[#181B25] px-5 text-sm text-white hover:bg-[#0F1117]"
                      >
                        Add
                      </Button>
                    </div>

                    {/* Selected Time Slots */}
                    {timeSlots.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {timeSlots.map((slot) => (
                          <div
                            key={slot}
                            className="flex items-center gap-1.5 rounded-[24px] bg-[#F5F5F5] px-2.5 py-2"
                          >
                            <span className="font-inter-tight text-xs font-normal text-black">
                              {slot}
                            </span>
                            <button
                              onClick={() => handleRemoveTimeSlot(slot)}
                              className="flex items-center justify-center"
                            >
                              <svg
                                width="11"
                                height="11"
                                viewBox="0 0 13 13"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M9.75 3.25L3.25044 9.74957M9.74957 9.75L3.25 3.25046"
                                  stroke="#606060"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Next Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={handleContinue}
                    className="rounded-[30px] bg-[#181B25] px-8 py-2.5 font-inter-tight text-sm font-normal text-white hover:bg-[#0F1117]"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
