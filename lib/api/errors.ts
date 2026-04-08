/**
 * API Error Classes
 * Typed error classes for API error handling
 */

export class ApiError extends Error {
  public readonly status: number;
  public readonly data?: any;
  public readonly isRateLimit: boolean;
  public readonly isRoleMismatch: boolean;
  public readonly retryAfter?: number;
  public readonly actualRole?: string;
  public readonly requiredRole?: string;

  constructor(
    message: string,
    status: number,
    options?: {
      data?: any;
      isRateLimit?: boolean;
      isRoleMismatch?: boolean;
      retryAfter?: number;
      actualRole?: string;
      requiredRole?: string;
    },
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = options?.data;
    this.isRateLimit = options?.isRateLimit || false;
    this.isRoleMismatch = options?.isRoleMismatch || false;
    this.retryAfter = options?.retryAfter;
    this.actualRole = options?.actualRole;
    this.requiredRole = options?.requiredRole;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

/**
 * Type guard to check if an error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Type guard to check if an error is a rate limit error
 */
export function isRateLimitError(error: unknown): error is ApiError {
  return isApiError(error) && error.isRateLimit;
}

/**
 * Type guard to check if an error is a role mismatch error
 */
export function isRoleMismatchError(error: unknown): error is ApiError {
  return isApiError(error) && error.isRoleMismatch;
}
