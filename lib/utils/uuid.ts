/**
 * Cross-browser UUID generation utilities
 * Provides fallbacks for environments where crypto.randomUUID is not available
 */

/**
 * Generate a UUID v4 compatible string (cross-browser)
 *
 * This function provides a fallback for older browsers and mobile environments
 * where crypto.randomUUID might not be available.
 *
 * @returns A UUID v4 string
 */
export function generateUUID(): string {
  // Try modern crypto.randomUUID first (available in modern browsers)
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    try {
      return crypto.randomUUID();
    } catch (error) {
      // Fall through to polyfill if crypto.randomUUID fails
      console.warn("crypto.randomUUID failed, using polyfill:", error);
    }
  }

  // Polyfill for older browsers and mobile environments
  // This generates a UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generate a short UUID (8 characters) for cases where a full UUID is too long
 *
 * @returns A short 8-character UUID-like string
 */
export function generateShortUUID(): string {
  return "xxxxxxxx".replace(/[x]/g, function () {
    return ((Math.random() * 16) | 0).toString(16);
  });
}

/**
 * Validate if a string is a valid UUID v4 format
 *
 * @param uuid - The string to validate
 * @returns True if the string is a valid UUID v4 format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Generate a UUID with a custom prefix for easier identification
 *
 * @param prefix - The prefix to add (e.g., 'user', 'session', 'device')
 * @returns A prefixed UUID string
 */
export function generatePrefixedUUID(prefix: string): string {
  return `${prefix}_${generateUUID()}`;
}
