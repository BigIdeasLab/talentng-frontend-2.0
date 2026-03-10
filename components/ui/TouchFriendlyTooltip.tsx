"use client";

import { useState } from "react";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";

interface TouchFriendlyTooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * A tooltip component that adapts to touch devices
 * - On hover devices: Shows tooltip on hover
 * - On touch devices: Shows tooltip on tap/click
 */
export function TouchFriendlyTooltip({
  content,
  children,
  className = "",
}: TouchFriendlyTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const isTouchDevice = useIsTouchDevice();

  const handleMouseEnter = () => {
    if (!isTouchDevice) {
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isTouchDevice) {
      setIsVisible(false);
    }
  };

  const handleClick = () => {
    if (isTouchDevice) {
      setIsVisible(!isVisible);
    }
  };

  const handleTouchStart = () => {
    if (isTouchDevice) {
      setIsVisible(true);
    }
  };

  const handleTouchEnd = () => {
    if (isTouchDevice) {
      // Hide after a delay to allow reading
      setTimeout(() => setIsVisible(false), 2000);
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="cursor-pointer"
      >
        {children}
      </div>

      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
          <div className="bg-gray-900 text-white text-sm rounded-lg px-3 py-2 whitespace-nowrap">
            {content}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
          </div>
        </div>
      )}

      {/* Invisible overlay to close tooltip on touch devices */}
      {isVisible && isTouchDevice && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsVisible(false)}
          onTouchStart={() => setIsVisible(false)}
        />
      )}
    </div>
  );
}
