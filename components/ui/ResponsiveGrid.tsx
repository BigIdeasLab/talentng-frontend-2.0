"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ResponsiveGridProps {
  /** Number of columns on desktop (lg and xl breakpoints) */
  columns?: 3 | 4;
  /** Child elements to render in the grid */
  children: React.ReactNode;
  /** Optional className for additional styling */
  className?: string;
  /** Optional gap size (default: 4 = 1rem) */
  gap?: 2 | 3 | 4 | 6 | 8;
}

/**
 * ResponsiveGrid - A responsive grid layout component
 * 
 * Features:
 * - Single column on mobile (< 768px)
 * - Two columns on tablet (768px - 1023px)
 * - Three or four columns on desktop (≥ 1024px) based on columns prop
 * - Consistent gap spacing across breakpoints
 * - Configurable gap size
 * 
 * Requirements: 5.1, 5.2, 5.3, 5.4
 */
export function ResponsiveGrid({
  columns = 3,
  children,
  className,
  gap = 4,
}: ResponsiveGridProps) {
  const gridClasses = cn(
    "grid",
    "grid-cols-1",
    "md:grid-cols-2",
    columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4",
    {
      "gap-2": gap === 2,
      "gap-3": gap === 3,
      "gap-4": gap === 4,
      "gap-6": gap === 6,
      "gap-8": gap === 8,
    },
    className
  );

  return <div className={gridClasses}>{children}</div>;
}
