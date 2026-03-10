/**
 * Mobile animation optimization utilities.
 * Provides performance-optimized animations for mobile devices.
 */

/**
 * Detect if the user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Detect if the device is likely low-end based on hardware concurrency
 */
export function isLowEndDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check hardware concurrency (number of CPU cores)
  const cores = navigator.hardwareConcurrency || 4;
  
  // Check memory (if available)
  const memory = (navigator as any).deviceMemory;
  
  // Consider device low-end if:
  // - Less than 4 CPU cores
  // - Less than 4GB RAM (if available)
  return cores < 4 || (memory && memory < 4);
}

/**
 * Get optimized animation duration based on device capabilities
 */
export function getOptimizedDuration(baseDuration: number): number {
  if (prefersReducedMotion()) return 0;
  if (isLowEndDevice()) return Math.max(baseDuration * 0.5, 150); // Reduce by 50%, minimum 150ms
  return baseDuration;
}

/**
 * CSS class names for mobile-optimized animations
 */
export const mobileAnimations = {
  // Reduced complexity animations for mobile
  fadeIn: 'animate-in fade-in duration-300',
  fadeOut: 'animate-out fade-out duration-200',
  slideInFromBottom: 'animate-in slide-in-from-bottom-4 duration-300',
  slideOutToBottom: 'animate-out slide-out-to-bottom-4 duration-200',
  slideInFromRight: 'animate-in slide-in-from-right-4 duration-300',
  slideOutToRight: 'animate-out slide-out-to-right-4 duration-200',
  
  // Simple scale animations (GPU-accelerated)
  scaleIn: 'animate-in zoom-in-95 duration-200',
  scaleOut: 'animate-out zoom-out-95 duration-150',
  
  // Spinner animation (essential, always enabled)
  spin: 'animate-spin',
  
  // Pulse for loading states
  pulse: 'animate-pulse',
} as const;

/**
 * Get animation classes with mobile optimization
 */
export function getMobileOptimizedAnimation(
  animationType: keyof typeof mobileAnimations,
  options: {
    respectReducedMotion?: boolean;
    respectLowEndDevice?: boolean;
  } = {}
): string {
  const { respectReducedMotion = true, respectLowEndDevice = true } = options;
  
  // Always allow essential animations like spin and pulse
  const essentialAnimations = ['spin', 'pulse'];
  const isEssential = essentialAnimations.includes(animationType);
  
  if (!isEssential) {
    if (respectReducedMotion && prefersReducedMotion()) {
      return ''; // No animation
    }
    
    if (respectLowEndDevice && isLowEndDevice()) {
      // Return simpler animation or no animation for complex ones
      const simpleAlternatives: Record<string, string> = {
        slideInFromBottom: mobileAnimations.fadeIn,
        slideOutToBottom: mobileAnimations.fadeOut,
        slideInFromRight: mobileAnimations.fadeIn,
        slideOutToRight: mobileAnimations.fadeOut,
      };
      
      return simpleAlternatives[animationType] || mobileAnimations[animationType];
    }
  }
  
  return mobileAnimations[animationType];
}

/**
 * Hook for mobile-optimized animations
 */
export function useMobileOptimizedAnimation() {
  const reducedMotion = prefersReducedMotion();
  const lowEndDevice = isLowEndDevice();
  
  return {
    reducedMotion,
    lowEndDevice,
    shouldAnimate: !reducedMotion && !lowEndDevice,
    getAnimation: (animationType: keyof typeof mobileAnimations) =>
      getMobileOptimizedAnimation(animationType),
    getDuration: getOptimizedDuration,
  };
}

/**
 * CSS-in-JS styles for performance-critical animations
 * These use transform and opacity which are GPU-accelerated
 */
export const performantAnimationStyles = {
  // Use transform instead of changing layout properties
  slideUp: {
    transform: 'translateY(0)',
    transition: 'transform 0.3s ease-out',
  },
  slideDown: {
    transform: 'translateY(100%)',
    transition: 'transform 0.3s ease-out',
  },
  
  // Use opacity for fade effects
  fadeVisible: {
    opacity: 1,
    transition: 'opacity 0.3s ease-out',
  },
  fadeHidden: {
    opacity: 0,
    transition: 'opacity 0.2s ease-out',
  },
  
  // Use scale for size changes
  scaleNormal: {
    transform: 'scale(1)',
    transition: 'transform 0.2s ease-out',
  },
  scalePressed: {
    transform: 'scale(0.98)',
    transition: 'transform 0.1s ease-out',
  },
} as const;

/**
 * Disable animations globally for low-end devices
 */
export function injectMobileAnimationOptimizations() {
  if (typeof document === 'undefined') return;
  
  const shouldDisableAnimations = prefersReducedMotion() || isLowEndDevice();
  
  if (shouldDisableAnimations) {
    const style = document.createElement('style');
    style.textContent = `
      /* Disable non-essential animations on low-end devices */
      *:not(.animate-spin):not(.animate-pulse) {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
      
      /* Keep essential loading animations */
      .animate-spin {
        animation: spin 1s linear infinite;
      }
      
      .animate-pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
    `;
    document.head.appendChild(style);
  }
}