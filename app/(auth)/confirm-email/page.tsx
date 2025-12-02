"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { verifyEmailSend, verifyEmailConfirm } from "@/lib/api";
import { setCookie } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

const confirmEmailSchema = z.object({
  verificationCode: z
    .string()
    .min(6, "Your one-time password must be 6 characters."),
});

type ConfirmEmailFormValues = z.infer<typeof confirmEmailSchema>;

const ConfirmEmailPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setEmail(params.get("email") || "");
  }, []);

  const form = useForm<ConfirmEmailFormValues>({
    resolver: zodResolver(confirmEmailSchema),
    defaultValues: {
      verificationCode: "",
    },
  });

  React.useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(
        () => setResendCountdown(resendCountdown - 1),
        1000,
      );
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const resendMutation = useMutation({
    mutationFn: () => verifyEmailSend(email),
    onSuccess: () => {
      toast.success("Verification code resent!");
      setResendCountdown(30);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to resend verification code.");
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ConfirmEmailFormValues) =>
      verifyEmailConfirm(email, data.verificationCode),
    onSuccess: (data: any) => {
      setError("");
      toast.success("Email verified successfully!");

      // Store access token
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        setCookie("accessToken", data.accessToken);
      }

      // Store user data
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Navigate based on onboarding status
      if (data.needsOnboarding) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    },
    onError: (error: any) => {
      setError("Wrong Code");
      toast.error(error.message || "An error occurred. Please try again.");
    },
  });

  const onSubmit = (data: ConfirmEmailFormValues) => {
    setError("");
    mutation.mutate(data);
  };

  // Auto-submit when 6 digits are entered
  const verificationCode = form.watch("verificationCode");
  React.useEffect(() => {
    // Clear error when user starts typing
    if (verificationCode.length > 0 && error) {
      setError("");
    }

    if (verificationCode.length === 6) {
      onSubmit({ verificationCode });
    }
  }, [verificationCode]);

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
                  {/* Gmail Icon */}
                  <svg
                    width="45"
                    height="45"
                    viewBox="0 0 60 60"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0)">
                      <path
                        d="M45.9375 0H14.0625C6.296 0 0 6.296 0 14.0625V45.9375C0 53.704 6.296 60 14.0625 60H45.9375C53.704 60 60 53.704 60 45.9375V14.0625C60 6.296 53.704 0 45.9375 0Z"
                        fill="#F4F2ED"
                      />
                      <path
                        d="M9.75844 47.5873H17.2158V29.4764L6.5625 21.4866V44.3913C6.5625 46.1597 7.99547 47.5873 9.75844 47.5873Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M42.7842 47.5873H50.2418C52.0101 47.5873 53.4377 46.1543 53.4377 44.3913V21.4863L42.7842 29.4764"
                        fill="#34A853"
                      />
                      <path
                        d="M42.7842 15.6269V29.4763L53.4377 21.4865V17.2246C53.4377 13.2724 48.926 11.0191 45.7673 13.3895"
                        fill="#FBBC04"
                      />
                      <path
                        d="M17.2158 29.4764V15.6272L29.9998 25.2148L42.7838 15.6267V29.4762L29.9998 39.0644"
                        fill="#EA4335"
                      />
                      <path
                        d="M6.5625 17.2249V21.4863L17.2158 29.4763V15.6271L14.2329 13.3898C11.0688 11.0193 6.5625 13.2726 6.5625 17.2249Z"
                        fill="#C5221F"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0">
                        <rect width="60" height="60" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>

                  {/* Header */}
                  <div className="flex flex-col gap-1">
                    <h1 className="text-xl md:text-2xl font-semibold text-black leading-tight">
                      Check your inbox
                    </h1>
                    <p className="text-xs md:text-sm font-light text-gray-400">
                      We just sent a 6-digit code to{" "}
                      <span className="font-semibold text-gray-400">
                        {email}
                      </span>
                    </p>
                  </div>

                  {/* Form */}
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="flex flex-col gap-2"
                    >
                      {/* OTP Input */}
                      <FormField
                        control={form.control}
                        name="verificationCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="flex flex-col gap-2.5">
                                {error && (
                                  <p className="text-[#E63C23] text-center text-[15px] font-normal font-inter-tight">
                                    {error}
                                  </p>
                                )}
                                <div
                                  className={`flex justify-center items-center rounded-[10px] py-[5px] px-[54px] ${
                                    error
                                      ? "bg-[#E63C231A]"
                                      : mutation.isSuccess
                                      ? "bg-[#008B471A]"
                                      : "bg-[#F5F5F5]"
                                  }`}
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
                                              ? "text-[#008B47]"
                                              : "text-black"
                                          }`}
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
                    </form>
                  </Form>

                  {/* Resend Link */}
                  <p className="text-center text-xs md:text-sm">
                    <span className="text-gray-400">Didn't get it? </span>
                    <button
                      onClick={() => resendMutation.mutate()}
                      disabled={resendCountdown > 0 || resendMutation.isPending}
                      className="text-[#5C30FF] font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {resendCountdown > 0
                        ? `Resend in ${resendCountdown}s`
                        : "Resend code"}
                    </button>
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

export default ConfirmEmailPage;
