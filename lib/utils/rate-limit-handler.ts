/**
 * Rate limiting error handler utilities
 * Provides user-friendly messages for rate limiting scenarios
 */

import { isRateLimitError as isApiRateLimitError, ApiError } from "@/lib/api/errors";

export interface RateLimitInfo {
  isRateLimited: boolean;
  type: "throttler" | "login_attempts" | "account_lockout" | "unknown";
  message: string;
  waitTime?: number; // seconds to wait
  retryAfter?: Date;
}

/**
 * Parse rate limiting error and extract useful information
 * Based on actual backend rate limiting configuration from docs/API_RATE_LIMITS.md
 */
export function parseRateLimitError(error: any): RateLimitInfo {
  const status = error.status || error.response?.status;
  const message = error.message || error.response?.data?.message || "";
  const data = error.data || error.response?.data || {};
  const url = error.config?.url || error.url || "";

  // Not a rate limiting error
  if (status !== 429) {
    return {
      isRateLimited: false,
      type: "unknown",
      message: message || "An error occurred",
    };
  }

  // Parse different types of rate limiting based on actual backend configuration
  let type: RateLimitInfo["type"] = "unknown";
  let waitTime: number | undefined;
  let userMessage = "";

  // If it's an ApiError, extract retryAfter directly
  if (error instanceof ApiError && error.retryAfter) {
    waitTime = error.retryAfter;
  }

  // Check endpoint to determine rate limit type
  const isAuthEndpoint = url.includes("/auth/");
  const isAdminEndpoint = url.includes("/admin/");
  const isStrictAuthEndpoint =
    url.includes("/forgot-password") || url.includes("/reset-password");

  // Throttler rate limiting (API endpoint rate limits)
  if (
    message.includes("ThrottlerException") ||
    message.includes("Too Many Requests")
  ) {
    if (isStrictAuthEndpoint) {
      type = "throttler";
      waitTime = waitTime || 60; // Strict auth endpoints: 3 requests per 60 seconds
      userMessage =
        "Too many password reset attempts. Please wait a minute before trying again.";
    } else if (isAuthEndpoint || isAdminEndpoint) {
      type = "throttler";
      waitTime = waitTime || 60; // Standard auth/admin endpoints: 5 requests per 60 seconds
      userMessage =
        "Too many authentication attempts. Please wait a minute before trying again.";
    } else {
      type = "throttler";
      waitTime = waitTime || 60; // Default for any other rate limited endpoint
      userMessage =
        "Too many requests. Please wait a minute before trying again.";
    }
  }

  // Login attempts rate limiting (specific to login attempts)
  if (
    message.includes("Too many login attempts") ||
    message.includes("login attempts")
  ) {
    type = "login_attempts";
    waitTime = waitTime || 60; // Login attempts: wait 1 minute
    userMessage =
      "Too many login attempts. Please wait a minute before trying again.";
  }

  // Account lockout (5 failed login attempts = 15-minute lockout)
  if (
    message.includes("locked") ||
    message.includes("lockout") ||
    message.includes("temporarily locked")
  ) {
    type = "account_lockout";
    waitTime = waitTime || 15 * 60; // Account lockout is 15 minutes
    userMessage =
      "Account temporarily locked due to multiple failed login attempts. Please try again in 15 minutes.";
  }

  // Try to extract retry-after header or wait time from response (fallback)
  if (!waitTime) {
    const retryAfter =
      data.retryAfter || error.response?.headers?.["retry-after"];
    if (retryAfter) {
      if (typeof retryAfter === "number") {
        waitTime = retryAfter;
      } else if (typeof retryAfter === "string") {
        const parsed = parseInt(retryAfter, 10);
        if (!isNaN(parsed)) {
          waitTime = parsed;
        }
      }
    }
  }

  // Calculate retry time
  const retryAfterDate = waitTime
    ? new Date(Date.now() + waitTime * 1000)
    : undefined;

  return {
    isRateLimited: true,
    type,
    message: userMessage || "Rate limit exceeded. Please try again later.",
    waitTime,
    retryAfter: retryAfterDate,
  };
}

/**
 * Format wait time into human-readable string
 */
export function formatWaitTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? "s" : ""}`;
  }

  const minutes = Math.ceil(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  }

  const hours = Math.ceil(minutes / 60);
  return `${hours} hour${hours !== 1 ? "s" : ""}`;
}

/**
 * Get user-friendly rate limit message with specific wait time
 */
export function getRateLimitMessage(rateLimitInfo: RateLimitInfo): string {
  if (!rateLimitInfo.isRateLimited) {
    return rateLimitInfo.message;
  }

  const { type, waitTime } = rateLimitInfo;

  if (!waitTime) {
    return rateLimitInfo.message;
  }

  const waitTimeStr = formatWaitTime(waitTime);

  switch (type) {
    case "throttler":
      return `Too many requests. Please wait ${waitTimeStr} before trying again.`;

    case "login_attempts":
      return `Too many login attempts. Please wait ${waitTimeStr} before trying again.`;

    case "account_lockout":
      return `Account temporarily locked due to multiple failed login attempts. Please try again in ${waitTimeStr}.`;

    default:
      return `Rate limit exceeded. Please wait ${waitTimeStr} before trying again.`;
  }
}

/**
 * Create a countdown timer for rate limit wait time
 */
export function createRateLimitCountdown(
  waitTime: number,
  onUpdate: (remainingTime: number, formattedTime: string) => void,
  onComplete: () => void,
): () => void {
  const endTime = Date.now() + waitTime * 1000;

  const updateCountdown = () => {
    const now = Date.now();
    const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));

    if (remaining <= 0) {
      onComplete();
      return;
    }

    onUpdate(remaining, formatWaitTime(remaining));
  };

  // Update immediately
  updateCountdown();

  // Set up interval
  const interval = setInterval(updateCountdown, 1000);

  // Return cleanup function
  return () => clearInterval(interval);
}

/**
 * Check if an error is a rate limiting error
 * Re-exports the type guard from lib/api/errors for convenience
 */
export function isRateLimitError(error: any): boolean {
  return isApiRateLimitError(error);
}

/**
 * Get rate limit type from error for analytics/logging
 */
export function getRateLimitType(error: any): string {
  const rateLimitInfo = parseRateLimitError(error);
  return rateLimitInfo.type;
}
