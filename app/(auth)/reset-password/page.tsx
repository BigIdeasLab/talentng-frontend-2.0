"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { resetPassword } from "@/lib/api";
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
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");

  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      toast.error("Invalid reset link. Please request a new one.");
      router.push("/forgot-password");
    } else {
      setResetToken(token);
    }
  }, [searchParams, router]);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ResetPasswordFormValues) =>
      resetPassword(resetToken, data.password),
    onSuccess: () => {
      toast.success("Password reset successfully!");
      router.push("/login");
    },
    onError: (error: any) => {
      const message =
        error.message || "Failed to reset password. Please try again.";
      toast.error(message);
    },
  });

  const handleSubmit = (data: ResetPasswordFormValues) => {
    if (!resetToken) {
      toast.error("Invalid reset link. Please request a new one.");
      return;
    }
    mutation.mutate(data);
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
      <div className="relative z-10 h-screen flex items-center justify-center px-3 py-3 overflow-hidden">
        <div className="w-full max-w-md max-h-full">
          <div className="bg-white rounded-[30px] shadow-lg p-6 md:p-10 overflow-y-auto max-h-[calc(100vh-24px)]">
            <div className="flex flex-col items-center gap-8">
              {/* Header */}
              <div className="flex flex-col gap-5 text-center">
                <h1 className="text-3xl md:text-[30px] font-semibold text-black leading-tight">
                  Create New Password
                </h1>
                <p className="text-base md:text-[17px] font-light text-gray-400">
                  Enter a new password for your account.
                </p>
              </div>

              {/* Form */}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="flex flex-col gap-6 w-full"
                >
                  {/* Password Field */}
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium text-black">
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
                                placeholder="Enter new password"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  setPassword(e.target.value);
                                }}
                                className="flex-1 bg-transparent border-0 placeholder:text-gray-400 focus:ring-0"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
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
                                : "text-gray-400"
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
                                : "text-gray-400"
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
                                : "text-gray-400"
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
                                : "text-gray-400"
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

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 pt-2">
                    <Button
                      type="submit"
                      disabled={mutation.isPending || !resetToken}
                      className="w-full h-[48px] rounded-[10px] bg-[#5C30FF] hover:bg-[#4a1fe5] text-white font-semibold text-sm md:text-base disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {mutation.isPending ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        "Change password"
                      )}
                    </Button>

                    <p className="text-center text-sm">
                      <span className="text-gray-400">
                        Already have an account?{" "}
                      </span>
                      <Link
                        href="/login"
                        className="text-[#5C30FF] font-semibold hover:underline"
                      >
                        Sign in
                      </Link>
                    </p>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
