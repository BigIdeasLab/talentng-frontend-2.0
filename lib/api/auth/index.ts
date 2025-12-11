/**
 * Authentication API Client
 * Handles all auth-related API calls
 */

import apiClient from "@/lib/api";
import { getOrCreateDeviceId, getDeviceName } from "@/lib/device";
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
  const deviceId = getOrCreateDeviceId();
  const deviceName = getDeviceName();

  return apiClient<LoginResponse>("/auth/login", {
    method: "POST",
    body: { email, password, deviceId, deviceName },
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

export const logout = async (deviceId?: string): Promise<void> => {
  const id = deviceId || (typeof window !== "undefined" ? localStorage.getItem("deviceId") : null);

  const result = await apiClient<void>("/auth/logout", {
    method: "POST",
    body: id ? { deviceId: id } : {},
    credentials: "include",
  });

  if (typeof window !== "undefined") {
    localStorage.removeItem("deviceId");
  }

  return result;
};

export const logoutAllDevices = async (): Promise<void> => {
  const result = await apiClient<void>("/auth/logout-all-devices", {
    method: "POST",
    credentials: "include",
  });

  if (typeof window !== "undefined") {
    localStorage.removeItem("deviceId");
  }

  return result;
};

export const getActiveSessions = async (): Promise<any[]> => {
  return apiClient<any[]>("/auth/sessions", {
    method: "GET",
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
  const deviceId = typeof window !== "undefined" ? localStorage.getItem("deviceId") : null;

  return apiClient<AuthResponse>("/auth/refresh", {
    method: "POST",
    body: deviceId ? { deviceId } : {},
    credentials: "include",
  });
};

// Export types
export type { LoginCredentials, RegisterCredentials, AuthResponse, VerifyEmailRequest, ResetPasswordRequest, LoginResponse };
