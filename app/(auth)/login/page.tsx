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
import { decodeJwt } from "@/lib/utils";

import apiClient from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { LoginResponse } from "@/lib/types/auth";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation<LoginResponse, Error, LoginFormValues>({
    mutationFn: async (data: LoginFormValues) => {
      const response = await apiClient<LoginResponse>("/auth/login", {
        method: "POST",
        body: data,
      });
      return response;
    },
    onSuccess: (response) => {
      const { accessToken, user } = response;
      if (accessToken) {
        // Set cookie instead of localStorage
        document.cookie = `accessToken=${accessToken}; path=/; max-age=604800; samesite=lax`; // 7 days
        toast.success("Login successful!");

        const decodedToken = decodeJwt(accessToken);
        if (decodedToken) {
          if (!user.username || decodedToken.role === "general") {
            router.push("/onboarding");
          } else {
            router.push("/dashboard");
          }
        } else {
          toast.error("Could not decode token. Please try logging in again.");
          router.push("/dashboard");
        }
      } else {
        toast.error("Login failed: No access token received.");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Login failed. Please try again.");
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
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
                    Welcome back
                  </h1>
                  <p className="text-gray-500 font-geist text-base font-medium leading-[120%] text-center w-full">
                    Sign in to your Talent.ng account to continue.
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-4 w-full"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter email"
                            {...field}
                            className="h-12 rounded-3xl border-gray-300 text-gray-600"
                            suppressHydrationWarning
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center justify-between px-[14px] h-12 rounded-3xl border border-gray-300 bg-white">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter password"
                              {...field}
                              className="flex-1 text-gray-500 font-geist text-base font-medium bg-transparent border-none outline-none placeholder:text-gray-500"
                              suppressHydrationWarning
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="ml-2 text-gray-500"
                            >
                              {showPassword ? (
                                <EyeOff size={18} />
                              ) : (
                                <Eye size={18} />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Forgot Password Link */}
                  <div className="text-right">
                    <Link
                      href="/forgot-password"
                      className="text-gray-500 font-geist text-sm font-medium hover:text-gray-700 transition-colors underline"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="flex items-center justify-center gap-2.5 px-[14px] py-[14px] rounded-3xl bg-black text-white font-geist text-base font-medium hover:bg-gray-800 transition-colors"
                  >
                    {loginMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </form>
              </Form>
              {/* Divider */}
              <svg
                width="320"
                height="1"
                viewBox="0 0 320 1"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full"
              >
                <path d="M0 0.5H320" stroke="#EAECF0" />
              </svg>
            </div>

            {/* Google Sign In */}
            <button
              onClick={() => {
                window.location.href = `${process.env.NEXT_PUBLIC_TALENTNG_API_URL}/auth/google`;
              }}
              className="flex items-center justify-center gap-2.5 px-[14px] py-[14px] rounded-3xl border border-gray-300 bg-white hover:bg-gray-50 transition-colors w-full"
            >
              <div className="flex items-center gap-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.1713 8.36791H17.5V8.33332H10V11.6667H14.7096C14.0225 13.6071 12.1763 15 10 15C7.23877 15 5.00002 12.7612 5.00002 9.99999C5.00002 7.23874 7.23877 4.99999 10 4.99999C11.2746 4.99999 12.4342 5.48082 13.3171 6.26624L15.6742 3.90916C14.1859 2.52207 12.195 1.66666 10 1.66666C5.39794 1.66666 1.66669 5.39791 1.66669 9.99999C1.66669 14.6021 5.39794 18.3333 10 18.3333C14.6021 18.3333 18.3334 14.6021 18.3334 9.99999C18.3334 9.44124 18.2759 8.89582 18.1713 8.36791Z"
                    fill="#FFC107"
                  />
                  <path
                    d="M2.62744 6.12124L5.36536 8.12916C6.10619 6.29499 7.90036 4.99999 9.99994 4.99999C11.2745 4.99999 12.4341 5.48082 13.317 6.26624L15.6741 3.90916C14.1858 2.52207 12.1949 1.66666 9.99994 1.66666C6.79911 1.66666 4.02327 3.47374 2.62744 6.12124Z"
                    fill="#FF3D00"
                  />
                  <path
                    d="M10 18.3336C12.1525 18.3336 14.1084 17.5099 15.5871 16.1703L13.008 13.9878C12.1433 14.6457 11.0865 15.0015 10 15.0003C7.83255 15.0003 5.99213 13.6182 5.2988 11.6895L2.5813 13.7832C3.96047 16.482 6.7613 18.3336 10 18.3336Z"
                    fill="#4CAF50"
                  />
                  <path
                    d="M18.1712 8.36793H17.5V8.33334H10V11.6667H14.7096C14.3809 12.5902 13.7889 13.3972 13.0067 13.9879L13.0079 13.9871L15.5871 16.1696C15.4046 16.3354 18.3333 14.1667 18.3333 10C18.3333 9.44126 18.2758 9.39584 18.1712 8.36793Z"
                    fill="#1976D2"
                  />
                </svg>
                <span className="text-gray-950 font-geist text-base font-medium">
                  Continue with Google
                </span>
              </div>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center w-full">
            <span className="text-gray-500 font-geist text-base font-normal">
              Don't have an account?{" "}
            </span>
            <Link
              href="/signup"
              className="text-gray-950 font-geist text-base font-semibold underline hover:text-gray-700 transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>

        {/* Terms */}
        <div className="text-center w-full">
          <span className="text-gray-600 font-geist text-sm font-normal">
            By signing in, you agree to our{" "}
          </span>
          <span className="text-gray-950 font-geist text-sm font-semibold">
            Terms and Conditions.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
