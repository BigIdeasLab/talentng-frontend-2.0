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
      toast.success("Reset link sent to your email!");
      router.push(`/forgot-password-confirmation?email=${variables.email}`);
    },
    onError: (error: any) => {
      const message =
        error.message || "Failed to send reset link. Please try again.";
      form.setError("email", { message });
      toast.error(message);
    },
  });

  const handleSubmit = (data: ForgotPasswordFormValues) => {
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
                      We can help you reset your password using the email address
                      linked to your account.
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
                            "Reset my password"
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
