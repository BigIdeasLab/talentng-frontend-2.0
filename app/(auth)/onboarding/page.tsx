"use client";

import React, { useState, Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import apiClient from "@/lib/api";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";

const setUsernameSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .max(50, "Username must not exceed 50 characters.")
    .regex(
      /^[a-z0-9_.-]+$/,
      "Username can only contain lowercase letters, numbers, underscores, hyphens, and periods.",
    )
    .refine((username) => {
      const letterCount = (username.match(/[a-z]/g) || []).length;
      return letterCount >= 3;
    }, "Username must contain at least 3 letters.")
    .refine((username) => {
      const reservedUsernames = [
        "admin",
        "root",
        "talentng",
        "support",
        "moderator",
      ]; // Example reserved words
      return !reservedUsernames.includes(username.toLowerCase());
    }, "This username is reserved. Please choose another."),
});

type SetUsernameFormValues = z.infer<typeof setUsernameSchema>;

const SetUsername = ({
  onNext,
}: {
  onNext: (username: string) => void;
}) => {
  const [usernameInput, setUsernameInput] = useState("");
  const debouncedUsername = useDebounce(usernameInput, 500);
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");

  const form = useForm<SetUsernameFormValues>({
    resolver: zodResolver(setUsernameSchema),
    defaultValues: {
      username: "",
    },
  });

  useEffect(() => {
    const checkUsername = async () => {
      if (debouncedUsername.length > 0) {
        const isValid = await form.trigger("username");
        if (debouncedUsername.length >= 2 && isValid) {
          setUsernameStatus("checking");
          try {
            const isTaken = await apiClient<boolean>(
              `/users/username-taken/${debouncedUsername}`,
            );
            setUsernameStatus(isTaken ? "taken" : "available");
          } catch (error) {
            setUsernameStatus("idle");
            toast.error("Failed to check username availability.");
          }
        } else {
          setUsernameStatus("idle");
        }
      }
    };

    checkUsername();
  }, [debouncedUsername, form]);

  const onSubmit = (data: SetUsernameFormValues) => {
    if (usernameStatus !== "available") {
      toast.error("Please choose an available username.");
      return;
    }
    onNext(data.username);
  };

  return (
    <div className="w-full max-w-[320px] flex flex-col gap-8">
      <div className="flex flex-col items-center gap-4">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/95484ffeaace17b0e40815c0aa78c80490650deb?width=168"
          alt="Talent.ng Logo"
          className="w-[84px] h-[64px]"
        />
        <h1 className="text-black font-geist text-[32px] font-semibold leading-[120%]">
          Choose a Username
        </h1>
        <p className="text-gray-500 font-geist text-base font-medium leading-[120%] text-center">
          You're almost there! Please choose a unique username to complete your
          account setup.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Enter username"
                    {...field}
                    onChange={(e) => {
                      const lowercasedValue = e.target.value.toLowerCase();
                      field.onChange(lowercasedValue);
                      setUsernameInput(lowercasedValue);
                    }}
                    className="h-12 rounded-3xl border-gray-300 text-gray-600"
                  />
                </FormControl>
                <FormMessage />
                {usernameStatus === "checking" && (
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Checking...
                  </p>
                )}
                {usernameStatus === "taken" && (
                  <p className="text-xs text-red-500">
                    Username is already taken.
                  </p>
                )}
                {usernameStatus === "available" && (
                  <p className="text-xs text-green-500">
                    Username is available.
                  </p>
                )}
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={usernameStatus !== "available"}
            className="w-full rounded-3xl"
          >
            Set Username
          </Button>
        </form>
      </Form>
    </div>
  );
};

const SelectRole = ({
  onRoleSelect,
  isLoading,
}: {
  onRoleSelect: (role: "talent" | "mentor") => void;
  isLoading: boolean;
}) => {
  const [selectedRole, setSelectedRole] = useState<"talent" | "mentor" | null>(
    null,
  );

  const handleRoleSelection = (role: "talent" | "mentor") => {
    setSelectedRole(role);
    onRoleSelect(role);
  };

  return (
    <div className="w-full max-w-[320px] flex flex-col gap-16">
      {/* Main Content */}
      <div className="flex flex-col items-center gap-6">
        {/* Header Section */}
        <div className="flex flex-col gap-11 w-full">
          <div className="flex flex-col items-center gap-8">
            {/* Logo and Title */}
            <div className="flex flex-col items-center gap-6 w-full max-w-[297px]">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/95484ffeaace17b0e40815c0aa78c80490650deb?width=168"
                alt="Talent.ng Logo"
                className="w-[84px] h-[64px]"
              />
              <div className="flex flex-col items-center gap-4 w-full">
                <h1 className="text-black font-geist text-[32px] font-semibold leading-[120%]">
                  Select Your Role
                </h1>
                <p className="text-gray-500 font-geist text-base font-medium leading-[120%] text-center w-full">
                  Please choose the role that best describes you.
                </p>
              </div>
            </div>

            {/* Role Selection Buttons */}
            <div className="flex flex-col gap-4 w-full">
              <Button
                onClick={() => handleRoleSelection("talent")}
                disabled={isLoading}
                className="flex items-center justify-center gap-2.5 px-[14px] py-[14px] rounded-3xl border border-gray-300 bg-white text-gray-950 font-geist text-base font-medium hover:bg-gray-50 transition-colors w-full"
              >
                {isLoading && selectedRole === "talent" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                I am a Talent
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Terms */}
      <div className="text-center w-full">
        <span className="text-gray-600 font-geist text-sm font-normal">
          By selecting your role, you agree to our{" "}
        </span>
        <span className="text-gray-950 font-geist text-sm font-semibold">
          Terms and Conditions.
        </span>
      </div>
    </div>
  );
};

const OnboardingPage = () => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const router = useRouter();
  const { refetchUser } = useAuth();

  const onBoardMutation = useMutation({
    mutationFn: (data: { username: string; role: "talent" | "mentor" }) => {
      return apiClient("/users/me/onboard", {
        method: "POST",
        body: data,
      });
    },
    onSuccess: () => {
      toast.success("Onboarding successful!");
      refetchUser();
      router.push("/talent/dashboard");
    },
    onError: (error) => {
      toast.error(
        error.message || "Failed to complete onboarding. Please try again.",
      );
    },
  });

  const handleUsernameSet = (newUsername: string) => {
    setUsername(newUsername);
    setStep(2);
  };

  const handleRoleSelect = (selectedRole: "talent" | "mentor") => {
    onBoardMutation.mutate({ username, role: selectedRole });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <SetUsername onNext={handleUsernameSet} />;
      case 2:
        return (
          <SelectRole
            onRoleSelect={handleRoleSelect}
            isLoading={onBoardMutation.isPending}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">{renderStep()}</div>
    </div>
  );
};

const OnboardingPageWithSuspense = () => (
  <Suspense
    fallback={<Loader2 className="h-8 w-8 animate-spin text-gray-500" />}
  >
    <OnboardingPage />
  </Suspense>
);

export default OnboardingPageWithSuspense;