import React from "react";

interface ShowOnMobileProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wrapper component that shows its children only on mobile viewports (< 768px)
 * Hides content on tablet and desktop viewports (≥ 768px)
 */
export function ShowOnMobile({ children, className = "" }: ShowOnMobileProps) {
  return <div className={`block md:hidden ${className}`}>{children}</div>;
}

export default ShowOnMobile;
