"use client";

import { useState } from "react";

interface BudgetScopeStepProps {
  formData: {
    paymentType: "weekly" | "monthly" | "hourly" | "";
    minBudget: string;
    maxBudget: string;
    maxHours: string;
    duration: string;
    startDate: string;
    experienceLevel: string;
  };
  updateFormData: (data: Partial<BudgetScopeStepProps["formData"]>) => void;
  onSubmit: () => void;
}

export function BudgetScopeStep({
  formData,
  updateFormData,
  onSubmit,
}: BudgetScopeStepProps) {
  const [selectedPayment, setSelectedPayment] = useState<
    "weekly" | "monthly" | "hourly" | ""
  >(formData.paymentType);

  const handlePaymentTypeSelect = (
    type: "weekly" | "monthly" | "hourly"
  ) => {
    setSelectedPayment(type);
    updateFormData({ paymentType: type });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Section Title */}
      <h2 className="font-inter-tight text-[20px] font-medium text-black">
        Opportunity Budget & Scope
      </h2>

      {/* Form Fields */}
      <div className="flex flex-col gap-5">
        {/* Payment Type */}
        <div className="flex flex-col gap-4">
          <label className="font-inter-tight text-[15px] font-normal text-black">
            How do you want to pay talents
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => handlePaymentTypeSelect("weekly")}
              className={`flex items-center justify-center px-4 py-4 border rounded-[10px] font-inter-tight text-[15px] transition-colors ${
                selectedPayment === "weekly"
                  ? "border-[#5C30FF] bg-[#5C30FF]/5 text-black"
                  : "border-[#E1E4EA] text-[#99A0AE] hover:border-[#5C30FF]/50"
              }`}
            >
              Weekly
            </button>
            <button
              type="button"
              onClick={() => handlePaymentTypeSelect("monthly")}
              className={`flex items-center justify-center px-4 py-4 border rounded-[10px] font-inter-tight text-[15px] transition-colors ${
                selectedPayment === "monthly"
                  ? "border-[#5C30FF] bg-[#5C30FF]/5 text-black"
                  : "border-[#E1E4EA] text-[#99A0AE] hover:border-[#5C30FF]/50"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => handlePaymentTypeSelect("hourly")}
              className={`flex items-center justify-center px-4 py-4 border rounded-[10px] font-inter-tight text-[15px] transition-colors ${
                selectedPayment === "hourly"
                  ? "border-[#5C30FF] bg-[#5C30FF]/5 text-black"
                  : "border-[#E1E4EA] text-[#99A0AE] hover:border-[#5C30FF]/50"
              }`}
            >
              Hourly
            </button>
          </div>
        </div>

        {/* Pricing */}
        <div className="flex flex-col gap-3">
          <label className="font-inter-tight text-[15px] font-normal text-black">
            Pricing
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <input
              type="text"
              placeholder="Min Budget:"
              value={formData.minBudget}
              onChange={(e) => updateFormData({ minBudget: e.target.value })}
              className="w-full px-4 py-4 border border-[#E1E4EA] rounded-[10px] font-inter-tight text-[15px] text-black placeholder:text-[#99A0AE] outline-none focus:border-[#5C30FF] transition-colors"
            />
            <input
              type="text"
              placeholder="Max Budget:"
              value={formData.maxBudget}
              onChange={(e) => updateFormData({ maxBudget: e.target.value })}
              className="w-full px-4 py-4 border border-[#E1E4EA] rounded-[10px] font-inter-tight text-[15px] text-black placeholder:text-[#99A0AE] outline-none focus:border-[#5C30FF] transition-colors"
            />
            <input
              type="text"
              placeholder="Max Hours:"
              value={formData.maxHours}
              onChange={(e) => updateFormData({ maxHours: e.target.value })}
              className="w-full px-4 py-4 border border-[#E1E4EA] rounded-[10px] font-inter-tight text-[15px] text-black placeholder:text-[#99A0AE] outline-none focus:border-[#5C30FF] transition-colors"
            />
          </div>
        </div>

        {/* Duration */}
        <div className="flex flex-col gap-3">
          <label className="font-inter-tight text-[15px] font-normal text-black">
            Duration
          </label>
          <div className="relative">
            <select
              value={formData.duration}
              onChange={(e) => updateFormData({ duration: e.target.value })}
              className="w-full h-[57px] px-4 py-4 border border-[#E1E4EA] rounded-[10px] font-inter-tight text-[15px] text-black appearance-none outline-none focus:border-[#5C30FF] transition-colors bg-white"
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
              className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
              width="16"
              height="16"
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
        <div className="flex flex-col gap-3">
          <label className="font-inter-tight text-[15px] font-normal text-black">
            Start date
          </label>
          <div className="relative">
            <input
              type="date"
              placeholder="MM / DD / YYYY"
              value={formData.startDate}
              onChange={(e) => updateFormData({ startDate: e.target.value })}
              className="w-full h-[57px] px-4 py-4 border border-[#E1E4EA] rounded-[10px] font-inter-tight text-[15px] text-black placeholder:text-[#99A0AE] outline-none focus:border-[#5C30FF] transition-colors"
            />
          </div>
        </div>

        {/* Experience Level */}
        <div className="flex flex-col gap-3">
          <label className="font-inter-tight text-[15px] font-normal text-black">
            Experience Level
          </label>
          <div className="relative">
            <select
              value={formData.experienceLevel}
              onChange={(e) =>
                updateFormData({ experienceLevel: e.target.value })
              }
              className="w-full h-[57px] px-4 py-4 border border-[#E1E4EA] rounded-[10px] font-inter-tight text-[15px] text-black appearance-none outline-none focus:border-[#5C30FF] transition-colors bg-white"
            >
              <option value="" disabled className="text-[#99A0AE]">
                Select
              </option>
              <option value="entry">Entry Level</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>
            <svg
              className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
              width="16"
              height="16"
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
        onClick={onSubmit}
        className="w-full h-[54px] bg-[#181B25] border border-[#181B25] rounded-full font-inter-tight text-[18px] font-normal text-white hover:bg-[#2a2d35] transition-colors"
      >
        Preview
      </button>
    </div>
  );
}
