"use client";

import React, { useState } from "react";
import { Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProfileData, SkillsData } from "@/lib/types/onboarding";

export const ShowcaseSkillsStep = ({
  onNext,
  onBack,
  profileData,
  isLoading,
}: {
  onNext: (data: SkillsData) => void;
  onBack: () => void;
  profileData?: ProfileData;
  isLoading?: boolean;
}) => {
  const [formData, setFormData] = useState<SkillsData>({
    category: "",
    skills: [],
    stack: [],
    portfolioLink: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [stackInput, setStackInput] = useState("");

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, category: e.target.value }));
  };

  const handlePortfolioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, portfolioLink: e.target.value }));
  };

  const removeSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const removeStack = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      stack: prev.stack.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  const displayName =
    profileData?.firstName && profileData?.lastName
      ? `${profileData.firstName} ${profileData.lastName}`
      : "Akanbi David";
  const displayCategory = formData.category || "Your Category";

  return (
    <div className="relative h-full flex flex-col">
      {/* Top Bar with Logo and Buttons */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 flex-shrink-0 bg-white">
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
            className="px-5 py-2 bg-[#A9A9A9] text-white rounded-[60px] text-sm font-medium font-[Inter_Tight] hover:bg-[#999] transition-colors h-11"
            disabled={isLoading}
          >
            Back
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-5 py-2 bg-[#222] text-white rounded-[60px] text-sm font-medium font-[Inter_Tight] hover:bg-[#333] transition-colors h-11 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Continue"
            )}
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-0 flex-1 overflow-hidden">
        {/* Left side - Form */}
        <div className="flex flex-col justify-start p-6 md:p-10 md:pr-6 md:pl-12 bg-white overflow-y-auto scrollbar-hidden">
          <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col gap-1 flex-shrink-0">
              <p className="text-[13px] text-[#919191] font-light font-[Inter_Tight] leading-[120%] capitalize">
                Step 3/3
              </p>
              <h2 className="text-[22px] text-black font-medium font-[Inter_Tight] leading-[105%]">
                Showcase what you do
              </h2>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-[13px]">
              {/* Category Dropdown */}
              <div className="flex flex-col gap-[13px]">
                <label className="text-[15px] font-normal text-black font-[Inter_Tight]">
                  What do you do?
                </label>
                <select
                  value={formData.category}
                  onChange={handleCategoryChange}
                  className="h-[53px] rounded-[10px] border-0 bg-[#F5F5F5] px-[15px] text-[15px] font-[Inter_Tight] text-[#99A0AE] focus:ring-2 focus:ring-purple-600 focus:outline-none"
                >
                  <option value="" className="text-black">
                    Select Category
                  </option>
                  <option value="product-designer" className="text-black">
                    Product Designer
                  </option>
                  <option value="ux-designer" className="text-black">
                    UX Designer
                  </option>
                  <option value="developer" className="text-black">
                    Developer
                  </option>
                  <option value="marketer" className="text-black">
                    Marketer
                  </option>
                </select>
              </div>

              {/* Skills */}
              <div className="flex flex-col gap-[13px]">
                <label className="text-[15px] font-normal text-black font-[Inter_Tight]">
                  Your Skills
                </label>
                <select
                  value={skillInput}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value && formData.skills.length < 5) {
                      setFormData((prev) => ({
                        ...prev,
                        skills: [...prev.skills, value],
                      }));
                      setSkillInput("");
                    }
                  }}
                  className="h-[53px] rounded-[10px] border-0 bg-[#F5F5F5] px-[15px] text-[15px] font-[Inter_Tight]  text-[#99A0AE] focus:ring-2 focus:ring-purple-600 focus:outline-none"
                >
                  <option value="" className="text-[#99A0AE]">
                    Choose Skills
                  </option>
                  <option value="UI Design" className="text-black">
                    UI Design
                  </option>
                  <option value="UX Design" className="text-black">
                    UX Design
                  </option>
                  <option value="Website Design" className="text-black">
                    Website Design
                  </option>
                  <option value="Interface Design" className="text-black">
                    Interface Design
                  </option>
                  <option value="Interaction Design" className="text-black">
                    Interaction Design
                  </option>
                  <option value="Presentation Design" className="text-black">
                    Presentation Design
                  </option>
                </select>
                {/* Selected Skills */}
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-[#F5F5F5] px-3 py-2 rounded-full text-sm font-[Inter_Tight]"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tech Stack */}
              <div className="flex flex-col gap-[13px]">
                <label className="text-[15px] font-normal  text-black font-[Inter_Tight]">
                  Your Stack
                </label>
                <select
                  value={stackInput}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value && formData.stack.length < 6) {
                      setFormData((prev) => ({
                        ...prev,
                        stack: [...prev.stack, value],
                      }));
                      setStackInput("");
                    }
                  }}
                  className="h-[53px] rounded-[10px] border-0 bg-[#F5F5F5] px-[15px] text-[15px] font-[Inter_Tight]  text-[#99A0AE] focus:ring-2 focus:ring-purple-600 focus:outline-none"
                >
                  <option value="" className="text-[#99A0AE]">
                    Choose Tools
                  </option>
                  <option value="Figma" className="text-black">
                    Figma
                  </option>
                  <option value="Rive" className="text-black">
                    Rive
                  </option>
                  <option value="Webflow" className="text-black">
                    Webflow
                  </option>
                  <option value="Lottie" className="text-black">
                    Lottie
                  </option>
                  <option value="Framer" className="text-black">
                    Framer
                  </option>
                </select>
                {/* Selected Stack */}
                {formData.stack.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.stack.map((tool, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-[#F5F5F5] px-3 py-2 rounded-full text-sm font-[Inter_Tight]"
                      >
                        <span>{tool}</span>
                        <button
                          type="button"
                          onClick={() => removeStack(index)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Portfolio Link */}
              <div className="flex flex-col gap-[13px]">
                <label className="text-[15px] font-normal text-black font-[Inter_Tight]">
                  Portfolio Link
                </label>
                <Input
                  type="url"
                  value={formData.portfolioLink}
                  onChange={handlePortfolioChange}
                  placeholder="Paste your website link"
                  className="h-[53px] rounded-[10px] border-0 bg-[#F5F5F5] placeholder:text-[#99A0AE] text-[15px] font-[Inter_Tight] px-[15px]"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Right side - Profile Preview */}
        <div className="hidden md:flex flex-col items-center justify-center p-6 md:p-10 md:pl-6 bg-white relative overflow-hidden h-full">
          <div className="w-full h-full flex items-center justify-center relative">
            {/* Yellow Star */}
            <svg
              className="absolute left-0 top-24 w-20 h-20 lg:w-32 lg:h-32 z-0"
              viewBox="0 0 131 131"
              fill="none"
            >
              <path
                d="M65.3129 0L75.4732 55.1526L130.626 65.3129L75.4732 75.4732L65.3129 130.626L55.1526 75.4732L0 65.3129L55.1526 55.1526L65.3129 0Z"
                fill="#F6BC3F"
              />
            </svg>

            <div className="relative w-full max-w-[350px] z-10 h-[350px]">
              {/* Background Cards */}
              <div className="relative">
                <div className="absolute rounded-[58px] bg-[#ECECEC] w-4/5 h-12 left-1/4 -bottom-8"></div>
                <div className="absolute rounded-[58px] bg-[#E0E0E0] w-11/12 h-14 left-0 -bottom-12"></div>

                {/* Main Profile Card */}
                <div className="relative w-full rounded-[30px] bg-white shadow-[2.563px_0_30.756px_rgba(0,0,0,0.25)] p-[16px] flex flex-col items-center gap-3">
                  {/* Profile Picture with Badge */}
                  <div className="relative flex flex-col items-center gap-2">
                    <div className="text-center">
                      <h3 className="text-[20px] text-black font-medium font-[Inter_Tight] leading-[105%]">
                        {displayName}
                      </h3>
                      <p className="text-[14px] text-[#919191] font-light font-[Inter_Tight] leading-[105%] mt-2">
                        {displayCategory}
                      </p>
                    </div>

                    {/* Badge with Photo */}
                    <div className="relative">
                      {/* Purple Star Badge */}
                      <svg
                        className="w-32 h-32"
                        viewBox="0 0 384 286"
                        fill="none"
                      >
                        <path
                          d="M282.448 117.72H384.002L351.36 143.109L384.002 168.497H282.448V117.72Z"
                          fill="#673DFF"
                          fillOpacity="0.2"
                        />
                        <path
                          d="M101.554 117.72H-0.000389099L32.642 143.109L-0.000389099 168.497H101.554V117.72Z"
                          fill="#673DFF"
                          fillOpacity="0.2"
                        />
                        <path
                          d="M187.522 33.3711C189.032 29.1735 194.969 29.1735 196.48 33.3711L199.542 41.8794C200.873 45.5778 205.859 46.1606 208.008 42.8689L212.95 35.2962C215.388 31.5601 221.164 32.9291 221.666 37.362L222.684 46.3472C223.126 50.2529 227.844 51.97 230.693 49.2624L237.248 43.0334C240.482 39.9603 245.787 42.6246 245.253 47.0538L244.172 56.0315C243.701 59.9339 247.896 62.6926 251.293 60.7151L259.108 56.1658C262.963 53.9213 267.511 57.7372 265.97 61.9239L262.847 70.4101C261.489 74.0989 264.934 77.7505 268.696 76.6097L277.349 73.9852C281.618 72.6904 285.163 77.4522 282.699 81.1708L277.702 88.7079C275.531 91.9842 278.041 96.3319 281.964 96.0893L290.99 95.5312C295.442 95.2558 297.794 100.707 294.538 103.757L287.938 109.939C285.069 112.626 286.509 117.435 290.383 118.104L299.293 119.642C303.69 120.401 304.72 126.247 300.849 128.464L293.002 132.957C289.591 134.91 289.883 139.922 293.497 141.466L301.813 145.018C305.916 146.77 305.571 152.697 301.292 153.961L292.62 156.523C288.851 157.637 287.979 162.581 291.14 164.917L298.413 170.291C302.001 172.942 300.298 178.629 295.844 178.873L286.814 179.366C282.89 179.581 280.901 184.19 283.439 187.192L289.276 194.099C292.156 197.506 289.187 202.647 284.797 201.857L275.897 200.255C272.029 199.558 269.031 203.585 270.807 207.091L274.895 215.157C276.911 219.137 272.837 223.455 268.747 221.673L260.457 218.062C256.853 216.492 253.008 219.719 253.928 223.541L256.045 232.332C257.089 236.669 252.129 239.931 248.56 237.255L241.326 231.829C238.182 229.47 233.696 231.723 233.71 235.654L233.742 244.697C233.758 249.158 228.18 251.188 225.324 247.76L219.537 240.813C217.021 237.793 212.136 238.95 211.243 242.778L209.189 251.585C208.176 255.929 202.28 256.618 200.292 252.624L196.262 244.529C194.511 241.01 189.491 241.01 187.739 244.529L183.71 252.624C181.722 256.618 175.825 255.929 174.812 251.585L172.758 242.778C171.865 238.95 166.981 237.793 164.465 240.813L158.677 247.76C155.822 251.188 150.243 249.158 150.259 244.697L150.292 235.654C150.306 231.723 145.819 229.47 142.675 231.829L135.441 237.255C131.872 239.931 126.912 236.669 127.957 232.332L130.073 223.541C130.994 219.719 127.148 216.492 123.544 218.062L115.254 221.673C111.164 223.455 107.09 219.137 109.107 215.157L113.194 207.091C114.97 203.585 111.973 199.558 108.104 200.255L99.2045 201.857C94.8139 202.647 91.8456 197.506 94.7255 194.099L100.563 187.192C103.1 184.19 101.112 179.581 97.1868 179.366L88.1577 178.873C83.7031 178.629 82.0005 172.942 85.5885 170.291L92.861 164.917C96.0223 162.581 95.1506 157.637 91.381 156.523L82.709 153.961C78.4306 152.697 78.0855 146.77 82.1882 145.018L90.504 141.466C94.1188 139.922 94.4107 134.91 90.9996 132.957L83.1523 128.464C79.2808 126.247 80.3117 120.401 84.7079 119.642L93.6187 118.104C97.4921 117.435 98.9319 112.626 96.0632 109.939L89.4636 103.757C86.2077 100.707 88.559 95.2558 93.0118 95.5312L102.037 96.0893C105.96 96.3319 108.47 91.9842 106.299 88.7079L101.303 81.1708C98.8379 77.4522 102.383 72.6904 106.652 73.9852L115.306 76.6097C119.067 77.7505 122.512 74.0989 121.155 70.4101L118.031 61.9239C116.491 57.7372 121.038 53.9213 124.894 56.1658L132.709 60.7151C136.106 62.6926 140.3 59.9339 139.83 56.0315L138.748 47.0538C138.214 42.6246 143.519 39.9603 146.753 43.0334L153.308 49.2624C156.158 51.97 160.875 50.2529 161.317 46.3472L162.335 37.362C162.837 32.9291 168.614 31.5601 171.052 35.2962L175.994 42.8689C178.142 46.1606 183.128 45.5778 184.459 41.8794L187.522 33.3711Z"
                          fill="#6C45FF"
                          filter="drop-shadow(0 0 24px rgba(0, 0, 0, 0.13))"
                        />
                        <circle
                          cx="192"
                          cy="143"
                          r="82.5"
                          fill="white"
                          stroke="#805DFF"
                          strokeWidth="8"
                        />
                        <circle cx="192" cy="143" r="63" fill="#D9D9D9" />
                      </svg>

                      {/* User Logo Badge */}
                      <div className="absolute top-4 right-0 w-[50px] h-[50px] rounded-full overflow-hidden shadow-[0_7.936px_9.92px_0_rgba(0,0,0,0.20)]">
                        <img
                          src="/logo.png"
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Skills Display */}
                  <div className="flex justify-center items-center flex-wrap gap-1 w-full px-1">
                    {formData.skills.length > 0 ? (
                      formData.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="flex px-2 py-1 justify-center items-center gap-1.5 rounded-[20px] bg-[#F5F5F5]"
                        >
                          <span className="text-black text-center font-[Inter_Tight] text-[11px] font-normal leading-[100%]">
                            {skill}
                          </span>
                        </div>
                      ))
                    ) : (
                      <>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <div
                            key={num}
                            className="flex px-2 py-1 justify-center items-center gap-1.5 rounded-[20px] bg-[#F5F5F5]"
                          >
                            <span className="text-black text-center font-[Inter_Tight] text-[11px] font-normal leading-[100%]">
                              Skill {num}
                            </span>
                          </div>
                        ))}
                      </>
                    )}
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
