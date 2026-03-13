"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface MobileFormLayoutProps {
  children: React.ReactNode;
  className?: string;
  stickyButton?: React.ReactNode;
  showStickyButton?: boolean;
}

/**
 * Mobile-optimized form layout with sticky bottom button
 * Provides proper spacing and scroll behavior for mobile forms
 */
export const MobileFormLayout: React.FC<MobileFormLayoutProps> = ({
  children,
  className,
  stickyButton,
  showStickyButton = true,
}) => {
  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="pb-20 md:pb-4">{children}</div>
      </div>

      {/* Sticky Bottom Button (Mobile Only) */}
      {showStickyButton && stickyButton && (
        <>
          {/* Mobile Sticky Button */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
            <div className="w-full max-w-sm mx-auto">{stickyButton}</div>
          </div>

          {/* Desktop Inline Button */}
          <div className="hidden md:block pt-4">
            <div className="flex justify-center">{stickyButton}</div>
          </div>
        </>
      )}
    </div>
  );
};
