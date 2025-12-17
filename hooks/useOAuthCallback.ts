/**
 * Handle OAuth callback redirects
 * Extracts tokens from URL and stores them in COOKIES (for SSR)
 * Also stores in localStorage (for client-side use)
 * Then cleans up URL
 * 
 * IMPORTANT: This must run during render (not in useEffect) to ensure tokens are 
 * available to server components on the initial page load via cookies.
 */

import { useEffect, useRef } from 'react';
import {
  extractTokensFromUrl,
  storeTokens,
  cleanUrlTokenParams,
} from '@/lib/auth';

const setCookie = (name: string, value: string, maxAgeSeconds: number = 604800) => {
  if (typeof document === 'undefined') return;
  
  try {
    // Format: name=value; path=/; max-age=X; samesite=strict
    // For development, don't use secure flag; for production, add it
    const secure = process.env.NODE_ENV === 'production' ? 'secure; ' : '';
    const sameSite = 'samesite=strict';
    
    const cookieString = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; ${secure}${sameSite}`;
    
    console.log('[OAUTH CALLBACK] Setting cookie:', { name, length: value.length });
    document.cookie = cookieString;
    
    // Verify cookie was set by reading it back
    const testCookie = document.cookie.split('; ').find(c => c.startsWith(name + '='));
    if (testCookie) {
      console.log('[OAUTH CALLBACK] Cookie verified:', name);
    } else {
      console.warn('[OAUTH CALLBACK] Cookie may not have been set:', name);
    }
  } catch (error) {
    console.error('[OAUTH CALLBACK] Error setting cookie:', name, error);
  }
};

export const useOAuthCallback = (onTokensStored?: () => void) => {
  const hasRun = useRef(false);

  // Extract and store tokens immediately during render
  // This ensures cookies are set before server receives the request
  if (typeof window !== 'undefined' && !hasRun.current) {
    hasRun.current = true;
    const tokens = extractTokensFromUrl();

    if (tokens) {
      // Store in cookies for SSR
      setCookie('accessToken', tokens.accessToken, 86400); // 1 day
      setCookie('refreshToken', tokens.refreshToken, 604800); // 7 days
      setCookie('userId', tokens.userId, 604800); // 7 days
      
      // Also store in localStorage for client-side use
      storeTokens(tokens);
      
      console.log('[OAUTH CALLBACK] Tokens stored in localStorage and cookies');
    }
  }

  // Run effects after render (DOM is ready)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Clean up URL - must be in effect, not during render
    const tokens = extractTokensFromUrl();
    if (tokens) {
      cleanUrlTokenParams();
      
      // Call callback immediately to trigger navigation and refetch
      if (onTokensStored) {
        onTokensStored();
      }
    }
  }, [onTokensStored]);
};

export default useOAuthCallback;
