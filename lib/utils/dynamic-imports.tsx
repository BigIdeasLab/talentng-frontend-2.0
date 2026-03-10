/**
 * Utilities for dynamic imports and code splitting optimization.
 * These utilities help reduce bundle size by loading components only when needed.
 */

import React from "react";
import dynamic from "next/dynamic";

/**
 * Options for dynamic component loading
 */
interface DynamicComponentOptions {
  /**
   * Custom loading component
   */
  loading?: () => React.ReactNode;
  /**
   * Whether to disable server-side rendering for this component
   */
  ssr?: boolean;
}

/**
 * Default loading component for dynamic imports
 */
const DefaultDynamicLoading = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
  </div>
);

/**
 * Create a dynamically imported component with error handling
 */
export function createDynamicComponent<T extends Record<string, any>>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>,
  options: DynamicComponentOptions = {},
) {
  const { loading = DefaultDynamicLoading, ssr = true } = options;

  return dynamic(importFn, {
    loading,
    ssr,
  });
}

/**
 * Create a dynamic modal component (typically no SSR needed)
 */
export function createDynamicModal<T extends Record<string, any>>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>,
) {
  return createDynamicComponent(importFn, {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 m-4 max-w-sm w-full">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    ),
  });
}

/**
 * Create a dynamic chart component (no SSR needed for charts)
 */
export function createDynamicChart<T extends Record<string, any>>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>,
) {
  return createDynamicComponent(importFn, {
    ssr: false,
    loading: () => (
      <div className="w-full h-[300px] md:h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          <span className="text-sm text-gray-600">Loading chart...</span>
        </div>
      </div>
    ),
  });
}

/**
 * Create a dynamic table component
 */
export function createDynamicTable<T extends Record<string, any>>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>,
) {
  return createDynamicComponent(importFn, {
    loading: () => (
      <div className="w-full h-[400px] bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          <span className="text-sm text-gray-600">Loading table...</span>
        </div>
      </div>
    ),
  });
}

/**
 * Preload a dynamic component
 */
export function preloadComponent(importFn: () => Promise<any>) {
  // Only preload on client side
  if (typeof window !== "undefined") {
    // Use requestIdleCallback if available, otherwise setTimeout
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(() => {
        importFn().catch(() => {
          // Ignore preload errors
        });
      });
    } else {
      setTimeout(() => {
        importFn().catch(() => {
          // Ignore preload errors
        });
      }, 100);
    }
  }
}

/**
 * Hook for preloading components on hover or focus
 */
export function usePreloadOnHover(importFn: () => Promise<any>) {
  const preload = React.useCallback(() => {
    preloadComponent(importFn);
  }, [importFn]);

  return {
    onMouseEnter: preload,
    onFocus: preload,
  };
}

/**
 * Component for preloading resources when they come into view
 */
interface PreloadOnViewProps {
  importFn: () => Promise<any>;
  children: React.ReactNode;
  rootMargin?: string;
}

export const PreloadOnView: React.FC<PreloadOnViewProps> = ({
  importFn,
  children,
  rootMargin = "100px",
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [hasPreloaded, setHasPreloaded] = React.useState(false);

  React.useEffect(() => {
    const element = ref.current;
    if (!element || hasPreloaded) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasPreloaded) {
          preloadComponent(importFn);
          setHasPreloaded(true);
          observer.unobserve(element);
        }
      },
      { rootMargin },
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [importFn, hasPreloaded, rootMargin]);

  return <div ref={ref}>{children}</div>;
};
