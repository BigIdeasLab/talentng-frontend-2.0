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
        document.cookie = `accessToken=${accessToken}; path=/; max-age=604800; samesite=lax`;
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
    <div className="relative h-screen bg-white overflow-hidden">
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
      <div className="relative z-10 h-screen flex items-center justify-center px-3 py-3 md:px-4 lg:px-6 overflow-hidden">
        <div className="w-full max-w-5xl max-h-full">
          <div className="bg-white rounded-[30px] shadow-lg overflow-hidden max-h-[calc(100vh-24px)] flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 h-full">
              {/* Left Side - Logo */}
              <div className="hidden md:flex flex-col items-center justify-center p-8 lg:p-12 bg-white overflow-hidden">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/ecad5cb9cbb17ee75c4a3aee33c69b88431f60fc?width=1224"
                  alt="Talent.ng Logo"
                  className="w-full max-w-md object-contain rounded-[22px] shadow-md"
                />
              </div>

              {/* Right Side - Form */}
              <div className="flex flex-col justify-center p-6 md:p-8 lg:p-10 bg-white overflow-y-auto">
                <div className="flex flex-col gap-5 text-sm md:text-base">
                  {/* Header */}
                  <div className="flex flex-col gap-3">
                    <h1 className="text-2xl md:text-[28px] font-semibold text-black leading-tight">
                      Welcome Back
                    </h1>
                    <p className="text-base md:text-[17px] font-light text-gray-400 capitalize">
                      let's connect you with opportunities
                    </p>
                  </div>

                  {/* Form */}
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="flex flex-col gap-3"
                    >
                      {/* Email Field */}
                      <div className="flex flex-col gap-2">
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
                      </div>

                      {/* Password Field */}
                      <div className="flex flex-col gap-2">
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
                      </div>

                      {/* Continue Button */}
                      <Button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="w-full h-[48px] rounded-[10px] bg-[#5C30FF] hover:bg-[#4a1fe5] text-white font-semibold text-sm md:text-base mt-3"
                      >
                        {loginMutation.isPending ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          "Continue"
                        )}
                      </Button>
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
                      src="https://api.builder.io/api/v1/image/assets/TEMP/c63e31bf35331749ef1f00a4fbaca3a3a5899b7a?width=28"
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
                      src="https://api.builder.io/api/v1/image/assets/TEMP/e1e698cf881cba1b63fb95d130a383ba36c4abee?width=34"
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
                      className="text-[#5C30FF] font-medium hover:underline"
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
