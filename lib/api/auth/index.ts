/**
 * Authentication API Client
 * Handles all auth-related API calls
 */

import apiClient from "@/lib/api";
import { storeTokens } from "@/lib/auth";
import { getOrCreateDeviceId, getDeviceName } from "@/lib/device";
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  VerifyEmailRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  LoginResponse,
  SwitchRoleResponse,
} from "./types";

/**
 * Helper to store tokens from auth response
 * Backend sends tokens via HTTP-only cookies, but we also store in localStorage for client-side checks
 */
const handleAuthResponse = (response: AuthResponse): void => {
  if (response.accessToken && response.refreshToken) {
    storeTokens({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      userId: response.userId || "",
    });
  }
};

export const register = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  const response = await apiClient<LoginResponse>("/auth/register", {
    method: "POST",
    body: { email, password },
    credentials: "include",
  });

  handleAuthResponse(response);
  return response;
};

export const login = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  const deviceId = getOrCreateDeviceId();
  const deviceName = getDeviceName();

  const response = await apiClient<LoginResponse>("/auth/login", {
    method: "POST",
    body: { email, password, deviceId, deviceName },
    credentials: "include",
  });

  handleAuthResponse(response);
  return response;
};

export const verifyEmailSend = async (email: string): Promise<void> => {
  return apiClient<void>("/auth/verify-email/send", {
    method: "POST",
    body: { email },
  });
};

export const verifyEmailConfirm = async (
  email: string,
  verificationCode: string,
): Promise<LoginResponse> => {
  const response = await apiClient<LoginResponse>("/auth/verify-email/confirm", {
    method: "POST",
    body: { email, verificationCode },
    credentials: "include",
  });

  handleAuthResponse(response);
  return response;
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
  newPassword: string,
): Promise<LoginResponse> => {
  const response = await apiClient<LoginResponse>("/auth/reset-password", {
    method: "POST",
    body: { email, resetCode, newPassword },
    credentials: "include",
  });

  handleAuthResponse(response);
  return response;
};

export const logout = async (deviceId?: string): Promise<void> => {
  try {
    const id =
      deviceId ||
      (typeof window !== "undefined" ? localStorage.getItem("deviceId") : null);

    await apiClient<void>("/auth/logout", {
      method: "POST",
      body: id ? { deviceId: id } : {},
      credentials: "include",
    });
  } catch (error) {
    console.error("Logout API error:", error);
    // Continue logout even if API call fails
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem("deviceId");
    }
  }
};

export const logoutAllDevices = async (): Promise<void> => {
  try {
    await apiClient<void>("/auth/logout-all-devices", {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Logout all devices API error:", error);
    // Continue logout even if API call fails
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem("deviceId");
    }
  }
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
    credentials: "include",
  });
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
): Promise<void> => {
  return apiClient<void>("/auth/change-password", {
    method: "POST",
    body: { currentPassword, newPassword },
    credentials: "include",
  });
};

export const refreshAuthToken = async (): Promise<AuthResponse> => {
  const deviceId =
    typeof window !== "undefined" ? localStorage.getItem("deviceId") : null;

  const response = await apiClient<AuthResponse>("/auth/refresh", {
    method: "POST",
    body: deviceId ? { deviceId } : {},
    credentials: "include",
  });

  handleAuthResponse(response);
  return response;
};

/**
 * Switch the user's active role
 * POST /auth/switch-role
 * Issues a new access token scoped to the requested role.
 * NOTE: Backend only returns { accessToken, activeRole } — no refreshToken.
 * We keep the existing refreshToken from localStorage.
 */
export const switchRole = async (role: string): Promise<SwitchRoleResponse> => {
  const response = await apiClient<SwitchRoleResponse>("/auth/switch-role", {
    method: "POST",
    body: { role },
    credentials: "include",
  });

  // Store the new access token; keep existing refreshToken + userId from localStorage
  if (response.accessToken && typeof window !== "undefined") {
    const existingRefreshToken = localStorage.getItem("refreshToken") || "";
    const existingUserId = localStorage.getItem("userId") || "";

    storeTokens({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken || existingRefreshToken,
      userId: existingUserId,
    });
  }

  // Persist active role to localStorage and cookies for SSR/middleware checks
  if (typeof window !== "undefined") {
    localStorage.setItem("activeRole", response.activeRole);
    document.cookie = `activeRole=${response.activeRole}; path=/; max-age=31536000; SameSite=Lax`;
  }

  return response;
};

// Export types
export type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  VerifyEmailRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  LoginResponse,
  SwitchRoleResponse,
};
