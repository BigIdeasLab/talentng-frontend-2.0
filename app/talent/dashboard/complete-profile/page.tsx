"use client";

import React, { useState, useEffect, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { profileSchema, ProfileFormValues } from "@/lib/validations/profile";
import { useAuth } from "@/hooks/use-auth";
import apiClient from "@/lib/api";

import { BasicInfoStep } from "@/components/CompleteProfile/BasicInfoStep";
import { SkillsExperienceStep } from "@/components/CompleteProfile/SkillsExperienceStep";
import { AvailabilityLocationStep } from "@/components/CompleteProfile/AvailabilityLocationStep";
import { PortfolioUploadStep } from "@/components/CompleteProfile/PortfolioUploadStep";
import { BestWorkUploadStep } from "@/components/CompleteProfile/BestWorkUploadStep";
import { TalentProfile } from "@/lib/types/profile";

// Step definition
const steps = [
  {
    id: 1,
    name: "Basic Info",
    Component: BasicInfoStep,
    fields: ["fullName", "bio", "profileImageUrl"],
  },
  {
    id: 2,
    name: "Skills & Experience",
    Component: SkillsExperienceStep,
    fields: [
      "skills",
      "headline",
      "workExperience",
      "company",
      "duration",
      "description",
    ],
  },
  {
    id: 3,
    name: "Upload Portfolio",
    Component: PortfolioUploadStep,
    fields: ["portfolioItems"],
  },
  {
    id: 4,
    name: "Availability & Location",
    Component: AvailabilityLocationStep,
    fields: ["availability", "location", "links"],
  },
  {
    id: 5,
    name: "Upload your best work",
    Component: BestWorkUploadStep,
    fields: ["gallery"],
  },
];

export default function CompleteProfile() {
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [visibleSteps, setVisibleSteps] = useState(steps);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { data: profile, isLoading: profileLoading } = useQuery<TalentProfile>({
    queryKey: ["talent-profile", user?.id],
    queryFn: () => apiClient("/talent/me"),
    enabled: !!user,
    refetchOnMount: "always",
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      profileImageUrl: "",
      headline: "",
      bio: "",
      skills: "",
      workExperience: "",
      company: "",
      duration: "",
      description: "",
      availability: undefined,
      location: "",
      links: { github: "", linkedin: "" },
      portfolioItems: [],
      gallery: [],
    },
  });

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (profile) {
      if (isInitialMount.current) {
        // Reset form with user data
        form.reset({
          fullName: profile.fullName || "",
          profileImageUrl: profile.profileImageUrl || "",
          headline: profile.headline || "",
          bio: profile.bio || "",
          skills: Array.isArray(profile.skills) ? profile.skills.join(", ") : "",
          workExperience: Array.isArray(profile.workExperience)
            ? profile.workExperience.join(", ")
            : "",
          company: profile.company || "",
          duration: profile.duration || "",
          description: profile.description || "",
          availability: profile.availability || undefined,
          location: profile.location || "",
          links: profile.links || { github: "", linkedin: "" },
          portfolioItems: profile.portfolioItems || [],
          gallery: profile.gallery || [],
        });

        // Filter out completed steps
        const filteredSteps = steps.filter((step) => {
          return !step.fields.every((field) => {
            const value = profile[field as keyof TalentProfile];
            if (Array.isArray(value)) {
              return value.length > 0;
            }
            return !!value;
          });
        });

        if (filteredSteps.length === 0) {
          router.push("/talent/dashboard");
        } else {
          setVisibleSteps(filteredSteps);
          setCurrentStepIndex(0);
        }
        isInitialMount.current = false;
      }
    }
  }, [profile, form, router]);

  const currentStep = visibleSteps[currentStepIndex];
  const totalVisibleSteps = visibleSteps.length;

  const profileUpdateMutation = useMutation({
    mutationFn: (data: ProfileFormValues) => {
      const { gallery, ...rest } = data;
      const payload = {
        ...rest,
        skills:
          typeof data.skills === "string"
            ? data.skills.split(",").map((s) => s.trim())
            : [],
      };
      console.log("Payload being sent to server:", payload);
      return apiClient("/talent/me", {
        method: "PATCH",
        body: payload,
      });
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["talent-profile", user?.id] });
      router.push("/talent/dashboard");
      // refetchUser(); // Consider if you need to refetch user data from useAuth
    },
    onError: (error) => {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile. Please try again.");
    },
  });

  const handleNext = async () => {
    const fieldsToValidate = currentStep.fields as (keyof ProfileFormValues)[];
    const isValid = await form.trigger(fieldsToValidate);

    if (isValid) {
      if (currentStepIndex < totalVisibleSteps - 1) {
        setCurrentStepIndex(currentStepIndex + 1);
      } else {
        // This is the last step, so we submit the rest of the form
        await form.handleSubmit((data) => profileUpdateMutation.mutate(data))();
      }
    } else {
      toast.error("Please fill in all required fields correctly.");
    }
  };

  const onSubmit = (data: ProfileFormValues) => {
    profileUpdateMutation.mutate(data);
  };

  if (authLoading || profileLoading) {
    return <div className="p-8">Loading profile...</div>;
  }

  if (!currentStep) {
    return <div className="p-8">Redirecting to dashboard...</div>;
  }

  const { Component } = currentStep;

  const isLastStep = currentStepIndex === totalVisibleSteps - 1;

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-8">
      <div className="max-w-2xl">
        <div className="space-y-4 mb-8">
          <div className="text-base font-medium text-black font-geist">
            Step {(currentStepIndex + 1).toString().padStart(2, "0")}/
            {totalVisibleSteps.toString().padStart(2, "0")}
          </div>
          <h2 className="text-2xl font-medium text-black font-geist">
            {currentStep.name}
          </h2>
          <p className="text-base font-medium text-gray-500 font-geist">
            Setup your profile for this workspace
          </p>
        </div>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Component form={form} onNext={handleNext} userId={user?.id} isLastStep={isLastStep} />
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
