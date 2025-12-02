"use client";

import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

type CompanyFormData = {
  companyName: string;
  industry: string;
  username: string;
  bio: string;
};

type UsernameStatus = "idle" | "checking" | "available" | "taken" | "invalid";

const industries = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Retail",
  "Manufacturing",
  "Agriculture",
  "Hospitality",
  "Transportation",
  "Construction",
  "Real Estate",
  "Media & Entertainment",
  "Telecommunications",
  "Energy",
  "Consulting",
  "Legal Services",
  "Human Resources",
  "Marketing & Advertising",
  "E-commerce",
  "Other",
];

export const CompanyProfileStep = ({
  onNext,
  onBack,
  initialData,
  initialLogo,
}: {
  onNext: (data: CompanyFormData, logo?: File) => void;
  onBack: () => void;
  initialData?: CompanyFormData;
  initialLogo?: File;
}) => {
  const [formData, setFormData] = useState<CompanyFormData>({
    companyName: initialData?.companyName || "",
    industry: initialData?.industry || "",
    username: initialData?.username || "",
    bio: initialData?.bio || "",
  });

  const [profileLogo, setProfileLogo] = useState<File | null>(initialLogo || null);
  const [logoPreview, setLogoPreview] = useState<string | null>(
    initialLogo ? URL.createObjectURL(initialLogo) : null,
  );
  const [isDragging, setIsDragging] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle");
  const [errors, setErrors] = useState<{
    companyName?: string;
    industry?: string;
    username?: string;
  }>({});
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const usernamePattern = /^[a-zA-Z0-9_]{3,50}$/;

  const validateUsername = (username: string): boolean => {
    return usernamePattern.test(username);
  };

  const checkUsername = async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameStatus("idle");
      return;
    }

    if (!validateUsername(username)) {
      setUsernameStatus("invalid");
      return;
    }

    setUsernameStatus("checking");

    try {
      // Simulating username check - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      // For now, always mark as available - replace with actual API call
      setUsernameStatus("available");
    } catch (error) {
      console.error("Error checking username:", error);
      setUsernameStatus("idle");
    }
  };

  React.useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (formData.username) {
        checkUsername(formData.username);
      } else {
        setUsernameStatus("idle");
      }
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [formData.username]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setProfileLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    } else {
      alert("Please select a valid image file.");
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleLogoChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleLogoChange(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }
    if (!formData.industry.trim()) {
      newErrors.industry = "Industry is required";
    }
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    if (!validateUsername(formData.username)) {
      setUsernameStatus("invalid");
      return;
    }

    if (usernameStatus !== "available") {
      if (usernameStatus === "checking" || usernameStatus === "taken") {
        return;
      }
      if (usernameStatus === "idle") {
        checkUsername(formData.username);
        return;
      }
    }

    onNext(formData, profileLogo || undefined);
  };

  const displayCompanyName = formData.companyName || "Company Name";
  const displayBio = formData.bio || "Company Bio";

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
          >
            Back
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-5 py-2 bg-[#222] text-white rounded-[60px] text-sm font-medium font-[Inter_Tight] hover:bg-[#333] transition-colors h-11"
          >
            Continue
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-0 flex-1 overflow-hidden border">
        {/* Left side - Form */}
        <div className="flex flex-col justify-start p-6 md:p-10 md:pr-6 md:pl-12 bg-white overflow-y-auto scrollbar-hidden">
          <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col gap-1 flex-shrink-0">
              <p className="text-[13px] text-[#919191] font-light font-[Inter_Tight] leading-[120%] capitalize">
                Step 2/3
              </p>
              <h2 className="text-[22px] text-black font-medium font-[Inter_Tight] leading-[105%]">
                Create your company profile
              </h2>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-[13px]">
              {/* Company Name */}
              <div className="flex flex-col gap-[13px]">
                <label className="text-[15px] font-normal text-black font-[Inter_Tight]">
                  Company Name
                </label>
                <Input
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  className={`h-[53px] rounded-[10px] border-0 bg-[#F5F5F5] placeholder:text-[#99A0AE] text-[15px] font-[Inter_Tight] px-[15px] ${
                    errors.companyName ? "ring-2 ring-red-500" : ""
                  }`}
                />
                {errors.companyName && (
                  <span className="text-xs text-red-600">
                    {errors.companyName}
                  </span>
                )}
              </div>

              {/* Industry Dropdown */}
              <div className="flex flex-col gap-[13px]">
                <label className="text-[15px] font-normal text-black font-[Inter_Tight]">
                  Industry
                </label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className={`h-[53px] rounded-[10px] border-0 bg-[#F5F5F5] placeholder:text-[#99A0AE] text-[15px] font-[Inter_Tight] px-[15px] focus:ring-2 focus:ring-purple-600 focus:outline-none appearance-none cursor-pointer ${
                    errors.industry ? "ring-2 ring-red-500" : ""
                  }`}
                >
                  <option value="">Select Industry</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
                {errors.industry && (
                  <span className="text-xs text-red-600">
                    {errors.industry}
                  </span>
                )}
              </div>

              {/* Username */}
              <div className="flex flex-col gap-[13px]">
                <label className="text-[15px] font-normal text-black font-[Inter_Tight]">
                  Username
                </label>
                <div className="relative">
                  <Input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Your Username"
                    className={`h-[53px] rounded-[10px] border-0 bg-[#F5F5F5] placeholder:text-[#99A0AE] text-[15px] font-[Inter_Tight] px-[15px] pr-12 ${
                      errors.username
                        ? "ring-2 ring-red-500"
                        : usernameStatus === "taken" ||
                            usernameStatus === "invalid"
                          ? "ring-2 ring-red-500"
                          : usernameStatus === "available"
                            ? "ring-2 ring-green-500"
                            : ""
                    }`}
                  />
                  {formData.username && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {usernameStatus === "checking" && (
                        <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                      )}
                      {usernameStatus === "available" && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                      {usernameStatus === "taken" && (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      {usernameStatus === "invalid" && (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {errors.username && (
                  <span className="text-xs text-red-600">
                    {errors.username}
                  </span>
                )}
                {!errors.username &&
                  formData.username &&
                  formData.username.length < 3 && (
                    <span className="text-xs text-red-600">
                      Username must be at least 3 characters long
                    </span>
                  )}
                {!errors.username &&
                  formData.username &&
                  formData.username.length >= 3 && (
                    <div className="text-xs font-[Inter_Tight]">
                      {usernameStatus === "checking" && (
                        <span className="text-gray-500">
                          Checking availability...
                        </span>
                      )}
                      {usernameStatus === "available" && (
                        <span className="text-green-600">
                          Username is available!
                        </span>
                      )}
                      {usernameStatus === "taken" && (
                        <span className="text-red-600">
                          Username is already taken
                        </span>
                      )}
                      {usernameStatus === "invalid" && (
                        <span className="text-red-600">
                          3-50 characters, letters, numbers, and underscores
                          only
                        </span>
                      )}
                    </div>
                  )}
              </div>



              {/* Company Bio */}
              <div className="flex flex-col gap-[13px]">
                <label className="text-[15px] font-normal text-black font-[Inter_Tight]">
                  Company Bio/About
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about your company"
                  rows={4}
                  className="rounded-[10px] border-0 bg-[#F5F5F5] placeholder:text-[#99A0AE] text-[15px] font-[Inter_Tight] px-[15px] py-[21px] resize-none focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Right side - Profile Preview */}
        <div className="hidden md:flex flex-col items-center justify-center p-6 md:p-10 md:pl-6 bg-white relative overflow-visible h-full">
          <div className="w-full h-full flex items-center justify-center">
            <div className="relative w-full max-w-[290px] h-[350px]">
              {/* Background decorative cards */}
              <div className="absolute w-[209px] h-[34px] rounded-[40px] bg-[#ECECEC] left-[40px] bottom-[84px] z-0"></div>
              <div className="absolute w-[254px] h-[40px] rounded-[40px] bg-[#E0E0E0] left-[18px] bottom-[56px] z-0"></div>

              {/* Main container for both cards */}
              <div className="relative w-[290px] h-[350px]">
                {/* Blue Star for company */}
                <svg
                  className="absolute -left-12 top-24 w-16 h-16 lg:w-24 lg:h-24 z-40"
                  viewBox="0 0 131 131"
                  fill="none"
                >
                  <path
                    d="M65.3129 0L75.4732 55.1526L130.626 65.3129L75.4732 75.4732L65.3129 130.626L55.1526 75.4732L0 65.3129L55.1526 55.1526L65.3129 0Z"
                    fill="#4A90E2"
                  />
                </svg>
                {/* Company Logo Badge */}
                <div className="absolute top-4 -right-8 w-[70px] h-[70px] z-30">
                  <img
                    src="/logo-2.png"
                    alt="Company Logo"
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

                {/* Back Card - Blue Company Card */}
                <div className="absolute w-full h-[328px] top-0 left-0 rounded-[21px] bg-[#1E5BA8] shadow-[1.79px_0_21.48px_rgba(0,0,0,0.25)] overflow-hidden z-10">
                  {/* Decorative striped pattern */}
                  <div className="absolute left-[-13px] top-[185px] w-[277px] h-[162px] flex gap-[16px] rotate-[20.779deg] overflow-hidden">
                    {Array.from({ length: 18 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-[8.14px] h-[162px] bg-[#2A6BA8] flex-shrink-0"
                      />
                    ))}
                  </div>

                  {/* Status badge */}
                  <div className="absolute bottom-[12px] left-[78px] text-white text-[13.4px] font-normal font-[Inter_Tight] leading-[120%] capitalize">
                    Hiring Now
                  </div>
                </div>

                {/* Front Card - White Company Card */}
                <div className="absolute w-full h-[289px] top-0 left-0 rounded-[21px] bg-white z-20 flex flex-col shadow-sm">
                  {/* Company Logo Upload Area */}
                  <div
                    className={`flex-1 flex flex-col items-center justify-center rounded-[18.7px] bg-[#F5F5F5] m-[8.4px] relative overflow-hidden cursor-pointer transition-colors ${
                      isDragging
                        ? "bg-[#E0E0E0] border-2 border-dashed border-blue-600"
                        : ""
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() =>
                      document.getElementById("company-logo-input")?.click()
                    }
                  >
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Company logo preview"
                        className="w-full h-full object-cover rounded-[18.7px]"
                      />
                    ) : (
                      <>
                        {/* Logo placeholder */}
                        <div className="w-[87px] h-[87px] rounded-full bg-[#D9D9D9] flex items-center justify-center mb-[11px]">
                          <svg
                            className="w-[52px] h-[52px]"
                            viewBox="0 0 74 74"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M15.4167 64.75C13.7208 64.75 12.2696 64.1467 11.063 62.9401C9.85639 61.7335 9.25206 60.2812 9.25 58.5833V15.4167C9.25 13.7208 9.85433 12.2696 11.063 11.063C12.2717 9.85639 13.7229 9.25206 15.4167 9.25H58.5833C60.2792 9.25 61.7314 9.85433 62.9401 11.063C64.1488 12.2717 64.7521 13.7229 64.75 15.4167V58.5833C64.75 60.2792 64.1467 61.7314 62.9401 62.9401C61.7335 64.1488 60.2812 64.7521 58.5833 64.75H15.4167ZM18.5 52.4167H55.5L43.9375 37L34.6875 49.3333L27.75 40.0833L18.5 52.4167Z"
                              fill="white"
                            />
                          </svg>
                        </div>

                        {/* Upload Text */}
                        <div className="flex flex-col items-center gap-[11px] text-center px-2">
                          <div className="text-[#404040] text-[13.3px] font-medium font-[Inter_Tight] leading-[105%]">
                            Company Logo
                          </div>
                          <div className="text-[#919191] text-[10.5px] font-light font-[Inter_Tight] leading-[120%] capitalize">
                            Upload your logo
                          </div>
                        </div>
                      </>
                    )}
                    <input
                      id="company-logo-input"
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </div>

                  {/* Company Name and Bio Preview on White Card */}
                  <div className="flex flex-col justify-center gap-[11px] px-[15px] pb-[15px] pt-0 h-[64px]">
                    <div className="text-black text-[16.3px] font-medium font-[Inter_Tight] leading-[105%]">
                      {displayCompanyName}
                    </div>
                    <div className="text-[#919191] text-[13px] font-light font-[Inter_Tight] leading-[120%] capitalize truncate">
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
