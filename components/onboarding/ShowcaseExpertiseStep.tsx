"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MentorExpertiseData } from "@/lib/types/onboarding";

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <div className="relative h-full flex flex-col">
      <div className="flex items-center justify-between px-4 md:px-6 py-4 md:py-6 flex-shrink-0 bg-white">
        <img src="/logo.png" alt="TalentNG Logo" className="w-16 h-auto" />
        <div className="flex gap-3">
          <button type="button" onClick={onBack} className="px-[25px] py-[11px] bg-[#A9A9A9] text-white rounded-[60px] text-[15px] font-medium font-[Inter_Tight] hover:bg-[#999] transition-colors h-[53px]">Back</button>
          <button type="submit" onClick={handleSubmit} disabled={isLoading} className="px-[25px] py-[11px] bg-[#222] text-white rounded-[60px] text-[15px] font-medium font-[Inter_Tight] hover:bg-[#333] transition-colors h-[53px] disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center">
            {isLoading ? <Loader2 className="animate-spin" /> : "Continue"}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 flex-1 overflow-hidden">
        <div className="flex flex-col justify-start p-6 md:p-10 md:pr-6 bg-white overflow-y-auto scrollbar-hidden">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-[13px] flex-shrink-0">
              <p className="text-[17px] text-[#919191] font-light font-[Inter_Tight] leading-[120%] capitalize">Step 3/3</p>
              <h2 className="text-[30px] text-black font-medium font-[Inter_Tight] leading-[105%]">Share your Expertise</h2>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-[13px]">
              <div className="flex flex-col gap-[13px]">
                <label className="text-[15px] font-normal text-black font-[Inter_Tight]">Area of Expertise</label>
                <Input name="expertise" value={formData.expertise} onChange={handleChange} placeholder="e.g., Software Engineering, Product Design" className="h-[53px] rounded-[10px] border-0 bg-[#F5F5F5] placeholder:text-[#99A0AE] text-[15px] font-[Inter_Tight] px-[15px]" />
              </div>
              <div className="flex flex-col gap-[13px]">
                <label className="text-[15px] font-normal text-black font-[Inter_Tight]">Years of Experience</label>
                <select name="experience" value={formData.experience} onChange={handleChange} className="h-[53px] rounded-[10px] border-0 bg-[#F5F5F5] px-[15px] text-[15px] font-[Inter_Tight] text-black focus:ring-2 focus:ring-purple-600 focus:outline-none">
                  <option value="">Select Years</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>
              <div className="flex flex-col gap-[13px]">
                <label className="text-[15px] font-normal text-black font-[Inter_Tight]">LinkedIn Profile</label>
                <Input name="linkedIn" value={formData.linkedIn} onChange={handleChange} placeholder="https://linkedin.com/in/yourprofile" className="h-[53px] rounded-[10px] border-0 bg-[#F5F5F5] placeholder:text-[#99A0AE] text-[15px] font-[Inter_Tight] px-[15px]" />
              </div>
              <div className="flex flex-col gap-[13px]">
                <label className="text-[15px] font-normal text-black font-[Inter_Tight]">Mentorship Style</label>
                <textarea name="mentorshipStyle" value={formData.mentorshipStyle} onChange={handleChange} placeholder="Describe how you like to mentor others." rows={4} className="rounded-[10px] border-0 bg-[#F5F5F5] placeholder:text-[#99A0AE] text-[15px] font-[Inter_Tight] px-[15px] py-[21px] resize-none focus:ring-2 focus:ring-purple-600 focus:outline-none" />
              </div>
            </form>
          </div>
        </div>
        <div className="hidden md:flex flex-col items-center justify-center p-6 md:p-10 md:pl-6 bg-white">
          {/* Placeholder for mentor profile preview */}
          <div className="text-center text-gray-400">Mentor Profile Preview</div>
        </div>
      </div>
    </div>
  );
};
