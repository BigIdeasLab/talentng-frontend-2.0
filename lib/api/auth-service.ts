/**
 * Authentication API Service
 * Handles all auth-related API calls
 * Tokens are stored in HTTP-only cookies by backend
 */

import apiClient from "@/lib/api";
import { getOrCreateDeviceId, getDeviceName } from "@/lib/device";
import type { User } from "@/lib/types/auth";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId?: string;
  user?: User;
  needsOnboarding?: boolean;
}

/**
 * Helper to store tokens from auth response
 * Backend now sends tokens via HTTP-only cookies, so no localStorage storage needed
 */
const handleAuthResponse = (response: AuthResponse): void => {
  // Cookies are handled by backend and sent with every request
  // No need to store tokens in localStorage
};

export const register = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const response = await apiClient<AuthResponse>("/auth/register", {
    method: "POST",
    body: { email, password },
  });

  handleAuthResponse(response);
  return {
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    user: response.user || ({} as User),
    needsOnboarding: response.needsOnboarding,
  };
};

export const login = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const deviceId = getOrCreateDeviceId();
  const deviceName = getDeviceName();

  const response = await apiClient<AuthResponse>("/auth/login", {
    method: "POST",
    body: { email, password, deviceId, deviceName },
  });

  handleAuthResponse(response);
  return {
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    user: response.user || ({} as User),
    needsOnboarding: response.needsOnboarding,
  };
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
): Promise<AuthResponse> => {
  const response = await apiClient<AuthResponse>("/auth/verify-email/confirm", {
    method: "POST",
    body: { email, verificationCode },
  });

  handleAuthResponse(response);
  return {
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    user: response.user || ({} as User),
    needsOnboarding: response.needsOnboarding,
  };
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
): Promise<AuthResponse> => {
  const response = await apiClient<AuthResponse>("/auth/reset-password", {
    method: "POST",
    body: { email, resetCode, newPassword },
  });

  handleAuthResponse(response);
  return {
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    user: response.user || ({} as User),
    needsOnboarding: response.needsOnboarding,
  };
};

export const logout = async (deviceId?: string): Promise<void> => {
  try {
    const id =
      deviceId ||
      (typeof window !== "undefined" ? localStorage.getItem("deviceId") : null);

    // Backend clears cookies automatically on logout
    await apiClient<void>("/auth/logout", {
      method: "POST",
      body: id ? { deviceId: id } : {},
    });
  } catch (error) {
    console.error("Logout API error:", error);
    // Continue logout even if API call fails
  } finally {
    // Clean up local state only
    if (typeof window !== "undefined") {
      localStorage.removeItem("deviceId");
    }
  }
};

export const logoutAllDevices = async (): Promise<void> => {
  try {
    // Backend clears cookies automatically on logout
    await apiClient<void>("/auth/logout-all-devices", {
      method: "POST",
    });
  } catch (error) {
    console.error("Logout all devices API error:", error);
    // Continue logout even if API call fails
  } finally {
    // Clean up local state only
    if (typeof window !== "undefined") {
      localStorage.removeItem("deviceId");
    }
  }
};

export const getActiveSessions = async (): Promise<any[]> => {
  return apiClient<any[]>("/auth/sessions", {
    method: "GET",
  });
};

export const createPassword = async (password: string): Promise<void> => {
  return apiClient<void>("/auth/create-password", {
    method: "POST",
    body: { password },
  });
};

export const refreshAuthToken = async (): Promise<AuthResponse> => {
  const response = await apiClient<AuthResponse>("/auth/refresh", {
    method: "POST",
    body: {},
  });

  handleAuthResponse(response);
  return response;
};
