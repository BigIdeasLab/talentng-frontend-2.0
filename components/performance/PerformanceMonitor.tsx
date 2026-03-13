/**
 * Performance monitoring component for tracking Core Web Vitals and mobile performance
 */

import React from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

interface PerformanceMonitorProps {
  /**
   * Whether to enable performance monitoring
   */
  enabled?: boolean;
  /**
   * Callback for when metrics are collected
   */
  onMetrics?: (metrics: PerformanceMetrics) => void;
  /**
   * Whether to log metrics to console (development only)
   */
  logToConsole?: boolean;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  enabled = process.env.NODE_ENV === "development",
  onMetrics,
  logToConsole = process.env.NODE_ENV === "development",
}) => {
  const isMobile = useIsMobile();
  const metricsRef = React.useRef<PerformanceMetrics>({});

  React.useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const collectMetrics = () => {
      const metrics: PerformanceMetrics = {};

      // Collect Core Web Vitals
      if ("PerformanceObserver" in window) {
        // First Contentful Paint
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcpEntry = entries.find((entry) => entry.name === "first-contentful-paint");
          if (fcpEntry) {
            metrics.fcp = fcpEntry.startTime;
            metricsRef.current.fcp = fcpEntry.startTime;
          }
        });

        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lcpEntry = entries[entries.length - 1];
          if (lcpEntry) {
            metrics.lcp = lcpEntry.startTime;
            metricsRef.current.lcp = lcpEntry.startTime;
          }
        });

        // First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fidEntry = entries[0] as any; // FID entries have processingStart
          if (fidEntry && fidEntry.processingStart) {
            metrics.fid = fidEntry.processingStart - fidEntry.startTime;
            metricsRef.current.fid = fidEntry.processingStart - fidEntry.startTime;
          }
        });

        // Cumulative Layout Shift
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          metrics.cls = clsValue;
          metricsRef.current.cls = clsValue;
        });

        try {
          fcpObserver.observe({ entryTypes: ["paint"] });
          lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
          fidObserver.observe({ entryTypes: ["first-input"] });
          clsObserver.observe({ entryTypes: ["layout-shift"] });
        } catch (error) {
          console.warn("Performance Observer not supported:", error);
        }

        // Cleanup observers
        return () => {
          fcpObserver.disconnect();
          lcpObserver.disconnect();
          fidObserver.disconnect();
          clsObserver.disconnect();
        };
      }

      // Collect Navigation Timing metrics
      if ("performance" in window && (window as any).performance?.timing) {
        const timing = (window as any).performance.timing;
        metrics.ttfb = timing.responseStart - timing.navigationStart;
        metricsRef.current.ttfb = timing.responseStart - timing.navigationStart;
      }
    };

    // Start collecting metrics after page load
    if (document.readyState === "complete") {
      collectMetrics();
    } else {
      window.addEventListener("load", collectMetrics);
    }

    // Report metrics after a delay to ensure all are collected
    const reportTimer = setTimeout(() => {
      const finalMetrics = { ...metricsRef.current };
      
      if (logToConsole) {
        console.group(`🚀 Performance Metrics ${isMobile ? "(Mobile)" : "(Desktop)"}`);
        console.log("First Contentful Paint (FCP):", finalMetrics.fcp ? `${finalMetrics.fcp.toFixed(2)}ms` : "N/A");
        console.log("Largest Contentful Paint (LCP):", finalMetrics.lcp ? `${finalMetrics.lcp.toFixed(2)}ms` : "N/A");
        console.log("First Input Delay (FID):", finalMetrics.fid ? `${finalMetrics.fid.toFixed(2)}ms` : "N/A");
        console.log("Cumulative Layout Shift (CLS):", finalMetrics.cls ? finalMetrics.cls.toFixed(4) : "N/A");
        console.log("Time to First Byte (TTFB):", finalMetrics.ttfb ? `${finalMetrics.ttfb.toFixed(2)}ms` : "N/A");
        
        // Performance recommendations
        if (finalMetrics.lcp && finalMetrics.lcp > 2500) {
          console.warn("⚠️ LCP is slow (>2.5s). Consider optimizing images and critical resources.");
        }
        if (finalMetrics.fid && finalMetrics.fid > 100) {
          console.warn("⚠️ FID is slow (>100ms). Consider reducing JavaScript execution time.");
        }
        if (finalMetrics.cls && finalMetrics.cls > 0.1) {
          console.warn("⚠️ CLS is high (>0.1). Consider fixing layout shifts.");
        }
        console.groupEnd();
      }

      onMetrics?.(finalMetrics);
    }, 3000);

    return () => {
      clearTimeout(reportTimer);
      window.removeEventListener("load", collectMetrics);
    };
  }, [enabled, onMetrics, logToConsole, isMobile]);

  return null; // This component doesn't render anything
};

/**
 * Hook for monitoring component render performance
 */
export function useRenderPerformance(componentName: string) {
  const renderStartTime = React.useRef<number>(0);
  const renderCount = React.useRef<number>(0);

  React.useLayoutEffect(() => {
    renderStartTime.current = performance.now();
    renderCount.current += 1;
  });

  React.useEffect(() => {
    const renderTime = performance.now() - renderStartTime.current;
    
    if (process.env.NODE_ENV === "development" && renderTime > 16) {
      console.warn(
        `🐌 Slow render: ${componentName} took ${renderTime.toFixed(2)}ms (render #${renderCount.current})`
      );
    }
  });

  return {
    renderCount: renderCount.current,
    markRenderStart: () => {
      renderStartTime.current = performance.now();
    },
    measureRender: () => {
      return performance.now() - renderStartTime.current;
    },
  };
}

/**
 * Hook for monitoring memory usage (development only)
 */
export function useMemoryMonitor(intervalMs: number = 5000) {
  const [memoryInfo, setMemoryInfo] = React.useState<{
    usedJSHeapSize?: number;
    totalJSHeapSize?: number;
    jsHeapSizeLimit?: number;
  }>({});

  React.useEffect(() => {
    if (process.env.NODE_ENV !== "development" || typeof window === "undefined") {
      return;
    }

    const checkMemory = () => {
      // @ts-ignore - performance.memory is not in TypeScript types but exists in Chrome
      if (window.performance && window.performance.memory) {
        // @ts-ignore
        const memory = window.performance.memory;
        setMemoryInfo({
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
        });

        // Warn if memory usage is high
        const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
        if (usagePercent > 80) {
          console.warn(`🧠 High memory usage: ${usagePercent.toFixed(1)}%`);
        }
      }
    };

    checkMemory();
    const interval = setInterval(checkMemory, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);

  return memoryInfo;
}