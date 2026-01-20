"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { register } from "@/lib/api/auth-service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const signUpSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least 1 lowercase letter.")
    .regex(/[0-9]/, "Password must contain at least 1 number.")
    .regex(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      "Password must contain at least 1 special character.",
    ),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

const Signup = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: SignUpFormValues) => register(data.email, data.password),
    onSuccess: (data: any, variables) => {
      toast.success("Check your email for verification code!");
      router.push(
        `/confirm-email?email=${encodeURIComponent(variables.email)}`,
      );
    },
    onError: (error: any) => {
      const message = error.message || "An error occurred. Please try again.";
      toast.error(message);
    },
  });

  const onSubmit = (data: SignUpFormValues) => {
    mutation.mutate(data);
  };

  // OAuth callback is handled by middleware
  // Backend sets cookies directly, frontend receives redirect to dashboard/onboarding
  // No need to extract tokens from URL

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
              <div className="flex flex-col justify-center p-4 md:p-6 lg:p-8 bg-white overflow-y-auto">
                <div className="flex flex-col gap-3 text-sm md:text-base">
                  {/* Header */}
                  <div className="flex flex-col gap-1">
                    <h1 className="text-xl md:text-2xl font-semibold text-black leading-tight">
                      Create Your Account
                    </h1>
                    <p className="text-sm md:text-base font-light text-gray-400 capitalize">
                      Show the world what you can do
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
                            <div className="flex items-center gap-1 text-xs">
                              <span
                                className={
                                  passwordChecks.special
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                              >
                                {passwordChecks.special ? "✓" : "○"}
                              </span>
                              <span
                                className={
                                  passwordChecks.special
                                    ? "text-gray-700"
                                    : "text-gray-500"
                                }
                              >
                                !@#$%
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Continue Button */}
                      <Button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full h-[48px] rounded-[10px] bg-[#5C30FF] hover:bg-[#4a1fe5] text-white font-semibold text-sm md:text-base mt-1"
                      >
                        {mutation.isPending ? (
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

                  {/* Sign In Link */}
                  <p className="text-center text-xs md:text-sm">
                    <span className="text-gray-400">
                      Already have an account?{" "}
                    </span>
                    <Link
                      href="/login"
                      className="text-[#5C30FF] font-medium hover:underline"
                    >
                      Log in
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

export default Signup;
