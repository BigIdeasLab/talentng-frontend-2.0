
'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import apiClient from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';

const confirmEmailSchema = z.object({
  verificationCode: z.string().min(6, 'Your one-time password must be 6 characters.'),
});

type ConfirmEmailFormValues = z.infer<typeof confirmEmailSchema>;

const ConfirmEmailPage = () => {
  const router = useRouter();
  const form = useForm<ConfirmEmailFormValues>({
    resolver: zodResolver(confirmEmailSchema),
    defaultValues: {
      verificationCode: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ConfirmEmailFormValues) => {
      // You might need to get the email from the query params or from a state management library
      const email = new URLSearchParams(window.location.search).get('email');
      return apiClient('/auth/verify-email/confirm', {
        method: 'POST',
        body: { ...data, email },
      });
    },
    onSuccess: () => {
      toast.success('Email verified successfully!');
      router.push('/login');
    },
    onError: (error) => {
      toast.error(error.message || 'An error occurred. Please try again.');
    },
  });

  const onSubmit = (data: ConfirmEmailFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md flex flex-col items-center text-center gap-8">
        <div className="flex flex-col items-center gap-6 w-full">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/95484ffeaace17b0e40815c0aa78c80490650deb?width=168"
            alt="Talent.ng Logo"
            className="w-24 h-20"
          />
          <div className="flex flex-col items-center gap-4 w-full">
            <h1 className="text-black font-geist text-4xl font-semibold leading-tight">
              Check your email
            </h1>
            <p className="text-gray-500 font-geist text-lg font-medium">
              We sent a verification code to your email address.
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-sm flex flex-col gap-8">
            <FormField
              control={form.control}
              name="verificationCode"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <FormLabel className="text-lg font-medium">Enter Code</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={mutation.isPending} className="w-full rounded-3xl">
              {mutation.isPending ? 'Verifying...' : 'Verify Email'}
            </Button>
          </form>
        </Form>

        <div className="text-center w-full">
          <span className="text-gray-500 font-geist text-sm font-normal">
            Already have an account?{' '}
          </span>
          <Link
            href="/login"
            className="text-gray-950 font-geist text-sm font-semibold underline hover:text-gray-700 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmailPage;
