"use client";

import { useState, useEffect } from "react";

export type OrientationType = "portrait" | "landscape";

interface OrientationState {
  orientation: OrientationType;
  angle: number;
  isChanging: boolean;
}

/**
 * Hook to detect and handle device orientation changes
 * Provides orientation state and change detection with debouncing
 */
export function useOrientation() {
  const [orientationState, setOrientationState] = useState<OrientationState>({
    orientation: "portrait",
    angle: 0,
    isChanging: false,
  });

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      return;
    }

    // Get initial orientation
    const getOrientation = (): OrientationType => {
      if (window.screen?.orientation) {
        return window.screen.orientation.angle === 0 ||
          window.screen.orientation.angle === 180
          ? "portrait"
          : "landscape";
      }
      // Fallback for older browsers
      return window.innerHeight > window.innerWidth ? "portrait" : "landscape";
    };

    const getAngle = (): number => {
      if (window.screen?.orientation) {
        return window.screen.orientation.angle;
      }
      // Fallback for older browsers
      return window.orientation || 0;
    };

    // Set initial state
    setOrientationState({
      orientation: getOrientation(),
      angle: getAngle(),
      isChanging: false,
    });

    let timeoutId: NodeJS.Timeout;

    const handleOrientationChange = () => {
      // Set changing state immediately
      setOrientationState((prev) => ({
        ...prev,
        isChanging: true,
      }));

      // Clear any existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Debounce the orientation change to allow for smooth transitions
      timeoutId = setTimeout(() => {
        setOrientationState({
          orientation: getOrientation(),
          angle: getAngle(),
          isChanging: false,
        });
      }, 150); // Small delay to allow for smooth transitions
    };

    // Listen for orientation changes
    if (window.screen?.orientation) {
      window.screen.orientation.addEventListener(
        "change",
        handleOrientationChange,
      );
    } else {
      // Fallback for older browsers
      window.addEventListener("orientationchange", handleOrientationChange);
      window.addEventListener("resize", handleOrientationChange);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (window.screen?.orientation) {
        window.screen.orientation.removeEventListener(
          "change",
          handleOrientationChange,
        );
      } else {
        window.removeEventListener(
          "orientationchange",
          handleOrientationChange,
        );
        window.removeEventListener("resize", handleOrientationChange);
      }
    };
  }, []);

  return orientationState;
}

/**
 * Hook to detect if device is in landscape orientation
 */
export function useIsLandscape(): boolean {
  const { orientation } = useOrientation();
  return orientation === "landscape";
}

/**
 * Hook to detect if device is in portrait orientation
 */
export function useIsPortrait(): boolean {
  const { orientation } = useOrientation();
  return orientation === "portrait";
}
