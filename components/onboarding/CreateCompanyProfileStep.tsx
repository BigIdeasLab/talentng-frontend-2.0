"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CompanyProfileData } from "@/lib/types/onboarding";

export const CreateCompanyProfileStep = ({
  onNext,
  onBack,
  isLoading,
}: {
  onNext: (data: CompanyProfileData) => void;
  onBack: () => void;
  isLoading?: boolean;
}) => {
  const [formData, setFormData] = useState<CompanyProfileData>({
    companyName: "",
    industry: "",
    username: "",
    location: "",
    bio: "",
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
      <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 flex-shrink-0 bg-white">
        <img src="/logo.png" alt="TalentNG Logo" className="w-16 h-auto rounded-[3.457px] shadow-[0.777px_0.777px_24.66px_0_rgba(0,0,0,0.25)]" />
        <div className="flex gap-3">
          <button type="button" onClick={onBack} className="px-5 py-2 bg-[#A9A9A9] text-white rounded-[60px] text-sm font-medium font-[Inter_Tight] hover:bg-[#999] transition-colors h-11">Back</button>
          <button type="submit" onClick={handleSubmit} disabled={isLoading} className="px-5 py-2 bg-[#222] text-white rounded-[60px] text-sm font-medium font-[Inter_Tight] hover:bg-[#333] transition-colors h-11 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center">
            {isLoading ? <Loader2 className="animate-spin" /> : "Continue"}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-0 flex-1 overflow-hidden">
        <div className="flex flex-col justify-start p-6 md:p-10 md:pr-6 md:pl-12 bg-white overflow-y-auto scrollbar-hidden">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-1 flex-shrink-0">
              <p className="text-[13px] text-[#919191] font-light font-[Inter_Tight] leading-[120%] capitalize">Step 3/3</p>
              <h2 className="text-[22px] text-black font-medium font-[Inter_Tight] leading-[105%]">Tell us about your company</h2>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-[13px]">
              <div className="flex flex-col gap-[13px]">
                <label className="text-[15px] font-normal text-black font-[Inter_Tight]">Company Name</label>
                <Input name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Your Company Name" className="h-[53px] rounded-[10px] border-0 bg-[#F5F5F5] placeholder:text-[#99A0AE] text-[15px] font-[Inter_Tight] px-[15px]" />
              </div>
              <div className="flex flex-col gap-[13px]">
                 <label className="text-[15px] font-normal text-black font-[Inter_Tight]">Username</label>
                 <Input name="username" value={formData.username} onChange={handleChange} placeholder="your.username" className="h-[53px] rounded-[10px] border-0 bg-[#F5F5F5] placeholder:text-[#99A0AE] text-[15px] font-[Inter_Tight] px-[15px]" />
               </div>
               <div className="flex flex-col gap-[13px]">
                 <label className="text-[15px] font-normal text-black font-[Inter_Tight]">Industry</label>
                 <Input name="industry" value={formData.industry} onChange={handleChange} placeholder="e.g., Technology, Finance" className="h-[53px] rounded-[10px] border-0 bg-[#F5F5F5] placeholder:text-[#99A0AE] text-[15px] font-[Inter_Tight] px-[15px]" />
               </div>
               <div className="flex flex-col gap-[13px]">
                 <label className="text-[15px] font-normal text-black font-[Inter_Tight]">Location</label>
                 <Input name="location" value={formData.location} onChange={handleChange} placeholder="City, Country" className="h-[53px] rounded-[10px] border-0 bg-[#F5F5F5] placeholder:text-[#99A0AE] text-[15px] font-[Inter_Tight] px-[15px]" />
               </div>
               <div className="flex flex-col gap-[13px]">
                 <label className="text-[15px] font-normal text-black font-[Inter_Tight]">Company Bio</label>
                 <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="What does your company do?" rows={4} className="rounded-[10px] border-0 bg-[#F5F5F5] placeholder:text-[#99A0AE] text-[15px] font-[Inter_Tight] px-[15px] py-[21px] resize-none focus:ring-2 focus:ring-purple-600 focus:outline-none" />
               </div>
            </form>
          </div>
        </div>
        <div className="hidden md:flex flex-col items-center justify-center p-6 md:p-10 md:pl-6 bg-white h-full">
          {/* Placeholder for company profile preview */}
          <div className="text-center text-gray-400">Company Profile Preview</div>
        </div>
      </div>
    </div>
  );
};
