"use client";

import React, { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Role, ProfileData } from "@/lib/types/onboarding";
import { SelectRoleStep } from "@/components/onboarding/SelectRoleStep";
import { CreateProfileStep } from "@/components/onboarding/CreateProfileStep";
import { ShowcaseSkillsStep } from "@/components/onboarding/ShowcaseSkillsStep";
import { ShowcaseExpertiseStep } from "@/components/onboarding/ShowcaseExpertiseStep";
import { CompanyProfileStep } from "@/components/onboarding/CompanyProfileStep";
import { CompanyDetailsStep } from "@/components/onboarding/CompanyDetailsStep";
import { MentorProfileStep } from "@/components/onboarding/MentorProfileStep";
import { MentorExpertiseStep } from "@/components/onboarding/MentorExpertiseStep";
import { useCompleteOnboarding } from "@/hooks/useUserApi";
import { useToast, useAuth } from "@/hooks";
import { useTokenRefresh } from "@/hooks/useTokenRefresh";
import { getServerCurrentProfile } from "@/lib/api/talent/server";
import { getServerCurrentRecruiterProfile } from "@/lib/api/recruiter/server";
import { getServerCurrentMentorProfile } from "@/lib/api/mentor/server";
import { TokenStorage } from "./token-storage";

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | undefined>();
  const [companyData, setCompanyData] = useState<any | undefined>();
  const [companyDetailsData, setCompanyDetailsData] = useState<
    any | undefined
  >();
  const [mentorData, setMentorData] = useState<any | undefined>();
  const [mentorExpertiseData, setMentorExpertiseData] = useState<
    any | undefined
  >();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [completedRoles, setCompletedRoles] = useState<string[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { refetchUser, user } = useAuth();
  const completeOnboardingMutation = useCompleteOnboarding();
  const { ensureValidTokenBeforeOperation } = useTokenRefresh();

  // OAuth callback is handled by middleware
  // Backend sets cookies directly, frontend receives redirect to onboarding
  // No need to extract tokens from URL

  // Check if we're in "add role" mode
  const isAddingRole = searchParams.get("mode") === "add-role";

  // Fetch completed profile statuses when in add-role mode
  useEffect(() => {
    if (isAddingRole) {
      const fetchCompletedRoles = async () => {
        setIsLoadingRoles(true);
        const completed: string[] = [];

        try {
          const talentResponse = await getServerCurrentProfile();
          if (talentResponse?.isProfileCreated) {
            completed.push("talent");
          }
        } catch {
          // Profile doesn't exist or error occurred
        }

        try {
          const recruiterResponse = await getServerCurrentRecruiterProfile();
          if (recruiterResponse?.isProfileCreated) {
            completed.push("recruiter");
          }
        } catch {
          // Profile doesn't exist or error occurred
        }

        try {
          const mentorResponse = await getServerCurrentMentorProfile();
          if (mentorResponse?.isProfileCreated) {
            completed.push("mentor");
          }
        } catch {
          // Profile doesn't exist or error occurred
        }

        setCompletedRoles(completed);
        setIsLoadingRoles(false);
      };

      fetchCompletedRoles();
    }
  }, [isAddingRole]);

  // Get existing roles from query params (passed from ProfileSwitcher) or user data
  // These are just the roles the user has permission to use
  const rolesFromParams = searchParams.get("roles");
  const userRoles = rolesFromParams
    ? rolesFromParams.split(",").map((role) => role.toLowerCase())
    : (user?.roles || []).map((role) => role.toLowerCase());

  // Only show completed roles (those with isProfileCreated: true)
  // This should be updated based on profile data from useProfileData
  // For now, just use userRoles as fallback
  const existingRoles = userRoles;

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

  const handleCompanyProfileNext = (data: any, logo?: File) => {
    setCompanyData(data);
    if (logo) {
      setProfileImage(logo);
    }
    setCurrentStep(3);
  };

  const handleMentorProfileNext = (data: any, logo?: File) => {
    setMentorData(data);
    if (logo) {
      setProfileImage(logo);
    }
    setCurrentStep(3);
  };

  const handleMentorExpertiseNext = async (data: any) => {
    setMentorExpertiseData(data);
    setIsLoading(true);
    try {

      const formData = new FormData();

      const roleValue: "TALENT" | "RECRUITER" | "MENTOR" = "MENTOR";
      formData.append("role", roleValue);

      if (!mentorData) {
        throw new Error("Mentor profile data is missing");
      }

      // Profile contains: username, firstName, lastName, location, bio
      const profileData = {
        username: mentorData.username,
        firstName: mentorData.firstName,
        lastName: mentorData.lastName,
        location: mentorData.location,
        bio: mentorData.bio,
      };

      // Details contains: expertise, experience, mentorshipStyle, linkedIn
      const detailsData = {
        expertise: Array.isArray(data.expertise)
          ? data.expertise
          : [data.expertise],
        experience: data.experience,
        mentorshipStyle: data.mentorshipStyle,
        linkedIn: data.linkedIn,
      };

      formData.append("profile", JSON.stringify(profileData));
      formData.append("details", JSON.stringify(detailsData));

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const response = await completeOnboardingMutation.mutateAsync(formData);

      toast({
        title: "Success",
        description: isAddingRole
          ? "Your new role has been successfully added."
          : "Your profile has been successfully created.",
      });

      // USE RESPONSE to update user state immediately
      // This updates TWO places so ProfileSwitcher and useAuth both see the new roles:
      // 1. React Query cache (for useAuth hook)
      // 2. localStorage (for useProfile/ProfileSwitcher)
      if (response?.roles) {
        queryClient.setQueryData(["user"], response);
        localStorage.setItem("userRoles", response.roles.join(","));
        // Small delay to ensure localStorage is written before redirect
        await new Promise((resolve) => setTimeout(resolve, 100));
      } else {
        refetchUser();
      }

      // If adding a role, redirect with the new role selected
      if (isAddingRole) {
        const newRole =
          selectedRole === "employer" ? "recruiter" : selectedRole;
        router.push(`/dashboard?switchRole=${newRole}`);
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      let errorMessage = "An unknown error occurred.";

      if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      const isTimeoutError =
        errorMessage.toLowerCase().includes("timeout") ||
        errorMessage.toLowerCase().includes("transaction");

      if (isTimeoutError) {
        toast({
          variant: "destructive",
          title: "Request Timeout",
          description:
            "The request took too long to process. Please try again or contact support if the problem persists.",
          duration: 10000,
        });
      } else {
        toast({
          variant: "destructive",
          title: isAddingRole ? "Failed to add role" : "Onboarding Failed",
          description: errorMessage,
          duration: 5000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompanyDetailsNext = async (data: any, logo?: File) => {
    setCompanyDetailsData(data);
    if (logo) {
      setProfileImage(logo);
    }
    // Trigger final submission for employer
    setIsLoading(true);
    try {
      // Prepare FormData for multipart/form-data request
      const formData = new FormData();

      // Add role - map "employer" to "RECRUITER" for API
      let roleValue: "TALENT" | "RECRUITER" | "MENTOR";
      if (selectedRole === "employer") {
        roleValue = "RECRUITER";
      } else {
        roleValue = selectedRole?.toUpperCase() as "TALENT" | "MENTOR";
      }
      formData.append("role", roleValue);

      // Separate profile and company details
      if (!companyData) {
        throw new Error("Company profile data is missing");
      }

      // Profile contains: username, location, bio
      const profileData = {
        username: companyData.username,
        location: companyData.location,
        bio: companyData.bio,
      };

      // Details contains: companyName, industry, companySize, companyStage, operatingModel, website
      const detailsData: any = {
        companyName: companyData.companyName,
        industry: companyData.industry,
        companySize: data.companySize,
        companyStage: data.companyStage,
        operatingModel: data.operatingModel,
      };

      // Add website if provided
      if (data.website) {
        detailsData.website = data.website;
      }

      formData.append("profile", JSON.stringify(profileData));
      formData.append("details", JSON.stringify(detailsData));

      // Add company logo if provided (optional)
      if (logo) {
        formData.append("profileImage", logo);
      }

      const response = await completeOnboardingMutation.mutateAsync(formData);

      toast({
        title: "Success",
        description: isAddingRole
          ? "Your new role has been successfully added."
          : "Your profile has been successfully created.",
      });

      // USE RESPONSE to update user state immediately
      // This updates TWO places so ProfileSwitcher and useAuth both see the new roles:
      // 1. React Query cache (for useAuth hook)
      // 2. localStorage (for useProfile/ProfileSwitcher)
      if (response?.roles) {
        queryClient.setQueryData(["user"], response);
        localStorage.setItem("userRoles", response.roles.join(","));
      } else {
        refetchUser();
      }

      // Get the role value for redirect
      let redirectRole = selectedRole;
      if (selectedRole === "employer") {
        redirectRole = "recruiter";
      }

      // If adding a role, redirect with the new role selected
      if (isAddingRole) {
        router.push(`/dashboard?switchRole=${redirectRole}`);
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      let errorMessage = "An unknown error occurred.";

      if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      const isTimeoutError =
        errorMessage.toLowerCase().includes("timeout") ||
        errorMessage.toLowerCase().includes("transaction");

      if (isTimeoutError) {
        toast({
          variant: "destructive",
          title: "Request Timeout",
          description:
            "The request took too long to process. Please try again or contact support if the problem persists.",
          duration: 10000,
        });
      } else {
        toast({
          variant: "destructive",
          title: isAddingRole ? "Failed to add role" : "Onboarding Failed",
          description: errorMessage,
          duration: 5000,
        });
      }
    } finally {
      setIsLoading(false);
    }
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
    if (selectedRole === "employer") {
      if (!companyData || !companyDetailsData) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Company data is missing.",
        });
        setIsLoading(false);
        return;
      }
      // Profile contains: username, location, bio
      const profileDataForSubmit = {
        username: companyData.username,
        location: companyData.location,
        bio: companyData.bio,
      };
      formData.append("profile", JSON.stringify(profileDataForSubmit));

      // Details contains: companyName, industry, companySize, companyStage, operatingModel
      const detailsDataForSubmit = {
        companyName: companyData.companyName,
        industry: companyData.industry,
        companySize: companyDetailsData.companySize,
        companyStage: companyDetailsData.companyStage,
        operatingModel: companyDetailsData.operatingModel,
      };
      formData.append("details", JSON.stringify(detailsDataForSubmit));
    } else {
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
      formData.append("details", JSON.stringify(data));
    }

    // Add profile image if provided (optional)
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    try {
      const response = await completeOnboardingMutation.mutateAsync(formData);

      toast({
        title: "Success",
        description: isAddingRole
          ? "Your new role has been successfully added."
          : "Your profile has been successfully created.",
      });

      // USE RESPONSE to update user state immediately
      // This updates TWO places so ProfileSwitcher and useAuth both see the new roles:
      // 1. React Query cache (for useAuth hook)
      // 2. localStorage (for useProfile/ProfileSwitcher)
      if (response?.roles) {
        queryClient.setQueryData(["user"], response);
        localStorage.setItem("userRoles", response.roles.join(","));
      } else {
        refetchUser();
      }

      // Get the role value for redirect
      let redirectRole = selectedRole;
      if (selectedRole === "employer") {
        redirectRole = "recruiter";
      }

      // If adding a role, redirect with the new role selected
      if (isAddingRole) {
        router.push(`/dashboard?switchRole=${redirectRole}`);
      } else {
        router.push("/dashboard");
      }
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
          description:
            "The request took too long to process. Please try again or contact support if the problem persists.",
          duration: 10000,
        });
      } else {
        toast({
          variant: "destructive",
          title: isAddingRole ? "Failed to add role" : "Onboarding Failed",
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
    if (isAddingRole) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
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
          <CompanyDetailsStep
            onNext={handleCompanyDetailsNext}
            onBack={handleBack}
            isLoading={isLoading}
            logoImage={profileImage || undefined}
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
              existingRoles={isAddingRole ? completedRoles : existingRoles}
              isAddingRole={isAddingRole}
              isLoadingRoles={isAddingRole && isLoadingRoles}
            />
          </div>
        )}
        {currentStep === 2 && (
          <div className="h-full flex flex-col overflow-hidden">
            {selectedRole === "employer" ? (
              <CompanyProfileStep
                onNext={handleCompanyProfileNext}
                onBack={handleBack}
                initialData={companyData}
                initialLogo={profileImage as File | undefined}
                isAddingRole={isAddingRole}
                currentUsername={user?.username}
              />
            ) : selectedRole === "mentor" ? (
              <MentorProfileStep
                onNext={handleMentorProfileNext}
                onBack={handleBack}
                initialData={mentorData}
                initialLogo={profileImage as File | undefined}
                isAddingRole={isAddingRole}
                currentUsername={user?.username}
              />
            ) : (
              <CreateProfileStep
                onNext={handleProfileNext}
                onBack={handleBack}
                initialData={profileData}
                initialImage={profileImage as File | undefined}
                isAddingRole={isAddingRole}
                currentUsername={user?.username}
              />
            )}
          </div>
        )}
        {currentStep === 3 && (
          <div className="h-full flex flex-col overflow-hidden">
            {selectedRole === "employer" ? (
              <CompanyDetailsStep
                onNext={handleCompanyDetailsNext}
                onBack={handleBack}
                isLoading={isLoading}
                logoImage={profileImage as File | undefined}
                companyData={companyData}
              />
            ) : selectedRole === "mentor" ? (
              <MentorExpertiseStep
                onNext={handleMentorExpertiseNext}
                onBack={handleBack}
                isLoading={isLoading}
                profileData={mentorData}
                profileImage={profileImage as File | undefined}
              />
            ) : (
              renderStepThree()
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const OnboardingPageWithSuspense = () => (
  <>
    <TokenStorage />
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      }
    >
      <OnboardingPage />
    </Suspense>
  </>
);

export default OnboardingPageWithSuspense;
