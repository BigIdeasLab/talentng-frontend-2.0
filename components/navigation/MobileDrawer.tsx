"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { TOUCH_TARGET } from "@/lib/constants/touch-targets";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useIsLandscape } from "@/hooks/useOrientation";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useTabletKeyboardContainer } from "@/hooks/useTabletKeyboardNavigation";
import {
  keyboardHandlers,
  TABLET_FOCUS_STYLES,
} from "@/lib/utils/keyboard-navigation";
import {
  useScreenReader,
  MOBILE_ARIA_ATTRIBUTES,
} from "@/lib/utils/screen-reader";

interface MobileDrawerProps {
  /**
   * Controls whether the drawer is open or closed
   */
  isOpen: boolean;
  /**
   * Callback function called when the drawer should close
   */
  onClose: () => void;
  /**
   * Navigation items and content to display in the drawer
   */
  children: React.ReactNode;
  /**
   * Optional className for additional styling
   */
  className?: string;
  /**
   * Optional title for accessibility (hidden visually but available to screen readers)
   */
  title?: string;
  /**
   * Optional description for accessibility (hidden visually but available to screen readers)
   */
  description?: string;
}

/**
 * MobileDrawer component provides mobile-optimized navigation
 * that slides in from the left side of the screen.
 *
 * Features:
 * - Slide-in animation from left with overlay backdrop
 * - Swipe-to-close gesture support (via Radix UI Sheet)
 * - Focus trap when open
 * - Body scroll prevention when open
 * - Touch-friendly tap targets (minimum 44x44px)
 *
 * @example
 * ```tsx
 * <MobileDrawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
 *   <nav>
 *     <a href="/dashboard">Dashboard</a>
 *     <a href="/profile">Profile</a>
 *   </nav>
 * </MobileDrawer>
 * ```
 */
export function MobileDrawer({
  isOpen,
  onClose,
  children,
  className,
  title = "Navigation Menu",
  description = "Mobile navigation drawer",
}: MobileDrawerProps) {
  const isLandscape = useIsLandscape();
  const isMobile = useIsMobile();
  const { containerRef, isTabletMode } =
    useTabletKeyboardContainer<HTMLDivElement>();
  const { announceModalState } = useScreenReader();

  // Announce drawer state changes for screen readers
  React.useEffect(() => {
    announceModalState(isOpen, "Navigation menu");
  }, [isOpen, announceModalState]);

  // Determine drawer width based on orientation and device type
  const getDrawerWidth = () => {
    if (isMobile && isLandscape) {
      // In landscape mobile, use smaller width to preserve content space
      return "w-[320px] max-w-[40vw]";
    }
    // Default width for portrait mobile and tablet
    return "w-[280px]";
  };

  // Enhanced keyboard navigation for tablets
  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (isTabletMode) {
        // Handle Escape key to close drawer
        keyboardHandlers.handleEscape(onClose)(event);
      }
    },
    [isTabletMode, onClose],
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetPortal>
        {/* Custom lighter overlay */}
        <SheetOverlay className="bg-black/20" />
        <SheetPrimitive.Content
          className={cn(
            // Base styles
            "fixed left-0 z-40 h-full bg-white p-0 shadow-lg",
            // Position below header (header height is approximately 64px)
            "top-16 inset-y-16",
            // Orientation-adaptive width
            getDrawerWidth(),
            // Animation styles
            "transition-transform duration-300 ease-in-out",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
            // Ensure touch-friendly spacing
            "flex flex-col",
            className,
          )}
          // Prevent default close button from showing (we'll handle close via navigation)
          onPointerDownOutside={onClose}
          onEscapeKeyDown={onClose}
        >
          {/* Accessibility: Hidden title and description for screen readers */}
          <VisuallyHidden>
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </VisuallyHidden>

          {/* Navigation content wrapper with proper spacing */}
          <div
            ref={containerRef}
            className="flex-1 overflow-y-auto"
            style={{
              // Ensure minimum tap target spacing
              paddingTop: TOUCH_TARGET.minSpacing,
              paddingBottom: TOUCH_TARGET.minSpacing,
            }}
            onKeyDown={handleKeyDown}
            {...MOBILE_ARIA_ATTRIBUTES.mobileMenu}
          >
            {children}
          </div>
        </SheetPrimitive.Content>
      </SheetPortal>
    </Sheet>
  );
}

/**
 * MobileDrawerItem component for navigation items within the drawer.
 * Ensures touch-friendly tap targets and proper spacing.
 */
interface MobileDrawerItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  href?: string;
  /**
   * Accessible label for screen readers
   */
  ariaLabel?: string;
  /**
   * Whether this item is currently active/selected
   */
  isActive?: boolean;
}

export function MobileDrawerItem({
  children,
  onClick,
  className,
  href,
  ariaLabel,
  isActive = false,
}: MobileDrawerItemProps) {
  const Component = href ? "a" : "button";
  const { announceNavigation } = useScreenReader();

  const handleClick = React.useCallback(() => {
    if (onClick) {
      onClick();
    }
    // Announce navigation for screen readers
    if (ariaLabel) {
      announceNavigation(ariaLabel);
    }
  }, [onClick, ariaLabel, announceNavigation]);

  return (
    <Component
      href={href}
      onClick={handleClick}
      className={cn(
        // Touch-friendly tap target
        "flex w-full items-center px-6 py-3 text-left",
        // Ensure minimum tap target height
        `min-h-[${TOUCH_TARGET.minSize}px]`,
        // Visual feedback for touch
        "active:bg-gray-100 active:scale-[0.98] transition-all",
        // Typography
        "text-base font-medium text-gray-900",
        // Hover state (for devices that support it)
        "hover:bg-gray-50",
        // Enhanced focus styles for tablet keyboard navigation
        TABLET_FOCUS_STYLES.focusRing,
        // Active state styling
        isActive && "bg-blue-50 text-blue-700 border-r-2 border-blue-700",
        className,
      )}
      style={{
        minHeight: `${TOUCH_TARGET.minSize}px`,
      }}
      // Enhanced keyboard support
      onKeyDown={keyboardHandlers.handleActivation(() => handleClick())}
      role={href ? undefined : "menuitem"}
      tabIndex={0}
      aria-label={ariaLabel}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </Component>
  );
}

/**
 * MobileDrawerSection component for grouping navigation items.
 * Provides proper spacing between sections.
 */
interface MobileDrawerSectionProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function MobileDrawerSection({
  children,
  title,
  className,
}: MobileDrawerSectionProps) {
  return (
    <div
      className={cn("py-2", className)}
      style={{
        marginBottom: TOUCH_TARGET.minSpacing,
      }}
    >
      {title && (
        <div className="px-6 py-2 text-sm md:text-xs font-semibold uppercase tracking-wider text-gray-500">
          {title}
        </div>
      )}
      {children}
    </div>
  );
}
