"use client";

import React, { useState } from "react";

interface HireApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicantName: string;
  jobTitle: string;
  applicationId: string;
  onHire: (applicationId: string, message: string) => Promise<void>;
}

export const HireApplicationModal: React.FC<HireApplicationModalProps> = ({
  isOpen,
  onClose,
  applicantName,
  jobTitle,
  applicationId,
  onHire,
}) => {
  const [message, setMessage] = useState(
    `Dear ${applicantName},\n\nCongratulations! We are pleased to offer you the position of ${jobTitle} at Chowdeck Nigeria.\n\nWe were impressed by your qualifications and believe you would be a great fit for our team.\n\nPlease confirm your acceptance and we will proceed with the next steps.\n\nWe look forward to working with you!\n\nBest regards,\nChowdeck Nigeria Team`,
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
      await onHire(applicationId, message);
      onClose();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to hire talent";
      setError(errorMessage);
      console.error("Error hiring talent:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={handleBackdropClick}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-xl border border-[#E4E6EC] shadow-[0_0_15px_0_rgba(0,0,0,0.15)] w-full max-w-[512px] mx-4">
        <div className="flex flex-col gap-10 p-6">
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
                    <g clipPath="url(#clip0_hire)">
                      <path
                        d="M16.5 8.31039V9.00039C16.4991 10.6177 15.9754 12.1914 15.007 13.4868C14.0386 14.7821 12.6775 15.7297 11.1265 16.1883C9.57557 16.6469 7.91794 16.5918 6.40085 16.0313C4.88376 15.4708 3.58849 14.435 2.70822 13.0782C1.82795 11.7214 1.40984 10.1164 1.51626 8.50262C1.62267 6.88881 2.24791 5.35263 3.29871 4.12319C4.34951 2.89375 5.76959 2.03692 7.34714 1.6805C8.92469 1.32407 10.5752 1.48714 12.0525 2.14539"
                        stroke="#5C30FF"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M16.5 3L9 10.5075L6.75 8.2575"
                        stroke="#5C30FF"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_hire">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <h2 className="font-inter-tight text-lg font-bold text-black">
                    Hire Talent
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

              {/* Hiring Info */}
              <div className="flex flex-col gap-5">
                <div className="font-inter-tight text-sm text-black">
                  <span className="text-[#525866] font-normal">
                    Hiring:{" "}
                  </span>
                  <span className="font-medium">{applicantName}</span>
                  <span className="text-[#525866] font-normal"> for </span>
                  <span className="font-medium">{jobTitle}</span>
                </div>
              </div>
            </div>

            {/* Message Section */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-4">
                <label className="font-inter-tight text-sm text-black">
                  Offer Message
                </label>
                <div className="relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full h-[177px] p-3 rounded-[10px] border-2 border-[#5C30FF] font-inter-tight text-sm text-black leading-5 resize-none focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-[#5C30FF]"
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
              disabled={isLoading}
              className={`h-10 px-6 rounded-[10px] border border-[#5C30FF] bg-[#5C30FF] font-inter-tight text-sm font-medium text-white transition-colors ${
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#4a26cc]"
              }`}
            >
              {isLoading ? "Hiring..." : "Hire & Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
