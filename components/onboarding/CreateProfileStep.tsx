"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { ProfileData } from "@/lib/types/onboarding";

export const CreateProfileStep = ({
  onNext,
  onBack,
}: {
  onNext: (data: ProfileData) => void;
  onBack: () => void;
}) => {
  const [formData, setFormData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    username: "",
    location: "",
    bio: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  const displayName =
    formData.firstName && formData.lastName
      ? `${formData.firstName} ${formData.lastName}`
      : "Your Name";
  const displayBio = formData.bio || "Your Bio";

  return (
    <div className="relative h-full flex flex-col">
      {/* Top Bar with Logo and Buttons */}
      <div className="flex items-center justify-between px-4 md:px-6 py-4 md:py-6 flex-shrink-0 bg-white">
        {/* Logo */}
        <img
          src="/logo.png"
          alt="TalentNG Logo"
          className="w-16 h-auto rounded-[3.457px] shadow-[0.777px_0.777px_24.66px_0_rgba(0,0,0,0.25)]"
        />

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-[25px] py-[11px] bg-[#A9A9A9] text-white rounded-[60px] text-[15px] font-medium font-[Inter_Tight] hover:bg-[#999] transition-colors h-[53px]"
          >
            Back
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-[25px] py-[11px] bg-[#222] text-white rounded-[60px] text-[15px] font-medium font-[Inter_Tight] hover:bg-[#333] transition-colors h-[53px]"
          >
            Continue
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 flex-1 overflow-hidden border">
        {/* Left side - Form */}
        <div className="flex flex-col justify-start p-6 md:p-10 md:pr-6 bg-white overflow-y-auto scrollbar-hidden">
          <div className="flex flex-col gap-8 min-h-min">
            {/* Header */}
            <div className="flex flex-col gap-3 flex-shrink-0">
              <p className="text-[17px] text-[#919191] font-light font-[Inter_Tight] leading-[120%] capitalize">
                Step 2/3
              </p>
              <h2 className="text-[30px] text-black font-medium font-[Inter_Tight] leading-[105%]">
                Create your profile
              </h2>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-[13px]">
              {/* First Name */}
              <div className="flex flex-col gap-[13px]">
                <label className="text-[15px] font-normal text-black font-[Inter_Tight]">
                  First Name
                </label>
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Youremail@gmail.com"
                  className="h-[53px] rounded-[10px] border-0 bg-[#F5F5F5] placeholder:text-[#99A0AE] text-[15px] font-[Inter_Tight] px-[15px]"
                />
              </div>

              {/* Last Name */}
              <div className="flex flex-col gap-[13px]">
                <label className="text-[15px] font-normal text-black font-[Inter_Tight]">
                  Last Name
                </label>
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Youremail@gmail.com"
                  className="h-[53px] rounded-[10px] border-0 bg-[#F5F5F5] placeholder:text-[#99A0AE] text-[15px] font-[Inter_Tight] px-[15px]"
                />
              </div>

              {/* Username */}
              <div className="flex flex-col gap-[13px]">
                <label className="text-[15px] font-normal text-black font-[Inter_Tight]">
                  Username
                </label>
                <Input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Your Username"
                  className="h-[53px] rounded-[10px] border-0 bg-[#F5F5F5] placeholder:text-[#99A0AE] text-[15px] font-[Inter_Tight] px-[15px]"
                />
              </div>

              {/* Location */}
              <div className="flex flex-col gap-[13px]">
                <label className="text-[15px] font-normal text-black font-[Inter_Tight]">
                  Location
                </label>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Youremail@gmail.com"
                  className="h-[53px] rounded-[10px] border-0 bg-[#F5F5F5] placeholder:text-[#99A0AE] text-[15px] font-[Inter_Tight] px-[15px]"
                />
              </div>

              {/* Bio */}
              <div className="flex flex-col gap-[13px]">
                <label className="text-[15px] font-normal text-black font-[Inter_Tight]">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Desribe yourself"
                  rows={4}
                  className="rounded-[10px] border-0 bg-[#F5F5F5] placeholder:text-[#99A0AE] text-[15px] font-[Inter_Tight] px-[15px] py-[21px] resize-none focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Right side - Profile Preview */}
        <div className="hidden md:flex flex-col items-center justify-center p-6 md:p-10 md:pl-6 bg-white relative overflow-hidden">
          <div className="w-full h-full flex items-center justify-center">
            <div
              className="relative w-full max-w-[280px] lg:max-w-[350px]"
              style={{ aspectRatio: "1 / 1.13" }}
            >
              {/* Decorative Star */}
              <svg
                className="absolute left-0 top-8 w-20 h-20 lg:w-32 lg:h-32 z-0"
                viewBox="0 0 131 131"
                fill="none"
              >
                <path
                  d="M65.3129 0L75.4732 55.1526L130.626 65.3129L75.4732 75.4732L65.3129 130.626L55.1526 75.4732L0 65.3129L55.1526 55.1526L65.3129 0Z"
                  fill="#F6BC3F"
                />
              </svg>

              {/* Background Cards */}
              <div className="relative z-10 w-full h-full">
                <div className="absolute rounded-[58px] bg-[#ECECEC] w-4/5 h-1/12 left-1/4 bottom-12"></div>
                <div className="absolute rounded-[58px] bg-[#E0E0E0] w-11/12 h-1/10 left-0 bottom-8"></div>

                {/* Main Green Card (Back Layer) */}
                <div className="w-full h-full rounded-[30px] bg-[#008B47] shadow-[2.563px_0_30.756px_rgba(0,0,0,0.25)] absolute top-0 left-0 overflow-hidden flex flex-col">
                  {/* Striped Pattern */}
                  <div className="absolute left-[-19px] top-1/2 w-96 h-56 flex gap-[23px] rotate-[20.779deg]">
                    {Array.from({ length: 18 }).map((_, i) => (
                      <div key={i} className="w-[11.663px] h-56 bg-[#03964E]" />
                    ))}
                  </div>

                  {/* Profile Image Placeholder */}
                  <div className="w-full h-1/4 bg-[#DCDCDC]"></div>

                  {/* Status Badge */}
                  <div className="absolute bottom-8 right-8 text-white text-sm lg:text-base font-normal font-[Inter_Tight] leading-[120%] capitalize">
                    Status: Available
                  </div>

                  {/* Name and Bio */}
                  <div className="absolute bottom-12 left-4 flex flex-col gap-2 text-white">
                    <div className="text-base lg:text-xl font-medium font-[Inter_Tight] leading-[105%]">
                      {displayName}
                    </div>
                    <div className="text-xs lg:text-sm font-light font-[Inter_Tight] leading-[120%] capitalize">
                      {displayBio}
                    </div>
                  </div>
                </div>

                {/* Front White Card */}
                <div className="w-full h-full rounded-[30px] bg-white relative z-20 flex flex-col">
                  {/* Profile Picture Area */}
                  <div className="flex-1 flex flex-col items-center justify-center rounded-[27px] bg-[#F5F5F5] m-1">
                    {/* Upload Icon */}
                    <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-[#D9D9D9] flex items-center justify-center mb-3">
                      <svg
                        className="w-8 h-8 lg:w-10 lg:h-10"
                        viewBox="0 0 74 74"
                        fill="none"
                      >
                        <path
                          d="M15.4167 64.75C13.7208 64.75 12.2696 64.1467 11.063 62.9401C9.85639 61.7335 9.25206 60.2812 9.25 58.5833V15.4167C9.25 13.7208 9.85433 12.2696 11.063 11.063C12.2717 9.85639 13.7229 9.25206 15.4167 9.25H58.5833C60.2792 9.25 61.7314 9.85433 62.9401 11.063C64.1487 12.2717 64.7521 13.7229 64.75 15.4167V58.5833C64.75 60.2792 64.1467 61.7314 62.9401 62.9401C61.7335 64.1487 60.2812 64.7521 58.5833 64.75H15.4167ZM18.5 52.4167H55.5L43.9375 37L34.6875 49.3333L27.75 40.0833L18.5 52.4167Z"
                          fill="white"
                        />
                      </svg>
                    </div>

                    {/* Upload Text */}
                    <div className="flex flex-col items-center gap-1 text-center px-2">
                      <div className="text-[#404040] text-xs lg:text-sm font-medium font-[Inter_Tight] leading-[105%]">
                        Upload Profile Picture
                      </div>
                      <div className="text-[#919191] text-[10px] lg:text-xs font-light font-[Inter_Tight] leading-[120%] capitalize">
                        Drag And Drop Image here
                      </div>
                    </div>
                  </div>

                  {/* Name and Bio Preview */}
                  <div className="flex flex-col gap-1 p-3 lg:p-4">
                    <div className="text-black text-sm lg:text-base font-medium font-[Inter_Tight] leading-[105%]">
                      {displayName}
                    </div>
                    <div className="text-[#919191] text-xs lg:text-sm font-light font-[Inter_Tight] leading-[120%] capitalize">
                      {displayBio}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
