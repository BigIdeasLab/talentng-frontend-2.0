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
import { decodeJwt, setCookie } from "@/lib/utils";

import { login } from "@/lib/api";
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
    mutationFn: (data: LoginFormValues) => login(data.email, data.password),
    onSuccess: async (response) => {
      const { accessToken, user } = response;
      if (accessToken) {
        // Set cookie on client side
        setCookie("accessToken", accessToken, 7);
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(user));
        
        // Also set cookie server-side via API
        try {
          await fetch("/api/auth/set-cookie", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: accessToken }),
          });
        } catch (error) {
          console.warn("Failed to set server-side cookie:", error);
        }
        
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
    onError: (error: any) => {
      const message = error.message || "Login failed. Please try again.";
      // Only show API errors in toast, not form
      toast.error(message);
    },
  });

  // Handle OAuth callback redirect with userId in query
  React.useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const userId = searchParams.get("userId");
    if (userId) {
      // Clean up the URL and redirect to dashboard
      router.replace("/dashboard");
    }
  }, [router]);

  const onSubmit = (data: LoginFormValues) => {
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
      <div className="relative z-10 min-h-screen flex items-center justify-center px-3 py-6 md:py-8 lg:py-12 md:px-4 lg:px-6">
        <div className="w-full max-w-5xl">
          <div className="bg-white rounded-[30px] shadow-lg overflow-hidden flex flex-col md:flex-row h-[600px]">
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
              <div className="flex flex-col justify-center p-4 md:p-6 lg:p-8 bg-white h-full overflow-y-auto">
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
                        className="w-full h-[48px] rounded-[10px] bg-[#5C30FF] hover:bg-[#4a1fe5] text-white font-semibold text-sm md:text-base mt-1"
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
