/**
 * Resource prefetching utilities for mobile performance optimization.
 * Prefetches critical resources for mobile navigation and data loading.
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import { useIsMobile } from '@/hooks/useIsMobile';

/**
 * Configuration for resource prefetching
 */
interface PrefetchConfig {
  /**
   * Whether to enable prefetching on mobile
   */
  enableOnMobile?: boolean;
  /**
   * Delay before prefetching (ms)
   */
  delay?: number;
  /**
   * Whether to prefetch only on idle
   */
  onlyOnIdle?: boolean;
  /**
   * Priority of the prefetch request
   */
  priority?: 'high' | 'low' | 'auto';
}

/**
 * Default prefetch configuration
 */
const DEFAULT_PREFETCH_CONFIG: PrefetchConfig = {
  enableOnMobile: true,
  delay: 100,
  onlyOnIdle: true,
  priority: 'low',
};

/**
 * Hook for prefetching Next.js routes
 */
export function usePrefetchRoute(
  href: string,
  config: PrefetchConfig = {}
) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { enableOnMobile, delay, onlyOnIdle, priority } = { ...DEFAULT_PREFETCH_CONFIG, ...config };
  
  const prefetch = React.useCallback(() => {
    if (!enableOnMobile && isMobile) return;
    
    const doPrefetch = () => {
      try {
        router.prefetch(href);
      } catch (error) {
        console.warn(`Failed to prefetch route: ${href}`, error);
      }
    };
    
    if (delay && delay > 0) {
      if (onlyOnIdle && 'requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
          setTimeout(doPrefetch, delay);
        });
      } else {
        setTimeout(doPrefetch, delay);
      }
    } else {
      doPrefetch();
    }
  }, [router, href, enableOnMobile, isMobile, delay, onlyOnIdle]);
  
  return prefetch;
}

/**
 * Hook for prefetching data
 */
export function usePrefetchData<T>(
  fetchFn: () => Promise<T>,
  config: PrefetchConfig = {}
) {
  const isMobile = useIsMobile();
  const { enableOnMobile, delay, onlyOnIdle } = { ...DEFAULT_PREFETCH_CONFIG, ...config };
  const [prefetchedData, setPrefetchedData] = React.useState<T | null>(null);
  const [isPrefetching, setIsPrefetching] = React.useState(false);
  
  const prefetch = React.useCallback(() => {
    if (!enableOnMobile && isMobile) return;
    if (isPrefetching || prefetchedData) return;
    
    const doPrefetch = async () => {
      setIsPrefetching(true);
      try {
        const data = await fetchFn();
        setPrefetchedData(data);
      } catch (error) {
        console.warn('Failed to prefetch data:', error);
      } finally {
        setIsPrefetching(false);
      }
    };
    
    if (delay && delay > 0) {
      if (onlyOnIdle && 'requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
          setTimeout(doPrefetch, delay);
        });
      } else {
        setTimeout(doPrefetch, delay);
      }
    } else {
      doPrefetch();
    }
  }, [fetchFn, enableOnMobile, isMobile, delay, onlyOnIdle, isPrefetching, prefetchedData]);
  
  return { prefetch, prefetchedData, isPrefetching };
}

/**
 * Component for prefetching resources on hover/focus
 */
interface PrefetchOnInteractionProps {
  children: React.ReactElement;
  href?: string;
  onPrefetch?: () => void;
  config?: PrefetchConfig;
}

export const PrefetchOnInteraction: React.FC<PrefetchOnInteractionProps> = ({
  children,
  href,
  onPrefetch,
  config = {},
}) => {
  const prefetchRoute = usePrefetchRoute(href || '', config);
  const [hasPrefetched, setHasPrefetched] = React.useState(false);
  
  const handleInteraction = React.useCallback(() => {
    if (hasPrefetched) return;
    
    setHasPrefetched(true);
    
    if (href) {
      prefetchRoute();
    }
    
    if (onPrefetch) {
      onPrefetch();
    }
  }, [href, prefetchRoute, onPrefetch, hasPrefetched]);
  
  return React.cloneElement(children, {
    onMouseEnter: handleInteraction,
    onFocus: handleInteraction,
    ...children.props,
  });
};

/**
 * Component for prefetching resources when they come into view
 */
interface PrefetchOnViewProps {
  children: React.ReactNode;
  href?: string;
  onPrefetch?: () => void;
  config?: PrefetchConfig;
  rootMargin?: string;
}

