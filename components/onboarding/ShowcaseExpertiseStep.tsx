"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MentorExpertiseData } from "@/lib/types/onboarding";
import { ResponsiveFormField } from "@/components/forms/ResponsiveFormField";

export const ShowcaseExpertiseStep = ({
  onNext,
  onBack,
  isLoading,
}: {
  onNext: (data: MentorExpertiseData) => void;
  onBack: () => void;
  isLoading?: boolean;
}) => {
  const [formData, setFormData] = useState<MentorExpertiseData>({
    expertise: "",
    experience: "",
    mentorshipStyle: "",
    linkedIn: "",
  });

  const [errors, setErrors] = useState<{
    expertise?: string;
    experience?: string;
  }>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};

    if (!String(formData.expertise).trim()) {
      newErrors.expertise = "Area of expertise is required";
    }

    if (!formData.experience.trim()) {
      newErrors.experience = "Years of experience is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onNext(formData);
  };

  return (
    <div className="relative h-full flex flex-col">
      <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 flex-shrink-0 bg-white">
        <img
          src="/logo.png"
          alt="TalentNG Logo"
          className="w-16 h-auto rounded-[3.457px]"
        />

        {/* Buttons */}
        <div className="flex items-center gap-3">
          {/* Back Button */}
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 bg-[#A9A9A9] text-white rounded-[60px] text-sm font-medium font-[Inter_Tight] hover:bg-[#999] transition-colors h-10 md:px-5 md:py-2 md:text-sm md:h-11"
          >
            Back
          </button>

          {/* Complete Button - Desktop/Tablet Only */}
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="hidden md:flex px-4 py-2 bg-[#222] text-white rounded-[60px] text-sm font-medium font-[Inter_Tight] hover:bg-[#333] transition-colors h-10 md:px-5 md:py-2 md:text-sm md:h-11 items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Complete"
            )}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-0 flex-1 overflow-hidden">
        <div className="flex flex-col justify-start p-6 md:p-10 md:pr-6 md:pl-12 bg-white overflow-y-auto scrollbar-hidden">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-1 flex-shrink-0">
              <p className="text-[13px] text-[#919191] font-light font-[Inter_Tight] leading-[120%] capitalize">
                Step 3/3
              </p>
              <h2 className="text-[22px] text-black font-medium font-[Inter_Tight] leading-[105%]">
                Share your Expertise
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-[13px]">
              <div className="flex flex-col gap-[13px]">
                <label className="text-[15px] font-normal text-black font-[Inter_Tight]">
                  Area of Expertise <span className="text-red-500">*</span>
                </label>
                <Input
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleChange}
                  placeholder="e.g., Software Engineering, Product Design"
                  className={`h-[53px] rounded-[10px] border-0 bg-[#F5F5F5] placeholder:text-[#99A0AE] text-[15px] font-[Inter_Tight] px-[15px] ${
                    errors.expertise ? "ring-2 ring-red-500" : ""
                  }`}
                />
                {errors.expertise && (
                  <span className="text-xs text-red-600">
                    {errors.expertise}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-[13px]">
                <label className="text-[15px] font-normal text-black font-[Inter_Tight]">
                  Years of Experience <span className="text-red-500">*</span>
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className={`h-[53px] rounded-[10px] border-0 bg-[#F5F5F5] px-[15px] text-[15px] font-[Inter_Tight] text-black focus:ring-2 focus:ring-purple-600 focus:outline-none ${
                    errors.experience ? "ring-2 ring-red-500" : ""
                  }`}
                >
                  <option value="">Select Years</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
                {errors.experience && (
                  <span className="text-xs text-red-600">
                    {errors.experience}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-[13px]">
                <label className="text-[15px] font-normal text-black font-[Inter_Tight]">
                  LinkedIn Profile
                </label>
                <Input
                  name="linkedIn"
                  value={formData.linkedIn}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="h-[53px] rounded-[10px] border-0 bg-[#F5F5F5] placeholder:text-[#99A0AE] text-[15px] font-[Inter_Tight] px-[15px]"
                />
              </div>
              <div className="flex flex-col gap-[13px]">
                <label className="text-[15px] font-normal text-black font-[Inter_Tight]">
                  Mentorship Style
                </label>
                <textarea
                  name="mentorshipStyle"
                  value={formData.mentorshipStyle}
                  onChange={handleChange}
                  placeholder="Describe how you like to mentor others."
                  rows={4}
                  className="rounded-[10px] border-0 bg-[#F5F5F5] placeholder:text-[#99A0AE] text-[15px] font-[Inter_Tight] px-[15px] py-[21px] resize-none focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>
            </form>

            {/* Complete Button - Mobile Only */}
            <div className="flex justify-center pt-6 md:hidden">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-8 py-2 bg-[#222] text-white rounded-[60px] text-sm font-medium font-[Inter_Tight] hover:bg-[#333] transition-colors h-11 w-full flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Complete"
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="hidden md:flex flex-col items-center justify-center p-6 md:p-10 md:pl-6 bg-white h-full">
          {/* Placeholder for mentor profile preview */}
          <div className="text-center text-gray-400">
            Mentor Profile Preview
          </div>
        </div>
      </div>
    </div>
  );
};
