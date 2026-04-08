"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { forgotPassword } from "@/lib/api/auth";
import { COLORS } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const router = useRouter();
  const { rateLimitError, isRateLimited, handleError, clearRateLimit } =
    useRateLimitHandler();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ForgotPasswordFormValues) => forgotPassword(data.email),
    onSuccess: (_, variables) => {
      toast.success("Check your email for a 6-digit reset code!");
      router.push(
        `/reset-password?email=${encodeURIComponent(variables.email)}`,
      );
    },
    onError: (error: any) => {
      // Check if this is a rate limiting error
      const isRateLimit = handleError(error);

      if (!isRateLimit) {
        // Handle non-rate-limit errors with toast
        const message =
          error.message || "Failed to send reset link. Please try again.";
        toast.error(message);
      }
    },
  });

  const handleSubmit = (data: ForgotPasswordFormValues) => {
    // Clear any existing rate limit errors when user retries
    clearRateLimit();
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
      <div className="relative z-10 min-h-screen flex items-start md:items-center justify-center px-4 py-6 md:py-8 lg:py-12 md:px-6 lg:px-8 overflow-hidden">
        <div className="w-full max-w-5xl max-h-full">
          <div className="bg-white rounded-[20px] md:rounded-[30px] shadow-lg overflow-hidden min-h-[500px] md:h-[600px] flex flex-col mt-4 md:mt-0">
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
              <div className="flex flex-col justify-center p-6 md:p-6 lg:p-8 bg-white h-full overflow-y-auto">
                <div className="flex flex-col items-center justify-center gap-4">
                  {/* Header */}
                  <div className="flex flex-col gap-2 text-center">
                    <h1 className="text-xl md:text-2xl font-semibold text-black leading-tight">
                      Reset Password
                    </h1>
                    <p className="text-xs md:text-sm font-light text-gray-400">
                      We'll send you a 6-digit code via email to reset your
                      password.
                    </p>
                  </div>

                  {/* Form */}
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(handleSubmit)}
                      className="flex flex-col gap-3 w-full"
                    >
                      {/* Rate Limit Notification */}
                      {isRateLimited && (
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

                      {/* Action Buttons */}
                      <ResponsiveFormButtons>
                        <Button
                          type="submit"
                          disabled={mutation.isPending || isRateLimited}
                          style={{ backgroundColor: COLORS.primary }}
                          className="h-[48px] rounded-[10px] text-white font-semibold text-sm md:text-base hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {mutation.isPending ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : isRateLimited ? (
                            "Please Wait..."
                          ) : (
                            "Send Reset Code"
                          )}
                        </Button>

                        <Link
                          href="/login"
                          className="px-4 py-2 h-10 md:h-[48px] rounded-[10px] bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-800 font-medium text-sm md:text-base transition-colors"
                        >
                          Cancel
                        </Link>
                      </ResponsiveFormButtons>
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
