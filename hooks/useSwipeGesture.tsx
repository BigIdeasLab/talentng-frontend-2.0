"use client";

import { useRef, useCallback, useEffect } from "react";

interface SwipeGestureOptions {
  /**
   * Minimum distance in pixels to trigger swipe
   * @default 100
   */
  threshold?: number;
  /**
   * Minimum velocity in pixels per millisecond to trigger swipe
   * @default 0.3
   */
  velocityThreshold?: number;
  /**
   * Direction of swipe to detect
   * @default "horizontal"
   */
  direction?: "horizontal" | "vertical";
  /**
   * Callback when swipe is detected
   */
  onSwipe?: (direction: "left" | "right" | "up" | "down") => void;
  /**
   * Callback during swipe movement for visual feedback
   */
  onSwipeMove?: (deltaX: number, deltaY: number, progress: number) => void;
  /**
   * Callback when swipe starts
   */
  onSwipeStart?: () => void;
  /**
   * Callback when swipe ends (regardless of whether threshold was met)
   */
  onSwipeEnd?: () => void;
  /**
   * Whether the swipe gesture is enabled
   * @default true
   */
  enabled?: boolean;
}

interface TouchData {
  startX: number;
  startY: number;
  startTime: number;
  currentX: number;
  currentY: number;
}

/**
 * Custom hook for handling swipe gestures on touch devices
 *
 * @example
 * ```tsx
 * const swipeHandlers = useSwipeGesture({
 *   onSwipe: (direction) => {
 *     if (direction === 'left') {
 *       onDismiss();
 *     }
 *   },
 *   onSwipeMove: (deltaX, deltaY, progress) => {
 *     setTransform(`translateX(${deltaX}px)`);
 *     setOpacity(1 - Math.abs(progress));
 *   }
 * });
 *
 * return <div {...swipeHandlers}>Swipeable content</div>;
 * ```
 */
export function useSwipeGesture({
  threshold = 100,
  velocityThreshold = 0.3,
  direction = "horizontal",
  onSwipe,
  onSwipeMove,
  onSwipeStart,
  onSwipeEnd,
  enabled = true,
}: SwipeGestureOptions = {}) {
  const touchDataRef = useRef<TouchData | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!enabled) return;

      const touch = e.touches[0];
      touchDataRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        startTime: Date.now(),
        currentX: touch.clientX,
        currentY: touch.clientY,
      };

      onSwipeStart?.();
    },
    [enabled, onSwipeStart],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!enabled || !touchDataRef.current) return;

      const touch = e.touches[0];
      const touchData = touchDataRef.current;

      touchData.currentX = touch.clientX;
      touchData.currentY = touch.clientY;

      const deltaX = touch.clientX - touchData.startX;
      const deltaY = touch.clientY - touchData.startY;

      // Calculate progress (0 to 1) based on threshold
      const distance =
        direction === "horizontal" ? Math.abs(deltaX) : Math.abs(deltaY);
      const progress = Math.min(distance / threshold, 1);

      // Prevent default scrolling if we're swiping in the detected direction
      if (direction === "horizontal" && Math.abs(deltaX) > Math.abs(deltaY)) {
        e.preventDefault();
      } else if (
        direction === "vertical" &&
        Math.abs(deltaY) > Math.abs(deltaX)
      ) {
        e.preventDefault();
      }

      onSwipeMove?.(deltaX, deltaY, progress);
    },
    [enabled, threshold, direction, onSwipeMove],
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!enabled || !touchDataRef.current) return;

      const touchData = touchDataRef.current;
      const deltaX = touchData.currentX - touchData.startX;
      const deltaY = touchData.currentY - touchData.startY;
      const deltaTime = Date.now() - touchData.startTime;

      // Calculate velocity
      const velocityX = Math.abs(deltaX) / deltaTime;
      const velocityY = Math.abs(deltaY) / deltaTime;

      // Determine if swipe threshold was met
      let swipeDetected = false;
      let swipeDirection: "left" | "right" | "up" | "down" | null = null;

      if (direction === "horizontal") {
        const distance = Math.abs(deltaX);
        const velocity = velocityX;

        if (distance >= threshold || velocity >= velocityThreshold) {
          swipeDetected = true;
          swipeDirection = deltaX > 0 ? "right" : "left";
        }
      } else {
        const distance = Math.abs(deltaY);
        const velocity = velocityY;

        if (distance >= threshold || velocity >= velocityThreshold) {
          swipeDetected = true;
          swipeDirection = deltaY > 0 ? "down" : "up";
        }
      }

      // Call callbacks
      if (swipeDetected && swipeDirection) {
        onSwipe?.(swipeDirection);
      }

      onSwipeEnd?.();
      touchDataRef.current = null;
    },
    [enabled, threshold, velocityThreshold, direction, onSwipe, onSwipeEnd],
  );

  // Set up event listeners
  useEffect(() => {
    const element = elementRef.current;
    if (!element || !enabled) return;

    element.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    element.addEventListener("touchmove", handleTouchMove, { passive: false });
    element.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
    };
  }, [enabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Return ref and handlers for manual attachment if needed
  return {
    ref: elementRef,
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
}
