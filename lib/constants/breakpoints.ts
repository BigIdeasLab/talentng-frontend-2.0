/**
 * Breakpoint constants for responsive design
 *
 * Mobile viewport: < 768px
 * Tablet viewport: 768px - 1023px
 * Desktop viewport: >= 1024px
 */

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
} as const;

export const TAILWIND_BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;
