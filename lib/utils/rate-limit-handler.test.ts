import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  parseRateLimitError,
  formatWaitTime,
  getRateLimitMessage,
  createRateLimitCountdown,
  isRateLimitError,
  getRateLimitType
} from './rate-limit-handler';

describe('Rate Limit Handler', () => {
  describe('parseRateLimitError', () => {
    it('should identify non-rate-limit errors', () => {
      const error = { status: 400, message: 'Bad request' };
      const result = parseRateLimitError(error);
      
      expect(result.isRateLimited).toBe(false);
      expect(result.type).toBe('unknown');
      expect(result.message).toBe('Bad request');
    });

    it('should parse throttler rate limit errors', () => {
      const error = { 
        status: 429, 
        message: 'ThrottlerException: Too Many Requests' 
      };
      const result = parseRateLimitError(error);
      
      expect(result.isRateLimited).toBe(true);
      expect(result.type).toBe('throttler');
      expect(result.waitTime).toBe(60);
      expect(result.message).toContain('Too many requests');
    });

    it('should parse login attempt rate limit errors', () => {
      const error = { 
        status: 429, 
        message: 'Too many login attempts' 
      };
      const result = parseRateLimitError(error);
      
      expect(result.isRateLimited).toBe(true);
      expect(result.type).toBe('login_attempts');
      expect(result.waitTime).toBe(60);
    });

    it('should parse account lockout errors', () => {
      const error = { 
        status: 429, 
        message: 'Account locked due to multiple failed attempts' 
      };
      const result = parseRateLimitError(error);
      
      expect(result.isRateLimited).toBe(true);
      expect(result.type).toBe('account_lockout');
      expect(result.waitTime).toBe(900); // 15 minutes
    });

    it('should extract retry-after from response data', () => {
      const error = { 
        status: 429, 
        message: 'Rate limited',
        data: { retryAfter: 120 }
      };
      const result = parseRateLimitError(error);
      
      expect(result.waitTime).toBe(120);
    });

    it('should handle response format variations', () => {
      const error = { 
        response: {
          status: 429,
          data: { message: 'ThrottlerException: Too Many Requests' },
          headers: { 'retry-after': '30' }
        }
      };
      const result = parseRateLimitError(error);
      
      expect(result.isRateLimited).toBe(true);
      expect(result.waitTime).toBe(30);
    });
  });

  describe('formatWaitTime', () => {
    it('should format seconds correctly', () => {
      expect(formatWaitTime(30)).toBe('30 seconds');
      expect(formatWaitTime(1)).toBe('1 second');
    });

    it('should format minutes correctly', () => {
      expect(formatWaitTime(60)).toBe('1 minute');
      expect(formatWaitTime(120)).toBe('2 minutes');
      expect(formatWaitTime(90)).toBe('2 minutes'); // Rounds up
    });

    it('should format hours correctly', () => {
      expect(formatWaitTime(3600)).toBe('1 hour');
      expect(formatWaitTime(7200)).toBe('2 hours');
      expect(formatWaitTime(3900)).toBe('2 hours'); // Rounds up
    });
  });

  describe('getRateLimitMessage', () => {
    it('should return custom message for non-rate-limit errors', () => {
      const rateLimitInfo = {
        isRateLimited: false,
        type: 'unknown' as const,
        message: 'Custom error message'
      };
      
      expect(getRateLimitMessage(rateLimitInfo)).toBe('Custom error message');
    });

    it('should format throttler messages with wait time', () => {
      const rateLimitInfo = {
        isRateLimited: true,
        type: 'throttler' as const,
        message: 'Rate limited',
        waitTime: 60
      };
      
      const message = getRateLimitMessage(rateLimitInfo);
      expect(message).toContain('Too many requests');
      expect(message).toContain('1 minute');
    });

    it('should format account lockout messages', () => {
      const rateLimitInfo = {
        isRateLimited: true,
        type: 'account_lockout' as const,
        message: 'Account locked',
        waitTime: 900
      };
      
      const message = getRateLimitMessage(rateLimitInfo);
      expect(message).toContain('Account temporarily locked');
      expect(message).toContain('15 minutes');
    });
  });

  describe('createRateLimitCountdown', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should call onUpdate with decreasing time', () => {
      const onUpdate = vi.fn();
      const onComplete = vi.fn();
      
      createRateLimitCountdown(3, onUpdate, onComplete);
      
      // Initial call
      expect(onUpdate).toHaveBeenCalledWith(3, '3 seconds');
      
      // After 1 second
      vi.advanceTimersByTime(1000);
      expect(onUpdate).toHaveBeenCalledWith(2, '2 seconds');
      
      // After 2 seconds
      vi.advanceTimersByTime(1000);
      expect(onUpdate).toHaveBeenCalledWith(1, '1 second');
      
      // After 3 seconds - should call onComplete
      vi.advanceTimersByTime(1000);
      expect(onComplete).toHaveBeenCalled();
    });

    it('should return cleanup function that clears interval', () => {
      const onUpdate = vi.fn();
      const onComplete = vi.fn();
      
      const cleanup = createRateLimitCountdown(5, onUpdate, onComplete);
      cleanup();
      
      // Advance time - callbacks should not be called after cleanup
      const initialCallCount = onUpdate.mock.calls.length;
      vi.advanceTimersByTime(2000);
      expect(onUpdate).toHaveBeenCalledTimes(initialCallCount);
    });
  });

  describe('isRateLimitError', () => {
    it('should identify rate limit errors by status code', () => {
      expect(isRateLimitError({ status: 429 })).toBe(true);
      expect(isRateLimitError({ response: { status: 429 } })).toBe(true);
      expect(isRateLimitError({ status: 400 })).toBe(false);
      expect(isRateLimitError({ status: 500 })).toBe(false);
    });
  });

  describe('getRateLimitType', () => {
    it('should return the correct rate limit type', () => {
      const throttlerError = { status: 429, message: 'ThrottlerException' };
      expect(getRateLimitType(throttlerError)).toBe('throttler');
      
      const loginError = { status: 429, message: 'Too many login attempts' };
      expect(getRateLimitType(loginError)).toBe('login_attempts');
      
      const lockoutError = { status: 429, message: 'Account locked' };
      expect(getRateLimitType(lockoutError)).toBe('account_lockout');
      
      const unknownError = { status: 429, message: 'Some other error' };
      expect(getRateLimitType(unknownError)).toBe('unknown');
    });
  });
});