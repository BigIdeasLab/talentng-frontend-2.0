"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Bookmark, Check } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { useOpportunitiesManager } from "@/hooks/useOpportunitiesManager";
import { useProfile } from "@/hooks";
import { ApplicationModal } from "@/components/talent/opportunities/application-modal";
import type { DisplayOpportunity } from "@/components/talent/opportunities/types";

type OpportunityType = "internship" | "job_listing";

interface Opportunity {
  id: string;
  companyName: string;
  companyLogo: string;
  date: string;
  type: OpportunityType;
  title: string;
  skills: string[];
  rate: string;
  isSaved?: boolean;
  appliedAs?: ("talent" | "mentor")[];
}

interface OpportunitiesGridProps {
  opportunities?: Opportunity[];
  isLoading?: boolean;
  onRemove?: (opportunity: Opportunity) => void;
  onApply?: (opportunity: Opportunity) => void;
  onSaveToggle?: (opportunityId: string, isSaved: boolean) => void;
  onApplicationSubmitted?: (opportunityId: string) => void;
}

const defaultOpportunities: Opportunity[] = [
  {
    id: "1",
    companyName: "Ifeoma Chijioke",
    companyLogo:
      "https://api.builder.io/api/v1/image/assets/TEMP/01cb677bd95bceffde4832706067054e07742b6d?width=80",
    date: "Nov 16",
    type: "internship",
    title: "Art Director / Senior Art Director Intern",
    skills: [
      "Mobile App Design",
      "User Research",
      "Visual Design",
      "Wireframing",
    ],
    rate: "$250 / Month",
  },
  {
    id: "2",
    companyName: "Spotify",
    companyLogo:
      "https://api.builder.io/api/v1/image/assets/TEMP/b0bfb6c564a4b6600d88fa72ebf8eaa9de3ecb0c?width=80",
    date: "Dec 01",
    type: "job_listing",
    title: "Product Designer",
    skills: ["Web Design", "User Testing", "Interaction Design", "Prototyping"],
    rate: "$85/hr",
  },
  {
    id: "3",
    companyName: "Jumia",
    companyLogo:
      "https://api.builder.io/api/v1/image/assets/TEMP/a49ff6e7c4095ef84092ad9c082a315acb23b74f?width=80",
    date: "Nov 16",
    type: "internship",
    title: "Mobile App Designer",
    skills: [
      "Mobile App Design",
      "User Research",
      "Visual Design",
      "Wireframing",
    ],
    rate: "$250 / Month",
  },
  {
    id: "4",
    companyName: "Ifeoma Chijioke",
    companyLogo:
      "https://api.builder.io/api/v1/image/assets/TEMP/01cb677bd95bceffde4832706067054e07742b6d?width=80",
    date: "Nov 16",
    type: "internship",
    title: "Art Director / Senior Art Director Intern",
    skills: [
      "Mobile App Design",
      "User Research",
      "Visual Design",
      "Wireframing",
    ],
    rate: "$250 / Month",
  },
];

