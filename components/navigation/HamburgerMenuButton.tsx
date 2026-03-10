"use client";

import * as React from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { TOUCH_TARGET } from "@/lib/constants/touch-targets";
import { keyboardHandlers, TABLET_FOCUS_STYLES } from "@/lib/utils/keyboard-navigation";
import { useIsTablet } from "@/hooks/useIsTablet";
import { mobileScreenReaderOptimizations } from "@/lib/utils/screen-reader";

interface HamburgerMenuButtonProps {
  /**
   * Controls whether the menu is open (shows X icon) or closed (shows hamburger icon)
   */
  isOpen: boolean;
  /**
   * Callback function called when the button is clicked
   */
  onClick: () => void;
  /**
   * Optional className for additional styling
   */
  className?: string;
  /**
   * Optional ARIA label for accessibility
   * @default "Toggle navigation menu"
   */
  ariaLabel?: string;
}

/**
 * HamburgerMenuButton component provides a touch-friendly button
 * for toggling the mobile navigation drawer.
 *
 * Features:
 * - Animated icon transition (hamburger ↔ X)
 * - 44x44px minimum tap target for accessibility
 * - ARIA labels for screen readers
 * - Visual feedback on touch/click
 * - Positioned for top-left of mobile header
 *
 * @example
 * ```tsx
 * <HamburgerMenuButton
 *   isOpen={isDrawerOpen}
 *   onClick={() => setIsDrawerOpen(!isDrawerOpen)}
 * />
 * ```
 */
export function HamburgerMenuButton({
  isOpen,
  onClick,
  className,
  ariaLabel = "Toggle navigation menu",
}: HamburgerMenuButtonProps) {
  const isTablet = useIsTablet();

  // Optimize aria label for mobile screen readers
  const optimizedAriaLabel = mobileScreenReaderOptimizations.optimizeButtonLabel(
    ariaLabel,
    isOpen ? "currently open" : "currently closed"
  );

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={optimizedAriaLabel}
      aria-expanded={isOpen}
      aria-controls="mobile-navigation-drawer"
      className={cn(
        // Touch-friendly tap target (44x44px minimum)
        "flex items-center justify-center",
        "rounded-md",
        // Visual feedback for touch/click
        "active:bg-gray-200 active:scale-95 transition-all duration-150",
        // Hover state (for devices that support it)
        "hover:bg-gray-100",
        // Enhanced focus state for tablet keyboard navigation
        isTablet ? TABLET_FOCUS_STYLES.largeFocusRing : TABLET_FOCUS_STYLES.focusRing,
        // Ensure proper z-index for mobile header
        "relative z-10",
        className,
      )}
      style={{
        minWidth: `${TOUCH_TARGET.minSize}px`,
        minHeight: `${TOUCH_TARGET.minSize}px`,
        width: `${TOUCH_TARGET.minSize}px`,
        height: `${TOUCH_TARGET.minSize}px`,
      }}
      // Enhanced keyboard support
      onKeyDown={keyboardHandlers.handleActivation(onClick)}
    >
      {/* Icon with animated transition */}
      <div className="relative w-6 h-6">
        {/* Hamburger icon */}
        <Menu
          className={cn(
            "absolute inset-0 w-6 h-6 text-gray-700 transition-all duration-200",
            isOpen
              ? "opacity-0 rotate-90 scale-0"
              : "opacity-100 rotate-0 scale-100",
          )}
          aria-hidden="true"
        />
        {/* X (close) icon */}
        <X
          className={cn(
            "absolute inset-0 w-6 h-6 text-gray-700 transition-all duration-200",
            isOpen
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-90 scale-0",
          )}
          aria-hidden="true"
        />
      </div>
    </button>
  );
}
