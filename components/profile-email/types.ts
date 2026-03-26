/**
 * Profile Email Component Types
 */

import type { RoleColorPalette } from "@/lib/theme/role-colors";

export interface ProfileEmailSectionProps {
  role: 'talent' | 'mentor' | 'recruiter';
  currentEmail?: string;
  emailVerified: boolean;
  emailUpdatedAt?: string;
  mainAccountEmail: string;
  onEmailUpdate: (email: string) => Promise<void>;
  onVerifyEmail: (code: string) => Promise<void>;
  onResendCode: () => Promise<void>;
  isLoading?: boolean;
  rateLimitedUntil?: string;
  roleColors: RoleColorPalette;
  isInitialLoading?: boolean;
}

export interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (code: string) => Promise<void>;
  onResendCode: () => Promise<void>;
  email: string;
  isLoading?: boolean;
  error?: string;
}

export interface StatusIndicatorProps {
  status: 'verified' | 'pending' | 'main-email' | 'rate-limited';
  nextUpdateTime?: string;
}

export type EmailStatus = 'verified' | 'pending' | 'main-email' | 'rate-limited';

export interface EmailUpdateError {
  type: 'validation' | 'network' | 'rate-limit' | 'duplicate' | 'server';
  message: string;
  nextAllowedUpdate?: string;
}

export interface VerificationError {
  type: 'invalid-code' | 'expired-code' | 'too-many-attempts' | 'network' | 'server';
  message: string;
}