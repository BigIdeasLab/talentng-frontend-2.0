import * as React from "react";

export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = React.useState<Breakpoint | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const getBreakpoint = (): Breakpoint => {
      const width = window.innerWidth;
      if (width >= BREAKPOINTS["2xl"]) return "2xl";
      if (width >= BREAKPOINTS.xl) return "xl";
      if (width >= BREAKPOINTS.lg) return "lg";
      if (width >= BREAKPOINTS.md) return "md";
      if (width >= BREAKPOINTS.sm) return "sm";
      return "xs";
    };

    // Create media query listeners for each breakpoint
    const mediaQueries = [
      window.matchMedia(`(min-width: ${BREAKPOINTS["2xl"]}px)`),
      window.matchMedia(
        `(min-width: ${BREAKPOINTS.xl}px) and (max-width: ${BREAKPOINTS["2xl"] - 1}px)`,
      ),
      window.matchMedia(
        `(min-width: ${BREAKPOINTS.lg}px) and (max-width: ${BREAKPOINTS.xl - 1}px)`,
      ),
      window.matchMedia(
        `(min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`,
      ),
      window.matchMedia(
        `(min-width: ${BREAKPOINTS.sm}px) and (max-width: ${BREAKPOINTS.md - 1}px)`,
      ),
      window.matchMedia(`(max-width: ${BREAKPOINTS.sm - 1}px)`),
    ];

    const onChange = () => {
      setBreakpoint(getBreakpoint());
    };

    // Add listeners to all media queries
    mediaQueries.forEach((mq) => mq.addEventListener("change", onChange));

    // Set initial breakpoint
    setBreakpoint(getBreakpoint());

    // Cleanup
    return () => {
      mediaQueries.forEach((mq) => mq.removeEventListener("change", onChange));
    };
  }, []);

  return breakpoint ?? "xs";
}
