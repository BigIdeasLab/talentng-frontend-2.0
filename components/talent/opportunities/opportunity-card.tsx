"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, Check } from "lucide-react";
import { ApplicationStatusBanner } from "./application-status-banner";
import { ApplicationModal } from "./application-modal";
import type { DisplayOpportunity } from "./types";
import { TYPE_CONFIG } from "@/types/opportunities";
import { useOpportunitiesManager } from "@/hooks/useOpportunitiesManager";
import { useProfile } from "@/hooks";

interface OpportunityCardProps {
  opportunity: DisplayOpportunity;
  onApplicationSubmitted?: (opportunityId: string) => void;
  onSaveToggle?: (opportunityId: string, isSaved: boolean) => void;
}

export function OpportunityCard({
  opportunity,
  onApplicationSubmitted,
  onSaveToggle,
}: OpportunityCardProps) {
  const router = useRouter();
  const { activeRole } = useProfile();
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const currentProfileType = (activeRole === "mentor" ? "mentor" : "talent") as "talent" | "mentor";
  const hasAppliedAsCurrentRole = opportunity.appliedAs?.includes(currentProfileType) ?? false;
  const [isApplied, setIsApplied] = useState(hasAppliedAsCurrentRole);
  const [isSaved, setIsSaved] = useState(opportunity.saved ?? false);
  const [isSavingLoading, setIsSavingLoading] = useState(false);
  const { save: saveOpp, unsave: unsaveOpp } = useOpportunitiesManager();
  const config = TYPE_CONFIG[opportunity.type] || TYPE_CONFIG["job-listing"];
  const isVolunteer = opportunity.type === "Volunteer";

  const handleCardClick = () => {
    router.push(`/opportunities/${opportunity.id}`);
  };

  // Sync isApplied and isSaved when opportunity prop changes or role changes
  useEffect(() => {
    const appliedAsCurrentRole = opportunity.appliedAs?.includes(currentProfileType) ?? false;
    setIsApplied(appliedAsCurrentRole);
    setIsSaved(opportunity.saved ?? false);
  }, [opportunity.id, opportunity.appliedAs, currentProfileType]);

  const handleToggleSave = async () => {
    setIsSavingLoading(true);
    try {
      if (isSaved) {
        await unsaveOpp(opportunity.id);
        setIsSaved(false);
      } else {
        await saveOpp(opportunity.id);
        setIsSaved(true);
      }
      onSaveToggle?.(opportunity.id, !isSaved);
    } catch (error) {
      console.error("Failed to toggle save status:", error);
    } finally {
      setIsSavingLoading(false);
    }
  };

  return (
    <div className="relative">
      <div
        onClick={handleCardClick}
        className="flex flex-col items-center gap-4 pt-3 border border-[#E1E4EA] rounded-[16px] bg-white hover:shadow-md transition-shadow cursor-pointer"
      >
        {/* Card Content */}
        <div className="flex flex-col items-start gap-3.5 w-full px-2.5 md:px-5">
          {/* Header Section */}
          <div className="flex flex-col items-start gap-1.5 w-full">
            {/* Profile and Type Badge */}
            <div className="flex items-center justify-between w-full">
              {/* Profile */}
              <div className="flex items-center gap-2">
                {opportunity.companyLogo ? (
                  <div
                    className="w-8 h-8 rounded-full bg-cover bg-center flex-shrink-0"
                    style={{
                      backgroundImage: `url(${opportunity.companyLogo})`,
                    }}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex-shrink-0" />
                )}
                <div className="flex flex-col items-start gap-1.5">
                  <div className="text-[13px] font-medium font-inter-tight text-black text-center">
                    {opportunity.companyName}
                  </div>
                  <div className="text-[12px] font-light font-inter-tight text-[#525866]">
                    {opportunity.date}
                  </div>
                </div>
              </div>

              {/* Type Badge */}
              <div
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-md"
                style={{ backgroundColor: config.bgColor }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: config.dotColor }}
                />
                <span
                  className="text-[11px] font-normal font-inter-tight text-center"
                  style={{ color: config.textColor }}
                >
                  {config.label}
                </span>
              </div>
            </div>
          </div>

          {/* Job Title */}
          <div className="text-[15px] font-medium font-inter-tight text-black text-center">
            {opportunity.title}
          </div>

          {/* Category */}
          {opportunity.category && (
            <div className="text-[12px] font-normal text-[#525866]">
              {opportunity.category}
            </div>
          )}

          {/* Skills */}
          <div className="flex flex-col items-start gap-2.5 w-full">
            <div className="flex items-start content-start gap-x-1 gap-y-1.5 flex-wrap w-full min-h-[28px]">
              {opportunity.skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-[24px] bg-[#F5F5F5]"
                >
                  <span className="text-[12px] font-normal font-inter-tight text-black text-center leading-[12.6px]">
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="flex flex-col items-start gap-2 w-full px-2.5 border-t border-[#E1E4EA] cursor-default">
          <div className="flex items-center justify-between w-full py-2.5">
            {isVolunteer ? (
              /* Learn More Button for Volunteer */
              <div className="flex items-center justify-end w-full h-8">
                <button
                  onClick={handleCardClick}
                  className="flex items-center gap-1 px-4 py-2 h-8 bg-[#5C30FF] border-[0.822px] border-[#5C30FF] rounded-[40px] hover:bg-[#4a26cc] transition-colors"
                >
                  <span className="text-[12px] font-medium font-inter-tight text-white text-center">
                    Learn More
                  </span>
                </button>
              </div>
            ) : (
              <>
                {/* Budget */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[15px] font-medium font-inter-tight text-black">
                    {opportunity.priceMode === "fixed" ? (
                      <>₦{Number(opportunity.price || "0").toLocaleString()}</>
                    ) : (
                      <>
                        ₦{Number(opportunity.minBudget || "0").toLocaleString()}{" "}
                        - ₦
                        {Number(opportunity.maxBudget || "0").toLocaleString()}
                      </>
                    )}
                    {opportunity.paymentType && (
                      <span>
                        /
                        {opportunity.paymentType === "hourly"
                          ? "hr"
                          : opportunity.paymentType === "weekly"
                            ? "wk"
                            : "mo"}
                      </span>
                    )}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1">
                  {/* Save Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSave();
                    }}
                    disabled={isSavingLoading}
                    className={`flex items-center gap-1 px-4 py-2 h-8 rounded-[40px] transition-colors ${
                      isSaved
                        ? "bg-[#5C30FF] hover:bg-[#4a26cc]"
                        : "bg-[#181B25] hover:bg-[#2a2d39]"
                    } ${isSavingLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${isSaved ? "fill-white" : ""} text-white`}
                    />
                    <span className="text-[12px] font-medium font-inter-tight text-white text-center">
                      {isSaved ? "Saved" : "Save"}
                    </span>
                  </button>

                  {/* Apply Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isApplied) setShowApplicationModal(true);
                    }}
                    disabled={isApplied}
                    className={`flex items-center gap-1 px-4 py-2 h-8 border-[0.822px] rounded-[40px] transition-colors ${
                      isApplied
                        ? "bg-gray-200 border-gray-200 cursor-not-allowed"
                        : "bg-[#5C30FF] border-[#5C30FF] hover:bg-[#4a26cc]"
                    }`}
                  >
                    <Check
                      className={`w-4 h-4 ${isApplied ? "text-gray-600" : "text-white"}`}
                    />
                    <span
                      className={`text-[12px] font-medium font-inter-tight text-center ${
                        isApplied ? "text-gray-600" : "text-white"
                      }`}
                    >
                      {isApplied ? "Applied" : "Apply"}
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <ApplicationModal
        isOpen={showApplicationModal}
        opportunity={opportunity}
        onClose={() => setShowApplicationModal(false)}
        onSubmit={() => {
          setShowApplicationModal(false);
          setIsApplied(true);
          onApplicationSubmitted?.(opportunity.id);
        }}
      />
    </div>
  );
}
