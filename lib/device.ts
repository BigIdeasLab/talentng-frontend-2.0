/**
 * Device identification utilities
 * Generates and manages unique device IDs for multi-device session tracking
 */

/**
 * Get or create a unique device ID (persisted in localStorage)
 */
export function getOrCreateDeviceId(): string {
  let deviceId = localStorage.getItem("deviceId");

  if (!deviceId) {
    // Generate a new device ID (UUID v4)
    deviceId = crypto.randomUUID();
    localStorage.setItem("deviceId", deviceId);
  }

  return deviceId;
}

/**
 * Get human-readable device name based on user agent
 */
export function getDeviceName(): string {
  const userAgent = navigator.userAgent;

  // Parse browser name
  let browser = "Unknown Browser";
  if (userAgent.includes("Chrome")) browser = "Chrome";
  else if (userAgent.includes("Safari")) browser = "Safari";
  else if (userAgent.includes("Firefox")) browser = "Firefox";
  else if (userAgent.includes("Edge")) browser = "Edge";

  // Parse OS
  let os = "Unknown OS";
  if (userAgent.includes("Windows")) os = "Windows";
  else if (userAgent.includes("Mac")) os = "macOS";
  else if (userAgent.includes("Linux")) os = "Linux";
  else if (userAgent.includes("iPhone")) os = "iOS";
  else if (userAgent.includes("Android")) os = "Android";

  return `${browser} on ${os}`;
}

/**
 * Clear device ID from storage (call on logout)
 */
export function clearDeviceId(): void {
  localStorage.removeItem("deviceId");
}
