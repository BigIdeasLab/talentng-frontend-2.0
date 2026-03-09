"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ResponsiveFormFieldProps {
  /** Child elements (typically form inputs, labels, etc.) */
  children: React.ReactNode;
  /** Optional className for additional styling */
  className?: string;
  /** Whether to force full width on all breakpoints (default: false) */
  fullWidth?: boolean;
  /** Whether to stack vertically on all breakpoints (default: false) */
  alwaysStack?: boolean;
  /** Whether this field should span full width in multi-column layouts (default: false) */
  spanFull?: boolean;
}

/**
 * ResponsiveFormField - A responsive form field wrapper component
 *
 * Features:
 * - Stacks fields vertically on mobile (< 1024px)
 * - Supports multi-column layouts on desktop (≥ 1024px)
 * - Applies full width on mobile: w-full lg:w-auto
 * - Ensures minimum 44px input height on mobile for touch targets
 * - Positions labels above inputs on mobile
 * - Provides consistent spacing and layout patterns
 *
 * Requirements: 6.1, 6.2, 6.3, 6.4, 18.1
 *
 * @example
 * ```tsx
 * <ResponsiveFormField>
 *   <Label>Email</Label>
 *   <Input type="email" />
 * </ResponsiveFormField>
 * ```
 *
 * @example Multi-column layout
 * ```tsx
 * <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
 *   <ResponsiveFormField>
 *     <Label>First Name</Label>
 *     <Input />
 *   </ResponsiveFormField>
 *   <ResponsiveFormField>
 *     <Label>Last Name</Label>
 *     <Input />
 *   </ResponsiveFormField>
 * </div>
 * ```
 */
export function ResponsiveFormField({
  children,
  className,
  fullWidth = false,
  alwaysStack = false,
  spanFull = false,
}: ResponsiveFormFieldProps) {
  const fieldClasses = cn(
    // Base layout - flex column for vertical stacking
    "flex flex-col",
    // Spacing between label and input
    "gap-2",
    // Width handling
    fullWidth ? "w-full" : "w-full lg:w-auto",
    // Stack vertically on mobile, allow horizontal on desktop if needed
    alwaysStack && "flex-col",
    // Span full width in grid layouts
    spanFull && "lg:col-span-2",
    // Touch-friendly minimum heights are applied via input components
    className,
  );

  return <div className={fieldClasses}>{children}</div>;
}

/**
 * ResponsiveFormRow - A container for multiple form fields in a row
 *
 * Features:
 * - Single column on mobile (< 1024px)
 * - Multi-column on desktop (≥ 1024px)
 * - Configurable number of columns (2, 3, or 4)
 * - Consistent gap spacing
 *
 * @example
 * ```tsx
 * <ResponsiveFormRow columns={2}>
 *   <ResponsiveFormField>
 *     <Label>First Name</Label>
 *     <Input />
 *   </ResponsiveFormField>
 *   <ResponsiveFormField>
 *     <Label>Last Name</Label>
 *     <Input />
 *   </ResponsiveFormField>
 * </ResponsiveFormRow>
 * ```
 */
export interface ResponsiveFormRowProps {
  /** Child elements (typically ResponsiveFormField components) */
  children: React.ReactNode;
  /** Number of columns on desktop (default: 2) */
  columns?: 2 | 3 | 4;
  /** Optional className for additional styling */
  className?: string;
  /** Gap size between fields (default: 4) */
  gap?: 2 | 3 | 4 | 6 | 8;
}

export function ResponsiveFormRow({
  children,
  columns = 2,
  className,
  gap = 4,
}: ResponsiveFormRowProps) {
  const rowClasses = cn(
    "grid",
    "grid-cols-1",
    {
      "lg:grid-cols-2": columns === 2,
      "lg:grid-cols-3": columns === 3,
      "lg:grid-cols-4": columns === 4,
    },
    {
      "gap-2": gap === 2,
      "gap-3": gap === 3,
      "gap-4": gap === 4,
      "gap-6": gap === 6,
      "gap-8": gap === 8,
    },
    className,
  );

  return <div className={rowClasses}>{children}</div>;
}
