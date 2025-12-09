"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { forgotPassword } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const router = useRouter();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ForgotPasswordFormValues) =>
      forgotPassword(data.email),
    onSuccess: (_, variables) => {
      toast.success("Check your email for a 6-digit reset code!");
      router.push(`/reset-password?email=${encodeURIComponent(variables.email)}`);
    },
    onError: (error: any) => {
      const message =
        error.message || "Failed to send reset link. Please try again.";
      toast.error(message);
    },
  });

  const handleSubmit = (data: ForgotPasswordFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="relative h-screen bg-white overflow-hidden">
      {/* Background Image */}
      <img
        src="/backgroundgradient.png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Content */}
      <div className="relative z-10 h-screen flex items-center justify-center px-3 py-3 md:py-8 lg:py-12 md:px-4 lg:px-6 overflow-hidden">
        <div className="w-full max-w-5xl max-h-full">
          <div className="bg-white rounded-[30px] shadow-lg overflow-hidden h-[600px] flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 h-full">
              {/* Left Side - Logo */}
              <div className="hidden md:flex flex-col items-center justify-center p-8 lg:p-12 bg-white min-h-[400px] md:min-h-auto">
                <img
                  src="/logo.png"
                  alt="Talent.ng Logo"
                  className="w-full max-w-sm object-contain"
                />
              </div>

              {/* Right Side - Form */}
              <div className="flex flex-col justify-center p-4 md:p-6 lg:p-8 bg-white h-full overflow-y-auto">
                <div className="flex flex-col items-center justify-center gap-4">
                  {/* Header */}
                  <div className="flex flex-col gap-2 text-center">
                    <h1 className="text-xl md:text-2xl font-semibold text-black leading-tight">
                      Reset Password
                    </h1>
                    <p className="text-xs md:text-sm font-light text-gray-400">
                      We'll send you a 6-digit code via email to reset your password.
                    </p>
                  </div>

                  {/* Form */}
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(handleSubmit)}
                      className="flex flex-col gap-3 w-full"
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

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2">
                        <Button
                          type="submit"
                          disabled={mutation.isPending}
                          className="w-full h-[48px] rounded-[10px] bg-[#5C30FF] hover:bg-[#4a1fe5] text-white font-semibold text-sm md:text-base disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {mutation.isPending ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            "Send Reset Code"
                          )}
                        </Button>

                        <Link
                          href="/login"
                          className="w-full h-[48px] rounded-[10px] bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-800 font-medium text-sm md:text-base transition-colors"
                        >
                          Cancel
                        </Link>
                      </div>
                    </form>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
