/**
 * Handle OAuth callback redirects
 * Extracts tokens from URL and stores them, then cleans up URL
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  extractTokensFromUrl,
  storeTokens,
  cleanUrlTokenParams,
} from '@/lib/auth';

export const useOAuthCallback = (onTokensStored?: () => void) => {
  const router = useRouter();

  useEffect(() => {
    const tokens = extractTokensFromUrl();

    if (tokens) {
      // Store tokens in localStorage
      storeTokens(tokens);

      // Clean up URL
      cleanUrlTokenParams();

      // Optional callback
      if (onTokensStored) {
        onTokensStored();
      }
    }
  }, [onTokensStored]);
};

export default useOAuthCallback;
