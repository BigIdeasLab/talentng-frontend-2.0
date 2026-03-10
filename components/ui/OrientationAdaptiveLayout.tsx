'use client';

import React from 'react';
import { useIsLandscape, useOrientation } from '@/hooks/useOrientation';
import { useIsMobile } from '@/hooks/useIsMobile';
import { cn } from '@/lib/utils';

interface OrientationAdaptiveLayoutProps {
  children: React.ReactNode;
  className?: string;
  portraitClassName?: string;
  landscapeClassName?: string;
  mobileLandscapeClassName?: string;
  tabletLandscapeClassName?: string;
  /**
   * Whether to apply tablet-like behavior in mobile landscape
   * @default true
   */
  enableMobileLandscapeTabletBehavior?: boolean;
  /**
   * Additional props to pass to the div element
   */
  [key: string]: any;
}

/**
 * Layout component that adapts based on device orientation
 * Provides different layouts for portrait vs landscape orientations
 */
export function OrientationAdaptiveLayout({
  children,
  className,
  portraitClassName,
  landscapeClassName,
  mobileLandscapeClassName,
  tabletLandscapeClassName,
  enableMobileLandscapeTabletBehavior = true,
  ...props
}: OrientationAdaptiveLayoutProps) {
  const isLandscape = useIsLandscape();
  const isMobile = useIsMobile();
  const { isChanging } = useOrientation();

  const getLayoutClasses = () => {
    const baseClasses = [className];

    if (isChanging) {
      // Add transition classes during orientation change
      baseClasses.push('transition-all duration-300 ease-in-out');
    }

    if (isLandscape) {
      baseClasses.push(landscapeClassName);
      
      if (isMobile) {
        baseClasses.push(mobileLandscapeClassName);
        if (enableMobileLandscapeTabletBehavior) {
          baseClasses.push('mobile-landscape-tablet-layout');
        }
      } else {
        baseClasses.push(tabletLandscapeClassName);
      }
    } else {
      baseClasses.push(portraitClassName);
      if (isMobile) {
        baseClasses.push('portrait-mobile-single-column');
      }
    }

    return cn(...baseClasses.filter(Boolean));
  };

  return (
    <div className={getLayoutClasses()} {...props}>
      {children}
    </div>
  );
}

interface OrientationAdaptiveGridProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Number of columns in portrait mobile (default: 1)
   */
  portraitMobileCols?: 1 | 2;
  /**
   * Number of columns in landscape mobile (default: 2)
   */
  landscapeMobileCols?: 1 | 2 | 3;
  /**
   * Number of columns in tablet (default: 2)
   */
  tabletCols?: 1 | 2 | 3 | 4;
  /**
   * Number of columns in desktop (default: 3)
   */
  desktopCols?: 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * Additional props to pass to the div element
   */
  [key: string]: any;
}

/**
 * Grid component that adapts column count based on orientation and screen size
 */
export function OrientationAdaptiveGrid({
  children,
  className,
  portraitMobileCols = 1,
  landscapeMobileCols = 2,
  tabletCols = 2,
  desktopCols = 3,
  ...props
}: OrientationAdaptiveGridProps) {
  const isLandscape = useIsLandscape();
  const isMobile = useIsMobile();

  const getGridClasses = () => {
    const baseClasses = ['grid', 'gap-4'];

    if (isMobile) {
      if (isLandscape) {
        baseClasses.push(`grid-cols-${landscapeMobileCols}`);
      } else {
        baseClasses.push(`grid-cols-${portraitMobileCols}`);
      }
    }

    // Add responsive classes for larger screens
    baseClasses.push(`md:grid-cols-${tabletCols}`);
    baseClasses.push(`lg:grid-cols-${desktopCols}`);

    return cn(...baseClasses, className);
  };

  return (
    <div className={getGridClasses()} {...props}>
      {children}
    </div>
  );
}

interface OrientationAdaptiveModalProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Whether to use full screen in portrait mobile
   * @default true
   */
  fullScreenPortrait?: boolean;
  /**
   * Whether to use tablet-like sizing in landscape mobile
   * @default true
   */
  tabletSizingLandscape?: boolean;
  /**
   * Additional props to pass to the div element
   */
  [key: string]: any;
}

/**
 * Modal wrapper that adapts sizing based on orientation
 */
export function OrientationAdaptiveModal({
  children,
  className,
  fullScreenPortrait = true,
  tabletSizingLandscape = true,
  ...props
}: OrientationAdaptiveModalProps) {
  const isLandscape = useIsLandscape();
  const isMobile = useIsMobile();

  const getModalClasses = () => {
    const baseClasses = [className];

    if (isMobile) {
      if (isLandscape && tabletSizingLandscape) {
        baseClasses.push('mobile-landscape-modal');
      } else if (!isLandscape && fullScreenPortrait) {
        baseClasses.push('portrait-mobile-modal');
      }
    }

    return cn(...baseClasses.filter(Boolean));
  };

  return (
    <div className={getModalClasses()} {...props}>
      {children}
    </div>
  );
}