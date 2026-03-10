"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import { cn } from "@/lib/utils";

interface SwipeableModalProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean;
  /**
   * Callback when the modal should close
   */
  onClose: () => void;
  /**
   * The modal content
   */
  children: React.ReactNode;
  /**
   * Whether swipe-to-dismiss is enabled
   * @default true
   */
  swipeEnabled?: boolean;
  /**
   * Direction of swipe to dismiss
   * @default "down"
   */
  swipeDirection?: "up" | "down" | "left" | "right";
  /**
   * Custom className for the modal container
   */
  className?: string;
  /**
   * Whether this is a mobile modal (full screen)
   * @default false
   */
  isMobile?: boolean;
  /**
   * Swipe threshold in pixels
   * @default 100
   */
  threshold?: number;
}

/**
 * SwipeableModal provides swipe-to-dismiss functionality for modal sheets.
 * Supports different swipe directions and provides smooth animations.
 *
 * @example
 * ```tsx
 * <SwipeableModal
 *   isOpen={isOpen}
 *   onClose={onClose}
 *   swipeDirection="down"
 *   isMobile={isMobile}
 * >
 *   <ModalContent />
 * </SwipeableModal>
 * ```
 */
export function SwipeableModal({
  isOpen,
  onClose,
  children,
  swipeEnabled = true,
  swipeDirection = "down",
  className,
  isMobile = false,
  threshold = 100,
}: SwipeableModalProps) {
  const [transform, setTransform] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset transform when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setTransform({ x: 0, y: 0 });
      setOpacity(1);
      setIsAnimating(false);
    }
  }, [isOpen]);

  const handleSwipeMove = useCallback(
    (deltaX: number, deltaY: number, progress: number) => {
      if (!swipeEnabled) return;

      // Only respond to swipes in the configured direction
      const isHorizontal =
        swipeDirection === "left" || swipeDirection === "right";
      const isVertical = swipeDirection === "up" || swipeDirection === "down";

      if (isHorizontal && Math.abs(deltaX) < Math.abs(deltaY)) return;
      if (isVertical && Math.abs(deltaY) < Math.abs(deltaX)) return;

      // Apply transform based on swipe direction
      let newTransform = { x: 0, y: 0 };

      if (swipeDirection === "down" && deltaY > 0) {
        newTransform.y = deltaY;
      } else if (swipeDirection === "up" && deltaY < 0) {
        newTransform.y = deltaY;
      } else if (swipeDirection === "right" && deltaX > 0) {
        newTransform.x = deltaX;
      } else if (swipeDirection === "left" && deltaX < 0) {
        newTransform.x = deltaX;
      }

      setTransform(newTransform);

      // Fade out slightly during swipe
      const fadeProgress = Math.min(progress, 1);
      setOpacity(1 - fadeProgress * 0.3);
    },
    [swipeEnabled, swipeDirection],
  );

  const handleSwipeEnd = useCallback(() => {
    if (!isAnimating) {
      // Reset position with animation
      setIsAnimating(true);
      setTransform({ x: 0, y: 0 });
      setOpacity(1);

      // Remove animation flag after transition
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [isAnimating]);

  const handleSwipe = useCallback(
    (direction: "left" | "right" | "up" | "down") => {
      if (!swipeEnabled || direction !== swipeDirection) return;

      // Animate out before closing
      setIsAnimating(true);

      let dismissTransform = { x: 0, y: 0 };

      switch (direction) {
        case "down":
          dismissTransform.y = window.innerHeight;
          break;
        case "up":
          dismissTransform.y = -window.innerHeight;
          break;
        case "right":
          dismissTransform.x = window.innerWidth;
          break;
        case "left":
          dismissTransform.x = -window.innerWidth;
          break;
      }

      setTransform(dismissTransform);
      setOpacity(0);

      // Call onClose after animation completes
      setTimeout(() => {
        onClose();
      }, 300);
    },
    [swipeEnabled, swipeDirection, onClose],
  );

  const swipeHandlers = useSwipeGesture({
    threshold,
    direction:
      swipeDirection === "left" || swipeDirection === "right"
        ? "horizontal"
        : "vertical",
    onSwipe: handleSwipe,
    onSwipeMove: handleSwipeMove,
    onSwipeEnd: handleSwipeEnd,
    enabled: swipeEnabled && isOpen,
  });

  if (!isOpen) return null;

  const setRefs = useCallback(
    (el: HTMLDivElement | null) => {
      (containerRef as any).current = el;
      (swipeHandlers.ref as any).current = el;
    },
    [swipeHandlers.ref],
  );

  return (
    <div
      ref={setRefs}
      className={cn(
        "fixed bg-white shadow-xl flex flex-col overflow-hidden",
        isMobile
          ? "inset-0 z-[51]"
          : "left-[600px] top-0 bottom-0 right-0 border-l border-gray-200 z-50",
        className,
      )}
      style={{
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        opacity,
        transition: isAnimating
          ? "transform 0.3s ease-out, opacity 0.3s ease-out"
          : "none",
      }}
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
    >
      {children}
    </div>
  );
}