export const PrefetchOnView: React.FC<PrefetchOnViewProps> = ({
  children,
  href,
  onPrefetch,
  config = {},
  rootMargin = '100px',
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const prefetchRoute = usePrefetchRoute(href || '', config);
  const [hasPrefetched, setHasPrefetched] = React.useState(false);
  
  React.useEffect(() => {
    const element = ref.current;
    if (!element || hasPrefetched) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasPrefetched) {
          setHasPrefetched(true);
          
          if (href) {
            prefetchRoute();
          }
          
          if (onPrefetch) {
            onPrefetch();
          }
          
          observer.unobserve(element);
        }
      },
      { rootMargin }
    );
    
    observer.observe(element);
    
    return () => {
      observer.unobserve(element);
    };
  }, [href, prefetchRoute, onPrefetch, hasPrefetched, rootMargin]);
  
  return <div ref={ref}>{children}</div>;
};

/**
 * Prefetch critical routes for the application
 */
export function prefetchCriticalRoutes() {
  if (typeof window === 'undefined') return;
  
  const criticalRoutes = [
    '/dashboard',
    '/opportunities',
    '/applicants',
    '/profile',
    '/calendar',
  ];
  
  const prefetchRoute = (href: string) => {
    try {
      // Use Next.js router prefetch if available
      if ((window as any).next?.router) {
        (window as any).next.router.prefetch(href);
      } else {
        // Fallback to link prefetch
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = href;
        document.head.appendChild(link);
      }
    } catch (error) {
      console.warn(`Failed to prefetch route: ${href}`, error);
    }
  };
  
  // Prefetch routes with idle callback
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      criticalRoutes.forEach((route, index) => {
        setTimeout(() => prefetchRoute(route), index * 100);
      });
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      criticalRoutes.forEach((route, index) => {
        setTimeout(() => prefetchRoute(route), index * 100);
      });
    }, 1000);
  }
}

/**
 * Prefetch critical API endpoints
 */
export function prefetchCriticalData() {
  if (typeof window === 'undefined') return;
  
  const criticalEndpoints = [
    '/api/dashboard',
    '/api/notifications',
    '/api/profile',
  ];
  
  const prefetchEndpoint = async (endpoint: string) => {
    try {
      // Use fetch with cache to prefetch data
      await fetch(endpoint, {
        method: 'GET',
        cache: 'force-cache',
        priority: 'low',
      } as RequestInit);
    } catch (error) {
      console.warn(`Failed to prefetch endpoint: ${endpoint}`, error);
    }
  };
  
  // Prefetch data with idle callback
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      criticalEndpoints.forEach((endpoint, index) => {
        setTimeout(() => prefetchEndpoint(endpoint), index * 200);
      });
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      criticalEndpoints.forEach((endpoint, index) => {
        setTimeout(() => prefetchEndpoint(endpoint), index * 200);
      });
    }, 2000);
  }
}

/**
 * Hook for initializing resource prefetching
 */
export function useResourcePrefetching(options: {
  prefetchRoutes?: boolean;
  prefetchData?: boolean;
  enableOnMobile?: boolean;
} = {}) {
  const {
    prefetchRoutes = true,
    prefetchData = true,
    enableOnMobile = true,
  } = options;
  
  const isMobile = useIsMobile();
  
  React.useEffect(() => {
    if (!enableOnMobile && isMobile) return;
    
    if (prefetchRoutes) {
      prefetchCriticalRoutes();
    }
    
    if (prefetchData) {
      prefetchCriticalData();
    }
  }, [prefetchRoutes, prefetchData, enableOnMobile, isMobile]);
}

/**
 * Higher-order component for adding prefetching to navigation links
 */
export function withPrefetching<T extends { href?: string }>(
  Component: React.ComponentType<T>,
  config: PrefetchConfig = {}
) {
  return React.forwardRef<any, T>((props, ref) => {
    const { href } = props;
    
    if (!href) {
      return <Component {...(props as T)} ref={ref as any} />;
    }
    
    return (
      <PrefetchOnInteraction href={href} config={config}>
        <Component {...(props as T)} ref={ref as any} />
      </PrefetchOnInteraction>
    );
  });
}

/**
 * Utility for preloading images
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Utility for preloading multiple images
 */
export function preloadImages(srcs: string[]): Promise<void[]> {
  return Promise.all(srcs.map(preloadImage));
}

/**
 * Hook for preloading images on component mount
 */
export function useImagePreloading(
  images: string[],
  config: { enableOnMobile?: boolean; delay?: number } = {}
) {
  const { enableOnMobile = false, delay = 0 } = config;
  const isMobile = useIsMobile();
  const [loadedImages, setLoadedImages] = React.useState<string[]>([]);
  
  React.useEffect(() => {
    if (!enableOnMobile && isMobile) return;
    
    const preload = async () => {
      try {
        await preloadImages(images);
        setLoadedImages(images);
      } catch (error) {
        console.warn('Failed to preload images:', error);
      }
    };
    
    if (delay > 0) {
      setTimeout(preload, delay);
    } else {
      preload();
    }
  }, [images, enableOnMobile, isMobile, delay]);
  
  return loadedImages;
}