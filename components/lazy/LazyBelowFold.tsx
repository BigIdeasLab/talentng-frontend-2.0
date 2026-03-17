/**
 * Component for lazy loading content that appears below the fold.
 * Uses Intersection Observer to load content only when it comes into view.
 */

import React from "react";
import { LazyOnView } from "@/lib/utils/lazy-loading";

interface LazyBelowFoldProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
  /**
   * Height placeholder to maintain layout while loading
   */
  height?: string | number;
  /**
   * Whether to load only once when in view (default: true)
   */
  once?: boolean;
}

const DefaultBelowFoldFallback: React.FC<{ height?: string | number }> = ({
  height,
}) => (
  <div
    className="flex items-center justify-center bg-gray-50 rounded-lg"
    style={{ height: height || "200px" }}
  >
    <div className="flex flex-col items-center gap-2">
      <div className="animate-pulse bg-gray-200 rounded-full h-8 w-8"></div>
      <div className="animate-pulse bg-gray-200 rounded h-4 w-24"></div>
    </div>
  </div>
);

/**
 * Lazy loads content below the fold to improve initial page load performance.
 * Particularly useful for mobile devices with limited resources.
 */
export const LazyBelowFold: React.FC<LazyBelowFoldProps> = ({
  children,
  fallback,
  className,
  height,
  once = true,
}) => {
  const defaultFallback = fallback || (
    <DefaultBelowFoldFallback height={height} />
  );

  return (
    <LazyOnView fallback={defaultFallback} className={className} once={once}>
      {children}
    </LazyOnView>
  );
};

/**
 * Specific component for lazy loading dashboard charts below the fold
 */
export const LazyDashboardChart: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <LazyBelowFold
    height="300px"
    className={className}
    fallback={
      <div className="w-full h-[240px] md:h-[270px] bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-pulse bg-gray-200 rounded-full h-6 w-6"></div>
          <span className="text-sm text-gray-500">Loading chart...</span>
        </div>
      </div>
    }
  >
    {children}
  </LazyBelowFold>
);

/**
 * Specific component for lazy loading data tables below the fold
 */
export const LazyDataTable: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <LazyBelowFold
    height="400px"
    className={className}
    fallback={
      <div className="w-full h-[400px] bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-pulse bg-gray-200 rounded-full h-6 w-6"></div>
          <span className="text-sm text-gray-500">Loading table...</span>
        </div>
      </div>
    }
  >
    {children}
  </LazyBelowFold>
);

/**
 * Specific component for lazy loading card grids below the fold
 */
export const LazyCardGrid: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <LazyBelowFold
    height="600px"
    className={className}
    fallback={
      <div className="w-full h-[600px] bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-pulse bg-gray-200 rounded-full h-6 w-6"></div>
          <span className="text-sm text-gray-500">Loading content...</span>
        </div>
      </div>
    }
  >
    {children}
  </LazyBelowFold>
);