export function OpportunitiesGrid({
  opportunities = defaultOpportunities,
  isLoading = false,
  onRemove,
  onApply,
  onSaveToggle,
  onApplicationSubmitted,
}: OpportunitiesGridProps) {
  const { activeRole } = useProfile();
  const currentProfileType = (activeRole === "mentor" ? "mentor" : "talent") as
    | "talent"
    | "mentor";
  const [localSavedState, setLocalSavedState] = useState<{
    [key: string]: boolean;
  }>(
    opportunities.reduce(
      (acc, opp) => ({
        ...acc,
        [opp.id]: opp.isSaved ?? false,
      }),
      {},
    ),
  );
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<DisplayOpportunity | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(
    new Set(
      opportunities
        .filter((opp) => opp.appliedAs?.includes(currentProfileType))
        .map((opp) => opp.id),
    ),
  );
  const { save: saveOpp, unsave: unsaveOpp } = useOpportunitiesManager();

  // Sync appliedIds when opportunities or role changes
  useEffect(() => {
    const newAppliedIds = new Set(
      opportunities
        .filter((opp) => opp.appliedAs?.includes(currentProfileType))
        .map((opp) => opp.id),
    );
    setAppliedIds(newAppliedIds);
  }, [opportunities, currentProfileType]);

  const handleToggleSave = async (opportunity: Opportunity) => {
    setSavingIds((prev) => new Set(prev).add(opportunity.id));
    try {
      const currentSavedState = localSavedState[opportunity.id] ?? false;
      if (currentSavedState) {
        await unsaveOpp(opportunity.id);
        setLocalSavedState((prev) => ({
          ...prev,
          [opportunity.id]: false,
        }));
      } else {
        await saveOpp(opportunity.id);
        setLocalSavedState((prev) => ({
          ...prev,
          [opportunity.id]: true,
        }));
      }
      onSaveToggle?.(opportunity.id, !currentSavedState);
    } catch (error) {
      console.error("Failed to toggle save status:", error);
    } finally {
      setSavingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(opportunity.id);
        return newSet;
      });
    }
  };

  const handleApplyClick = (opportunity: Opportunity) => {
    const displayOpp: DisplayOpportunity = {
      id: opportunity.id,
      companyName: opportunity.companyName,
      companyLogo: opportunity.companyLogo,
      date: opportunity.date,
      type: opportunity.type === "internship" ? "Internship" : "Job",
      title: opportunity.title,
      skills: opportunity.skills,
      rate: opportunity.rate,
      status: "active",
      appliedAs: opportunity.appliedAs,
    };
    setSelectedOpportunity(displayOpp);
    setShowApplicationModal(true);
  };

  const handleApplicationSubmit = (opportunityId: string) => {
    setShowApplicationModal(false);
    setAppliedIds((prev) => new Set(prev).add(opportunityId));
    onApplicationSubmitted?.(opportunityId);
  };
  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">
          Loading opportunities...
        </div>
      </div>
    );
  }

  if (opportunities.length === 0) {
    return (
      <EmptyState
        title="No saved opportunities yet"
        description="Browse opportunities and save the ones that interest you. Build your wishlist here."
        buttonText="Discover Opportunities"
        onButtonClick={onApply as any}
      />
    );
  }

  return (
    <div className="w-full px-[15px] py-[15px] flex justify-center">
      <div className="flex flex-col items-center gap-[8px] max-w-[560px] w-full">
        {opportunities.map((opportunity) => (
          <div
            key={opportunity.id}
            className="flex flex-col items-center gap-[18px] w-full pt-[12px] rounded-[16px] border border-[#E1E4EA] bg-white"
          >
            {/* Main Container */}
            <div className="flex flex-col items-start gap-[16px] w-full px-[10px]">
              {/* Header Section */}
              <div className="flex flex-col items-start gap-[5px] w-full">
                <div className="flex justify-between items-center w-full">
                  {/* Profile */}
                  <div className="flex items-center gap-[8px]">
                    <div className="relative w-[36px] h-[36px] rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      <Image
                        src={opportunity.companyLogo}
                        alt={opportunity.companyName}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex flex-col items-start gap-[4px]">
                      <h3 className="text-[13px] font-medium leading-normal font-inter-tight text-black">
                        {opportunity.companyName}
                      </h3>
                      <span className="text-[12px] font-light leading-normal font-inter-tight text-[#525866]">
                        {opportunity.date}
                      </span>
                    </div>
                  </div>

                  {/* Type Badge */}
                  <div
                    className={`flex px-[10px] py-[8px] items-center gap-[6px] rounded-[6px] ${
                      opportunity.type === "internship"
                        ? "bg-[rgba(0,139,71,0.09)]"
                        : "bg-[rgba(92,48,255,0.10)]"
                    }`}
                  >
                    <div
                      className={`w-[6px] h-[6px] rounded-full ${
                        opportunity.type === "internship"
                          ? "bg-[#008B47]"
                          : "bg-[#5C30FF]"
                      }`}
                    />
                    <span
                      className={`text-[11px] font-normal leading-normal font-inter-tight ${
                        opportunity.type === "internship"
                          ? "text-[#008B47]"
                          : "text-[#5C30FF]"
                      }`}
                    >
                      {opportunity.type === "internship"
                        ? "Internship"
                        : "Job Listing"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Job Title */}
              <h2 className="text-[15px] font-medium leading-normal font-inter-tight text-black">
                {opportunity.title}
              </h2>

              {/* Skills */}
              <div className="flex flex-col items-start gap-[10px] w-full">
                <div className="flex h-auto items-start content-start gap-x-[4px] gap-y-[6px] w-full flex-wrap">
                  {opportunity.skills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="flex px-[10px] py-[8px] justify-center items-center rounded-[30px] bg-[#F5F5F5]"
                    >
                      <span className="text-[11px] font-normal leading-[105%] font-inter-tight text-black">
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Section - Rate and Actions */}
            <div className="flex flex-col items-start gap-[8px] w-full px-[10px] py-[10px] border-t border-[#E1E4EA]">
              <div className="flex justify-between items-center w-full gap-[8px]">
                {/* Rate */}
                <span className="text-[15px] font-medium leading-normal font-inter-tight text-black">
                  {opportunity.rate}
                </span>

                {/* Actions */}
                <div className="flex justify-end items-center gap-[5px]">
                  {/* Remove Button */}
                  <button
                    onClick={() => handleToggleSave(opportunity)}
                    disabled={savingIds.has(opportunity.id)}
                    className="flex h-[36px] px-[16px] py-[12px] items-center gap-[3px] rounded-[50px] bg-[#181B25] hover:bg-[#2a2d3a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Bookmark
                      className="w-[15px] h-[15px]"
                      color="white"
                      strokeWidth={1.125}
                    />
                    <span className="text-[12px] font-medium leading-normal font-inter-tight text-white">
                      Remove
                    </span>
                  </button>

                  {/* Apply Button */}
                  <button
                    onClick={() => handleApplyClick(opportunity)}
                    disabled={appliedIds.has(opportunity.id)}
                    className={`flex h-[36px] px-[16px] py-[12px] items-center gap-[3px] rounded-[50px] border-[0.822px] transition-colors ${
                      appliedIds.has(opportunity.id)
                        ? "bg-gray-200 border-gray-200 cursor-not-allowed"
                        : "border-[#5C30FF] bg-[#5C30FF] hover:bg-[#4a24d6]"
                    }`}
                  >
                    <Check
                      className={`w-[15px] h-[15px] ${
                        appliedIds.has(opportunity.id)
                          ? "text-gray-600"
                          : "text-white"
                      }`}
                      color={appliedIds.has(opportunity.id) ? "#999" : "white"}
                      strokeWidth={1.125}
                    />
                    <span
                      className={`text-[12px] font-medium leading-normal font-inter-tight ${
                        appliedIds.has(opportunity.id)
                          ? "text-gray-600"
                          : "text-white"
                      }`}
                    >
                      {appliedIds.has(opportunity.id) ? "Applied" : "Apply"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Application Modal */}
      {selectedOpportunity && (
        <ApplicationModal
          isOpen={showApplicationModal}
          opportunity={selectedOpportunity}
          onClose={() => setShowApplicationModal(false)}
          onSubmit={() => handleApplicationSubmit(selectedOpportunity!.id)}
        />
      )}
    </div>
  );
}
