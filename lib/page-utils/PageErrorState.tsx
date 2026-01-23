/**
 * Reusable error state component for pages
 * Consistent error UI across all pages
 */

import Link from "next/link";

export interface PageErrorStateProps {
  /** Error message to display */
  message: string;

  /** Optional action button text */
  actionLabel?: string;

  /** Optional action button href */
  actionHref?: string;

  /** Optional callback for action button */
  onAction?: () => void;

  /** Optional custom className for the container */
  className?: string;
}

/**
 * Page-level error state component
 * Use when a page fails to load data
 */
export function PageErrorState({
  message,
  actionLabel = "Go to Dashboard",
  actionHref = "/dashboard",
  onAction,
  className = "min-h-screen",
}: PageErrorStateProps) {
  const handleAction = () => {
    if (onAction) {
      onAction();
    }
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center gap-6 max-w-md text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to Load
          </h2>
          <p className="text-gray-600 text-sm">{message}</p>
        </div>

        {onAction ? (
          <button
            onClick={handleAction}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {actionLabel}
          </button>
        ) : (
          <Link
            href={actionHref}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {actionLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
