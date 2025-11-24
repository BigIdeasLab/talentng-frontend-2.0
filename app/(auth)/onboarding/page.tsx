"use client";

import React, { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Role = "talent" | "employer" | "mentor";

interface ProfileData {
  firstName: string;
  lastName: string;
  username: string;
  location: string;
  bio: string;
}

interface SkillsData {
  category: string;
  skills: string[];
  stack: string[];
  portfolioLink: string;
}

const SelectRoleStep = ({
  onNext,
  onBack,
}: {
  onNext: (role: Role) => void;
  onBack?: () => void;
}) => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const roles = [
    {
      id: "talent",
      label: "As Talent",
      image:
        "https://api.builder.io/api/v1/image/assets/TEMP/611d63c0306f773058be10af29e0d55cc818b085?width=512",
    },
    {
      id: "employer",
      label: "Employer / Recruiter",
      image:
        "https://api.builder.io/api/v1/image/assets/TEMP/7e75bac5dec4ff1b9249b202c3cdc262e464ad7f?width=512",
    },
    {
      id: "mentor",
      label: "Mentor",
      image:
        "https://api.builder.io/api/v1/image/assets/TEMP/6b5c4a37fa26679b6a2b05eb189a80f6bed5b713?width=512",
    },
  ];

  return (
    <div className="relative h-full flex flex-col">
      {/* Top Bar with Logo and Back Button */}
      <div className="flex items-center justify-between px-4 md:px-6 py-4 md:py-6 flex-shrink-0 bg-white">
        {/* Logo */}
        <img
          src="/logo.png"
          alt="TalentNG Logo"
          className="w-20 h-auto rounded-[3.457px] shadow-[0.777px_0.777px_24.66px_0_rgba(0,0,0,0.25)]"
        />

        {/* Back Button */}
        <button
          type="button"
          onClick={onBack}
          className="px-[25px] py-[11px] bg-[#A9A9A9] text-white rounded-[60px] text-[15px] font-medium font-[Inter_Tight] hover:bg-[#999] transition-colors h-[53px]"
        >
          Back
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-5 px-6 md:px-12 py-2 md:py-4 justify-center items-center">
        {/* Header */}
        <div className="flex flex-col gap-2 text-center w-full flex-shrink-0">
          <h2 className="text-2xl md:text-[30px] font-semibold text-black font-[Inter_Tight] leading-tight">
            How do you want to use Talent.ng
          </h2>
          <p className="text-sm md:text-[17px] font-light text-[#919191] font-[Inter_Tight]">
            Pick the option that best describes you
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-[808px] flex-shrink-0">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id as Role)}
              className={`flex flex-col overflow-hidden transition-all rounded-[10px] ${
                selectedRole === role.id ? "ring-2 ring-[#5C30FF]" : ""
              }`}
            >
              {/* Image */}
              <div className="relative w-full aspect-square bg-[#E3E3E3] overflow-hidden">
                <img
                  src={role.image}
                  alt={role.label}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Label */}
              <div className="bg-white py-[17px] px-2.5 flex items-center justify-center">
                <span className="text-base font-medium text-black font-[Inter_Tight]">
                  {role.label}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Continue Button */}
        <div className="flex justify-center pt-2 flex-shrink-0">
          <Button
            onClick={() => selectedRole && onNext(selectedRole)}
            disabled={!selectedRole}
            className="px-10 py-[21px] h-[53px] rounded-[10px] bg-[#5C30FF] hover:bg-[#4a1fe5] text-white font-medium text-[15px] font-[Inter_Tight] disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

