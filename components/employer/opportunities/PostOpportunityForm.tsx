"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BasicInfoStep } from "./post-steps/BasicInfoStep";
import { DescriptionStep } from "./post-steps/DescriptionStep";
import { BudgetScopeStep } from "./post-steps/BudgetScopeStep";

type FormStep = "basic-info" | "description" | "budget-scope";

export function PostOpportunityForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<FormStep>("basic-info");
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    opportunityType: "",
    category: "",
    workType: "",
    location: "",
    compensationType: "",
    roleOverview: "",
    responsibilities: "",
    requirements: "",
    skills: [] as string[],
    tools: [] as string[],
    paymentType: "" as "weekly" | "monthly" | "hourly" | "",
    minBudget: "",
    maxBudget: "",
    maxHours: "",
    duration: "",
    startDate: "",
    experienceLevel: "",
  });

  const handleCancel = () => {
    router.push("/opportunities");
  };

  const handleContinue = () => {
    if (currentStep === "basic-info") {
      setCurrentStep("description");
    } else if (currentStep === "description") {
      setCurrentStep("budget-scope");
    }
  };

  const handleNext = () => {
    handleContinue();
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    router.push("/opportunities/preview");
  };

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  return (
    <div className="h-screen bg-white overflow-hidden flex flex-col">
      <div className=" mx-auto w-full px-4 py-4 md:px-5 md:py-5 flex flex-col flex-1 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col gap-3 pb-4 border-b border-gray-100 flex-shrink-0">
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
                onClick={handleContinue}
                className="px-5 py-2 bg-[#5C30FF] border border-[#5C30FF] rounded-full font-inter-tight text-[13px] font-normal text-white hover:bg-[#4a26cc] transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-9 mt-6 overflow-y-auto flex-1">
          {/* Sidebar - Steps */}
          <div className="w-full lg:w-[230px] flex-shrink-0">
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setCurrentStep("basic-info")}
                className={`flex items-center justify-between px-2.5 py-2 rounded-[8px] transition-colors ${
                  currentStep === "basic-info"
                    ? "bg-transparent"
                    : "hover:bg-gray-50"
                }`}
              >
                <span
                  className={`font-inter-tight text-[13px] ${
                    currentStep === "basic-info"
                      ? "font-semibold text-black"
                      : "font-normal text-[#525866]"
                  }`}
                >
                  1. Basic Info
                </span>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.875 9H3.75"
                    stroke={
                      currentStep === "basic-info" ? "#141B34" : "#525866"
                    }
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.75 13.5C9.75 13.5 14.25 10.1858 14.25 9C14.25 7.8141 9.75 4.5 9.75 4.5"
                    stroke={
                      currentStep === "basic-info" ? "#141B34" : "#525866"
                    }
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                onClick={() => setCurrentStep("description")}
                className={`flex items-center justify-between px-2.5 py-2 rounded-[8px] transition-colors ${
                  currentStep === "description"
                    ? "bg-transparent"
                    : "hover:bg-gray-50"
                }`}
              >
                <span
                  className={`font-inter-tight text-[13px] ${
                    currentStep === "description"
                      ? "font-semibold text-black"
                      : "font-normal text-[#525866]"
                  }`}
                >
                  2. Description
                </span>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.875 9H3.75"
                    stroke={
                      currentStep === "description" ? "#141B34" : "#525866"
                    }
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.75 13.5C9.75 13.5 14.25 10.1858 14.25 9C14.25 7.8141 9.75 4.5 9.75 4.5"
                    stroke={
                      currentStep === "description" ? "#141B34" : "#525866"
                    }
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                onClick={() => setCurrentStep("budget-scope")}
                className={`flex items-center justify-between px-2.5 py-2 rounded-[8px] transition-colors ${
                  currentStep === "budget-scope"
                    ? "bg-transparent"
                    : "hover:bg-gray-50"
                }`}
              >
                <span
                  className={`font-inter-tight text-[13px] ${
                    currentStep === "budget-scope"
                      ? "font-semibold text-black"
                      : "font-normal text-[#525866]"
                  }`}
                >
                  3. Budget & Scope
                </span>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.875 9H3.75"
                    stroke={
                      currentStep === "budget-scope" ? "#141B34" : "#525866"
                    }
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.75 13.5C9.75 13.5 14.25 10.1858 14.25 9C14.25 7.8141 9.75 4.5 9.75 4.5"
                    stroke={
                      currentStep === "budget-scope" ? "#141B34" : "#525866"
                    }
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 w-full max-w-[565px]">
            {currentStep === "basic-info" && (
              <BasicInfoStep
                formData={{
                  title: formData.title,
                  company: formData.company,
                  opportunityType: formData.opportunityType,
                  category: formData.category,
                  workType: formData.workType,
                  location: formData.location,
                  compensationType: formData.compensationType,
                }}
                updateFormData={updateFormData}
                onNext={handleNext}
              />
            )}
            {currentStep === "description" && (
              <DescriptionStep
                formData={{
                  roleOverview: formData.roleOverview,
                  responsibilities: formData.responsibilities,
                  requirements: formData.requirements,
                  skills: formData.skills,
                  tools: formData.tools,
                }}
                updateFormData={updateFormData}
                onNext={handleNext}
              />
            )}
            {currentStep === "budget-scope" && (
              <BudgetScopeStep
                formData={{
                  paymentType: formData.paymentType,
                  minBudget: formData.minBudget,
                  maxBudget: formData.maxBudget,
                  maxHours: formData.maxHours,
                  duration: formData.duration,
                  startDate: formData.startDate,
                  experienceLevel: formData.experienceLevel,
                }}
                updateFormData={updateFormData}
                onSubmit={handleSubmit}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
