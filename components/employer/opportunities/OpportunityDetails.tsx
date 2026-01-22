"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { getToolInfo } from "@/lib/utils/tools";
import { useOpportunitiesManager } from "@/hooks/useOpportunitiesManager";
import { ApplicationModal } from "@/components/talent/opportunities/application-modal";
import type { DisplayOpportunity } from "@/components/talent/opportunities/types";
import type { Opportunity } from "@/lib/api/opportunities/types";

const typeConfig: Record<
  string,
  { label: string; bgColor: string; textColor: string; dotColor: string }
> = {
  job: {
    label: "Job Listing",
    bgColor: "rgba(92, 48, 255, 0.10)",
    textColor: "#5C30FF",
    dotColor: "#5C30FF",
  },
  internship: {
    label: "Internship",
    bgColor: "rgba(0, 139, 71, 0.09)",
    textColor: "#008B47",
    dotColor: "#008B47",
  },
  volunteer: {
    label: "Volunteer",
    bgColor: "rgba(246, 188, 63, 0.10)",
    textColor: "#D99400",
    dotColor: "#D99400",
  },
  parttime: {
    label: "Part-time",
    bgColor: "rgba(92, 48, 255, 0.10)",
    textColor: "#5C30FF",
    dotColor: "#5C30FF",
  },
};

interface OpportunityDetailsProps {
  opportunityId: string;
}

