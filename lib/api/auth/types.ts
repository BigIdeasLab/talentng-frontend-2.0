import type { User, LoginResponse } from "@/lib/types/auth";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user?: User;
}

export interface VerifyEmailRequest {
  email: string;
  verificationCode?: string;
}

export interface ResetPasswordRequest {
  resetToken: string;
  newPassword: string;
}

// Re-export types from lib/types
export type { User, LoginResponse };
