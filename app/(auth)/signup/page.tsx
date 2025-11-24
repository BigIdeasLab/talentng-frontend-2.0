'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import apiClient from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const signUpSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

const Signup = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const sendVerificationEmailMutation = useMutation({
    mutationFn: (email: string) => {
      return apiClient('/auth/verify-email/send', {
        method: 'POST',
        body: { email },
      });
    },
    onSuccess: (_, variables) => {
      toast.success('Verification email sent!');
      router.push(`/confirm-email?email=${variables}`);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to send verification email.');
    },
  });

  const mutation = useMutation({
    mutationFn: (data: SignUpFormValues) => {
      return apiClient('/auth/register', {
        method: 'POST',
        body: data,
      });
    },
    onSuccess: (data: any, variables) => {
      toast.success('Account created successfully!');
      sendVerificationEmailMutation.mutate(variables.email);
    },
    onError: (error) => {
      toast.error(error.message || 'An error occurred. Please try again.');
    },
  });

  const onSubmit = (data: SignUpFormValues) => {
    mutation.mutate(data);
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
                    Create an account
                  </h1>
                  <p className="text-gray-500 font-geist text-base font-medium leading-[120%] text-center w-full">
                    Signing up for Talent.ng is fast and free.
                  </p>
                </div>
              </div>

              {/* Form */}
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
                          <div className="relative">
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Create a password"
                              {...field}
                              className="h-12 rounded-3xl border-gray-300 text-gray-600 pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
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
                  <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full rounded-3xl"
                  >
                    {mutation.isPending ? 'Signing up...' : 'Sign up'}
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

            {/* Google Sign Up */}
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
                  {/* Google Icon SVG */}
                </svg>
                <span className="text-gray-950 font-geist text-base font-medium">
                  Continue with Google
                </span>
              </div>
            </button>
          </div>

          {/* Sign In Link */}
          <div className="text-center w-full">
            <span className="text-gray-500 font-geist text-base font-normal">
              Already have an account?{' '}
            </span>
            <Link
              href="/login"
              className="text-gray-950 font-geist text-base font-semibold underline hover:text-gray-700 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Terms */}
        <div className="text-center w-full">
          <span className="text-gray-600 font-geist text-sm font-normal">
            By creating an account, you agree to our{' '}
          </span>
          <span className="text-gray-950 font-geist text-sm font-semibold">
            Terms and Conditions.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signup;