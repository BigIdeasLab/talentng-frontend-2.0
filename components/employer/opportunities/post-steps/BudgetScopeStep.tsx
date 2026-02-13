"use client";

import { useState } from "react";
import { ROLE_COLORS } from "@/lib/theme/role-colors";

interface BudgetScopeStepProps {
  formData: {
    paymentType: "weekly" | "monthly" | "hourly" | "";
    priceMode: "range" | "fixed";
    minBudget: string;
    maxBudget: string;
    price: string;
    duration: string;
    startDate: string;
    experienceLevel: string;
  };
  updateFormData: (data: Partial<BudgetScopeStepProps["formData"]>) => void;
  onSubmit: () => void;
  onNext?: () => void;
}

interface ValidationErrors {
  [key: string]: string;
}

export function BudgetScopeStep({
  formData,
  updateFormData,
  onSubmit,
  onNext,
}: BudgetScopeStepProps) {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [selectedPayment, setSelectedPayment] = useState<
    "weekly" | "monthly" | "hourly" | ""
  >(formData.paymentType);
  const [selectedPriceMode, setSelectedPriceMode] = useState<"range" | "fixed">(
    formData.priceMode,
  );

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!selectedPayment) {
      newErrors.paymentType = "Payment type is required";
    }

    if (formData.priceMode === "range") {
      const minBudgetNum = parseInt(
        formData.minBudget?.replace(/,/g, "") || "0",
      );
      const maxBudgetNum = parseInt(
        formData.maxBudget?.replace(/,/g, "") || "0",
      );

      if (!formData.minBudget || minBudgetNum === 0) {
        newErrors.minBudget = "Minimum budget is required";
      }
      if (!formData.maxBudget || maxBudgetNum === 0) {
        newErrors.maxBudget = "Maximum budget is required";
      }
      if (minBudgetNum > 0 && maxBudgetNum > 0 && minBudgetNum > maxBudgetNum) {
        newErrors.maxBudget =
          "Maximum budget must be greater than or equal to minimum budget";
      }
    } else if (formData.priceMode === "fixed") {
      const priceNum = parseInt(formData.price?.replace(/,/g, "") || "0");
      if (!formData.price || priceNum === 0) {
        newErrors.price = "Price is required";
      }
    }

    if (!formData.duration) {
      newErrors.duration = "Duration is required";
    }
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }
    if (!formData.experienceLevel) {
      newErrors.experienceLevel = "Experience level is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const scrollToFirstError = () => {
    setTimeout(() => {
      const firstError = document.querySelector("[data-error]");
      if (firstError)
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit();
    } else {
      scrollToFirstError();
    }
  };

  const handlePaymentTypeSelect = (type: "weekly" | "monthly" | "hourly") => {
    setSelectedPayment(type);
    updateFormData({ paymentType: type });
  };

  const handlePriceModeSelect = (mode: "range" | "fixed") => {
    setSelectedPriceMode(mode);

    // Clear unused fields based on selected mode
    if (mode === "fixed") {
      updateFormData({ priceMode: mode, minBudget: "", maxBudget: "" });
    } else {
      updateFormData({ priceMode: mode, price: "" });
    }

    // Clear pricing errors when switching modes
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.minBudget;
      delete newErrors.maxBudget;
      delete newErrors.price;
      return newErrors;
    });
  };

  const formatNumberWithCommas = (value: string): string => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "");
    // Add commas every 3 digits from the right
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter
    const allowedKeys = ["Backspace", "Delete", "Tab", "Escape", "Enter"];
    if (allowedKeys.includes(e.key)) {
      return;
    }

    // Block anything that's not a number
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleBudgetChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "minBudget" | "maxBudget" | "price",
  ) => {
    const value = e.target.value;

    // Extract only digits (removes any letters or special characters)
    const digitsOnly = value.replace(/\D/g, "");

    const formatted = formatNumberWithCommas(digitsOnly);

    // Real-time validation for range mode
    if (
      selectedPriceMode === "range" &&
      (field === "minBudget" || field === "maxBudget")
    ) {
      // Get the actual values that will be compared
      const newMinBudget =
        field === "minBudget" ? formatted : formData.minBudget;
      const newMaxBudget =
        field === "maxBudget" ? formatted : formData.maxBudget;

      const minNum = parseInt(newMinBudget.replace(/,/g, "") || "0");
      const maxNum = parseInt(newMaxBudget.replace(/,/g, "") || "0");

      if (minNum > 0 && maxNum > 0 && minNum > maxNum) {
        setErrors((prev) => ({
          ...prev,
          maxBudget: "Max must be greater than or equal to min",
        }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.maxBudget;
          return newErrors;
        });
      }
    }

    // Clear price error when user types in price field
    if (field === "price" && errors.price) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.price;
        return newErrors;
      });
    }

    updateFormData({ [field]: formatted });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Section Title */}
      <h2 className="font-inter-tight text-[17px] font-medium text-black">
        Opportunity Budget & Scope
      </h2>

      {/* Form Fields */}
      <div className="flex flex-col gap-4">
        {/* Payment Type */}
        <div className="flex flex-col gap-3">
          <label className="font-inter-tight text-[13px] font-normal text-black">
            How do you want to pay talents
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handlePaymentTypeSelect("weekly")}
              className={`flex items-center justify-center px-3 py-3 border rounded-[8px] font-inter-tight text-[13px] transition-colors ${
                selectedPayment === "weekly"
                  ? "text-black"
                  : "border-[#E1E4EA] text-[#99A0AE] hover:opacity-80"
              }`}
              style={
                selectedPayment === "weekly"
                  ? {
                      borderColor: ROLE_COLORS.recruiter.primary,
                      backgroundColor: `${ROLE_COLORS.recruiter.primary}0D`,
                    }
                  : undefined
              }
            >
              Weekly
            </button>
            <button
              type="button"
              onClick={() => handlePaymentTypeSelect("monthly")}
              className={`flex items-center justify-center px-3 py-3 border rounded-[8px] font-inter-tight text-[13px] transition-colors ${
                selectedPayment === "monthly"
                  ? "text-black"
                  : "border-[#E1E4EA] text-[#99A0AE] hover:opacity-80"
              }`}
              style={
                selectedPayment === "monthly"
                  ? {
                      borderColor: ROLE_COLORS.recruiter.primary,
                      backgroundColor: `${ROLE_COLORS.recruiter.primary}0D`,
                    }
                  : undefined
              }
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => handlePaymentTypeSelect("hourly")}
              className={`flex items-center justify-center px-3 py-3 border rounded-[8px] font-inter-tight text-[13px] transition-colors ${
                selectedPayment === "hourly"
                  ? "text-black"
                  : "border-[#E1E4EA] text-[#99A0AE] hover:opacity-80"
              }`}
              style={
                selectedPayment === "hourly"
                  ? {
                      borderColor: ROLE_COLORS.recruiter.primary,
                      backgroundColor: `${ROLE_COLORS.recruiter.primary}0D`,
                    }
                  : undefined
              }
            >
              Hourly
            </button>
          </div>
          {errors.paymentType && (
            <span
              data-error
              className="font-inter-tight text-[12px] text-red-500"
            >
              {errors.paymentType}
            </span>
          )}
        </div>

        {/* Pricing */}
        <div className="flex flex-col gap-3">
          <label className="font-inter-tight text-[13px] font-normal text-black">
            Pricing
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handlePriceModeSelect("range")}
              className={`flex items-center justify-center px-3 py-3 border rounded-[8px] font-inter-tight text-[13px] transition-colors ${
                selectedPriceMode === "range"
                  ? "text-black"
                  : "border-[#E1E4EA] text-[#99A0AE] hover:opacity-80"
              }`}
              style={
                selectedPriceMode === "range"
                  ? {
                      borderColor: ROLE_COLORS.recruiter.primary,
                      backgroundColor: `${ROLE_COLORS.recruiter.primary}0D`,
                    }
                  : undefined
              }
            >
              Range (Min - Max)
            </button>
            <button
              type="button"
              onClick={() => handlePriceModeSelect("fixed")}
              className={`flex items-center justify-center px-3 py-3 border rounded-[8px] font-inter-tight text-[13px] transition-colors ${
                selectedPriceMode === "fixed"
                  ? "text-black"
                  : "border-[#E1E4EA] text-[#99A0AE] hover:opacity-80"
              }`}
              style={
                selectedPriceMode === "fixed"
                  ? {
                      borderColor: ROLE_COLORS.recruiter.primary,
                      backgroundColor: `${ROLE_COLORS.recruiter.primary}0D`,
                    }
                  : undefined
              }
            >
              Fixed Price
            </button>
          </div>

          {(errors.minBudget || errors.maxBudget || errors.price) && (
            <span
              data-error
              className="font-inter-tight text-[12px] text-red-500"
            >
              {errors.minBudget || errors.maxBudget || errors.price}
            </span>
          )}

          {selectedPriceMode === "range" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-black font-medium pointer-events-none">
                  ₦
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Min Budget"
                  value={formData.minBudget || ""}
                  onChange={(e) => {
                    handleBudgetChange(e, "minBudget");
                    if (errors.minBudget)
                      setErrors({ ...errors, minBudget: "" });
                  }}
                  onKeyDown={handleKeyDown}
                  disabled={!selectedPriceMode}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor =
                      ROLE_COLORS.recruiter.primary)
                  }
                  onBlur={(e) => (e.currentTarget.style.borderColor = "")}
                  className={`w-full pl-6 pr-3 py-3 border rounded-[8px] font-inter-tight text-[13px] text-black placeholder:text-[#99A0AE] outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed ${
                    errors.minBudget ? "border-red-500" : "border-[#E1E4EA]"
                  }`}
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-black font-medium pointer-events-none">
                  ₦
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Max Budget"
                  value={formData.maxBudget || ""}
                  onChange={(e) => {
                    handleBudgetChange(e, "maxBudget");
                    if (errors.maxBudget)
                      setErrors({ ...errors, maxBudget: "" });
                  }}
                  onKeyDown={handleKeyDown}
                  disabled={!selectedPriceMode}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor =
                      ROLE_COLORS.recruiter.primary)
                  }
                  onBlur={(e) => (e.currentTarget.style.borderColor = "")}
                  className={`w-full pl-6 pr-3 py-3 border rounded-[8px] font-inter-tight text-[13px] text-black placeholder:text-[#99A0AE] outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed ${
                    errors.maxBudget ? "border-red-500" : "border-[#E1E4EA]"
                  }`}
                />
              </div>
            </div>
          ) : (
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-black font-medium pointer-events-none">
                ₦
              </span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Price"
                value={formData.price || ""}
                onChange={(e) => handleBudgetChange(e, "price")}
                onKeyDown={handleKeyDown}
                disabled={!selectedPriceMode}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor =
                    ROLE_COLORS.recruiter.primary)
                }
                onBlur={(e) => (e.currentTarget.style.borderColor = "")}
                className={`w-full pl-6 pr-3 py-3 border rounded-[8px] font-inter-tight text-[13px] text-black placeholder:text-[#99A0AE] outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed ${
                  errors.price ? "border-red-500" : "border-[#E1E4EA]"
                }`}
              />
            </div>
          )}
        </div>

        {/* Duration */}
        <div className="flex flex-col gap-2.5">
          <label className="font-inter-tight text-[13px] font-normal text-black">
            Duration
          </label>
          {errors.duration && (
            <span
              data-error
              className="font-inter-tight text-[12px] text-red-500"
            >
              {errors.duration}
            </span>
          )}
          <div className="relative">
            <select
              value={formData.duration}
              onChange={(e) => {
                updateFormData({ duration: e.target.value });
                if (errors.duration) setErrors({ ...errors, duration: "" });
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor =
                  ROLE_COLORS.recruiter.primary)
              }
              onBlur={(e) => (e.currentTarget.style.borderColor = "")}
              className="w-full h-[46px] px-3 py-3 border border-[#E1E4EA] rounded-[8px] font-inter-tight text-[13px] text-black appearance-none outline-none transition-colors bg-white"
            >
              <option value="" disabled className="text-[#99A0AE]">
                Select Duration
              </option>
              <option value="1-week">1 Week</option>
              <option value="2-weeks">2 Weeks</option>
              <option value="1-month">1 Month</option>
              <option value="3-months">3 Months</option>
              <option value="6-months">6 Months</option>
              <option value="1-year">1 Year</option>
              <option value="ongoing">Ongoing</option>
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

        {/* Start Date */}
        <div className="flex flex-col gap-2.5">
          <label className="font-inter-tight text-[13px] font-normal text-black">
            Start date
          </label>
          {errors.startDate && (
            <span
              data-error
              className="font-inter-tight text-[12px] text-red-500"
            >
              {errors.startDate}
            </span>
          )}
          <div className="relative">
            <input
              type="date"
              placeholder="MM / DD / YYYY"
              value={formData.startDate}
              onChange={(e) => {
                updateFormData({ startDate: e.target.value });
                if (errors.startDate) setErrors({ ...errors, startDate: "" });
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor =
                  ROLE_COLORS.recruiter.primary)
              }
              onBlur={(e) => (e.currentTarget.style.borderColor = "")}
              className="w-full h-[46px] px-3 py-3 border border-[#E1E4EA] rounded-[8px] font-inter-tight text-[13px] text-black placeholder:text-[#99A0AE] outline-none transition-colors"
            />
          </div>
        </div>

        {/* Experience Level */}
        <div className="flex flex-col gap-2.5">
          <label className="font-inter-tight text-[13px] font-normal text-black">
            Experience Level
          </label>
          {errors.experienceLevel && (
            <span
              data-error
              className="font-inter-tight text-[12px] text-red-500"
            >
              {errors.experienceLevel}
            </span>
          )}
          <div className="relative">
            <select
              value={formData.experienceLevel}
              onChange={(e) => {
                updateFormData({ experienceLevel: e.target.value });
                if (errors.experienceLevel)
                  setErrors({ ...errors, experienceLevel: "" });
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor =
                  ROLE_COLORS.recruiter.primary)
              }
              onBlur={(e) => (e.currentTarget.style.borderColor = "")}
              className="w-full h-[46px] px-3 py-3 border border-[#E1E4EA] rounded-[8px] font-inter-tight text-[13px] text-black appearance-none outline-none transition-colors bg-white"
            >
              <option value="" disabled className="text-[#99A0AE]">
                Select
              </option>
              <option value="Entry">Entry Level</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Senior">Senior</option>
              <option value="Expert">Expert</option>
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

      {/* Submit Button */}
      <button
        onClick={() => {
          if (validateForm()) {
            onNext?.();
          } else {
            scrollToFirstError();
          }
        }}
        className="w-full h-[44px] bg-[#181B25] border border-[#181B25] rounded-full font-inter-tight text-[14px] font-normal text-white hover:bg-[#2a2d35] transition-colors"
      >
        Next
      </button>
    </div>
  );
}
