import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isTokenExpired, decodeToken } from './auth';

describe('Auth Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  });

  describe('isTokenExpired', () => {
    it('should return true for expired token', () => {
      const expiredToken = {
        exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
      };
      const encoded = btoa(JSON.stringify(expiredToken));
      const token = `header.${encoded}.signature`;

      const result = isTokenExpired(token);
      expect(result).toBe(true);
    });

    it('should return false for valid token', () => {
      const validToken = {
        exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
      };
      const encoded = btoa(JSON.stringify(validToken));
      const token = `header.${encoded}.signature`;

      const result = isTokenExpired(token);
      expect(result).toBe(false);
    });

    it('should handle malformed token gracefully', () => {
      const malformedToken = 'invalid.token.format';
      const result = isTokenExpired(malformedToken);
      expect(typeof result).toBe('boolean');
    });
  });

  describe('decodeToken', () => {
    it('should decode valid JWT token', () => {
      const payload = { sub: 'user123', email: 'test@example.com' };
      const encoded = btoa(JSON.stringify(payload));
      const token = `header.${encoded}.signature`;

      const result = decodeToken(token);
      expect(result.sub).toBe('user123');
      expect(result.email).toBe('test@example.com');
    });

    it('should return null for invalid token', () => {
      const result = decodeToken('invalid');
      expect(result).toBeNull();
    });
  });
});
