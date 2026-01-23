/**
 * Token Refresh Management
 * Handles automatic token refresh with request queuing
 */

import {
  getAccessToken,
  getRefreshToken,
  storeTokens,
  clearTokens,
  shouldRefreshToken,
} from "./auth";

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;
const failedQueue: Array<{
  resolve: (value: boolean) => void;
  reject: (reason?: any) => void;
}> = [];

/**
 * Process queued requests after refresh completes
 */
const processQueue = (success: boolean, error?: any): void => {
  failedQueue.forEach((prom) => {
    if (success) {
      prom.resolve(true);
    } else {
      prom.reject(error);
    }
  });

  failedQueue.length = 0;
};

/**
 * Refresh the access token using the refresh token
 */
export const refreshAccessToken = async (apiUrl: string): Promise<boolean> => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    clearTokens();
    return false;
  }

  try {
    const response = await fetch(`${apiUrl}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      clearTokens();
      return false;
    }

    const data = await response.json();

    if (data.accessToken && data.refreshToken) {
      storeTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        userId: data.userId || data.user?.id || "",
      });
      return true;
    }

    clearTokens();
    return false;
  } catch (error) {
    console.error("Token refresh failed:", error);
    clearTokens();
    return false;
  }
};

/**
 * Ensure valid token before making API calls
 * Returns true if valid, false if refresh failed or token doesn't exist
 */
export const ensureValidToken = async (apiUrl: string): Promise<boolean> => {
  const accessToken = getAccessToken();

  // No token at all
  if (!accessToken) {
    return false;
  }

  // If already refreshing, wait for it
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  // Check if token needs refresh
  if (shouldRefreshToken(accessToken)) {
    isRefreshing = true;

    refreshPromise = refreshAccessToken(apiUrl)
      .then((success) => {
        isRefreshing = false;
        refreshPromise = null;
        processQueue(success);
        return success;
      })
      .catch((error) => {
        isRefreshing = false;
        refreshPromise = null;
        processQueue(false, error);
        return false;
      });

    return refreshPromise;
  }

  return true;
};

/**
 * Queue a request to wait for refresh to complete
 */
export const queueRequest = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    failedQueue.push({ resolve, reject });
  });
};

/**
 * Reset refresh state (useful for testing or explicit logout)
 */
export const resetRefreshState = (): void => {
  isRefreshing = false;
  refreshPromise = null;
  failedQueue.length = 0;
};
