import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { TOUCH_TARGET } from "@/lib/constants/touch-targets";

interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  closeOnBackdrop?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "lg:max-w-sm",
  md: "lg:max-w-md",
  lg: "lg:max-w-lg",
};

/**
 * ResponsiveModal - A responsive modal wrapper component that adapts to different viewport sizes
 *
 * Responsive behavior:
 * - Mobile (< 768px): Full-screen overlay (100vw/100vh) with 16px padding
 * - Tablet (768px - 1023px): 90vw width, centered, with 24px padding
 * - Desktop (≥ 1024px): Fixed width based on size prop, centered, with 32px padding
 *
 * Features:
 * - Touch-friendly close button (44x44px minimum tap target)
 * - Scrollable content area with proper overflow handling
 * - Backdrop click to close (configurable)
 * - Accessible with proper ARIA attributes
 */
export const ResponsiveModal: React.FC<ResponsiveModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  closeOnBackdrop = true,
  className,
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      aria-describedby={description ? "modal-description" : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        className={cn(
          "relative bg-white rounded-lg shadow-lg",
          // Mobile: full screen
          "w-full h-full",
          // Tablet: 90vw width, auto height
          "md:w-[90vw] md:h-auto md:max-h-[90vh]",
          // Desktop: fixed width based on size
          sizeClasses[size],
          // Responsive padding
          "p-4 md:p-6 lg:p-8",
          // Ensure content is scrollable
          "flex flex-col overflow-hidden",
          className,
        )}
      >
        {/* Close Button - Touch-friendly, positioned top-right */}
        <button
          onClick={onClose}
          className={cn(
            "absolute top-4 right-4 z-10",
            "flex items-center justify-center",
            "rounded-full bg-gray-100 hover:bg-gray-200",
            "transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2",
          )}
          style={{
            width: `${TOUCH_TARGET.minSize}px`,
            height: `${TOUCH_TARGET.minSize}px`,
          }}
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Header */}
        {(title || description) && (
          <div className="mb-4 pr-12">
            {title && (
              <h2
                id="modal-title"
                className="text-lg md:text-xl font-semibold text-black"
              >
                {title}
              </h2>
            )}
            {description && (
              <p id="modal-description" className="text-sm text-gray-600 mt-1">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Body - Scrollable content area */}
        <div className="flex-1 overflow-y-auto">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col md:flex-row justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
