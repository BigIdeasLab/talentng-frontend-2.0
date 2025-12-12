/**
 * Handle OAuth callback redirects
 * Extracts tokens from URL and stores them IMMEDIATELY (before any queries)
 * Then cleans up URL
 */

import { useEffect, useRef } from 'react';
import {
  extractTokensFromUrl,
  storeTokens,
  cleanUrlTokenParams,
} from '@/lib/auth';

export const useOAuthCallback = (onTokensStored?: () => void) => {
  const hasRun = useRef(false);

  // Extract and store tokens immediately on mount (synchronously as early as possible)
  if (typeof window !== 'undefined' && !hasRun.current) {
    hasRun.current = true;
    const tokens = extractTokensFromUrl();

    if (tokens) {
      console.log('[OAUTH CALLBACK] Tokens found in URL, storing in localStorage');
      // Store tokens in localStorage immediately
      storeTokens(tokens);
      console.log('[OAUTH CALLBACK] Tokens stored');
    } else {
      console.log('[OAUTH CALLBACK] No tokens found in URL');
    }
  }

  // Run effects after render (not during render)
  useEffect(() => {
    // Clean up URL - must be in effect, not during render
    const tokens = extractTokensFromUrl();
    if (tokens) {
      cleanUrlTokenParams();
      console.log('[OAUTH CALLBACK] URL cleaned');
    }

    // Run callback
    if (tokens && onTokensStored) {
      onTokensStored();
    }
  }, [onTokensStored]);
};

export default useOAuthCallback;
