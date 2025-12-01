"use client";

import React, { useState, useEffect } from "react";
import { Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProfileData, SkillsData } from "@/lib/types/onboarding";
import categories from "@/lib/data/categories.json";

export const ShowcaseSkillsStep = ({
  onNext,
  onBack,
  profileData,
  isLoading,
  profileImage,
}: {
  onNext: (data: SkillsData) => void;
  onBack: () => void;
  profileData?: ProfileData;
  isLoading?: boolean;
  profileImage?: File;
}) => {
  const [formData, setFormData] = useState<SkillsData>({
    category: "",
    headline: "",
    skills: [],
    stack: [],
    portfolioLink: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [stackInput, setStackInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    category?: string;
    headline?: string;
    skills?: string;
    stack?: string;
  }>({});

  useEffect(() => {
    if (profileImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(profileImage);
    }
  }, [profileImage]);

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

    const newErrors: typeof errors = {};

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (!formData.headline.trim()) {
      newErrors.headline = "Headline is required";
    }

    if (formData.skills.length === 0) {
      newErrors.skills = "At least one skill is required";
    }

    if (formData.stack.length === 0) {
      newErrors.stack = "At least one tool/stack is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onNext(formData);
  };

  const displayName =
    profileData?.firstName && profileData?.lastName
      ? `${profileData.firstName} ${profileData.lastName}`
      : "Akanbi David";
  const displayCategory = formData.headline || "Your Headline";

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
              "Complete"
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
                  Choose a Category?
                </label>
                <select
                  value={formData.category}
                  onChange={handleCategoryChange}
                  className={`h-[53px] rounded-[10px] border-0 bg-[#F5F5F5] px-[15px] text-[15px] font-[Inter_Tight] text-[#99A0AE] focus:ring-2 focus:ring-purple-600 focus:outline-none ${
                    errors.category ? "ring-2 ring-red-500" : ""
                  }`}
                >
                  <option value="" className="text-black">
                    Select Category
                  </option>
                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                      className="text-black"
                    >
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <span className="text-xs text-red-600">
                    {errors.category}
                  </span>
                )}
              </div>

              {/* Headline */}
              <div className="flex flex-col gap-[13px]">
                <label className="text-[15px] font-normal text-black font-[Inter_Tight]">
                  What do you do?
                </label>
                <Input
                  type="text"
                  value={formData.headline}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      headline: e.target.value,
                    }));
                    setErrors((prev) => ({ ...prev, headline: "" }));
                  }}
                  placeholder="e.g., Singer, Software Engineer, Graphic Designer"
                  className="h-[53px] rounded-[10px] border-0 bg-[#F5F5F5] placeholder:text-[#99A0AE] text-[15px] font-[Inter_Tight] px-[15px]"
                />
                {errors.headline && (
                  <span className="text-xs text-red-600">
                    {errors.headline}
                  </span>
                )}
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
                    if (
                      value &&
                      formData.skills.length < 5 &&
                      !formData.skills.includes(value)
                    ) {
                      setFormData((prev) => ({
                        ...prev,
                        skills: [...prev.skills, value],
                      }));
                      setSkillInput("");
                      setErrors((prev) => ({ ...prev, skills: "" }));
                    }
                  }}
                  disabled={formData.skills.length >= 5}
                  className={`h-[53px] rounded-[10px] border-0 bg-[#F5F5F5] px-[15px] text-[15px] font-[Inter_Tight]  text-[#99A0AE] focus:ring-2 focus:ring-purple-600 focus:outline-none ${
                    errors.skills ? "ring-2 ring-red-500" : ""
                  } ${formData.skills.length >= 5 ? "opacity-50 cursor-not-allowed disabled:opacity-50" : ""}`}
                >
                  <option value="" className="text-[#99A0AE]">
                    Choose Skills
                  </option>
                  <option
                    value="UI Design"
                    disabled={formData.skills.includes("UI Design")}
                    style={
                      formData.skills.includes("UI Design")
                        ? { color: "#999999" }
                        : {}
                    }
                    className="text-black"
                  >
                    {formData.skills.includes("UI Design")
                      ? "✓ UI Design"
                      : "UI Design"}
                  </option>
                  <option
                    value="UX Design"
                    disabled={formData.skills.includes("UX Design")}
                    style={
                      formData.skills.includes("UX Design")
                        ? { color: "#999999" }
                        : {}
                    }
                    className="text-black"
                  >
                    {formData.skills.includes("UX Design")
                      ? "✓ UX Design"
                      : "UX Design"}
                  </option>
                  <option
                    value="Website Design"
                    disabled={formData.skills.includes("Website Design")}
                    style={
                      formData.skills.includes("Website Design")
                        ? { color: "#999999" }
                        : {}
                    }
                    className="text-black"
                  >
                    {formData.skills.includes("Website Design")
                      ? "✓ Website Design"
                      : "Website Design"}
                  </option>
                  <option
                    value="Interface Design"
                    disabled={formData.skills.includes("Interface Design")}
                    style={
                      formData.skills.includes("Interface Design")
                        ? { color: "#999999" }
                        : {}
                    }
                    className="text-black"
                  >
                    {formData.skills.includes("Interface Design")
                      ? "✓ Interface Design"
                      : "Interface Design"}
                  </option>
                  <option
                    value="Interaction Design"
                    disabled={formData.skills.includes("Interaction Design")}
                    style={
                      formData.skills.includes("Interaction Design")
                        ? { color: "#999999" }
                        : {}
                    }
                    className="text-black"
                  >
                    {formData.skills.includes("Interaction Design")
                      ? "✓ Interaction Design"
                      : "Interaction Design"}
                  </option>
                  <option
                    value="Presentation Design"
                    disabled={formData.skills.includes("Presentation Design")}
                    style={
                      formData.skills.includes("Presentation Design")
                        ? { color: "#999999" }
                        : {}
                    }
                    className="text-black"
                  >
                    {formData.skills.includes("Presentation Design")
                      ? "✓ Presentation Design"
                      : "Presentation Design"}
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
                {errors.skills && (
                  <span className="text-xs text-red-600">{errors.skills}</span>
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
                    if (
                      value &&
                      formData.stack.length < 6 &&
                      !formData.stack.includes(value)
                    ) {
                      setFormData((prev) => ({
                        ...prev,
                        stack: [...prev.stack, value],
                      }));
                      setStackInput("");
                      setErrors((prev) => ({ ...prev, stack: "" }));
                    }
                  }}
                  disabled={formData.stack.length >= 6}
                  className={`h-[53px] rounded-[10px] border-0 bg-[#F5F5F5] px-[15px] text-[15px] font-[Inter_Tight]  text-[#99A0AE] focus:ring-2 focus:ring-purple-600 focus:outline-none ${
                    errors.stack ? "ring-2 ring-red-500" : ""
                  } ${formData.stack.length >= 6 ? "opacity-50 cursor-not-allowed disabled:opacity-50" : ""}`}
                >
                  <option value="" className="text-[#99A0AE]">
                    Choose Tools
                  </option>
                  <option
                    value="Figma"
                    disabled={formData.stack.includes("Figma")}
                    style={
                      formData.stack.includes("Figma")
                        ? { color: "#999999" }
                        : {}
                    }
                    className="text-black"
                  >
                    {formData.stack.includes("Figma") ? "✓ Figma" : "Figma"}
                  </option>
                  <option
                    value="Rive"
                    disabled={formData.stack.includes("Rive")}
                    style={
                      formData.stack.includes("Rive")
                        ? { color: "#999999" }
                        : {}
                    }
                    className="text-black"
                  >
                    {formData.stack.includes("Rive") ? "✓ Rive" : "Rive"}
                  </option>
                  <option
                    value="Webflow"
                    disabled={formData.stack.includes("Webflow")}
                    style={
                      formData.stack.includes("Webflow")
                        ? { color: "#999999" }
                        : {}
                    }
                    className="text-black"
                  >
                    {formData.stack.includes("Webflow")
                      ? "✓ Webflow"
                      : "Webflow"}
                  </option>
                  <option
                    value="Lottie"
                    disabled={formData.stack.includes("Lottie")}
                    style={
                      formData.stack.includes("Lottie")
                        ? { color: "#999999" }
                        : {}
                    }
                    className="text-black"
                  >
                    {formData.stack.includes("Lottie") ? "✓ Lottie" : "Lottie"}
                  </option>
                  <option
                    value="Framer"
                    disabled={formData.stack.includes("Framer")}
                    style={
                      formData.stack.includes("Framer")
                        ? { color: "#999999" }
                        : {}
                    }
                    className="text-black"
                  >
                    {formData.stack.includes("Framer") ? "✓ Framer" : "Framer"}
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
                {errors.stack && (
                  <span className="text-xs text-red-600">{errors.stack}</span>
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
            {/* Container with exact height of 350px */}
            <div className="relative w-full max-w-[290px] h-[350px] flex items-start justify-center">
              {/* Yellow Star */}
              <svg
                className="absolute -left-12 top-24 w-16 h-16 lg:w-24 lg:h-24 z-40"
                viewBox="0 0 131 131"
                fill="none"
              >
                <path
                  d="M65.3129 0L75.4732 55.1526L130.626 65.3129L75.4732 75.4732L65.3129 130.626L55.1526 75.4732L0 65.3129L55.1526 55.1526L65.3129 0Z"
                  fill="#F6BC3F"
                />
              </svg>
              {/* User Logo Badge */}
              <div className="absolute top-4 -right-8 w-[70px] h-[70px] z-30">
                <img
                  src="/logo-2.png"
                  alt="Profile"
                  className="w-full h-full object-cover object-center rounded-full"
                />
              </div>
              {/* Stack of cards - Background layers */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-full flex flex-col items-center">
                {/* Back card */}
                <div className="absolute -bottom-4 w-[203px] h-[33px] rounded-[39.5px] bg-[#ECECEC]"></div>
                {/* Middle card */}
                <div className="absolute bottom-[-2px] w-[247px] h-[39px] rounded-[39.5px] bg-[#E0E0E0]"></div>
              </div>

              {/* Main Profile Card */}
              <div className="relative w-[290px] h-[330px] rounded-[20px] bg-white shadow-[1.74px_0_20.88px_0_rgba(0,0,0,0.25)] p-[20px_10px] flex flex-col items-center">
                {/* Name and Category */}
                <div className="flex flex-col items-center gap-[11px] w-full">
                  <h3 className="text-[21.7px] text-black font-medium font-[Inter_Tight] leading-[105%]">
                    {displayName}
                  </h3>
                  <p className="text-[14.9px] text-[#919191] text-center font-light font-[Inter_Tight] leading-[105%]">
                    {displayCategory}
                  </p>
                </div>

                {/* Badge with decorative stars and profile photo */}
                <div className="relative w-[290px] h-[195px] flex items-center justify-center">
                  {/* Complete SVG from Figma with stars and badge */}
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 380 280"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
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
                    <g filter="url(#filter0_d_2026_6807)">
                      <path
                        d="M187.522 33.3711C189.032 29.1734 194.969 29.1734 196.48 33.3711L199.542 41.8794C200.873 45.5778 205.859 46.1606 208.008 42.8689L212.95 35.2961C215.388 31.5601 221.164 32.9291 221.666 37.362L222.684 46.3472C223.126 50.2529 227.844 51.9699 230.693 49.2623L237.248 43.0334C240.482 39.9603 245.787 42.6246 245.253 47.0538L244.172 56.0315C243.701 59.9339 247.896 62.6926 251.293 60.7151L259.108 56.1658C262.963 53.9213 267.511 57.7372 265.97 61.9239L262.847 70.4101C261.489 74.0989 264.934 77.7505 268.696 76.6097L277.349 73.9852C281.618 72.6904 285.163 77.4522 282.699 81.1707L277.702 88.7079C275.531 91.9842 278.041 96.3319 281.964 96.0893L290.99 95.5312C295.442 95.2558 297.794 100.707 294.538 103.757L287.938 109.939C285.069 112.626 286.509 117.435 290.383 118.104L299.293 119.642C303.69 120.401 304.72 126.247 300.849 128.464L293.002 132.957C289.591 134.91 289.883 139.922 293.497 141.466L301.813 145.018C305.916 146.77 305.571 152.697 301.292 153.961L292.62 156.523C288.851 157.637 287.979 162.581 291.14 164.917L298.413 170.291C302.001 172.942 300.298 178.629 295.844 178.873L286.814 179.366C282.89 179.581 280.901 184.19 283.439 187.192L289.276 194.099C292.156 197.506 289.187 202.647 284.797 201.857L275.897 200.255C272.029 199.558 269.031 203.585 270.807 207.091L274.895 215.157C276.911 219.137 272.837 223.455 268.747 221.673L260.457 218.062C256.853 216.492 253.008 219.719 253.928 223.541L256.045 232.332C257.089 236.669 252.129 239.931 248.56 237.255L241.326 231.829C238.182 229.47 233.696 231.723 233.71 235.654L233.742 244.697C233.758 249.158 228.18 251.188 225.324 247.76L219.537 240.813C217.021 237.793 212.136 238.95 211.243 242.778L209.189 251.585C208.176 255.929 202.28 256.618 200.292 252.624L196.262 244.529C194.511 241.01 189.491 241.01 187.739 244.529L183.71 252.624C181.722 256.618 175.825 255.929 174.812 251.585L172.758 242.778C171.865 238.95 166.981 237.793 164.465 240.813L158.677 247.76C155.822 251.188 150.243 249.158 150.259 244.697L150.292 235.654C150.306 231.723 145.819 229.47 142.675 231.829L135.441 237.255C131.872 239.931 126.912 236.669 127.957 232.332L130.073 223.541C130.994 219.719 127.148 216.492 123.544 218.062L115.254 221.673C111.164 223.455 107.09 219.137 109.107 215.157L113.194 207.091C114.97 203.585 111.973 199.558 108.104 200.255L99.2045 201.857C94.8139 202.647 91.8456 197.506 94.7255 194.099L100.563 187.192C103.1 184.19 101.112 179.581 97.1868 179.366L88.1577 178.873C83.7031 178.629 82.0005 172.942 85.5885 170.291L92.861 164.917C96.0223 162.581 95.1506 157.637 91.381 156.523L82.709 153.961C78.4306 152.697 78.0855 146.77 82.1882 145.018L90.504 141.466C94.1188 139.922 94.4107 134.91 90.9996 132.957L83.1523 128.464C79.2808 126.247 80.3117 120.401 84.7079 119.642L93.6187 118.104C97.4921 117.435 98.9319 112.626 96.0632 109.938L89.4636 103.757C86.2077 100.707 88.559 95.2558 93.0118 95.5312L102.037 96.0893C105.96 96.3319 108.47 91.9842 106.299 88.7079L101.303 81.1707C98.8379 77.4522 102.383 72.6904 106.652 73.9852L115.306 76.6097C119.067 77.7505 122.512 74.0989 121.155 70.4101L118.031 61.9239C116.491 57.7372 121.038 53.9213 124.894 56.1658L132.709 60.7151C136.106 62.6926 140.3 59.9339 139.83 56.0315L138.748 47.0538C138.214 42.6246 143.519 39.9603 146.753 43.0334L153.308 49.2623C156.158 51.9699 160.875 50.2529 161.317 46.3472L162.335 37.362C162.837 32.9291 168.614 31.5601 171.052 35.2961L175.994 42.8689C178.142 46.1606 183.128 45.5778 184.459 41.8794L187.522 33.3711Z"
                        fill="#6C45FF"
                      />
                      <path
                        d="M184.535 32.2966C187.053 25.3005 196.948 25.3006 199.466 32.2966L202.528 40.8044C202.972 42.0372 204.633 42.2316 205.35 41.1345L210.292 33.5613C214.356 27.335 223.982 29.6168 224.819 37.0046L225.837 45.99C225.984 47.2919 227.557 47.8642 228.507 46.9617L235.062 40.7332C240.453 35.6114 249.294 40.0515 248.404 47.4333L247.322 56.4109C247.165 57.7117 248.564 58.6316 249.696 57.9724L257.511 53.4226C263.937 49.682 271.516 56.0424 268.948 63.0203L265.825 71.5066C265.373 72.736 266.521 73.953 267.774 73.573L276.428 70.948C283.543 68.79 289.452 76.727 285.344 82.9246L280.348 90.4617C279.624 91.5537 280.461 93.0025 281.769 92.9216L290.794 92.364C298.215 91.9054 302.134 100.99 296.707 106.073L290.107 112.255C289.151 113.15 289.632 114.753 290.923 114.976L299.833 116.514C307.16 117.779 308.878 127.524 302.426 131.219L294.578 135.712C293.442 136.363 293.539 138.033 294.744 138.548L303.06 142.099C309.897 145.02 309.322 154.898 302.191 157.005L293.52 159.567C292.263 159.938 291.973 161.586 293.026 162.365L300.299 167.739C306.279 172.158 303.441 181.636 296.017 182.042L286.987 182.535C285.679 182.607 285.017 184.144 285.862 185.144L291.699 192.05C296.499 197.728 291.552 206.298 284.234 204.98L275.335 203.378C274.045 203.146 273.046 204.488 273.639 205.657L277.726 213.723C281.086 220.356 274.296 227.552 267.479 224.583L259.189 220.971C257.988 220.448 256.707 221.524 257.014 222.798L259.13 231.589C260.87 238.817 252.604 244.255 246.656 239.794L239.422 234.368C238.374 233.582 236.878 234.332 236.883 235.642L236.916 244.685C236.943 252.121 227.645 255.505 222.886 249.792L217.099 242.844C216.26 241.837 214.632 242.223 214.334 243.499L212.28 252.305C210.591 259.547 200.763 260.695 197.45 254.039L193.421 245.943C192.837 244.771 191.164 244.77 190.58 245.943L186.551 254.039C183.238 260.695 173.411 259.546 171.722 252.305L169.668 243.499C169.37 242.223 167.742 241.837 166.903 242.844L161.115 249.792C156.356 255.504 147.059 252.121 147.086 244.685L147.118 235.642C147.123 234.332 145.627 233.582 144.579 234.368L137.346 239.794C131.398 244.255 123.13 238.817 124.871 231.589L126.988 222.798C127.295 221.524 126.013 220.448 124.812 220.971L116.521 224.583C109.705 227.552 102.915 220.356 106.275 213.723L110.363 205.657C110.955 204.488 109.956 203.146 108.666 203.378L99.7666 204.98C92.4489 206.297 87.502 197.728 92.3018 192.05L98.1387 185.144C98.9844 184.144 98.322 182.606 97.0137 182.535L87.9844 182.042C80.5602 181.636 77.7227 172.158 83.7021 167.739L90.9746 162.365C92.0284 161.586 91.738 159.938 90.4814 159.567L81.8096 157.005C74.679 154.898 74.1037 145.02 80.9414 142.099L89.2578 138.548C90.4624 138.033 90.5595 136.363 89.4229 135.712L81.5752 131.219C75.1226 127.524 76.8409 117.779 84.168 116.514L93.0791 114.976C94.37 114.753 94.8497 113.15 93.8936 112.255L87.2939 106.073C81.8674 100.99 85.7868 91.9051 93.208 92.364L102.233 92.9216C103.541 93.0022 104.377 91.5537 103.653 90.4617L98.6572 82.9246C94.5492 76.727 100.458 68.7901 107.573 70.948L116.227 73.573C117.48 73.9532 118.629 72.736 118.177 71.5066L115.053 63.0203C112.485 56.0425 120.064 49.6822 126.49 53.4226L134.306 57.9724C135.438 58.6312 136.835 57.7116 136.679 56.4109L135.597 47.4333C134.707 40.0514 143.549 35.6114 148.939 40.7332L155.494 46.9617C156.444 47.8642 158.017 47.2919 158.164 45.99L159.182 37.0046C160.019 29.6168 169.645 27.3352 173.709 33.5613L178.651 41.1345C179.367 42.2317 181.03 42.0372 181.474 40.8044L184.535 32.2966Z"
                        stroke="#FEFEFE"
                        strokeWidth="6.34713"
                      />
                    </g>
                    <circle
                      cx="192.794"
                      cy="143.902"
                      r="82.5127"
                      fill="white"
                      stroke="#805DFF"
                      strokeWidth="7.93391"
                    />
                    <circle
                      cx="192.794"
                      cy="143.902"
                      r="62.6779"
                      fill="url(#pattern0_2026_6807)"
                    />
                    <defs>
                      <filter
                        id="filter0_d_2026_6807"
                        x="49.0745"
                        y="-5.72205e-06"
                        width="285.853"
                        height="285.49"
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB"
                      >
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feColorMatrix
                          in="SourceAlpha"
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          result="hardAlpha"
                        />
                        <feOffset />
                        <feGaussianBlur stdDeviation="11.9379" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.13 0"
                        />
                        <feBlend
                          mode="normal"
                          in2="BackgroundImageFix"
                          result="effect1_dropShadow_2026_6807"
                        />
                        <feBlend
                          mode="normal"
                          in="SourceGraphic"
                          in2="effect1_dropShadow_2026_6807"
                          result="shape"
                        />
                      </filter>
                      <pattern
                        id="pattern0_2026_6807"
                        patternContentUnits="objectBoundingBox"
                        width="1"
                        height="1"
                      >
                        <use
                          xlinkHref="#image0_2026_6807"
                          transform="translate(0 -0.166667) scale(0.00123457)"
                        />
                      </pattern>
                      <image
                        id="image0_2026_6807"
                        width="810"
                        height="1080"
                        className="border"
                        xlinkHref={imagePreview || "/default.png"}
                        preserveAspectRatio="xMidYMid slice"
                      />
                    </defs>
                  </svg>
                </div>

                {/* Skills Pills */}
                <div className="flex justify-center items-center flex-wrap gap-[3px] w-full px-1">
                  {formData.skills.length > 0 ? (
                    formData.skills.slice(0, 5).map((skill, index) => (
                      <div
                        key={index}
                        className="flex px-[9px] py-[8px] justify-center items-center gap-[7px] rounded-[20px] bg-[#F5F5F5]"
                      >
                        <span className="text-black text-center font-[Inter_Tight] text-[9.5px] font-normal leading-[105%]">
                          {skill}
                        </span>
                      </div>
                    ))
                  ) : (
                    <>
                      {[
                        "Add Skill 1",
                        "Add Skill 2",
                        "Add Skill 3",
                        "Add Skill 4",
                        "Add Skill 5",
                      ].map((skill) => (
                        <div
                          key={skill}
                          className="flex px-[9px] py-[8px] justify-center items-center gap-[7px] rounded-[20px] bg-[#F5F5F5]"
                        >
                          <span className="text-black text-center font-[Inter_Tight] text-[9.5px] font-normal leading-[105%]">
                            {skill}
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
  );
};
