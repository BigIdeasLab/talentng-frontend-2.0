"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { login } from "@/lib/api/auth";
import { storeTokens } from "@/lib/auth";
import { COLORS } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ResponsiveFormField } from "@/components/forms/ResponsiveFormField";
import { ResponsiveFormButtons } from "@/components/forms/ResponsiveFormButtons";
import {
  RateLimitNotification,
  useRateLimitHandler,
} from "@/components/ui/RateLimitNotification";
import { isRateLimitError } from "@/lib/utils/rate-limit-handler";

import type { AuthResponse } from "@/lib/api/auth";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { rateLimitError, isRateLimited, handleError, clearRateLimit } =
    useRateLimitHandler();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation<AuthResponse, Error, LoginFormValues>({
    mutationFn: (data: LoginFormValues) => login(data.email, data.password),
    onSuccess: async (response) => {
      if (response.accessToken && response.refreshToken) {
        storeTokens({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          userId: response.userId || "",
        });
      }

      toast.success("Login successful!");

      if (response.needsOnboarding) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    },
    onError: (error: any) => {
      // Check if this is a rate limiting error
      const isRateLimit = handleError(error);

      if (!isRateLimit) {
        // Handle other types of errors with toast
        const message = error.message || "Login failed. Please try again.";
        toast.error(message);
      }
      // Rate limit errors are handled by the RateLimitNotification component
    },
  });

  // OAuth callback is handled by middleware
  // Backend sets cookies directly, frontend receives redirect to dashboard/onboarding
  // No need to extract tokens from URL

  const onSubmit = (data: LoginFormValues) => {
    // Clear any existing rate limit errors when user tries again
    if (isRateLimited) {
      clearRateLimit();
    }
    loginMutation.mutate(data);
  };

  return (
    <div className="relative min-h-screen bg-white overflow-auto">
      {/* Background Image */}
      <img
        src="/backgroundgradient.png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-start md:items-center justify-center px-4 py-6 md:py-8 lg:py-12 md:px-6 lg:px-8">
        <div className="w-full max-w-5xl">
          <div className="bg-white rounded-[20px] md:rounded-[30px] shadow-lg overflow-hidden flex flex-col md:flex-row min-h-[500px] md:h-[600px] mt-4 md:mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 w-full h-full">
              {/* Left Side - Logo */}
              <div className="hidden md:flex flex-col items-center justify-center p-8 lg:p-12 bg-white min-h-[400px] md:min-h-auto">
                <img
                  src="/logo.png"
                  alt="Talent.ng Logo"
                  className="w-full max-w-lg object-contain"
                />
              </div>

              {/* Right Side - Form */}
              <div className="flex flex-col justify-center p-6 md:p-6 lg:p-8 bg-white h-full overflow-y-auto">
                <div className="flex flex-col gap-3 text-sm md:text-base w-full">
                  {/* Header */}
                  <div className="flex flex-col gap-1">
                    <h1 className="text-xl md:text-2xl font-semibold text-black leading-tight">
                      Welcome Back
                    </h1>
                    <p className="text-sm md:text-base font-light text-gray-400 capitalize">
                      let's connect you with opportunities
                    </p>
                  </div>

                  {/* Form */}
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="flex flex-col gap-2"
                    >
                      {/* Rate Limit Notification */}
                      {isRateLimited && rateLimitError && (
                        <RateLimitNotification
                          error={rateLimitError}
                          onRetryEnabled={clearRateLimit}
                          className="mb-2"
                        />
                      )}
                      {/* Email Field */}
                      <ResponsiveFormField fullWidth>
                        <label className="text-xs md:text-sm font-medium text-black">
                          Email Address
                        </label>
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="Youremail@gmail.com"
                                  {...field}
                                  className="h-[53px] rounded-[10px] border-0 bg-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-600"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </ResponsiveFormField>

                      {/* Password Field */}
                      <ResponsiveFormField fullWidth>
                        <label className="text-xs md:text-sm font-medium text-black">
                          Password
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
                                    className="flex-1 bg-transparent border-0 placeholder:text-gray-400 focus:ring-0"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
                                    className="text-gray-500 hover:text-gray-700 min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2"
                                    aria-label={
                                      showPassword
                                        ? "Hide password"
                                        : "Show password"
                                    }
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
                      </ResponsiveFormField>

                      {/* Forgot Password Link */}
                      <div className="text-right">
                        <Link
                          href="/forgot-password"
                          style={{ color: COLORS.primary }}
                          className="text-xs md:text-sm font-medium hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>

                      {/* Continue Button */}
                      <ResponsiveFormButtons fullWidth>
                        <Button
                          type="submit"
                          disabled={loginMutation.isPending || isRateLimited}
                          style={{ backgroundColor: COLORS.primary }}
                          className="h-[48px] rounded-[10px] text-white font-semibold text-sm md:text-base hover:opacity-90 disabled:opacity-50"
                        >
                          {loginMutation.isPending ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : isRateLimited ? (
                            "Please Wait..."
                          ) : (
                            "Continue"
                          )}
                        </Button>
                      </ResponsiveFormButtons>
                    </form>
                  </Form>

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <span className="text-gray-400 text-sm">or</span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                  </div>

                  {/* Google Button */}
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = `${process.env.NEXT_PUBLIC_TALENTNG_API_URL}/auth/google`;
                    }}
                    className="w-full h-[48px] rounded-[10px] bg-gray-100 hover:bg-gray-200 flex items-center justify-center gap-2 transition-colors text-xs md:text-sm"
                  >
                    <img
                      src="/google-icon.svg"
                      alt="Google"
                      className="w-[14px] h-[14px]"
                    />
                    <span className="text-gray-800 font-medium text-base">
                      Continue With Google
                    </span>
                  </button>

                  {/* Apple Button */}
                  <button
                    type="button"
                    className="w-full h-[48px] rounded-[10px] bg-gray-100 hover:bg-gray-200 flex items-center justify-center gap-2 transition-colors text-xs md:text-sm"
                  >
                    <img
                      src="/apple-icon.svg"
                      alt="Apple"
                      className="w-[17px] h-[17px]"
                    />
                    <span className="text-gray-800 font-medium text-base">
                      Continue With Apple
                    </span>
                  </button>

                  {/* Sign Up Link */}
                  <p className="text-center text-xs md:text-sm">
                    <span className="text-gray-400">New here? </span>
                    <Link
                      href="/signup"
                      style={{ color: COLORS.primary }}
                      className="font-medium hover:underline"
                    >
                      Create an account
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

export default Login;
