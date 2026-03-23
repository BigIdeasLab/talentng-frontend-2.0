import React, { Suspense } from "react";

/**
 * Utility for creating lazy-loaded components with proper error boundaries
 * and loading states optimized for mobile performance.
 */

interface LazyComponentProps {
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Default loading fallback for lazy components
 */
export const DefaultLazyFallback: React.FC = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
  </div>
);

/**
 * Modal-specific loading fallback
 */
export const ModalLazyFallback: React.FC = () => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 m-4 max-w-sm w-full">
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
      </div>
    </div>
  </div>
);

/**
 * Chart-specific loading fallback
 */
export const ChartLazyFallback: React.FC = () => (
  <div className="w-full h-[200px] md:h-[220px] bg-gray-100 rounded-lg flex items-center justify-center">
    <div className="flex flex-col items-center gap-2">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
      <span className="text-sm text-gray-600">Loading chart...</span>
    </div>
  </div>
);

/**
 * Wrapper component for lazy-loaded components with Suspense
 */
export const LazyWrapper: React.FC<LazyComponentProps> = ({
  fallback = <DefaultLazyFallback />,
  children,
}) => <Suspense fallback={fallback}>{children}</Suspense>;

/**
 * Higher-order component for creating lazy-loaded components
 */
export function withLazyLoading<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  fallback?: React.ReactNode,
) {
  const LazyComponent = React.lazy(() =>
    Promise.resolve({ default: Component }),
  );

  return React.forwardRef<any, T>((props, ref) => (
    <LazyWrapper fallback={fallback}>
      <LazyComponent {...props} ref={ref} />
    </LazyWrapper>
  ));
}

/**
 * Utility for lazy loading modals with proper fallback
 */
export function createLazyModal<T extends Record<string, any>>(
  importFn: () => Promise<any>,
) {
  const LazyModal = React.lazy(async () => {
    const module = await importFn();
    // Handle both default exports and named exports
    if (module.default) {
      return { default: module.default };
    }
    // If it's a named export, find the first exported component
    const componentName = Object.keys(module).find(
      (key) =>
        typeof module[key] === "function" ||
        (typeof module[key] === "object" && module[key].$$typeof),
    );
    if (componentName) {
      return { default: module[componentName] };
    }
    return module;
  });

  return React.forwardRef<any, T>((props, ref) => (
    <LazyWrapper fallback={<ModalLazyFallback />}>
      <LazyModal {...props} ref={ref} />
    </LazyWrapper>
  ));
}

/**
 * Utility for lazy loading charts with proper fallback
 */
export function createLazyChart<T extends Record<string, any>>(
  importFn: () => Promise<any>,
) {
  const LazyChart = React.lazy(async () => {
    const module = await importFn();
    // Handle both default exports and named exports
    if (module.default) {
      return { default: module.default };
    }
    // If it's a named export, find the first exported component
    const componentName = Object.keys(module).find(
      (key) =>
        typeof module[key] === "function" ||
        (typeof module[key] === "object" && module[key].$$typeof),
    );
    if (componentName) {
      return { default: module[componentName] };
    }
    return module;
  });

  return React.forwardRef<any, T>((props, ref) => (
    <LazyWrapper fallback={<ChartLazyFallback />}>
      <LazyChart {...props} ref={ref} />
    </LazyWrapper>
  ));
}

/**
 * Hook for intersection observer-based lazy loading
 * Useful for components that should only load when they come into view
 */
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {},
) {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const [hasIntersected, setHasIntersected] = React.useState(false);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
        ...options,
      },
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [hasIntersected, options]);

  return { isIntersecting, hasIntersected };
}

/**
 * Component for lazy loading content when it comes into view
 */
interface LazyOnViewProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
  once?: boolean;
}

export const LazyOnView: React.FC<LazyOnViewProps> = ({
  children,
  fallback = <DefaultLazyFallback />,
  className,
  once = true,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const { isIntersecting, hasIntersected } = useIntersectionObserver(ref);

  const shouldRender = once ? hasIntersected : isIntersecting;

  return (
    <div ref={ref} className={className}>
      {shouldRender ? children : fallback}
    </div>
  );
};
