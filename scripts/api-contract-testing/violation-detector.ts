import type { ValidationError } from "./types.js";

export class ViolationDetector {
  /**
   * Converts validation errors to contract violations with endpoint context
   */
  detectViolations(
    errors: ValidationError[],
    endpoint: string,
    method: string,
  ): ValidationError[] {
    return errors.map((error) => ({
      ...error,
      message: `[${method} ${endpoint}] ${error.message}`,
    }));
  }

  /**
   * Creates an HTTP error violation
   */
  createHttpErrorViolation(
    endpoint: string,
    method: string,
    statusCode: number,
    statusText: string,
  ): ValidationError {
    return {
      type: "http_error",
      path: endpoint,
      message: `[${method} ${endpoint}] HTTP ${statusCode}: ${statusText}`,
      expected: "2xx status code",
      actual: `${statusCode}`,
    };
  }

  /**
   * Creates a network error violation
   */
  createNetworkErrorViolation(
    endpoint: string,
    method: string,
    errorMessage: string,
  ): ValidationError {
    return {
      type: "network_error",
      path: endpoint,
      message: `[${method} ${endpoint}] Network error: ${errorMessage}`,
    };
  }
}