export function OpportunityDetails({ opportunityId }: OpportunityDetailsProps) {
  const router = useRouter();
  const { currentProfile, currentProfileUI } = useProfile();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isSavingLoading, setIsSavingLoading] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const { save: saveOpp, unsave: unsaveOpp } = useOpportunitiesManager();

  useEffect(() => {
    fetchOpportunityDetails();
  }, [opportunityId]);

  const fetchOpportunityDetails = async () => {
    try {
      setIsLoading(true);
      const { getOpportunityById } = await import("@/lib/api/opportunities");
      const data = await getOpportunityById(opportunityId);
      setOpportunity(data);
    } catch (error) {
      console.error("Error fetching opportunity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSave = async () => {
    if (!opportunity) return;
    setIsSavingLoading(true);
    try {
      if (isSaved) {
        await unsaveOpp(opportunity.id);
        setIsSaved(false);
      } else {
        await saveOpp(opportunity.id);
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Failed to toggle save status:", error);
    } finally {
      setIsSavingLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading opportunity details...</p>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Opportunity not found</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-[#5C30FF] text-white rounded-full hover:bg-[#4a26cc]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Provide defaults for undefined arrays
  const tags = opportunity.tags || [];
  const tools = opportunity.tools || [];
  const keyResponsibilities = opportunity.keyResponsibilities || [];
  const requirements = opportunity.requirements || [];

  const isVolunteer = opportunity.type?.toLowerCase() === "volunteer";
  const typeConfigKey =
    opportunity.type?.toLowerCase() === "parttime"
      ? "parttime"
      : opportunity.type?.toLowerCase() || "job";
  const config = typeConfig[typeConfigKey] || typeConfig.job;

  const getCompanyLogo = (): string => {
    const DEFAULT_LOGO =
      "https://api.builder.io/api/v1/image/assets/TEMP/ac611f16c20ce30fd01ad9af988e5821beb576eb?width=180";
    return opportunity.logo || DEFAULT_LOGO;
  };

  const formatDate = (isoDate?: string): string => {
    if (!isoDate) return "Recently";
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getPaymentTypeAbbr = (paymentType?: string): string => {
    if (!paymentType) return "mo";
    const type = paymentType.toLowerCase();
    if (type === "hourly") return "hr";
    if (type === "weekly") return "wk";
    if (type === "yearly" || type === "annual") return "yr";
    return "mo";
  };

  return (
    <div className="h-screen bg-white overflow-hidden flex flex-col">
      <div className="mx-auto w-full px-3 py-3 md:px-4 md:py-4 flex flex-col flex-1 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col gap-2 pb-3 border-b border-gray-100 mb-7 flex-shrink-0">
          <div className="flex items-center justify-between gap-3">
            <h1 className="font-inter-tight text-[14px] font-medium text-black">
              Opportunity Details
            </h1>
            <button
              onClick={() => router.back()}
              className="px-4 py-1.5 border border-[#F5F5F5] rounded-full font-inter-tight text-[11px] font-normal text-black hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-5 lg:gap-2">
          {/* Left Column - Opportunity Details */}
          <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-4">
                <img
                  src={getCompanyLogo()}
                  alt="Company Logo"
                  className="w-[70px] h-[70px] rounded-[70px] object-cover"
                />
                <div className="flex flex-col gap-3">
                  <h2 className="font-inter-tight text-[16px] font-medium text-black leading-4">
                    {opportunity.title}
                  </h2>
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-inter-tight text-[13px] font-normal text-black/30 text-center leading-normal">
                      {opportunity.company}
                    </span>
                    <span className="font-inter-tight text-[13px] font-normal text-black/30 text-center leading-normal">
                      •
                    </span>
                    <span className="font-inter-tight text-[13px] font-normal text-black/30 text-center leading-normal">
                      {formatDate(opportunity.createdAt)}
                    </span>
                  </div>
                </div>
                <div
                  className="inline-flex items-center gap-1 px-2 py-2 rounded-lg w-fit"
                  style={{ backgroundColor: config.bgColor }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: config.dotColor }}
                  />
                  <span
                    className="font-inter-tight text-[11px] font-normal leading-normal"
                    style={{ color: config.textColor }}
                  >
                    {config.label}
                  </span>
                </div>
              </div>

              {/* Skills */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {tags.map((skill, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center justify-center gap-1.5 px-2.5 py-2 bg-[#F5F5F5] rounded-[20px]"
                    >
                      <span className="font-inter-tight text-[11px] text-black font-normal leading-[105%]">
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* About */}
            {opportunity.description && (
              <div className="flex flex-col gap-3">
                <h3 className="font-inter-tight text-[13px] font-medium text-black leading-[105%]">
                  About the Role
                </h3>
                <p className="font-inter-tight text-[12px] font-normal text-black leading-[170%]">
                  {opportunity.description}
                </p>
              </div>
            )}

            {/* Key Responsibilities */}
            {keyResponsibilities.length > 0 && (
              <div className="flex flex-col gap-3">
                <h3 className="font-inter-tight text-[13px] font-medium text-black leading-[105%]">
                  Key Responsibilities
                </h3>
                <p className="font-inter-tight text-[12px] font-normal text-black leading-[170%]">
                  {keyResponsibilities.join("\n\n")}
                </p>
              </div>
            )}

            {/* Required Skills & Qualifications */}
            {requirements.length > 0 && (
              <div className="flex flex-col gap-3">
                <h3 className="font-inter-tight text-[13px] font-medium text-black leading-[105%]">
                  Required Skills & Qualifications
                </h3>
                <p className="font-inter-tight text-[12px] font-normal text-black leading-[170%]">
                  {requirements.join("\n")}
                </p>
              </div>
            )}

            {/* Tools Needed */}
            {tools.length > 0 && (
              <div className="flex flex-col gap-3">
                <h3 className="font-inter-tight text-[13px] font-medium text-black leading-[105%]">
                  Tools Needed
                </h3>
                <div className="flex flex-wrap gap-1">
                  {tools.map((tool, index) => {
                    const toolInfo = getToolInfo(tool);
                    return (
                      <div
                        key={index}
                        className="inline-flex items-center justify-center gap-1.5 px-2.5 py-2 bg-[#F5F5F5] rounded-[20px]"
                      >
                        <img
                          src={toolInfo.logo}
                          alt={tool}
                          className="w-3.5 h-3.5 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                        <span className="font-inter-tight text-[11px] text-black font-normal leading-[105%]">
                          {tool}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Summary Card */}
          <div className="flex flex-col gap-2">
            {/* Job Details Card */}
            <div className="border border-[#E1E4EA] rounded-[16px] p-4 flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                {/* Budget - Hidden for Volunteer */}
                {!isVolunteer &&
                  (opportunity.minBudget || opportunity.maxBudget) && (
                    <div className="flex flex-col gap-2.5">
                      <span className="font-inter-tight text-[15px] font-medium text-black leading-normal">
                        ₦{opportunity.minBudget || "0"} - ₦
                        {opportunity.maxBudget || "0"}
                        {opportunity.paymentType && (
                          <span className="text-[13px]">
                            /
                            {opportunity.paymentType === "hourly"
                              ? "hr"
                              : opportunity.paymentType === "weekly"
                                ? "wk"
                                : "mo"}
                          </span>
                        )}
                      </span>
                      <span className="font-inter-tight text-[12px] font-light text-[#525866] leading-normal">
                        Budget
                      </span>
                    </div>
                  )}

                {/* Employment Type */}
                {opportunity.employmentType && (
                  <div className="flex items-center gap-2">
                    <div className="w-[28px] h-[28px] rounded-full bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.6665 11.6663C1.6665 9.32559 1.6665 8.15518 2.22827 7.31444C2.47147 6.95047 2.78397 6.63797 3.14794 6.39477C3.98868 5.83301 5.15907 5.83301 7.49984 5.83301H12.4998C14.8406 5.83301 16.011 5.83301 16.8518 6.39477C17.2157 6.63797 17.5282 6.95047 17.7714 7.31444C18.3332 8.15518 18.3332 9.32559 18.3332 11.6663C18.3332 14.0071 18.3332 15.1775 17.7714 16.0183C17.5282 16.3822 17.2157 16.6947 16.8518 16.9379C16.011 17.4997 14.8406 17.4997 12.4998 17.4997H7.49984C5.15907 17.4997 3.98868 17.4997 3.14794 16.9379C2.78397 16.6947 2.47147 16.3822 2.22827 16.0183C1.6665 15.1775 1.6665 14.0071 1.6665 11.6663Z"
                          stroke="#606060"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13.3334 5.83333C13.3334 4.26198 13.3334 3.47631 12.8452 2.98816C12.3571 2.5 11.5714 2.5 10.0001 2.5C8.42875 2.5 7.64306 2.5 7.15491 2.98816C6.66675 3.47631 6.66675 4.26198 6.66675 5.83333"
                          stroke="#606060"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M5 9.16699L5.54331 9.33533C8.40425 10.222 11.5957 10.222 14.4567 9.33533L15 9.16699M10 10.0003V11.667"
                          stroke="#606060"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-inter-tight text-[12px] font-medium text-black leading-normal">
                        {opportunity.employmentType}
                      </span>
                      <span className="font-inter-tight text-[11px] font-light text-[#525866] leading-normal">
                        Job Type
                      </span>
                    </div>
                  </div>
                )}

                {/* Start Date */}
                {opportunity.startDate && (
                  <div className="flex items-center gap-2">
                    <div className="w-[28px] h-[28px] rounded-full bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.3334 1.66699V5.00033M6.66675 1.66699V5.00033"
                          stroke="#606060"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10.8333 3.33301H9.16667C6.02397 3.33301 4.45262 3.33301 3.47631 4.30932C2.5 5.28563 2.5 6.85697 2.5 9.99967V11.6663C2.5 14.809 2.5 16.3804 3.47631 17.3567C4.45262 18.333 6.02397 18.333 9.16667 18.333H10.8333C13.976 18.333 15.5474 18.333 16.5237 17.3567C17.5 16.3804 17.5 14.809 17.5 11.6663V9.99967C17.5 6.85697 17.5 5.28563 16.5237 4.30932C15.5474 3.33301 13.976 3.33301 10.8333 3.33301Z"
                          stroke="#606060"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2.5 8.33301H17.5"
                          stroke="#606060"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9.99633 11.667H10.0038M9.99633 15.0003H10.0038M13.3259 11.667H13.3334M6.66675 11.667H6.67422M6.66675 15.0003H6.67422"
                          stroke="#606060"
                          strokeWidth="1.66667"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-inter-tight text-[12px] font-medium text-black leading-normal">
                        {opportunity.startDate}
                      </span>
                      <span className="font-inter-tight text-[11px] font-light text-[#525866] leading-normal">
                        Start Date
                      </span>
                    </div>
                  </div>
                )}

                {/* Location */}
                {opportunity.location && (
                  <div className="flex items-center gap-2">
                    <div className="w-[28px] h-[28px] rounded-full bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.9166 9.16667C12.9166 10.7775 11.6108 12.0833 9.99992 12.0833C8.38909 12.0833 7.08325 10.7775 7.08325 9.16667C7.08325 7.55583 8.38909 6.25 9.99992 6.25C11.6108 6.25 12.9166 7.55583 12.9166 9.16667Z"
                          stroke="#606060"
                          strokeWidth="1.25"
                        />
                        <path
                          d="M10 1.66699C14.0588 1.66699 17.5 5.02781 17.5 9.10516C17.5 13.2474 14.0027 16.1542 10.7725 18.1309C10.5371 18.2638 10.2708 18.3337 10 18.3337C9.72917 18.3337 9.46292 18.2638 9.2275 18.1309C6.00325 16.135 2.5 13.2617 2.5 9.10516C2.5 5.02781 5.9412 1.66699 10 1.66699Z"
                          stroke="#606060"
                          strokeWidth="1.25"
                        />
                      </svg>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-inter-tight text-[12px] font-medium text-black leading-normal">
                        {opportunity.location}
                      </span>
                      <span className="font-inter-tight text-[11px] font-light text-[#525866] leading-normal">
                        Location
                      </span>
                    </div>
                  </div>
                )}

                {/* Experience Level */}
                {opportunity.experienceLevel && (
                  <div className="flex items-center gap-2">
                    <div className="w-[28px] h-[28px] rounded-full bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.0744 12.4987C4.75906 11.7899 4.58325 11.0013 4.58325 10.1703C4.58325 7.08397 7.00838 4.58203 9.99992 4.58203C12.9915 4.58203 15.4166 7.08397 15.4166 10.1703C15.4166 11.0013 15.2408 11.7899 14.9254 12.4987"
                          stroke="#606060"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                        />
                        <path
                          d="M10 1.66602V2.49935"
                          stroke="#606060"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M18.3333 9.99902H17.5"
                          stroke="#606060"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2.50008 9.99902H1.66675"
                          stroke="#606060"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M15.892 4.10645L15.3027 4.6957"
                          stroke="#606060"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.69741 4.69668L4.10815 4.10742"
                          stroke="#606060"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12.0974 16.0875C12.9394 15.8152 13.2771 15.0445 13.3721 14.2694C13.4004 14.0378 13.2099 13.8457 12.9766 13.8457L7.06396 13.8459C6.82263 13.8459 6.62882 14.0507 6.65763 14.2903C6.75067 15.064 6.98551 15.6291 7.8778 16.0875M12.0974 16.0875C12.0974 16.0875 8.02468 16.0875 7.8778 16.0875M12.0974 16.0875C11.9962 17.7084 11.5281 18.3503 10.0056 18.3323C8.37709 18.3624 8.00245 17.569 7.8778 16.0875"
                          stroke="#606060"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <span className="font-inter-tight text-[12px] font-medium text-black leading-normal">
                        {opportunity.experienceLevel}
                      </span>
                      <span className="font-inter-tight text-[11px] font-light text-[#525866] leading-normal">
                        Experience Level
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Save and Apply Buttons */}
              <div className="flex justify-between items-center gap-2">
                <button
                  onClick={handleToggleSave}
                  disabled={isSavingLoading}
                  className={`flex-1 flex items-center justify-center gap-2 h-[48px] px-4 py-3 rounded-[40px] transition-colors ${
                    isSaved
                      ? "bg-[#5C30FF] hover:bg-[#4a26cc]"
                      : "bg-[#181B25] hover:bg-[#2a2d3a]"
                  } ${isSavingLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill={isSaved ? "white" : "none"}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 17.9808V9.70753C4 6.07416 4 4.25748 5.17157 3.12874C6.34315 2 8.22876 2 12 2C15.7712 2 17.6569 2 18.8284 3.12874C20 4.25748 20 6.07416 20 9.70753V17.9808C20 20.2867 20 21.4396 19.2272 21.8523C17.7305 22.6514 14.9232 19.9852 13.59 19.1824C12.8168 18.7168 12.4302 18.484 12 18.484C11.5698 18.484 11.1832 18.7168 10.41 19.1824C9.0768 19.9852 6.26947 22.6514 4.77285 21.8523C4 21.4396 4 20.2867 4 17.9808Z"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="font-inter-tight text-[14px] font-normal text-white leading-normal">
                    {isSaved ? "Saved" : "Save"}
                  </span>
                </button>
                <button
                  onClick={() => !isApplied && setShowApplicationModal(true)}
                  disabled={isApplied}
                  className={`flex-1 flex items-center justify-center gap-2 h-[48px] px-4 py-3 rounded-[40px] border transition-colors ${
                    isApplied
                      ? "bg-gray-200 border-gray-200 cursor-not-allowed"
                      : "bg-[#5C30FF] border-[#5C30FF] hover:bg-[#4a26cc]"
                  }`}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 14L8.5 17.5L19 6.5"
                      stroke={isApplied ? "#999" : "white"}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span
                    className={`font-inter-tight text-[14px] font-normal leading-normal ${
                      isApplied ? "text-gray-600" : "text-white"
                    }`}
                  >
                    {isApplied ? "Applied" : "Apply"}
                  </span>
                </button>
              </div>
            </div>

            {/* Company Card */}
            <div className="border border-[#E1E4EA] rounded-[16px] p-4 flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <img
                  src={getCompanyLogo()}
                  alt={opportunity.company}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex flex-col gap-1">
                  <span className="font-inter-tight text-[12px] font-medium text-black leading-normal">
                    {opportunity.company}
                  </span>
                  <span className="font-inter-tight text-[11px] font-light text-[#525866] leading-normal capitalize">
                    {opportunity.category || "Company"}
                  </span>
                </div>
              </div>
              {opportunity.description && (
                <p className="font-inter-tight text-[12px] font-normal text-black leading-[160%]">
                  {opportunity.description}
                </p>
              )}
              <button className="w-full flex items-center justify-center py-4 px-4 rounded-[40px] border border-[#F5F5F5] bg-[#F5F5F5] hover:bg-[#e8e8e8] transition-colors">
                <span className="font-inter-tight text-[13px] font-normal text-black leading-normal capitalize">
                  Learn More About {opportunity.company}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Similar Jobs Section */}
        <div className="flex flex-col gap-5 mt-8">
          <h2 className="font-inter-tight text-[13px] font-medium text-black leading-[105%]">
            Similar Jobs
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {/* Job Card 1 */}
            <div className="border border-[#E1E4EA] rounded-[16px] pt-3 flex flex-col gap-4 bg-white">
              <div className="px-3 flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                      <div className="flex flex-col gap-1">
                        <span className="font-inter-tight text-[12px] font-medium text-black leading-normal">
                          Jumia
                        </span>
                        <span className="font-inter-tight text-[11px] font-light text-[#525866] leading-normal">
                          Nov 16
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-2 rounded-lg bg-[#5C30FF]/10">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#5C30FF]"></div>
                      <span className="font-inter-tight text-[11px] font-normal text-[#5C30FF] leading-normal">
                        Job Listing
                      </span>
                    </div>
                  </div>
                </div>
                <h3 className="font-inter-tight text-[13px] font-medium text-black leading-normal">
                  Community Outreach Volunteer
                </h3>
                <div className="flex flex-wrap gap-1">
                  {[
                    "Mobile App Design",
                    "User Research",
                    "Visual Design",
                    "Wireframing",
                  ].map((skill) => (
                    <div
                      key={skill}
                      className="px-2.5 py-2 bg-[#F5F5F5] rounded-[20px]"
                    >
                      <span className="font-inter-tight text-[11px] font-normal text-black leading-[105%]">
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-2 py-2 border-t border-[#E1E4EA] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-inter-tight text-[13px] font-medium text-black leading-normal">
                    $75/hr
                  </span>
                  <div className="px-2 py-1.5 rounded-[20px] bg-[#5C30FF]/10">
                    <span className="font-inter-tight text-[11px] font-normal text-[#5C30FF] leading-normal">
                      Remote
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="h-8 px-3 py-2 flex items-center gap-1 rounded-[40px] bg-[#181B25] hover:bg-[#2a2d3a] transition-colors">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 13.4856V7.28065C3 4.55562 3 3.19311 3.87868 2.34656C4.75736 1.5 6.17157 1.5 9 1.5C11.8284 1.5 13.2427 1.5 14.1213 2.34656C15 3.19311 15 4.55562 15 7.28065V13.4856C15 15.215 15 16.0797 14.4204 16.3892C13.2979 16.9886 11.1924 14.9889 10.1925 14.3868C9.6126 14.0376 9.32265 13.863 9 13.863C8.67735 13.863 8.3874 14.0376 7.8075 14.3868C6.8076 14.9889 4.7021 16.9886 3.57964 16.3892C3 16.0797 3 15.215 3 13.4856Z"
                        stroke="white"
                        strokeWidth="1.125"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="font-inter-tight text-[11px] font-medium text-white leading-normal">
                      Save
                    </span>
                  </button>
                  <button className="h-8 px-3 py-2 flex items-center gap-1 rounded-[40px] border border-[#5C30FF] bg-[#5C30FF] hover:bg-[#4a26cc] transition-colors">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.75 10.5L6.375 13.125L14.25 4.875"
                        stroke="white"
                        strokeWidth="1.125"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="font-inter-tight text-[11px] font-medium text-white leading-normal">
                      Apply
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Job Card 2 */}
            <div className="border border-[#E1E4EA] rounded-[16px] pt-3 flex flex-col gap-4 bg-white">
              <div className="px-3 flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                      <div className="flex flex-col gap-1">
                        <span className="font-inter-tight text-[12px] font-medium text-black leading-normal">
                          Sofia Reyes
                        </span>
                        <span className="font-inter-tight text-[11px] font-light text-[#525866] leading-normal">
                          Mar 15
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-2 rounded-lg bg-[#5C30FF]/10">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#5C30FF]"></div>
                      <span className="font-inter-tight text-[11px] font-normal text-[#5C30FF] leading-normal">
                        Job Listing
                      </span>
                    </div>
                  </div>
                </div>
                <h3 className="font-inter-tight text-[13px] font-medium text-black leading-normal">
                  Brand Designer for Social Content in Design industry
                </h3>
                <div className="flex flex-wrap gap-1">
                  {[
                    "Branding",
                    "Market Research",
                    "Graphic Design",
                    "Storyboarding",
                  ].map((skill) => (
                    <div
                      key={skill}
                      className="px-2.5 py-2 bg-[#F5F5F5] rounded-[20px]"
                    >
                      <span className="font-inter-tight text-[11px] font-normal text-black leading-[105%]">
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-2 py-2 border-t border-[#E1E4EA] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-inter-tight text-[13px] font-medium text-black leading-normal">
                    $75/hr
                  </span>
                  <div className="px-2 py-1.5 rounded-[20px] bg-[#5C30FF]/10">
                    <span className="font-inter-tight text-[11px] font-normal text-[#5C30FF] leading-normal">
                      Remote
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="h-8 px-3 py-2 flex items-center gap-1 rounded-[40px] bg-[#181B25] hover:bg-[#2a2d3a] transition-colors">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 13.4856V7.28065C3 4.55562 3 3.19311 3.87868 2.34656C4.75736 1.5 6.17157 1.5 9 1.5C11.8284 1.5 13.2427 1.5 14.1213 2.34656C15 3.19311 15 4.55562 15 7.28065V13.4856C15 15.215 15 16.0797 14.4204 16.3892C13.2979 16.9886 11.1924 14.9889 10.1925 14.3868C9.6126 14.0376 9.32265 13.863 9 13.863C8.67735 13.863 8.3874 14.0376 7.8075 14.3868C6.8076 14.9889 4.7021 16.9886 3.57964 16.3892C3 16.0797 3 15.215 3 13.4856Z"
                        stroke="white"
                        strokeWidth="1.125"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="font-inter-tight text-[11px] font-medium text-white leading-normal">
                      Save
                    </span>
                  </button>
                  <button className="h-8 px-3 py-2 flex items-center gap-1 rounded-[40px] border border-[#5C30FF] bg-[#5C30FF] hover:bg-[#4a26cc] transition-colors">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.75 10.5L6.375 13.125L14.25 4.875"
                        stroke="white"
                        strokeWidth="1.125"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="font-inter-tight text-[11px] font-medium text-white leading-normal">
                      Apply
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Job Card 3 */}
            <div className="border border-[#E1E4EA] rounded-[16px] pt-3 flex flex-col gap-4 bg-white">
              <div className="px-3 flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                      <div className="flex flex-col gap-1">
                        <span className="font-inter-tight text-[12px] font-medium text-black leading-normal">
                          Jordan Smith
                        </span>
                        <span className="font-inter-tight text-[11px] font-light text-[#525866] leading-normal">
                          Nov 18
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-2 rounded-lg bg-[#5C30FF]/10">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#5C30FF]"></div>
                      <span className="font-inter-tight text-[11px] font-normal text-[#5C30FF] leading-normal">
                        Job Listing
                      </span>
                    </div>
                  </div>
                </div>
                <h3 className="font-inter-tight text-[13px] font-medium text-black leading-normal">
                  Rive And Jitter Specialist
                </h3>
                <div className="flex flex-wrap gap-1">
                  {[
                    "Web Experience",
                    "User Testing",
                    "Interaction Design",
                    "Prototyping",
                  ].map((skill) => (
                    <div
                      key={skill}
                      className="px-2.5 py-2 bg-[#F5F5F5] rounded-[20px]"
                    >
                      <span className="font-inter-tight text-[11px] font-normal text-black leading-[105%]">
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-2 py-2 border-t border-[#E1E4EA] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-inter-tight text-[13px] font-medium text-black leading-normal">
                    $75/hr
                  </span>
                  <div className="px-2 py-1.5 rounded-[20px] bg-[#5C30FF]/10">
                    <span className="font-inter-tight text-[11px] font-normal text-[#5C30FF] leading-normal">
                      Remote
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="h-8 px-3 py-2 flex items-center gap-1 rounded-[40px] bg-[#181B25] hover:bg-[#2a2d3a] transition-colors">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 13.4856V7.28065C3 4.55562 3 3.19311 3.87868 2.34656C4.75736 1.5 6.17157 1.5 9 1.5C11.8284 1.5 13.2427 1.5 14.1213 2.34656C15 3.19311 15 4.55562 15 7.28065V13.4856C15 15.215 15 16.0797 14.4204 16.3892C13.2979 16.9886 11.1924 14.9889 10.1925 14.3868C9.6126 14.0376 9.32265 13.863 9 13.863C8.67735 13.863 8.3874 14.0376 7.8075 14.3868C6.8076 14.9889 4.7021 16.9886 3.57964 16.3892C3 16.0797 3 15.215 3 13.4856Z"
                        stroke="white"
                        strokeWidth="1.125"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="font-inter-tight text-[11px] font-medium text-white leading-normal">
                      Save
                    </span>
                  </button>
                  <button className="h-8 px-3 py-2 flex items-center gap-1 rounded-[40px] border border-[#5C30FF] bg-[#5C30FF] hover:bg-[#4a26cc] transition-colors">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.75 10.5L6.375 13.125L14.25 4.875"
                        stroke="white"
                        strokeWidth="1.125"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="font-inter-tight text-[11px] font-medium text-white leading-normal">
                      Apply
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Job Card 4 */}
            <div className="border border-[#E1E4EA] rounded-[16px] pt-3 flex flex-col gap-4 bg-white">
              <div className="px-3 flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={getCompanyLogo()}
                        alt="Chowdeck"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex flex-col gap-1">
                        <span className="font-inter-tight text-[12px] font-medium text-black leading-normal">
                          Chowdeck
                        </span>
                        <span className="font-inter-tight text-[11px] font-light text-[#525866] leading-normal">
                          Jan 10
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-2 rounded-lg bg-[#5C30FF]/10">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#5C30FF]"></div>
                      <span className="font-inter-tight text-[11px] font-normal text-[#5C30FF] leading-normal">
                        Part-time
                      </span>
                    </div>
                  </div>
                </div>
                <h3 className="font-inter-tight text-[13px] font-medium text-black leading-normal">
                  UX Designer
                </h3>
                <div className="flex flex-wrap gap-1">
                  {[
                    "Visual Design",
                    "A/B Testing",
                    "User Experience",
                    "Sketching",
                  ].map((skill) => (
                    <div
                      key={skill}
                      className="px-2.5 py-2 bg-[#F5F5F5] rounded-[20px]"
                    >
                      <span className="font-inter-tight text-[11px] font-normal text-black leading-[105%]">
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-2 py-2 border-t border-[#E1E4EA] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-inter-tight text-[13px] font-medium text-black leading-normal">
                    $75/hr
                  </span>
                  <div className="px-2 py-1.5 rounded-[20px] bg-[#5C30FF]/10">
                    <span className="font-inter-tight text-[11px] font-normal text-[#5C30FF] leading-normal">
                      Remote
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="h-8 px-3 py-2 flex items-center gap-1 rounded-[40px] bg-[#181B25] hover:bg-[#2a2d3a] transition-colors">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 13.4856V7.28065C3 4.55562 3 3.19311 3.87868 2.34656C4.75736 1.5 6.17157 1.5 9 1.5C11.8284 1.5 13.2427 1.5 14.1213 2.34656C15 3.19311 15 4.55562 15 7.28065V13.4856C15 15.215 15 16.0797 14.4204 16.3892C13.2979 16.9886 11.1924 14.9889 10.1925 14.3868C9.6126 14.0376 9.32265 13.863 9 13.863C8.67735 13.863 8.3874 14.0376 7.8075 14.3868C6.8076 14.9889 4.7021 16.9886 3.57964 16.3892C3 16.0797 3 15.215 3 13.4856Z"
                        stroke="white"
                        strokeWidth="1.125"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="font-inter-tight text-[11px] font-medium text-white leading-normal">
                      Save
                    </span>
                  </button>
                  <button className="h-8 px-3 py-2 flex items-center gap-1 rounded-[40px] border border-[#5C30FF] bg-[#5C30FF] hover:bg-[#4a26cc] transition-colors">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.75 10.5L6.375 13.125L14.25 4.875"
                        stroke="white"
                        strokeWidth="1.125"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="font-inter-tight text-[11px] font-medium text-white leading-normal">
                      Apply
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {opportunity && (
        <ApplicationModal
          isOpen={showApplicationModal}
          opportunity={
            {
              id: opportunity.id,
              title: opportunity.title,
              companyName: opportunity.company,
              companyLogo: getCompanyLogo(),
              date: formatDate(opportunity.createdAt),
              type: opportunity.type,
              category: opportunity.category,
              skills: tags,
              rate: `₦${Math.round(parseFloat(opportunity.minBudget?.toString() || "0") || 0).toLocaleString()} - ₦${Math.round(parseFloat(opportunity.maxBudget?.toString() || "0") || 0).toLocaleString()} / ${getPaymentTypeAbbr(opportunity.paymentType)}`,
              status: (opportunity.status || "draft") as
                | "active"
                | "closed"
                | "draft",
              applied: isApplied,
              saved: isSaved,
            } as DisplayOpportunity
          }
          onClose={() => setShowApplicationModal(false)}
          onSubmit={() => {
            setShowApplicationModal(false);
            setIsApplied(true);
          }}
        />
      )}
    </div>
  );
}
