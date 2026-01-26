"use client";

import React, { useState } from "react";

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicantName: string;
  jobTitle: string;
  applicationId: string;
  onSchedule: (
    applicationId: string,
    scheduledDate: string,
    message: string
  ) => Promise<void>;
}

export const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({
  isOpen,
  onClose,
  applicantName,
  jobTitle,
  applicationId,
  onSchedule,
}) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState(
    `Dear ${applicantName},\n\nWe are pleased to inform you that you have been selected for an interview for the ${jobTitle} position at Chowdeck Nigeria.\n\nPlease confirm your availability for the scheduled date and time. We look forward to meeting you!\n\nBest regards,\nChowdeck Nigeria Team`,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Combine date and time into ISO 8601 format
      if (!date || !time) {
        setError("Please select both date and time");
        return;
      }

      // Create a proper ISO 8601 datetime string
      const scheduledDateTime = new Date(`${date}T${time}:00`).toISOString();

      await onSchedule(applicationId, scheduledDateTime, message);
      onClose();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to schedule interview";
      setError(errorMessage);
      console.error("Error scheduling interview:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = date && time;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={handleBackdropClick}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-xl border border-[#E4E6EC] shadow-[0_0_15px_0_rgba(0,0,0,0.15)] w-full max-w-[512px] mx-4">
        <div className="flex flex-col gap-9 p-6">
          {/* Header */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-8">
              {/* Title and Close Button */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.66602 1.66699V5.00033M13.3327 1.66699V5.00033"
                      stroke="#5C30FF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15.8333 3.33398H4.16667C3.24619 3.33398 2.5 4.08018 2.5 5.00065V16.6673C2.5 17.5878 3.24619 18.334 4.16667 18.334H15.8333C16.7538 18.334 17.5 17.5878 17.5 16.6673V5.00065C17.5 4.08018 16.7538 3.33398 15.8333 3.33398Z"
                      stroke="#5C30FF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2.5 8.33398H17.5M7.5 13.334L9.16667 15.0007L12.5 11.6673"
                      stroke="#5C30FF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <h2 className="font-inter-tight text-lg font-bold text-black">
                    Schedule Interview
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="hover:opacity-70 transition-opacity"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.5 4.5L4.50061 13.4994M13.4994 13.5L4.5 4.50064"
                      stroke="#525866"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              {/* Sending To */}
              <div className="flex flex-col gap-5">
                <div className="font-inter-tight text-sm text-black">
                  <span className="text-[#525866] font-normal">
                    Sending to:{" "}
                  </span>
                  <span className="font-medium">{applicantName}</span>
                  <span className="text-[#525866] font-normal"> for </span>
                  <span className="font-medium">{jobTitle}</span>
                </div>

                {/* Date and Time Inputs */}
                <div className="flex items-center gap-4">
                  {/* Interview Date */}
                  <div className="flex-1 flex flex-col gap-2.5">
                    <label className="font-inter-tight text-sm font-medium text-black">
                      Interview Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full h-10 px-3.5 pr-3 rounded-[10px] border border-[#E1E4EA] font-inter-tight text-[15px] text-black focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Interview Time */}
                  <div className="flex-1 flex flex-col gap-2.5">
                    <label className="font-inter-tight text-sm font-medium text-black">
                      Interview Time
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full h-10 px-3.5 pr-3 rounded-[10px] border border-[#E1E4EA] font-inter-tight text-[15px] text-[#525866] focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Section */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-4">
                <label className="font-inter-tight text-sm text-black">
                  Message to Talent
                </label>
                <div className="relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full h-[177px] p-3 rounded-[10px] border border-[#E1E4EA] font-inter-tight text-sm text-black leading-5 resize-none focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                  />
                </div>
              </div>
              <p className="font-inter-tight text-xs text-[#525866]">
                This message will be sent to the talent via email notification.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-[8px] bg-[#FEE2E1] border border-[#EE4142]">
                <p className="font-inter-tight text-sm text-[#991B1B]">
                  {error}
                </p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end items-center gap-2">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="h-10 px-5 rounded-[10px] border border-[#E6E7EA] font-inter-tight text-sm font-medium text-black hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !isFormValid}
              className={`h-10 px-6 rounded-[10px] border border-[#5C30FF] font-inter-tight text-sm font-medium text-white transition-colors ${
                isLoading || !isFormValid
                  ? "bg-[#5C30FF] opacity-50 cursor-not-allowed"
                  : "bg-[#5C30FF] hover:bg-[#4a26cc]"
              }`}
            >
              {isLoading ? "Scheduling..." : "Schedule & Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
