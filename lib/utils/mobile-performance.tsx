/**
 * Mobile performance optimization utilities.
 * Provides memoization, re-render optimization, and performance monitoring for mobile devices.
 */

import React, { useMemo, useCallback, memo } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

/**
 * Enhanced React.memo with mobile-specific optimizations
 */
export function mobileOptimizedMemo<T extends React.ComponentType<any>>(
  Component: T,
  propsAreEqual?: (
    prevProps: React.ComponentProps<T>,
    nextProps: React.ComponentProps<T>,
  ) => boolean,
): T {
  const MemoizedComponent = memo(
    Component,
    propsAreEqual as any,
  ) as unknown as T;

  // Add display name for debugging
  MemoizedComponent.displayName = `MobileOptimized(${Component.displayName || Component.name})`;

  return MemoizedComponent;
}

/**
 * Custom hook for mobile-optimized memoization
 * Reduces memoization complexity on mobile devices to save memory
 */
export function useMobileOptimizedMemo<T>(
  factory: () => T,
  deps: React.DependencyList,
  options: {
    /**
     * Whether to use simplified memoization on mobile
     */
    simplifyOnMobile?: boolean;
    /**
     * Custom mobile dependency list (subset of deps)
     */
    mobileDeps?: React.DependencyList;
  } = {},
): T {
  const isMobile = useIsMobile();
  const { simplifyOnMobile = true, mobileDeps } = options;

  // Use simplified dependencies on mobile if specified
  const effectiveDeps =
    isMobile && simplifyOnMobile && mobileDeps ? mobileDeps : deps;

  return useMemo(factory, effectiveDeps);
}

/**
 * Custom hook for mobile-optimized callbacks
 */
export function useMobileOptimizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList,
  options: {
    /**
     * Whether to use simplified memoization on mobile
     */
    simplifyOnMobile?: boolean;
    /**
     * Custom mobile dependency list (subset of deps)
     */
    mobileDeps?: React.DependencyList;
  } = {},
): T {
  const isMobile = useIsMobile();
  const { simplifyOnMobile = true, mobileDeps } = options;

  // Use simplified dependencies on mobile if specified
  const effectiveDeps =
    isMobile && simplifyOnMobile && mobileDeps ? mobileDeps : deps;

  return useCallback(callback, effectiveDeps);
}

/**
 * Higher-order component for mobile performance optimization
 */
export function withMobilePerformanceOptimization<
  T extends Record<string, any>,
>(
  Component: React.ComponentType<T>,
  options: {
    /**
     * Custom props comparison function
     */
    propsAreEqual?: (prevProps: T, nextProps: T) => boolean;
    /**
     * Whether to enable performance monitoring
     */
    enableProfiling?: boolean;
  } = {},
) {
  const { propsAreEqual, enableProfiling = false } = options;

  const OptimizedComponent = mobileOptimizedMemo(Component, propsAreEqual);

  if (
    enableProfiling &&
    typeof window !== "undefined" &&
    process.env.NODE_ENV === "development"
  ) {
    // Wrap with performance profiling in development
    return React.forwardRef<any, T>((props, ref) => {
      const renderStart = performance.now();

      React.useEffect(() => {
        const renderEnd = performance.now();
        const renderTime = renderEnd - renderStart;

        if (renderTime > 16) {
          // More than one frame (60fps)
          console.warn(
            `[Mobile Performance] ${Component.displayName || Component.name} took ${renderTime.toFixed(2)}ms to render`,
          );
        }
      });

      return <OptimizedComponent {...(props as T)} ref={ref as any} />;
    });
  }

  return OptimizedComponent;
}

/**
 * Hook for debouncing expensive operations on mobile
 */
export function useMobileOptimizedDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  options: {
    /**
     * Longer delay on mobile devices
     */
    mobileDelay?: number;
  } = {},
): T {
  const isMobile = useIsMobile();
  const { mobileDelay } = options;

  const effectiveDelay = isMobile && mobileDelay ? mobileDelay : delay;
  const [debouncedCallback, setDebouncedCallback] = React.useState<T | null>(
    null,
  );

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCallback(() => callback);
    }, effectiveDelay);

    return () => {
      clearTimeout(handler);
    };
  }, [callback, effectiveDelay]);

  return debouncedCallback || callback;
}

