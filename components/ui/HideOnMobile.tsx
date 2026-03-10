import React from "react";

interface HideOnMobileProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wrapper component that hides its children on mobile viewports (< 768px)
 * Shows content on tablet and desktop viewports (≥ 768px)
 */
export function HideOnMobile({ children, className = "" }: HideOnMobileProps) {
  return <div className={`hidden md:block ${className}`}>{children}</div>;
}

export default HideOnMobile;
