"use client";

import { useState } from "react";
import statesCitiesData from "@/lib/data/states-cities.json";
import categories from "@/lib/data/categories.json";
import { ROLE_COLORS } from "@/lib/theme/role-colors";

interface BasicInfoStepProps {
  formData: {
    type: string; // Opportunity type
    title: string;
    category: string;
    workType: string; // Work location: remote, hybrid, on-site
    location: string;
    employmentType: string; // Employment arrangement
  };
  updateFormData: (data: Partial<BasicInfoStepProps["formData"]>) => void;
  onNext: () => void;
  titleError?: string;
  onTitleBlur?: () => void;
}

interface ValidationErrors {
  [key: string]: string;
}

const employmentTypes = [
  "Full-Time",
  "Part-Time",
  "Contract",
  "Temporary",
  "Freelance",
];

export function BasicInfoStep({
  formData,
  updateFormData,
  onNext,
  titleError,
  onTitleBlur,
}: BasicInfoStepProps) {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const selectedState = formData.location.split(", ")[1] || "";
  const selectedCity = formData.location.split(", ")[0] || "";
  const stateData = selectedState
    ? statesCitiesData[selectedState as keyof typeof statesCitiesData]
    : null;
  const cities =
    stateData && "major_cities" in stateData ? stateData.major_cities : [];

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.title.trim() || formData.title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }
    if (!formData.type) {
      newErrors.type = "Opportunity type is required";
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    if (!formData.workType) {
      newErrors.workType = "Work mode is required";
    }
    if (!selectedState || !selectedCity) {
      newErrors.location = "Both state and city are required";
    }
    if (!formData.employmentType) {
      newErrors.employmentType = "Employment type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    } else {
      setTimeout(() => {
        const firstError = document.querySelector("[data-error]");
        if (firstError)
          firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Section Title */}
      <h2 className="font-inter-tight text-[17px] font-medium text-black">
        Basic Information
      </h2>

      {/* Form Fields */}
      <div className="flex flex-col gap-4">
        {/* Title */}
        <div className="flex flex-col gap-2.5">
          <label className="font-inter-tight text-[13px] font-normal text-black">
            Title
          </label>
          <input
            type="text"
            placeholder="Add A descriptive Title"
            value={formData.title}
            onChange={(e) => {
              updateFormData({ title: e.target.value });
              if (errors.title) setErrors({ ...errors, title: "" });
            }}
            className={`w-full px-3 py-3 border rounded-[8px] font-inter-tight text-[13px] text-black placeholder:text-[#99A0AE] outline-none transition-colors ${
              errors.title || titleError ? "border-red-500" : "border-[#E1E4EA]"
            }`}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor =
                ROLE_COLORS.recruiter.primary)
            }
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "";
              onTitleBlur?.();
            }}
          />
          {(errors.title || titleError) && (
            <span
              data-error
              className="font-inter-tight text-[12px] text-red-500"
            >
              {errors.title || titleError}
            </span>
          )}
        </div>

        {/* Opportunity Type & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2.5">
            <label className="font-inter-tight text-[13px] font-normal text-black">
              Opportunity Type
            </label>
            <div className="relative">
              <select
                value={formData.type}
                onChange={(e) => {
                  updateFormData({ type: e.target.value });
                  if (errors.type) setErrors({ ...errors, type: "" });
                }}
                className={`w-full h-[46px] px-3 py-3 border rounded-[8px] font-inter-tight text-[13px] text-black appearance-none outline-none transition-colors bg-white ${
                  errors.type ? "border-red-500" : "border-[#E1E4EA]"
                }`}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor =
                    ROLE_COLORS.recruiter.primary)
                }
                onBlur={(e) => (e.currentTarget.style.borderColor = "")}
              >
                <option value="" disabled className="text-[#99A0AE]">
                  Select
                </option>
                <option value="Job">Job Listing</option>
                <option value="Internship">Internship</option>
                <option value="PartTime">Part-time</option>
                <option value="Volunteer">Volunteer</option>
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.2826 6.2209C11.3525 6.29058 11.4079 6.37338 11.4458 6.46454C11.4837 6.5557 11.5031 6.65344 11.5031 6.75215C11.5031 6.85086 11.4837 6.9486 11.4458 7.03977C11.4079 7.13093 11.3525 7.21373 11.2826 7.2834L8.28255 10.2834C8.21287 10.3533 8.13008 10.4088 8.03892 10.4467C7.94775 10.4845 7.85001 10.504 7.7513 10.504C7.65259 10.504 7.55485 10.4845 7.46369 10.4467C7.37252 10.4088 7.28973 10.3533 7.22005 10.2834L4.22005 7.2834C4.07915 7.14251 4 6.95141 4 6.75215C4 6.5529 4.07915 6.3618 4.22005 6.2209C4.36095 6.08001 4.55204 6.00085 4.7513 6.00085C4.95056 6.00085 5.14165 6.08001 5.28255 6.2209L7.75193 8.68903L10.2213 6.21903C10.2911 6.14942 10.3739 6.09425 10.465 6.05666C10.5561 6.01908 10.6538 5.99983 10.7523 6C10.8509 6.00018 10.9484 6.01977 11.0394 6.05768C11.1304 6.09558 11.213 6.15105 11.2826 6.2209Z"
                  fill="#B2B2B2"
                />
              </svg>
            </div>
            {errors.type && (
              <span
                data-error
                className="font-inter-tight text-[12px] text-red-500"
              >
                {errors.type}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2.5">
            <label className="font-inter-tight text-[13px] font-normal text-black">
              Category / Role
            </label>
            <div className="relative">
              <select
                value={formData.category}
                onChange={(e) => {
                  updateFormData({ category: e.target.value });
                  if (errors.category) setErrors({ ...errors, category: "" });
                }}
                className={`w-full h-[46px] px-3 py-3 border rounded-[8px] font-inter-tight text-[13px] text-black appearance-none outline-none transition-colors bg-white ${
                  errors.category ? "border-red-500" : "border-[#E1E4EA]"
                }`}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor =
                    ROLE_COLORS.recruiter.primary)
                }
                onBlur={(e) => (e.currentTarget.style.borderColor = "")}
              >
                <option value="" disabled className="text-[#99A0AE]">
                  Select Category
                </option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.2826 6.2209C11.3525 6.29058 11.4079 6.37338 11.4458 6.46454C11.4837 6.5557 11.5031 6.65344 11.5031 6.75215C11.5031 6.85086 11.4837 6.9486 11.4458 7.03977C11.4079 7.13093 11.3525 7.21373 11.2826 7.2834L8.28255 10.2834C8.21287 10.3533 8.13008 10.4088 8.03892 10.4467C7.94775 10.4845 7.85001 10.504 7.7513 10.504C7.65259 10.504 7.55485 10.4845 7.46369 10.4467C7.37252 10.4088 7.28973 10.3533 7.22005 10.2834L4.22005 7.2834C4.07915 7.14251 4 6.95141 4 6.75215C4 6.5529 4.07915 6.3618 4.22005 6.2209C4.36095 6.08001 4.55204 6.00085 4.7513 6.00085C4.95056 6.00085 5.14165 6.08001 5.28255 6.2209L7.75193 8.68903L10.2213 6.21903C10.2911 6.14942 10.3739 6.09425 10.465 6.05666C10.5561 6.01908 10.6538 5.99983 10.7523 6C10.8509 6.00018 10.9484 6.01977 11.0394 6.05768C11.1304 6.09558 11.213 6.15105 11.2826 6.2209Z"
                  fill="#B2B2B2"
                />
              </svg>
            </div>
            {errors.category && (
              <span
                data-error
                className="font-inter-tight text-[12px] text-red-500"
              >
                {errors.category}
              </span>
            )}
          </div>
        </div>

        {/* Work Mode */}
        <div className="flex flex-col gap-2.5">
          <label className="font-inter-tight text-[13px] font-normal text-black">
            Work Mode
          </label>
          <div className="relative">
            <select
              value={formData.workType}
              onChange={(e) => {
                updateFormData({ workType: e.target.value });
                if (errors.workType) setErrors({ ...errors, workType: "" });
              }}
              className={`w-full h-[46px] px-3 py-3 border rounded-[8px] font-inter-tight text-[13px] appearance-none outline-none transition-colors bg-white ${
                errors.workType ? "border-red-500" : "border-[#E1E4EA]"
              }`}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor =
                  ROLE_COLORS.recruiter.primary)
              }
              onBlur={(e) => (e.currentTarget.style.borderColor = "")}
            >
              <option value="" disabled className="text-[#99A0AE]">
                Select
              </option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="on-site">On-Site</option>
            </select>
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.2826 6.2209C11.3525 6.29058 11.4079 6.37338 11.4458 6.46454C11.4837 6.5557 11.5031 6.65344 11.5031 6.75215C11.5031 6.85086 11.4837 6.9486 11.4458 7.03977C11.4079 7.13093 11.3525 7.21373 11.2826 7.2834L8.28255 10.2834C8.21287 10.3533 8.13008 10.4088 8.03892 10.4467C7.94775 10.4845 7.85001 10.504 7.7513 10.504C7.65259 10.504 7.55485 10.4845 7.46369 10.4467C7.37252 10.4088 7.28973 10.3533 7.22005 10.2834L4.22005 7.2834C4.07915 7.14251 4 6.95141 4 6.75215C4 6.5529 4.07915 6.3618 4.22005 6.2209C4.36095 6.08001 4.55204 6.00085 4.7513 6.00085C4.95056 6.00085 5.14165 6.08001 5.28255 6.2209L7.75193 8.68903L10.2213 6.21903C10.2911 6.14942 10.3739 6.09425 10.465 6.05666C10.5561 6.01908 10.6538 5.99983 10.7523 6C10.8509 6.00018 10.9484 6.01977 11.0394 6.05768C11.1304 6.09558 11.213 6.15105 11.2826 6.2209Z"
                fill="#B2B2B2"
              />
            </svg>
          </div>
          {errors.workType && (
            <span
              data-error
              className="font-inter-tight text-[12px] text-red-500"
            >
              {errors.workType}
            </span>
          )}
        </div>

        {/* Employment Type */}
        <div className="flex flex-col gap-2.5">
          <label className="font-inter-tight text-[13px] font-normal text-black">
            Employment Type
          </label>
          <div className="relative">
            <select
              value={formData.employmentType}
              onChange={(e) => {
                updateFormData({ employmentType: e.target.value });
                if (errors.employmentType)
                  setErrors({ ...errors, employmentType: "" });
              }}
              className={`w-full h-[46px] px-3 py-3 border rounded-[8px] font-inter-tight text-[13px] text-black appearance-none outline-none transition-colors bg-white ${
                errors.employmentType ? "border-red-500" : "border-[#E1E4EA]"
              }`}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor =
                  ROLE_COLORS.recruiter.primary)
              }
              onBlur={(e) => (e.currentTarget.style.borderColor = "")}
            >
              <option value="" disabled className="text-[#99A0AE]">
                Select
              </option>
              {employmentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.2826 6.2209C11.3525 6.29058 11.4079 6.37338 11.4458 6.46454C11.4837 6.5557 11.5031 6.65344 11.5031 6.75215C11.5031 6.85086 11.4837 6.9486 11.4458 7.03977C11.4079 7.13093 11.3525 7.21373 11.2826 7.2834L8.28255 10.2834C8.21287 10.3533 8.13008 10.4088 8.03892 10.4467C7.94775 10.4845 7.85001 10.504 7.7513 10.504C7.65259 10.504 7.55485 10.4845 7.46369 10.4467C7.37252 10.4088 7.28973 10.3533 7.22005 10.2834L4.22005 7.2834C4.07915 7.14251 4 6.95141 4 6.75215C4 6.5529 4.07915 6.3618 4.22005 6.2209C4.36095 6.08001 4.55204 6.00085 4.7513 6.00085C4.95056 6.00085 5.14165 6.08001 5.28255 6.2209L7.75193 8.68903L10.2213 6.21903C10.2911 6.14942 10.3739 6.09425 10.465 6.05666C10.5561 6.01908 10.6538 5.99983 10.7523 6C10.8509 6.00018 10.9484 6.01977 11.0394 6.05768C11.1304 6.09558 11.213 6.15105 11.2826 6.2209Z"
                fill="#B2B2B2"
              />
            </svg>
          </div>
          {errors.employmentType && (
            <span
              data-error
              className="font-inter-tight text-[12px] text-red-500"
            >
              {errors.employmentType}
            </span>
          )}
        </div>

        {/* Location - State & City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2.5">
            <label className="font-inter-tight text-[13px] font-normal text-black">
              State
            </label>
            <div className="relative">
              <select
                value={selectedState}
                onChange={(e) => {
                  const newLocation = e.target.value
                    ? `${selectedCity}, ${e.target.value}`
                    : selectedCity;
                  updateFormData({ location: newLocation });
                  if (errors.location) setErrors({ ...errors, location: "" });
                }}
                className={`w-full h-[46px] px-3 py-3 border rounded-[8px] font-inter-tight text-[13px] text-black appearance-none outline-none transition-colors bg-white ${
                  errors.location ? "border-red-500" : "border-[#E1E4EA]"
                }`}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor =
                    ROLE_COLORS.recruiter.primary)
                }
                onBlur={(e) => (e.currentTarget.style.borderColor = "")}
              >
                <option value="" disabled className="text-[#99A0AE]">
                  Select
                </option>
                {Object.keys(statesCitiesData).map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.2826 6.2209C11.3525 6.29058 11.4079 6.37338 11.4458 6.46454C11.4837 6.5557 11.5031 6.65344 11.5031 6.75215C11.5031 6.85086 11.4837 6.9486 11.4458 7.03977C11.4079 7.13093 11.3525 7.21373 11.2826 7.2834L8.28255 10.2834C8.21287 10.3533 8.13008 10.4088 8.03892 10.4467C7.94775 10.4845 7.85001 10.504 7.7513 10.504C7.65259 10.504 7.55485 10.4845 7.46369 10.4467C7.37252 10.4088 7.28973 10.3533 7.22005 10.2834L4.22005 7.2834C4.07915 7.14251 4 6.95141 4 6.75215C4 6.5529 4.07915 6.3618 4.22005 6.2209C4.36095 6.08001 4.55204 6.00085 4.7513 6.00085C4.95056 6.00085 5.14165 6.08001 5.28255 6.2209L7.75193 8.68903L10.2213 6.21903C10.2911 6.14942 10.3739 6.09425 10.465 6.05666C10.5561 6.01908 10.6538 5.99983 10.7523 6C10.8509 6.00018 10.9484 6.01977 11.0394 6.05768C11.1304 6.09558 11.213 6.15105 11.2826 6.2209Z"
                  fill="#B2B2B2"
                />
              </svg>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <label className="font-inter-tight text-[13px] font-normal text-black">
              City
            </label>
            <div className="relative">
              <select
                value={selectedCity}
                onChange={(e) => {
                  const newLocation = e.target.value
                    ? `${e.target.value}, ${selectedState}`
                    : selectedState;
                  updateFormData({ location: newLocation });
                  if (errors.location) setErrors({ ...errors, location: "" });
                }}
                disabled={!selectedState}
                className={`w-full h-[46px] px-3 py-3 border rounded-[8px] font-inter-tight text-[13px] text-black appearance-none outline-none transition-colors bg-white disabled:bg-[#F5F5F5] disabled:cursor-not-allowed ${
                  errors.location ? "border-red-500" : "border-[#E1E4EA]"
                }`}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor =
                    ROLE_COLORS.recruiter.primary)
                }
                onBlur={(e) => (e.currentTarget.style.borderColor = "")}
              >
                <option value="" disabled className="text-[#99A0AE]">
                  {selectedState ? "Select" : "Select state first"}
                </option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.2826 6.2209C11.3525 6.29058 11.4079 6.37338 11.4458 6.46454C11.4837 6.5557 11.5031 6.65344 11.5031 6.75215C11.5031 6.85086 11.4837 6.9486 11.4458 7.03977C11.4079 7.13093 11.3525 7.21373 11.2826 7.2834L8.28255 10.2834C8.21287 10.3533 8.13008 10.4088 8.03892 10.4467C7.94775 10.4845 7.85001 10.504 7.7513 10.504C7.65259 10.504 7.55485 10.4845 7.46369 10.4467C7.37252 10.4088 7.28973 10.3533 7.22005 10.2834L4.22005 7.2834C4.07915 7.14251 4 6.95141 4 6.75215C4 6.5529 4.07915 6.3618 4.22005 6.2209C4.36095 6.08001 4.55204 6.00085 4.7513 6.00085C4.95056 6.00085 5.14165 6.08001 5.28255 6.2209L7.75193 8.68903L10.2213 6.21903C10.2911 6.14942 10.3739 6.09425 10.465 6.05666C10.5561 6.01908 10.6538 5.99983 10.7523 6C10.8509 6.00018 10.9484 6.01977 11.0394 6.05768C11.1304 6.09558 11.213 6.15105 11.2826 6.2209Z"
                  fill="#B2B2B2"
                />
              </svg>
            </div>
          </div>
        </div>
        {errors.location && (
          <span
            data-error
            className="font-inter-tight text-[12px] text-red-500"
          >
            {errors.location}
          </span>
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        className="w-full h-[44px] bg-[#181B25] border border-[#181B25] rounded-full font-inter-tight text-[14px] font-normal text-white hover:bg-[#2a2d35] transition-colors"
      >
        Next
      </button>
    </div>
  );
}
