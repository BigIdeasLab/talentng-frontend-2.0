"use client";

import React, { useState } from "react";

interface DeclineApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicantName: string;
  jobTitle: string;
}

export const DeclineApplicationModal: React.FC<
  DeclineApplicationModalProps
> = ({ isOpen, onClose, applicantName, jobTitle }) => {
  const [message, setMessage] = useState(
    `Dear ${applicantName},\n\nThank you for your interest in the ${jobTitle} position at Chowdeck Nigeria.\n\nAfter careful consideration, we have decided to move forward with other candidates whose qualifications more closely match our current needs.\n\nWe appreciate the time you invested in applying and wish you the best in your future endeavors.\n\nBest regards,\nChowdeck Nigeria Team`,
  );

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = () => {
    // Handle decline logic here
    console.log({ message });
    onClose();
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
                    <g clipPath="url(#clip0_2218_40738)">
                      <path
                        d="M9.99935 18.3337C14.6017 18.3337 18.3327 14.6027 18.3327 10.0003C18.3327 5.39795 14.6017 1.66699 9.99935 1.66699C5.39698 1.66699 1.66602 5.39795 1.66602 10.0003C1.66602 14.6027 5.39698 18.3337 9.99935 18.3337Z"
                        stroke="#EE4142"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12.5 7.5L7.5 12.5"
                        stroke="#EE4142"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7.5 7.5L12.5 12.5"
                        stroke="#EE4142"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_2218_40738">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <h2 className="font-inter-tight text-lg font-bold text-black">
                    Decline Application
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
                    className="w-full h-[177px] p-3 rounded-[10px] border-2 border-[#5C30FF] font-inter-tight text-sm text-black leading-5 resize-none focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-[#5C30FF]"
                  />
                </div>
              </div>
              <p className="font-inter-tight text-xs text-[#525866]">
                This message will be sent to the talent via email notification.
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end items-center gap-2">
            <button
              onClick={onClose}
              className="h-10 px-5 rounded-[10px] border border-[#E6E7EA] font-inter-tight text-sm font-medium text-black hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="h-10 px-6 rounded-[10px] border border-[#5C30FF] bg-[#E63C23] font-inter-tight text-sm font-medium text-white hover:bg-[#d13520] transition-colors"
            >
              Decline & Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
