/**
 * Token Management & Authentication Utilities
 * Handles localStorage-based token storage and refresh logic
 */

export type TokenData = {
  accessToken: string;
  refreshToken: string;
  userId: string;
};

const TOKEN_EXPIRY_THRESHOLD = 60000; // Refresh if expires within 60 seconds

/**
 * Store tokens in localStorage
 */
export const storeTokens = (data: TokenData): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  localStorage.setItem('userId', data.userId);
};

/**
 * Retrieve accessToken from localStorage
 */
export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
};

/**
 * Retrieve refreshToken from localStorage
 */
export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refreshToken');
};

/**
 * Retrieve userId from localStorage
 */
export const getUserId = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('userId');
};

/**
 * Clear all tokens from localStorage
 */
export const clearTokens = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userId');
};

/**
 * Decode JWT and check expiration
 */
export const decodeToken = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  return decoded.exp * 1000 < Date.now();
};

/**
 * Get remaining time until token expires (in ms)
 */
export const getTokenExpiryTime = (token: string | null): number => {
  if (!token) return -1;
  
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return -1;
  
  return decoded.exp * 1000 - Date.now();
};

/**
 * Check if token should be refreshed (expires within threshold)
 */
export const shouldRefreshToken = (token: string | null): boolean => {
  const expiryTime = getTokenExpiryTime(token);
  return expiryTime > 0 && expiryTime < TOKEN_EXPIRY_THRESHOLD;
};


