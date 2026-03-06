import React from "react";

export interface ErrorStateProps {
  /** Error title/heading */
  title?: string;
  /** Error message/description */
  message: string;
  /** Optional retry callback */
  onRetry?: () => void;
  /** Custom retry button text */
  retryText?: string;
  /** Show icon */
  showIcon?: boolean;
  /** Custom icon element */
  icon?: React.ReactNode;
  /** Variant style */
  variant?: "error" | "warning" | "info";
  /** Additional CSS classes for container */
  className?: string;
}

const VARIANT_STYLES = {
  error: {
    border: "border-red-200",
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
    buttonBg: "bg-red-600 hover:bg-red-700",
  },
  warning: {
    border: "border-yellow-200",
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-600",
    buttonBg: "bg-yellow-600 hover:bg-yellow-700",
  },
  info: {
    border: "border-blue-200",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    buttonBg: "bg-blue-600 hover:bg-blue-700",
  },
};

const DEFAULT_ICONS = {
  error: (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  ),
  warning: (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  ),
  info: (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
};

/**
 * Reusable error state component for displaying errors with optional retry functionality
 *
 * @example
 * // Basic error
 * <ErrorState message="Failed to load data" />
 *
 * @example
 * // With retry
 * <ErrorState
 *   title="Error loading opportunities"
 *   message="Failed to fetch opportunities"
 *   onRetry={() => refetch()}
 * />
 *
 * @example
 * // Warning variant
 * <ErrorState
 *   variant="warning"
 *   title="No results found"
 *   message="Try adjusting your filters"
 * />
 */
export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  retryText = "Retry",
  showIcon = true,
  icon,
  variant = "error",
  className = "",
}: ErrorStateProps) {
  const styles = VARIANT_STYLES[variant];
  const defaultIcon = DEFAULT_ICONS[variant];

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div
        className={`max-w-md w-full bg-white border ${styles.border} rounded-lg p-6 shadow-sm`}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          {showIcon && (
            <div
              className={`flex-shrink-0 w-10 h-10 ${styles.iconBg} rounded-full flex items-center justify-center ${styles.iconColor}`}
            >
              {icon || defaultIcon}
            </div>
          )}

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 font-inter-tight mb-1">
              {title}
            </h3>
            <p className="text-sm text-gray-600 font-inter-tight mb-4">
              {message}
            </p>

            {/* Retry Button */}
            {onRetry && (
              <button
                onClick={onRetry}
                className={`inline-flex items-center gap-2 px-4 py-2 ${styles.buttonBg} text-white text-sm font-medium font-inter-tight rounded-lg transition-colors`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {retryText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Centered error state wrapper for full-page errors
 */
export function ErrorStateFullPage({
  children,
  ...props
}: ErrorStateProps & { children?: React.ReactNode }) {
  return (
    <div className="flex-1 flex items-center justify-center">
      {children || <ErrorState {...props} />}
    </div>
  );
}
