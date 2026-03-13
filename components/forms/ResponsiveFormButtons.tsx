"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ResponsiveFormButtonsProps {
  /** Child elements (typically Button components) */
  children: React.ReactNode;
  /** Optional className for additional styling */
  className?: string;
  /** Alignment of buttons on desktop (default: "end") */
  align?: "start" | "center" | "end" | "between";
  /** Whether to reverse button order on mobile (default: false) */
  reverseOnMobile?: boolean;
  /** Gap size between buttons (default: 2) */
  gap?: 2 | 3 | 4 | 6;
  /** Whether buttons should be full width on all screen sizes (default: false) */
  fullWidth?: boolean;
}

/**
 * ResponsiveFormButtons - A responsive form button group component
 *
 * Features:
 * - Stacks buttons vertically on mobile (< 768px) with full width
 * - Displays horizontally on desktop (≥ 768px)
 * - Ensures 44px minimum button height for touch targets
 * - Configurable alignment and spacing
 * - Optional button order reversal on mobile
 * - Optional full width on all screen sizes
 *
 * Requirements: 6.7, 18.1
 *
 * @example
 * ```tsx
 * <ResponsiveFormButtons>
 *   <Button variant="outline">Cancel</Button>
 *   <Button type="submit">Save</Button>
 * </ResponsiveFormButtons>
 * ```
 *
 * @example With custom alignment
 * ```tsx
 * <ResponsiveFormButtons align="start">
 *   <Button>Back</Button>
 *   <Button>Next</Button>
 * </ResponsiveFormButtons>
 * ```
 *
 * @example With reversed order on mobile
 * ```tsx
 * <ResponsiveFormButtons reverseOnMobile>
 *   <Button variant="outline">Cancel</Button>
 *   <Button type="submit">Submit</Button>
 * </ResponsiveFormButtons>
 * ```
 *
 * @example With full width on all screen sizes
 * ```tsx
 * <ResponsiveFormButtons fullWidth>
 *   <Button type="submit">Continue</Button>
 * </ResponsiveFormButtons>
 * ```
 */
export function ResponsiveFormButtons({
  children,
  className,
  align = "end",
  reverseOnMobile = false,
  gap = 2,
  fullWidth = false,
}: ResponsiveFormButtonsProps) {
  const containerClasses = cn(
    // Base layout - flex container
    "flex",
    // Stack vertically on mobile, horizontally on desktop
    "flex-col md:flex-row",
    // Gap between buttons
    {
      "gap-2": gap === 2,
      "gap-3": gap === 3,
      "gap-4": gap === 4,
      "gap-6": gap === 6,
    },
    // Reverse order on mobile if specified
    reverseOnMobile && "flex-col-reverse md:flex-row",
    // Alignment on desktop
    {
      "md:justify-start": align === "start",
      "md:justify-center": align === "center",
      "md:justify-end": align === "end",
      "md:justify-between": align === "between",
    },
    // Full width on mobile for proper button stretching
    "w-full",
    className,
  );

  // Wrap children to ensure buttons get full width on mobile
  const wrappedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) {
      return child;
    }

    // Add responsive width classes to button elements
    return React.cloneElement(child, {
      className: cn(
        // Full width on mobile, conditional width on desktop based on fullWidth prop
        fullWidth ? "w-full" : "w-full md:w-auto",
        // Ensure minimum height for touch targets (44px)
        "min-h-[44px]",
        child.props.className,
      ),
    } as React.HTMLAttributes<HTMLElement>);
  });

  return <div className={containerClasses}>{wrappedChildren}</div>;
}
