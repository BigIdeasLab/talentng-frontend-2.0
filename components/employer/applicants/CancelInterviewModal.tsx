"use client";

import React, { useState } from "react";
import type { ApplicationInterview } from "@/lib/api/applications";

interface CancelInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicantName: string;
  jobTitle: string;
  interview: ApplicationInterview;
  applicationId: string;
  onCancel: (
    applicationId: string,
    interviewId: string,
    reason: string,
  ) => Promise<void>;
}

export const CancelInterviewModal: React.FC<CancelInterviewModalProps> = ({
  isOpen,
  onClose,
  applicantName,
  jobTitle,
  interview,
  applicationId,
  onCancel,
}) => {
  const [reason, setReason] = useState("");
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

      if (!reason.trim()) {
        setError("Please provide a reason for cancellation");
        return;
      }

      await onCancel(applicationId, interview.id, reason);
      onClose();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to cancel interview";
      setError(errorMessage);
      console.error("Error cancelling interview:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = reason.trim().length > 0;

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
                      d="M9 1.66699C4.87 1.66699 1.66667 4.87033 1.66667 9.00033C1.66667 13.1303 4.87 16.334 9 16.334C13.13 16.334 16.3333 13.1303 16.3333 9.00033"
                      stroke="#EE4142"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.6667 4.33301L9 6.99967L6.33333 4.33301"
                      stroke="#EE4142"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <h2 className="font-inter-tight text-lg font-bold text-black">
                    Cancel Interview
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

              {/* Warning Message */}
              <div className="flex flex-col gap-5">
                <div className="font-inter-tight text-sm text-black">
                  <span className="text-[#525866] font-normal">
                    Cancelling for:{" "}
                  </span>
                  <span className="font-medium">{applicantName}</span>
                  <span className="text-[#525866] font-normal"> for </span>
                  <span className="font-medium">{jobTitle}</span>
                </div>

                {/* Warning Box */}
                <div className="p-4 rounded-[10px] bg-[#FEF3C7] border border-[#F59E0B] flex gap-3">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="flex-shrink-0 mt-0.5"
                  >
                    <path
                      d="M10 1.66699C5.4 1.66699 1.66667 5.40033 1.66667 10.0003C1.66667 14.6003 5.4 18.334 10 18.334C14.6 18.334 18.3333 14.6003 18.3333 10.0003C18.3333 5.40033 14.6 1.66699 10 1.66699Z"
                      stroke="#F59E0B"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M10 6.66699V10.0003M10 13.334H10.0083"
                      stroke="#F59E0B"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex-1">
                    <p className="font-inter-tight text-sm text-[#92400D] font-medium">
                      This action will notify the talent and cannot be easily
                      undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reason Section */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-4">
                <label className="font-inter-tight text-sm text-black font-medium">
                  Reason for Cancellation
                </label>
                <div className="relative">
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter the reason for cancelling this interview..."
                    className="w-full h-[120px] p-3 rounded-[10px] border border-[#E1E4EA] font-inter-tight text-sm text-black leading-5 resize-none focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent placeholder:text-[#B2B2B2]"
                  />
                </div>
              </div>
              <p className="font-inter-tight text-xs text-[#525866]">
                The talent will be notified about this cancellation with the
                reason you provide.
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
              Keep Interview
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !isFormValid}
              className={`h-10 px-6 rounded-[10px] font-inter-tight text-sm font-medium text-white transition-colors ${
                isLoading || !isFormValid
                  ? "bg-[#EE4142] opacity-50 cursor-not-allowed"
                  : "bg-[#EE4142] hover:bg-[#d63536]"
              }`}
            >
              {isLoading ? "Cancelling..." : "Cancel Interview"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
