/**
 * Authentication API Service
 * Handles all auth-related API calls
 * Stores tokens in localStorage after successful auth
 */

import apiClient from "@/lib/api";
import { storeTokens, clearTokens } from "@/lib/auth";
import { getOrCreateDeviceId, getDeviceName } from "@/lib/device";
import type { LoginResponse, User } from "@/lib/types/auth";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId?: string;
  user?: User;
}

/**
 * Set cookie for server-side access
 */
const setCookie = (name: string, value: string, maxAgeSeconds: number = 604800) => {
  if (typeof document === 'undefined') return;
  
  try {
    // Format: name=value; path=/; max-age=X; samesite=strict
    const secure = process.env.NODE_ENV === 'production' ? 'secure; ' : '';
    const sameSite = 'samesite=strict';
    
    const cookieString = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; ${secure}${sameSite}`;
    document.cookie = cookieString;
  } catch (error) {
    console.error('[AUTH SERVICE] Error setting cookie:', name, error);
  }
};

/**
 * Helper to store tokens from auth response
 */
const handleAuthResponse = (response: AuthResponse | LoginResponse): void => {
  if ('accessToken' in response && response.accessToken && 'refreshToken' in response && response.refreshToken) {
    const tokenData = {
      accessToken: response.accessToken,
      refreshToken: (response as AuthResponse).refreshToken,
      userId: response.user?.id || (response as AuthResponse).userId || '',
    };
    
    // Store in localStorage for client-side
    storeTokens(tokenData);
    
    // Also set cookies for SSR
    setCookie('accessToken', tokenData.accessToken, 86400); // 1 day in seconds
    setCookie('refreshToken', tokenData.refreshToken, 604800); // 7 days in seconds
    setCookie('userId', tokenData.userId, 604800); // 7 days in seconds
  }
};

export const register = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await apiClient<AuthResponse>("/auth/register", {
    method: "POST",
    body: { email, password },
  });

  handleAuthResponse(response);
  return { accessToken: response.accessToken, user: response.user || {} as User };
};

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const deviceId = getOrCreateDeviceId();
  const deviceName = getDeviceName();

  const response = await apiClient<AuthResponse>("/auth/login", {
    method: "POST",
    body: { email, password, deviceId, deviceName },
  });

  handleAuthResponse(response);
  return { accessToken: response.accessToken, user: response.user || {} as User };
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
  const response = await apiClient<AuthResponse>("/auth/verify-email/confirm", {
    method: "POST",
    body: { email, verificationCode },
  });

  handleAuthResponse(response);
  return { accessToken: response.accessToken, user: response.user || {} as User };
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
  const response = await apiClient<AuthResponse>("/auth/reset-password", {
    method: "POST",
    body: { email, resetCode, newPassword },
  });

  handleAuthResponse(response);
  return { accessToken: response.accessToken, user: response.user || {} as User };
};

/**
 * Clear tokens from cookies
 */
const clearCookies = () => {
  if (typeof document === 'undefined') return;
  
  const cookieNames = ['accessToken', 'refreshToken', 'userId'];
  const date = new Date();
  date.setTime(date.getTime() - 1); // Set to past date to delete
  const expires = `expires=${date.toUTCString()}`;
  
  cookieNames.forEach(name => {
    document.cookie = `${name}=;path=/;${expires}`;
  });
};

export const logout = async (deviceId?: string): Promise<void> => {
  try {
    const id =
      deviceId ||
      (typeof window !== "undefined"
        ? localStorage.getItem("deviceId")
        : null);

    await apiClient<void>("/auth/logout", {
      method: "POST",
      body: id ? { deviceId: id } : {},
    });
  } catch (error) {
    // Continue logout even if API call fails
    console.error("Logout API error:", error);
  } finally {
    clearTokens();
    clearCookies();

    if (typeof window !== "undefined") {
      localStorage.removeItem("deviceId");
      // Force redirect to login
      window.location.href = "/login";
    }
  }
};

export const logoutAllDevices = async (): Promise<void> => {
  try {
    await apiClient<void>("/auth/logout-all-devices", {
      method: "POST",
    });
  } catch (error) {
    console.error("Logout all devices API error:", error);
  } finally {
    clearTokens();
    clearCookies();

    if (typeof window !== "undefined") {
      localStorage.removeItem("deviceId");
      window.location.href = "/login";
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
