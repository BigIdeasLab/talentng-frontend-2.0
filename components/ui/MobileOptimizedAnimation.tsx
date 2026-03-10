/**
 * Component wrapper for mobile-optimized animations.
 * Automatically applies performance optimizations based on device capabilities.
 */

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  getMobileOptimizedAnimation, 
  mobileAnimations, 
  injectMobileAnimationOptimizations 
} from '@/lib/utils/mobile-animations';

interface MobileOptimizedAnimationProps {
  children: React.ReactNode;
  animation?: keyof typeof mobileAnimations;
  className?: string;
  /**
   * Whether to respect user's reduced motion preference
   */
  respectReducedMotion?: boolean;
  /**
   * Whether to optimize for low-end devices
   */
  respectLowEndDevice?: boolean;
  /**
   * Custom animation classes to apply
   */
  customAnimation?: string;
}

/**
 * Wrapper component that applies mobile-optimized animations
 */
export const MobileOptimizedAnimation: React.FC<MobileOptimizedAnimationProps> = ({
  children,
  animation,
  className,
  respectReducedMotion = true,
  respectLowEndDevice = true,
  customAnimation,
}) => {
  const animationClass = animation 
    ? getMobileOptimizedAnimation(animation, { respectReducedMotion, respectLowEndDevice })
    : customAnimation || '';

  return (
    <div className={cn(animationClass, className)}>
      {children}
    </div>
  );
};

/**
 * Hook to initialize mobile animation optimizations
 */
export function useMobileAnimationOptimizations() {
  useEffect(() => {
    // Inject global animation optimizations on mount
    injectMobileAnimationOptimizations();
  }, []);
}

/**
 * Higher-order component for mobile animation optimization
 */
export function withMobileAnimationOptimization<T extends Record<string, any>>(
  Component: React.ComponentType<T>
) {
  const MobileOptimizedComponent = React.forwardRef<any, T>((props, ref) => {
    useMobileAnimationOptimizations();
    return <Component {...(props as T)} ref={ref as any} />;
  });

  MobileOptimizedComponent.displayName = `MobileOptimized${Component.displayName || Component.name}`;
  
  return MobileOptimizedComponent;
}

/**
 * Specific animation components for common use cases
 */

export const MobileFadeIn: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <MobileOptimizedAnimation animation="fadeIn" className={className}>
    {children}
  </MobileOptimizedAnimation>
);

export const MobileSlideUp: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <MobileOptimizedAnimation animation="slideInFromBottom" className={className}>
    {children}
  </MobileOptimizedAnimation>
);

export const MobileScaleIn: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <MobileOptimizedAnimation animation="scaleIn" className={className}>
    {children}
  </MobileOptimizedAnimation>
);

/**
 * Loading spinner with mobile optimization
 */
export const MobileOptimizedSpinner: React.FC<{ 
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={cn(
      'rounded-full border-2 border-gray-300 border-t-gray-900',
      sizeClasses[size],
      getMobileOptimizedAnimation('spin'),
      className
    )} />
  );
};

/**
 * Pulse loading animation with mobile optimization
 */
export const MobileOptimizedPulse: React.FC<{ 
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn(
    getMobileOptimizedAnimation('pulse'),
    className
  )}>
    {children}
  </div>
);