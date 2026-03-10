/**
 * Mobile Performance Provider
 * Initializes mobile performance optimizations including prefetching, memoization, and animations.
 */

import React from 'react';
import { useResourcePrefetching } from '@/lib/utils/resource-prefetching';
import { useMobileAnimationOptimizations } from '@/components/ui/MobileOptimizedAnimation';
import { injectMobileAnimationOptimizations } from '@/lib/utils/mobile-animations';
import { useIsMobile } from '@/hooks/useIsMobile';

interface MobilePerformanceProviderProps {
  children: React.ReactNode;
  /**
   * Configuration for performance optimizations
   */
  config?: {
    /**
     * Enable resource prefetching
     */
    enablePrefetching?: boolean;
    /**
     * Enable animation optimizations
     */
    enableAnimationOptimizations?: boolean;
    /**
     * Enable performance monitoring in development
     */
    enablePerformanceMonitoring?: boolean;
    /**
     * Prefetch configuration
     */
    prefetchConfig?: {
      prefetchRoutes?: boolean;
      prefetchData?: boolean;
      enableOnMobile?: boolean;
    };
  };
}

/**
 * Performance monitoring component (development only)
 */
const PerformanceMonitor: React.FC = () => {
  const isMobile = useIsMobile();
  
  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    
    // Monitor performance metrics
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        if (entry.entryType === 'measure') {
          console.log(`[Performance] ${entry.name}: ${entry.duration.toFixed(2)}ms`);
        }
        
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          // Use startTime instead of deprecated navigationStart
          console.log(`[Performance] Page load: ${(navEntry.loadEventEnd - navEntry.startTime).toFixed(2)}ms`);
        }
        
        if (entry.entryType === 'paint') {
          console.log(`[Performance] ${entry.name}: ${entry.startTime.toFixed(2)}ms`);
        }
      });
    });
    
    // Observe different types of performance entries
    try {
      observer.observe({ entryTypes: ['measure', 'navigation', 'paint'] });
    } catch (error) {
      console.warn('Performance observer not supported:', error);
    }
    
    // Monitor memory usage on mobile
    if (isMobile && 'memory' in performance) {
      const memoryInfo = (performance as any).memory;
      console.log('[Performance] Memory usage:', {
        used: `${(memoryInfo.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
        total: `${(memoryInfo.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
        limit: `${(memoryInfo.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`,
      });
    }
    
    return () => {
      observer.disconnect();
    };
  }, [isMobile]);
  
  return null;
};

/**
 * Mobile Performance Provider Component
 */
export const MobilePerformanceProvider: React.FC<MobilePerformanceProviderProps> = ({
  children,
  config = {},
}) => {
  const {
    enablePrefetching = true,
    enableAnimationOptimizations = true,
    enablePerformanceMonitoring = process.env.NODE_ENV === 'development',
    prefetchConfig = {},
  } = config;
  
  // Initialize resource prefetching
  useResourcePrefetching({
    prefetchRoutes: true,
    prefetchData: true,
    enableOnMobile: true,
    ...prefetchConfig,
  });
  
  // Initialize animation optimizations
  useMobileAnimationOptimizations();
  
  // Inject global animation optimizations
  React.useEffect(() => {
    if (enableAnimationOptimizations) {
      injectMobileAnimationOptimizations();
    }
  }, [enableAnimationOptimizations]);
  
  return (
    <>
      {enablePerformanceMonitoring && <PerformanceMonitor />}
      {children}
    </>
  );
};

/**
 * Hook for accessing mobile performance context
 */
export function useMobilePerformance() {
  const isMobile = useIsMobile();
  
  return {
    isMobile,
    /**
     * Mark the start of a performance measurement
     */
    markStart: (name: string) => {
      if (typeof performance !== 'undefined') {
        performance.mark(`${name}-start`);
      }
    },
    /**
     * Mark the end and measure performance
     */
    markEnd: (name: string) => {
      if (typeof performance !== 'undefined') {
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
      }
    },
    /**
     * Get performance entries
     */
    getEntries: (name?: string) => {
      if (typeof performance !== 'undefined') {
        return name ? performance.getEntriesByName(name) : performance.getEntries();
      }
      return [];
    },
    /**
     * Clear performance marks and measures
     */
    clear: () => {
      if (typeof performance !== 'undefined') {
        performance.clearMarks();
        performance.clearMeasures();
      }
    },
  };
}

/**
 * Higher-order component for adding performance monitoring to components
 */
export function withPerformanceMonitoring<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  componentName?: string
) {
  const name = componentName || Component.displayName || Component.name || 'Component';
  
  return React.forwardRef<any, T>((props, ref) => {
    const { markStart, markEnd } = useMobilePerformance();
    
    React.useEffect(() => {
      markStart(`${name}-render`);
      return () => {
        markEnd(`${name}-render`);
      };
    });
    
    return <Component {...(props as T)} ref={ref as any} />;
  });
}

export default MobilePerformanceProvider;