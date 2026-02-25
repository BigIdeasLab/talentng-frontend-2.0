"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, Check } from "lucide-react";
import { ApplicationStatusBanner } from "./application-status-banner";
import { ApplicationModal } from "./application-modal";
import type { DisplayOpportunity } from "./types";
import { TYPE_CONFIG } from "@/types/opportunities";
import {
  useSaveOpportunity,
  useUnsaveOpportunity,
} from "@/hooks/useTalentOpportunities";
import { useProfile } from "@/hooks";
import { useRoleColors } from "@/lib/theme/RoleColorContext";

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
  const { primary } = useRoleColors();
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const currentProfileType = (activeRole === "mentor" ? "mentor" : "talent") as
    | "talent"
    | "mentor";
  const hasAppliedAsCurrentRole =
    opportunity.appliedAs?.includes(currentProfileType) ?? false;
  const [isApplied, setIsApplied] = useState(hasAppliedAsCurrentRole);
  const [isSaved, setIsSaved] = useState(opportunity.saved ?? false);

  const saveMutation = useSaveOpportunity();
  const unsaveMutation = useUnsaveOpportunity();
  const isSavingLoading = saveMutation.isPending || unsaveMutation.isPending;

  const config = TYPE_CONFIG[opportunity.type] || TYPE_CONFIG["job-listing"];
  const isVolunteer = opportunity.type === "Volunteer";

  const handleCardClick = () => {
    router.push(`/opportunities/${opportunity.id}`);
  };

  // Sync isApplied and isSaved when opportunity prop changes or role changes
  useEffect(() => {
    const appliedAsCurrentRole =
      opportunity.appliedAs?.includes(currentProfileType) ?? false;
    setIsApplied(appliedAsCurrentRole);
    setIsSaved(opportunity.saved ?? false);
  }, [opportunity.id, opportunity.appliedAs, currentProfileType]);

  const handleToggleSave = async () => {
    try {
      if (isSaved) {
        await unsaveMutation.mutateAsync(opportunity.id);
        setIsSaved(false);
      } else {
        await saveMutation.mutateAsync(opportunity.id);
        setIsSaved(true);
      }
      onSaveToggle?.(opportunity.id, !isSaved);
    } catch (error) {
      console.error("Failed to toggle save status:", error);
    }
  };

  return (
    <div className="relative">
      <div
        onClick={handleCardClick}
        className="flex flex-col items-start gap-4 pt-4 pb-1 border border-[#E1E4EA] rounded-[16px] bg-white transition-all cursor-pointer hover:shadow-[0_4px_20px_0_rgba(0,0,0,0.05)] h-full"
      >
        {/* Card Content */}
        <div className="flex flex-col items-start gap-3.5 w-full px-4 md:px-5 flex-1">
          {/* Header Section */}
          <div className="flex items-center justify-between w-full">
            {/* Profile */}
            <div className="flex items-center gap-2">
              {opportunity.companyLogo ? (
                <div
                  className="w-8 h-8 rounded-full bg-cover bg-center flex-shrink-0 border border-black/5"
                  style={{
                    backgroundImage: `url(${opportunity.companyLogo})`,
                  }}
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8463FF] to-[#5C30FF] flex-shrink-0" />
              )}
              <div className="flex flex-col items-start">
                <div className="text-[13px] font-semibold font-inter-tight text-black">
                  {opportunity.companyName}
                </div>
                <div className="text-[11px] font-normal font-inter-tight text-black/30">
                  {opportunity.date}
                </div>
              </div>
            </div>

            {/* Type Badge */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full"
              style={{ backgroundColor: `${config.dotColor}1A` }} // 10% opacity version of dot color for bg
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: config.dotColor }}
              />
              <span
                className="text-[10px] font-medium font-inter-tight uppercase tracking-wider"
                style={{ color: config.dotColor }}
              >
                {config.label}
              </span>
            </div>
          </div>

          {/* Job Title & Subtext */}
          <div className="flex flex-col gap-1 w-full mt-1">
            <h3 className="text-[16px] font-semibold font-inter-tight text-black group-hover:text-black/60 transition-colors line-clamp-1">
              {opportunity.title}
            </h3>
            {(opportunity.location || opportunity.experienceLevel || opportunity.category) && (
              <p className="text-[12px] font-normal text-black/40 font-inter-tight line-clamp-1">
                {[
                  opportunity.location,
                  opportunity.experienceLevel,
                  opportunity.category
                ].filter(Boolean).join(" • ")}
              </p>
            )}
          </div>

          {/* Skills */}
          <div className="flex items-center content-start gap-1.5 flex-wrap w-full mt-0.5">
            {opportunity.skills.slice(0, 3).map((skill, index) => (
              <div
                key={index}
                className="flex items-center justify-center px-2.5 py-1 rounded-full bg-[#8463FF0D] border border-[#8463FF1A]"
              >
                <span className="text-[11px] font-medium font-inter-tight text-[#8463FF] capitalize">
                  {skill}
                </span>
              </div>
            ))}
            {opportunity.skills.length > 3 && (
              <span className="text-[11px] text-black/30 font-medium">
                +{opportunity.skills.length - 3}
              </span>
            )}
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
                  className="flex items-center gap-1 px-4 py-2 h-8 border-[0.822px] rounded-[40px] hover:opacity-80 transition-colors"
                  style={{ backgroundColor: primary, borderColor: primary }}
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
                        ? "hover:opacity-80"
                        : "bg-[#181B25] hover:bg-[#2a2d39]"
                    } ${isSavingLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    style={isSaved ? { backgroundColor: primary } : undefined}
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
                        : "hover:opacity-80"
                    }`}
                    style={
                      !isApplied
                        ? { backgroundColor: primary, borderColor: primary }
                        : undefined
                    }
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
