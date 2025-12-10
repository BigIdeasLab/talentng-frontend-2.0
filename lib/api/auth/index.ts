/**
 * Authentication API Client
 * Handles all auth-related API calls
 */

import apiClient from "@/lib/api";
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  VerifyEmailRequest,
  ResetPasswordRequest,
  LoginResponse,
} from "./types";

export const register = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  return apiClient<LoginResponse>("/auth/register", {
    method: "POST",
    body: { email, password },
    credentials: "include",
  });
};

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  return apiClient<LoginResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
    credentials: "include",
  });
};

export const verifyEmailSend = async (email: string): Promise<void> => {
  return apiClient<void>("/auth/verify-email/send", {
    method: "POST",
    body: { email },
  });
};

export const verifyEmailConfirm = async (
  email: string,
  verificationCode: string
): Promise<LoginResponse> => {
  return apiClient<LoginResponse>("/auth/verify-email/confirm", {
    method: "POST",
    body: { email, verificationCode },
    credentials: "include",
  });
};

export const forgotPassword = async (email: string): Promise<void> => {
  return apiClient<void>("/auth/forgot-password", {
    method: "POST",
    body: { email },
  });
};

export const resetPassword = async (
  email: string,
  resetCode: string,
  newPassword: string
): Promise<LoginResponse> => {
  return apiClient<LoginResponse>("/auth/reset-password", {
    method: "POST",
    body: { email, resetCode, newPassword },
    credentials: "include",
  });
};

export const logout = async (): Promise<void> => {
  return apiClient<void>("/auth/logout", {
    method: "POST",
    credentials: "include",
  });
};

export const createPassword = async (password: string): Promise<void> => {
  return apiClient<void>("/auth/create-password", {
    method: "POST",
    body: { password },
  });
};

export const refreshAuthToken = async (): Promise<AuthResponse> => {
  return apiClient<AuthResponse>("/auth/refresh", {
    method: "POST",
    credentials: "include",
  });
};

// Export types
export type { LoginCredentials, RegisterCredentials, AuthResponse, VerifyEmailRequest, ResetPasswordRequest, LoginResponse };
