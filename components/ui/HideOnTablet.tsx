import React from "react";

interface HideOnTabletProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wrapper component that hides its children on tablet viewports (768px - 1023px)
 * Shows content on mobile and desktop viewports
 */
export function HideOnTablet({ children, className = "" }: HideOnTabletProps) {
  return (
    <div className={`block md:hidden lg:block ${className}`}>{children}</div>
  );
}

export default HideOnTablet;
