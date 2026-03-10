"use client";

import { useEffect, useRef } from "react";
import { useIsTablet } from "@/hooks/useIsTablet";
import { KeyboardNavigationManager } from "@/lib/utils/keyboard-navigation";

/**
 * Hook for enhanced keyboard navigation on tablet devices
 * Automatically enables enhanced keyboard navigation when on tablet viewport
 */
export function useTabletKeyboardNavigation() {
  const isTablet = useIsTablet();
  const managerRef = useRef<KeyboardNavigationManager>();

  useEffect(() => {
    if (!managerRef.current) {
      managerRef.current = KeyboardNavigationManager.getInstance();
    }

    // Enable/disable tablet mode based on viewport
    managerRef.current.setTabletMode(isTablet ?? false);
  }, [isTablet]);

  return {
    isTabletMode: isTablet,
    manager: managerRef.current,
  };
}

/**
 * Hook for registering a container for enhanced keyboard navigation
 */
export function useTabletKeyboardContainer<T extends HTMLElement>() {
  const containerRef = useRef<T>(null);
  const { isTabletMode, manager } = useTabletKeyboardNavigation();

  useEffect(() => {
    if (isTabletMode && containerRef.current && manager) {
      manager.registerFocusableElements(containerRef.current);
    }

    return () => {
      if (manager) {
        manager.clearElements();
      }
    };
  }, [isTabletMode, manager]);

  return {
    containerRef,
    isTabletMode,
    focusNext: () => manager?.focusNext(),
    focusPrevious: () => manager?.focusPrevious(),
    focusFirst: () => manager?.focusFirst(),
    focusLast: () => manager?.focusLast(),
  };
}
