"use client";

import { useState, useRef, useCallback } from "react";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";

interface SwipeableNotificationItemProps {
  /**
   * The notification content to render
   */
  children: React.ReactNode;
  /**
   * Callback when the notification is dismissed via swipe
   */
  onDismiss?: () => void;
  /**
   * Whether the swipe-to-dismiss is enabled
   * @default true
   */
  enabled?: boolean;
  /**
   * Custom className for the container
   */
  className?: string;
  /**
   * Swipe threshold in pixels
   * @default 120
   */
  threshold?: number;
}

/**
 * SwipeableNotificationItem wraps notification items with swipe-to-dismiss functionality.
 * Provides visual feedback during swipe and smooth animations.
 * 
 * @example
 * ```tsx
 * <SwipeableNotificationItem onDismiss={() => deleteNotification(id)}>
 *   <NotificationCard notification={notification} />
 * </SwipeableNotificationItem>
 * ```
 */
export function SwipeableNotificationItem({
  children,
  onDismiss,
  enabled = true,
  className,
  threshold = 120,
}: SwipeableNotificationItemProps) {
  const [transform, setTransform] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSwipeMove = useCallback((deltaX: number, deltaY: number, progress: number) => {
    // Only respond to horizontal swipes
    if (Math.abs(deltaX) < Math.abs(deltaY)) return;

    setTransform(deltaX);
    setOpacity(1 - Math.abs(progress) * 0.3); // Fade out slightly during swipe
    setShowDeleteIcon(Math.abs(deltaX) > threshold * 0.5); // Show delete icon at 50% threshold
  }, [threshold]);

  const handleSwipeEnd = useCallback(() => {
    if (!isAnimating) {
      // Reset position with animation
      setIsAnimating(true);
      setTransform(0);
      setOpacity(1);
      setShowDeleteIcon(false);
      
      // Remove animation flag after transition
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [isAnimating]);

  const handleSwipe = useCallback((direction: "left" | "right" | "up" | "down") => {
    if (direction === "left" || direction === "right") {
      // Animate out before dismissing
      setIsAnimating(true);
      const dismissDirection = direction === "left" ? -window.innerWidth : window.innerWidth;
      setTransform(dismissDirection);
      setOpacity(0);
      
      // Call onDismiss after animation completes
      setTimeout(() => {
        onDismiss?.();
      }, 300);
    }
  }, [onDismiss]);

  const swipeHandlers = useSwipeGesture({
    threshold,
    direction: "horizontal",
    onSwipe: handleSwipe,
    onSwipeMove: handleSwipeMove,
    onSwipeEnd: handleSwipeEnd,
    enabled,
  });

  const setRefs = useCallback((el: HTMLDivElement | null) => {
    (containerRef as any).current = el;
    (swipeHandlers.ref as any).current = el;
  }, [swipeHandlers.ref]);

  return (
    <div
      ref={setRefs}
      className={cn(
        "relative overflow-hidden",
        className
      )}
      style={{
        transform: `translateX(${transform}px)`,
        opacity,
        transition: isAnimating ? "transform 0.3s ease-out, opacity 0.3s ease-out" : "none",
      }}
    >
      {/* Delete icon background - shows during swipe */}
      {showDeleteIcon && (
        <div
          className={cn(
            "absolute inset-y-0 flex items-center justify-center w-16 transition-opacity duration-200",
            transform > 0 ? "left-0 bg-red-500" : "right-0 bg-red-500"
          )}
          style={{
            opacity: Math.min(Math.abs(transform) / threshold, 1),
          }}
        >
          <Trash2 className="w-5 h-5 text-white" />
        </div>
      )}

      {/* Notification content */}
      <div className="relative bg-white">
        {children}
      </div>
    </div>
  );
}