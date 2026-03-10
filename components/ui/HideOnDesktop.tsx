import React from "react";

interface HideOnDesktopProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wrapper component that hides its children on desktop viewports (≥ 1024px)
 * Shows content on mobile and tablet viewports (< 1024px)
 */
export function HideOnDesktop({
  children,
  className = "",
}: HideOnDesktopProps) {
  return <div className={`block lg:hidden ${className}`}>{children}</div>;
}

export default HideOnDesktop;
