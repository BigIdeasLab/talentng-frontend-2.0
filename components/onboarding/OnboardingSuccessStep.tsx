"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface OnboardingSuccessStepProps {
  profileData: any;
  profileImage?: File;
  selectedRole: "talent" | "employer" | "mentor";
  isAddingRole?: boolean;
}

export const OnboardingSuccessStep = ({
  profileData,
  profileImage,
  selectedRole,
  isAddingRole,
}: OnboardingSuccessStepProps) => {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Create image preview URL
  useEffect(() => {
    if (profileImage) {
      const url = URL.createObjectURL(profileImage);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [profileImage]);

  // Auto redirect after showing success (5 minutes)
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      const redirectRole =
        selectedRole === "employer" ? "recruiter" : selectedRole;
      if (isAddingRole) {
        router.push(`/dashboard?switchRole=${redirectRole}`);
      } else {
        router.push("/dashboard");
      }
    }, 3000); // 3 seconds

    return () => clearTimeout(redirectTimer);
  }, [router, selectedRole, isAddingRole]);

  // Get display data based on role
  const getDisplayData = () => {
    if (selectedRole === "employer") {
      return {
        name: profileData?.companyName || "Company Name",
        bio: profileData?.bio || "Company Bio",
        role: "Employer",
        starColor: "#4A90E2",
        cardColor: "#1E5BA8",
        stripeColor: "#2A6BA8",
        statusText: "Hiring Now",
        statusPosition: "left-[78px]",
      };
    } else if (selectedRole === "mentor") {
      return {
        name:
          profileData?.firstName && profileData?.lastName
            ? `${profileData.firstName} ${profileData.lastName}`
            : "Mentor Name",
        bio: profileData?.bio || "Mentor Bio",
        role: "Mentor",
        starColor: "#805DFF",
        cardColor: "#805DFF",
        stripeColor: "#6C45FF",
        statusText: "Status: Available",
        statusPosition: "left-[78px]",
      };
    } else {
      return {
        name:
          profileData?.firstName && profileData?.lastName
            ? `${profileData.firstName} ${profileData.lastName}`
            : "Your Name",
        bio: profileData?.bio || "Your Bio",
        role: "Talent",
        starColor: "#F6BC3F",
        cardColor: "#008B47",
        stripeColor: "#03964E",
        statusText: "Status: Available",
        statusPosition: "left-[98px]",
      };
    }
  };

  const displayData = getDisplayData();

  return (
    <div className="relative h-full flex flex-col bg-white">
      {/* Top Bar with Logo */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 flex-shrink-0 bg-white">
        <img
          src="/logo.png"
          alt="TalentNG Logo"
          className="w-16 h-auto rounded-[3.457px]"
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative min-h-0">
        {/* Welcome Message */}
        <div className="text-center mb-8">
          <h1 className="text-[24px] md:text-[28px] text-black font-medium font-[Inter_Tight] leading-[105%] mb-2">
            Welcome Onboard!
          </h1>
          <p className="text-[14px] md:text-[16px] text-[#666] font-normal font-[Inter_Tight]">
            {isAddingRole
              ? `Your ${displayData.role} role has been added successfully`
              : "Your profile has been created successfully"}
          </p>
        </div>

        {/* Profile Card */}
        <div className="mb-8">
          <div className="relative w-[290px] h-[350px] mx-auto">
            {/* Role-specific Star */}
            <svg
              className="absolute -left-8 top-20 w-16 h-16 md:-left-12 md:w-20 md:h-20 z-40"
              viewBox="0 0 131 131"
              fill="none"
            >
              <path
                d="M65.3129 0L75.4732 55.1526L130.626 65.3129L75.4732 75.4732L65.3129 130.626L55.1526 75.4732L0 65.3129L55.1526 55.1526L65.3129 0Z"
                fill={displayData.starColor}
              />
            </svg>

            {/* User Logo Badge */}
            <div className="absolute top-4 -right-6 md:-right-8 w-[60px] h-[60px] md:w-[70px] md:h-[70px] z-30">
              <img
                src="/logo-2.png"
                alt="Profile"
                className="w-full h-full object-cover object-center rounded-full"
              />
            </div>

            {/* Stack of cards - Background layers */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-full flex flex-col items-center z-0">
              <div className="absolute -bottom-4 w-[203px] h-[33px] rounded-[39.5px] bg-[#ECECEC]"></div>
              <div className="absolute bottom-[-2px] w-[247px] h-[39px] rounded-[39.5px] bg-[#E0E0E0]"></div>
            </div>

            {/* Back Card - Role-specific colored card */}
            <div
              className="absolute w-[290px] h-[328px] top-0 left-0 rounded-[21px] shadow-[1.79px_0_21.48px_rgba(0,0,0,0.25)] overflow-hidden z-10"
              style={{ backgroundColor: displayData.cardColor }}
            >
              {/* Decorative striped pattern */}
              <div className="absolute left-[-13px] top-[185px] w-[277px] h-[162px] flex gap-[16px] rotate-[20.779deg] overflow-hidden">
                {Array.from({ length: 18 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-[8.14px] h-[162px] flex-shrink-0"
                    style={{ backgroundColor: displayData.stripeColor }}
                  />
                ))}
              </div>

              {/* Status badge */}
              <div
                className={`absolute bottom-[12px] ${displayData.statusPosition} text-white text-[13.4px] font-normal font-[Inter_Tight] leading-[120%] capitalize`}
              >
                {displayData.statusText}
              </div>
            </div>

            {/* Front Card - White Profile Card */}
            <div className="absolute w-[290px] h-[289px] top-0 left-0 rounded-[21px] bg-white z-20 flex flex-col shadow-sm border border-gray-100">
              {/* Profile Picture Area */}
              <div className="flex-1 flex flex-col items-center justify-center rounded-[18.7px] bg-[#F5F5F5] m-[8.4px] relative overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover rounded-[18.7px]"
                  />
                ) : (
                  <>
                    {/* Default Avatar Circle */}
                    <div className="w-[87px] h-[87px] rounded-full bg-[#D9D9D9] flex items-center justify-center mb-[11px]">
                      <svg
                        className="w-[52px] h-[52px]"
                        viewBox="0 0 74 74"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M37 18.5C41.1421 18.5 44.5 21.8579 44.5 26C44.5 30.1421 41.1421 33.5 37 33.5C32.8579 33.5 29.5 30.1421 29.5 26C29.5 21.8579 32.8579 18.5 37 18.5ZM37 40.75C46.2025 40.75 53.75 44.5238 53.75 49.25V55.5H20.25V49.25C20.25 44.5238 27.7975 40.75 37 40.75Z"
                          fill="white"
                        />
                      </svg>
                    </div>

                    {/* Profile Text */}
                    <div className="flex flex-col items-center gap-[11px] text-center px-2">
                      <div className="text-[#404040] text-[13.3px] font-medium font-[Inter_Tight] leading-[105%]">
                        Profile Created
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Name and Bio Preview */}
              <div className="flex flex-col justify-center gap-[11px] px-[15px] pb-[15px] pt-0 h-[64px]">
                <div className="text-black text-[16.3px] font-medium font-[Inter_Tight] leading-[105%] truncate">
                  {displayData.name}
                </div>
                <div className="text-[#919191] text-[13px] font-light font-[Inter_Tight] leading-[120%] capitalize truncate">
                  {displayData.bio}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading indicator */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-2 h-2 bg-[#5C30FF] rounded-full animate-pulse"></div>
            <div
              className="w-2 h-2 bg-[#5C30FF] rounded-full animate-pulse"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-2 h-2 bg-[#5C30FF] rounded-full animate-pulse"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
