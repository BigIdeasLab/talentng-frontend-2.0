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
import { cn } from "@/lib/utils";
import { TOUCH_TARGET } from "@/lib/constants/touch-targets";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

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
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetPortal>
        <SheetOverlay />
        <SheetContent
          side="left"
          className={cn(
            // Base styles
            "fixed inset-y-0 left-0 z-50 h-full w-[280px] bg-white p-0 shadow-lg",
            // Animation styles
            "transition-transform duration-300 ease-in-out",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
            // Ensure touch-friendly spacing
            "flex flex-col",
            className
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
            className="flex-1 overflow-y-auto"
            style={{
              // Ensure minimum tap target spacing
              paddingTop: TOUCH_TARGET.minSpacing,
              paddingBottom: TOUCH_TARGET.minSpacing,
            }}
          >
            {children}
          </div>
        </SheetContent>
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
}

export function MobileDrawerItem({
  children,
  onClick,
  className,
  href,
}: MobileDrawerItemProps) {
  const Component = href ? "a" : "button";

  return (
    <Component
      href={href}
      onClick={onClick}
      className={cn(
        // Touch-friendly tap target
        "flex w-full items-center px-6 py-3 text-left",
        // Ensure minimum tap target height
        `min-h-[${TOUCH_TARGET.minSize}px]`,
        // Visual feedback for touch
        "active:bg-gray-100 transition-colors",
        // Typography
        "text-base font-medium text-gray-900",
        // Hover state (for devices that support it)
        "hover:bg-gray-50",
        className
      )}
      style={{
        minHeight: `${TOUCH_TARGET.minSize}px`,
      }}
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
        <div className="px-6 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          {title}
        </div>
      )}
      {children}
    </div>
  );
}
