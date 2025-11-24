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

const SelectRoleStep = ({ onNext }: { onNext: (role: Role) => void }) => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const roles = [
    {
      id: "talent",
      label: "As Talent",
      image:
        "https://api.builder.io/api/v1/image/assets/TEMP/4b8cd503cd85ff9dcf4440439b7a1a2529624e4a?width=512",
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
        "https://api.builder.io/api/v1/image/assets/TEMP/ee967bc86e23b38c64cc1b60aa7d5caa0efafc05?width=512",
    },
  ];

  return (
    <div className="relative flex flex-col gap-8">
      {/* Logo */}
      <img
        src="https://api.builder.io/api/v1/image/assets/TEMP/e6cfaabb6014008791cbccd5e74eb9e74ecc352c?width=160"
        alt="TalentNG Logo"
        className="absolute top-0 left-0 w-20 h-auto rounded-[3.457px] shadow-[0.777px_0.777px_24.66px_0_rgba(0,0,0,0.25)]"
      />

      {/* Back Button */}
      <button
        className="absolute top-0 right-0 px-[25px] py-[21px] bg-[#A9A9A9] text-white rounded-[60px] text-[15px] font-medium font-[Inter_Tight] hover:bg-[#999] transition-colors"
        onClick={() => window.history.back()}
      >
        Back
      </button>

      {/* Header */}
      <div className="flex flex-col gap-5 text-center mt-16">
        <h2 className="text-2xl md:text-[30px] font-medium text-black capitalize font-[Inter_Tight] leading-[105%]">
          How do you want to use Talent.ng
        </h2>
        <p className="text-sm md:text-[17px] font-light text-[#919191] capitalize font-[Inter_Tight] leading-[120%]">
          Pick the option that best describes you
        </p>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => setSelectedRole(role.id as Role)}
            className={`flex flex-col overflow-hidden transition-all ${
              selectedRole === role.id
                ? "ring-2 ring-[#5C30FF]"
                : ""
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
      <div className="flex justify-center">
        <Button
          onClick={() => selectedRole && onNext(selectedRole)}
          disabled={!selectedRole}
          className="px-10 py-[21px] h-[53px] rounded-[10px] bg-[#5C30FF] hover:bg-[#4a1fe5] text-white font-medium text-[15px] font-[Inter_Tight] disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Continue
        </Button>
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <p className="text-sm text-gray-400 font-light">Step 2/3</p>
        <h2 className="text-3xl md:text-[30px] font-semibold text-black">
          Create your profile
        </h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Name */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-black">First Name</label>
          <Input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter first name"
            className="h-[53px] rounded-[10px] border-0 bg-gray-100 placeholder:text-gray-400"
          />
        </div>

        {/* Last Name */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-black">Last Name</label>
          <Input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter last name"
            className="h-[53px] rounded-[10px] border-0 bg-gray-100 placeholder:text-gray-400"
          />
        </div>

        {/* Username */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-black">Username</label>
          <Input
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username"
            className="h-[53px] rounded-[10px] border-0 bg-gray-100 placeholder:text-gray-400"
          />
        </div>

        {/* Location */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-black">Location</label>
          <Input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter location"
            className="h-[53px] rounded-[10px] border-0 bg-gray-100 placeholder:text-gray-400"
          />
        </div>

        {/* Bio */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-black">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Describe yourself"
            rows={4}
            className="rounded-[10px] border-0 bg-gray-100 placeholder:text-gray-400 px-4 py-3 resize-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <SelectRoleStep onNext={handleRoleSelect} />;
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
            {currentStep === 1 ? (
              // Full width for role selection
              <div className="p-8 md:p-16">
                <SelectRoleStep onNext={handleRoleSelect} />
              </div>
            ) : (
              // Side-by-side layout for profile and skills
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Left side - Logo/Preview (can be used for future preview cards) */}
                <div className="hidden md:flex flex-col items-center justify-center p-12 lg:p-16 bg-gray-50">
                  <div className="text-center text-gray-400">
                    <p className="text-sm">Preview Panel</p>
                  </div>
                </div>

                {/* Right side - Form */}
                <div className="flex flex-col justify-start p-8 md:p-12 lg:p-16 bg-white overflow-y-auto max-h-[calc(100vh-60px)]">
                  {currentStep === 2 && (
                    <CreateProfileStep
                      onNext={handleProfileNext}
                      onBack={handleBack}
                    />
                  )}
                  {currentStep === 3 && (
                    <ShowcaseSkillsStep
                      onNext={handleSkillsNext}
                      onBack={handleBack}
                    />
                  )}
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
