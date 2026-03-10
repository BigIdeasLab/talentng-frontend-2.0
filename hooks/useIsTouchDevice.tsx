"use client";

import { useState, useEffect } from "react";

/**
 * Hook to detect if the current device is a touch device
 * Uses media query (hover: none) to determine touch capability
 * @returns boolean indicating if device is touch-capable
 */
export function useIsTouchDevice(): boolean | undefined {
  const [isTouchDevice, setIsTouchDevice] = useState<boolean | undefined>(
    undefined,
  );

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === "undefined") {
      return;
    }

    // Use media query to detect hover capability
    const mediaQuery = window.matchMedia("(hover: none)");

    // Set initial value after mount (for SSR compatibility)
    setIsTouchDevice(mediaQuery.matches);

    // Listen for changes (e.g., when connecting/disconnecting external mouse)
    const handleChange = (e: MediaQueryListEvent) => {
      setIsTouchDevice(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return isTouchDevice;
}
