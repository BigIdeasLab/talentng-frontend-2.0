"use client";

import { useState, useEffect, useRef } from "react";
import { useOrientation } from "./useOrientation";

/**
 * Hook to preserve state during orientation changes
 * Useful for maintaining form data, scroll position, or other transient state
 */
export function useOrientationState<T>(
  initialState: T,
  options?: {
    preserveOnChange?: boolean;
    resetDelay?: number;
  },
) {
  const { isChanging } = useOrientation();
  const [state, setState] = useState<T>(initialState);
  const preservedStateRef = useRef<T>(initialState);
  const { preserveOnChange = true, resetDelay = 300 } = options || {};

  useEffect(() => {
    if (isChanging && preserveOnChange) {
      // Store current state when orientation starts changing
      preservedStateRef.current = state;
    } else if (!isChanging && preserveOnChange) {
      // Restore state after orientation change completes
      const timeoutId = setTimeout(() => {
        setState(preservedStateRef.current);
      }, resetDelay);

      return () => clearTimeout(timeoutId);
    }
  }, [isChanging, preserveOnChange, resetDelay, state]);

  return [state, setState] as const;
}

/**
 * Hook to preserve scroll position during orientation changes
 */
export function useOrientationScrollPreservation(
  elementRef?: React.RefObject<HTMLElement>,
) {
  const { isChanging } = useOrientation();
  const scrollPositionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const element = elementRef?.current || window;

    if (isChanging) {
      // Store scroll position when orientation starts changing
      if (element === window) {
        scrollPositionRef.current = {
          x: window.scrollX,
          y: window.scrollY,
        };
      } else if (element instanceof HTMLElement) {
        scrollPositionRef.current = {
          x: element.scrollLeft,
          y: element.scrollTop,
        };
      }
    } else {
      // Restore scroll position after orientation change
      const timeoutId = setTimeout(() => {
        if (element === window) {
          window.scrollTo(
            scrollPositionRef.current.x,
            scrollPositionRef.current.y,
          );
        } else if (element instanceof HTMLElement) {
          element.scrollLeft = scrollPositionRef.current.x;
          element.scrollTop = scrollPositionRef.current.y;
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [isChanging, elementRef]);

  return scrollPositionRef.current;
}

/**
 * Hook to preserve form state during orientation changes
 */
export function useOrientationFormState<T extends Record<string, any>>(
  initialFormState: T,
) {
  const [formState, setFormState] = useOrientationState(initialFormState, {
    preserveOnChange: true,
    resetDelay: 100,
  });

  const updateFormField = (field: keyof T, value: any) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormState(initialFormState);
  };

  return {
    formState,
    setFormState,
    updateFormField,
    resetForm,
  };
}