const CreateProfileStep = ({
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

const ShowcaseSkillsStep = ({
  onNext,
  onBack,
  profileData,
}: {
  onNext: (data: SkillsData) => void;
  onBack: () => void;
  profileData?: ProfileData;
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

  const addSkill = () => {
    if (skillInput.trim() && formData.skills.length < 5) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const addStack = () => {
    if (stackInput.trim() && formData.stack.length < 6) {
      setFormData((prev) => ({
        ...prev,
        stack: [...prev.stack, stackInput.trim()],
      }));
      setStackInput("");
    }
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 flex-1 overflow-hidden">
        {/* Left side - Form */}
        <div className="flex flex-col justify-start p-6 md:p-10 md:pr-6 bg-white overflow-y-auto scrollbar-hidden">
          <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col gap-[13px] flex-shrink-0">
              <p className="text-[17px] text-[#919191] font-light font-[Inter_Tight] leading-[120%] capitalize">
                Step 3/3
              </p>
              <h2 className="text-[30px] text-black font-medium font-[Inter_Tight] leading-[105%]">
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
                  className="h-[53px] rounded-[10px] border-0 bg-[#F5F5F5] px-[15px] text-[15px] font-[Inter_Tight] text-black focus:ring-2 focus:ring-purple-600 focus:outline-none"
                >
                  <option value="" className="text-[#99A0AE]">
                    Select Category
                  </option>
                  <option value="product-designer">Product Designer</option>
                  <option value="ux-designer">UX Designer</option>
                  <option value="developer">Developer</option>
                  <option value="marketer">Marketer</option>
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
                  className="h-[53px] rounded-[10px] border-0 bg-[#F5F5F5] px-[15px] text-[15px] font-[Inter_Tight] text-black focus:ring-2 focus:ring-purple-600 focus:outline-none"
                >
                  <option value="" className="text-[#99A0AE]">
                    Choose Skills
                  </option>
                  <option value="UI Design">UI Design</option>
                  <option value="UX Design">UX Design</option>
                  <option value="Website Design">Website Design</option>
                  <option value="Interface Design">Interface Design</option>
                  <option value="Interaction Design">Interaction Design</option>
                  <option value="Presentation Design">
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
                <label className="text-[15px] font-normal text-black font-[Inter_Tight]">
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
                  className="h-[53px] rounded-[10px] border-0 bg-[#F5F5F5] px-[15px] text-[15px] font-[Inter_Tight] text-black focus:ring-2 focus:ring-purple-600 focus:outline-none"
                >
                  <option value="" className="text-[#99A0AE]">
                    Choose Tools
                  </option>
                  <option value="Figma">Figma</option>
                  <option value="Rive">Rive</option>
                  <option value="Webflow">Webflow</option>
                  <option value="Lottie">Lottie</option>
                  <option value="Framer">Framer</option>
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
        <div className="hidden md:flex flex-col items-center justify-center p-6 md:p-10 md:pl-6 bg-white relative overflow-hidden">
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

            <div className="relative w-full max-w-[350px] z-10">
              {/* Background Cards */}
              <div className="relative">
                <div className="absolute rounded-[58px] bg-[#ECECEC] w-4/5 h-12 left-1/4 -bottom-8"></div>
                <div className="absolute rounded-[58px] bg-[#E0E0E0] w-11/12 h-14 left-0 -bottom-12"></div>

                {/* Main Profile Card */}
                <div className="relative w-full rounded-[30px] bg-white shadow-[2.563px_0_30.756px_rgba(0,0,0,0.25)] p-[30px] flex flex-col items-center gap-5">
                  {/* Profile Picture with Badge */}
                  <div className="relative flex flex-col items-center gap-4">
                    <div className="text-center">
                      <h3 className="text-[32px] text-black font-medium font-[Inter_Tight] leading-[105%]">
                        {displayName}
                      </h3>
                      <p className="text-[22px] text-[#919191] font-light font-[Inter_Tight] leading-[105%] mt-4">
                        {displayCategory}
                      </p>
                    </div>

                    {/* Badge with Photo */}
                    <div className="relative">
                      {/* Purple Star Badge */}
                      <svg
                        className="w-60 h-60"
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
                      <div className="absolute top-8 right-0 w-[106px] h-[106px] rounded-full overflow-hidden shadow-[0_7.936px_9.92px_0_rgba(0,0,0,0.20)]">
                        <img
                          src="/logo.png"
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Skills Display */}
                  <div className="flex justify-center items-center flex-wrap gap-1 w-full">
                    {formData.skills.length > 0 ? (
                      formData.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="flex px-[13px] py-3 justify-center items-center gap-2.5 rounded-[30px] bg-[#F5F5F5]"
                        >
                          <span className="text-black text-center font-[Inter_Tight] text-[14px] font-normal leading-[105%]">
                            {skill}
                          </span>
                        </div>
                      ))
                    ) : (
                      <>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <div
                            key={num}
                            className="flex px-[13px] py-3 justify-center items-center gap-2.5 rounded-[30px] bg-[#F5F5F5]"
                          >
                            <span className="text-black text-center font-[Inter_Tight] text-[14px] font-normal leading-[105%]">
                              Add Skill {num}
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

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | undefined>();
  const router = useRouter();

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setCurrentStep(2);
  };

  const handleProfileNext = (data: ProfileData) => {
    setProfileData(data);
    setCurrentStep(3);
  };

  const handleSkillsNext = (data: SkillsData) => {
    // Handle final submission
    router.push("/dashboard");
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSelectRoleBack = () => {
    router.push("/login");
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-3 py-8 md:px-4 lg:px-6 w-full">
      {/* Gradient Background */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 1024"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="blur1" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="325" />
          </filter>
          <filter id="blur2" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="325" />
          </filter>
          <filter id="blur3" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="325" />
          </filter>
          <filter id="blur4" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="325" />
          </filter>
          <filter id="blur5" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="325" />
          </filter>
          <filter id="blur6" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="325" />
          </filter>
        </defs>
        <g filter="url(#blur1)">
          <path
            d="M332.362 -241.454L441.282 130.988L813.724 239.908L441.282 348.828L332.362 721.27L223.442 348.828L-149 239.908L223.442 130.988L332.362 -241.454Z"
            fill="#F6BC3F"
          />
        </g>
        <g filter="url(#blur2)">
          <path
            d="M332.362 39.8024L441.282 412.245L813.724 521.164L441.282 630.084L332.362 1002.53L223.442 630.084L-149 521.164L223.442 412.245L332.362 39.8024Z"
            fill="#008B47"
          />
        </g>
        <g filter="url(#blur3)">
          <path
            d="M332.362 404.73L441.282 777.172L813.724 886.092L441.282 995.012L332.362 1367.45L223.442 995.012L-149 886.092L223.442 777.172L332.362 404.73Z"
            fill="#5C30FF"
          />
        </g>
        <g filter="url(#blur4)">
          <path
            d="M1114.64 -241.454L1223.56 130.988L1596 239.908L1223.56 348.828L1114.64 721.27L1005.72 348.828L633.276 239.908L1005.72 130.988L1114.64 -241.454Z"
            fill="#F791C3"
          />
        </g>
        <g filter="url(#blur5)">
          <path
            d="M1114.64 39.8024L1223.56 412.245L1596 521.164L1223.56 630.084L1114.64 1002.53L1005.72 630.084L633.276 521.164L1005.72 412.245L1114.64 39.8024Z"
            fill="#E63C23"
          />
        </g>
        <g filter="url(#blur6)">
          <path
            d="M1114.64 404.73L1223.56 777.172L1596 886.092L1223.56 995.012L1114.64 1367.45L1005.72 995.012L633.276 886.092L1005.72 777.172L1114.64 404.73Z"
            fill="#FFEECA"
          />
        </g>
      </svg>

      {/* Content */}
      <div className="bg-white rounded-[30px] shadow-lg overflow-hidden w-full max-w-6xl z-10 h-[90vh] flex flex-col">
        {currentStep === 1 && (
          <div className="h-full flex flex-col overflow-hidden">
            <SelectRoleStep
              onNext={handleRoleSelect}
              onBack={handleSelectRoleBack}
            />
          </div>
        )}
        {currentStep === 2 && (
          <div className="h-full flex flex-col overflow-hidden">
            <CreateProfileStep onNext={handleProfileNext} onBack={handleBack} />
          </div>
        )}
        {currentStep === 3 && (
          <ShowcaseSkillsStep
            onNext={handleSkillsNext}
            onBack={handleBack}
            profileData={profileData}
          />
        )}
      </div>
    </div>
  );
};

const OnboardingPageWithSuspense = () => (
  <Suspense
    fallback={
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    }
  >
    <OnboardingPage />
  </Suspense>
);

export default OnboardingPageWithSuspense;
