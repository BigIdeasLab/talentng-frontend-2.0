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
      <div className="flex items-center justify-between px-8 md:px-16 py-4 md:py-7 flex-shrink-0 bg-white">
        {/* Logo */}
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/4156d71309afdfdb5e60777e82faec84a6a2e8b2?width=160"
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
      <div className="flex-1 flex flex-col gap-8 p-8 md:p-16 justify-center items-center">
        {/* Header */}
        <div className="flex flex-col gap-3 text-center max-w-[470px]">
          <h2 className="text-3xl md:text-[30px] font-semibold text-black font-[Inter_Tight]">
            How do you want to use Talent.ng
          </h2>
          <p className="text-sm md:text-[17px] font-light text-[#919191] font-[Inter_Tight]">
            Pick the option that best describes you
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-[808px]">
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
        <div className="flex justify-center pt-4">
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
      <div className="flex items-center justify-between px-8 md:px-16 py-4 md:py-7 flex-shrink-0 bg-white">
        {/* Logo */}
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/e6cfaabb6014008791cbccd5e74eb9e74ecc352c?width=160"
          alt="TalentNG Logo"
          className="w-20 h-auto rounded-[3.457px] shadow-[0.777px_0.777px_24.66px_0_rgba(0,0,0,0.25)]"
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
        <div className="flex flex-col justify-start p-6 md:p-10 md:pr-6 bg-white overflow-y-auto">
          <div className="flex flex-col gap-8">
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
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-[13px] flex-shrink-0"
            >
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
}: {
  onNext: (data: SkillsData) => void;
  onBack: () => void;
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <p className="text-sm text-gray-400 font-light">Step 3/3</p>
        <h2 className="text-3xl md:text-[30px] font-semibold text-black">
          Showcase what you do
        </h2>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-h-[500px] overflow-y-auto pr-2"
      >
        {/* Category Dropdown */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-black">
            What do you do?
          </label>
          <select
            value={formData.category}
            onChange={handleCategoryChange}
            className="h-[53px] rounded-[10px] border-0 bg-gray-100 px-4 text-black focus:ring-2 focus:ring-purple-600"
          >
            <option value="">Select Category</option>
            <option value="product-designer">Product Designer</option>
            <option value="ux-designer">UX Designer</option>
            <option value="developer">Developer</option>
            <option value="marketer">Marketer</option>
          </select>
        </div>

        {/* Skills */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-black">Your Skills</label>
          <select
            value=""
            onChange={(e) => {
              if (e.target.value) {
                addSkill();
                e.target.value = "";
              }
            }}
            className="h-[53px] rounded-[10px] border-0 bg-gray-100 px-4 text-black focus:ring-2 focus:ring-purple-600"
          >
            <option value="">Choose Skills</option>
            <option value="UI Design">UI Design</option>
            <option value="UX Design">UX Design</option>
            <option value="Website Design">Website Design</option>
            <option value="Interface Design">Interface Design</option>
            <option value="Interaction Design">Interaction Design</option>
            <option value="Presentation Design">Presentation Design</option>
          </select>
          {/* Selected Skills */}
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full text-sm"
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
        </div>

        {/* Tech Stack */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-black">Your Stack</label>
          <select
            value=""
            onChange={(e) => {
              if (e.target.value) {
                addStack();
                e.target.value = "";
              }
            }}
            className="h-[53px] rounded-[10px] border-0 bg-gray-100 px-4 text-black focus:ring-2 focus:ring-purple-600"
          >
            <option value="">Choose Tools</option>
            <option value="Figma">Figma</option>
            <option value="Rive">Rive</option>
            <option value="Webflow">Webflow</option>
            <option value="Lottie">Lottie</option>
            <option value="Framer">Framer</option>
          </select>
          {/* Selected Stack */}
          <div className="flex flex-wrap gap-2">
            {formData.stack.map((tool, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full text-sm"
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
        </div>

        {/* Portfolio Link */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-black">
            Portfolio Link
          </label>
          <Input
            type="url"
            value={formData.portfolioLink}
            onChange={handlePortfolioChange}
            placeholder="Paste your website link"
            className="h-[53px] rounded-[10px] border-0 bg-gray-100 placeholder:text-gray-400"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-6 sticky bottom-0">
          <Button
            type="button"
            onClick={onBack}
            variant="outline"
            className="flex-1 h-[53px] rounded-[10px] bg-gray-200 hover:bg-gray-300 text-black font-semibold"
          >
            Back
          </Button>
          <Button
            type="submit"
            className="flex-1 h-[53px] rounded-[10px] bg-[#5C30FF] hover:bg-[#4a1fe5] text-white font-semibold"
          >
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
};

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const router = useRouter();

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setCurrentStep(2);
  };

  const handleProfileNext = (data: ProfileData) => {
    // Store profile data for next step
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <SelectRoleStep
            onNext={handleRoleSelect}
            onBack={handleSelectRoleBack}
          />
        );
      case 2:
        return (
          <CreateProfileStep onNext={handleProfileNext} onBack={handleBack} />
        );
      case 3:
        return (
          <ShowcaseSkillsStep onNext={handleSkillsNext} onBack={handleBack} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative h-screen bg-white overflow-hidden">
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
      <div className="relative z-10 h-screen flex items-center justify-center px-3 py-3 md:px-4 lg:px-6 overflow-hidden">
        <div className="w-full max-w-5xl max-h-full">
          <div className="bg-white rounded-[30px] shadow-lg overflow-hidden max-h-[calc(100vh-24px)]">
            {currentStep === 1 && (
              <div className="p-8 md:p-16">
                <SelectRoleStep onNext={handleRoleSelect} />
              </div>
            )}
            {currentStep === 2 && (
              <CreateProfileStep
                onNext={handleProfileNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="hidden md:flex flex-col items-center justify-center p-12 lg:p-16 bg-gray-50">
                  <div className="text-center text-gray-400">
                    <p className="text-sm">Preview Panel</p>
                  </div>
                </div>
                <div className="flex flex-col justify-start p-8 md:p-12 lg:p-16 bg-white overflow-y-auto max-h-[calc(100vh-60px)]">
                  <ShowcaseSkillsStep
                    onNext={handleSkillsNext}
                    onBack={handleBack}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
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
