"use client";
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { resetPassword } from "@/lib/api/auth-service";
import { COLORS } from "@/lib/constants";
import type { AuthResponse } from "@/lib/api/auth-service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const resetPasswordSchema = z.object({
  resetCode: z
    .string()
    .length(6, "Reset code must be exactly 6 digits")
    .regex(/^\d+$/, "Reset code must contain only numbers"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least 1 lowercase letter.")
    .regex(/[0-9]/, "Password must contain at least 1 number."),
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (!emailParam) {
      toast.error("Invalid reset link. Please request a new one.");
      router.push("/forgot-password");
    } else {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams, router]);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      resetCode: "",
      password: "",
    },
  });

  const mutation = useMutation<AuthResponse, Error, ResetPasswordFormValues>({
    mutationFn: (data: ResetPasswordFormValues) =>
      resetPassword(email, data.resetCode, data.password),
    onSuccess: (response) => {
      console.log("✅ Password reset successful");
      console.log("needsOnboarding:", response.needsOnboarding);

      setError("");
      toast.success("Password reset successfully!");
      // Tokens are already stored by resetPassword via auth-service

      if (response.needsOnboarding) {
        console.log("🔄 Redirecting to onboarding");
        router.push("/onboarding");
      } else {
        console.log("🔄 Redirecting to dashboard");
        router.push("/dashboard");
      }
    },
    onError: (error: any) => {
      console.error("Password reset error:", error);
      // Handle specific error messages from backend
      if (error.message && error.message.includes("Invalid reset code")) {
        setError("Invalid code");
      } else if (error.message && error.message.includes("expired")) {
        setError("Code expired");
      }
      toast.error(
        error.message || "Failed to reset password. Please try again.",
      );
    },
  });

  const handleSubmit = (data: ResetPasswordFormValues) => {
    if (!email) {
      toast.error("Email is missing. Please request a new reset code.");
      return;
    }
    setError("");
    mutation.mutate(data);
  };

  const resetCode = form.watch("resetCode");

  return (
    <div className="relative h-screen bg-white overflow-hidden">
      {/* Background Image */}
      <img
        src="/backgroundgradient.png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Content */}
      <div className="relative z-10 h-screen flex items-center justify-center px-3 py-3 md:px-4 lg:px-6 overflow-hidden">
        <div className="w-full max-w-5xl max-h-full">
          <div className="bg-white rounded-[30px] shadow-lg overflow-hidden h-[600px] flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 h-full">
              {/* Left Side - Logo */}
              <div className="hidden md:flex flex-col items-center justify-center p-8 lg:p-12 bg-white overflow-hidden">
                <img
                  src="/logo.png"
                  alt="Talent.ng Logo"
                  className="w-full max-w-lg object-contain"
                />
              </div>

              {/* Right Side - Form */}
              <div className="flex flex-col justify-center p-4 md:p-6 lg:p-8 bg-white overflow-y-auto h-full">
                <div className="flex flex-col gap-3">
                  {/* Lock Icon */}
                  <svg
                    width="45"
                    height="45"
                    viewBox="0 0 60 60"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="60" height="60" rx="12" fill="#F5F5F5" />
                    <path
                      d="M30 18C26.6863 18 24 20.6863 24 24V28H22C20.8954 28 20 28.8954 20 30V42C20 43.1046 20.8954 44 22 44H38C39.1046 44 40 43.1046 40 42V30C40 28.8954 39.1046 28 38 28H36V24C36 20.6863 33.3137 18 30 18ZM26 24C26 21.7909 27.7909 20 30 20C32.2091 20 34 21.7909 34 24V28H26V24ZM22 30H38V42H22V30ZM30 34C30.5523 34 31 34.4477 31 35V39C31 39.5523 30.5523 40 30 40C29.4477 40 29 39.5523 29 39V35C29 34.4477 29.4477 34 30 34Z"
                      fill={COLORS.primary}
                    />
                  </svg>

                  {/* Header */}
                  <div className="flex flex-col gap-1">
                    <h1 className="text-xl md:text-2xl font-semibold text-black leading-tight">
                      Reset Password
                    </h1>
                    <p className="text-xs md:text-sm font-light text-gray-400">
                      Enter the 6-digit code we sent to{" "}
                      <span className="font-semibold text-gray-400">
                        {email}
                      </span>
                    </p>
                  </div>

                  {/* Form */}
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(handleSubmit)}
                      className="flex flex-col gap-2"
                    >
                      {/* Reset Code Field */}
                      <FormField
                        control={form.control}
                        name="resetCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="flex flex-col gap-2.5">
                                <div
                                  className={`flex justify-center items-center rounded-[10px] py-[5px] px-[54px] ${
                                    error
                                      ? "bg-[#E63C231A]"
                                      : mutation.isSuccess
                                        ? "bg-[#008B471A]"
                                        : "bg-[#F5F5F5]"
                                  }`}
                                  style={{
                                    backgroundColor: mutation.isSuccess
                                      ? `${COLORS.success}1A`
                                      : undefined,
                                  }}
                                >
                                  <InputOTP maxLength={6} {...field}>
                                    <InputOTPGroup className="flex items-center gap-0">
                                      {[0, 1, 2, 3, 4, 5].map((index) => (
                                        <InputOTPSlot
                                          key={index}
                                          index={index}
                                          className={`w-[50px] h-[50px] border-0 bg-transparent flex items-center justify-center text-[30px] font-semibold font-inter-tight ${
                                            error
                                              ? "text-[#E63C23]"
                                              : mutation.isSuccess
                                                ? "text-black"
                                                : "text-black"
                                          }`}
                                          style={{
                                            color: mutation.isSuccess
                                              ? COLORS.success
                                              : undefined,
                                          }}
                                        />
                                      ))}
                                    </InputOTPGroup>
                                  </InputOTP>
                                </div>
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {/* Password Field */}
                      <div className="flex flex-col gap-2 mt-2">
                        <label className="text-xs md:text-sm font-medium text-black">
                          New Password
                        </label>
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="relative h-[53px] rounded-[10px] bg-gray-100 flex items-center px-4">
                                  <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Your Password"
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      setPassword(e.target.value);
                                    }}
                                    className="flex-1 bg-transparent border-0 placeholder:text-gray-400 focus:ring-0"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
                                    className="text-gray-500 hover:text-gray-700"
                                  >
                                    {showPassword ? (
                                      <EyeOff size={20} />
                                    ) : (
                                      <Eye size={20} />
                                    )}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Password Requirements Checklist */}
                        {password && (
                          <div className="bg-gray-50 p-3 rounded-[10px] flex flex-wrap gap-3">
                            <div className="flex items-center gap-1 text-xs">
                              <span
                                className={
                                  passwordChecks.length
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                              >
                                {passwordChecks.length ? "✓" : "○"}
                              </span>
                              <span
                                className={
                                  passwordChecks.length
                                    ? "text-gray-700"
                                    : "text-gray-500"
                                }
                              >
                                8 chars
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <span
                                className={
                                  passwordChecks.uppercase
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                              >
                                {passwordChecks.uppercase ? "✓" : "○"}
                              </span>
                              <span
                                className={
                                  passwordChecks.uppercase
                                    ? "text-gray-700"
                                    : "text-gray-500"
                                }
                              >
                                A-Z
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <span
                                className={
                                  passwordChecks.lowercase
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                              >
                                {passwordChecks.lowercase ? "✓" : "○"}
                              </span>
                              <span
                                className={
                                  passwordChecks.lowercase
                                    ? "text-gray-700"
                                    : "text-gray-500"
                                }
                              >
                                a-z
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <span
                                className={
                                  passwordChecks.number
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                              >
                                {passwordChecks.number ? "✓" : "○"}
                              </span>
                              <span
                                className={
                                  passwordChecks.number
                                    ? "text-gray-700"
                                    : "text-gray-500"
                                }
                              >
                                0-9
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Reset Button */}
                      <Button
                        type="submit"
                        disabled={
                          mutation.isPending ||
                          !email ||
                          !isPasswordValid ||
                          resetCode.length !== 6
                        }
                        style={{ backgroundColor: COLORS.primary }}
                        className="w-full h-[48px] rounded-[10px] text-white font-semibold text-sm md:text-base mt-1 hover:opacity-90 disabled:opacity-50"
                      >
                        {mutation.isPending ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          "Reset Password"
                        )}
                      </Button>
                    </form>
                  </Form>

                  {/* Back to Login Link */}
                  <p className="text-center text-xs md:text-sm">
                    <span className="text-gray-400">
                      Remember your password?{" "}
                    </span>
                    <Link
                      href="/login"
                      style={{ color: COLORS.primary }}
                      className="font-medium hover:underline"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function ResetPasswordWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPassword />
    </Suspense>
  );
}

export default ResetPasswordWrapper;
