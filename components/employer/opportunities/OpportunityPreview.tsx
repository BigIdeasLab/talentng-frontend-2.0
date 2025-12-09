"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useProfile } from "@/hooks/useProfile";
import { getToolInfo } from "@/lib/utils/tools";

const typeConfig: Record<string, { label: string; bgColor: string; textColor: string; dotColor: string }> = {
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

interface FormData {
  type: string; // Opportunity type: Job, Internship, PartTime, Volunteer
  title: string;
  description: string;
  keyResponsibilities: string[];
  requirements: string[];
  tags: string[];
  tools: string[];
  category: string;
  workMode: string; // Work location: remote, hybrid, on-site
  location: string;
  paymentType: "weekly" | "monthly" | "hourly" | "";
  minBudget: string;
  maxBudget: string;
  maxHours: string;
  duration: string;
  startDate: string;
  experienceLevel: string;
  employmentType: string; // Employment arrangement: Full-Time, Part-Time, etc.
  status: "active";
}

const DEFAULT_FORM_DATA: FormData = {
  type: "Job",
  title: "Mobile App Designer Intern",
  description:
    "Favro is looking for a creative Mobile App Designer Intern to help improve and reimagine core experiences across our shopping app. You'll be working with senior designers to explore concepts, refine flows, and deliver pixel-perfect screens.",
  keyResponsibilities: [
    "Basic experience with Figma",
    "Strong interest in mobile UI/UX",
    "Understanding of visual hierarchy and layout",
    "Ability to learn quickly and work with feedback",
  ],
  requirements: [
    "Basic experience with Figma",
    "Strong interest in mobile UI/UX",
    "Understanding of visual hierarchy and layout",
    "Ability to learn quickly and work with feedback",
  ],
  tags: ["Mobile App Design", "User Research", "Visual Design", "Wireframing"],
  tools: ["Figma", "Rive", "Webflow", "Lottie", "Framer"],
  category: "Design",
  workMode: "remote",
  location: "Remote",
  paymentType: "hourly",
  minBudget: "50",
  maxBudget: "70",
  maxHours: "",
  duration: "2 Weeks",
  startDate: "Nov 18 2025",
  experienceLevel: "Junior",
  employmentType: "Internship",
  status: "active",
};

export function OpportunityPreview() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentProfile, currentProfileUI, activeRole } = useProfile();
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA);
  const [isLoading, setIsLoading] = useState(true);

  const isVolunteer = formData.type?.toLowerCase() === "volunteer";
  const typeConfigKey = formData.type?.toLowerCase() === "parttime" ? "parttime" : formData.type?.toLowerCase() || "job";
  const config = typeConfig[typeConfigKey] || typeConfig.job;

  const displayProfile = currentProfileUI || currentProfile;

  // Get company logo from profile
  const getCompanyLogo = (): string => {
    const DEFAULT_LOGO =
      "https://api.builder.io/api/v1/image/assets/TEMP/ac611f16c20ce30fd01ad9af988e5821beb576eb?width=180";

    if (!displayProfile) {
      return DEFAULT_LOGO;
    }

    const profile = displayProfile as any;

    // Check personal.profileImageUrl (for UIProfileData)
    if (profile.personal?.profileImageUrl) {
      return profile.personal.profileImageUrl;
    }

    // Check for profileImageUrl at root level
    if (profile.profileImageUrl) {
      return profile.profileImageUrl;
    }

    // Check for profile_image_url (snake_case)
    if (profile.profile_image_url) {
      return profile.profile_image_url;
    }

    return DEFAULT_LOGO;
  };

  // Get company name from profile
  const getCompanyName = (): string => {
    if (!displayProfile) {
      return "Company Name";
    }

    const profile = displayProfile as any;

    // Check professional.company (for UIProfileData)
    if (profile.professional?.company) {
      return profile.professional.company;
    }

    // Check for company at root level
    if (profile.company) {
      return profile.company;
    }

    // Check for companyName at root level
    if (profile.companyName) {
      return profile.companyName;
    }

    return "Company Name";
  };

  useEffect(() => {
    const dataParam = searchParams.get("data");
    if (dataParam) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(dataParam));
        setFormData(parsedData);
      } catch (error) {
        console.error("Failed to parse form data:", error);
      }
    }
    setIsLoading(false);
  }, [searchParams]);

  const handleCancel = () => {
    router.push("/opportunities/post");
  };

  const handleSaveDraft = async () => {
    try {
      const { createOpportunity } = await import("@/lib/api/opportunities");

      const draftData = {
        ...formData,
        minBudget: formData.minBudget
          ? Number(String(formData.minBudget).replace(/\D/g, "")) || undefined
          : undefined,
        maxBudget: formData.maxBudget
          ? Number(String(formData.maxBudget).replace(/\D/g, "")) || undefined
          : undefined,
        maxHours: formData.maxHours ? Number(formData.maxHours) : undefined,
        startDate: formData.startDate
          ? new Date(formData.startDate).toISOString()
          : undefined,
        status: "draft",
      };

      // Map type field to allowed values
      const validTypes = ["Internship", "Volunteer", "Job", "PartTime"];
      const mappedType = validTypes.includes(draftData.type)
        ? draftData.type
        : "Job";

      const finalData = {
        ...draftData,
        type: mappedType,
      };

      const data = await createOpportunity(finalData);
      console.log("Opportunity saved as draft:", data);
      alert("Opportunity saved as draft successfully!");
    } catch (error) {
      console.error("Error saving draft:", error);
      alert("Failed to save draft. Please try again.");
    }
  };

  const handlePost = async () => {
    try {
      const { createOpportunity } = await import("@/lib/api/opportunities");

      console.log(
        "Raw formData minBudget:",
        formData.minBudget,
        "type:",
        typeof formData.minBudget,
      );
      console.log(
        "Raw formData maxBudget:",
        formData.maxBudget,
        "type:",
        typeof formData.maxBudget,
      );

      const opportunityData = {
        ...formData,
        minBudget: formData.minBudget
          ? Number(String(formData.minBudget).replace(/\D/g, "")) || undefined
          : undefined,
        maxBudget: formData.maxBudget
          ? Number(String(formData.maxBudget).replace(/\D/g, "")) || undefined
          : undefined,
        maxHours: formData.maxHours ? Number(formData.maxHours) : undefined,
        startDate: formData.startDate
          ? new Date(formData.startDate).toISOString()
          : undefined,
        status: "active",
      };

      // Map type field to allowed values
      const validTypes = ["Internship", "Volunteer", "Job", "PartTime"];
      const mappedType = validTypes.includes(opportunityData.type)
        ? opportunityData.type
        : "Job";

      const finalData = {
        ...opportunityData,
        type: mappedType,
      };

      console.log("Sending opportunity data:", finalData);
      const data = await createOpportunity(finalData);
      console.log("Opportunity posted successfully:", data);
      router.push("/opportunities");
    } catch (error) {
      console.error("Error posting opportunity:", error);
      alert("Failed to post opportunity. Please try again.");
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="h-screen bg-white overflow-hidden flex flex-col">
      <div className=" mx-auto w-full px-4 py-4 md:px-5 md:py-5 flex flex-col flex-1 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col gap-3 pb-4 border-b border-gray-100 mb-9 flex-shrink-0">
          <div className="flex items-center justify-between gap-3">
            <h1 className="font-inter-tight text-[17px] font-medium text-black">
              Post An Opportunity
            </h1>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCancel}
                className="px-5 py-2 border border-[#F5F5F5] rounded-full font-inter-tight text-[13px] font-normal text-black hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePost}
                className="px-5 py-2 bg-[#5C30FF] border border-[#5C30FF] rounded-full font-inter-tight text-[13px] font-normal text-white hover:bg-[#4a26cc] transition-colors"
              >
                Post
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-6 lg:gap-7 overflow-y-auto flex-1">
          {/* Left Column - Job Details */}
          <div className="flex flex-col gap-9">
            {/* Job Header */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                <img
                  src={getCompanyLogo()}
                  alt="Company Logo"
                  className="w-[75px] h-[75px] rounded-full object-cover"
                />
                <div className="flex flex-col gap-3">
                  <h2 className="font-inter-tight text-[17px] font-medium text-black leading-5">
                    {formData.title}
                  </h2>
                  <div className="flex items-center gap-1.5">
                    <span className="font-inter-tight text-[15px] font-normal text-black/30">
                      {getCompanyName()}
                    </span>
                    <span className="font-inter-tight text-[15px] font-normal text-black/30">
                      •
                    </span>
                    <span className="font-inter-tight text-[15px] font-normal text-black/30">
                      {new Date().toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <div 
                  className="inline-flex items-center gap-1.5 px-2.5 py-2.5 rounded-lg w-fit"
                  style={{ backgroundColor: config.bgColor }}
                >
                  <div 
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: config.dotColor }}
                  />
                  <span 
                    className="font-inter-tight text-[12px] font-normal"
                    style={{ color: config.textColor }}
                  >
                    {config.label}
                  </span>
                </div>
              </div>

              {/* Skills */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((skill, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#5C30FF]/10 border border-[#5C30FF] rounded-full"
                    >
                      <span className="font-inter-tight text-[12px] text-[#5C30FF] font-medium">
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* About the Internship */}
            {formData.description && (
              <div className="flex flex-col gap-4">
                <h3 className="font-inter-tight text-[15px] font-medium text-black leading-[105%]">
                  About the {formData.employmentType || "Opportunity"}
                </h3>
                <p className="font-inter-tight text-[13px] font-normal text-black leading-[165%]">
                  {formData.description}
                </p>
              </div>
            )}

            {/* What You'll Do */}
            {formData.keyResponsibilities.length > 0 && (
              <div className="flex flex-col gap-4">
                <h3 className="font-inter-tight text-[15px] font-medium text-black leading-[105%]">
                  What You'll Do
                </h3>
                <div className="flex flex-col gap-2">
                  {formData.keyResponsibilities.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="text-[#5C30FF] text-[14px] flex-shrink-0 pt-0.5">
                        •
                      </span>
                      <span className="font-inter-tight text-[13px] font-normal text-black leading-[165%]">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {formData.requirements.length > 0 && (
              <div className="flex flex-col gap-4">
                <h3 className="font-inter-tight text-[15px] font-medium text-black leading-[105%]">
                  Requirements
                </h3>
                <div className="flex flex-col gap-2">
                  {formData.requirements.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="text-[#5C30FF] text-[14px] flex-shrink-0 pt-0.5">
                        •
                      </span>
                      <span className="font-inter-tight text-[13px] font-normal text-black leading-[165%]">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tools Needed */}
            {formData.tools.length > 0 && (
              <div className="flex flex-col gap-4">
                <h3 className="font-inter-tight text-[15px] font-medium text-black leading-[105%]">
                  Tools Needed
                </h3>
                <div className="flex flex-wrap gap-2">
                  {formData.tools.map((tool, index) => {
                    const toolInfo = getToolInfo(tool);
                    return (
                      <div
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#5C30FF]/10 border border-[#5C30FF] rounded-full"
                      >
                        <img
                          src={toolInfo.logo}
                          alt={tool}
                          className="w-4 h-4 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                        <span className="font-inter-tight text-[12px] text-[#5C30FF] font-medium">
                          {tool}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Job Card */}
          <div className="flex flex-col gap-2">
            <div className="border border-[#E1E4EA] rounded-[16px] p-5 flex flex-col gap-4 sticky top-0">
              {/* Budget - Hidden for Volunteer */}
              {!isVolunteer && (formData.minBudget || formData.maxBudget) && (
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-inter-tight text-[17px] font-medium text-black">
                      ₦{formData.minBudget || "0"} - ₦
                      {formData.maxBudget || "0"}
                      {formData.paymentType && (
                        <span>
                          /
                          {formData.paymentType === "hourly"
                            ? "hr"
                            : formData.paymentType === "weekly"
                              ? "wk"
                              : "mo"}
                        </span>
                      )}
                    </span>
                    {formData.duration && (
                      <>
                        <span className="font-inter-tight text-[17px] font-medium text-black">
                          •
                        </span>
                        <span className="font-inter-tight text-[17px] font-medium text-black">
                          {formData.duration}
                        </span>
                      </>
                    )}
                  </div>
                  <span className="font-inter-tight text-[12px] font-light text-[#525866]">
                    Budget
                  </span>
                </div>
              )}

              {/* Work Mode & Employment Type */}
              {(formData.workMode || formData.employmentType) && (
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-2">
                    {/* Work Mode */}
                    {formData.workMode && (
                      <div className="flex items-center gap-2">
                        <div className="w-[30px] h-[30px] rounded-full bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
                          <svg
                            width="17"
                            height="17"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M1.66602 11.6663C1.66602 9.32559 1.66602 8.15518 2.22778 7.31444C2.47098 6.95047 2.78348 6.63797 3.14745 6.39477C3.98819 5.83301 5.15858 5.83301 7.49935 5.83301H12.4993C14.8401 5.83301 16.0105 5.83301 16.8513 6.39477C17.2152 6.63797 17.5277 6.95047 17.7709 7.31444C18.3327 8.15518 18.3327 9.32559 18.3327 11.6663C18.3327 14.0071 18.3327 15.1775 17.7709 16.0183C17.5277 16.3822 17.2152 16.6947 16.8513 16.9379C16.0105 17.4997 14.8401 17.4997 12.4993 17.4997H7.49935C5.15858 17.4997 3.98819 17.4997 3.14745 16.9379C2.78348 16.6947 2.47098 16.3822 2.22778 16.0183C1.66602 15.1775 1.66602 14.0071 1.66602 11.6663Z"
                              stroke="#606060"
                              strokeWidth="1.25"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M13.3337 5.83333C13.3337 4.26198 13.3337 3.47631 12.8455 2.98816C12.3573 2.5 11.5717 2.5 10.0003 2.5C8.42899 2.5 7.6433 2.5 7.15515 2.98816C6.66699 3.47631 6.66699 4.26198 6.66699 5.83333"
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
                        <div className="flex flex-col gap-1.5">
                          <span className="font-inter-tight text-[13px] font-medium text-black">
                            {formData.workMode}
                          </span>
                          <span className="font-inter-tight text-[12px] font-light text-[#525866]">
                            Work Mode
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Start Date */}
              {formData.startDate && (
                <div className="flex items-center gap-2">
                  <div className="w-[30px] h-[30px] rounded-full bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.3337 1.66699V5.00033M6.66699 1.66699V5.00033"
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
                        d="M9.99658 11.667H10.0041M9.99658 15.0003H10.0041M13.3262 11.667H13.3337M6.66699 11.667H6.67447M6.66699 15.0003H6.67447"
                        stroke="#606060"
                        strokeWidth="1.66667"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="font-inter-tight text-[13px] font-medium text-black">
                      {formData.startDate}
                    </span>
                    <span className="font-inter-tight text-[12px] font-light text-[#525866]">
                      Start Date
                    </span>
                  </div>
                </div>
              )}

              {/* Location */}
              {formData.location && (
                <div className="flex items-center gap-2">
                  <div className="w-[30px] h-[30px] rounded-full bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.9163 9.16667C12.9163 10.7775 11.6105 12.0833 9.99967 12.0833C8.38884 12.0833 7.08301 10.7775 7.08301 9.16667C7.08301 7.55583 8.38884 6.25 9.99967 6.25C11.6105 6.25 12.9163 7.55583 12.9163 9.16667Z"
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
                  <div className="flex flex-col gap-1.5">
                    <span className="font-inter-tight text-[13px] font-medium text-black">
                      {formData.location}
                    </span>
                    <span className="font-inter-tight text-[12px] font-light text-[#525866]">
                      Location
                    </span>
                  </div>
                </div>
              )}

              {/* Experience Level */}
              {formData.experienceLevel && (
                <div className="flex items-center gap-2">
                  <div className="w-[30px] h-[30px] rounded-full bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.07416 12.4987C4.75882 11.7899 4.58301 11.0013 4.58301 10.1703C4.58301 7.08397 7.00813 4.58203 9.99967 4.58203C12.9913 4.58203 15.4163 7.08397 15.4163 10.1703C15.4163 11.0013 15.2405 11.7899 14.9252 12.4987"
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
                        d="M2.50033 9.99902H1.66699"
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
                        d="M4.69766 4.69668L4.1084 4.10742"
                        stroke="#606060"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12.0979 16.0875C12.9399 15.8152 13.2776 15.0445 13.3726 14.2694C13.4009 14.0378 13.2104 13.8457 12.9771 13.8457L7.06445 13.8459C6.82312 13.8459 6.6293 14.0507 6.65812 14.2903C6.75116 15.064 6.986 15.6291 7.87829 16.0875M12.0979 16.0875C12.0979 16.0875 8.02517 16.0875 7.87829 16.0875M12.0979 16.0875C11.9967 17.7084 11.5286 18.3503 10.0061 18.3323C8.37758 18.3624 8.00294 17.569 7.87829 16.0875"
                        stroke="#606060"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="font-inter-tight text-[13px] font-medium text-black">
                      {formData.experienceLevel}
                    </span>
                    <span className="font-inter-tight text-[12px] font-light text-[#525866]">
                      Experience Level
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch gap-2 pt-4">
                <button
                  onClick={handleSaveDraft}
                  className="flex-1 h-[48px] flex items-center justify-center gap-1.5 bg-[#181B25] border border-[#181B25] rounded-full font-inter-tight text-[14px] font-normal text-white hover:bg-[#2a2d35] transition-colors"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
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
                  Save
                </button>
                <button className="flex-1 h-[48px] flex items-center justify-center gap-2 bg-[#5C30FF] border border-[#5C30FF] rounded-full font-inter-tight text-[14px] font-normal text-white hover:bg-[#4a26cc] transition-colors">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 14L8.5 17.5L19 6.5"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