/**
 * Hook for throttling expensive operations on mobile
 */
export function useMobileOptimizedThrottle<T extends (...args: any[]) => any>(
  callback: T,
  limit: number,
  options: {
    /**
     * Longer throttle limit on mobile devices
     */
    mobileLimit?: number;
  } = {},
): T {
  const isMobile = useIsMobile();
  const { mobileLimit } = options;

  const effectiveLimit = isMobile && mobileLimit ? mobileLimit : limit;
  const [inThrottle, setInThrottle] = React.useState(false);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      if (!inThrottle) {
        callback(...args);
        setInThrottle(true);
        setTimeout(() => setInThrottle(false), effectiveLimit);
      }
    },
    [callback, effectiveLimit, inThrottle],
  ) as T;

  return throttledCallback;
}

/**
 * Component for lazy rendering expensive content on mobile
 */
interface MobileLazyRenderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  /**
   * Delay before rendering on mobile (ms)
   */
  mobileDelay?: number;
  /**
   * Whether to only apply lazy rendering on mobile
   */
  mobileOnly?: boolean;
}

export const MobileLazyRender: React.FC<MobileLazyRenderProps> = ({
  children,
  fallback = null,
  mobileDelay = 100,
  mobileOnly = true,
}) => {
  const isMobile = useIsMobile();
  const [shouldRender, setShouldRender] = React.useState(
    !mobileOnly || !isMobile,
  );

  React.useEffect(() => {
    if ((mobileOnly && isMobile) || !mobileOnly) {
      const timer = setTimeout(() => {
        setShouldRender(true);
      }, mobileDelay);

      return () => clearTimeout(timer);
    }
  }, [isMobile, mobileDelay, mobileOnly]);

  return shouldRender ? <>{children}</> : <>{fallback}</>;
};

/**
 * Hook for monitoring component re-renders (development only)
 */
export function useRenderTracker(
  componentName: string,
  props?: Record<string, any>,
) {
  const renderCount = React.useRef(0);
  const prevProps = React.useRef(props);

  React.useEffect(() => {
    renderCount.current += 1;

    if (process.env.NODE_ENV === "development") {
      console.log(
        `[Render Tracker] ${componentName} rendered ${renderCount.current} times`,
      );

      if (props && prevProps.current) {
        const changedProps = Object.keys(props).filter(
          (key) => props[key] !== prevProps.current?.[key],
        );

        if (changedProps.length > 0) {
          console.log(
            `[Render Tracker] ${componentName} props changed:`,
            changedProps,
          );
        }
      }

      prevProps.current = props;
    }
  });

  return renderCount.current;
}

/**
 * Utility for shallow comparison of objects (useful for memo propsAreEqual)
 */
export function shallowEqual(
  obj1: Record<string, any>,
  obj2: Record<string, any>,
): boolean {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}

/**
 * Utility for deep comparison of arrays (useful for dependency arrays)
 */
export function arrayEqual(arr1: any[], arr2: any[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }

  return arr1.every((item, index) => item === arr2[index]);
}

/**
 * Performance monitoring utilities
 */
export const performanceMonitor = {
  /**
   * Mark the start of a performance measurement
   */
  mark: (name: string) => {
    if (typeof performance !== "undefined") {
      performance.mark(`${name}-start`);
    }
  },

  /**
   * Measure the time since a mark was created
   */
  measure: (name: string) => {
    if (typeof performance !== "undefined") {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);

      const measure = performance.getEntriesByName(name)[0];
      if (measure && process.env.NODE_ENV === "development") {
        console.log(`[Performance] ${name}: ${measure.duration.toFixed(2)}ms`);
      }

      return measure?.duration || 0;
    }
    return 0;
  },

  /**
   * Clear all performance marks and measures
   */
  clear: () => {
    if (typeof performance !== "undefined") {
      performance.clearMarks();
      performance.clearMeasures();
    }
  },
};
