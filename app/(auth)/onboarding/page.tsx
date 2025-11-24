"use client";

import React, { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Role, ProfileData } from "@/lib/types/onboarding";
import { SelectRoleStep } from "@/components/onboarding/SelectRoleStep";
import { CreateProfileStep } from "@/components/onboarding/CreateProfileStep";
import { ShowcaseSkillsStep } from "@/components/onboarding/ShowcaseSkillsStep";
import { CreateCompanyProfileStep } from "@/components/onboarding/CreateCompanyProfileStep";
import { ShowcaseExpertiseStep } from "@/components/onboarding/ShowcaseExpertiseStep";
import apiClient from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { refetchUser } = useAuth();

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setCurrentStep(2);
  };

  const handleProfileNext = (data: ProfileData) => {
    setProfileData(data);
    setCurrentStep(3);
  };

  const handleFinalSubmit = async (data: any) => {
    setIsLoading(true);
    const finalData = {
      role: selectedRole?.toUpperCase(),
      profile: profileData,
      details: data,
    };

    try {
      await apiClient("/users/me/onboard", {
        method: "POST",
        body: finalData,
      });

      await refetchUser();
      toast({
        title: "Success",
        description: "Your profile has been successfully created.",
      });
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Onboarding Failed",
        description: error.message || "An unknown error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSelectRoleBack = () => {
    router.push("/login");
  };

  const renderStepThree = () => {
    switch (selectedRole) {
      case "talent":
        return (
          <ShowcaseSkillsStep
            onNext={handleFinalSubmit}
            onBack={handleBack}
            profileData={profileData}
            isLoading={isLoading}
          />
        );
      case "employer":
        return (
          <CreateCompanyProfileStep
            onNext={handleFinalSubmit}
            onBack={handleBack}
            isLoading={isLoading}
          />
        );
      case "mentor":
        return (
          <ShowcaseExpertiseStep
            onNext={handleFinalSubmit}
            onBack={handleBack}
            isLoading={isLoading}
          />
        );
      default:
        // Fallback or error state
        return <div>Error: Invalid role selected.</div>;
    }
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
          <div className="h-full flex flex-col overflow-hidden">
            {renderStepThree()}
          </div>
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
