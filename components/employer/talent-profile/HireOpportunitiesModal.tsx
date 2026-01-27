"use client";

import { useState } from "react";
import type { Opportunity } from "@/lib/api/opportunities";

interface HireOpportunitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  talentName: string;
  opportunities: Opportunity[];
  onHire: (opportunityId: string) => Promise<void>;
  companyName?: string;
}

export function HireOpportunitiesModal({
  isOpen,
  onClose,
  talentName,
  opportunities,
  onHire,
  companyName = "Company",
}: HireOpportunitiesModalProps) {
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleHire = async () => {
    if (!selectedOpportunityId) return;

    setIsLoading(true);
    try {
      await onHire(selectedOpportunityId);
      setSelectedOpportunityId(null);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-[12px] max-w-[600px] w-full p-8 shadow-lg">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="font-inter-tight text-[24px] font-semibold text-black">
              Hire {talentName}
            </h2>
            <p className="font-inter-tight text-[15px] text-[#525866] mt-2 leading-relaxed">
              Select the opportunity you want to hire this talent for. They will
              receive an email notification.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-black/30 hover:text-black/50 transition-colors flex-shrink-0 ml-4"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Section Label */}
        <h3 className="font-inter-tight text-[16px] font-semibold text-black mt-6 mb-4">
          Your Listed Opportunities
        </h3>

        {/* Opportunities List */}
        {opportunities.length === 0 ? (
          <div className="py-8 text-center">
            <p className="font-inter-tight text-[14px] text-[#525866]">
              No open opportunities available
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 mb-8">
            {opportunities.map((opp) => (
              <button
                key={opp.id}
                onClick={() => setSelectedOpportunityId(opp.id)}
                className={`p-4 rounded-[12px] border-2 text-left transition-colors flex items-center gap-4 ${
                  selectedOpportunityId === opp.id
                    ? "border-[#5C30FF] bg-[#F8F6FF]"
                    : "border-[#E1E4EA] bg-white hover:border-[#D0D4DC]"
                }`}
              >
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#EAE6FF] flex items-center justify-center">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 6C4 4.89543 4.89543 4 6 4H8C8.26522 4 8.52109 4.10536 8.70711 4.29289L10.4142 6H18C19.1046 6 20 6.89543 20 8V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z"
                      fill="#5C30FF"
                    />
                  </svg>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="font-inter-tight text-[16px] font-semibold text-black">
                    {opp.title}
                  </p>
                  <p className="font-inter-tight text-[14px] text-[#525866] mt-1">
                    {companyName}
                  </p>
                </div>

                {/* Badge and Checkmark */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div
                    className={`px-3 py-1 rounded-full font-inter-tight text-[12px] font-medium whitespace-nowrap ${
                      opp.type === "Job"
                        ? "bg-[#5C30FF] text-white"
                        : opp.type === "Internship"
                          ? "bg-[#D4F1E8] text-[#0B7563]"
                          : "bg-[#FEE8C1] text-[#8B5C00]"
                    }`}
                  >
                    {opp.type || "Position"}
                  </div>
                  {selectedOpportunityId === opp.id && (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="10" cy="10" r="9" fill="#5C30FF" />
                      <path
                        d="M7 10L9 12L13 8"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-lg border border-[#E1E4EA] font-inter-tight text-[15px] font-medium text-black hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleHire}
            disabled={
              isLoading || !selectedOpportunityId || opportunities.length === 0
            }
            className="flex-1 px-4 py-3 rounded-lg bg-[#5C30FF] hover:bg-[#4a26cc] disabled:opacity-50 disabled:cursor-not-allowed font-inter-tight text-[15px] font-medium text-white transition-colors flex items-center justify-center gap-2"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="10" cy="10" r="9" fill="white" opacity="0.3" />
              <path
                d="M7 10L9 12L13 8"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {isLoading ? "Hiring..." : "Continue Hire"}
          </button>
        </div>
      </div>
    </div>
  );
}
