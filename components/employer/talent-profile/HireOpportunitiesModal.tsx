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
      <div className="bg-white rounded-[12px] max-w-[500px] w-full p-6 shadow-lg">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="font-inter-tight text-[20px] font-semibold text-black">
              Hire {talentName}
            </h2>
            <p className="font-inter-tight text-[13px] text-[#525866] mt-1">
              Select an opportunity to hire this talent for
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-black/30 hover:text-black/50 transition-colors"
          >
            <svg
              width="20"
              height="20"
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

        {/* Opportunities List */}
        {opportunities.length === 0 ? (
          <div className="py-8 text-center">
            <p className="font-inter-tight text-[13px] text-[#525866]">
              No open opportunities available
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mb-6 max-h-[400px] overflow-y-auto">
            {opportunities.map((opp) => (
              <button
                key={opp.id}
                onClick={() => setSelectedOpportunityId(opp.id)}
                className={`p-4 rounded-[8px] border-2 text-left transition-colors ${
                  selectedOpportunityId === opp.id
                    ? "border-[#5C30FF] bg-[#F0EBFF]"
                    : "border-[#E1E4EA] bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex flex-col gap-2">
                  <p className="font-inter-tight text-[13px] font-semibold text-black">
                    {opp.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="font-inter-tight text-[12px] text-[#525866]">
                      {companyName}
                    </span>
                    {opp.type && (
                      <>
                        <span className="text-[#E1E4EA]">•</span>
                        <span className="font-inter-tight text-[12px] text-[#525866]">
                          {opp.type}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-[8px] border border-[#E1E4EA] font-inter-tight text-[13px] font-medium text-black hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleHire}
            disabled={
              isLoading || !selectedOpportunityId || opportunities.length === 0
            }
            className="flex-1 px-4 py-2 rounded-[8px] bg-[#5C30FF] hover:bg-[#4a26cc] disabled:opacity-50 disabled:cursor-not-allowed font-inter-tight text-[13px] font-medium text-white transition-colors"
          >
            {isLoading ? "Hiring..." : "Hire for Opportunity"}
          </button>
        </div>
      </div>
    </div>
  );
}
