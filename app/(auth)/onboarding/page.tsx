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
import { completeOnboarding } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | undefined>();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { refetchUser } = useAuth();

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setCurrentStep(2);
  };

  const handleProfileNext = (data: ProfileData, image?: File) => {
    setProfileData(data);
    if (image) {
      setProfileImage(image);
    }
    setCurrentStep(3);
  };

  const handleFinalSubmit = async (data: any) => {
    setIsLoading(true);

    // Prepare FormData for multipart/form-data request
    const formData = new FormData();

    // Add role - map "employer" to "RECRUITER" for API
    let roleValue: "TALENT" | "RECRUITER" | "MENTOR";
    if (selectedRole === "employer") {
      roleValue = "RECRUITER";
    } else if (selectedRole) {
      roleValue = selectedRole.toUpperCase() as "TALENT" | "MENTOR";
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a role.",
      });
      setIsLoading(false);
      return;
    }
    formData.append("role", roleValue);

    // Add profile as JSON string
    if (!profileData) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Profile data is missing.",
      });
      setIsLoading(false);
      return;
    }
    formData.append("profile", JSON.stringify(profileData));

    // Add details as JSON string
    formData.append("details", JSON.stringify(data));

    // Add profile image if provided (optional)
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    console.log("[Onboarding] Sending payload:", {
      role: roleValue,
      profile: profileData,
      details: data,
      hasProfileImage: !!profileImage,
    });

    // Debug: Log FormData contents
    console.log("[Onboarding] FormData contents:");
    Array.from(formData.entries()).forEach(([key, value]) => {
      console.log(`  ${key}:`, typeof value === 'string' ? value : `[${value.constructor.name}]`);
    });

    try {
      await completeOnboarding(formData);

      await refetchUser();
      toast({
        title: "Success",
        description: "Your profile has been successfully created.",
      });
      router.push("/dashboard");
    } catch (error: any) {
      // Extract error message, handling both Error objects and API error responses
      let errorMessage = "An unknown error occurred.";

      if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      // Check if it's a timeout/transaction error and provide actionable feedback
      const isTimeoutError =
        errorMessage.toLowerCase().includes("timeout") ||
        errorMessage.toLowerCase().includes("transaction");

      if (isTimeoutError) {
        toast({
          variant: "destructive",
          title: "Request Timeout",
          description: "The request took too long to process. Please try again or contact support if the problem persists.",
          duration: 10000,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Onboarding Failed",
          description: errorMessage,
          duration: 5000,
        });
      }
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
            profileImage={profileImage || undefined}
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
    <div className="relative min-h-screen flex flex-col items-center justify-center px-3 py-8 md:px-4 lg:px-6 w-full bg-white overflow-auto">
      {/* Background Image */}
      <img
        src="/backgroundgradient.png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Content */}
      <div className="bg-white rounded-[30px] shadow-lg overflow-hidden w-full max-w-5xl z-10 h-[600px] flex flex-col">
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
            <CreateProfileStep 
              onNext={handleProfileNext} 
              onBack={handleBack}
              initialData={profileData}
              initialImage={profileImage as File | undefined}
            />
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
