'use client';

import React, { useState, Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import apiClient from '@/lib/api';
import { useDebounce } from '@/hooks/use-debounce';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from '@/hooks/use-auth';

const setUsernameSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters.')
    .max(50, 'Username must not exceed 50 characters.')
    .regex(
      /^[a-z0-9_.-]+$/,
      'Username can only contain lowercase letters, numbers, underscores, hyphens, and periods.',
    )
    .refine((username) => {
      const letterCount = (username.match(/[a-z]/g) || []).length;
      return letterCount >= 3;
    }, 'Username must contain at least 3 letters.')
    .refine((username) => {
      const reservedUsernames = [
        'admin',
        'root',
        'talentng',
        'support',
        'moderator',
      ];
      return !reservedUsernames.includes(username.toLowerCase());
    }, 'This username is reserved. Please choose another.'),
});

type SetUsernameFormValues = z.infer<typeof setUsernameSchema>;

const SetUsername = ({
  onNext,
}: {
  onNext: (username: string) => void;
}) => {
  const [usernameInput, setUsernameInput] = useState('');
  const debouncedUsername = useDebounce(usernameInput, 500);
  const [usernameStatus, setUsernameStatus] = useState<
    'idle' | 'checking' | 'available' | 'taken'
  >('idle');

  const form = useForm<SetUsernameFormValues>({
    resolver: zodResolver(setUsernameSchema),
    defaultValues: {
      username: '',
    },
  });

  useEffect(() => {
    const checkUsername = async () => {
      if (debouncedUsername.length > 0) {
        const isValid = await form.trigger('username');
        if (debouncedUsername.length >= 2 && isValid) {
          setUsernameStatus('checking');
          try {
            const isTaken = await apiClient<boolean>(
              `/users/username-taken/${debouncedUsername}`,
            );
            setUsernameStatus(isTaken ? 'taken' : 'available');
          } catch (error) {
            setUsernameStatus('idle');
            toast.error('Failed to check username availability.');
          }
        } else {
          setUsernameStatus('idle');
        }
      }
    };

    checkUsername();
  }, [debouncedUsername, form]);

  const onSubmit = (data: SetUsernameFormValues) => {
    if (usernameStatus !== 'available') {
      toast.error('Please choose an available username.');
      return;
    }
    onNext(data.username);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Header */}
      <div className="flex flex-col gap-5 text-center">
        <h1 className="text-3xl md:text-[30px] font-semibold text-black leading-tight">
          Choose a Username
        </h1>
        <p className="text-base md:text-[17px] font-light text-gray-400">
          You're almost there! Please choose a unique username to complete your
          account setup.
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6 w-full"
        >
          {/* Username Field */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-black">Username</label>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter username"
                      {...field}
                      onChange={(e) => {
                        const lowercasedValue = e.target.value.toLowerCase();
                        field.onChange(lowercasedValue);
                        setUsernameInput(lowercasedValue);
                      }}
                      className="h-[53px] rounded-[10px] border-0 bg-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-600"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status Messages */}
            {usernameStatus === 'checking' && (
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Checking...
              </p>
            )}
            {usernameStatus === 'taken' && (
              <p className="text-xs text-red-500">
                Username is already taken.
              </p>
            )}
            {usernameStatus === 'available' && (
              <p className="text-xs text-green-600">
                Username is available.
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={usernameStatus !== 'available'}
            className="w-full h-[53px] rounded-[10px] bg-[#5C30FF] hover:bg-[#4a1fe5] text-white font-semibold text-base disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Continue
          </Button>
        </form>
      </Form>
    </div>
  );
};

const SelectRole = ({
  onRoleSelect,
  isLoading,
}: {
  onRoleSelect: (role: 'talent' | 'mentor') => void;
  isLoading: boolean;
}) => {
  const [selectedRole, setSelectedRole] = useState<'talent' | 'mentor' | null>(
    null,
  );

  const handleRoleSelection = (role: 'talent' | 'mentor') => {
    setSelectedRole(role);
    onRoleSelect(role);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Header */}
      <div className="flex flex-col gap-5 text-center">
        <h1 className="text-3xl md:text-[30px] font-semibold text-black leading-tight">
          Select Your Role
        </h1>
        <p className="text-base md:text-[17px] font-light text-gray-400">
          Please choose the role that best describes you.
        </p>
      </div>

      {/* Role Selection */}
      <div className="flex flex-col gap-4 w-full">
        <Button
          onClick={() => handleRoleSelection('talent')}
          disabled={isLoading}
          className="w-full h-[53px] rounded-[10px] bg-[#5C30FF] hover:bg-[#4a1fe5] text-white font-semibold text-base flex items-center justify-center gap-2"
        >
          {isLoading && selectedRole === 'talent' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : null}
          I am a Talent
        </Button>
      </div>

      {/* Terms */}
      <p className="text-center text-sm">
        <span className="text-gray-400">By selecting your role, you agree to our </span>
        <span className="text-black font-semibold">Terms and Conditions.</span>
      </p>
    </div>
  );
};

const OnboardingPage = () => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const router = useRouter();
  const { refetchUser } = useAuth();

  const onBoardMutation = useMutation({
    mutationFn: (data: { username: string; role: 'talent' | 'mentor' }) => {
      return apiClient('/users/me/onboard', {
        method: 'POST',
        body: data,
      });
    },
    onSuccess: () => {
      toast.success('Onboarding successful!');
      refetchUser();
      router.push('/talent/dashboard');
    },
    onError: (error) => {
      toast.error(
        error.message || 'Failed to complete onboarding. Please try again.',
      );
    },
  });

  const handleUsernameSet = (newUsername: string) => {
    setUsername(newUsername);
    setStep(2);
  };

  const handleRoleSelect = (selectedRole: 'talent' | 'mentor') => {
    onBoardMutation.mutate({ username, role: selectedRole });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <SetUsername onNext={handleUsernameSet} />;
      case 2:
        return (
          <SelectRole
            onRoleSelect={handleRoleSelect}
            isLoading={onBoardMutation.isPending}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
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
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-[30px] shadow-lg p-8 md:p-12 lg:p-16">
            {renderStep()}
          </div>
        </div>
      </div>
    </div>
  );
};

const OnboardingPageWithSuspense = () => (
  <Suspense
    fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    }
  >
    <OnboardingPage />
  </Suspense>
);

export default OnboardingPageWithSuspense;
